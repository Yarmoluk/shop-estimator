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
    var STEPS = config.steps;
    var TOTAL_STEPS = STEPS.length + 1; /* +1 for summary/confirm step */

    /* ── Build initial state from config ── */
    var STATE = { step: 0 };

    STEPS.forEach(function (step) {
      step.groups.forEach(function (group) {
        if (group.type === "select") {
          STATE[group.key] = (typeof group.default === "number") ? group.default : 0;
        } else if (group.type === "toggle") {
          STATE[group.key] = (typeof group.default === "boolean") ? group.default : false;
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

    /* ── Option Group Builder ── */
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

    /* ── Build summary label for a group selection ── */
    function getSummaryLabel(group) {
      if (group.type === "select") {
        var opt = group.options[STATE[group.key]];
        var label = opt.label;
        /* Truncate long labels for summary */
        if (label.length > 40) label = label.substring(0, 37) + "...";
        return label;
      } else if (group.type === "toggle") {
        return STATE[group.key] ? "Yes" : "No";
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
          } else if (group.type === "toggle") {
            buildToggle(body, group);
          }
        });
      } else {
        /* Summary / confirm step (last virtual step) */
        if (config.referencePrompt) {
          var rp = config.referencePrompt;
          var refBox = el("div", "te-ref-prompt");
          refBox.innerHTML = '<div class="te-ref-icon">' + (rp.icon || "\ud83d\udcf7") + '</div>' +
            '<div class="te-ref-text"><strong>' + rp.title + '</strong><br>' + rp.text + '</div>';
          body.appendChild(refBox);
        }

        /* Selection summary */
        body.appendChild(el("div", "te-section-title", "Your selections"));
        var summaryBox = el("div", "te-factors");
        getAllGroups().forEach(function (group) {
          var rowEl = el("div", "te-factor-row");
          var labelText = group.title || group.key;
          /* Clean up label — remove question marks etc for display */
          labelText = labelText.replace(/\?$/, "");
          rowEl.appendChild(el("span", "", labelText));
          rowEl.appendChild(el("span", "", getSummaryLabel(group)));
          summaryBox.appendChild(rowEl);
        });
        body.appendChild(summaryBox);
      }

      buildNav(body);
    }

    /* ── Calculate & Show Results ── */
    function showResults() {
      var allGroups = getAllGroups();
      var baseGroup = findBaseHoursGroup();

      if (!baseGroup) {
        console.error("[Estimator Engine] No base hours group found in config.");
        return;
      }

      var baseOpt = baseGroup.options[STATE[baseGroup.key]];
      var baseHours = baseOpt.hours;
      var baseCost = baseHours * CFG.hourly;

      /* Calculate total multiplier from all other groups */
      var totalMult = 1.0;
      var factorRows = [];

      allGroups.forEach(function (group) {
        if (group.type === "select") {
          var opt = group.options[STATE[group.key]];
          if (typeof opt.hours === "number") {
            /* This is the base-hours group — show hours, not mult */
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
        }
      });

      var estimated = baseCost * totalMult;
      var low = roundTo10(estimated * 0.75);
      var high = roundTo10(estimated * 1.25);
      if (low < CFG.minimum) low = CFG.minimum;
      if (high < CFG.minimum) high = CFG.minimum;

      var totalHours = baseHours * totalMult;
      var maxSession = 4;
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
      priceBox.appendChild(el("p", "te-base",
        "Estimated " + totalHours.toFixed(1) + " hours @ " + cur + CFG.hourly + "/hr<br><em>Final quote requires consultation</em>"));
      body.appendChild(priceBox);

      /* Multi-session flag */
      if (sessions > 1) {
        var flag = el("div", "te-multi-session-flag");
        flag.innerHTML = '<div class="te-flag-icon">\u23f0</div>' +
          '<div class="te-flag-text"><strong>This will likely require ' + sessions + ' sessions</strong> (max ' + maxSession + ' hrs each).<br>' +
          'Total estimated time: ' + totalHours.toFixed(1) + ' hours with adequate rest between sessions.' +
          (sessions >= 3 ? '<br>Large projects are often scheduled as a series \u2014 your provider will create a session plan.' : '') + '</div>';
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
