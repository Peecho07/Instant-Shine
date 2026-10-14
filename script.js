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

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
