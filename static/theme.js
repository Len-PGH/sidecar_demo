// Light/dark theme: persists in localStorage, applies before first paint
// (to avoid the dark-page flash on a light-mode reload), and wires every
// `.theme-toggle` button on the page to flip the palette.
//
// Convention: presence of `data-theme="light"` on <html> means light mode.
// Absence (or any other value) means dark — that's the original default.

(function () {
  const KEY = "brian-sidecar-theme";

  function preferred() {
    const stored = localStorage.getItem(KEY);
    if (stored === "light" || stored === "dark") return stored;
    // First visit: honor the OS-level preference if we can read it.
    return window.matchMedia?.("(prefers-color-scheme: light)").matches
      ? "light" : "dark";
  }

  function apply(theme) {
    if (theme === "light") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
  }

  // Run before first paint — the script tag in <head> is synchronous,
  // so this fires before the body even parses.
  apply(preferred());

  function wireToggles() {
    for (const btn of document.querySelectorAll(".theme-toggle")) {
      btn.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "light"
          ? "dark" : "light";
        localStorage.setItem(KEY, next);
        apply(next);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireToggles);
  } else {
    wireToggles();
  }
})();
