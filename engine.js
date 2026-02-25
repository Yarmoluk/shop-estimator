(function () {
  "use strict";

  /* ── Capture script element immediately (before async) ── */
  var scriptEl = document.currentScript;

  /* ── Helpers ── */
  function roundTo10(n) { return Math.round(n / 10) * 10; }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function deepMerge(target, source) {
    var out = {};
    for (var k in target) { if (target.hasOwnProperty(k)) out[k] = target[k]; }
    for (var k2 in source) {
      if (source.hasOwnProperty(k2)) {
        if (typeof source[k2] === "object" && source[k2] !== null && !Array.isArray(source[k2]) && typeof out[k2] === "object" && out[k2] !== null && !Array.isArray(out[k2])) {
          out[k2] = deepMerge(out[k2], source[k2]);
        } else {
          out[k2] = source[k2];
        }
      }
    }
    return out;
  }

  /* ── Resolve config source ── */
  function resolveConfig(callback) {
    var inlineAttr = scriptEl.getAttribute("data-config-inline");
    var configUrl = scriptEl.getAttribute("data-config");

    /* Priority 1: Inline JSON attribute */
    if (inlineAttr) {
      try {
        var parsed = JSON.parse(inlineAttr);
        callback(applyOverrides(parsed));
      } catch (e) {
        console.error("[Estimator Engine] Invalid inline config JSON:", e);
        callback(null);
      }
      return;
    }

    /* Priority 2: Global variable */
    if (window.ESTIMATOR_CONFIG) {
      callback(applyOverrides(window.ESTIMATOR_CONFIG));
      return;
    }

    /* Priority 3: Fetch from URL (data-config attr, or default tattoo.json) */
    var url = configUrl || resolveRelativeUrl("configs/tattoo.json");
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (json) {
        callback(applyOverrides(json));
      })
      .catch(function (err) {
        console.error("[Estimator Engine] Failed to load config from " + url + ":", err);
        callback(null);
      });
  }

  /* ── Resolve relative URL based on script location ── */
  function resolveRelativeUrl(path) {
    var src = scriptEl.getAttribute("src") || "";
    var base = src.substring(0, src.lastIndexOf("/") + 1);
    return base + path;
  }

  /* ── Apply data-* attribute overrides ── */
  function applyOverrides(config) {
    if (!config) return config;
    var overrides = {};
    var shop = scriptEl.getAttribute("data-shop");
    var minimum = scriptEl.getAttribute("data-minimum");
    var hourly = scriptEl.getAttribute("data-hourly");
    var accent = scriptEl.getAttribute("data-accent");
    var booking = scriptEl.getAttribute("data-booking");

    if (shop || minimum || hourly || accent || booking) {
      overrides.defaults = {};
      if (shop) overrides.defaults.shop = shop;
      if (minimum) overrides.defaults.minimum = parseFloat(minimum);
      if (hourly) overrides.defaults.hourly = parseFloat(hourly);
      if (accent) overrides.defaults.accent = accent;
      if (booking) overrides.defaults.booking = booking;
    }

    if (Object.keys(overrides).length > 0) {
      return deepMerge(config, overrides);
    }
    return config;
  }

  /* ── Inject CSS (scoped with .te- prefix) ── */
  function injectStyles(accent) {
    var a = accent;
    var css = "\n" +
".te-root{all:initial;display:block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;max-width:540px;margin:24px auto;background:#1a1a2e;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.45);overflow:hidden;color:#e0e0e0;line-height:1.5;font-size:15px;box-sizing:border-box}\n" +
".te-root *,.te-root *::before,.te-root *::after{box-sizing:border-box}\n" +
".te-header{background:linear-gradient(135deg,#16213e,#0f3460);padding:24px 28px;border-bottom:3px solid " + a + ";text-align:center}\n" +
".te-header h2{margin:0 0 4px;font-size:22px;font-weight:700;color:#fff}\n" +
".te-header p{margin:0;font-size:13px;color:#94a3b8}\n" +
".te-body{padding:24px 28px 28px}\n" +
".te-step-indicator{display:flex;justify-content:center;gap:6px;margin-bottom:20px}\n" +
".te-step-dot{width:10px;height:10px;border-radius:50%;background:#2a2a4a;transition:background .3s}\n" +
".te-step-dot.te-dot-active{background:" + a + "}\n" +
".te-step-dot.te-dot-done{background:" + a + "88}\n" +
".te-section-title{font-size:14px;font-weight:700;color:#fff;margin:0 0 4px}\n" +
".te-section-sub{font-size:12px;color:#64748b;margin:0 0 12px}\n" +
".te-options{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}\n" +
".te-opt{flex:1 1 calc(50% - 4px);min-width:130px;padding:12px;background:#16213e;border:2px solid transparent;border-radius:10px;cursor:pointer;text-align:center;font-size:13px;font-weight:600;color:#cbd5e1;transition:border-color .2s,background .2s}\n" +
".te-opt:hover{border-color:" + a + "44;background:#1e2a45}\n" +
".te-opt.te-active{border-color:" + a + ";background:#1e2a45;color:#fff}\n" +
".te-opt small{display:block;font-size:11px;color:#64748b;margin-top:3px;font-weight:400}\n" +
".te-opt-third{flex:1 1 calc(33.3% - 6px);min-width:100px}\n" +
".te-opt-full{flex:1 1 100%}\n" +
".te-premium-badge{display:inline-block;background:" + a + "33;color:" + a + ";font-size:9px;font-weight:700;letter-spacing:.5px;padding:2px 6px;border-radius:4px;margin-left:6px;vertical-align:middle;text-transform:uppercase}\n" +
".te-toggle-row{display:flex;gap:10px;margin-bottom:20px}\n" +
".te-toggle{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:#16213e;border:2px solid transparent;border-radius:10px;cursor:pointer;font-size:13px;font-weight:600;color:#cbd5e1;transition:border-color .2s,background .2s}\n" +
".te-toggle:hover{border-color:" + a + "44}\n" +
".te-toggle.te-active{border-color:" + a + ";background:#1e2a45;color:#fff}\n" +
".te-toggle-indicator{width:36px;height:20px;border-radius:10px;background:#2a2a4a;position:relative;transition:background .2s;flex-shrink:0}\n" +
".te-toggle.te-active .te-toggle-indicator{background:" + a + "}\n" +
".te-toggle-indicator::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s}\n" +
".te-toggle.te-active .te-toggle-indicator::after{transform:translateX(16px)}\n" +
".te-ref-prompt{background:#16213e;border:2px dashed #2a2a4a;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;transition:border-color .2s}\n" +
".te-ref-prompt:hover{border-color:" + a + "66}\n" +
".te-ref-icon{font-size:28px;margin-bottom:6px}\n" +
".te-ref-text{font-size:13px;color:#94a3b8;line-height:1.5}\n" +
".te-ref-text strong{color:#fff}\n" +
/* Image upload styles */
".te-upload-zone{background:#16213e;border:2px dashed #2a2a4a;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;cursor:pointer;transition:border-color .2s,background .2s}\n" +
".te-upload-zone:hover{border-color:" + a + "66;background:#1e2a45}\n" +
".te-upload-zone.te-has-files{border-color:" + a + "44;border-style:solid}\n" +
".te-upload-icon{font-size:32px;margin-bottom:8px}\n" +
".te-upload-label{font-size:14px;font-weight:600;color:#fff;margin-bottom:4px}\n" +
".te-upload-sub{font-size:12px;color:#64748b}\n" +
".te-upload-input{display:none}\n" +
".te-upload-previews{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;justify-content:center}\n" +
".te-upload-thumb{width:72px;height:72px;border-radius:8px;object-fit:cover;border:2px solid " + a + "44}\n" +
".te-upload-thumb-wrap{position:relative;display:inline-block}\n" +
".te-upload-remove{position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;background:#e94560;color:#fff;border:none;font-size:12px;font-weight:700;cursor:pointer;line-height:20px;text-align:center;padding:0}\n" +
/* Artist selector styles */
".te-artist-card{flex:1 1 100%;padding:14px 16px;background:#16213e;border:2px solid transparent;border-radius:10px;cursor:pointer;text-align:left;transition:border-color .2s,background .2s}\n" +
".te-artist-card:hover{border-color:" + a + "44;background:#1e2a45}\n" +
".te-artist-card.te-active{border-color:" + a + ";background:#1e2a45}\n" +
".te-artist-name{font-size:14px;font-weight:700;color:#fff}\n" +
".te-artist-rate{font-size:12px;color:" + a + ";margin-top:2px}\n" +
".te-artist-bio{font-size:11px;color:#64748b;margin-top:4px;line-height:1.4}\n" +
".te-artist-styles{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}\n" +
".te-artist-style-tag{font-size:10px;padding:2px 8px;border-radius:4px;background:" + a + "22;color:" + a + ";font-weight:600}\n" +
/* Multiselect chip styles */
".te-opt.te-multiselect{position:relative}\n" +
".te-opt.te-multiselect .te-check{display:none;position:absolute;top:6px;right:6px;width:18px;height:18px;border-radius:4px;background:" + a + ";color:#fff;font-size:12px;line-height:18px;text-align:center;font-weight:700}\n" +
".te-opt.te-multiselect.te-active .te-check{display:block}\n" +
/* Custom disclaimer */
".te-custom-disclaimer{background:#1e2a45;border:1px solid #2a3a5a;border-radius:10px;padding:14px 16px;margin-bottom:20px;font-size:12px;color:#94a3b8;line-height:1.6}\n" +
".te-custom-disclaimer strong{color:#fff}\n" +
".te-btn{display:block;width:100%;padding:14px;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;transition:transform .15s,box-shadow .15s;text-align:center;text-decoration:none;color:#fff;font-family:inherit}\n" +
".te-btn:active{transform:scale(.97)}\n" +
".te-btn-primary{background:linear-gradient(135deg," + a + "," + a + "cc);color:#fff;box-shadow:0 4px 16px " + a + "55}\n" +
".te-btn-primary:hover{box-shadow:0 6px 24px " + a + "77}\n" +
".te-btn-outline{background:transparent;border:2px solid " + a + ";color:" + a + ";margin-top:10px}\n" +
".te-btn-outline:hover{background:" + a + "18}\n" +
".te-btn-book{background:linear-gradient(135deg," + a + "," + a + "cc);color:#fff;box-shadow:0 4px 16px " + a + "55;margin-top:16px;font-size:18px;padding:16px}\n" +
".te-btn-book:hover{box-shadow:0 6px 24px " + a + "77}\n" +
".te-nav-row{display:flex;gap:10px;margin-top:16px}\n" +
".te-nav-row .te-btn{flex:1}\n" +
".te-btn-secondary{background:#16213e;color:#94a3b8;border:1px solid #2a2a4a}\n" +
".te-btn-secondary:hover{background:#1e2a45;color:#fff}\n" +
".te-result-price{text-align:center;background:linear-gradient(135deg,#16213e,#0f3460);border-radius:14px;padding:28px 20px;margin-bottom:20px;border:1px solid " + a + "44}\n" +
".te-result-price .te-range{font-size:34px;font-weight:800;color:#fff;margin:0}\n" +
".te-result-price .te-range-accent{color:" + a + "}\n" +
".te-result-price .te-base{font-size:13px;color:#94a3b8;margin:8px 0 0;line-height:1.6}\n" +
".te-factors{background:#16213e;border-radius:12px;padding:16px 18px;margin-bottom:20px}\n" +
".te-factors h4{margin:0 0 10px;font-size:14px;font-weight:600;color:#fff}\n" +
".te-factor-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #ffffff0d;font-size:13px}\n" +
".te-factor-row:last-child{border-bottom:none}\n" +
".te-factor-row span:first-child{color:#94a3b8}\n" +
".te-factor-row span:last-child{color:" + a + ";font-weight:600}\n" +
".te-sessions{background:linear-gradient(135deg,#1a1a3e,#16213e);border-radius:12px;padding:16px 18px;margin-bottom:20px;border-left:3px solid " + a + "}\n" +
".te-sessions h4{margin:0 0 8px;font-size:14px;font-weight:600;color:#fff}\n" +
".te-sessions p{margin:4px 0;font-size:13px;color:#cbd5e1}\n" +
".te-multi-session-flag{background:" + a + "22;border:1px solid " + a + "55;border-radius:10px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:flex-start;gap:10px}\n" +
".te-multi-session-flag .te-flag-icon{font-size:20px;flex-shrink:0}\n" +
".te-multi-session-flag .te-flag-text{font-size:13px;color:#e0e0e0;line-height:1.5}\n" +
".te-multi-session-flag .te-flag-text strong{color:#fff}\n" +
".te-ref-reminder{background:#1e2a45;border:1px solid #2a3a5a;border-radius:10px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:flex-start;gap:10px}\n" +
".te-ref-reminder .te-ref-reminder-icon{font-size:18px;flex-shrink:0}\n" +
".te-ref-reminder .te-ref-reminder-text{font-size:12px;color:#94a3b8;line-height:1.5}\n" +
".te-ref-reminder .te-ref-reminder-text strong{color:#fff}\n" +
".te-aftercare{background:#1e3a1e;border-radius:12px;padding:18px;margin-bottom:20px}\n" +
".te-aftercare h4{margin:0 0 12px;font-size:14px;font-weight:600;color:#43a047}\n" +
".te-product{display:flex;justify-content:space-between;align-items:center;background:#163016;border-radius:10px;padding:12px 14px;margin-bottom:8px}\n" +
".te-product:last-of-type{margin-bottom:0}\n" +
".te-product-info{flex:1;min-width:0}\n" +
".te-product-name{font-size:13px;font-weight:600;color:#e0e0e0}\n" +
".te-product-desc{font-size:11px;color:#81c784;margin-top:2px}\n" +
".te-product-link{flex-shrink:0;margin-left:12px;padding:7px 14px;background:#43a047;color:#fff;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;white-space:nowrap;transition:background .2s}\n" +
".te-product-link:hover{background:#388e3c}\n" +
".te-disclaimer{font-size:11px;color:#64748b;text-align:center;margin-top:16px;line-height:1.5}\n" +
".te-powered{text-align:center;margin-top:12px;padding-top:12px;border-top:1px solid #ffffff0a}\n" +
".te-powered a{color:#64748b;text-decoration:none;font-size:11px;font-weight:500;letter-spacing:.3px;transition:color .2s}\n" +
".te-powered a:hover{color:" + a + "}\n" +
".te-powered a span{opacity:.6}\n" +
"@media(max-width:480px){.te-root{margin:12px 8px;border-radius:12px}.te-body{padding:18px 16px}.te-opt{flex:1 1 100%}.te-opt-third{flex:1 1 100%}.te-result-price .te-range{font-size:26px}.te-nav-row{flex-direction:column}}\n";

    var styleEl = document.createElement("style");
    styleEl.setAttribute("data-estimator-engine", "true");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  /* ══════════════════════════════════════════════════════════
     ESTIMATOR INSTANCE — config-driven widget
     ══════════════════════════════════════════════════════════ */

  function createEstimator(config) {
    if (!config || !config.steps || !config.defaults) {
      console.error("[Estimator Engine] Invalid config — missing steps or defaults.");
      return;
    }

    var CFG = config.defaults;

    /* ── Auto-inject artist step from top-level artists array ── */
    if (config.artists && config.artists.length > 0) {
      /* Build the artist step automatically — shop owners just list artists */
      var artistStep = {
        title: "Choose Your Artist",
        groups: [{
          key: "_artist",
          title: "Who do you want to work with?",
          subtitle: config.artists.length + " artist" + (config.artists.length > 1 ? "s" : "") + " available",
          type: "artist",
          default: 0,
          artists: config.artists
        }]
      };
      /* Prepend artist step before all other steps */
      config.steps = [artistStep].concat(config.steps);
    }

    var STEPS = config.steps;
    var TOTAL_STEPS = STEPS.length + 1; /* +1 for summary/confirm step */

    /* ── Build initial state from config ── */
    var STATE = { step: 0, uploads: [] };

    STEPS.forEach(function (step) {
      step.groups.forEach(function (group) {
        if (group.type === "select") {
          STATE[group.key] = (typeof group.default === "number") ? group.default : 0;
        } else if (group.type === "multiselect") {
          /* Default: array of selected indices */
          STATE[group.key] = Array.isArray(group.default) ? group.default.slice() : [0];
        } else if (group.type === "toggle") {
          STATE[group.key] = (typeof group.default === "boolean") ? group.default : false;
        } else if (group.type === "artist") {
          STATE[group.key] = (typeof group.default === "number") ? group.default : 0;
        }
      });
    });

    /* ── Inject styles ── */
    injectStyles(CFG.accent);

    /* ── Create root element ── */
    var root = el("div", "te-root");
    scriptEl.parentNode.insertBefore(root, scriptEl.nextSibling);

    /* ── Step Dots ── */
    function buildStepDots(body) {
      var dots = el("div", "te-step-indicator");
      for (var i = 0; i < TOTAL_STEPS; i++) {
        var dot = el("div", "te-step-dot");
        if (i === STATE.step) dot.className += " te-dot-active";
        else if (i < STATE.step) dot.className += " te-dot-done";
        dots.appendChild(dot);
      }
      body.appendChild(dots);
    }

    /* ── Option Group Builder (single select) ── */
    function buildOptionGroup(body, group) {
      body.appendChild(el("div", "te-section-title", group.title));
      if (group.subtitle) body.appendChild(el("div", "te-section-sub", group.subtitle));
      var wrap = el("div", "te-options");
      group.options.forEach(function (item, i) {
        var extraCls = "";
        if (group.layout === "third") extraCls = " te-opt-third";
        else if (group.layout === "full") extraCls = " te-opt-full";
        var btn = el("div", "te-opt" + extraCls + (i === STATE[group.key] ? " te-active" : ""));
        var labelHtml = item.label;
        if (item.premium) labelHtml += '<span class="te-premium-badge">Premium</span>';
        btn.innerHTML = labelHtml;
        if (item.desc) {
          var sub = el("small", "");
          sub.textContent = item.desc;
          btn.appendChild(sub);
        }
        btn.addEventListener("click", function () {
          STATE[group.key] = i;
          wrap.querySelectorAll(".te-opt").forEach(function (o) { o.classList.remove("te-active"); });
          btn.classList.add("te-active");
        });
        wrap.appendChild(btn);
      });
      body.appendChild(wrap);
    }

    /* ── Multiselect Group Builder (select all that apply) ── */
    function buildMultiselectGroup(body, group) {
      body.appendChild(el("div", "te-section-title", group.title));
      if (group.subtitle) body.appendChild(el("div", "te-section-sub", group.subtitle));
      var wrap = el("div", "te-options");
      group.options.forEach(function (item, i) {
        var extraCls = "";
        if (group.layout === "third") extraCls = " te-opt-third";
        else if (group.layout === "full") extraCls = " te-opt-full";
        var isSelected = STATE[group.key].indexOf(i) !== -1;
        var btn = el("div", "te-opt te-multiselect" + extraCls + (isSelected ? " te-active" : ""));
        var labelHtml = item.label + '<span class="te-check">\u2713</span>';
        if (item.premium) labelHtml += '<span class="te-premium-badge">Premium</span>';
        btn.innerHTML = labelHtml;
        if (item.desc) {
          var sub = el("small", "");
          sub.textContent = item.desc;
          btn.appendChild(sub);
        }
        btn.addEventListener("click", function () {
          var idx = STATE[group.key].indexOf(i);
          if (idx !== -1) {
            /* Deselect — but keep at least one selected */
            if (STATE[group.key].length > 1) {
              STATE[group.key].splice(idx, 1);
              btn.classList.remove("te-active");
            }
          } else {
            STATE[group.key].push(i);
            btn.classList.add("te-active");
          }
        });
        wrap.appendChild(btn);
      });
      body.appendChild(wrap);
    }

    /* ── Artist Selector Builder ── */
    function buildArtistGroup(body, group) {
      body.appendChild(el("div", "te-section-title", group.title));
      if (group.subtitle) body.appendChild(el("div", "te-section-sub", group.subtitle));
      var wrap = el("div", "te-options");
      group.artists.forEach(function (artist, i) {
        var card = el("div", "te-artist-card" + (i === STATE[group.key] ? " te-active" : ""));

        /* Name + tier badge */
        var nameHtml = artist.name;
        if (artist.tier) {
          nameHtml += ' <span class="te-premium-badge">' + artist.tier + '</span>';
        }
        card.appendChild(el("div", "te-artist-name", nameHtml));

        /* Rate display */
        var rateText = "";
        if (artist.rateType === "flat") {
          rateText = artist.rates.map(function (r) { return r.label + ": $" + r.price; }).join(" &middot; ");
        } else {
          rateText = "$" + (artist.hourly || CFG.hourly) + "/hr";
        }
        card.appendChild(el("div", "te-artist-rate", rateText));

        if (artist.bio) card.appendChild(el("div", "te-artist-bio", artist.bio));

        if (artist.styles && artist.styles.length > 0) {
          var tagsWrap = el("div", "te-artist-styles");
          artist.styles.forEach(function (s) {
            tagsWrap.appendChild(el("span", "te-artist-style-tag", s));
          });
          card.appendChild(tagsWrap);
        }

        card.addEventListener("click", function () {
          STATE[group.key] = i;
          wrap.querySelectorAll(".te-artist-card").forEach(function (c) { c.classList.remove("te-active"); });
          card.classList.add("te-active");
        });
        wrap.appendChild(card);
      });
      body.appendChild(wrap);
    }

    /* ── Toggle Builder ── */
    function buildToggle(body, group) {
      var row = el("div", "te-toggle" + (STATE[group.key] ? " te-active" : ""));
      row.innerHTML = '<span>' + group.title + '</span><div class="te-toggle-indicator"></div>';
      row.addEventListener("click", function () {
        STATE[group.key] = !STATE[group.key];
        row.classList.toggle("te-active", STATE[group.key]);
      });
      var wrap = el("div", "");
      wrap.style.marginBottom = "12px";
      wrap.appendChild(row);
      body.appendChild(wrap);
    }

    /* ── Image Upload Builder ── */
    function buildImageUpload(body) {
      var uploadCfg = config.imageUpload;
      if (!uploadCfg) return;

      var maxFiles = uploadCfg.maxFiles || 3;
      var zone = el("div", "te-upload-zone" + (STATE.uploads.length > 0 ? " te-has-files" : ""));
      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = maxFiles > 1;
      input.className = "te-upload-input";

      zone.innerHTML = '<div class="te-upload-icon">' + (uploadCfg.icon || "\ud83d\udcf7") + '</div>' +
        '<div class="te-upload-label">' + (uploadCfg.title || "Upload Reference Images") + '</div>' +
        '<div class="te-upload-sub">' + (uploadCfg.subtitle || "Up to " + maxFiles + " images (reference photos, placement ideas)") + '</div>';

      zone.appendChild(input);

      /* Click zone to trigger file picker */
      zone.addEventListener("click", function (e) {
        if (e.target !== input) input.click();
      });

      /* Preview thumbnails */
      var previewWrap = el("div", "te-upload-previews");

      function renderPreviews() {
        previewWrap.innerHTML = "";
        STATE.uploads.forEach(function (fileData, idx) {
          var thumbWrap = el("div", "te-upload-thumb-wrap");
          var img = el("img", "te-upload-thumb");
          img.src = fileData.dataUrl;
          img.alt = "Reference " + (idx + 1);
          thumbWrap.appendChild(img);
          var removeBtn = el("button", "te-upload-remove", "\u00d7");
          removeBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            STATE.uploads.splice(idx, 1);
            renderPreviews();
            zone.classList.toggle("te-has-files", STATE.uploads.length > 0);
          });
          thumbWrap.appendChild(removeBtn);
          previewWrap.appendChild(thumbWrap);
        });
      }

      input.addEventListener("change", function () {
        var files = Array.prototype.slice.call(input.files);
        files.forEach(function (file) {
          if (STATE.uploads.length >= maxFiles) return;
          var reader = new FileReader();
          reader.onload = function (e) {
            STATE.uploads.push({ name: file.name, dataUrl: e.target.result });
            renderPreviews();
            zone.classList.add("te-has-files");
          };
          reader.readAsDataURL(file);
        });
        input.value = "";
      });

      renderPreviews();
      zone.appendChild(previewWrap);
      body.appendChild(zone);
    }

    /* ── Navigation Buttons ── */
    function buildNav(body) {
      if (STATE.step === TOTAL_STEPS - 1) {
        /* Last step: Get Estimate button */
        var cta = el("button", "te-btn te-btn-primary", "Get My Estimate");
        cta.addEventListener("click", function () { showResults(); });
        body.appendChild(cta);
        if (STATE.step > 0) {
          var back = el("button", "te-btn te-btn-secondary", "\u2190 Back");
          back.style.marginTop = "8px";
          back.addEventListener("click", function () { STATE.step--; buildForm(); });
          body.appendChild(back);
        }
      } else {
        var row = el("div", "te-nav-row");
        if (STATE.step > 0) {
          var backBtn = el("button", "te-btn te-btn-secondary", "\u2190 Back");
          backBtn.addEventListener("click", function () { STATE.step--; buildForm(); });
          row.appendChild(backBtn);
        }
        var nextBtn = el("button", "te-btn te-btn-primary", "Next \u2192");
        nextBtn.addEventListener("click", function () { STATE.step++; buildForm(); });
        row.appendChild(nextBtn);
        body.appendChild(row);
      }
    }

    /* ── Gather all groups flat for calculation ── */
    function getAllGroups() {
      var groups = [];
      STEPS.forEach(function (step) {
        step.groups.forEach(function (g) { groups.push(g); });
      });
      return groups;
    }

    /* ── Find the base-hours group (first group with hours on its options) ── */
    function findBaseHoursGroup() {
      var allGroups = getAllGroups();
      for (var i = 0; i < allGroups.length; i++) {
        var g = allGroups[i];
        if (g.type === "select" && g.options && g.options.length > 0 && typeof g.options[0].hours === "number") {
          return g;
        }
      }
      return null;
    }

    /* ── Find artist group if it exists ── */
    function findArtistGroup() {
      var allGroups = getAllGroups();
      for (var i = 0; i < allGroups.length; i++) {
        if (allGroups[i].type === "artist") return allGroups[i];
      }
      return null;
    }

    /* ── Build summary label for a group selection ── */
    function getSummaryLabel(group) {
      if (group.type === "select") {
        var opt = group.options[STATE[group.key]];
        var label = opt.label;
        if (label.length > 40) label = label.substring(0, 37) + "...";
        return label;
      } else if (group.type === "multiselect") {
        var selected = STATE[group.key];
        var labels = selected.map(function (idx) { return group.options[idx].label; });
        var joined = labels.join(", ");
        if (joined.length > 50) joined = joined.substring(0, 47) + "...";
        return joined;
      } else if (group.type === "toggle") {
        return STATE[group.key] ? "Yes" : "No";
      } else if (group.type === "artist") {
        return group.artists[STATE[group.key]].name;
      }
      return "";
    }

    /* ── Build Form (Multi-Step) ── */
    function buildForm() {
      root.innerHTML = "";

      var header = el("div", "te-header");
      header.appendChild(el("h2", "", CFG.shop));
      header.appendChild(el("p", "", config.title || "Price Estimator"));
      root.appendChild(header);

      var body = el("div", "te-body");
      root.appendChild(body);

      buildStepDots(body);

      /* Config-driven steps */
      if (STATE.step < STEPS.length) {
        var currentStep = STEPS[STATE.step];
        currentStep.groups.forEach(function (group) {
          if (group.type === "select") {
            buildOptionGroup(body, group);
          } else if (group.type === "multiselect") {
            buildMultiselectGroup(body, group);
          } else if (group.type === "toggle") {
            buildToggle(body, group);
          } else if (group.type === "artist") {
            buildArtistGroup(body, group);
          }
        });
      } else {
        /* Summary / confirm step (last virtual step) */

        /* Image upload (on summary step) */
        if (config.imageUpload) {
          buildImageUpload(body);
        }

        /* Reference prompt (if no imageUpload or in addition) */
        if (config.referencePrompt && !config.imageUpload) {
          var rp = config.referencePrompt;
          var refBox = el("div", "te-ref-prompt");
          refBox.innerHTML = '<div class="te-ref-icon">' + (rp.icon || "\ud83d\udcf7") + '</div>' +
            '<div class="te-ref-text"><strong>' + rp.title + '</strong><br>' + rp.text + '</div>';
          body.appendChild(refBox);
        }

        /* Custom disclaimer (shop-specific, shown before estimate) */
        if (config.customDisclaimer) {
          var discBox = el("div", "te-custom-disclaimer");
          discBox.innerHTML = config.customDisclaimer;
          body.appendChild(discBox);
        }

        /* Selection summary */
        body.appendChild(el("div", "te-section-title", "Your selections"));
        var summaryBox = el("div", "te-factors");
        getAllGroups().forEach(function (group) {
          var rowEl = el("div", "te-factor-row");
          var labelText = group.title || group.key;
          labelText = labelText.replace(/\?$/, "");
          rowEl.appendChild(el("span", "", labelText));
          rowEl.appendChild(el("span", "", getSummaryLabel(group)));
          summaryBox.appendChild(rowEl);
        });
        /* Show upload count if any */
        if (STATE.uploads.length > 0) {
          var uploadRow = el("div", "te-factor-row");
          uploadRow.appendChild(el("span", "", "Reference Images"));
          uploadRow.appendChild(el("span", "", STATE.uploads.length + " uploaded"));
          summaryBox.appendChild(uploadRow);
        }
        body.appendChild(summaryBox);
      }

      buildNav(body);

      /* Powered by — on every step */
      var poweredForm = el("div", "te-powered");
      var poweredFormLink = el("a", "", "<span>Powered by</span> Shop Estimator");
      poweredFormLink.href = "https://yarmoluk.github.io/shop-estimator/go.html";
      poweredFormLink.target = "_blank";
      poweredFormLink.rel = "noopener";
      poweredForm.appendChild(poweredFormLink);
      body.appendChild(poweredForm);
    }

    /* ── Calculate & Show Results ── */
    function showResults() {
      var allGroups = getAllGroups();
      var baseGroup = findBaseHoursGroup();
      var artistGroup = findArtistGroup();

      if (!baseGroup) {
        console.error("[Estimator Engine] No base hours group found in config.");
        return;
      }

      var baseOpt = baseGroup.options[STATE[baseGroup.key]];
      var baseHours = baseOpt.hours;

      /* Determine hourly rate — from artist selector or config default */
      var effectiveHourly = CFG.hourly;
      var selectedArtist = null;
      var isFlatRate = false;
      var flatRatePrice = 0;

      if (artistGroup) {
        selectedArtist = artistGroup.artists[STATE[artistGroup.key]];
        if (selectedArtist.rateType === "flat") {
          isFlatRate = true;
          /* For flat-rate artists, pick the rate tier closest to estimated hours */
          var rates = selectedArtist.rates;
          flatRatePrice = rates[0].price; /* default to first */
          for (var ri = 0; ri < rates.length; ri++) {
            if (rates[ri].maxHours && baseHours <= rates[ri].maxHours) {
              flatRatePrice = rates[ri].price;
              break;
            }
            flatRatePrice = rates[ri].price; /* fallback to last */
          }
        } else {
          effectiveHourly = selectedArtist.hourly || CFG.hourly;
        }
      }

      var baseCost = isFlatRate ? flatRatePrice : (baseHours * effectiveHourly);

      /* Calculate total multiplier from all other groups */
      var totalMult = 1.0;
      var factorRows = [];

      allGroups.forEach(function (group) {
        if (group.type === "select") {
          var opt = group.options[STATE[group.key]];
          if (typeof opt.hours === "number") {
            factorRows.push({
              label: group.title ? group.title.replace(/\?$/, "") : group.key,
              value: opt.label,
              detail: opt.hours + " hrs base"
            });
          } else if (typeof opt.mult === "number") {
            totalMult *= opt.mult;
            var pct = opt.mult > 1 ? "+" + Math.round((opt.mult - 1) * 100) + "%" :
                      opt.mult < 1 ? "-" + Math.round((1 - opt.mult) * 100) + "%" : "Standard";
            factorRows.push({
              label: group.title ? group.title.replace(/\?$/, "") : group.key,
              value: opt.label,
              detail: pct
            });
          }
        } else if (group.type === "multiselect") {
          /* For multiselect: use the highest multiplier among selected options */
          var selected = STATE[group.key];
          var maxMult = 1.0;
          var selectedLabels = [];
          selected.forEach(function (idx) {
            var opt = group.options[idx];
            selectedLabels.push(opt.label);
            if (typeof opt.mult === "number" && opt.mult > maxMult) {
              maxMult = opt.mult;
            }
          });
          /* If combining styles, add a small stacking bonus per extra style */
          if (selected.length > 1) {
            maxMult += (selected.length - 1) * 0.05;
          }
          totalMult *= maxMult;
          var mPct = maxMult > 1 ? "+" + Math.round((maxMult - 1) * 100) + "%" : "Standard";
          factorRows.push({
            label: group.title ? group.title.replace(/\?$/, "") : group.key,
            value: selectedLabels.join(", "),
            detail: mPct
          });
        } else if (group.type === "toggle") {
          var isOn = STATE[group.key];
          var mult = isOn ? group.mult_on : group.mult_off;
          totalMult *= mult;
          if (isOn && group.mult_on > 1) {
            factorRows.push({
              label: group.title || group.key,
              value: "Yes",
              detail: "+" + Math.round((group.mult_on - 1) * 100) + "%"
            });
          }
        } else if (group.type === "artist") {
          var a = group.artists[STATE[group.key]];
          factorRows.push({
            label: "Artist",
            value: a.name,
            detail: isFlatRate ? "Flat rate" : ("$" + a.hourly + "/hr")
          });
        }
      });

      var estimated = baseCost * totalMult;
      var low, high;

      if (isFlatRate) {
        /* Flat-rate: show the rate as-is with smaller variance */
        low = roundTo10(estimated * 0.9);
        high = roundTo10(estimated * 1.1);
      } else {
        low = roundTo10(estimated * 0.75);
        high = roundTo10(estimated * 1.25);
      }
      if (low < CFG.minimum) low = CFG.minimum;
      if (high < CFG.minimum) high = CFG.minimum;

      var totalHours = baseHours * totalMult;
      var maxSession = CFG.maxSession || 4;
      var sessions = Math.ceil(totalHours / maxSession);

      var cur = config.currency || "$";

      /* ── Render Results ── */
      root.innerHTML = "";

      var header = el("div", "te-header");
      header.appendChild(el("h2", "", CFG.shop));
      header.appendChild(el("p", "", "Your Estimate"));
      root.appendChild(header);

      var body = el("div", "te-body");
      root.appendChild(body);

      /* Price Range */
      var priceBox = el("div", "te-result-price");
      priceBox.appendChild(el("p", "te-range",
        "<span class='te-range-accent'>" + cur + low + "</span> &ndash; <span class='te-range-accent'>" + cur + high + "</span>"));

      var baseText = "";
      if (isFlatRate) {
        baseText = selectedArtist.name + " &middot; Flat rate pricing<br><em>Final quote requires consultation</em>";
      } else {
        baseText = "Estimated " + totalHours.toFixed(1) + " hours @ " + cur + effectiveHourly + "/hr";
        if (selectedArtist) baseText += " (" + selectedArtist.name + ")";
        baseText += "<br><em>Final quote requires consultation</em>";
      }
      priceBox.appendChild(el("p", "te-base", baseText));
      body.appendChild(priceBox);

      /* Multi-session flag */
      if (sessions > 1) {
        var flag = el("div", "te-multi-session-flag");
        flag.innerHTML = '<div class="te-flag-icon">\u23f0</div>' +
          '<div class="te-flag-text"><strong>This will likely require ' + sessions + ' sessions</strong> (max ' + maxSession + ' hrs each).<br>' +
          'Total estimated time: ' + totalHours.toFixed(1) + ' hours with adequate rest between sessions.' +
          (sessions >= 3 ? '<br>Large projects are often scheduled as a series \u2014 your artist will create a session plan.' : '') + '</div>';
        body.appendChild(flag);
      } else {
        var sessBox = el("div", "te-sessions");
        sessBox.appendChild(el("h4", "", "Single Session"));
        sessBox.appendChild(el("p", "", "This can likely be completed in <strong>one session</strong> (~" + totalHours.toFixed(1) + " hrs). Block " + Math.ceil(totalHours + 0.5) + " hours including prep and breaks."));
        body.appendChild(sessBox);
      }

      /* Price Factors */
      var factors = el("div", "te-factors");
      factors.appendChild(el("h4", "", "Price Factors"));
      factorRows.forEach(function (r) {
        var rowEl = el("div", "te-factor-row");
        rowEl.appendChild(el("span", "", r.label));
        rowEl.appendChild(el("span", "", r.detail));
        factors.appendChild(rowEl);
      });
      body.appendChild(factors);

      /* Reference image reminder */
      if (config.referencePrompt) {
        var rp = config.referencePrompt;
        var refReminder = el("div", "te-ref-reminder");
        refReminder.innerHTML = '<div class="te-ref-reminder-icon">' + (rp.icon || "\ud83d\udcf7") + '</div>' +
          '<div class="te-ref-reminder-text"><strong>' + rp.title + '</strong> ' + rp.text + '</div>';
        body.appendChild(refReminder);
      }

      /* Upload summary on results */
      if (STATE.uploads.length > 0) {
        var uploadSummary = el("div", "te-ref-reminder");
        uploadSummary.innerHTML = '<div class="te-ref-reminder-icon">\ud83d\uddbc\ufe0f</div>' +
          '<div class="te-ref-reminder-text"><strong>' + STATE.uploads.length + ' reference image' + (STATE.uploads.length > 1 ? 's' : '') + ' ready.</strong> Bring ' + (STATE.uploads.length > 1 ? 'these' : 'this') + ' to your consultation for your artist to review.</div>';
        body.appendChild(uploadSummary);
      }

      /* Custom disclaimer */
      if (config.customDisclaimer) {
        var discBox = el("div", "te-custom-disclaimer");
        discBox.innerHTML = config.customDisclaimer;
        body.appendChild(discBox);
      }

      /* Booking CTA */
      if (CFG.booking) {
        var bookBtn = el("a", "te-btn te-btn-book", "Get Your Exact Quote \u2192");
        bookBtn.href = CFG.booking;
        bookBtn.target = "_blank";
        bookBtn.rel = "noopener noreferrer";
        body.appendChild(bookBtn);
      }

      /* Products / Aftercare */
      if (config.products && config.products.length > 0) {
        var aftercare = el("div", "te-aftercare");
        aftercare.appendChild(el("h4", "", config.productsTitle || "Recommended Products"));
        config.products.forEach(function (p) {
          var card = el("div", "te-product");
          var info = el("div", "te-product-info");
          info.appendChild(el("div", "te-product-name", p.name));
          info.appendChild(el("div", "te-product-desc", p.desc));
          card.appendChild(info);
          var link = el("a", "te-product-link", p.price);
          link.href = p.url;
          link.target = "_blank";
          link.rel = "noopener noreferrer sponsored";
          card.appendChild(link);
          aftercare.appendChild(card);
        });
        body.appendChild(aftercare);
      }

      /* Recalculate */
      var recalc = el("button", "te-btn te-btn-outline", "\u2190 Start Over");
      recalc.addEventListener("click", function () {
        STATE.step = 0;
        buildForm();
      });
      body.appendChild(recalc);

      /* Disclaimer */
      if (config.disclaimer) {
        body.appendChild(el("div", "te-disclaimer", config.disclaimer));
      }

      /* Powered by */
      var powered = el("div", "te-powered");
      var poweredLink = el("a", "", "<span>Powered by</span> Shop Estimator");
      poweredLink.href = "https://yarmoluk.github.io/shop-estimator/go.html";
      poweredLink.target = "_blank";
      poweredLink.rel = "noopener";
      powered.appendChild(poweredLink);
      body.appendChild(powered);
    }

    /* ── Start ── */
    STATE.step = 0;
    buildForm();
  }

  /* ══════════════════════════════════════════════════════════
     INIT — resolve config, then create estimator
     ══════════════════════════════════════════════════════════ */

  function init() {
    resolveConfig(function (config) {
      if (config) {
        createEstimator(config);
      } else {
        console.error("[Estimator Engine] Could not load config. Widget not rendered.");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
