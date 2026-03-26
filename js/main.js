(function () {
  "use strict";

  var root = document.documentElement;
  var storageKey = "theme-preference";
  var header = document.querySelector(".site-header");
  var nav = document.querySelector(".site-nav");
  var menuToggle = document.querySelector(".menu-toggle");
  var themeToggles = document.querySelectorAll(".theme-toggle");
  var navLinks = document.querySelectorAll(".nav-links a");
  var bottomTabBar = document.querySelector(".bottom-tab-bar");
  var moreTabBtn = document.getElementById("more-tab-btn");
  var moreSheet = document.getElementById("more-sheet");
  var moreBackdrop = document.getElementById("more-sheet-backdrop");
  var roadmapNodes = document.querySelectorAll(".roadmap-node");
  var favicon = document.querySelector('link[data-dynamic-favicon]');
  var themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  var lastScrollY = window.scrollY;
  var scrollStopTimer;
  var scrollChromeRaf = null;
  var heroResizeTimer;
  var chromeRevealDelay = 820;
  var scrollTolerance = 12;
  var touchActive = false;
  var reduceMotionMql = window.matchMedia("(prefers-reduced-motion: reduce)");

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function getStoredTheme() {
    var v = localStorage.getItem(storageKey);
    if (v === "light" || v === "dark" || v === "auto") return v;
    return "auto";
  }

  function applyTheme(theme) {
    var pref = theme === "light" || theme === "dark" ? theme : "auto";
    root.dataset.themePreference = pref;

    if (theme === "light" || theme === "dark") {
      root.dataset.theme = theme;
    } else {
      root.removeAttribute("data-theme");
    }

    syncFavicon(theme);
    var resolved = theme === "light" || theme === "dark" ? theme : getSystemTheme();
    syncBottomTabLogos(resolved);
  }

  function syncFavicon(theme) {
    if (!favicon) return;
    var resolvedTheme = theme === "light" || theme === "dark" ? theme : getSystemTheme();
    favicon.href = resolvedTheme === "dark"
      ? "assets/branding/moji-dark-mode.svg"
      : "assets/branding/moji-light-mode.svg";
  }

  // Sync Moji logo images in the bottom tab bar to match the current theme
  function syncBottomTabLogos(resolvedTheme) {
    if (!bottomTabBar) return;
    var actual = resolvedTheme === "light" || resolvedTheme === "dark" ? resolvedTheme : getSystemTheme();
    var lightImgs = bottomTabBar.querySelectorAll(".bottom-tab-logo-light");
    var darkImgs  = bottomTabBar.querySelectorAll(".bottom-tab-logo-dark");
    lightImgs.forEach(function (img) { img.style.display = actual === "dark" ? "none" : "block"; });
    darkImgs.forEach(function  (img) { img.style.display = actual === "dark" ? "block" : "none"; });
  }

  function themeMeta(theme) {
    if (theme === "light") return { label: "Appearance: Light" };
    if (theme === "dark") return { label: "Appearance: Dark" };
    return { label: "Appearance: Automatic" };
  }

  function syncThemeToggle(theme) {
    if (!themeToggles.length) return;
    var stored = theme === "light" || theme === "dark" || theme === "auto" ? theme : "auto";
    var meta = themeMeta(stored);
    themeToggles.forEach(function (toggle) {
      toggle.setAttribute("aria-label", meta.label);
      toggle.setAttribute("title", meta.label);
    });
  }

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }

  function updateTheme(theme) {
    localStorage.setItem(storageKey, theme);
    applyTheme(theme);
    syncThemeToggle(theme);
  }

  function cycleTheme() {
    var themes = ["auto", "light", "dark"];
    var current = getStoredTheme();
    if (themes.indexOf(current) === -1) current = "auto";
    var index = themes.indexOf(current);
    var next = themes[(index + 1) % themes.length];
    updateTheme(next);
  }

  applyTheme(getStoredTheme());
  syncThemeToggle(getStoredTheme());

  // ── More Sheet (bottom tab bar "More" popover) ────────────────
  function openMoreSheet() {
    if (!moreSheet || !moreBackdrop || !moreTabBtn) return;
    moreSheet.classList.add("open");
    moreBackdrop.classList.add("open");
    moreTabBtn.setAttribute("aria-expanded", "true");
    moreBackdrop.removeAttribute("aria-hidden");
    var focusable = moreSheet.querySelectorAll("a, button");
    if (focusable.length) focusable[0].focus();
  }

  function closeMoreSheet() {
    if (!moreSheet || !moreBackdrop || !moreTabBtn) return;
    moreSheet.classList.remove("open");
    moreBackdrop.classList.remove("open");
    moreTabBtn.setAttribute("aria-expanded", "false");
    moreBackdrop.setAttribute("aria-hidden", "true");
    moreTabBtn.focus();
  }

  if (moreTabBtn) {
    moreTabBtn.addEventListener("click", function () {
      var isOpen = moreSheet && moreSheet.classList.contains("open");
      if (isOpen) closeMoreSheet(); else openMoreSheet();
    });
  }

  if (moreBackdrop) {
    moreBackdrop.addEventListener("click", closeMoreSheet);
  }

  if (moreSheet) {
    moreSheet.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMoreSheet);
    });
  }
  // ─────────────────────────────────────────────────────────────

  function syncHeroVisualHeight() {
    var heroCopy   = document.querySelector(".home-hero .hero-copy");
    var heroVisual = document.querySelector(".home-hero .hero-visual");
    if (!heroCopy || !heroVisual || window.innerWidth <= 1024) {
      heroVisual && heroVisual.style.removeProperty("height");
      return;
    }
    heroVisual.style.height = heroCopy.offsetHeight + "px";
  }

  if (document.querySelector(".home-hero")) {
    syncHeroVisualHeight();
    function scheduleHeroVisualResize() {
      window.clearTimeout(heroResizeTimer);
      heroResizeTimer = window.setTimeout(syncHeroVisualHeight, 80);
    }
    window.addEventListener("resize", scheduleHeroVisualResize);
    if ("ResizeObserver" in window) {
      var heroCopy = document.querySelector(".home-hero .hero-copy");
      if (heroCopy) {
        new ResizeObserver(scheduleHeroVisualResize).observe(heroCopy);
      }
    }
  }

  function showMobileChrome() {
    root.classList.remove("mobile-top-chrome-hidden");
    root.classList.remove("tab-bar-hidden");
  }

  function hideMobileChrome() {
    if (reduceMotionMql.matches) return;
    /* Don’t collapse chrome while a bottom-sheet is open — avoids fighting taps and focus */
    if (moreSheet && moreSheet.classList.contains("open")) return;
    if (window.innerWidth <= 1024) {
      root.classList.add("mobile-top-chrome-hidden");
    }
    if (bottomTabBar && window.innerWidth <= 1024) {
      root.classList.add("tab-bar-hidden");
    }
  }

  function queueMobileChromeReveal() {
    window.clearTimeout(scrollStopTimer);
    scrollStopTimer = window.setTimeout(function () {
      if (!touchActive) showMobileChrome();
    }, chromeRevealDelay);
  }

  function syncScrollChrome() {
    var currentY = window.scrollY;
    var deltaY   = currentY - lastScrollY;

    window.clearTimeout(scrollStopTimer);

    if (header) {
      var scrolled = window.innerWidth > 1024 && currentY > 24;
      /* Avoid redundant class churn (layout/style invalidation) when value unchanged */
      if (header.classList.contains("scrolled") !== scrolled) {
        header.classList.toggle("scrolled", scrolled);
      }
    }

    if (window.innerWidth > 1024) {
      showMobileChrome();
      lastScrollY = currentY;
      return;
    }

    if (reduceMotionMql.matches) {
      showMobileChrome();
      lastScrollY = currentY;
      return;
    }

    if (currentY <= 24) {
      showMobileChrome();
      lastScrollY = currentY;
      return;
    }

    /* HIG-style: hide on scroll down, show immediately on scroll up */
    if (deltaY <= -scrollTolerance) {
      showMobileChrome();
      lastScrollY = currentY;
      return;
    }

    if (deltaY >= scrollTolerance) {
      hideMobileChrome();
    }

    if (!touchActive) {
      queueMobileChromeReveal();
    }

    lastScrollY = currentY;
  }

  function scheduleScrollChrome() {
    if (scrollChromeRaf !== null) return;
    scrollChromeRaf = window.requestAnimationFrame(function () {
      scrollChromeRaf = null;
      syncScrollChrome();
    });
  }

  window.addEventListener("scroll", scheduleScrollChrome, { passive: true });
  window.addEventListener("resize", function () {
    applyTheme(getStoredTheme());
    syncThemeToggle(getStoredTheme());
    scheduleScrollChrome();
  });
  syncScrollChrome();

  /*
   * Never hide the tab bar on generic touchstart — that ran before click/tap completed,
   * applied pointer-events: none, and broke tab selection (HIG: primary tab bar must stay tappable).
   * Hide only from real scroll intent in syncScrollChrome.
   */
  window.addEventListener("touchstart", function (event) {
    if (window.innerWidth > 1024) return;
    if (reduceMotionMql.matches) return;
    var t = event.touches && event.touches[0];
    if (t && root.classList.contains("tab-bar-hidden")) {
      var fromBottom = window.innerHeight - t.clientY;
      /* Approx. tab bar + home indicator: first tap brings chrome back */
      if (fromBottom <= 88) showMobileChrome();
    }
    touchActive = true;
    window.clearTimeout(scrollStopTimer);
    if (bottomTabBar && bottomTabBar.contains(event.target)) {
      showMobileChrome();
    }
  }, { passive: true });

  function releaseTouchChrome() {
    if (window.innerWidth > 1024) return;
    touchActive = false;
    if (window.scrollY <= 24) { showMobileChrome(); return; }
    queueMobileChromeReveal();
  }

  window.addEventListener("touchend",   releaseTouchChrome, { passive: true });
  window.addEventListener("touchcancel", releaseTouchChrome, { passive: true });

  themeMedia.addEventListener("change", function () {
    if (getStoredTheme() === "auto") {
      applyTheme(getStoredTheme());
      syncThemeToggle(getStoredTheme());
    }
  });

  if (typeof reduceMotionMql.addEventListener === "function") {
    reduceMotionMql.addEventListener("change", function () {
      if (reduceMotionMql.matches) showMobileChrome();
    });
  } else if (typeof reduceMotionMql.addListener === "function") {
    reduceMotionMql.addListener(function () {
      if (reduceMotionMql.matches) showMobileChrome();
    });
  }

  // Keyboard: Escape closes sheet and menu
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (moreSheet && moreSheet.classList.contains("open")) closeMoreSheet();
      closeMenu();
    }
  });

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) closeMenu();
    });
  }

  themeToggles.forEach(function (toggle) {
    toggle.addEventListener("click", cycleTheme);
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  function activateRoadmap(target) {
    if (!roadmapNodes.length) return;
    roadmapNodes.forEach(function (node) {
      var isActive = node.getAttribute("data-roadmap-target") === target;
      node.classList.toggle("is-active", isActive);
      node.setAttribute("aria-pressed", String(isActive));
      node.setAttribute("tabindex", isActive ? "0" : "-1");
    });
  }

  if (roadmapNodes.length) {
    roadmapNodes.forEach(function (node, index) {
      node.setAttribute("tabindex", node.classList.contains("is-active") ? "0" : "-1");

      node.addEventListener("click",      function () { activateRoadmap(node.getAttribute("data-roadmap-target")); });
      node.addEventListener("mouseenter", function () {
        if (window.matchMedia("(hover: hover)").matches) {
          activateRoadmap(node.getAttribute("data-roadmap-target"));
        }
      });
      node.addEventListener("focus", function () { activateRoadmap(node.getAttribute("data-roadmap-target")); });

      node.addEventListener("keydown", function (event) {
        var nextIndex = index;
        if      (event.key === "ArrowDown"  || event.key === "ArrowRight") nextIndex = (index + 1) % roadmapNodes.length;
        else if (event.key === "ArrowUp"    || event.key === "ArrowLeft")  nextIndex = (index - 1 + roadmapNodes.length) % roadmapNodes.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End")  nextIndex = roadmapNodes.length - 1;
        else return;
        event.preventDefault();
        activateRoadmap(roadmapNodes[nextIndex].getAttribute("data-roadmap-target"));
        roadmapNodes[nextIndex].focus();
      });
    });

    if ("IntersectionObserver" in window) {
      var roadmapObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) activateRoadmap(entry.target.getAttribute("data-roadmap-target"));
          });
        },
        { threshold: 0.65, rootMargin: "-10% 0px -20% 0px" }
      );
      roadmapNodes.forEach(function (node) { roadmapObserver.observe(node); });
    }
  }

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach(function (item) {
      if (item.closest(".home-hero")) {
        item.classList.add("in-view");
        return;
      }
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) { item.classList.add("in-view"); });
  }
})();
