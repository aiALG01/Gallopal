(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------------
     Sticky nav background on scroll
     --------------------------------------------------------------------- */
  var nav = document.getElementById("siteNav");
  if (nav) {
    var updateNavState = function () {
      if (window.scrollY > 16) {
        nav.classList.add("is-scrolled");
      } else {
        nav.classList.remove("is-scrolled");
      }
    };
    updateNavState();
    var navTicking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!navTicking) {
          window.requestAnimationFrame(function () {
            updateNavState();
            navTicking = false;
          });
          navTicking = true;
        }
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------------------------------
     Mobile navigation panel
     --------------------------------------------------------------------- */
  var menuOpenBtn = document.getElementById("menuOpen");
  var menuCloseBtn = document.getElementById("menuClose");
  var mobilePanel = document.getElementById("mobileNav");

  function openMobileNav() {
    if (!mobilePanel) return;
    mobilePanel.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (menuOpenBtn) menuOpenBtn.setAttribute("aria-expanded", "true");
    var firstLink = mobilePanel.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMobileNav() {
    if (!mobilePanel) return;
    mobilePanel.classList.remove("is-open");
    document.body.style.overflow = "";
    if (menuOpenBtn) menuOpenBtn.setAttribute("aria-expanded", "false");
  }

  if (menuOpenBtn) menuOpenBtn.addEventListener("click", openMobileNav);
  if (menuCloseBtn) menuCloseBtn.addEventListener("click", closeMobileNav);
  if (mobilePanel) {
    mobilePanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mobilePanel.classList.contains("is-open")) {
        closeMobileNav();
      }
    });
  }

  /* ---------------------------------------------------------------------
     Scroll-reveal via IntersectionObserver
     --------------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------------------
     Interactive schedule preview (Über die App)
     --------------------------------------------------------------------- */
  var scheduleGrid = document.getElementById("scheduleGrid");
  var scheduleFootnote = document.getElementById("scheduleFootnote");

  if (scheduleGrid) {
    scheduleGrid.addEventListener("click", function (event) {
      var slot = event.target.closest(".slot");
      if (!slot || slot.dataset.state !== "free") return;

      var label = slot.getAttribute("aria-label") || "";
      slot.dataset.state = "pending";
      slot.disabled = true;
      slot.innerHTML = '<i class="ph ph-hourglass-medium" aria-hidden="true"></i>';

      window.setTimeout(
        function () {
          slot.dataset.state = "booked";
          slot.innerHTML = '<i class="ph ph-check-bold" aria-hidden="true"></i>';
          slot.setAttribute("aria-label", label.replace("frei, klicken zum Buchen", "gebucht"));
          if (scheduleFootnote) {
            scheduleFootnote.textContent = "So einfach ist das: die Stunde ist jetzt für dich reserviert.";
          }
        },
        prefersReducedMotion ? 0 : 650
      );
    });
  }

  /* ---------------------------------------------------------------------
     Contact form: interest toggle + validation + mailto handoff
     --------------------------------------------------------------------- */
  var newsletterBtn = document.getElementById("interestNewsletter");
  var testerBtn = document.getElementById("interestTester");
  var interestField = document.getElementById("fieldInterest");

  function setInterest(value) {
    if (interestField) interestField.value = value;
    var isTester = value === "tester";
    if (newsletterBtn) newsletterBtn.setAttribute("aria-pressed", String(!isTester));
    if (testerBtn) testerBtn.setAttribute("aria-pressed", String(isTester));
  }

  if (newsletterBtn) newsletterBtn.addEventListener("click", function () { setInterest("newsletter"); });
  if (testerBtn) testerBtn.addEventListener("click", function () { setInterest("tester"); });

  var form = document.getElementById("signupForm");
  var formSuccess = document.getElementById("formSuccess");
  var CONTACT_ADDRESS = "lena.gerth@outlook.de";

  function setFieldError(fieldEl, errorEl, message) {
    var wrapper = fieldEl.closest(".form-field");
    if (wrapper) wrapper.dataset.invalid = message ? "true" : "false";
    if (errorEl) errorEl.textContent = message || "";
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nameField = document.getElementById("fieldName");
      var emailField = document.getElementById("fieldEmail");
      var roleField = document.getElementById("fieldRole");
      var messageField = document.getElementById("fieldMessage");

      var nameError = document.getElementById("errorName");
      var emailError = document.getElementById("errorEmail");

      var valid = true;

      if (!nameField.value.trim()) {
        setFieldError(nameField, nameError, "Bitte gib deinen Namen an.");
        valid = false;
      } else {
        setFieldError(nameField, nameError, "");
      }

      if (!isValidEmail(emailField.value.trim())) {
        setFieldError(emailField, emailError, "Bitte gib eine gültige E-Mail-Adresse an.");
        valid = false;
      } else {
        setFieldError(emailField, emailError, "");
      }

      if (!valid) {
        var firstInvalid = form.querySelector('[data-invalid="true"] input, [data-invalid="true"] select');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var interest = interestField.value === "tester" ? "Testphase" : "Newsletter";
      var roleLabel = roleField.options[roleField.selectedIndex].text;

      var subject = "Galoppal Anmeldung: " + interest;
      var bodyLines = [
        "Name: " + nameField.value.trim(),
        "E-Mail: " + emailField.value.trim(),
        "Ich bin: " + roleLabel,
        "Interesse: " + interest,
        "",
        "Nachricht:",
        messageField.value.trim() || "(keine Angabe)"
      ];

      var mailtoUrl =
        "mailto:" +
        CONTACT_ADDRESS +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(bodyLines.join("\n"));

      form.style.display = "none";
      if (formSuccess) formSuccess.classList.add("is-visible");

      window.setTimeout(function () {
        window.location.href = mailtoUrl;
      }, 400);
    });
  }
})();
