(function () {
  "use strict";

  /* ---------------------------------------------------------------------
   * GSAP shared setup (Crest) — only present on pages that load the GSAP
   * CDN scripts (currently crest.html only); every block below that uses
   * GSAP guards on `window.gsap` so this file keeps working unchanged on
   * pages without it. Guards computed once here, reused by every feature.
   * ------------------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger, SplitText);
  }
  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isFinePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (window.gsap && window.ScrollTrigger && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }

  /* ---------------------------------------------------------------------
   * Smooth (inertia) scrolling (Crest) — Lenis driven by GSAP's own
   * ticker instead of its default RAF loop, with ScrollTrigger told to
   * recompute on every Lenis scroll tick so every existing scroll-trigger
   * (reveals, counters, split-text, header show/hide) stays in sync.
   * ------------------------------------------------------------------- */
  if (window.Lenis && window.gsap && !prefersReducedMotion) {
    var lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------------------------------------------------------------
   * Swipers — only initialized when their container is present on the
   * page, so pages that don't use a given carousel (e.g. about.html has
   * no hero/projects/testimonial swiper) don't throw and halt this script.
   * ------------------------------------------------------------------- */
  if (document.querySelector(".hero-swiper")) {
    var heroSwiper = new Swiper(".hero-swiper", {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 4000,
      loop: true,
      observer: true,
      observeParents: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: {
        el: ".hero-pagination",
        clickable: true,
        bulletClass: "hero-dot",
        bulletActiveClass: "swiper-pagination-bullet-active",
        bulletElement: "button",
      },
    });
    // Large hero images can still be settling their final layout box after
    // Swiper's initial slide-width measurement — force one more recompute
    // once everything (including images) has fully loaded.
    window.addEventListener("load", function () {
      heroSwiper.update();
    });
  }

  if (document.querySelector(".projects-swiper")) {
    new Swiper(".projects-swiper", {
      slidesPerView: 1.15,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      navigation: {
        prevEl: ".projects-prev",
        nextEl: ".projects-next",
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: {
        640: { slidesPerView: 2.47, spaceBetween: 40, slidesOffsetBefore: -55 },
        1024: { slidesPerView: 2.47, spaceBetween: 64, slidesOffsetBefore: -85 },
        1280: { slidesPerView: 3.58, spaceBetween: 90, slidesOffsetBefore: -127 },
      },
    });
  }

  if (document.querySelector(".testimonial-swiper")) {
    var testimonialSlideCount = document.querySelectorAll(".testimonial-swiper .swiper-slide").length;
    new Swiper(".testimonial-swiper", {
      slidesPerView: 1,
      loop: testimonialSlideCount > 1,
      effect: "fade",
      fadeEffect: { crossFade: true },
      navigation: {
        prevEl: ".testimonial-prev",
        nextEl: ".testimonial-next",
        disabledClass: "swiper-button-disabled",
      },
    });
  }

  if (document.querySelector(".awards-swiper")) {
    new Swiper(".awards-swiper", {
      slidesPerView: 1.1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      navigation: {
        prevEl: ".awards-prev",
        nextEl: ".awards-next",
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: {
        640: { slidesPerView: 2.47, spaceBetween: 28, slidesOffsetBefore: -55 },
        1024: { slidesPerView: 2.47, spaceBetween: 40, slidesOffsetBefore: -85 },
        1440: { slidesPerView: 3.58, spaceBetween: 58, slidesOffsetBefore: -122 },
      },
    });
  }

  if (document.querySelector(".journey-swiper")) {
    new Swiper(".journey-swiper", {
      slidesPerView: 1.1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      navigation: {
        prevEl: ".journey-prev",
        nextEl: ".journey-next",
        disabledClass: "swiper-button-disabled",
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 28 },
      },
    });
  }

  /* ---------------------------------------------------------------------
   * Floor plan tabs (Crest) — swap active styling between sidebar tabs.
   * All tabs point at the same gated sample drawing (behind a blurred
   * lead-gen overlay), so the image itself is flipped/rotated per tab
   * to still read as a change even though it's the same file.
   * ------------------------------------------------------------------- */
  var floorplanTransforms = { master: "none", "2bhk": "scaleX(-1)", "3bhk": "rotate(180deg)" };
  document.querySelectorAll("[data-floor-plan-tabs]").forEach(function (group) {
    var section = group.closest("section");
    var tabs = group.querySelectorAll(".floor-plan-tab");
    var img = section ? section.querySelector("[data-floorplan-img]") : null;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("bg-[#191919]", "text-white", "is-active");
          t.classList.add("bg-white", "text-[#191919]");
          t.querySelector(".tab-num").classList.add("opacity-40");
        });
        tab.classList.remove("bg-white", "text-[#191919]");
        tab.classList.add("bg-[#191919]", "text-white", "is-active");
        tab.querySelector(".tab-num").classList.remove("opacity-40");
        if (img) img.style.transform = floorplanTransforms[tab.dataset.tab] || "none";
      });
    });
  });

  /* ---------------------------------------------------------------------
   * Location category tabs (Crest) — same swap-active-styling pattern as
   * the floor plan tabs, plus swapping which distance list is shown.
   * ------------------------------------------------------------------- */
  document.querySelectorAll("[data-location-tabs]").forEach(function (group) {
    var section = group.closest("section");
    var tabs = group.querySelectorAll(".location-tab");
    var lists = section ? section.querySelectorAll("[data-loc-list]") : [];
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("bg-crest", "text-white", "is-active");
          t.classList.add("bg-[#f5f1ea]", "text-[#191919]");
        });
        tab.classList.remove("bg-[#f5f1ea]", "text-[#191919]");
        tab.classList.add("bg-crest", "text-white", "is-active");
        lists.forEach(function (list) {
          list.classList.toggle("hidden", list.dataset.locList !== tab.dataset.locTab);
        });
      });
    });
  });

  /* ---------------------------------------------------------------------
   * Gallery tabs (Crest) — same swap-active-styling pattern as the other
   * tab groups, using a gold-gradient active state instead of navy, plus
   * swapping which image set is shown.
   * ------------------------------------------------------------------- */
  var galleryActiveClasses = ["bg-gradient-to-l", "from-[#e2c978]", "via-[#bb8b36]", "via-[49%]", "to-[#e2c978]", "text-white", "is-active"];
  var galleryInactiveClasses = ["bg-white", "text-[#191919]"];
  document.querySelectorAll("[data-gallery-tabs]").forEach(function (group) {
    var section = group.closest("section");
    var tabs = group.querySelectorAll(".gallery-tab");
    var sets = section ? section.querySelectorAll("[data-gallery-set]") : [];
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove.apply(t.classList, galleryActiveClasses);
          t.classList.add.apply(t.classList, galleryInactiveClasses);
        });
        tab.classList.remove.apply(tab.classList, galleryInactiveClasses);
        tab.classList.add.apply(tab.classList, galleryActiveClasses);
        sets.forEach(function (set) {
          set.classList.toggle("hidden", set.dataset.gallerySet !== tab.dataset.tab);
        });
      });
    });
  });

  /* ---------------------------------------------------------------------
   * Amenities category filter (Crest) — swap-active-styling like the other
   * tab groups, plus actual filtering: swaps the heading/subtext copy and
   * shows only the icon grid items matching the selected data-category.
   * ------------------------------------------------------------------- */
  document.querySelectorAll("[data-amenities-tabs]").forEach(function (group) {
    var section = group.closest("section");
    var tabs = group.querySelectorAll(".amenities-tab");
    var copy = section ? section.querySelector("[data-amenities-copy]") : null;
    var heading = copy ? copy.querySelector("h3") : null;
    var subtext = copy ? copy.querySelector("p") : null;
    var grid = section ? section.querySelector("[data-amenities-grid]") : null;
    var items = grid ? grid.querySelectorAll("[data-category]") : [];
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("bg-crest", "text-white", "is-active");
          t.classList.add("bg-white", "text-[#191919]");
        });
        tab.classList.remove("bg-white", "text-[#191919]");
        tab.classList.add("bg-crest", "text-white", "is-active");
        if (heading && tab.dataset.heading) heading.textContent = tab.dataset.heading;
        if (subtext && tab.dataset.subtext) subtext.textContent = tab.dataset.subtext;
        items.forEach(function (item) {
          item.classList.toggle("hidden", item.dataset.category !== tab.dataset.category);
        });
      });
    });
  });

  /* ---------------------------------------------------------------------
   * FAQ accordion (Crest) — click a question to expand/collapse its
   * answer; only one open at a time within a group.
   * ------------------------------------------------------------------- */
  document.querySelectorAll("[data-faq-group]").forEach(function (group) {
    var items = group.querySelectorAll("[data-faq]");
    items.forEach(function (item) {
      var toggle = item.querySelector(".faq-toggle");
      var answer = item.querySelector(".faq-answer");
      var icon = item.querySelector(".faq-icon");
      toggle.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        items.forEach(function (other) {
          other.classList.remove("is-open");
          other.querySelector(".faq-answer").style.maxHeight = "0px";
          other.querySelector(".faq-icon").classList.remove("rotate-45");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          answer.style.maxHeight = answer.scrollHeight + "px";
          icon.classList.add("rotate-45");
        }
      });
    });
  });

  /* ---------------------------------------------------------------------
   * Scroll reveal (IntersectionObserver, fires once per element)
   * ------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight);
  }
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      // Elements already on-screen at setup time (e.g. the hero heading)
      // are revealed immediately and synchronously, rather than relying on
      // the observer's async initial callback — that callback's timing can
      // race with images/fonts still settling layout on first paint and
      // intermittently miss elements that were in view the whole time.
      if (isInViewport(el)) {
        el.classList.add("is-visible");
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------------------
   * Split-text headline reveal (Crest) — GSAP SplitText + ScrollTrigger,
   * opt-in via [data-split-reveal] on every section heading. Independent
   * of the .reveal/IntersectionObserver system above; both may coexist on
   * the same section without conflict since they target different
   * elements (ancestor container vs. the heading's own text).
   *
   * Mode: default is a per-character cascade ("words,chars"), matching
   * every section title. Two opt-out modes exist for gradient/script
   * text where char-splitting breaks visually:
   * - data-split-reveal="lines" — for plain block reveals.
   * - data-split-reveal="words" — for gradient script text (currently
   *   the hero's "Live Beautifully."): char-splitting nests new divs
   *   *inside* the gradient-clipped element, and since background-image
   *   doesn't inherit to those new children (only the inherited
   *   color:transparent does), the text goes fully invisible; splitting
   *   at the character level also visibly breaks the connected strokes
   *   of the cursive Brittany font. Word-mode keeps each cursive word's
   *   strokes intact, and each word's own background-image is copied
   *   from the element's computed gradient so the text stays visible
   *   and gold instead of transparent — confirmed via isolated testing
   *   with the real font before picking this fix.
   * ------------------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger && window.SplitText && !prefersReducedMotion) {
    document.querySelectorAll("[data-split-reveal]").forEach(function (el) {
      var mode = el.getAttribute("data-split-reveal");
      var splitType = mode === "lines" ? "lines" : mode === "words" ? "words" : "words,chars";
      var split = new SplitText(el, { type: splitType });
      var targets = mode === "lines" ? split.lines : mode === "words" ? split.words : split.chars;
      if (mode !== "lines") {
        var bgImage = getComputedStyle(el).backgroundImage;
        if (bgImage !== "none") {
          targets.forEach(function (t) {
            t.style.backgroundImage = bgImage;
            t.style.backgroundClip = "text";
            t.style.webkitBackgroundClip = "text";
            t.style.color = "transparent";
          });
        }
      }
      gsap.from(targets, {
        yPercent: 120,
        opacity: 0,
        stagger: mode === "lines" ? 0.1 : mode === "words" ? 0.06 : 0.02,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Custom cursor (Crest) — fine-pointer devices only. Uses GSAP quickTo
   * for smooth interpolation instead of a raw CSS-transition trailing lag.
   * ------------------------------------------------------------------- */
  var cursorInner = document.querySelector(".cursor-inner");
  var cursorOuter = document.querySelector(".cursor-outer");
  if (cursorInner && cursorOuter && window.gsap && isFinePointer && !prefersReducedMotion) {
    var moveInnerX = gsap.quickTo(cursorInner, "x", { duration: 0.1, ease: "power3.out" });
    var moveInnerY = gsap.quickTo(cursorInner, "y", { duration: 0.1, ease: "power3.out" });
    var moveOuterX = gsap.quickTo(cursorOuter, "x", { duration: 0.35, ease: "power3.out" });
    var moveOuterY = gsap.quickTo(cursorOuter, "y", { duration: 0.35, ease: "power3.out" });
    window.addEventListener("mousemove", function (e) {
      moveInnerX(e.clientX);
      moveInnerY(e.clientY);
      moveOuterX(e.clientX);
      moveOuterY(e.clientY);
    });
    document.querySelectorAll("a, button, .cursor-pointer").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursorOuter.classList.add("cursor-hover");
      });
      el.addEventListener("mouseleave", function () {
        cursorOuter.classList.remove("cursor-hover");
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Stat count-up (fires once when scrolled into view). Uses a GSAP tween
   * driving textContent via onUpdate + ScrollTrigger where GSAP is loaded
   * (crest.html); falls back to the original requestAnimationFrame
   * easing + IntersectionObserver trigger on pages without GSAP, or if
   * reduced motion is requested (just sets the final value instantly).
   * ------------------------------------------------------------------- */
  var counters = document.querySelectorAll("[data-count-to]");

  function animateCounterVanilla(el) {
    var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = progress;
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }

  if (window.gsap && window.ScrollTrigger) {
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (prefersReducedMotion) {
        el.textContent = target + suffix;
        return;
      }
      var proxy = { value: 0 };
      gsap.to(proxy, {
        value: target,
        duration: 2,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: function () {
          el.textContent = Math.round(proxy.value) + suffix;
        },
      });
    });
  } else if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounterVanilla(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(animateCounterVanilla);
  }

  /* ---------------------------------------------------------------------
   * Magnetic buttons (Crest) — primary CTAs pull slightly toward the
   * cursor on hover. GSAP sets an inline transform via quickTo, which
   * always wins over the CSS `.btn:hover { transform: ... }` rule
   * (inline style beats any class selector regardless of specificity) —
   * so this only takes over on pages where GSAP is loaded (crest.html);
   * home.html/about.html keep their plain CSS hover lift untouched.
   * ------------------------------------------------------------------- */
  if (window.gsap && isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll(".btn").forEach(function (btn) {
      var moveX = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power3.out" });
      var moveY = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power3.out" });
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        moveX((e.clientX - (rect.left + rect.width / 2)) * 0.25);
        moveY((e.clientY - (rect.top + rect.height / 2)) * 0.25);
      });
      btn.addEventListener("mouseleave", function () {
        moveX(0);
        moveY(0);
      });
    });
  }

  /* ---------------------------------------------------------------------
   * Sticky header — solid background once scrolled past the hero
   * ------------------------------------------------------------------- */
  var header = document.getElementById("site-header");
  var lastScrollY = window.scrollY;
  function updateHeaderState() {
    var currentScrollY = window.scrollY;

    if (currentScrollY > 40) {
      header.classList.add("header-solid");
    } else {
      header.classList.remove("header-solid");
    }

    if (currentScrollY <= 80) {
      header.classList.remove("header-hidden");
    } else if (currentScrollY > lastScrollY) {
      header.classList.add("header-hidden");
    } else if (currentScrollY < lastScrollY) {
      header.classList.remove("header-hidden");
    }

    lastScrollY = currentScrollY;
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------------------------------------------------------------------
   * Mobile off-canvas menu
   * ------------------------------------------------------------------- */
  var menuToggle = document.getElementById("menu-toggle");
  var menuClose = document.getElementById("menu-close");
  var mobileMenu = document.getElementById("mobile-menu");
  var mobileMenuBackdrop = document.getElementById("mobile-menu-backdrop");
  var mobileNavLinks = document.querySelectorAll("#mobile-menu a");

  function openMenu() {
    mobileMenu.classList.add("is-open");
    mobileMenuBackdrop.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    mobileMenuBackdrop.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  mobileMenuBackdrop.addEventListener("click", closeMenu);
  mobileNavLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------------------------------------------------------------------
   * Back to top
   * ------------------------------------------------------------------- */
  var backToTop = document.getElementById("back-to-top");
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
