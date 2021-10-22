const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
let notesData = require("./db/db.json");
const uuid = require("./helpers/uuid");

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const readFromFile = util.promisify(fs.readFile);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    notesData = JSON.parse(data);
    res.json(notesData);
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const newNote = { title, text, id: uuid() };
  notesData.push(newNote);
  const noteString = JSON.stringify(notesData);
  fs.writeFile(`./db/db.json`, noteString, (err) =>
    err ? console.error(err) : console.log("Success!")
  );
  res.status(201).json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notesData = notesData.filter((remove) => remove.id !== id);
  const noteString = JSON.stringify(notesData);
  fs.writeFile(`./db/db.json`, noteString, (err) =>
    err ? console.error(err) : console.log("Success!")
  );
  res.status(201).json(notesData);
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(process.env.PORT || PORT, () => console.log(`Now listening at http://localhost:${PORT}`));