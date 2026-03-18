(function () {
  "use strict";

  var root = document.documentElement;
  var storageKey = "theme-preference";
  var header = document.querySelector(".site-header");
  var nav = document.querySelector(".site-nav");
  var menuToggle = document.querySelector(".menu-toggle");
  var themeToggles = document.querySelectorAll(".theme-toggle");
  var navLinks = document.querySelectorAll(".nav-links a");
  var mobileDock = document.querySelector(".mobile-dock");
  var roadmapNodes = document.querySelectorAll(".roadmap-node");
  var favicon = document.querySelector('link[data-dynamic-favicon]');
  var themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  var lastScrollY = window.scrollY;
  var scrollStopTimer;
  var chromeRevealDelay = 1100;
  var scrollTolerance = 6;
  var touchActive = false;

  function isCompactViewport() {
    return window.innerWidth <= 1024;
  }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function normalizeTheme(theme) {
    if (isCompactViewport() && theme !== "light" && theme !== "dark") {
      return getSystemTheme();
    }

    return theme;
  }

  function getStoredTheme() {
    return localStorage.getItem(storageKey) || "auto";
  }

  function applyTheme(theme) {
    var normalizedTheme = normalizeTheme(theme);

    if (normalizedTheme === "light" || normalizedTheme === "dark") {
      root.dataset.theme = normalizedTheme;
    } else {
      root.removeAttribute("data-theme");
    }

    syncFavicon(theme);
  }

  function syncFavicon(theme) {
    if (!favicon) {
      return;
    }

    var resolvedTheme = theme === "light" || theme === "dark" ? theme : getSystemTheme();
    favicon.href = resolvedTheme === "dark"
      ? "assets/branding/moji-dark-mode.svg"
      : "assets/branding/moji-light-mode.svg";
  }

  function themeMeta(theme) {
    if (theme === "light") {
      return { icon: "☀", label: "Switch theme, current light" };
    }

    if (theme === "dark") {
      return { icon: "☾", label: "Switch theme, current dark" };
    }

    return { icon: "◐", label: "Switch theme, current auto" };
  }

  function syncThemeToggle(theme) {
    if (!themeToggles.length) {
      return;
    }

    var meta = themeMeta(normalizeTheme(theme));

    themeToggles.forEach(function (toggle) {
      var icon = toggle.querySelector(".theme-icon");
      if (icon) {
        icon.textContent = meta.icon;
      }

      toggle.setAttribute("aria-label", meta.label);
      toggle.setAttribute("title", meta.label);
    });
  }

  function closeMenu() {
    if (!nav || !menuToggle) {
      return;
    }

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
    var themes = isCompactViewport() ? ["light", "dark"] : ["auto", "light", "dark"];
    var current = isCompactViewport() ? normalizeTheme(getStoredTheme()) : getStoredTheme();
    var index = themes.indexOf(current);
    var next = themes[(index + 1) % themes.length];
    updateTheme(next);
  }

  applyTheme(getStoredTheme());
  syncThemeToggle(getStoredTheme());

  function showMobileChrome() {
    root.classList.remove("mobile-top-chrome-hidden");
    root.classList.remove("mobile-dock-hidden");
  }

  function hideMobileChrome() {
    if (window.innerWidth <= 1024) {
      root.classList.add("mobile-top-chrome-hidden");
    }

    if (mobileDock && window.innerWidth <= 1024) {
      root.classList.add("mobile-dock-hidden");
    }
  }

  function queueMobileChromeReveal() {
    window.clearTimeout(scrollStopTimer);
    scrollStopTimer = window.setTimeout(function () {
      if (!touchActive) {
        showMobileChrome();
      }
    }, chromeRevealDelay);
  }

  function syncScrollChrome() {
    var currentY = window.scrollY;
    var deltaY = currentY - lastScrollY;

    window.clearTimeout(scrollStopTimer);

    if (header) {
      header.classList.toggle("scrolled", window.innerWidth > 1024 && currentY > 24);
    }

    if (window.innerWidth > 1024) {
      showMobileChrome();
      lastScrollY = currentY;
      return;
    }

    if (currentY <= 24) {
      showMobileChrome();
      lastScrollY = currentY;
      return;
    }

    if (touchActive || Math.abs(deltaY) >= scrollTolerance) {
      hideMobileChrome();
    }

    if (!touchActive) {
      queueMobileChromeReveal();
    }

    lastScrollY = currentY;
  }

  if (header) {
    window.addEventListener("scroll", syncScrollChrome, { passive: true });
    window.addEventListener("resize", function () {
      applyTheme(getStoredTheme());
      syncThemeToggle(getStoredTheme());
      syncScrollChrome();
    });
    syncScrollChrome();
  }

  window.addEventListener("touchstart", function () {
    if (window.innerWidth > 1024) {
      return;
    }

    touchActive = true;
    window.clearTimeout(scrollStopTimer);

    if (window.scrollY > 24) {
      hideMobileChrome();
    }
  }, { passive: true });

  function releaseTouchChrome() {
    if (window.innerWidth > 1024) {
      return;
    }

    touchActive = false;

    if (window.scrollY <= 24) {
      showMobileChrome();
      return;
    }

    queueMobileChromeReveal();
  }

  window.addEventListener("touchend", releaseTouchChrome, { passive: true });
  window.addEventListener("touchcancel", releaseTouchChrome, { passive: true });

  themeMedia.addEventListener("change", function () {
    if (getStoredTheme() === "auto") {
      applyTheme(getStoredTheme());
      syncThemeToggle(getStoredTheme());
    }
  });

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  themeToggles.forEach(function (toggle) {
    toggle.addEventListener("click", cycleTheme);
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  function activateRoadmap(target) {
    if (!roadmapNodes.length) {
      return;
    }

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

      node.addEventListener("click", function () {
        activateRoadmap(node.getAttribute("data-roadmap-target"));
      });

      node.addEventListener("mouseenter", function () {
        if (window.matchMedia("(hover: hover)").matches) {
          activateRoadmap(node.getAttribute("data-roadmap-target"));
        }
      });

      node.addEventListener("focus", function () {
        activateRoadmap(node.getAttribute("data-roadmap-target"));
      });

      node.addEventListener("keydown", function (event) {
        var nextIndex = index;

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          nextIndex = (index + 1) % roadmapNodes.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          nextIndex = (index - 1 + roadmapNodes.length) % roadmapNodes.length;
        } else if (event.key !== "Home" && event.key !== "End") {
          return;
        }

        if (event.key === "Home") {
          nextIndex = 0;
        }

        if (event.key === "End") {
          nextIndex = roadmapNodes.length - 1;
        }

        event.preventDefault();
        activateRoadmap(roadmapNodes[nextIndex].getAttribute("data-roadmap-target"));
        roadmapNodes[nextIndex].focus();
      });
    });

    if ("IntersectionObserver" in window) {
      var roadmapObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              activateRoadmap(entry.target.getAttribute("data-roadmap-target"));
            }
          });
        },
        {
          threshold: 0.65,
          rootMargin: "-10% 0px -20% 0px",
        }
      );

      roadmapNodes.forEach(function (node) {
        roadmapObserver.observe(node);
      });
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
      {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("in-view");
    });
  }
})();
