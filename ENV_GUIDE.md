# Environment Variables Guide

Complete reference for all environment variables used in Anecdotal.

## Quick Start

```bash
# Copy the example file
cp .env.example .env

# Generate a session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Edit .env with your values
nano .env  # or use your preferred editor
```

---

## Required Variables

### Database

#### `DB_STRING`
- **Required**: Yes
- **Type**: String (MongoDB connection URI)
- **Description**: MongoDB Atlas or local MongoDB connection string
- **Example**: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/anecdotes-stories?retryWrites=true&w=majority`
- **Where to Get**:
  1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create a free cluster
  3. Click "Connect" → "Connect your application"
  4. Copy the connection string
  5. Replace `<password>` with your database password

---

### Server Configuration

#### `PORT`
- **Required**: No (defaults to 8000)
- **Type**: Number
- **Description**: Port number for the Express server
- **Default**: 8000
- **Example**: `8000`
- **Note**: Deployment platforms (Render, Railway) automatically set this

#### `NODE_ENV`
- **Required**: Yes
- **Type**: String (`development` | `production`)
- **Description**: Application environment mode
- **Default**: `development`
- **Example**:
  - Development: `development`
  - Production: `production`
- **Impact**:
  - `development`: Detailed error messages, non-secure cookies allowed
  - `production`: Generic error messages, secure cookies enforced

---

### Session & Security

#### `SESSION_SECRET`
- **Required**: Yes
- **Type**: String (minimum 32 characters)
- **Description**: Secret key for encrypting session data
- **Security**: ⚠️ **CRITICAL** - Must be random and secure in production
- **Example**: `a8f5f167f44f4964e6c998dee827110c3e1f8a0c9f5e7b3c2d1a0e9f8d7c6b5a`
- **How to Generate**:
  ```bash
  # Node.js method
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

  # OpenSSL method
  openssl rand -hex 32

  # Online generator
  # Visit: https://www.random.org/strings/ (64 chars, hex)
  ```
- **Important**:
  - ✅ DO: Use different secrets for dev and production
  - ✅ DO: Rotate periodically in production
  - ❌ DON'T: Commit this to version control
  - ❌ DON'T: Share this publicly
  - ❌ DON'T: Use weak or predictable values

---

### OAuth - Google

#### `GOOGLE_CLIENT_ID`
- **Required**: Yes (for Google OAuth)
- **Type**: String
- **Description**: OAuth 2.0 client ID from Google Cloud Console
- **Example**: `123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com`
- **Where to Get**: See [OAUTH_SETUP.md](./OAUTH_SETUP.md#google-oauth-setup)
- **Quick Steps**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a project
  3. Enable Google+ API
  4. Create OAuth 2.0 credentials
  5. Copy Client ID

#### `GOOGLE_CLIENT_SECRET`
- **Required**: Yes (for Google OAuth)
- **Type**: String
- **Description**: OAuth 2.0 client secret from Google Cloud Console
- **Example**: `GOCSPX-1234567890abcdefghijklmnop`
- **Security**: ⚠️ **SENSITIVE** - Keep this secret
- **Where to Get**: Same as Client ID (appears after creating credentials)
- **Important**:
  - ❌ DON'T: Commit to version control
  - ❌ DON'T: Expose in client-side code
  - ✅ DO: Use different credentials for dev and production

---

### OAuth - GitHub

#### `GITHUB_CLIENT_ID`
- **Required**: Yes (for GitHub OAuth)
- **Type**: String
- **Description**: OAuth app client ID from GitHub
- **Example**: `Iv1.a1b2c3d4e5f6g7h8`
- **Where to Get**: See [OAUTH_SETUP.md](./OAUTH_SETUP.md#github-oauth-setup)
- **Quick Steps**:
  1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
  2. Click "OAuth Apps" → "New OAuth App"
  3. Fill in details
  4. Copy Client ID

#### `GITHUB_CLIENT_SECRET`
- **Required**: Yes (for GitHub OAuth)
- **Type**: String
- **Description**: OAuth app client secret from GitHub
- **Example**: `1234567890abcdef1234567890abcdef12345678`
- **Security**: ⚠️ **SENSITIVE** - Keep this secret
- **Where to Get**: Generate after creating OAuth app
- **Important**:
  - ❌ DON'T: Commit to version control
  - ❌ DON'T: Share publicly
  - ✅ DO: Create separate apps for dev and production

---

### Application URLs

#### `DEVELOPMENT_URL`
- **Required**: Yes
- **Type**: String (URL)
- **Description**: Base URL for development environment
- **Default**: `http://localhost:8000`
- **Example**: `http://localhost:8000`
- **Usage**: Used for OAuth callback URLs in development
- **Important**: Must match port in `PORT` variable

#### `PRODUCTION_URL`
- **Required**: Yes (in production)
- **Type**: String (URL)
- **Description**: Base URL for production environment
- **Example**: `https://anecdotal.onrender.com`
- **Usage**: Used for OAuth callback URLs in production
- **Important**:
  - Must use HTTPS in production
  - Must match your deployed domain
  - Update OAuth app callback URLs to match

---

## Environment-Specific Configurations

### Local Development

```env
# Database
DB_STRING=mongodb://localhost:27017/anecdotes-stories
PORT=8000
NODE_ENV=development

# Session
SESSION_SECRET=dev_secret_key_not_for_production_12345678901234567890

# OAuth (Development apps)
GOOGLE_CLIENT_ID=your_dev_google_client_id
GOOGLE_CLIENT_SECRET=your_dev_google_client_secret
GITHUB_CLIENT_ID=your_dev_github_client_id
GITHUB_CLIENT_SECRET=your_dev_github_client_secret

# URLs
DEVELOPMENT_URL=http://localhost:8000
PRODUCTION_URL=http://localhost:8000
```

### Production (Render.com)

```env
# Database
DB_STRING=mongodb+srv://user:pass@cluster.mongodb.net/anecdotes-stories
NODE_ENV=production

# Session (Generate secure random string!)
SESSION_SECRET=your_production_secret_32_chars_minimum_random_secure

# OAuth (Production apps)
GOOGLE_CLIENT_ID=your_prod_google_client_id
GOOGLE_CLIENT_SECRET=your_prod_google_client_secret
GITHUB_CLIENT_ID=your_prod_github_client_id
GITHUB_CLIENT_SECRET=your_prod_github_client_secret

# URLs
PRODUCTION_URL=https://your-app.onrender.com

# Note: PORT is automatically set by Render
```

---

## Validation Checklist

Before running the application, verify:

- [ ] All required variables are set
- [ ] `SESSION_SECRET` is at least 32 characters
- [ ] `SESSION_SECRET` is different between dev and production
- [ ] MongoDB connection string is correct
- [ ] OAuth callback URLs match environment URLs
- [ ] `.env` file is in `.gitignore`
- [ ] No spaces around `=` in variable assignments
- [ ] No quotes around values (unless value contains spaces)

---

## Common Issues

### Issue: "Cannot connect to MongoDB"
**Solution**:
- Check `DB_STRING` is correct
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Issue: "Redirect URI mismatch" (Google)
**Solution**:
- Check `DEVELOPMENT_URL` or `PRODUCTION_URL` matches
- Verify callback URL in Google Cloud Console: `{URL}/auth/google/callback`
- Ensure no trailing slashes

### Issue: "Invalid client" (GitHub)
**Solution**:
- Verify you're using correct app (dev vs production)
- Check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` match
- Ensure callback URL in GitHub settings: `{URL}/auth/github/callback`

### Issue: "Session not persisting"
**Solution**:
- Check `SESSION_SECRET` is set and valid
- Verify MongoDB connection is working
- In production, ensure `NODE_ENV=production`

### Issue: "Environment variable not loading"
**Solution**:
- Verify `.env` file is in root directory
- Check for typos in variable names
- Ensure no spaces around `=`
- Restart the server after changes

---

## Security Best Practices

### 🔒 Production Security

1. **Never commit `.env` files**
   ```bash
   # Already in .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Use strong session secrets**
   - Minimum 32 characters
   - Cryptographically random
   - Different for each environment
   - Rotate periodically

3. **Separate OAuth apps**
   - Development apps for local testing
   - Production apps for live site
   - Different credentials for each

4. **HTTPS in production**
   - Always use `https://` in `PRODUCTION_URL`
   - Enable secure cookies automatically

5. **Restrict OAuth callback URLs**
   - Only add URLs you control
   - Remove unused callback URLs

### 🔍 Monitoring

- Regularly review OAuth app activity
- Monitor for unauthorized access attempts
- Check session expiry is working (14 days)
- Verify HTTPS is enforced in production

---

## Testing Your Configuration

```bash
# Test database connection
node -e "require('dotenv').config(); const {MongoClient} = require('mongodb'); new MongoClient(process.env.DB_STRING).connect().then(() => console.log('✅ MongoDB connected')).catch(err => console.error('❌ MongoDB error:', err.message))"

# Check all variables are loaded
node -e "require('dotenv').config(); console.log('DB_STRING:', process.env.DB_STRING ? '✅ Set' : '❌ Missing'); console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Set' : '❌ Missing'); console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing')"

# Start the server and check logs
npm run dev
```

---

## Additional Resources

- [OAUTH_SETUP.md](./OAUTH_SETUP.md) - Complete OAuth setup guide
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [GitHub Developer Settings](https://github.com/settings/developers)
- [dotenv Documentation](https://github.com/motdotla/dotenv)

---

**Last Updated**: 2025-01-20
**Anecdotal Version**: 2.0.0
