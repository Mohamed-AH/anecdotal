// Typewriter effect
class Typewriter {
  constructor(element, text, speed = 50) {
    this.element = element;
    this.text = text;
    this.speed = speed;
    this.index = 0;
    this.isDeleting = false;
  }

  type() {
    const current = this.text.substring(0, this.index);
    this.element.textContent = current;

    if (!this.isDeleting && this.index < this.text.length) {
      this.index++;
      setTimeout(() => this.type(), this.speed);
    } else if (this.isDeleting && this.index > 0) {
      this.index--;
      setTimeout(() => this.type(), this.speed / 2);
    }
  }

  start() {
    setTimeout(() => this.type(), 500);
  }
}

// Initialize typewriter on page load
document.addEventListener('DOMContentLoaded', () => {
  const typewriterEl = document.querySelector('.typewriter');
  if (typewriterEl) {
    const text = typewriterEl.getAttribute('data-text');
    const typewriter = new Typewriter(typewriterEl, text, 60);
    typewriter.start();
  }

  // Intersection Observer for fade-in animations
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

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add subtle parallax effect to hero
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
          hero.style.transform = `translateY(${scrolled * 0.3}px)`;
          hero.style.opacity = 1 - (scrolled / 800);
        }
        ticking = false;
      });
      ticking = true;
    }
  });
});
