const express = require("express");
const app = express();
const PORT = 8000;
const cors = require("cors");
require('dotenv').config();

const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

// Set view engine
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

// Input validation helper
const validateStoryInput = (author, story) => {
  const errors = [];

  if (!author || author.trim().length === 0) {
    errors.push("Author name is required");
  } else if (author.trim().length > 100) {
    errors.push("Author name must be less than 100 characters");
  }

  if (!story || story.trim().length === 0) {
    errors.push("Story content is required");
  } else if (story.trim().length < 10) {
    errors.push("Story must be at least 10 characters long");
  } else if (story.trim().length > 5000) {
    errors.push("Story must be less than 5000 characters");
  }

  return errors;
};

// Sanitize input
const sanitizeInput = (text) => {
  return text.trim().replace(/[<>]/g, '');
};

let dbConnectionStr = process.env.DB_STRING;

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    console.log("✅ Connected to Database");
    const db = client.db("anecdotes-stories");
    const storiesCollection = db.collection("stories");

    // ===== ROUTES =====

    // Landing page
    app.get("/", (req, res) => {
      storiesCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray()
        .then((featuredStories) => {
          storiesCollection.countDocuments().then((totalStories) => {
            res.render("landing.ejs", {
              featuredStories,
              totalStories
            });
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).render("error.ejs", { message: "Failed to load stories" });
        });
    });

    // Stories gallery page
    app.get("/stories", (req, res) => {
      const searchQuery = req.query.search || "";
      const sortBy = req.query.sort || "newest";

      let query = {};
      if (searchQuery) {
        query = {
          $or: [
            { Author: { $regex: searchQuery, $options: 'i' } },
            { Story: { $regex: searchQuery, $options: 'i' } },
            { tags: { $regex: searchQuery, $options: 'i' } }
          ]
        };
      }

      let sortOption = { createdAt: -1 };
      if (sortBy === "oldest") sortOption = { createdAt: 1 };
      if (sortBy === "author") sortOption = { Author: 1 };

      storiesCollection
        .find(query)
        .sort(sortOption)
        .toArray()
        .then((results) => {
          res.render("stories.ejs", {
            stories: results,
            searchQuery,
            sortBy
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).render("error.ejs", { message: "Failed to load stories" });
        });
    });

    // Write page
    app.get("/write", (req, res) => {
      res.render("write.ejs");
    });

    // Create new story
    app.post("/api/stories", (req, res) => {
      const { Author, Story, tags } = req.body;

      const errors = validateStoryInput(Author, Story);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors
        });
      }

      const newStory = {
        Author: sanitizeInput(Author),
        Story: sanitizeInput(Story),
        tags: tags ? sanitizeInput(tags) : "",
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0
      };

      storiesCollection
        .insertOne(newStory)
        .then((result) => {
          res.json({
            success: true,
            message: "Story created successfully",
            storyId: result.insertedId
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            success: false,
            errors: ["Failed to create story"]
          });
        });
    });

    // Update story by ID
    app.put("/api/stories/:id", (req, res) => {
      const { id } = req.params;
      const { Author, Story, tags } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          errors: ["Invalid story ID"]
        });
      }

      const errors = validateStoryInput(Author, Story);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors
        });
      }

      storiesCollection
        .findOneAndUpdate(
          { _id: new ObjectId(id) },
          {
            $set: {
              Author: sanitizeInput(Author),
              Story: sanitizeInput(Story),
              tags: tags ? sanitizeInput(tags) : "",
              updatedAt: new Date()
            }
          },
          { returnDocument: 'after' }
        )
        .then((result) => {
          if (!result.value) {
            return res.status(404).json({
              success: false,
              errors: ["Story not found"]
            });
          }
          res.json({
            success: true,
            message: "Story updated successfully"
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            success: false,
            errors: ["Failed to update story"]
          });
        });
    });

    // Delete story by ID
    app.delete("/api/stories/:id", (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          errors: ["Invalid story ID"]
        });
      }

      storiesCollection
        .deleteOne({ _id: new ObjectId(id) })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.status(404).json({
              success: false,
              errors: ["Story not found"]
            });
          }
          res.json({
            success: true,
            message: "Story deleted successfully"
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({
            success: false,
            errors: ["Failed to delete story"]
          });
        });
    });

    // Get story statistics
    app.get("/api/stats", (req, res) => {
      Promise.all([
        storiesCollection.countDocuments(),
        storiesCollection.distinct("Author")
      ])
        .then(([totalStories, authors]) => {
          res.json({
            totalStories,
            totalWriters: authors.length
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: "Failed to fetch stats" });
        });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).render("error.ejs", {
        message: "Page not found"
      });
    });

    app.listen(process.env.PORT || PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });
