const express = require("express");
const path = require("path");
const fs = require ("fs");
const util= require("util");
const notes = require("./db.json");
const uuid =require ("uuid");
const {DH_CHECK_P_NOT_SAFE_PRIME} = require ("constants");

//setting up server
const app =express();
//acknowledge server
const PORT = process.env.PORT || 3001;


//Body Parse middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//static middleware
app.use(express.static("./public"));

//API Route | "GET" request - data is saved and then join to db json
app.get("/api/notes", function(req,res) {
  res.sendFile(path.join(__dirname,"./db.json"));
   
});

//API Route\ "POST" request
app.post("/api/notes", function (req, res) {
  const notes =JSON.parse(fs.readFileSync("./db.json"));
  const newNotes =req.body;
  newNotes.id = uuid.v4();
  notes.push(newNotes);
  fs.writeFileSync("./db.json", JSON.stringify(notes))
  res.json(notes);
});

//API Route\ "delete" request
app.delete("/api/notes/:id", function(req, res) {
  const notes = JSON.parse(fs.readFileSync("./db.json"));
  const deleteNotes = notes.filter((rmvNotes) => rmvNotes.id !== req. params.id);
  fs.writeFileSync ("./db.json",JSON.stringify(deleteNotes));
  res.json(deleteNotes);
});

  
//HTML route
app.get("/notes", function(req,res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));

});

app.get ("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
 
app.get ("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Listening
app.listen(PORT, () => { console.log ("App listening on PORT" +PORT);
});
