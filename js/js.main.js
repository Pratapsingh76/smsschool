
/* ─── MOBILE NAV ─── */
function openMob() { document.getElementById('mobOverlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMob() { document.getElementById('mobOverlay').classList.remove('open'); document.body.style.overflow = ''; }
function handleOverlayClick(e) { if (e.target === document.getElementById('mobOverlay')) closeMob(); }

/* ─── NOTIFICATION PANEL ─── */
function openNotifPanel() {
   document.getElementById('notifPanelOverlay').classList.add('open');
   document.body.style.overflow = 'hidden';
   // mark as read
   setTimeout(() => {
      document.querySelectorAll('.notif-entry.unread').forEach(el => el.classList.remove('unread'));
      document.querySelectorAll('.notif-unread-badge').forEach(el => el.remove());
      const badge = document.getElementById('headerNotifBadge');
      if (badge) badge.style.display = 'none';
      document.getElementById('unreadCount').textContent = '';
   }, 1500);
}
function closeNotifPanel() {
   document.getElementById('notifPanelOverlay').classList.remove('open');
   document.body.style.overflow = '';
}
function handleNotifPanelClick(e) {
   if (e.target === document.getElementById('notifPanelOverlay')) closeNotifPanel();
}

/* ─── HERO CAROUSEL ─── */
let heroIndex = 0;
let heroTimer;
let heroProgressInterval;
let heroPct = 0;
const HERO_INTERVAL = 5000;

function goToSlide(idx) {
   const slides = document.querySelectorAll('.hero-slide');
   const dots = document.querySelectorAll('.hero-dot');
   slides[heroIndex].classList.remove('active');
   dots[heroIndex].classList.remove('active');
   heroIndex = (idx + slides.length) % slides.length;
   slides[heroIndex].classList.add('active');
   dots[heroIndex].classList.add('active');
   document.getElementById('heroSlides').style.transform = `translateX(-${heroIndex * 100}%)`;
   resetHeroTimer();
}

function heroSlideBy(dir) { goToSlide(heroIndex + dir); }

function resetHeroTimer() {
   clearInterval(heroTimer);
   clearInterval(heroProgressInterval);
   heroPct = 0;
   document.getElementById('heroProgress').style.transition = 'none';
   document.getElementById('heroProgress').style.width = '0%';
   setTimeout(() => {
      document.getElementById('heroProgress').style.transition = `width ${HERO_INTERVAL}ms linear`;
      document.getElementById('heroProgress').style.width = '100%';
   }, 50);
   heroTimer = setInterval(() => goToSlide(heroIndex + 1), HERO_INTERVAL);
}

document.addEventListener('DOMContentLoaded', () => { resetHeroTimer(); });

/* ─── RIPPLE ─── */
function addRipple(card, e) {
   const r = document.createElement('span');
   r.className = 'ripple';
   const rect = card.getBoundingClientRect();
   const size = Math.max(rect.width, rect.height);
   const x = (e ? e.clientX - rect.left : rect.width / 2) - size / 2;
   const y = (e ? e.clientY - rect.top : rect.height / 2) - size / 2;
   r.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
   card.appendChild(r);
   setTimeout(() => r.remove(), 700);
}

/* ─── GALLERY FILTER & LIGHTBOX ─── */
const galleryImgs = [
   { src: 'images/insta-A.png', cap: 'Annual Day Celebration 2025' },
   { src: 'images/insta-B.png', cap: 'Smart Classroom — Interactive Learning' },
   { src: 'images/insta-C.png', cap: 'Cultural Program — Dance Performance' },
   { src: 'images/insta-D.png', cap: 'Sports Day — Athletic Events' },
   { src: 'images/insta-E.png', cap: 'Republic Day Celebration' },
   { src: 'images/group-img.png', cap: 'Science Exhibition — Student Projects' },
   { src: 'images/insta-G.png', cap: 'Cultural Festival — Rang Utsav' },
   { src: 'images/insta-A.png', cap: 'Inter-School Cricket Tournament' },
];
let lbCurrent = 0;

function openLightbox(idx) {
   lbCurrent = idx;
   document.getElementById('lbImg').src = galleryImgs[idx].src;
   document.getElementById('lbCaption').textContent = galleryImgs[idx].cap;
   document.getElementById('lightboxOverlay').classList.add('open');
   document.body.style.overflow = 'hidden';
}
function closeLightbox() {
   document.getElementById('lightboxOverlay').classList.remove('open');
   document.body.style.overflow = '';
}
function lbNav(dir) {
   lbCurrent = (lbCurrent + dir + galleryImgs.length) % galleryImgs.length;
   document.getElementById('lbImg').src = galleryImgs[lbCurrent].src;
   document.getElementById('lbCaption').textContent = galleryImgs[lbCurrent].cap;
}
function handleLBClick(e) { if (e.target === document.getElementById('lightboxOverlay')) closeLightbox(); }
document.addEventListener('keydown', e => {
   if (document.getElementById('lightboxOverlay').classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbNav(-1);
      if (e.key === 'ArrowRight') lbNav(1);
   }
});

// Gallery filter
document.querySelectorAll('.filter-btn').forEach(btn => {
   btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.dataset.filter;
      document.querySelectorAll('.gal-item').forEach(item => {
         if (filter === 'all' || item.dataset.cat === filter) {
            item.style.display = '';
         } else {
            item.style.display = 'none';
         }
      });
   });
});

/* ─── STORIES CAROUSEL ─── */
let storiesIdx = 0;

function storiesVisible() {
   if (window.innerWidth <= 480) return 1;
   if (window.innerWidth <= 720) return 3;
   return 4;
}

const storiesTrack = document.getElementById("storiesTrack");
const storiesCards = document.querySelectorAll(".story-card");
const STORIES_TOTAL = storiesCards.length;

function buildStoriesDots() {

   const wrap = document.getElementById("storiesDots");
   wrap.innerHTML = "";

   const pages = Math.ceil(STORIES_TOTAL / storiesVisible());

   for (let i = 0; i < pages; i++) {

      const dot = document.createElement("button");

      dot.className = "stories-dot" + (i == 0 ? " active" : "");

      dot.onclick = () => storiesGoTo(i);

      wrap.appendChild(dot);

   }

}

function storiesGoTo(page) {

   storiesIdx = page;

   const cardWidth = document.querySelector(".story-card").offsetWidth + 24;

   const offset = page * storiesVisible() * cardWidth;

   storiesTrack.style.transform = `translateX(-${offset}px)`;

   document.querySelectorAll(".stories-dot").forEach((d, i) => {
      d.classList.toggle("active", i === page);
   });

}

function storiesNav(dir) {

   const pages = Math.ceil(STORIES_TOTAL / storiesVisible());

   storiesIdx = (storiesIdx + dir + pages) % pages;

   storiesGoTo(storiesIdx);

}


/* AUTO SLIDE */

setInterval(() => {
   storiesNav(1);
}, 4000);


/* INIT */

buildStoriesDots();

window.addEventListener("resize", () => {
   buildStoriesDots();
   storiesGoTo(0);
});

/* ─── POSTER CAROUSEL ─── */
let posterIdx = 0;
const POSTER_TOTAL = 7;
const POSTER_VISIBLE = () => window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;

function buildPosterDots() {
   const wrap = document.getElementById('posterDots');
   wrap.innerHTML = '';
   const pages = Math.ceil(POSTER_TOTAL / POSTER_VISIBLE());
   for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'p-dot' + (i === 0 ? ' active' : '');
      d.onclick = () => posterGoTo(i);
      wrap.appendChild(d);
   }
}

function posterGoTo(pageIdx) {
   posterIdx = pageIdx;
   const cardW = 300 + 24;
   const offset = pageIdx * POSTER_VISIBLE() * cardW;
   document.getElementById('posterTrack').style.transform = `translateX(-${offset}px)`;
   document.querySelectorAll('.p-dot').forEach((d, i) => d.classList.toggle('active', i === pageIdx));
}

function posterNav(dir) {
   const pages = Math.ceil(POSTER_TOTAL / POSTER_VISIBLE());
   posterGoTo((posterIdx + dir + pages) % pages);
}

/* ─── CONTACT FORM ─── */
function selectInqType(btn) {
   document.querySelectorAll('.inq-type').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');
}

function submitContactForm() {
   const name = document.getElementById('fname').value.trim();
   const phone = document.getElementById('fphone').value.trim();
   if (!name || !phone) {
      alert('Please fill in your name and phone number.');
      return;
   }
   document.getElementById('contactFormWrap').style.display = 'none';
   document.getElementById('formSuccess').classList.add('show');
}

/* ─── COUNTER ANIMATION ─── */
function animateCounters() {
   const counters = document.querySelectorAll('[data-target]');
   const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
         if (!entry.isIntersecting) return;
         const el = entry.target, target = +el.dataset.target;
         const step = target / (1800 / 16); let cur = 0;
         const t = setInterval(() => {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(t); }
            el.textContent = Math.floor(cur).toLocaleString();
            if (target >= 1000) el.textContent = Math.floor(cur).toLocaleString() + '+';
         }, 16);
         obs.unobserve(el);
      });
   }, { threshold: 0.3 });
   counters.forEach(c => obs.observe(c));
}

/* ─── SCROLL REVEAL ─── */
function initReveal() {
   const els = document.querySelectorAll('.why-card,.ac-card,.fac-card,.stat-item,.story-card,.poster-card,.gal-item');
   const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
         if (!entry.isIntersecting) return;
         setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = entry.target.classList.contains('featured')
               ? 'scale(1.03) translateY(0)' : 'translateY(0)';
         }, i * 60);
         obs.unobserve(entry.target);
      });
   }, { threshold: 0.08 });
   els.forEach(el => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      el.style.transform = el.classList.contains('featured') ? 'scale(1.03) translateY(28px)' : 'translateY(28px)';
      obs.observe(el);
   });
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
   animateCounters();
   initReveal();
   buildStoriesDots();
   buildPosterDots();
});
window.addEventListener('resize', () => {
   buildStoriesDots();
   buildPosterDots();
   storiesGoTo(0);
   posterGoTo(0);
});
// End of js.main.js