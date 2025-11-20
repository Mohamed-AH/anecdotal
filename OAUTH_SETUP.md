# OAuth Authentication Setup Guide

This guide will walk you through setting up Google and GitHub OAuth authentication for Anecdotal.

## Prerequisites

- Node.js and npm installed
- MongoDB instance (local or cloud)
- A deployed or local instance of your app

## Table of Contents

1. [Environment Variables Setup](#environment-variables-setup)
2. [Google OAuth Setup](#google-oauth-setup)
3. [GitHub OAuth Setup](#github-oauth-setup)
4. [Testing Authentication](#testing-authentication)
5. [Troubleshooting](#troubleshooting)

---

## Environment Variables Setup

First, copy the `.env.example` file to create your `.env` file:

```bash
cp .env.example .env
```

You'll need to fill in the following OAuth-related variables:

```env
# Session secret (generate a random 32+ character string)
SESSION_SECRET=your_random_secret_key_minimum_32_characters_long

# Google OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth credentials
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Application URLs
DEVELOPMENT_URL=http://localhost:8000
PRODUCTION_URL=https://your-app.onrender.com
```

### Generating a Session Secret

Generate a secure random session secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `SESSION_SECRET`.

---

## Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "Anecdotal Auth")
5. Click **"Create"**

### Step 2: Enable Google+ API

1. In your project, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Choose **"External"** user type
3. Click **"Create"**
4. Fill in the required fields:
   - **App name**: Anecdotal
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**
6. On the **Scopes** page, click **"Save and Continue"** (we don't need additional scopes)
7. On the **Test users** page (optional), add your email for testing
8. Click **"Save and Continue"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. Choose **"Web application"**
4. Fill in the details:
   - **Name**: Anecdotal Web Client
   - **Authorized JavaScript origins**:
     - For local development: `http://localhost:8000`
     - For production: `https://your-app.onrender.com`
   - **Authorized redirect URIs**:
     - For local development: `http://localhost:8000/auth/google/callback`
     - For production: `https://your-app.onrender.com/auth/google/callback`
5. Click **"Create"**
6. Copy the **Client ID** and **Client Secret**
7. Paste them into your `.env` file:
   ```env
   GOOGLE_CLIENT_ID=your_copied_client_id
   GOOGLE_CLIENT_SECRET=your_copied_client_secret
   ```

### Important Notes for Google OAuth:

- You can add multiple redirect URIs (both local and production)
- Keep your client secret secure and never commit it to version control
- If you change domains, update the authorized URIs

---

## GitHub OAuth Setup

### Step 1: Register a New OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"**

### Step 2: Fill in Application Details

#### For Local Development:

- **Application name**: Anecdotal (Development)
- **Homepage URL**: `http://localhost:8000`
- **Application description**: A literary platform for creative writers (optional)
- **Authorization callback URL**: `http://localhost:8000/auth/github/callback`

#### For Production:

Create a separate OAuth app for production:

- **Application name**: Anecdotal
- **Homepage URL**: `https://your-app.onrender.com`
- **Application description**: A literary platform for creative writers (optional)
- **Authorization callback URL**: `https://your-app.onrender.com/auth/github/callback`

### Step 3: Get Your Credentials

1. After creating the app, you'll see your **Client ID** on the app page
2. Click **"Generate a new client secret"**
3. Copy both the **Client ID** and **Client Secret**
4. Paste them into your `.env` file:
   ```env
   GITHUB_CLIENT_ID=your_copied_client_id
   GITHUB_CLIENT_SECRET=your_copied_client_secret
   ```

### Important Notes for GitHub OAuth:

- GitHub requires separate OAuth apps for different domains (unlike Google)
- Create one app for local development and one for production
- Use the appropriate credentials in each environment
- Keep your client secret secure

---

## Testing Authentication

### Local Testing

1. Make sure all environment variables are set in your `.env` file
2. Start your MongoDB instance
3. Run your application:
   ```bash
   npm start
   ```
4. Navigate to `http://localhost:8000/login`
5. Try signing in with Google and GitHub
6. Check that you're redirected to the home page after authentication
7. Verify that your user menu appears in the navigation
8. Visit `/profile` to see your profile page

### Production Testing

1. Deploy your application to Render.com (or your hosting provider)
2. Set environment variables in your hosting dashboard:
   - `SESSION_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `NODE_ENV=production`
   - `PRODUCTION_URL=https://your-app.onrender.com`
3. Navigate to your production URL + `/login`
4. Test authentication with both providers

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Redirect URI mismatch" (Google)

**Solution**: Make sure the redirect URI in your Google Cloud Console exactly matches the one your app is using:
- Check for `http` vs `https`
- Check for trailing slashes
- Verify the port number for local development

#### Issue: "The redirect_uri MUST match the registered callback URL" (GitHub)

**Solution**:
- Verify you're using the correct OAuth app (development vs production)
- Check that the callback URL in GitHub settings exactly matches your app's URL
- Remember GitHub OAuth apps are domain-specific

#### Issue: "Invalid client" errors

**Solution**:
- Double-check that you've copied the client ID and secret correctly
- Ensure there are no extra spaces or newlines in your `.env` file
- Verify you're using credentials from the correct environment (dev vs prod)

#### Issue: Session not persisting after authentication

**Solution**:
- Check that `SESSION_SECRET` is set and is at least 32 characters long
- Verify MongoDB connection is working
- In production, ensure `NODE_ENV` is set to `production`
- Check that cookies are enabled in your browser

#### Issue: "Error: Failed to fetch user profile" (Google)

**Solution**:
- Make sure the Google+ API is enabled in your Google Cloud Console
- Check that your OAuth consent screen is properly configured
- Verify the scopes include `profile` and `email`

#### Issue: User data not saving to database

**Solution**:
- Check MongoDB connection string is correct
- Verify the database name is correct
- Check server logs for database errors
- Ensure the `users` collection has proper write permissions

### Environment-Specific Issues

#### Development Environment:

- Use `http://localhost:8000` (not `127.0.0.1`)
- Make sure the port matches your server configuration
- Check that MongoDB is running locally or accessible

#### Production Environment:

- Always use `https://` for production URLs
- Set `NODE_ENV=production` in environment variables
- Use production-specific OAuth credentials
- Enable secure cookies in production
- Check that your domain is properly configured

---

## Security Best Practices

1. **Never commit secrets**: Keep `.env` file out of version control (it's already in `.gitignore`)
2. **Use different credentials**: Use separate OAuth apps for development and production
3. **Rotate secrets**: Periodically regenerate your session secret and OAuth credentials
4. **HTTPS in production**: Always use HTTPS for production applications
5. **Secure cookies**: In production, cookies should be secure and httpOnly (already configured)
6. **Monitor OAuth apps**: Regularly check your Google Cloud and GitHub OAuth apps for suspicious activity

---

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [Express Session Documentation](https://github.com/expressjs/session)

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check the server logs for detailed error messages
2. Verify all environment variables are correctly set
3. Review the callback URLs in both OAuth provider settings and your code
4. Create an issue in the GitHub repository with:
   - Error messages (remove sensitive data)
   - Environment (development/production)
   - Steps to reproduce
   - What you've already tried

---

**Last Updated**: 2025-01-20
**Anecdotal Version**: 2.0.0 (with OAuth)
