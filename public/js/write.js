// Write Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const form = document.getElementById('story-form');
  const authorInput = document.getElementById('author-input');
  const storyInput = document.getElementById('story-input');
  const tagsInput = document.getElementById('tags-input');
  const charCount = document.getElementById('char-count');
  const formMessage = document.getElementById('form-message');
  const publishBtn = document.getElementById('publish-btn');
  const previewBtn = document.getElementById('preview-btn');

  const previewModal = document.getElementById('preview-modal');
  const closePreviewBtn = document.getElementById('close-preview');
  const closePreviewBtnFooter = document.getElementById('close-preview-btn');
  const publishFromPreview = document.getElementById('publish-from-preview');

  // Fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Character counter
  storyInput.addEventListener('input', () => {
    const length = storyInput.value.length;
    charCount.textContent = `${length} / 5000`;

    if (length > 4500) {
      charCount.style.color = '#c44';
    } else if (length > 4000) {
      charCount.style.color = '#f90';
    } else {
      charCount.style.color = '';
    }
  });

  // Show message
  const showMessage = (message, isError = false) => {
    formMessage.textContent = message;
    formMessage.className = `form-message ${isError ? 'error' : 'success'}`;
    formMessage.style.display = 'block';

    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
  };

  // Preview functionality
  previewBtn.addEventListener('click', () => {
    const author = authorInput.value.trim();
    const story = storyInput.value.trim();
    const tags = tagsInput.value.trim();

    if (!author || !story) {
      showMessage('Please fill in your name and story before previewing', true);
      return;
    }

    if (story.length < 10) {
      showMessage('Story must be at least 10 characters long', true);
      return;
    }

    // Populate preview
    document.getElementById('preview-author').textContent = author;
    document.getElementById('preview-date').textContent = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    document.getElementById('preview-text').textContent = story;

    if (tags) {
      document.getElementById('preview-tags').textContent = tags;
      document.getElementById('preview-tags-container').style.display = 'flex';
    } else {
      document.getElementById('preview-tags-container').style.display = 'none';
    }

    // Show modal
    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close preview
  const closePreview = () => {
    previewModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closePreviewBtn.addEventListener('click', closePreview);
  closePreviewBtnFooter.addEventListener('click', closePreview);

  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
      closePreview();
    }
  });

  // Publish from preview
  publishFromPreview.addEventListener('click', () => {
    closePreview();
    form.requestSubmit();
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const author = authorInput.value.trim();
    const story = storyInput.value.trim();
    const tags = tagsInput.value.trim();

    // Validation
    if (!author || !story) {
      showMessage('Please fill in all required fields', true);
      return;
    }

    if (story.length < 10) {
      showMessage('Story must be at least 10 characters long', true);
      return;
    }

    if (story.length > 5000) {
      showMessage('Story must be less than 5000 characters', true);
      return;
    }

    // Disable button to prevent double submission
    publishBtn.disabled = true;
    publishBtn.innerHTML = `
      <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
      Publishing...
    `;

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Author: author,
          Story: story,
          tags: tags
        })
      });

      const data = await response.json();

      if (data.success) {
        // Success - show message and redirect
        showMessage('Story published successfully! Redirecting...');

        setTimeout(() => {
          window.location.href = '/stories';
        }, 1500);
      } else {
        // Show errors
        const errors = data.errors ? data.errors.join(', ') : 'Failed to publish story';
        showMessage(errors, true);

        // Re-enable button
        publishBtn.disabled = false;
        publishBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Publish Story
        `;
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Failed to publish story. Please try again.', true);

      // Re-enable button
      publishBtn.disabled = false;
      publishBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Publish Story
      `;
    }
  });

  // Auto-save to localStorage (optional feature)
  const AUTOSAVE_KEY = 'anecdotal_draft';

  const saveraft = () => {
    const draft = {
      author: authorInput.value,
      story: storyInput.value,
      tags: tagsInput.value,
      timestamp: Date.now()
    };
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft));
  };

  const loadDraft = () => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        // Only load if it's less than 24 hours old
        if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
          if (confirm('We found an unsaved draft. Would you like to restore it?')) {
            authorInput.value = draft.author || '';
            storyInput.value = draft.story || '';
            tagsInput.value = draft.tags || '';
            storyInput.dispatchEvent(new Event('input')); // Update char count
          }
        } else {
          localStorage.removeItem(AUTOSAVE_KEY);
        }
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
  };

  // Load draft on page load
  loadDraft();

  // Auto-save every 30 seconds
  let saveTimeout;
  [authorInput, storyInput, tagsInput].forEach(input => {
    input.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveDraft, 30000);
    });
  });

  // Clear draft after successful submission
  form.addEventListener('submit', () => {
    localStorage.removeItem(AUTOSAVE_KEY);
  });
});

// Spinner animation
const style = document.createElement('style');
style.textContent = `
  .spinner {
    animation: spin 1s linear infinite;
    width: 16px;
    height: 16px;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .btn-primary svg,
  .btn-secondary svg {
    width: 18px;
    height: 18px;
    margin-right: 0.5rem;
  }
`;
document.head.appendChild(style);
