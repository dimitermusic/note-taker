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