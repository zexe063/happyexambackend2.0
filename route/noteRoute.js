const express = require("express")
const noteRouter  = express.Router();
const {getNotes, createNotes} = require("../controller/noteController")

noteRouter.get("/", getNotes);
noteRouter.post("/", createNotes);

module.exports = noteRouter;