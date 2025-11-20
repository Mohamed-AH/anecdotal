// Authentication middleware

// Check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  // For API requests, return JSON error
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({
      success: false,
      errors: ['Authentication required']
    });
  }

  // For page requests, redirect to login
  res.redirect('/login');
}

// Check if user owns the resource (for stories)
function isOwner(storiesCollection) {
  return async (req, res, next) => {
    if (!req.isAuthenticated()) {
      if (req.path.startsWith('/api/')) {
        return res.status(401).json({
          success: false,
          errors: ['Authentication required']
        });
      }
      return res.redirect('/login');
    }

    const storyId = req.params.id;
    const { ObjectId } = require('mongodb');

    if (!ObjectId.isValid(storyId)) {
      return res.status(400).json({
        success: false,
        errors: ['Invalid story ID']
      });
    }

    try {
      const story = await storiesCollection.findOne({ _id: new ObjectId(storyId) });

      if (!story) {
        return res.status(404).json({
          success: false,
          errors: ['Story not found']
        });
      }

      // Check if user owns this story
      if (!story.userId || story.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          errors: ['You do not have permission to modify this story']
        });
      }

      // Attach story to request for use in route handler
      req.story = story;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({
        success: false,
        errors: ['Server error during authorization']
      });
    }
  };
}

// Optional authentication (makes user available but doesn't require login)
function optionalAuth(req, res, next) {
  // User will be available at req.user if logged in, otherwise null
  next();
}

// Inject user into all templates
function injectUser(req, res, next) {
  res.locals.user = req.user || null;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
}

module.exports = {
  isAuthenticated,
  isOwner,
  optionalAuth,
  injectUser
};
