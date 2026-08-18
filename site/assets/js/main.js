const header = document.querySelector("[data-site-header]");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const sections = [...document.querySelectorAll("[data-nav-section]")];
const languageLink = document.querySelector("[data-language-link]");
const revealTargets = [...document.querySelectorAll("[data-reveal]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function sectionFromHash() {
  const id = window.location.hash.slice(1);
  if (!id) return null;
  return sections.find((section) => section.id === id) || null;
}

function sectionFromLayout() {
  if (sections.length === 0) return null;

  const marker = window.innerHeight * 0.38;
  let current = sections[0];

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= marker && rect.bottom > 0) current = section;
  }

  return current;
}

function setLanguageTarget(sectionId) {
  if (!languageLink) return;

  const base = languageLink.dataset.languageBase || languageLink.getAttribute("href") || "";
  const hash = sectionId && sectionId !== "top" ? `#${sectionId}` : "";
  languageLink.setAttribute("href", base + hash);
}

function setActiveSection(section) {
  if (!section) return;

  const targetHref = `#${section.id}`;
  for (const link of navLinks) {
    if (link.getAttribute("href") === targetHref) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }

  setLanguageTarget(section.id);
}

setActiveSection(sectionFromHash() || sectionFromLayout());

if (sections.length > 0 && "IntersectionObserver" in window) {
  const navigationObserver = new IntersectionObserver(
    () => setActiveSection(sectionFromLayout()),
    {
      rootMargin: "-18% 0px -62% 0px",
      threshold: [0, 0.01]
    }
  );

  for (const section of sections) navigationObserver.observe(section);
} else {
  window.addEventListener(
    "scroll",
    () => setActiveSection(sectionFromLayout()),
    { passive: true }
  );
}

window.addEventListener("hashchange", () => {
  setActiveSection(sectionFromHash() || sectionFromLayout());
});

let headerFramePending = false;

function updateCompactHeader() {
  headerFramePending = false;
  if (header) header.classList.toggle("is-compact", window.scrollY > 48);
}

function requestHeaderUpdate() {
  if (headerFramePending) return;
  headerFramePending = true;
  window.requestAnimationFrame(updateCompactHeader);
}

updateCompactHeader();
window.addEventListener("scroll", requestHeaderUpdate, { passive: true });

let revealFallback = 0;

function revealEverything() {
  if (revealFallback) window.clearTimeout(revealFallback);
  document.documentElement.classList.remove("motion-ready");
  for (const target of revealTargets) target.classList.add("is-revealed");
}

function enableRevealObserver() {
  if (
    revealTargets.length === 0 ||
    reducedMotion.matches ||
    !("IntersectionObserver" in window)
  ) {
    revealEverything();
    return;
  }

  revealFallback = window.setTimeout(revealEverything, 6000);
  const pendingTargets = new Set();

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
        pendingTargets.delete(entry.target);
        if (pendingTargets.size === 0 && revealFallback) window.clearTimeout(revealFallback);
      }
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.08
    }
  );

  for (const target of revealTargets) {
    if (target.getBoundingClientRect().top < window.innerHeight * 0.9) {
      target.classList.add("is-revealed");
    } else {
      pendingTargets.add(target);
      revealObserver.observe(target);
    }
  }

  if (pendingTargets.size === 0 && revealFallback) window.clearTimeout(revealFallback);

  window.requestAnimationFrame(() => {
    document.documentElement.classList.add("motion-ready");
  });
}

enableRevealObserver();

if (typeof reducedMotion.addEventListener === "function") {
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) revealEverything();
  });
} else if (typeof reducedMotion.addListener === "function") {
  reducedMotion.addListener((event) => {
    if (event.matches) revealEverything();
  });
}
