const express = require("express");
const app = new express();
const PORT = 8000;
const cors = require("cors");
require('dotenv').config()

const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

// this tells express we are using EJS as template enginer
app.set("view engine", "ejs");
// should be before the CRUD handlers
app.use(bodyParser.urlencoded({ extended: true }));
// this tells express to accept JSON Data
app.use(bodyParser.json());
// serving css files
app.use(express.static("public"));
// use cors
app.use(cors());

//console.log(app);

let dbConnectionStr = process.env.DB_STRING

MongoClient.connect(dbConnectionStr,  { useUnifiedTopology: true })

  .then((client) => {
    // ... do something here

    //if (err) return console.error(err)
    console.log("Connected to Database");
    const db = client.db("anectodes-stories");
    const storiesCollection = db.collection("stories");

    // handle the home page
    // app.get('/', (req,res) => {
    //   //res.send('Hello World')
    //   res.sendFile(__dirname + '/index.html')
    // })

    // handling Create / post method on the form
    app.post("/stories", (req, res) => {
      storiesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.log(error));

      console.log(req.body);
    });

    // handling Read / get method on the form
    app.get("/", (req, res) => {
      db.collection("stories")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { stories: results });
        })
        .catch((error) => console.log(error));
    });

    app.put("/stories", (req, res) => {
      storiesCollection
        .findOneAndUpdate(
          { Author: "Mohamed" },          
          {
            $set: {
              Author: req.body.Author,
              Story: req.body.Story,
            }
          },
          {
            upsert: false
          }
        )
        .then((result) => res.json("Success"))
        .catch((error) => console.error(error));

      // console.log(req.body)
    });

    app.delete("/stories", (req, res) => {
      storiesCollection
        .deleteOne({
          Author: req.body.Author,
        })
        .then((result) => {
          res.json("Deleted Nomans story");
        })
        .catch((error) => console.log(error));
    });

    app.listen(process.env.PORT || PORT, () => {
      console.log(`Listening on Port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
