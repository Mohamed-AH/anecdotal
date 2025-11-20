# Changelog

All notable changes to the Anecdotal project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-20

### 🎉 Major Release - OAuth Authentication

This release introduces a complete authentication system, transforming Anecdotal into a full-featured literary platform with user accounts and profiles.

### ✨ Added

#### Authentication & Authorization
- **OAuth 2.0 Integration** - Secure sign-in with Google and GitHub
- **User Profiles** - Personalized profile pages for each writer
- **Pen Names** - Support for pseudonyms separate from real names
- **Session Management** - Persistent sessions with MongoDB store (14-day expiry)
- **Ownership Control** - Users can only edit/delete their own stories
- **Authentication Middleware** - Secure route protection and authorization checks

#### User Interface
- **Login Page** - Beautiful OAuth login page with branded buttons
- **Profile Page** - User profile with avatar, bio, statistics, and story collection
- **User Menu** - Dropdown navigation in all pages for quick access
- **Author Attribution** - Automatic story attribution to authenticated users
- **Responsive Modals** - Pen name editing and story editing modals

#### Technical Improvements
- **Passport.js Integration** - OAuth strategy management
- **Express Session** - Secure session handling with HttpOnly cookies
- **MongoDB v5 Upgrade** - Updated from v4 for connect-mongo compatibility
- **RESTful API Updates** - New authentication and profile endpoints
- **Environment Configuration** - Comprehensive environment variable setup

#### Documentation
- **OAuth Setup Guide** (`OAUTH_SETUP.md`) - Complete step-by-step configuration guide
- **Updated README** - Comprehensive documentation with auth features
- **API Documentation** - Updated endpoints with authentication requirements
- **Changelog** - This changelog file for tracking releases

### 🔄 Changed

#### Breaking Changes
- **Write Page** - Removed manual author input field (now uses authenticated user)
- **API Routes** - POST `/api/stories` now requires authentication
- **Author Field** - Automatically populated from user's pen name or real name

#### User Experience
- **Navigation** - All pages now show user menu when logged in
- **Story Ownership** - Edit/delete buttons only visible on own stories
- **Author Display** - Shows pen name preference throughout the platform

#### Technical Changes
- **Database Schema** - Added `userId` and `userEmail` fields to stories
- **Session Storage** - Sessions stored in MongoDB instead of memory
- **Security** - Added CSRF protection and secure cookies

### 🐛 Fixed
- **Text Formatting** - Story line breaks and paragraphs now display correctly
- **MongoDB Compatibility** - Resolved peer dependency conflicts with MongoDB v5

### 🎨 Styling
- **Authentication Styles** - 594 lines of new CSS for auth components
- **OAuth Buttons** - Brand-colored buttons (Google blue, GitHub black)
- **User Avatars** - Circular avatars with rust-colored borders
- **Dropdown Animations** - Smooth transitions for user menu
- **Responsive Design** - Mobile-friendly auth pages and profiles

### 📦 Dependencies

#### Added
- `passport@^0.7.0` - Authentication middleware
- `passport-google-oauth20@^2.0.0` - Google OAuth strategy
- `passport-github2@^0.1.12` - GitHub OAuth strategy
- `express-session@^1.18.2` - Session management
- `connect-mongo@^5.1.0` - MongoDB session store

#### Updated
- `mongodb@^4.x` → `mongodb@^5.9.2` - Major version upgrade

### 🔒 Security
- **OAuth 2.0** - Industry-standard authentication
- **Secure Sessions** - HttpOnly, secure cookies in production
- **Environment Variables** - Sensitive data protected via environment variables
- **Authorization Middleware** - Ownership verification for story operations
- **Session Secrets** - Cryptographically secure session encryption

### 📝 Migration Notes

#### For Existing Users
- **Anonymous Stories** - Pre-authentication stories remain as-is without userId
- **No Data Loss** - All existing stories are preserved
- **Backward Compatibility** - Existing stories display normally

#### For Developers
- **Environment Setup** - New OAuth credentials required (see OAUTH_SETUP.md)
- **API Changes** - Write endpoints now require authentication
- **Database Migration** - No migration needed; new fields added organically

### 🌐 Deployment

#### New Requirements
- **OAuth Apps** - Must configure Google and GitHub OAuth applications
- **Environment Variables** - 7 new variables (see `.env.example`)
- **Session Secret** - Minimum 32-character random string required
- **Production URLs** - Separate OAuth apps for development and production

---

## [1.0.0] - 2025-01-01

### Initial Release

The first version of Anecdotal - a literary platform for creative writers.

### Added
- **Landing Page** - Featured stories and platform introduction
- **Stories Page** - Browse all stories with search and filtering
- **Write Page** - Distraction-free writing interface with live preview
- **Story Management** - Create, edit, and delete stories
- **Search & Filter** - Find stories by author, content, or tags
- **Literary Design** - Custom typography with Crimson Pro, Literata, and Cormorant Garamond
- **Responsive Design** - Mobile-first approach with smooth animations
- **MongoDB Integration** - Cloud-based data storage
- **RESTful API** - Complete CRUD operations for stories

### Design Features
- Ink & Parchment color palette
- Typewriter effect on landing page
- Fade-in animations
- Auto-save drafts functionality
- Character counter
- Story preview modal

---

## Links

- [Repository](https://github.com/Mohamed-AH/anecdotal)
- [OAuth Setup Guide](./OAUTH_SETUP.md)
- [README](./README.md)

---

**Note**: This changelog will be updated with each release. For detailed commit history, see the [Git log](https://github.com/Mohamed-AH/anecdotal/commits).
