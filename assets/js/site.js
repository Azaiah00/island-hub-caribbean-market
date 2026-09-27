/* Island Hub Caribbean Market — site interactions (vanilla, no dependencies) */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header state ---------- */
  var header = document.querySelector(".site-header");

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
    menu.classList.toggle("is-open", open);
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) {
      var first = menu.querySelector("a");
      if (first) first.focus();
    }
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuBtn.focus();
      }
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) setMenu(false);
    });
  }

  /* ---------- Reveal / swing / pop on enter ---------- */
  var targets = document.querySelectorAll(".reveal, .swing, .pop");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add("in"); });
  }

  /* ---------- Scroll-linked motion (bunting lift, barrel voyage) ---------- */
  var bunting = document.querySelector(".bunting");
  var scenes = [];
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function measureScene(s) {
    var el = s.el;
    var W = el.clientWidth, H = el.clientHeight;
    var b = s.barrel.offsetWidth;
    var boatW = s.boat.offsetWidth, boatH = s.boat.offsetHeight;
    var landEl = el.querySelector(".scene-land");
    var landEnd = landEl ? landEl.offsetWidth : W * 0.34;
    var store = el.querySelector(".scene-store");
    var x0 = (store && store.offsetParent) ? store.offsetLeft + store.offsetWidth + 8 : W * 0.03;
    var islandsW = Math.min(W * 0.34, 360);
    s.m = {
      W: W, H: H, b: b, boatW: boatW, boatH: boatH,
      x0: Math.min(x0, landEnd - b * 1.8),
      xEdge: landEnd - b * 0.85,
      landY: H * 0.44,
      boatBottom: H * 0.30 - 12,
      deckY: H * 0.30 - 12 + boatH * (50 / 90),
      boatStart: landEnd + W * 0.03 + 6,
      boatEnd: Math.max(landEnd + W * 0.03 + 6, W - islandsW - boatW * 0.62)
    };
  }

  function renderScene(s, p) {
    var m = s.m;
    var bx, by, rot, boatX = m.boatStart, boatRot = 0, boatY = 0;
    var deckX = function (bxBoat) { return bxBoat + m.boatW * 0.5 - m.b / 2; };
    if (p < 0.42) {
      var a = p / 0.42;
      bx = lerp(m.x0, m.xEdge, easeInOut(a));
      by = m.landY;
      rot = ((bx - m.x0) / (Math.PI * m.b)) * 360;
    } else if (p < 0.56) {
      var t = (p - 0.42) / 0.14;
      var endX = deckX(m.boatStart);
      bx = lerp(m.xEdge, endX, t);
      var arc = Math.sin(t * Math.PI) * m.b * 0.45;
      by = lerp(m.landY, m.deckY, t * t) + arc;
      rot = ((m.xEdge - m.x0) / (Math.PI * m.b)) * 360 + t * 90;
      if (t > 0.92) boatY = -3 * (1 - (t - 0.92) / 0.08);
    } else {
      var c = easeInOut((p - 0.56) / 0.44);
      boatX = lerp(m.boatStart, m.boatEnd, c);
      boatRot = Math.sin(c * Math.PI * 5) * 1.6;
      boatY = Math.sin(c * Math.PI * 5) * 2;
      bx = deckX(boatX);
      by = m.deckY + boatY * -1;
      rot = ((m.xEdge - m.x0) / (Math.PI * m.b)) * 360 + 90 + boatRot;
    }
    s.boat.style.transform = "translate3d(" + boatX.toFixed(1) + "px," + boatY.toFixed(1) + "px,0) rotate(" + boatRot.toFixed(2) + "deg)";
    s.barrel.style.transform = "translate3d(" + bx.toFixed(1) + "px," + (-by).toFixed(1) + "px,0) rotate(" + rot.toFixed(1) + "deg)";
  }

  if (!reduceMotion) {
    document.querySelectorAll(".scene").forEach(function (el) {
      var s = { el: el, boat: el.querySelector(".scene-boat"), barrel: el.querySelector(".scene-barrel") };
      if (!s.boat || !s.barrel) return;
      el.classList.add("is-live");
      scenes.push(s);
    });
  }

  var ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (bunting && !reduceMotion) {
      bunting.style.setProperty("--lift", clamp(y / 320, 0, 1).toFixed(3));
    }
    var vh = window.innerHeight;
    scenes.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      // 0 when the scene has fully entered at the bottom, 1 when its top nears the header
      var startB = vh * 0.98, endT = vh * 0.14;
      var span = Math.max(120, startB - r.height - endT);
      var p = clamp((startB - r.bottom) / span, 0, 1);
      renderScene(s, p);
    });
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(frame); }
  }
  function onResize() {
    scenes.forEach(measureScene);
    onScroll();
  }
  scenes.forEach(measureScene);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("load", onResize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);
  frame();

  /* ---------- Open now (America/New_York) ---------- */
  // Hours from the store's Instagram bio: Mon–Wed 9–8, Thu–Sat 9–9, Sun 9–5
  var HOURS = { 0: [9, 17], 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 21], 5: [9, 21], 6: [9, 21] };
  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function fmt(h) { var s = h >= 12 ? "pm" : "am"; var hh = h % 12 || 12; return hh + s; }
  function nowNY() {
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var dayIdx = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(map.weekday);
      var hour = parseInt(map.hour, 10) % 24;
      var minute = parseInt(map.minute, 10);
      return { day: dayIdx, mins: hour * 60 + minute };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var n = nowNY();
  if (n.day >= 0) {
    var today = HOURS[n.day];
    var isOpen = n.mins >= today[0] * 60 && n.mins < today[1] * 60;
    var msg;
    if (isOpen) {
      msg = "Open now until " + fmt(today[1]) + " today";
    } else if (n.mins < today[0] * 60) {
      msg = "Closed now. Opens today at " + fmt(today[0]);
    } else {
      var next = (n.day + 1) % 7;
      msg = "Closed now. Opens " + DAY_NAMES[next] + " at " + fmt(HOURS[next][0]);
    }
    document.querySelectorAll("[data-open-status]").forEach(function (el) {
      var txt = el.querySelector("[data-open-text]");
      if (txt) txt.textContent = msg;
      el.classList.add(isOpen ? "is-open" : "is-closed");
    });
    document.querySelectorAll("[data-day]").forEach(function (row) {
      if (row.getAttribute("data-day").split(",").indexOf(String(n.day)) > -1) {
        row.classList.add("is-today");
        var lab = row.querySelector("th, span");
        if (lab && !row.querySelector(".today-flag")) {
          var f = document.createElement("span");
          f.className = "visually-hidden today-flag";
          f.textContent = " (today)";
          lab.appendChild(f);
        }
      }
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Netlify forms: validation + async submit ---------- */
  function fieldWrap(input) { return input.closest(".field"); }
  function setError(input, message) {
    var wrap = fieldWrap(input);
    if (!wrap) return;
    var err = wrap.querySelector(".err");
    wrap.classList.toggle("has-error", !!message);
    if (err) err.textContent = message || "";
    if (input.setAttribute) input.setAttribute("aria-invalid", message ? "true" : "false");
  }
  function validate(form) {
    var firstBad = null;
    form.querySelectorAll("[data-validate]").forEach(function (input) {
      var v = (input.value || "").trim();
      var msg = "";
      var rule = input.getAttribute("data-validate");
      if (rule.indexOf("required") > -1 && !v) msg = input.getAttribute("data-msg") || "This field is required.";
      if (!msg && v && rule.indexOf("email") > -1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Enter a valid email address.";
      if (!msg && v && rule.indexOf("phone") > -1 && v.replace(/\D/g, "").length < 10) msg = "Enter a 10-digit phone number.";
      setError(input, msg);
      if (msg && !firstBad) firstBad = input;
    });
    form.querySelectorAll("[data-validate-group]").forEach(function (group) {
      var checked = group.querySelector("input:checked");
      var err = group.querySelector(".err");
      var bad = !checked;
      group.classList.toggle("has-error", bad);
      if (err) err.textContent = bad ? (group.getAttribute("data-msg") || "Choose one option.") : "";
      if (bad && !firstBad) firstBad = group.querySelector("input");
    });
    // Contact: need phone or email
    if (form.hasAttribute("data-need-contact")) {
      var ph = form.querySelector("[name=phone]"), em = form.querySelector("[name=email]");
      if (ph && em && !ph.value.trim() && !em.value.trim()) {
        setError(ph, "Add a phone number or an email so we can reply.");
        if (!firstBad) firstBad = ph;
      }
    }
    // Pickup address required if pickup = yes
    var pickupYes = form.querySelector("input[name=pickup][value=Yes]");
    var pickupAddr = form.querySelector("[name=pickup-address]");
    if (pickupYes && pickupAddr) {
      if (pickupYes.checked && !pickupAddr.value.trim()) {
        setError(pickupAddr, "Add the pickup address or ZIP code.");
        if (!firstBad) firstBad = pickupAddr;
      } else if (!pickupYes.checked) {
        setError(pickupAddr, "");
      }
    }
    return firstBad;
  }
  document.querySelectorAll("form[data-netlify]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    form.addEventListener("input", function (e) {
      var w = fieldWrap(e.target);
      if (w && w.classList.contains("has-error")) setError(e.target, "");
    });
    form.addEventListener("change", function (e) {
      var g = e.target.closest("[data-validate-group]");
      if (g) { g.classList.remove("has-error"); var er = g.querySelector(".err"); if (er) er.textContent = ""; }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = validate(form);
      var status = form.querySelector("[data-form-status]");
      if (bad) {
        bad.focus();
        if (status) status.textContent = "Please fix the highlighted fields.";
        return;
      }
      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending..."; }
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        var success = document.getElementById(form.getAttribute("data-success"));
        form.hidden = true;
        if (success) {
          success.classList.add("is-shown");
          success.setAttribute("tabindex", "-1");
          success.focus();
        }
      }).catch(function () {
        if (status) status.textContent = "Sorry, the form could not be sent right now. Please call or text (804) 716-5480.";
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
      });
    });
  });
})();
