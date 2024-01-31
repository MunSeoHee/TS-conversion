const express = require("express");
var compile = require("json-schema-to-typescript");
var GenerateSchema = require("generate-schema");
var bodyParser = require("body-parser");
var shiki = require("shiki");
const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.urlencoded({extended: true}));
app.set("port", process.env.PORT || 8080);

app.get("/", (req, res) => {
	res.render("index", {ts: "", tt: ""});
});

app.post("/", (req, res) => {
	var json = JSON.parse(req.body.content);
	json = json.aData;
	const jsonSchema = GenerateSchema.json("", json);
	compile
		.compile(jsonSchema, "schema", {
			bannerComment: "",
			additionalProperties: false,
		})
		.then((ts) => {
			shiki
				.getHighlighter({
					theme: "material-theme-darker",
				})
				.then((highlighter) => {
					tt = ts.replace("export interface Schema {", "");
					tt = tt.replace(/(\.\s+)/g, "");
					tt = tt.slice(0, -1);
					tt = "### Response \n ```" + tt + "\n```";

					res.render("index", {
						ts: highlighter.codeToHtml(ts, {
							lang: "js",
						}),
						tt: JSON.stringify(tt),
					});
				});
		});
});

app.listen(app.get("port"), () => {
	console.log(app.get("port"), "번 포트에서 대기 중");
});
