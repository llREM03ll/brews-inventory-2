/**
 * main.js
 * App entry point — restores saved state, attaches listeners,
 * and auto-fills fields if arriving from a POS End Shift.
 */

const SHIFT_KEY = "brewsShiftResult";

(function init() {
  // Check if we just came from a POS End Shift
  const shiftRaw = localStorage.getItem(SHIFT_KEY);
  if (shiftRaw) {
    try {
      const s = JSON.parse(shiftRaw);
      // Auto-fill all cup fields from shift data
      const fill = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
      };
      fill("beginM",  s.begM);
      fill("endM",    s.endM);
      fill("tallyMC", s.tallyMC);
      fill("beginL",  s.begL);
      fill("endL",    s.endL);
      fill("tallyLC", s.tallyLC);
      fill("beginS",  s.begS);
      fill("endS",    s.endS);
      fill("beginHC", s.begHC);
      fill("endHC",   s.endHC);

      localStorage.removeItem(SHIFT_KEY); // consume it
      saveInputs();

      // Show a banner to let the user know fields were auto-filled
      showShiftBanner();
    } catch {}
  } else {
    // No shift data — restore previously saved form inputs
    const saved = restoreInputs();
    if (saved?.expenses?.length) {
      document.getElementById("expensesContainer").innerHTML = "";
      saved.expenses.forEach(e => addExpenseRow(e.name, e.price));
    }
  }

  attachInputListeners();
})();

/**
 * Shows a temporary banner at the top of the page confirming
 * that the shift data was auto-filled.
 */
function showShiftBanner() {
  const banner = document.createElement("div");
  banner.style.cssText = `
    background: linear-gradient(135deg, #d4a97c, #7a5c3e);
    color: #fff;
    text-align: center;
    padding: 10px 16px;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    border-radius: 12px;
    margin-bottom: 16px;
    box-shadow: 0 3px 10px rgba(122,92,62,0.2);
    animation: fadeIn .4s ease;
  `;
  banner.textContent = "✓ Shift data auto-filled from POS. Review and compute when ready.";

  const container = document.querySelector(".container");
  const firstSection = container.querySelector(".section");
  container.insertBefore(banner, firstSection);

  setTimeout(() => {
    banner.style.transition = "opacity .5s";
    banner.style.opacity = "0";
    setTimeout(() => banner.remove(), 500);
  }, 4000);
}
