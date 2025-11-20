# Contributing to Anecdotal

First off, thank you for considering contributing to Anecdotal! It's people like you that make Anecdotal a great platform for writers. ✨

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [How to Contribute](#how-to-contribute)
5. [Style Guidelines](#style-guidelines)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Reporting Bugs](#reporting-bugs)
9. [Suggesting Enhancements](#suggesting-enhancements)

---

## Code of Conduct

This project and everyone participating in it is governed by common sense and mutual respect. By participating, you are expected to uphold this standard. Please:

- Be welcoming to newcomers
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### Types of Contributions We're Looking For

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 Design enhancements
- ♿ Accessibility improvements
- 🌍 Internationalization (i18n)
- ⚡ Performance optimizations
- 🧪 Tests

---

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- Git
- Code editor (VS Code recommended)
- Google and GitHub OAuth apps (for auth testing)

### Installation

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/anecdotal.git
   cd anecdotal
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Mohamed-AH/anecdotal.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your MongoDB connection string and OAuth credentials
   ```

5. **Set up OAuth (required for testing)**
   - See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed instructions
   - You'll need Google and GitHub OAuth apps for development

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:8000
   ```

---

## How to Contribute

### Finding Something to Work On

- Check the [Issues](https://github.com/Mohamed-AH/anecdotal/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Check the [Future Enhancements](./README.md#-future-enhancements) section
- Have an idea? Open an issue to discuss it first!

### Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the style guidelines below
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   - Test locally on different screen sizes
   - Test all affected features
   - Ensure OAuth login still works
   - Check browser console for errors

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add user bookmarking feature"
   ```

5. **Keep your fork updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill in the PR template
   - Link related issues

---

## Style Guidelines

### JavaScript

- **Use ES6+ features** - Arrow functions, const/let, template literals, async/await
- **No semicolons** - Follow the existing codebase convention
- **2-space indentation**
- **camelCase** for variables and functions
- **PascalCase** for classes
- **Descriptive names** - `getUserStories()` not `getStuff()`

**Good:**
```javascript
const fetchUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId)
    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}
```

**Avoid:**
```javascript
function get(id) {
  return User.findById(id).then((u) => { return u; }).catch((e) => { console.log(e); });
}
```

### CSS

- **Use CSS Variables** - Defined in `:root` for consistency
- **BEM-like naming** - `.story-card`, `.story-card__header`, `.story-card--featured`
- **2-space indentation**
- **Group related properties** - Box model → positioning → typography → visual
- **Mobile-first** - Base styles for mobile, media queries for larger screens

**Good:**
```css
.story-card {
  /* Box model */
  padding: var(--spacing-lg);
  border: 2px solid var(--light-border);
  border-radius: var(--radius-md);

  /* Typography */
  font-family: var(--font-body);

  /* Visual */
  background: white;
  transition: all 0.3s ease;
}
```

### HTML/EJS

- **Semantic HTML** - Use `<article>`, `<section>`, `<nav>`, etc.
- **Accessible** - Include ARIA labels, alt text, proper heading hierarchy
- **Indentation** - 2 spaces
- **Comments** - Section dividers for major parts

```html
<!-- Story Grid -->
<section class="stories-grid">
  <% stories.forEach(story => { %>
    <article class="story-card">
      <h2 class="story-title"><%= story.title %></h2>
    </article>
  <% }); %>
</section>
```

---

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation only changes
- `style` - Formatting, missing semicolons, etc. (not CSS)
- `refactor` - Code changes that neither fix bugs nor add features
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Build process, dependencies, etc.

### Examples

```
feat(auth): add password reset functionality

Implements password reset via email with secure tokens.
Tokens expire after 1 hour for security.

Closes #123
```

```
fix(stories): preserve line breaks in story text

Added white-space: pre-wrap to story text elements to
properly display paragraphs and line breaks.

Fixes #456
```

```
docs(readme): update OAuth setup instructions

Added troubleshooting section for common redirect URI
mismatch errors.
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of your code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] Tested on desktop and mobile
- [ ] No console errors or warnings
- [ ] OAuth login still works (if applicable)

### PR Template

When you open a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Related Issues
Closes #123, Fixes #456

## Testing
How did you test this?

## Screenshots (if applicable)
Before/after screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Documentation updated
- [ ] Tested on desktop and mobile
- [ ] No console errors
```

### Review Process

1. **Automated checks** - Ensure they pass
2. **Code review** - Maintainers will review your code
3. **Changes requested** - Address feedback if any
4. **Approval** - Once approved, your PR will be merged!

### After Your PR is Merged

- Delete your feature branch
- Update your local main branch
- Celebrate! 🎉

```bash
git checkout main
git pull upstream main
git branch -d feature/your-feature-name
```

---

## Reporting Bugs

### Before Submitting a Bug Report

- Check the [existing issues](https://github.com/Mohamed-AH/anecdotal/issues)
- Try to reproduce the bug in the latest version
- Collect information about your environment

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g. macOS 12]
- Browser: [e.g. Chrome 108]
- Node version: [e.g. 18.12.0]
- MongoDB version: [if relevant]

**Additional Context**
Any other relevant information
```

---

## Suggesting Enhancements

### Before Submitting

- Check if the enhancement is already suggested
- Consider if it fits the project's scope and goals
- Think about how it benefits most users

### Enhancement Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other approaches you've thought about

**Additional context**
Mockups, examples, or other context

**Would you like to implement this?**
Yes/No - If yes, maintainers can guide you
```

---

## Questions?

- **General questions** - Open a [Discussion](https://github.com/Mohamed-AH/anecdotal/discussions)
- **Bug reports** - Open an [Issue](https://github.com/Mohamed-AH/anecdotal/issues)
- **Feature ideas** - Open an [Issue](https://github.com/Mohamed-AH/anecdotal/issues) with `enhancement` label

---

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes (for significant contributions)
- README acknowledgments (for major features)

---

Thank you for contributing to Anecdotal! Your efforts help writers share their stories with the world. ✍️

---

**Happy Contributing!**
