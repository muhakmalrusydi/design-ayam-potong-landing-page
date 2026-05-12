const toggleBtn = document.querySelector(".nav-toggle");
const sidebar = document.getElementById("menu");
const reveals = document.querySelectorAll(".reveal");
const numbers = document.querySelectorAll(".partnership__number");
const trustItems = document.querySelectorAll(".trust__item");
const backToTop = document.getElementById("back-to-top");

function initHamburgerMenu() {
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("sidebar--active");
  });

  document.addEventListener("click", (e) => {
    const clickedOutside =
      !sidebar.contains(e.target) && !toggleBtn.contains(e.target);
    if (clickedOutside) sidebar.classList.remove("sidebar--active");
  });

  sidebar.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () =>
      sidebar.classList.remove("sidebar--active"),
    );
  });
}

function initTrustInteraction() {
  if (!trustItems.length) return;

  trustItems.forEach((item) => {
    item.addEventListener("click", function () {
      const currentlyActive = document.querySelector(".trust__item.active");

      if (currentlyActive === this) {
        this.classList.remove("active");
        return;
      }

      if (currentlyActive) currentlyActive.classList.remove("active");
      this.classList.add("active");
    });
  });
}

function initScrollReveal() {
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("reveal--active", entry.isIntersecting);
      });
    },
    { threshold: 0.1 },
  );

  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${i * 120}ms`;
    observer.observe(el);
  });
}

function animateCount(el) {
  const target = Number(el.dataset.target);
  if (isNaN(target)) return;

  const suffix = el.dataset.suffix || "";
  const format = el.dataset.format || "plain";
  const totalFrames = Math.round(2000 / (1000 / 60));
  const increment = target / totalFrames;
  let current = 0;

  const fmt = (n) => (format === "id" ? n.toLocaleString("id-ID") : n);

  (function tick() {
    current += increment;
    if (current < target) {
      el.textContent = fmt(Math.floor(current)) + suffix;
      requestAnimationFrame(tick);
    } else {
      el.textContent = fmt(target) + suffix;
    }
  })();
}

function initNumberObserver() {
  if (!numbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
        } else {
          entry.target.textContent = "0";
        }
      });
    },
    { threshold: 0.5 },
  );

  numbers.forEach((el) => observer.observe(el));
}

function initBackToTop() {
  if (!backToTop) return;

  window.addEventListener(
    "scroll",
    () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 400);
    },
    { passive: true },
  );

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initCalorieRing() {
  document.querySelectorAll(".calorie[data-percent]").forEach((el) => {
    el.style.setProperty("--calorie-pct", el.dataset.percent);
  });
}

function initFlipCard() {
  document.querySelectorAll(".card__action").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest(".card");
      if (card?.classList.contains("is-active")) {
        card.classList.add("is-flipped");
      }
    });
  });

  document.querySelectorAll(".card__back-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      btn.closest(".card")?.classList.remove("is-flipped");
    });
  });
}

function initPriceCard() {
  document.querySelectorAll(".price-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".price-card__btn")) return;

      const orderSection = document.getElementById("order");
      if (orderSection) {
        orderSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function initFanCarousel({ trackSel, cardSel }) {
  const track = document.querySelector(trackSel);
  if (!track) return;

  const root = track.closest(".product__carousel");
  const cards = [...track.querySelectorAll(cardSel)];
  if (!cards.length) return;

  const dotsContainer = root.querySelector(".carousel-dots");
  const btnPrev = root.querySelector(".carousel-nav--prev");
  const btnNext = root.querySelector(".carousel-nav--next");

  const n = cards.length;
  let cur = 0;
  let startX = 0;
  let isDragging = false;
  let dragDelta = 0;

  const dots = cards.map((_, i) => {
    const d = document.createElement("button");
    d.className = "carousel-dot";
    d.setAttribute("aria-label", `Slide ${i + 1}`);
    d.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(d);
    return d;
  });

  function layout() {
    const W = track.offsetWidth;

    cards.forEach((card, i) => {
      let rel = (((i - cur) % n) + n) % n;
      if (rel > n / 2) rel -= n;

      const abs = Math.abs(rel);
      const sign = rel < 0 ? -1 : 1;
      const active = rel === 0;

      const tx = sign * (abs === 0 ? 0 : W * 0.18 * abs + abs * 20);
      const scale = active ? 1.1 : Math.max(0.7, 1 - abs * 0.13);
      const ry = active ? 0 : sign * Math.min(abs * 12, 36);
      const blur = active ? 0 : Math.min(abs * 2.5, 6);
      const brightness = active ? 1 : Math.max(0.4, 1 - abs * 0.25);
      const opacity = active ? 1 : Math.max(0.2, 1 - abs * 0.3);
      const z = active ? 10 : 10 - abs;

      card.style.transform = `translateX(${tx}px) scale(${scale}) perspective(1000px) rotateY(${ry}deg)`;
      card.style.filter = `blur(${blur}px) brightness(${brightness})`;
      card.style.opacity = opacity;
      card.style.zIndex = z;

      card.classList.toggle("is-active", active);
    });

    dots.forEach((d, i) => d.classList.toggle("is-active", i === cur));
  }

  function goTo(i) {
    cur = ((i % n) + n) % n;
    layout();
  }

  cards.forEach((card, i) => {
    card.addEventListener("click", () => {
      if (i !== cur) goTo(i);
    });
  });

  btnNext?.addEventListener("click", () => goTo(cur + 1));
  btnPrev?.addEventListener("click", () => goTo(cur - 1));

  const onStart = (x) => {
    startX = x;
    isDragging = true;
    dragDelta = 0;
  };

  const onMove = (x) => {
    if (isDragging) dragDelta = x - startX;
  };

  const onEnd = () => {
    if (Math.abs(dragDelta) > 45) {
      goTo(dragDelta < 0 ? cur + 1 : cur - 1);
    }
    isDragging = false;
    dragDelta = 0;
  };

  track.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX), {
    passive: true,
  });
  track.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), {
    passive: true,
  });
  track.addEventListener("touchend", onEnd);

  track.addEventListener("mousedown", (e) => {
    e.preventDefault();
    onStart(e.clientX);
  });
  track.addEventListener("mousemove", (e) => onMove(e.clientX));
  track.addEventListener("mouseup", onEnd);
  track.addEventListener("mouseleave", onEnd);

  track.setAttribute("tabindex", "0");
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(cur - 1);
    if (e.key === "ArrowRight") goTo(cur + 1);
  });

  window.addEventListener("resize", layout, { passive: true });

  goTo(0);
}

document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initBackToTop();
  initTrustInteraction();
  initScrollReveal();
  initNumberObserver();
  initCalorieRing();
  initFlipCard();
  initPriceCard();
  initFanCarousel({
    trackSel: ".product__track",
    cardSel: ".card",
    dotTarget: ".product__carousel",
  });
});
