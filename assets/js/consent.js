/* ==========================================================================
   Clean Clean — Cookie consent (US / Florida opt-out model)
   - Shows a notice on first visit with equal "Accept All" / "Reject Non-Essential" choices.
   - Stores the visitor's choice for 12 months (localStorage key "cc_consent").
   - Honors the Global Privacy Control (GPC) signal as an opt-out of
     sale / sharing / targeted advertising.
   - Sends Google Consent Mode v2 updates to Google Tag Manager and pushes a
     "cc_consent_update" dataLayer event you can use as a GTM trigger.
   - Any element with [data-cc-open] reopens the preferences panel.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "cc_consent";
  var VERSION = 1;
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;
  var gpc = navigator.globalPrivacyControl === true;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && c.v === VERSION && Date.now() - c.ts < MAX_AGE) return c;
    } catch (e) {}
    return null;
  }

  function apply(c) {
    var ads = c.marketing ? "granted" : "denied";
    gtag("consent", "update", {
      analytics_storage: c.analytics ? "granted" : "denied",
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads
    });
    gtag("set", "ads_data_redaction", !c.marketing);
    window.dataLayer.push({
      event: "cc_consent_update",
      cc_analytics: c.analytics,
      cc_marketing: c.marketing,
      cc_gpc: gpc
    });
  }

  function save(analytics, marketing, method) {
    if (gpc) marketing = false;
    var c = { v: VERSION, analytics: !!analytics, marketing: !!marketing, method: method, ts: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    apply(c);
    return c;
  }

  var current = read();
  var defaults = { analytics: true, marketing: !gpc };
  var banner, modal, lastFocus;

  var gpcNote = gpc
    ? '<p class="cc-gpc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>Global Privacy Control detected: we have opted you out of the sale/sharing of personal information and targeted advertising.</p>'
    : "";

  /* ---------- Banner ---------- */
  function buildBanner() {
    banner = document.createElement("div");
    banner.className = "cc-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Cookie notice");
    banner.innerHTML =
      '<div class="cc-banner-inner">' +
        '<div class="cc-banner-text">' +
          '<p class="cc-title">We value your privacy</p>' +
          '<p>We use cookies and similar technologies to keep this site working, understand how visitors use it, and measure our advertising. You can accept all, reject non-essential cookies, or choose your preferences at any time. Learn more in our <a href="/pages/cookie-policy.html">Cookie Policy</a> and <a href="/pages/privacy-policy.html">Privacy Policy</a>.</p>' +
          gpcNote +
        '</div>' +
        '<div class="cc-actions">' +
          '<button type="button" class="cc-btn cc-btn-link" data-cc-action="customize">Customize</button>' +
          '<button type="button" class="cc-btn cc-btn-outline" data-cc-action="reject">Reject Non-Essential</button>' +
          '<button type="button" class="cc-btn cc-btn-primary" data-cc-action="accept">Accept All</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);
    document.body.classList.add("cc-banner-open");
    banner.addEventListener("click", onAction);
  }

  function hideBanner() {
    if (!banner) return;
    banner.parentNode.removeChild(banner);
    banner = null;
    document.body.classList.remove("cc-banner-open");
  }

  /* ---------- Preferences modal ---------- */
  function category(id, title, desc, checked, locked, lockedNote) {
    return (
      '<div class="cc-cat">' +
        '<div class="cc-cat-head">' +
          '<label class="cc-cat-title" for="cc-' + id + '">' + title + "</label>" +
          '<span class="cc-switch">' +
            '<input type="checkbox" role="switch" id="cc-' + id + '" name="' + id + '"' +
              (checked ? " checked" : "") + (locked ? " disabled" : "") +
              ' aria-describedby="cc-' + id + '-desc">' +
            '<span class="cc-slider" aria-hidden="true"></span>' +
          "</span>" +
        "</div>" +
        '<p class="cc-cat-desc" id="cc-' + id + '-desc">' + desc + (lockedNote ? ' <strong>' + lockedNote + "</strong>" : "") + "</p>" +
      "</div>"
    );
  }

  function buildModal() {
    var state = current || defaults;
    modal = document.createElement("div");
    modal.className = "cc-modal";
    modal.innerHTML =
      '<div class="cc-overlay" data-cc-action="close"></div>' +
      '<div class="cc-dialog" role="dialog" aria-modal="true" aria-labelledby="cc-modal-title" tabindex="-1">' +
        '<button type="button" class="cc-close" data-cc-action="close" aria-label="Close preferences">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        "</button>" +
        '<p class="eyebrow">Your Privacy Choices</p>' +
        '<h2 id="cc-modal-title">Cookie Preferences</h2>' +
        '<p class="cc-intro">Choose which optional cookies we may use. Strictly necessary cookies are always on because the site cannot work without them. Turning off Marketing opts you out of the sale or sharing of personal information and targeted advertising. See our <a href="/pages/cookie-policy.html">Cookie Policy</a> for the full list.</p>' +
        gpcNote +
        '<form class="cc-form">' +
          category("necessary", "Strictly Necessary", "Required for security, page delivery, and remembering your cookie choices.", true, true, "Always active.") +
          category("analytics", "Analytics", "Helps us understand how visitors find and use the site (for example, Google Analytics) so we can improve it. Data is aggregated.", state.analytics, false) +
          category("marketing", "Marketing &amp; Advertising", "Lets us measure ads and show relevant ads on other sites (for example, Google Ads). Under some US state laws this may count as “sharing” or targeted advertising.", gpc ? false : state.marketing, gpc, gpc ? "Disabled by your Global Privacy Control signal." : "") +
          '<div class="cc-modal-actions">' +
            '<button type="button" class="cc-btn cc-btn-outline" data-cc-action="reject">Reject Non-Essential</button>' +
            '<button type="button" class="cc-btn cc-btn-outline" data-cc-action="accept">Accept All</button>' +
            '<button type="submit" class="cc-btn cc-btn-primary">Save Preferences</button>' +
          "</div>" +
        "</form>" +
      "</div>";
    document.body.appendChild(modal);
    modal.addEventListener("click", onAction);
    modal.querySelector(".cc-form").addEventListener("submit", function (e) {
      e.preventDefault();
      current = save(
        modal.querySelector("#cc-analytics").checked,
        modal.querySelector("#cc-marketing").checked,
        "custom"
      );
      closeModal();
      hideBanner();
    });
    modal.addEventListener("keydown", trapKeys);
  }

  function openModal() {
    if (modal) return;
    lastFocus = document.activeElement;
    buildModal();
    document.body.classList.add("cc-modal-open");
    modal.querySelector(".cc-dialog").focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.parentNode.removeChild(modal);
    modal = null;
    document.body.classList.remove("cc-modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function trapKeys(e) {
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key !== "Tab") return;
    var f = modal.querySelectorAll("button, a[href], input:not([disabled])");
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === modal.querySelector(".cc-dialog"))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  /* ---------- Actions ---------- */
  function onAction(e) {
    var btn = e.target.closest("[data-cc-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-cc-action");
    if (action === "accept") { current = save(true, true, "accept_all"); closeModal(); hideBanner(); }
    else if (action === "reject") { current = save(false, false, "reject_all"); closeModal(); hideBanner(); }
    else if (action === "customize") { openModal(); }
    else if (action === "close") { closeModal(); }
  }

  document.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-cc-open]");
    if (!opener) return;
    e.preventDefault();
    openModal();
  });

  if (!current) buildBanner();
})();
