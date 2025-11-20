// Profile Page JavaScript

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

  // User menu dropdown
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userMenuDropdown = document.getElementById('user-menu-dropdown');

  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenuDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      userMenuDropdown.classList.remove('active');
    });
  }

  // Pen Name Modal
  const penNameModal = document.getElementById('pen-name-modal');
  const editPenNameBtn = document.getElementById('edit-pen-name-btn');
  const closePenNameModal = document.getElementById('close-pen-name-modal');
  const cancelPenName = document.getElementById('cancel-pen-name');
  const penNameForm = document.getElementById('pen-name-form');

  if (editPenNameBtn) {
    editPenNameBtn.addEventListener('click', () => {
      penNameModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    closePenNameModal.addEventListener('click', closePenNameModalFn);
    cancelPenName.addEventListener('click', closePenNameModalFn);

    penNameModal.addEventListener('click', (e) => {
      if (e.target === penNameModal) {
        closePenNameModalFn();
      }
    });

    function closePenNameModalFn() {
      penNameModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Handle pen name form submission
    penNameForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const penName = document.getElementById('pen-name-input').value.trim();

      if (!penName) {
        alert('Pen name cannot be empty');
        return;
      }

      try {
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ penName })
        });

        const data = await response.json();

        if (data.success) {
          // Reload page to show updated pen name
          window.location.reload();
        } else {
          alert('Error: ' + (data.errors ? data.errors.join(', ') : 'Failed to update pen name'));
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to update pen name. Please try again.');
      }
    });
  }

  // Edit Story Modal
  const editStoryModal = document.getElementById('edit-story-modal');
  const closeEditModal = document.getElementById('close-edit-modal');
  const cancelEdit = document.getElementById('cancel-edit');
  const editStoryForm = document.getElementById('edit-story-form');

  if (editStoryModal) {
    // Edit story buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const storyId = this.getAttribute('data-id');
        const story = this.getAttribute('data-story');
        const tags = this.getAttribute('data-tags');

        document.getElementById('edit-story-id').value = storyId;
        document.getElementById('edit-story-text').value = story;
        document.getElementById('edit-story-tags').value = tags;

        editStoryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    closeEditModal.addEventListener('click', closeEditModalFn);
    cancelEdit.addEventListener('click', closeEditModalFn);

    editStoryModal.addEventListener('click', (e) => {
      if (e.target === editStoryModal) {
        closeEditModalFn();
      }
    });

    function closeEditModalFn() {
      editStoryModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Handle edit story form submission
    editStoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const storyId = document.getElementById('edit-story-id').value;
      const story = document.getElementById('edit-story-text').value;
      const tags = document.getElementById('edit-story-tags').value;

      try {
        const response = await fetch(`/api/stories/${storyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Story: story,
            tags: tags
          })
        });

        const data = await response.json();

        if (data.success) {
          // Reload page to show updated story
          window.location.reload();
        } else {
          alert('Error: ' + (data.errors ? data.errors.join(', ') : 'Failed to update story'));
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to update story. Please try again.');
      }
    });
  }

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
          const card = this.closest('.story-card-profile');
          card.style.animation = 'fadeOut 0.3s ease';

          setTimeout(() => {
            window.location.reload();
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
