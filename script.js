/* ==========================================
   PRODUCTION-GRADE LOGIC FOR YOUTH EMPOWERMENT CBO
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('main-header');
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main, section');

  // 1. Dynamic Header Scroll Effect (Adds shadows smoothly)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // 2. Navigation Link Highlighting (Scroll Spy Tracking)
    let currentSectionId = 'home';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute('data-sec') === currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });

  // 3. Smooth Inter-Section Page Navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId === '#' ? 'main' : targetId);
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - (header.offsetHeight - 5);
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 4. Clean Direct Submission Handler
  if (form) {
    form.addEventListener('submit', () => {
      // Change the button text visually right before it safely leaves your site to Formspree
      submitBtn.disabled = true;
      submitBtn.innerText = 'Sending Request...';
      submitBtn.style.opacity = '0.6';
    });
  }
});
