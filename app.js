(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    filter: "all",
    search: "",
  };

  // NOTE: WhatsApp uses international format (no leading 0).
  // Provided: 0561979833 → assumed UAE: 971561979833
  const WHATSAPP_NUMBER = "971561979833";

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function svgDataUri(label, accent = "#0f6aa8") {
    const safe = escapeHtml(label);
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#061a36"/>
      <stop offset="1" stop-color="#030b18"/>
    </linearGradient>
    <radialGradient id="shine" cx="30%" cy="22%" r="65%">
      <stop offset="0" stop-color="rgba(255,255,255,0.45)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="rgba(255,255,255,0.26)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0.06)"/>
    </linearGradient>
  </defs>
  <rect width="900" height="540" rx="40" fill="url(#bg)"/>
  <circle cx="260" cy="140" r="260" fill="url(#shine)"/>
  <circle cx="720" cy="150" r="210" fill="rgba(15,106,168,0.10)"/>
  <g transform="translate(0,0)">
    <path d="M465 90c0-22-18-40-40-40h-50c-22 0-40 18-40 40v35c0 12-7 24-18 30-18 10-30 30-30 52v195c0 48 39 88 88 88h50c48 0 88-40 88-88V207c0-22-12-42-30-52-11-6-18-18-18-30V90z"
      fill="url(#glass)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
    <path d="M365 62h70" stroke="rgba(255,255,255,0.30)" stroke-width="10" stroke-linecap="round"/>
    <path d="M350 215c20 22 54 36 90 36s70-14 90-36" fill="none" stroke="rgba(15,106,168,0.38)" stroke-width="10" stroke-linecap="round"/>
    <path d="M350 310c20 22 54 36 90 36s70-14 90-36" fill="none" stroke="rgba(15,106,168,0.22)" stroke-width="10" stroke-linecap="round"/>
    <path d="M350 405c20 22 54 36 90 36s70-14 90-36" fill="none" stroke="rgba(15,106,168,0.16)" stroke-width="10" stroke-linecap="round"/>
  </g>
  <g>
    <rect x="80" y="380" width="740" height="96" rx="22" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.16)"/>
    <rect x="80" y="380" width="10" height="96" rx="10" fill="${accent}"/>
    <text x="118" y="440" font-family="Inter, Arial, sans-serif" font-size="34" fill="rgba(243,251,255,0.92)" font-weight="650">${safe}</text>
    <text x="118" y="470" font-family="Inter, Arial, sans-serif" font-size="18" fill="rgba(243,251,255,0.70)">Purified • Modern • Clean</text>
  </g>
</svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const products = (() => {
    const mk = (id, name, category, desc, accent) => ({
      id,
      name,
      category,
      desc,
      img: svgDataUri(name, accent),
    });

    const retail = [
      mk("r-500", "500ml Bottle", "retail", "Crisp, convenient hydration for everyday carry.", "#0f6aa8"),
      mk("r-750", "750ml Bottle", "retail", "Balanced size for daily routines and travel.", "#0a3d73"),
      mk("r-1l", "1L Bottle", "retail", "A clean, premium option for longer outings.", "#1d93c9"),
      mk("r-1p5", "1.5L Bottle", "retail", "Family-friendly size with a secure cap seal.", "#0f6aa8"),
      mk("r-2l", "2L Bottle", "retail", "Great for home use and small gatherings.", "#0a3d73"),
      mk("r-330", "330ml Mini Bottle", "retail", "Perfect for events, meetings, and hospitality.", "#1d93c9"),
      mk("r-6pack", "6-Pack (500ml)", "retail", "Stock up with a sleek, easy-carry pack.", "#0f6aa8"),
      mk("r-12pack", "12-Pack (500ml)", "retail", "Best value for homes and teams.", "#0a3d73"),
      mk("r-sport", "Sport Cap Bottle", "retail", "Fast sip, leak-resistant cap for workouts.", "#1d93c9"),
      mk("r-glass", "Glass Bottle (750ml)", "retail", "Premium glass with a clinical, clean taste.", "#0f6aa8"),
    ];

    const office = [
      mk("o-5l", "5L Mini Jug", "office", "Compact dispenser refill for office kitchens.", "#0f6aa8"),
      mk("o-10l", "10L Jug", "office", "Medium volume for teams and shared spaces.", "#1d93c9"),
      mk("o-12l", "12L Jug", "office", "Reliable weekly hydration for growing teams.", "#0a3d73"),
      mk("o-15l", "15L Jug", "office", "Reduced replacement frequency, easy handle.", "#0f6aa8"),
      mk("o-19l", "19L Classic Jug", "office", "Industry-standard jug for most dispensers.", "#1d93c9"),
      mk("o-20l", "20L Dispenser Jug", "office", "High-volume refill for busy offices.", "#0a3d73"),
      mk("o-cooler", "Countertop Cooler", "office", "Chilled water with a clean, minimal footprint.", "#0f6aa8"),
      mk("o-floor", "Floor Dispenser", "office", "Hot & cold options with modern glass UI panel.", "#1d93c9"),
      mk("o-touch", "Touchless Dispenser", "office", "Hygiene-first dispensing for shared environments.", "#0a3d73"),
      mk("o-filter", "Under-Sink Filter Kit", "office", "Multi-stage filtration for consistent purity.", "#0f6aa8"),
    ];

    const industrial = [
      mk("i-20l-stack", "20L Stackable", "industrial", "Rugged stackable containers for logistics.", "#1d93c9"),
      mk("i-25l", "25L Supply Can", "industrial", "Higher throughput for production floors.", "#0f6aa8"),
      mk("i-30l", "30L Supply Can", "industrial", "Optimized for repeat refilling programs.", "#0a3d73"),
      mk("i-50l", "50L Drum", "industrial", "Bulk storage with reinforced construction.", "#1d93c9"),
      mk("i-100l", "100L Drum", "industrial", "Reliable bulk for continuous operations.", "#0f6aa8"),
      mk("i-200l", "200L Drum", "industrial", "High-capacity drum for industrial workflows.", "#0a3d73"),
      mk("i-ibc", "IBC Tank (1000L)", "industrial", "Maximum volume for large facilities.", "#1d93c9"),
      mk("i-pump", "Transfer Pump Kit", "industrial", "Clean transfer with controlled flow and fittings.", "#0f6aa8"),
      mk("i-hose", "Food-Grade Hose Set", "industrial", "Sanitary connections for bulk dispensing.", "#0a3d73"),
      mk("i-service", "Maintenance & Sanitization", "industrial", "Scheduled service to keep systems clinical.", "#1d93c9"),
    ];

    // Total: 30
    return [...retail, ...office, ...industrial];
  })();

  function categoryLabel(cat) {
    if (cat === "retail") return "Retail";
    if (cat === "office") return "Office";
    if (cat === "industrial") return "Industrial";
    return "All";
  }

  function makeWhatsAppLink({ productName }) {
    const text = encodeURIComponent(
      `Hi Al Hana Drinking Water — I'm interested in: ${productName}. Please share pricing, delivery options, and availability.`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }

  function bentoClassForIndex(i) {
    // A simple repeating pattern to create a bento rhythm.
    const m = i % 10;
    if (m === 0 || m === 6) return "is-wide";
    if (m === 3) return "is-tall";
    return "";
  }

  function renderProducts() {
    const grid = $("#productGrid");
    if (!grid) return;

    const normalizedSearch = state.search.trim().toLowerCase();
    const filtered = products
      .filter((p) => state.filter === "all" || p.category === state.filter)
      .filter((p) => {
        if (!normalizedSearch) return true;
        return [p.name, p.desc, p.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      });

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="no-results glass" aria-live="polite">
          <p>No products matched <strong>${escapeHtml(
            state.search || "your search"
          )}</strong>. Try another keyword or select a different category.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map((p, idx) => {
        const extra = bentoClassForIndex(idx);
        return `
          <article class="product glass parallax reveal ${extra}" data-id="${p.id}" data-category="${p.category}" tabindex="0" role="button" aria-label="Quick view: ${escapeHtml(
            p.name
          )}">
            <div class="product-top">
              <span class="pill">${categoryLabel(p.category)}</span>
              <span class="pill" style="opacity:.72">Quick View</span>
            </div>
            <div class="product-name">${escapeHtml(p.name)}</div>
            <p class="product-desc">${escapeHtml(p.desc)}</p>
            <img class="product-img" src="${p.img}" alt="${escapeHtml(
          p.name
        )}" loading="lazy" />
            <div class="quick">Open</div>
          </article>
        `;
      })
      .join("");

    wireProductClicks();
    observeReveals();
  }

  function setFilter(next) {
    state.filter = next;
    $$(".chip").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.filter === next)
    );
    renderProducts();
  }

  function wireFilters() {
    $$(".chip").forEach((b) => {
      b.addEventListener("click", () => setFilter(b.dataset.filter || "all"));
    });
  }

  function wireSearch() {
    const input = $("#productSearch");
    const button = $(".search-button");
    if (!input) return;

    const updateSearch = () => {
      state.search = input.value;
      renderProducts();
    };

    input.addEventListener("input", updateSearch);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        updateSearch();
      }
    });

    if (button) {
      button.addEventListener("click", updateSearch);
    }
  }

  function openQuickView(product) {
    const modal = $("#quickView");
    if (!modal) return;

    $("#qvImg").src = product.img;
    $("#qvImg").alt = product.name;
    $("#qvCat").textContent = categoryLabel(product.category);
    $("#qvName").textContent = product.name;
    $("#qvDesc").textContent = product.desc;
    const wa = $("#qvWhatsApp");
    wa.href = makeWhatsAppLink({ productName: product.name });

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeQuickView() {
    const modal = $("#quickView");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function wireQuickViewClose() {
    const modal = $("#quickView");
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.hasAttribute("data-close")) closeQuickView();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeQuickView();
    });
  }

  function wireProductClicks() {
    $$(".product").forEach((card) => {
      const id = card.getAttribute("data-id");
      const p = products.find((x) => x.id === id);
      if (!p) return;

      const open = () => openQuickView(p);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });
  }

  let revealObserver = null;
  function observeReveals() {
    // Recreate to include newly rendered items.
    if (revealObserver) revealObserver.disconnect();

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")
      ?.matches;
    if (prefersReduced) {
      $$(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    $$(".reveal").forEach((el) => revealObserver.observe(el));
  }

  function wireParallax() {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")
      ?.matches;
    if (prefersReduced) return;

    const section = $("#products");
    if (!section) return;

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Normalize progress in [-1, 1] around viewport.
      const center = rect.top + rect.height * 0.5;
      const p = (center - vh * 0.5) / (vh * 0.5);
      const amount = Math.max(-1, Math.min(1, p));

      $$(".parallax").forEach((el, idx) => {
        const depth = 10 + (idx % 6) * 2; // subtle depth layers
        const y = amount * depth;
        el.style.setProperty("--py", `${y.toFixed(2)}px`);
      });
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        tick();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    tick();
  }

  function wireNav() {
    const toggle = $(".nav-toggle");
    const drawer = $(".nav-drawer");
    if (!toggle || !drawer) return;

    const open = () => {
      drawer.setAttribute("aria-hidden", "false");
      drawer.style.display = "block";
      toggle.setAttribute("aria-label", "Close menu");
      toggle.dataset.open = "1";
    };
    const close = () => {
      drawer.setAttribute("aria-hidden", "true");
      drawer.style.display = "none";
      toggle.setAttribute("aria-label", "Open menu");
      delete toggle.dataset.open;
    };

    // Start closed on load for mobile.
    close();

    toggle.addEventListener("click", () => {
      if (toggle.dataset.open) close();
      else open();
    });

    $$(".drawer-link", drawer).forEach((a) => {
      a.addEventListener("click", () => close());
    });
  }

  function wireForm() {
    const form = $("#contactForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());

      const message = `New inquiry from website:\n\nName: ${payload.name}\nPhone: ${payload.phone}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}\n`;

      // No backend assumed: open an email draft and also offer WhatsApp.
      const mailto = `mailto:sales@example.com?subject=${encodeURIComponent(
        "Al Hana Drinking Water — Website Inquiry"
      )}&body=${encodeURIComponent(message)}`;

      window.open(mailto, "_blank", "noreferrer");

      // Also prompt WhatsApp in a non-blocking way.
      const waText = encodeURIComponent(
        `Hi Al Hana Drinking Water — here's my request:\n\n${message}`
      );
      const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
      window.open(wa, "_blank", "noreferrer");

      form.reset();
    });
  }

  function wirePreloader() {
    const pre = $("#preloader");
    if (!pre) return;
    const hide = () => pre.classList.add("is-hidden");

    // Ensure at least a short visible time to avoid flicker.
    const minDelayMs = 650;
    const start = performance.now();

    window.addEventListener("load", () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minDelayMs - elapsed);
      window.setTimeout(hide, wait);
    });
  }

  function init() {
    $("#year").textContent = String(new Date().getFullYear());
    wirePreloader();
    wireNav();
    wireFilters();
    wireSearch();
    wireQuickViewClose();
    wireForm();
    renderProducts();
    observeReveals();
    wireParallax();
  }

  init();
})();

