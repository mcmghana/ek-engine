/**
 * eke.js - Eli Kujo Engine (EK Engine) Interactive Controller
 * Handles:
 * 1. "All About EK Engine" Modal Popup (triggered via "About Eli Kujo Engine" links)
 * 2. Live Platform Counter Animation
 */

(function () {
  // =========================================================================
  // EASY CONFIGURATION: Change this number anytime to update live platforms
  // =========================================================================  
  const ACTIVE_PLATFORMS = 5;
  const SCAN_START_FROM = 100;
  const SCAN_DURATION_MS = 1400;

  // =========================================================================
  // 1. ALL ABOUT EK ENGINE MODAL CONTENT & LOGIC
  // =========================================================================
  const aboutModalHTML = `
    <div class="eke-modal-overlay" id="ekeAboutModal" role="dialog" aria-modal="true" aria-labelledby="ekeModalHeading">
      <div class="eke-modal-box">
        <button class="eke-modal-close" id="ekeModalCloseBtn" aria-label="Close modal">&times;</button>
        <div class="eke-modal-badge">Official Product Dossier</div>
        <h2 class="eke-modal-title" id="ekeModalHeading">All About Eli Kujo Engine (EK Engine)</h2>
        <p class="eke-modal-tagline">"The Engine With A Human Driver" — Built by Team MC MULTIMEDIA</p>

        <div class="eke-modal-section">
          <h4>1. Origin &amp; Vision</h4>
          <p>
            Developed by <strong>MC MULTIMEDIA</strong> after 5+ years of dedicated research and over a decade of media engineering, <strong>Eli Kujo Engine (EK Engine)</strong> is the world's first serverless Content Management System engineered specifically with Africa and emerging digital ecosystems in mind. Our philosophy is simple: <em>Content is the new oil—own the refinery.</em>
          </p>
        </div>

        <div class="eke-modal-section">
          <h4>2. Core Architecture &amp; Performance</h4>
          <p>
            Unlike traditional CMS platforms weighed down by slow SQL databases, fragile plugins, and recurring server bills, EK Engine runs on a <strong>100% Serverless Modular Single Page Application (SPA)</strong> architecture:
          </p>
          <p>
            • <strong>Ultra Data-Efficient &amp; Offline-First:</strong> Loads roughly 100 articles in ~1MB of data and continues working seamlessly offline.<br>
            • <strong>Industrial Bulk Publishing:</strong> Publish up to <strong>1,000 articles in 60 seconds</strong>—built for busy newsrooms, schools, and research archives.<br>
            • <strong>Instant Google AdSense Monetization:</strong> Pre-wired ad slots let publishers drop their AdSense ID once and unlock revenue immediately.<br>
            • <strong>SEO &amp; AEO Optimized:</strong> Engineered to rank across Google Search as well as modern AI Answer Engines.
          </p>
        </div>

        <div class="eke-modal-section">
          <h4>3. Global Lifetime Licensing Tiers</h4>
          <div class="eke-modal-grid">
            <div class="eke-tier-card">
              <strong>$100 — Basic License (Student)</strong>
              <span>1 Domain, bulk publish up to 100 articles, writer portfolio &amp; mentorship community access.</span>
            </div>
            <div class="eke-tier-card">
              <strong>$500 — Standard License (School)</strong>
              <span>3 Domains, dedicated staff &amp; editorial training for SHSs, Universities, and NGOs.</span>
            </div>
            <div class="eke-tier-card">
              <strong>$1,000 — Pro License (Company/Media)</strong>
              <span>Unlimited domains, unlimited bulk publishing, full white-label branding &amp; optional mobile app setup.</span>
            </div>
          </div>
        </div>

        <div class="eke-modal-section">
          <h4>4. Limited Founder's License Special (Ghana / Launch Offer)</h4>
          <p>
            Ahead of our upcoming global launch on <strong>Envato &amp; CodeCanyon</strong>, secure a lifetime <strong>Founder's License for GHS 2,000</strong> (valid until <strong>17 January 2027</strong>). Includes full white-label deployment on your custom domain by our developers within <strong>7 days</strong>.
          </p>
          <div style="margin-top: 16px; display: flex; flex-wrap: wrap; gap: 12px;">
            <a
              href="https://wa.me/233267171555?text=Hello%20EK%20Engine!%20I%20just%20read%20All%20About%20EK%20Engine%20and%20want%20to%20claim%20the%20Founder's%20License%20(GHS%202000)."
              target="_blank"
              rel="noopener"
              class="btn btn-primary"
              style="padding: 12px 22px; font-size: 0.92rem;"
            >
              Claim Founder's License via WhatsApp
            </a>
            <a
              href="https://digirefera.com"
              target="_blank"
              rel="noopener"
              class="btn btn-secondary"
              style="padding: 12px 22px; font-size: 0.92rem;"
            >
              Inspect Live Showroom (digirefera.com)
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  function initEkeModal() {
    // Inject modal into body if not already present
    if (!document.getElementById("ekeAboutModal")) {
      document.body.insertAdjacentHTML("beforeend", aboutModalHTML);
    }

    const modal = document.getElementById("ekeAboutModal");
    const closeBtn = document.getElementById("ekeModalCloseBtn");
    const triggers = document.querySelectorAll('[data-eke-modal="open"], a[href="#about-ek-engine"]');

    function openModal(e) {
      if (e) e.preventDefault();
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", openModal);
    });

    closeBtn.addEventListener("click", closeModal);

    // Close when clicking outside the modal box
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });

    // Open automatically if URL hash is #about-ek-engine
    if (window.location.hash === "#about-ek-engine") {
      openModal();
    }
  }

  // =========================================================================
  // 2. ANIMATED PLATFORM COUNTER LOGIC
  // =========================================================================
function initPlatformCounter() {
    const counterCard = document.getElementById("platformCounterCard");
    const countDisplay = document.getElementById("platformCountDisplay");
    const hintText = document.getElementById("counterHintText");

    if (!counterCard || !countDisplay) return;

    countDisplay.textContent = SCAN_START_FROM;
    if (hintText) {
      hintText.textContent = "Auto-scanning live platforms...";
    }

    let isScanning = false;
    let hasAutoScanned = false;

    function runDescendingScan() {
      if (isScanning) return;
      isScanning = true;

      const startValue = SCAN_START_FROM;
      const targetValue = ACTIVE_PLATFORMS;
      const startTime = performance.now();

      if (hintText) {
        hintText.textContent = "Scanning live platforms...";
      }

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / SCAN_DURATION_MS, 1);

        // Ease-out cubic slows smoothly as it lands on ACTIVE_PLATFORMS
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue - (startValue - targetValue) * eased);

        countDisplay.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          countDisplay.textContent = targetValue;
          if (hintText) {
            hintText.textContent = "✔ Live Platforms Powered by EK Engine • Click to rescan";
          }
          isScanning = false;
        }
      }

      requestAnimationFrame(step);
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAutoScanned) {
              hasAutoScanned = true;
              runDescendingScan();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35 }
      );
      observer.observe(counterCard);
    } else {
      hasAutoScanned = true;
      runDescendingScan();
    }

    counterCard.addEventListener("click", runDescendingScan);
    counterCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        runDescendingScan();
      }
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initEkeModal();
      initPlatformCounter();
    });
  } else {
    initEkeModal();
    initPlatformCounter();
  }
})();
