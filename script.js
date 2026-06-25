document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main, section');

    // 1. Dynamic Sticky Header Animation Shadow Box
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 2. Active Scroll Link Synchronization Tracking
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

    // 3. Native Smooth Inter-Link Scroll Target Alignment
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

    // 4. Async AJAX Formspree Transmission Engine Interceptor
    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault();
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending Request...";
            status.innerText = "";
            
            const data = new FormData(event.target);
            
            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    status.innerHTML = "Success! Your message was sent.";
                    status.style.color = "#16a34a"; // Success Green Tone
                    form.reset();
                } else {
                    const responseData = await response.json();
                    status.innerHTML = responseData.errors ? responseData.errors.map(err => err.message).join(", ") : "Oops! Problem submitting form.";
                    status.style.color = "#dc2626"; // Error Red Tone
                }
            } catch (error) {
                status.innerHTML = "Oops! There was a network connection error.";
                status.style.color = "#dc2626"; // Error Red Tone
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = "Submit Inquiry";
            }
        });
    }
});
