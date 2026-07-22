(function () {
  "use strict";

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
   * All tabs currently point at the same sample drawing; this only
   * toggles which tab reads as selected.
   * ------------------------------------------------------------------- */
  document.querySelectorAll("[data-floor-plan-tabs]").forEach(function (group) {
    var tabs = group.querySelectorAll(".floor-plan-tab");
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
      });
    });
  });

  /* ---------------------------------------------------------------------
   * Location category tabs (Crest) — same swap-active-styling pattern as
   * the floor plan tabs. The distance list doesn't change per category yet.
   * ------------------------------------------------------------------- */
  document.querySelectorAll("[data-location-tabs]").forEach(function (group) {
    var tabs = group.querySelectorAll(".location-tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove("bg-crest", "text-white", "is-active");
          t.classList.add("bg-[#f5f1ea]", "text-[#191919]");
        });
        tab.classList.remove("bg-[#f5f1ea]", "text-[#191919]");
        tab.classList.add("bg-crest", "text-white", "is-active");
      });
    });
  });

  /* ---------------------------------------------------------------------
   * Gallery tabs (Crest) — same swap-active-styling pattern as the other
   * tab groups, using a gold-gradient active state instead of navy.
   * ------------------------------------------------------------------- */
  var galleryActiveClasses = ["bg-gradient-to-l", "from-[#e2c978]", "via-[#bb8b36]", "via-[49%]", "to-[#e2c978]", "text-white", "is-active"];
  var galleryInactiveClasses = ["bg-white", "text-[#191919]"];
  document.querySelectorAll("[data-gallery-tabs]").forEach(function (group) {
    var tabs = group.querySelectorAll(".gallery-tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          t.classList.remove.apply(t.classList, galleryActiveClasses);
          t.classList.add.apply(t.classList, galleryInactiveClasses);
        });
        tab.classList.remove.apply(tab.classList, galleryInactiveClasses);
        tab.classList.add.apply(tab.classList, galleryActiveClasses);
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
   * Stat count-up (fires once when scrolled into view)
   * ------------------------------------------------------------------- */
  var counters = document.querySelectorAll("[data-count-to]");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
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

  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
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
    counters.forEach(animateCounter);
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
