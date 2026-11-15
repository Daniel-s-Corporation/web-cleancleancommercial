/* ==========================================================================
   Google Tag Manager + Google Consent Mode v2 defaults
   Loaded synchronously in <head> on every page, BEFORE any other script.
   US opt-out model: analytics and advertising run by default, unless the visitor
   opted out in the cookie banner (consent.js) or the browser sends a
   Global Privacy Control signal.
   ========================================================================== */
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
(function () {
  var c = null;
  try { c = JSON.parse(localStorage.getItem('cc_consent')); } catch (e) {}
  if (c && (c.v !== 1 || Date.now() - c.ts > 31536000000)) c = null;
  var gpc = navigator.globalPrivacyControl === true;
  var analytics = c ? c.analytics : true;
  var marketing = c ? c.marketing : true;
  if (gpc) marketing = false;
  var ads = marketing ? 'granted' : 'denied';
  gtag('consent', 'default', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    functionality_storage: 'granted',
    security_storage: 'granted'
  });
  gtag('set', 'ads_data_redaction', !marketing);
})();
gtag('js', new Date());

/* Google Tag Manager — container GTM-WC3VNBDG */
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WC3VNBDG');
