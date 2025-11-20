# ✍️ Anecdotal

> **A literary sanctuary for creative writers to share anecdotes, micro-stories, and moments that matter.**

Anecdotal is a modern, beautifully designed platform where writers can craft, publish, and discover compelling short-form narratives. Built with a distinctive literary aesthetic, it provides an inspiring space for storytellers to share their voice with the world.

## 🌟 Features

### For Writers
- **Distraction-Free Writing Interface** - Clean, focused environment for composing your stories
- **Live Preview** - See how your story will appear before publishing
- **Auto-Save Drafts** - Never lose your work with automatic draft saving
- **Character Counter** - Stay within the sweet spot with real-time character tracking
- **Tags & Organization** - Categorize stories for easy discovery

### For Readers
- **Advanced Search** - Find stories by author, content, or tags
- **Smart Filtering** - Sort by date or author
- **Responsive Design** - Beautiful reading experience on any device
- **Story Management** - Edit or delete your published stories

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
- MongoDB with native driver
- RESTful API architecture
- Input validation & sanitization

**Development:**
- Nodemon for hot-reload
- Environment variables with dotenv
- CORS enabled

## 📁 Project Structure

```
anecdotal/
├── views/
│   ├── landing.ejs       # Homepage with featured stories
│   ├── stories.ejs       # Browse all stories
│   ├── write.ejs         # Story composition page
│   └── error.ejs         # Error page
├── public/
│   ├── css/
│   │   └── styles.css    # Complete design system
│   └── js/
│       ├── landing.js    # Landing page interactions
│       ├── stories.js    # Browse & manage stories
│       └── write.js      # Writing interface logic
├── server.js             # Express server & API routes
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
   DB_STRING=your_mongodb_connection_string
   PORT=8000
   ```

4. **Get your MongoDB connection string**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string (replace `<password>` with your actual password)
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/anecdotes-stories?retryWrites=true&w=majority`

5. **Run the application**

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Landing page with featured stories |
| `GET` | `/stories` | Browse all stories (supports search & sort) |
| `GET` | `/write` | Story composition page |
| `POST` | `/api/stories` | Create a new story |
| `PUT` | `/api/stories/:id` | Update a story by ID |
| `DELETE` | `/api/stories/:id` | Delete a story by ID |
| `GET` | `/api/stats` | Get platform statistics |

### Example API Request

**Create a story:**
```javascript
fetch('/api/stories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    Author: 'Jane Doe',
    Story: 'Once upon a time, in a land far away...',
    tags: 'fiction, fantasy'
  })
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
   - Add `DB_STRING` with your MongoDB connection string
   - `PORT` will be automatically set by Render

4. **Deploy!**
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

- [ ] User authentication & profiles
- [ ] Story bookmarking/favorites
- [ ] Comments & reactions
- [ ] Social sharing
- [ ] Reading time estimates
- [ ] Draft management
- [ ] Rich text editor
- [ ] Story collections/series

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



