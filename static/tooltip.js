// Touch-aware tooltip layer. Native `title` attributes only render on
// hover, which doesn't exist on touchscreens. On any device that lacks a
// fine pointer (`@media (hover: none)` is true), this script:
//
//   1. Intercepts taps on elements that carry a `title` AND are not
//      themselves actionable (no href, no onclick, not a button/input).
//   2. Pops up a styled tooltip with the title text near the element.
//   3. Dismisses the tooltip on an outside tap, the next tap on the
//      same element, ESC, or a 5-second timer — whichever comes first.
//
// Actionable elements (nav-links, buttons, summaries) keep their normal
// tap behavior; their `title` only matters on hover. That's a deliberate
// trade-off: a tap that both shows a tooltip AND triggers a click would
// be ambiguous and would block the primary action on the second tap.

(function () {
  const isTouch =
    typeof window.matchMedia === "function" &&
    !window.matchMedia("(hover: hover)").matches;
  if (!isTouch) return;

  let popover = null;
  let timer = null;
  let anchorEl = null;

  function hide() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (popover) { popover.remove(); popover = null; }
    anchorEl = null;
  }

  function show(el, text) {
    hide();
    popover = document.createElement("div");
    popover.className = "rt-tooltip";
    popover.textContent = text;
    document.body.appendChild(popover);

    // Position: prefer above the element. If it would clip the top of the
    // viewport, flip below. Clamp left so it stays within 8 px of either edge.
    const r = el.getBoundingClientRect();
    const tt = popover.getBoundingClientRect();
    let top = r.top - tt.height - 8;
    if (top < 8) top = r.bottom + 8;
    let left = r.left + r.width / 2 - tt.width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tt.width - 8));
    popover.style.top  = `${top + window.scrollY}px`;
    popover.style.left = `${left}px`;
    popover.classList.add("rt-tooltip-visible");
    anchorEl = el;
    timer = setTimeout(hide, 5000);
  }

  function isActionable(el) {
    if (!el) return false;
    const tag = el.tagName;
    if (tag === "A" && el.getAttribute("href")) return true;
    if (tag === "BUTTON" || tag === "INPUT" || tag === "SELECT" ||
        tag === "TEXTAREA" || tag === "LABEL" || tag === "SUMMARY")
      return true;
    if (el.onclick || el.getAttribute("onclick")) return true;
    // <tr class="click-row"> in the CDR table — we listen with a JS handler
    // not the inline attribute, so detect via the convention class.
    if (el.classList && el.classList.contains("click-row")) return true;
    return false;
  }

  // Walk up from the tapped node — the element bearing the title may be
  // an inner span, but its intent is wherever the title lives. We do NOT
  // climb past an actionable ancestor though, because that would suppress
  // the action's primary behavior.
  function findTitledTarget(node) {
    for (let n = node; n && n !== document.body; n = n.parentElement) {
      if (isActionable(n)) {
        // If the actionable element itself has a title we don't show a
        // popover (it'd race the action). If a descendant titled element
        // sat strictly inside an actionable, we already short-circuit.
        return null;
      }
      const t = n.getAttribute && n.getAttribute("title");
      if (t && t.trim()) return { el: n, text: t.trim() };
    }
    return null;
  }

  document.addEventListener("click", (ev) => {
    // Tap outside the existing popover (and away from its anchor) → dismiss.
    if (popover && !popover.contains(ev.target)
        && (!anchorEl || !anchorEl.contains(ev.target))) {
      hide();
      // continue handling — the tap should still hit whatever's beneath
    }
    const match = findTitledTarget(ev.target);
    if (!match) return;
    // Tap on the same anchor twice = dismiss.
    if (anchorEl === match.el) { hide(); return; }
    ev.preventDefault();
    ev.stopPropagation();
    show(match.el, match.text);
  }, true);

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") hide();
  });

  // Scroll / resize → reposition or hide. Cheaper to just hide.
  window.addEventListener("scroll", hide, { passive: true });
  window.addEventListener("resize", hide);
})();
