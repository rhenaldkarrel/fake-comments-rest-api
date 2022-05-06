const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");

// Initial configs
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* 
GET /comments -> list all comments
POST /comments -> Create a new comment
GET /comments/:id -> Get one comment (using ID)
PATCH /comments/:id -> Update one comment
DELETE /comments/:id -> Destroy one comment 
*/

// Initial fake data
let comments = [
	{
		id: uuid(),
		username: "Todd",
		text: "This is Todd's comment",
	},
	{
		id: uuid(),
		username: "Angel",
		text: "This is Angel's comment",
	},
	{
		id: uuid(),
		username: "Savier",
		text: "This is Savier's comment",
	},
];

// Routes
app.get("/comments", (req, res) => {
	res.render("comments/index", { comments });
});

app.get("/comments/new", (req, res) => {
	res.render("comments/form");
});

app.post("/comments", (req, res) => {
	const { username, text } = req.body;
	const comment = { username, text, id: uuid() };
	comments.push(comment);
	res.redirect("/comments");
});

app.get("/comments/:id/edit", (req, res) => {
	const { id } = req.params;
	const comment = comments.find((comment) => comment.id === id);
	res.render("comments/edit", { comment });
});

app.delete("/comments/:id", (req, res) => {
	const { id } = req.params;
	comments = comments.filter((comment) => comment.id !== id);
	res.redirect("/comments");
});

app.patch("/comments/:id", (req, res) => {
	const { id } = req.params;
	const newComment = req.body.text;
	const currComment = comments.find((comment) => comment.id === id);
	currComment.text = newComment;
	res.redirect("/comments");
});

app.get("/comments/:id", (req, res) => {
	const { id } = req.params;
	const comment = comments.find((comment) => comment.id === id);
	if (comment) {
		res.render("comments/show", { comment });
	} else {
		res.render("comments/404", { id });
	}
});

// Start server
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
