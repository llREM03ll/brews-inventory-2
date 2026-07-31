/**
 * nav.js
 * Shared bottom-nav renderer. Previously this markup (and the role logic
 * that hides it for managers / swaps the shift label) was copy-pasted into
 * index.html, pos.html, calendar.html and calculate.html independently,
 * with small drift between copies (calendar.html even had two separate
 * blocks doing the same manager-check). This is the single source of truth
 * — behavior is unchanged, only the duplication is removed.
 */
(function () {
  const NAV_ITEMS = [
    { page: "calculate", href: "calculate.html", icon: "🧮", label: "Calculate" },
    { page: "shift",     href: "pos.html",       icon: "🧋", label: "Shift", shift: true },
    { page: "history",   href: "calendar.html",  icon: "📅", label: "History" },
  ];

  /**
   * Renders the <nav> markup as an HTML string.
   * @param {string} active - "calculate" | "shift" | "history"
   * @param {object} [opts]
   * @param {string} [opts.navId] - id to put on the <nav> element
   *   (index.html reads #bottomNav elsewhere to live-toggle it from Settings)
   * @param {boolean} [opts.shiftIsCurrentPage] - true only on pos.html: the
   *   Shift tab renders as an inert, already-active <span> instead of a
   *   link, matching pos.html's original markup exactly.
   */
  window.renderBottomNav = function (active, opts) {
    opts = opts || {};
    const idAttr = opts.navId ? ` id="${opts.navId}"` : "";

    const itemsHTML = NAV_ITEMS.map(item => {
      const activeClass = item.page === active ? " active" : "";

      if (item.shift && opts.shiftIsCurrentPage) {
        return `<span class="bottom-nav-item bottom-nav-shift active">
      <span class="bottom-nav-shift-pill">${item.icon}</span>
      <span class="bottom-nav-label">${item.label}</span>
    </span>`;
      }
      if (item.shift) {
        return `<a href="${item.href}" class="bottom-nav-item bottom-nav-shift${activeClass}" id="shiftNavBtn">
      <span class="bottom-nav-shift-pill">${item.icon}</span>
      <span class="bottom-nav-label" id="shiftNavLabel">${item.label}</span>
    </a>`;
      }
      return `<a href="${item.href}" class="bottom-nav-item${activeClass}">
      <span class="bottom-nav-icon">${item.icon}</span>
      <span class="bottom-nav-label">${item.label}</span>
    </a>`;
    }).join("\n    ");

    return `<nav class="bottom-nav"${idAttr}>\n    ${itemsHTML}\n  </nav>`;
  };

  /**
   * Applies the existing role rules after the nav is in the DOM:
   * managers get no bottom nav (pos.html never hid it — preserved as-is),
   * workers see the Shift tab swap to "↩ Shift" once a shift is active.
   * Returns false if the nav was hidden (manager), true otherwise.
   */
  window.applyBottomNavRole = function (opts) {
    opts = opts || {};
    const isManager = getDeviceRole() === "manager";
    const nav = document.querySelector(".bottom-nav");

    if (isManager && !opts.shiftIsCurrentPage) {
      if (nav) nav.style.display = "none";
      document.body.classList.remove("has-bottom-nav");
      return false;
    }
    if (!opts.shiftIsCurrentPage && localStorage.getItem("brewsShiftActive")) {
      const label = document.getElementById("shiftNavLabel");
      const btn   = document.getElementById("shiftNavBtn");
      if (label) label.textContent = "↩ Shift";
      if (btn)   btn.title = "Return to active shift";
    }
    return true;
  };
})();
