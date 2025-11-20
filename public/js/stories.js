// Stories Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
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

  // Modal handling
  const modal = document.getElementById('edit-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const editForm = document.getElementById('edit-form');

  // Edit story
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const storyId = this.getAttribute('data-id');
      const author = this.getAttribute('data-author');
      const story = this.getAttribute('data-story');
      const tags = this.getAttribute('data-tags');

      document.getElementById('edit-story-id').value = storyId;
      document.getElementById('edit-author').value = author;
      document.getElementById('edit-story').value = story;
      document.getElementById('edit-tags').value = tags;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeModalBtn.addEventListener('click', closeModal);
  cancelEditBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle edit form submission
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const storyId = document.getElementById('edit-story-id').value;
    const author = document.getElementById('edit-author').value;
    const story = document.getElementById('edit-story').value;
    const tags = document.getElementById('edit-tags').value;

    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PUT',
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
        // Success - reload page
        window.location.reload();
      } else {
        // Show errors
        alert('Error: ' + (data.errors ? data.errors.join(', ') : 'Failed to update story'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update story. Please try again.');
    }
  });

  // Delete story
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const storyId = this.getAttribute('data-id');

      if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
        return;
      }

      try {
        const response = await fetch(`/api/stories/${storyId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          // Remove the story card with animation
          const card = this.closest('.story-card-full');
          card.style.animation = 'fadeOut 0.3s ease';

          setTimeout(() => {
            card.remove();

            // Check if any stories left
            const remainingStories = document.querySelectorAll('.story-card-full');
            if (remainingStories.length === 0) {
              window.location.reload();
            }
          }, 300);
        } else {
          alert('Error: ' + (data.errors ? data.errors.join(', ') : 'Failed to delete story'));
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete story. Please try again.');
      }
    });
  });

  // Auto-submit search on input (with debounce)
  const searchInput = document.querySelector('.search-input');
  let searchTimeout;

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (this.value.length >= 3 || this.value.length === 0) {
          this.form.submit();
        }
      }, 500);
    });
  }
});

// Fade out animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }
`;
document.head.appendChild(style);
