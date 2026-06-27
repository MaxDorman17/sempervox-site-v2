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

  // ── Typewriter effect ────────────────────────────────────
  var typeEl = document.getElementById("typewriter");
  var cursorEl = document.querySelector(".typing-cursor");
  if (typeEl) {
    var text = "every single day.";
    var i = 0;
    setTimeout(function () {
      var interval = setInterval(function () {
        if (i < text.length) {
          typeEl.textContent += text[i];
          i++;
        } else {
          clearInterval(interval);
          // keep cursor blinking for 3s then hide it
          if (cursorEl) setTimeout(function () { cursorEl.style.display = "none"; }, 3000);
        }
      }, 75);
    }, 700);
  }

  // ── Canvas particle network ──────────────────────────────
  var canvas = document.getElementById("particlesCanvas");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var COUNT = 75;
    var CONNECT_DIST = 130;

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    for (var n = 0; n < COUNT; n++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r:  Math.random() * 1.5 + 0.8
      });
    }

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            var alpha = (1 - dist / CONNECT_DIST) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = "rgba(124,58,237," + alpha + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(160,110,255,0.55)";
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      requestAnimationFrame(drawFrame);
    }
    drawFrame();
  }

  // ── Hero parallax ────────────────────────────────────────
  var heroBg = document.getElementById("heroBg");
  if (heroBg) {
    window.addEventListener("scroll", function () {
      heroBg.style.transform = "translateY(" + (window.scrollY * 0.3) + "px)";
    }, { passive: true });
  }

  // ── Cursor glow ──────────────────────────────────────────
  var glow = document.getElementById("cursorGlow");
  if (glow && window.matchMedia("(pointer: fine)").matches) {
    var mx = window.innerWidth / 2;
    var my = window.innerHeight / 2;
    var gx = mx, gy = my;

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
    });

    (function animateGlow() {
      gx += (mx - gx) * 0.09;
      gy += (my - gy) * 0.09;
      glow.style.left = gx + "px";
      glow.style.top  = gy + "px";
      requestAnimationFrame(animateGlow);
    })();
  }

  // ── 3D card tilt ─────────────────────────────────────────
  document.querySelectorAll(".service-v2-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top  + rect.height / 2;
      var dx = (e.clientX - cx) / (rect.width  / 2);
      var dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform =
        "perspective(900px) rotateY(" + (dx * 7) + "deg) rotateX(" + (-dy * 7) + "deg) translateY(-6px)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  // ── Scroll fade-in ───────────────────────────────────────
  var fadeEls = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(function (el) { io.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // ── Stat counter ─────────────────────────────────────────
  var counters = document.querySelectorAll(".stat-v2-num[data-count]");
  var counted  = false;
  function runCounters() {
    if (counted) return;
    counted = true;
    counters.forEach(function (el) {
      var target   = parseInt(el.getAttribute("data-count"), 10);
      var suffix   = el.getAttribute("data-suffix") || "";
      var start    = performance.now();
      var duration = 1400;
      function tick(now) {
        var t = Math.min((now - start) / duration, 1);
        var e = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(e * target) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  if (counters.length && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { runCounters(); so.disconnect(); }
    }, { threshold: 0.3 });
    var band = document.querySelector(".stats-band");
    if (band) so.observe(band);
  }

});
