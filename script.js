document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("main-header");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section, #home");
  
  const mpesaForm = document.getElementById("mpesaForm");
  const mpesaStatus = document.getElementById("mpesaStatus");
  const mpesaSubmitBtn = document.getElementById("mpesaSubmitBtn");

  // YOUR RENDER BACKEND ADRESS HOOK
  const BACKEND_API_URL = "https://onrender.com";

  // 1. DYNAMIC NAV SCROLL TRANSITION
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 2. SCROLL SPY FUNCTIONALITY (AUTO LINK LIGHT-UP)
  const spyOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("data-sec") === id) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, spyOptions);

  sections.forEach((section) => spyObserver.observe(section));

  // 3. CONTACT FORM AJAX CONTROLLER (SMART SIMULATOR FALLBACK)
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending Inquiry...";
      formStatus.textContent = "";
      formStatus.className = "form-status";

      // Auto-detects if user is running on fallback placeholder mode
      if (contactForm.action.includes("PLACEHOLDER_ID")) {
        console.warn("Using placeholder Formspree ID. Falling back to clean UI sandbox simulator...");
        
        setTimeout(() => {
          formStatus.textContent = "✅ Thank you! Your inquiry has been submitted successfully (Demo Mode).";
          formStatus.className = "form-status success";
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit Inquiry";
          contactForm.reset();
        }, 1500);
        
      } else {
        // Automatically runs live request actions if real ID token exists
        try {
          const response = await fetch(contactForm.action, {
            method: contactForm.method,
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            formStatus.textContent = "✅ Thank you! Your inquiry has been submitted successfully.";
            formStatus.className = "form-status success";
            contactForm.reset();
          } else {
            const data = await response.json();
            formStatus.textContent = data.errors ? data.errors.map(e => e.message).join(", ") : "❌ Submission error.";
            formStatus.className = "form-status error";
          }
        } catch (error) {
          formStatus.textContent = "❌ Error connecting to web servers.";
          formStatus.className = "form-status error";
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit Inquiry";
        }
      }
    });
  }

  // 4. M-PESA SMART STK PUSH CONNECTOR (SMART SIMULATOR FALLBACK)
  if (mpesaForm) {
    mpesaForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const phone = document.getElementById("mpesaPhone").value.trim();
      const amount = document.getElementById("mpesaAmount").value.trim();
      
      mpesaSubmitBtn.disabled = true;
      mpesaSubmitBtn.textContent = "Connecting...";
      mpesaStatus.className = "mpesa-status-message processing";
      mpesaStatus.innerHTML = "🔄 Contacting backend processing cluster...";

      try {
        const response = await fetch(BACKEND_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, amount })
        });

        const data = await response.json();

        if (response.ok && data.ResponseCode === "0") {
          mpesaStatus.className = "mpesa-status-message success";
          mpesaStatus.innerHTML = `🔔 <b>STK PIN Prompt Dispatched!</b> Check phone interface for popup prompting to pay KES ${amount}.`;
          mpesaForm.reset();
        } else {
          throw new Error(data.customerMessage || "Connection failed.");
        }

      } catch (error) {
        // Fallback flow: Executes simulated STK push sequences when server instance is sleeping/inactive
        console.warn("Live backend unreachable. Redirecting to layout simulation...");
        mpesaStatus.innerHTML = "🔄 Handshaking secure development sandbox tunnel...";
        
        setTimeout(() => {
          mpesaStatus.innerHTML = `📱 Dispatching mock STK PIN Request of KES ${amount} to device ${phone}...`;
          
          setTimeout(() => {
            mpesaStatus.className = "mpesa-status-message success";
            mpesaStatus.innerHTML = "🔔 [DEMO MODE] <b>STK Push Sim-Delivered!</b> Once your Render backend is deployed, this form will trigger real phone popups.";
            mpesaSubmitBtn.disabled = false;
            mpesaSubmitBtn.textContent = "Send Prompt to Phone";
            mpesaForm.reset();
          }, 2000);
        }, 1500);
      }
    });
  }
});
