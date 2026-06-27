document.addEventListener("DOMContentLoaded", function () {

  // ── Mobile nav toggle ────────────────────────────────────
  var burger = document.querySelector(".nav-burger");
  var mobileNav = document.getElementById("mobile-nav");
  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
      mobileNav.setAttribute("aria-hidden", String(!isOpen));
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("aria-hidden", "true");
      });
    });
    document.addEventListener("click", function (e) {
      if (!burger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("aria-hidden", "true");
      }
    });
  }

  // ── Scroll fade-in (Intersection Observer) ───────────────
  var fadeEls = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show everything immediately
    fadeEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // ── Stat counter animation ───────────────────────────────
  var counters = document.querySelectorAll(".stat-v2-num[data-count]");
  var countersDone = false;

  function runCounters() {
    if (countersDone) return;
    countersDone = true;
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1400;
      var start = performance.now();
      function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  if (counters.length && "IntersectionObserver" in window) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    var statsBand = document.querySelector(".stats-band");
    if (statsBand) statsObserver.observe(statsBand);
  }

});
