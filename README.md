# ✍️ Anecdotal

> **A literary sanctuary for creative writers to share anecdotes, micro-stories, and moments that matter.**

Anecdotal is a modern, beautifully designed platform where writers can craft, publish, and discover compelling short-form narratives. Built with a distinctive literary aesthetic, it provides an inspiring space for storytellers to share their voice with the world.

## 🌟 Features

### Authentication & Profiles
- **OAuth 2.0 Sign-In** - Secure login with Google or GitHub
- **User Profiles** - Personalized profile pages with your stories
- **Pen Names** - Write under your real name or a pseudonym
- **Ownership Control** - Only you can edit or delete your stories
- **Persistent Sessions** - Stay logged in across visits

### For Writers
- **Distraction-Free Writing Interface** - Clean, focused environment for composing your stories
- **Automatic Author Attribution** - Stories automatically credited to your pen name
- **Live Preview** - See how your story will appear before publishing
- **Auto-Save Drafts** - Never lose your work with automatic draft saving
- **Character Counter** - Stay within the sweet spot with real-time character tracking
- **Tags & Organization** - Categorize stories for easy discovery

### For Readers
- **Advanced Search** - Find stories by author, content, or tags
- **Smart Filtering** - Sort by date or author
- **Responsive Design** - Beautiful reading experience on any device
- **Writer Profiles** - View all stories from your favorite authors
- **Story Management** - Edit or delete your own published stories

### Design Philosophy
- **Literary Aesthetic** - Distinctive typography using Crimson Pro, Literata, and Cormorant Garamond
- **Ink & Parchment Color Scheme** - Warm, inviting vintage-inspired palette
- **Smooth Animations** - Typewriter effects, fade-ins, and micro-interactions
- **Accessible** - High contrast ratios and semantic HTML throughout

## 🛠️ Tech Stack

**Frontend:**
- HTML5 & CSS3 (Modern CSS Variables & Grid/Flexbox)
- Vanilla JavaScript (ES6+)
- EJS Templating
- Google Fonts (Custom Literary Fonts)

**Backend:**
- Node.js & Express.js
- MongoDB with native driver (v5)
- RESTful API architecture
- Input validation & sanitization
- Passport.js for OAuth authentication
- Express-session with MongoDB store

**Authentication:**
- OAuth 2.0 (Google & GitHub)
- Secure session management
- CSRF protection
- HttpOnly cookies

**Development:**
- Nodemon for hot-reload
- Environment variables with dotenv
- CORS enabled

## 📁 Project Structure

```
anecdotal/
├── config/
│   └── passport.js       # Passport OAuth strategies
├── middleware/
│   └── auth.js           # Authentication middleware
├── views/
│   ├── landing.ejs       # Homepage with featured stories
│   ├── stories.ejs       # Browse all stories
│   ├── write.ejs         # Story composition page
│   ├── login.ejs         # OAuth login page
│   ├── profile.ejs       # User profile page
│   └── error.ejs         # Error page
├── public/
│   ├── css/
│   │   └── styles.css    # Complete design system + auth styles
│   └── js/
│       ├── landing.js    # Landing page interactions
│       ├── stories.js    # Browse & manage stories
│       ├── write.js      # Writing interface logic
│       └── profile.js    # Profile page interactions
├── server.js             # Express server & API routes
├── OAUTH_SETUP.md        # OAuth configuration guide
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier available)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mohamed-AH/anecdotal.git
   cd anecdotal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Database
   DB_STRING=your_mongodb_connection_string
   PORT=8000
   NODE_ENV=development

   # Session (generate a random 32+ character string)
   SESSION_SECRET=your_random_secret_key_minimum_32_characters_long

   # OAuth Credentials
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # URLs
   DEVELOPMENT_URL=http://localhost:8000
   PRODUCTION_URL=https://your-app.onrender.com
   ```

4. **Get your MongoDB connection string**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string (replace `<password>` with your actual password)
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/anecdotes-stories?retryWrites=true&w=majority`

5. **Set up OAuth authentication**

   **See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed instructions.**

   Quick overview:
   - Create a Google OAuth app at [Google Cloud Console](https://console.cloud.google.com/)
   - Create a GitHub OAuth app at [GitHub Developer Settings](https://github.com/settings/developers)
   - Add the credentials to your `.env` file
   - Configure callback URLs for your environment

6. **Run the application**

   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

6. **Open your browser**
   ```
   http://localhost:8000
   ```

## 📡 API Endpoints

### Public Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Landing page with featured stories |
| `GET` | `/stories` | Browse all stories (supports search & sort) |
| `GET` | `/login` | OAuth login page |
| `GET` | `/api/stats` | Get platform statistics |

### Authentication Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/auth/google` | Initiate Google OAuth flow |
| `GET` | `/auth/google/callback` | Google OAuth callback |
| `GET` | `/auth/github` | Initiate GitHub OAuth flow |
| `GET` | `/auth/github/callback` | GitHub OAuth callback |
| `GET` | `/auth/logout` | Logout and destroy session |

### Protected Routes (Requires Authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/write` | Story composition page |
| `GET` | `/profile` | Your profile page |
| `GET` | `/profile/:userId` | View another user's profile |
| `POST` | `/api/stories` | Create a new story |
| `PUT` | `/api/stories/:id` | Update your own story |
| `DELETE` | `/api/stories/:id` | Delete your own story |
| `POST` | `/api/profile` | Update your pen name |

### Example API Request

**Create a story (authenticated):**
```javascript
// User must be logged in
fetch('/api/stories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    Story: 'Once upon a time, in a land far away...',
    tags: 'fiction, fantasy'
  })
  // Author is automatically set from authenticated user's pen name
})
```

## 🌐 Deployment

### Recommended: Render.com (Free)

1. **Create account at [Render.com](https://render.com)**

2. **Create a new Web Service**
   - Connect your GitHub repository
   - Select branch: `main` or `master`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**
   ```env
   DB_STRING=your_mongodb_connection_string
   NODE_ENV=production
   SESSION_SECRET=your_random_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   PRODUCTION_URL=https://your-app.onrender.com
   ```
   - `PORT` will be automatically set by Render

4. **Configure OAuth for Production**
   - Update your Google OAuth app with production callback URL
   - Create a separate GitHub OAuth app for production
   - See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed steps

5. **Deploy!**
   - Render will auto-deploy on every git push

### Alternative Options

- **Railway.app** - Modern platform with great DX
- **Fly.io** - Global deployment with free tier
- **Cyclic.sh** - Unlimited free apps on AWS

### MongoDB Hosting
Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier (512MB)

## 🎨 Design System

### Color Palette
```css
--ink-black: #1a1a1a
--vintage-cream: #f5e6d3
--sepia-brown: #8b7355
--sage-green: #6b8e6b
--deep-burgundy: #6b2737
--ghost-white: #f8f8f8
```

### Typography
- **Headings:** Crimson Pro (Serif)
- **Body:** Literata (Optimized for reading)
- **Accents:** Cormorant Garamond (Elegant serif)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [x] User authentication & profiles ✨ **Completed!**
- [ ] Story bookmarking/favorites
- [ ] Comments & reactions
- [ ] Social sharing
- [ ] Reading time estimates
- [ ] Draft management system
- [ ] Rich text editor
- [ ] Story collections/series
- [ ] Email notifications
- [ ] Story statistics & analytics

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Mohamed AH**
- GitHub: [@Mohamed-AH](https://github.com/Mohamed-AH)

## 🙏 Acknowledgments

- Typography: Google Fonts
- Icons: Inline SVG (Feather Icons inspired)
- Inspiration: The power of storytelling and human connection

---

**Built with ❤️ for writers, by writers.**



