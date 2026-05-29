/* ============================================================
   Vasu Singh — Portfolio
   Section navigation, mobile sidebar, card tilt,
   contact form, accent switcher
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Section navigation (scroll + click) ---------- */
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  const sections = document.querySelectorAll(".section");
  const aside = document.querySelector(".aside");

  function setActiveNav(id) {
    document.querySelectorAll(".nav .nav-link").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-section") === id);
    });
  }

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveNav(id);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const id = this.getAttribute("data-section");
      if (!id) return;
      e.preventDefault();
      scrollToSection(id);
      if (aside.classList.contains("open")) closeAside();
    });
  });

  /* Highlight nav link for the section in view while scrolling */
  let scrollTicking = false;
  function updateActiveOnScroll() {
    const offset = window.innerHeight * 0.35;
    let current = sections[0]?.id;
    sections.forEach((section) => {
      if (section.offsetTop - offset <= window.scrollY) {
        current = section.id;
      }
    });
    if (current) setActiveNav(current);
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          updateActiveOnScroll();
          scrollTicking = false;
        });
      }
    },
    { passive: true }
  );

  updateActiveOnScroll();

  /* ---------- Mobile sidebar open/close ---------- */
  const navToggler = document.querySelector(".nav-toggler");

  function openAside() {
    aside.classList.add("open");
    navToggler.innerHTML = '<i class="fas fa-times"></i>';
  }
  function closeAside() {
    aside.classList.remove("open");
    navToggler.innerHTML = '<i class="fas fa-bars"></i>';
  }
  if (navToggler) {
    navToggler.addEventListener("click", () => {
      aside.classList.contains("open") ? closeAside() : openAside();
    });
  }

  /* ---------- Card 3D tilt on mousemove ---------- */
  const tiltCards = document.querySelectorAll(".card");
  const MAX_TILT = 6;

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateY(${x * MAX_TILT}deg) rotateX(${-y * MAX_TILT}deg) translateY(-3px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ---------- Contact form ---------- */
  // TODO: To send emails silently in-page, create a free Formspree form
  // (https://formspree.io) pointed at mailvasusingh@gmail.com and replace
  // the placeholder below with your endpoint, e.g. 'https://formspree.io/f/xxxxxxxx'.
  // While left as the placeholder, the form gracefully falls back to a
  // pre-filled mailto: link in the visitor's email client.
  const FORMSPREE_ENDPOINT = 'YOUR_FORMSPREE_ENDPOINT';

  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  const submitBtn = document.getElementById("cf-submit");

  function setNote(message, type) {
    formNote.textContent = message;
    formNote.className = "form-note" + (type ? " " + type : "");
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.dataset.label = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    } else {
      submitBtn.disabled = false;
      if (submitBtn.dataset.label) submitBtn.innerHTML = submitBtn.dataset.label;
    }
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !subject || !message) {
        setNote("Please fill in all fields.", "error");
        return;
      }

      // Fallback: no Formspree endpoint configured -> open mail client.
      if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT === "YOUR_FORMSPREE_ENDPOINT") {
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        window.location.href =
          `mailto:mailvasusingh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setNote("Opening your email client...", "success");
        form.reset();
        return;
      }

      setLoading(true);
      setNote("", "");

      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })
        .then((res) => {
          setLoading(false);
          if (res.ok) {
            form.reset();
            setNote("Thanks — your message has been sent. I'll be in touch soon.", "success");
          } else {
            setNote("Something went wrong. Please email me directly.", "error");
          }
        })
        .catch(() => {
          setLoading(false);
          setNote("Network error. Please email me directly.", "error");
        });
    });
  }

  /* ---------- Accent switcher (re-imagined skin switcher) ---------- */
  const themeSwitcher = document.getElementById("themeSwitcher");
  const themeToggler = document.getElementById("themeToggler");
  const swatches = document.querySelectorAll(".swatch");
  const root = document.documentElement;

  if (themeToggler) {
    themeToggler.addEventListener("click", () => themeSwitcher.classList.toggle("open"));
  }

  function applyAccent(accent, accentDim) {
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-dim", accentDim);
  }

  const savedAccent = localStorage.getItem("vs-accent");
  const savedAccentDim = localStorage.getItem("vs-accent-dim");
  if (savedAccent && savedAccentDim) {
    applyAccent(savedAccent, savedAccentDim);
    swatches.forEach((s) =>
      s.classList.toggle("active", s.getAttribute("data-accent") === savedAccent)
    );
  }

  swatches.forEach((swatch) => {
    swatch.addEventListener("click", function () {
      const accent = this.getAttribute("data-accent");
      const accentDim = this.getAttribute("data-accent-dim");
      applyAccent(accent, accentDim);
      localStorage.setItem("vs-accent", accent);
      localStorage.setItem("vs-accent-dim", accentDim);
      swatches.forEach((s) => s.classList.remove("active"));
      this.classList.add("active");
    });
  });
})();
