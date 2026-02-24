/*
 * Tattoo Price Estimator Widget — Backward-Compatible Wrapper
 *
 * This file preserves the original embed API:
 *   <script src="widget.js" data-shop="..." data-minimum="..." ...></script>
 *
 * It now delegates to engine.js with the tattoo config.
 * All data-* attributes (shop, minimum, hourly, accent, booking) are passed through.
 *
 * For new verticals, use engine.js directly with a config file:
 *   <script src="engine.js" data-config="configs/hair-salon.json"></script>
 */
(function () {
  "use strict";

  var scriptEl = document.currentScript;
  var src = scriptEl.getAttribute("src") || "";
  var base = src.substring(0, src.lastIndexOf("/") + 1);

  /* Build engine script element, forwarding all data-* attributes */
  var engineScript = document.createElement("script");
  engineScript.src = base + "engine.js";

  /* Default to tattoo config */
  engineScript.setAttribute("data-config", base + "configs/tattoo.json");

  /* Forward all data-* overrides from the original script tag */
  var attrs = ["data-shop", "data-minimum", "data-hourly", "data-accent", "data-booking"];
  attrs.forEach(function (attr) {
    var val = scriptEl.getAttribute(attr);
    if (val) engineScript.setAttribute(attr, val);
  });

  /* Insert engine script right after this one */
  scriptEl.parentNode.insertBefore(engineScript, scriptEl.nextSibling);
})();
