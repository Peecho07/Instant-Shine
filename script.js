(function () {
  document.documentElement.classList.remove("no-js");

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Tabs (category switcher)
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var tabs = group.querySelectorAll('[role="tab"]');
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus(); select(next);
      });
    });
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    }
  });

  // Vehicle size switcher: swaps every [data-prices] amount
  document.querySelectorAll("[data-size-switch]").forEach(function (group) {
    var buttons = group.querySelectorAll("button");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = Number(btn.dataset.index);
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        document.querySelectorAll("[data-prices]").forEach(function (el) {
          var list = el.dataset.prices.split("|");
          var val = list[Math.min(idx, list.length - 1)];
          el.style.opacity = "0";
          setTimeout(function () { el.textContent = val; el.style.opacity = "1"; }, 120);
        });
      });
    });
  });

  // FAQ accordion
  document.querySelectorAll(".faq-item button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Prefill service from "Book this" buttons
  document.querySelectorAll("[data-book]").forEach(function (link) {
    link.addEventListener("click", function () {
      var select = document.getElementById("service");
      if (!select) return;
      var want = link.dataset.book;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === want) { select.selectedIndex = i; break; }
      }
    });
  });

  // Form: Netlify Forms when deployed there; on static hosts (e.g. GitHub Pages)
  // that can't take a POST, hand the request to the customer's email app instead
  var form = document.querySelector("form[data-booking]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var data = new URLSearchParams(fd).toString();
      var done = function () { form.closest(".form").classList.add("is-sent"); };
      var viaEmail = function () {
        var lines = [];
        fd.forEach(function (v, k) {
          if (k !== "form-name" && k !== "bot-field" && String(v).trim()) lines.push(k + ": " + v);
        });
        window.location.href = "mailto:dvaz185441@yahoo.com?subject=" + encodeURIComponent("Booking request") +
          "&body=" + encodeURIComponent(lines.join("\n"));
        done();
      };
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data })
        .then(function (res) { res.ok ? done() : viaEmail(); })
        .catch(viaEmail);
    });
  }

  // Reveal on scroll
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---- Detailing theme effects ----
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;
  function onView(selector, cls, threshold) {
    var nodes = document.querySelectorAll(selector);
    if (!hasIO) { nodes.forEach(function (n) { n.classList.add(cls); }); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add(cls); obs.unobserve(en.target); }
      });
    }, { threshold: threshold });
    nodes.forEach(function (n) { obs.observe(n); });
  }

  // Gloss reveal and gauge sweep
  onView(".gloss", "is-glossy", 0.25);
  onView(".gauge-stat", "is-live", 0.5);

  // Finish level bars: Clean, Satin, Gloss, Mirror
  var levels = ["Clean", "Satin", "Gloss", "Mirror"];
  document.querySelectorAll(".finish").forEach(function (bar) {
    var lvl = Number(bar.dataset.level) || 1;
    bar.setAttribute("role", "img");
    bar.setAttribute("aria-label", "Finish level: " + levels[lvl - 1] + " (" + lvl + " of 4)");
    bar.innerHTML = levels.map(function (name, i) {
      return '<span class="seg' + (i < lvl ? " on" : "") + '"><b></b><span>' + name + "</span></span>";
    }).join("");
  });

  // Water beading: droplets roll off the top edge of a card on hover
  var beadSpots = [[12, 7, 0], [27, 5, 90], [41, 8, 40], [58, 6, 140], [73, 7, 60], [88, 5, 120]];
  if (!reduce) {
    document.querySelectorAll(".card--interactive").forEach(function (card) {
      var wrap = document.createElement("span");
      wrap.className = "beads";
      wrap.setAttribute("aria-hidden", "true");
      wrap.innerHTML = beadSpots.map(function (b) {
        return '<i style="--x:' + b[0] + "%;--s:" + b[1] + "px;--d:" + b[2] + 'ms"></i>';
      }).join("");
      card.appendChild(wrap);
      card.addEventListener("mouseenter", function () {
        wrap.style.setProperty("--fall", card.offsetHeight + 12 + "px");
      });
    });
  }

  // Process timeline: line fills with the accent as you scroll through it
  var process = document.querySelector(".process");
  if (process) {
    var steps = process.querySelectorAll(".step");
    var update = function () {
      var r = process.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.25)));
      process.style.setProperty("--progress", p.toFixed(3));
      steps.forEach(function (s, i) { s.classList.toggle("is-lit", p >= i / steps.length); });
    };
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // Booking condition selector adjusts the helper text
  var help = document.getElementById("condition-help");
  var conditionText = {
    Light: "Regular upkeep. Dust, light dirt, a few crumbs. Starting prices usually apply.",
    Moderate: "Some stains, pet hair or water spots. We may suggest an add-on, and we'll confirm the price first.",
    Heavy: "Deep stains, heavy pet hair, oxidation or swirl marks. Text us a photo and we'll quote it before we start."
  };
  document.querySelectorAll('input[name="condition"]').forEach(function (r) {
    r.addEventListener("change", function () { if (help && r.checked) help.textContent = conditionText[r.value]; });
  });

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
