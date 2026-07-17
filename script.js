/* Harinivevektha Anandan — portfolio interactions */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const loader = document.querySelector(".intro-loader");
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const progress = document.querySelector(".scroll-progress span");
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  // Opening transition
  window.setTimeout(() => loader?.classList.add("loaded"), 700);

  // Mobile menu
  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.classList.toggle("active");
    navLinks?.classList.toggle("open", isOpen);
    body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton?.classList.remove("active");
      navLinks.classList.remove("open");
      body.classList.remove("menu-open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  // Scroll progress
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? window.scrollY / scrollable : 0;
    if (progress) progress.style.transform = `scaleX(${value})`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  // Gentle reveal animation
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px" }
  );

  document.querySelectorAll(".reveal").forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });

  // Project category filter
  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;
      projectCards.forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden-card", !shouldShow);
      });
    });
  });

  // Certificate lightbox
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxCaption = lightbox?.querySelector("figcaption");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");
  let lastTrigger = null;

  const closeLightbox = () => {
    lightbox?.classList.remove("open");
    if (lightbox) lightbox.inert = true;
    body.classList.remove("lightbox-open");
    lastTrigger?.focus();
  };

  document.querySelectorAll(".lightbox-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      lastTrigger = button;
      if (lightboxImage) lightboxImage.src = button.dataset.image;
      if (lightboxCaption) lightboxCaption.textContent = button.dataset.caption;
      if (lightbox) lightbox.inert = false;
      lightbox?.classList.add("open");
      body.classList.add("lightbox-open");
      lightboxClose?.focus();
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox?.classList.contains("open")) {
      closeLightbox();
    }
  });

  // Desktop custom cursor
  if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorRing) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll("a, button, .project-card").forEach((element) => {
      element.addEventListener("mouseenter", () => cursorRing.classList.add("hovering"));
      element.addEventListener("mouseleave", () => cursorRing.classList.remove("hovering"));
    });
  }
});
