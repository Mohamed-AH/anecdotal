const express = require("express");
const app = express();
const PORT = 8000;
const cors = require("cors");
require('dotenv').config();

const bodyParser = require("body-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MongoClient, ObjectId } = require("mongodb");
const { isAuthenticated, isOwner, injectUser } = require('./middleware/auth');

// Set view engine
app.set("view engine", "ejs");

// Trust first proxy (required for Render, Railway, Heroku, etc.)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL,
  credentials: true
}));

// Input validation helper
const validateStoryInput = (story) => {
  const errors = [];

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
  return text ? text.trim().replace(/[<>]/g, '') : '';
};

let dbConnectionStr = process.env.DB_STRING;

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    console.log("✅ Connected to Database");

    // Debug: Log environment configuration
    console.log("\n🔍 Environment Configuration:");
    console.log("NODE_ENV:", process.env.NODE_ENV || "NOT SET");
    console.log("DEVELOPMENT_URL:", process.env.DEVELOPMENT_URL || "NOT SET");
    console.log("PRODUCTION_URL:", process.env.PRODUCTION_URL || "NOT SET");
    console.log("SESSION_SECRET:", process.env.SESSION_SECRET ? "✅ Set" : "❌ NOT SET");
    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ NOT SET");
    console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ NOT SET");
    console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID ? "✅ Set" : "❌ NOT SET");
    console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET ? "✅ Set" : "❌ NOT SET");

    const callbackURL = (process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_URL : process.env.DEVELOPMENT_URL);
    console.log("\n🔗 OAuth Callback URLs will be:");
    console.log("Google:", `${callbackURL}/auth/google/callback`);
    console.log("GitHub:", `${callbackURL}/auth/github/callback\n`);

    const db = client.db("anecdotes-stories");
    const storiesCollection = db.collection("stories");
    const usersCollection = db.collection("users");

    // Session configuration
    const sessionConfig = {
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: client,
        dbName: 'anecdotes-stories',
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60 // 14 days
      }),
      cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax'
      }
    };

    console.log("\n🍪 Session Configuration:");
    console.log("Cookie secure:", sessionConfig.cookie.secure);
    console.log("Cookie httpOnly:", sessionConfig.cookie.httpOnly);
    console.log("Cookie sameSite:", sessionConfig.cookie.sameSite);
    console.log("Trust proxy:", app.get('trust proxy'), "\n");

    app.use(session(sessionConfig));

    // Initialize Passport
    const passport = require('./config/passport')(db);
    app.use(passport.initialize());
    app.use(passport.session());

    // Make user available in all templates
    app.use(injectUser);

    // ===== AUTHENTICATION ROUTES =====

    // Login page
    app.get("/login", (req, res) => {
      if (req.isAuthenticated()) {
        return res.redirect('/');
      }
      res.render("login.ejs");
    });

    // Google OAuth
    app.get("/auth/google", (req, res, next) => {
      console.log("🔵 Initiating Google OAuth...");
      passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
    });

    app.get("/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }),
      (req, res) => {
        console.log("✅ Google OAuth successful");
        console.log("User:", req.user?.email);
        console.log("Session ID:", req.sessionID);
        console.log("Is Authenticated:", req.isAuthenticated());
        res.redirect("/");
      }
    );

    // GitHub OAuth
    app.get("/auth/github", (req, res, next) => {
      console.log("🔵 Initiating GitHub OAuth...");
      passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
    });

    app.get("/auth/github/callback",
      passport.authenticate("github", { failureRedirect: "/login" }),
      (req, res) => {
        console.log("✅ GitHub OAuth successful");
        console.log("User:", req.user?.email || req.user?.name);
        console.log("Session ID:", req.sessionID);
        console.log("Is Authenticated:", req.isAuthenticated());
        res.redirect("/");
      }
    );

    // Logout
    app.get("/auth/logout", (req, res) => {
      req.logout((err) => {
        if (err) {
          console.error('Logout error:', err);
        }
        res.redirect("/");
      });
    });

    // Get current user info (API)
    app.get("/api/auth/user", (req, res) => {
      if (req.isAuthenticated()) {
        res.json({
          success: true,
          user: {
            id: req.user._id,
            name: req.user.name,
            penName: req.user.penName,
            email: req.user.email,
            avatar: req.user.avatar,
            provider: req.user.provider
          }
        });
      } else {
        res.json({
          success: false,
          user: null
        });
      }
    });

    // ===== PAGE ROUTES =====

    // Landing page
    app.get("/", (req, res) => {
      console.log("🏠 Landing page accessed");
      console.log("Session ID:", req.sessionID);
      console.log("Is Authenticated:", req.isAuthenticated());
      console.log("User:", req.user ? req.user.email || req.user.name : "Not logged in");

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

    // Write page (requires authentication)
    app.get("/write", isAuthenticated, (req, res) => {
      res.render("write.ejs");
    });

    // User profile page
    app.get("/profile", isAuthenticated, async (req, res) => {
      try {
        const userStories = await storiesCollection
          .find({ userId: req.user._id })
          .sort({ createdAt: -1 })
          .toArray();

        res.render("profile.ejs", {
          profileUser: req.user,
          stories: userStories,
          isOwnProfile: true
        });
      } catch (error) {
        console.error(error);
        res.status(500).render("error.ejs", { message: "Failed to load profile" });
      }
    });

    // Public profile page
    app.get("/profile/:userId", async (req, res) => {
      try {
        const { userId } = req.params;

        if (!ObjectId.isValid(userId)) {
          return res.status(404).render("error.ejs", { message: "User not found" });
        }

        const profileUser = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!profileUser) {
          return res.status(404).render("error.ejs", { message: "User not found" });
        }

        const userStories = await storiesCollection
          .find({ userId: new ObjectId(userId) })
          .sort({ createdAt: -1 })
          .toArray();

        const isOwnProfile = req.isAuthenticated() && req.user._id.toString() === userId;

        res.render("profile.ejs", {
          profileUser,
          stories: userStories,
          isOwnProfile
        });
      } catch (error) {
        console.error(error);
        res.status(500).render("error.ejs", { message: "Failed to load profile" });
      }
    });

    // Update user profile
    app.post("/api/profile", isAuthenticated, async (req, res) => {
      try {
        const { penName } = req.body;

        if (!penName || penName.trim().length === 0) {
          return res.status(400).json({
            success: false,
            errors: ["Pen name is required"]
          });
        }

        if (penName.trim().length > 100) {
          return res.status(400).json({
            success: false,
            errors: ["Pen name must be less than 100 characters"]
          });
        }

        await usersCollection.updateOne(
          { _id: req.user._id },
          { $set: { penName: sanitizeInput(penName) } }
        );

        res.json({
          success: true,
          message: "Profile updated successfully"
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          errors: ["Failed to update profile"]
        });
      }
    });

    // ===== STORY API ROUTES =====

    // Create new story (requires authentication)
    app.post("/api/stories", isAuthenticated, async (req, res) => {
      const { Story, tags } = req.body;

      const errors = validateStoryInput(Story);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors
        });
      }

      const newStory = {
        Author: req.user.penName || req.user.name, // Use pen name if set
        Story: sanitizeInput(Story),
        tags: tags ? sanitizeInput(tags) : "",
        userId: req.user._id,
        userEmail: req.user.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0
      };

      try {
        const result = await storiesCollection.insertOne(newStory);

        // Update user's story count
        await usersCollection.updateOne(
          { _id: req.user._id },
          { $inc: { storiesCount: 1 } }
        );

        res.json({
          success: true,
          message: "Story created successfully",
          storyId: result.insertedId
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          errors: ["Failed to create story"]
        });
      }
    });

    // Update story by ID (requires ownership)
    app.put("/api/stories/:id", isOwner(storiesCollection), async (req, res) => {
      const { id } = req.params;
      const { Story, tags } = req.body;

      const errors = validateStoryInput(Story);
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          errors
        });
      }

      try {
        await storiesCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              Author: req.user.penName || req.user.name, // Update to current pen name
              Story: sanitizeInput(Story),
              tags: tags ? sanitizeInput(tags) : "",
              updatedAt: new Date()
            }
          }
        );

        res.json({
          success: true,
          message: "Story updated successfully"
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          errors: ["Failed to update story"]
        });
      }
    });

    // Delete story by ID (requires ownership)
    app.delete("/api/stories/:id", isOwner(storiesCollection), async (req, res) => {
      const { id } = req.params;

      try {
        await storiesCollection.deleteOne({ _id: new ObjectId(id) });

        // Update user's story count
        await usersCollection.updateOne(
          { _id: req.user._id },
          { $inc: { storiesCount: -1 } }
        );

        res.json({
          success: true,
          message: "Story deleted successfully"
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          errors: ["Failed to delete story"]
        });
      }
    });

    // Get story statistics
    app.get("/api/stats", (req, res) => {
      Promise.all([
        storiesCollection.countDocuments(),
        usersCollection.countDocuments()
      ])
        .then(([totalStories, totalWriters]) => {
          res.json({
            totalStories,
            totalWriters
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
