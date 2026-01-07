const CONTACT = {
  email: "your.email@example.com",
  phone: "7483427243",
  whatsappPhoneE164: "7483427243",
  linkedinUrl: "https://www.linkedin.com/in/virekh-talwar-7408a6191/",
  githubUrl: "https://github.com/VirekhTalwar",
};

const EMAILJS = {
  serviceId: "service_zkhcagp",
  templateId: "",
  publicKey: "",
};

function qs(sel, parent = document) {
  return parent.querySelector(sel);
}

function qsa(sel, parent = document) {
  return Array.from(parent.querySelectorAll(sel));
}

function setTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }

  localStorage.setItem("theme", theme);
  renderThemeUi(theme);
}

function getPreferredTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function renderThemeUi(theme) {
  const themeText = qs("#themeText");
  const themeIcon = qs("#themeIcon");
  if (themeText) themeText.textContent = theme === "light" ? "Dark" : "Light";

  if (themeIcon) {
    themeIcon.innerHTML = "";
    const iconName = theme === "light" ? "moon" : "sun";
    const i = document.createElement("i");
    i.setAttribute("data-lucide", iconName);
    themeIcon.appendChild(i);
    if (window.lucide) window.lucide.createIcons();
  }
}

function initLenis() {
  if (!window.Lenis) return;

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const lenis = new window.Lenis({
    duration: 1.1,
    smoothWheel: true,
    smoothTouch: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function initAos() {
  if (!window.AOS) return;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.AOS.init({
    once: true,
    duration: 750,
    easing: "ease-out-cubic",
    disable: reduce,
  });
}

function initIcons() {
  if (!window.lucide) return;

  qsa("[data-icon]").forEach((el) => {
    const name = el.getAttribute("data-icon");
    if (!name) return;
    el.innerHTML = `<i data-lucide="${name}"></i>`;
  });

  window.lucide.createIcons();
}

function initMobileNav() {
  const toggle = qs("#navToggle");
  const links = qs("#navLinks");
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    links.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.contains("is-open");
    if (isOpen) close();
    else open();
  });

  qsa("a.nav__link", links).forEach((a) => {
    a.addEventListener("click", () => close());
  });

  document.addEventListener("click", (e) => {
    if (!links.classList.contains("is-open")) return;
    const t = e.target;
    if (!(t instanceof Node)) return;
    if (links.contains(t) || toggle.contains(t)) return;
    close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function initActiveNav() {
  const navLinks = qsa(".nav__link");
  const sections = navLinks
    .map((a) => {
      const id = a.getAttribute("href");
      if (!id || !id.startsWith("#")) return null;
      const el = qs(id);
      if (!el) return null;
      return { a, el };
    })
    .filter(Boolean);

  if (!sections.length) return;

  const clear = () => navLinks.forEach((a) => a.classList.remove("is-active"));

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
      if (!visible.length) return;
      const top = visible[0].target;
      const match = sections.find((s) => s.el === top);
      if (!match) return;
      clear();
      match.a.classList.add("is-active");
    },
    {
      root: null,
      rootMargin: "-35% 0px -55% 0px",
      threshold: [0.15, 0.25, 0.4, 0.55],
    },
  );

  sections.forEach((s) => observer.observe(s.el));
}

function initContact() {
  const whatsappLink = qs("#whatsappLink");
  const linkedinLink = qs("#linkedinLink");
  const githubLink = qs("#githubLink");
  const phoneLink = qs("#phoneLink");
  const emailLink = qs("#emailLink");
  const emailText = qs("#emailText");
  const phoneText = qs("#phoneText");

  const email = CONTACT.email;
  if (emailText) emailText.textContent = email ? email : "Open mail client";

  if (emailLink) {
    if (email) emailLink.href = `mailto:${encodeURIComponent(email)}`;
    else emailLink.href = "#";
  }

  if (linkedinLink) {
    linkedinLink.href = CONTACT.linkedinUrl || "#";
  }

  if (githubLink) {
    githubLink.href = CONTACT.githubUrl || "#";
  }

  if (phoneLink) {
    const phone = (CONTACT.phone || "").replace(/\s+/g, "");
    const digitsOnly = phone.replace(/\D+/g, "");
    phoneLink.href = digitsOnly ? `tel:${digitsOnly}` : "#";
    if (phoneText) phoneText.textContent = digitsOnly ? digitsOnly : "Call";
  }

  if (whatsappLink) {
    const phone = (CONTACT.whatsappPhoneE164 || "").replace(/\s+/g, "");
    if (phone) {
      const msg = encodeURIComponent("Hi Virekh, I found your portfolio and would like to connect.");
      const digitsOnly = phone.replace(/\D+/g, "");
      const waNumber = digitsOnly.startsWith("91") ? digitsOnly : `91${digitsOnly}`;
      whatsappLink.href = `https://wa.me/${waNumber}?text=${msg}`;
    } else {
      whatsappLink.href = "#";
    }
  }

  const form = qs("#contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = qs("#name")?.value?.trim() || "";
    const subject = qs("#subject")?.value?.trim() || "";
    const message = qs("#message")?.value?.trim() || "";

    const fullSubject = name ? `${subject} — ${name}` : subject;

    const hasEmailJs =
      typeof window.emailjs !== "undefined" &&
      EMAILJS.serviceId &&
      EMAILJS.templateId &&
      EMAILJS.publicKey;

    const fallbackToMailto = () => {
      if (!email) {
        alert("Set your email in script.js (CONTACT.email) to enable email fallback.");
        return;
      }
      const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(message)}`;
      window.location.href = mailto;
    };

    if (!hasEmailJs) {
      fallbackToMailto();
      return;
    }

    try {
      window.emailjs.init({ publicKey: EMAILJS.publicKey });
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending...";
      }

      window.emailjs
        .send(EMAILJS.serviceId, EMAILJS.templateId, {
          from_name: name,
          subject: fullSubject,
          message,
          reply_to: email || "",
        })
        .then(
          () => {
            alert("Message sent successfully!");
            form.reset();
          },
          () => {
            alert("EmailJS failed to send. Falling back to mail app.");
            fallbackToMailto();
          },
        )
        .finally(() => {
          if (btn) {
            btn.disabled = false;
            btn.textContent = "Send Email";
          }
        });
    } catch {
      fallbackToMailto();
    }
  });
}

function initThemeToggle() {
  const btn = qs("#themeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    setTheme(current === "light" ? "dark" : "light");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  qs("#year").textContent = String(new Date().getFullYear());

  setTheme(getPreferredTheme());
  initThemeToggle();

  initIcons();
  initAos();
  initLenis();

  initMobileNav();
  initActiveNav();
  initContact();
});
