// PRODUCTS mega menu hover logic
(function(){
  const mega = document.getElementById('productsMenu');
  if(!mega) return;
  const cats = mega.querySelectorAll('.cats li');
  const panels = mega.querySelectorAll('.panel');
  cats.forEach(li=>{
    li.addEventListener('mouseenter', ()=>{
      cats.forEach(n=>n.classList.remove('active'));
      panels.forEach(p=>p.classList.remove('active'));
      li.classList.add('active');
      const match = mega.querySelector('.panel[data-cat="'+li.dataset.cat+'"]');
      if(match) match.classList.add('active');
    });
  });
})();

// Hero slider
(function(){
  const slides = [
    { 
      title: 'Microdermabrasion',
      sub: 'polish + refine for smoother texture',
      copy: 'Buff away dull surface build-up for instantly brighter, softer skin.',
      img: 'assets/microderm.jpeg'
    },
    { 
      title: 'Chemical Peel Treatment',
      sub: 'resurface + glow',
      copy: 'Targeted peel options to unclog pores and visibly even tone—tailored to your skin.',
      img: 'assets/chemicalpeels.jpg'
    },
    { 
      title: 'Epidermal Levelling',
      sub: 'silky-smooth, makeup-ready finish',
      copy: 'Gentle exfoliation removes vellus hair and dead skin for a flawless base.',
      img: 'assets/leveling.jpeg'
    },
    { 
      title: 'Products',
      sub: 'bestsellers for daily care',
      copy: 'Shop skincare, bath + body, hair and wellness favorites curated by our experts.',
      img: 'assets/products.jpeg'
    }
  ];

  let i = 0;
  const hero = document.getElementById('hero');
  const title = document.getElementById('heroTitle');
  const sub = document.getElementById('heroSub');
  const copy = document.getElementById('heroCopy');
  const panel = document.getElementById('heroPanel');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');

  const existingTrack = hero.querySelector('.hero-track');
  if(existingTrack) existingTrack.remove();
  const track = document.createElement('div');
  track.className = 'hero-track';
  track.innerHTML = slides.map(s=>`<div class="hero-slide" style="background-image:url('${s.img}')"></div>`).join('');
  hero.appendChild(track);

  const dotsWrap = document.querySelector('.dots');
  dotsWrap.innerHTML = slides.map((_, idx)=>'<div class="dot'+(idx===0?' active':'')+'"></div>').join('');
  let dots = dotsWrap.querySelectorAll('.dot');

  function render(){
    const s = slides[i];
    track.style.transform = 'translateX('+(i*-100)+'%)';
    panel.style.transform = 'translateX(20px)'; panel.style.opacity = '0';
    title.textContent = s.title;
    if(sub) sub.textContent = s.sub || '';
    copy.textContent = s.copy;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      panel.style.transform = 'translateX(0)'; panel.style.opacity = '1';
    }));
    dots.forEach((d,idx)=>d.classList.toggle('active', idx===i));
  }

  function nextSlide(){ i=(i+1)%slides.length; render(); }
  function prevSlide(){ i=(i+slides.length-1)%slides.length; render(); }

  const AUTOPLAY_MS = 5000;
  let timer;
  function restart(){ clearInterval(timer); timer = setInterval(nextSlide, AUTOPLAY_MS); }

  prev.addEventListener('click', ()=>{ prevSlide(); restart(); });
  next.addEventListener('click', ()=>{ nextSlide(); restart(); });
  dots.forEach((d,idx)=>d.addEventListener('click', ()=>{ i=idx; render(); restart(); }));

  hero.addEventListener('mouseenter', ()=>clearInterval(timer));
  hero.addEventListener('mouseleave', restart);

  render(); restart();
})();

// Split visuals → point to local assets (Row 1..4)
// Keep everything else byte-for-byte.
(function(){
  const targets = document.querySelectorAll('.features.tighter .split .visual');
  const assets = [
    'assets/medspa.jpeg',  // Row 1: medSPA (Therapist room)
    'assets/spa.jpg',      // Row 2: Spa (Relaxing spa)
    'assets/salon.jpg',    // Row 3: Salon (Salon services)
    'assets/products.jpeg' // Row 4: Products
  ];
  targets.forEach((el, i) => { if (assets[i]) el.style.backgroundImage = `url('${assets[i]}')`; });
})();

// ===== ENGAGE STRIP WIRING =====
(function(){
  // 1) Configure links (replace with your real URLs)
  const byId = id => document.getElementById(id);
  byId('consultLink').href = '#';     // TODO: booking URL for Consultation
  byId('teamLink').href     = '#';    // TODO: team/about URL
  byId('bookAmanda').href   = '#';    // TODO: booking URL preselecting Amanda

  // 2) Reviews: load JSON (fallback to 3 baked quotes if missing)
  const REV_FALLBACK = [
    { text:"The epidermal levelling treatment was fantastic—dead skin and peach fuzz gone, makeup glides on. Amanda’s expertise really shines.",
      rating:5, name:"Olivia B.", service:"Epidermal Levelling", date:"2024-06-18", source:"site" },
    { text:"LED therapy cleared my congestion after a few sessions and my skin looks radiant. Highly recommend.",
      rating:5, name:"Daisy W.", service:"LED Therapy", date:"2024-07-03", source:"site" },
    { text:"Custom peel left my skin glowing and calm. I’ll definitely be back!",
      rating:5, name:"Emily W.", service:"Chemical Peel", date:"2024-05-22", source:"site" }
  ];
  const REVIEWS_URL = 'testimonial.json'; // place next to index.html

  const clampText = (s, n) => (s && s.length <= n ? s : (s||'').slice(0, n-1).trimEnd() + '…');
  const starRow = n => '★★★★★'.slice(0, Math.round(n || 5));

  function renderReviews(revs){
    const track = byId('revTrack');
    const dotsWrap = byId('revDots');
    const badge = byId('revBadge');

    const src = (revs.find(r => r.source)?.source || 'reviews').toLowerCase();
    badge.textContent = src.includes('google') ? 'Google reviews'
                     : src.includes('fresha') ? 'Fresha reviews'
                     : 'Client reviews';

    track.innerHTML = revs.map(r => {
      const text = clampText(r.text || '', 200);
      const name = r.name || r.author || 'Client';
      const svc  = r.service ? ` • ${r.service}` : '';
      const meta = [name, svc, r.date || ''].filter(Boolean).join('');
      const more = r.url ? ` <a href="${r.url}" target="_blank" rel="noopener">Read more</a>` : '';
      return `
        <div class="rev-slide" role="group">
          <p class="rev-quote">${text}${more}</p>
          <div class="rev-meta">${meta}</div>
          <div class="stars" aria-label="${r.rating || 5} out of 5 stars">${starRow(r.rating)}</div>
        </div>`;
    }).join('');

    dotsWrap.innerHTML = revs.map((_,i)=>`<button class="revdot${i===0?' active':''}" role="tab" aria-selected="${i===0}" aria-label="Go to review ${i+1}"></button>`).join('');

    let i = 0, timer;
    const slides = track.children, dots = dotsWrap.querySelectorAll('.revdot');
    const goto = idx => {
      i = (idx + revs.length) % revs.length;
      track.style.transform = 'translateX(' + (i * -100) + '%)';
      dots.forEach((d,k)=>{ d.classList.toggle('active', k===i); d.setAttribute('aria-selected', k===i); });
    };
    const next = () => goto(i+1);
    const prev = () => goto(i-1);

    byId('revNext').onclick = ()=>{ next(); restart(); };
    byId('revPrev').onclick = ()=>{ prev(); restart(); };
    dots.forEach((d,k)=> d.onclick = ()=>{ goto(k); restart(); });

    dotsWrap.addEventListener('keydown', e=>{
      if(e.key === 'ArrowRight'){ next(); restart(); }
      if(e.key === 'ArrowLeft'){ prev(); restart(); }
    });

    const AUTO_MS = 5600;
    const start = ()=> timer = setInterval(next, AUTO_MS);
    const stop  = ()=> clearInterval(timer);
    const restart = ()=>{ stop(); start(); };
    const region = document.querySelector('.reviews');
    region.addEventListener('mouseenter', stop);
    region.addEventListener('mouseleave', start);
    region.addEventListener('focusin', stop);
    region.addEventListener('focusout', start);

    goto(0); start();

    // JSON-LD AggregateRating (SEO)
    try{
      const count = revs.length;
      const avg = (revs.reduce((s,r)=>s+(Number(r.rating)||5),0)/count).toFixed(2);
      const ld = {
        "@context":"https://schema.org",
        "@type":"LocalBusiness",
        "name":"Fit Skin Clinic",
        "aggregateRating":{
          "@type":"AggregateRating",
          "ratingValue": avg,
          "reviewCount": count
        }
      };
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(ld);
      document.head.appendChild(s);
    }catch(e){}
  }

  fetch(REVIEWS_URL, {cache:'no-store'})
    .then(r => r.ok ? r.json() : REV_FALLBACK)
    .then(data => Array.isArray(data) ? data : (data.reviews || REV_FALLBACK))
    .then(renderReviews)
    .catch(()=>renderReviews(REV_FALLBACK));
})();
/* ===== WIRING: links + CTAs (index only) ===== */
(function () {
  // One place to change later if you want to deep-link directly to Beautisoftware:
  const BOOK_URL = '/service-page-skin-consultation.html#book';

  // Map visible link text → page URL (case/spacing/fancy characters are normalized)
  const MAP = {
    // SPA TREATMENTS
    'fit skin facial': '/service-page-fit-skin-facial.html',
    'hydrabrasion facial': '/service-page-hydrabrasion-facial.html',
    'microdermabrasion facial': '/service-page-microdermabrasion-facial.html',
    'epidermal levelling': '/service-page-epidermal-levelling.html',
    'skin consultation': '/service-page-skin-consultation.html',

    // MEDSPA TREATMENTS
    'skin needling': '/service-page-skin-needling.html',
    'led therapy': '/service-page-led-therapy.html',
    'led light therapy': '/service-page-led-therapy.html',
    'enzymatic peel': '/service-page-enzymatic-peel.html',
    'dermaceuticals peel': '/service-page-chemical-peel.html',
    'advanced consultation': '/service-page-advanced-consultation.html',

    // SALON SERVICES
    'lash lift + tint': '/service-page-lash-lift-and-tint.html',
    'lash lift & tint': '/service-page-lash-lift-and-tint.html',
    'brow wax + tint': '/service-page-brow-wax-and-tint.html',
    'brow wax & tint': '/service-page-brow-wax-and-tint.html',
    'lash tint': '/service-page-lash-tint.html',
    'brow tint': '/service-page-brow-tint.html',

    // ADD-ONS (point to closest core page with anchor stubs)
    'add-on led': '/service-page-led-therapy.html#as-addon',
    'add-on led': '/service-page-led-therapy.html#as-addon',
    'add-on peel': '/service-page-chemical-peel.html#as-addon',
    'add-on peel': '/service-page-chemical-peel.html#as-addon',
    'add-on hands': '/service-page-fit-skin-facial.html#add-on-hands',
    'add-on hands': '/service-page-fit-skin-facial.html#add-on-hands',
    'add-on neck & décolletage': '/service-page-skin-needling.html#neck-decolletage',
    'add-on neck & décolletage': '/service-page-skin-needling.html#neck-decolletage',

    // Top row tabs → “closest” landing (you can refine later)
    'treatments': '/services.html#spa',
    'advanced skin': '/services.html#medspa',
    'products': '/products.html'
  };

  // If your skin-needling file temporarily has “ (2) ” in the name, fall back:
  function fixNeedling(url) {
    if (url === '/service-page-skin-needling.html') {
      try {
        // attempt to detect via <a> existence; if not found, use (2)
        // harmless if both exist
        var probe = document.querySelector('a[href="/service-page-skin-needling.html"]');
        if (!probe) return '/service-page-skin-needling.html';
      } catch (e) {}
    }
    return url;
  }

  // Normalize label text so we can match purely by what the user sees
  const norm = s => (s || '')
    .replace(/\s+/g, ' ')
    .replace(/[-–—]/g, '-')    // normalize en/em dashes
    .replace(/[’']/g, "'")
    .trim()
    .toLowerCase();

  // 1) Wire menu & tile links by their visible text
  function wireByText() {
    document.querySelectorAll('a').forEach(a => {
      const key = norm(a.textContent);
      if (MAP[key]) {
        const url = fixNeedling(MAP[key]);
        a.setAttribute('href', url);
      }
    });
  }

  // 2) Make EVERY “Book” style CTA jump to the consultation booking block
  function wireBookCTAs() {
    const BOOK_RE = /^(book|book now|book consultation|book led therapy|book skin needling)$/i;
    document.querySelectorAll('a,button').forEach(el => {
      const label = norm(el.textContent);
      if (BOOK_RE.test(el.textContent) || el.classList.contains('book')) {
        if (el.tagName === 'A') el.href = BOOK_URL;
        else el.addEventListener('click', () => location.href = BOOK_URL);
      }
    });

    // Footer “BOOK NOW” button
    const footBook = document.querySelector('.foot-brand .book');
    if (footBook) footBook.href = BOOK_URL;

    // Engage strip quick links (existing placeholders)
    const consult = document.getElementById('consultLink');
    if (consult) consult.href = BOOK_URL;
    const team = document.getElementById('teamLink');
    if (team) team.href = '/#team';
    const amanda = document.getElementById('bookAmanda');
    if (amanda) amanda.href = BOOK_URL;
  }

  // 3) Hero secondary (“Find out more”) follows the current slide’s topic
  //    Hook into your existing slider render cycle and set the CTA hrefs
  (function attachHeroLinks() {
    // Map hero slide title → detail page
    const HERO_LINKS = {
      'microdermabrasion': '/service-page-microdermabrasion-facial.html',
      'chemical peel treatment': '/service-page-chemical-peel.html',
      'epidermal levelling': '/service-page-epidermal-levelling.html',
      'products': '/#products'
    };
    const panel = document.getElementById('heroPanel');
    if (!panel) return;

    // Patch the hero after it first renders
    const apply = () => {
      const titleEl = document.getElementById('heroTitle');
      if (!titleEl) return;
      const titleKey = norm(titleEl.textContent);
      const ctas = panel.querySelectorAll('a.pill'); // [0]=primary(Book), [1]=secondary
      if (ctas[0]) ctas[0].href = BOOK_URL;
      if (ctas[1]) ctas[1].href = HERO_LINKS[titleKey] || '/services.html';
    };

    // Run once and re-run on slide changes (the slider toggles text each render)
    apply();
    // Observe title changes to re-apply
    const obs = new MutationObserver(apply);
    const titleNode = document.getElementById('heroTitle');
    if (titleNode) obs.observe(titleNode, { characterData: true, childList: true, subtree: true });
  })();

  // Kick everything off
  document.addEventListener('DOMContentLoaded', function () {
    wireByText();
    wireBookCTAs();
  });
})();

// Products mega-menu hover preview (Pelactiv/Circadia)
document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('productsPreview');
  const caption = document.getElementById('productsCaption');
  const box = document.getElementById('productsPreviewBox');

  if (!preview || !caption || !box) return;

  const BRANDS = {
    pelactiv: {
      img: '/assets/brands/pelactiv-preview.jpg',
      alt: 'Pelactiv products',
      href: 'https://pelactiv.com',
      name: 'Pelactiv'
    },
    circadia: {
      img: '/assets/brands/circadia-preview.jpg',
      alt: 'Circadia products',
      href: 'https://circadia.com',
      name: 'Circadia'
    }
  };

  function show(key){
    const b = BRANDS[key]; if (!b) return;
    preview.src = b.img; preview.alt = b.alt; caption.textContent = b.name;
    box.onclick = () => window.open(b.href, '_blank', 'noopener');
  }

  document.querySelectorAll('.mega-products .brand').forEach(a => {
    a.addEventListener('mouseenter', () => show(a.dataset.brand));
    a.addEventListener('focus', () => show(a.dataset.brand));
  });

  // default view
  show('pelactiv');
});
// === Mobile reviews: clamp long quotes with a toggle ===
(function(){
  const isMobile = () => window.matchMedia('(max-width:820px)').matches;

  function addReviewToggles(){
    if (!isMobile()) return;
    const quotes = document.querySelectorAll('.reviews .rev-quote');
    if (!quotes.length) return;

    quotes.forEach(q => {
      // don’t double-apply or clamp tiny blurbs
      if (q.dataset.toggled === '1' || (q.textContent.trim().length < 160)) return;
      q.classList.add('clamp');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'more-toggle';
      btn.textContent = 'Read more';
      btn.addEventListener('click', () => {
        const clamped = q.classList.toggle('clamp');
        btn.textContent = clamped ? 'Read more' : 'Read less';
      });
      // put button after the quote
      q.parentElement.appendChild(btn);
      q.dataset.toggled = '1';
    });
  }

  // run after the carousel has populated
  function ensure(){
    const track = document.querySelector('.reviews .rev-track');
    const ready = track && track.children && track.children.length;
    if (ready){ addReviewToggles(); }
    else { setTimeout(ensure, 150); }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensure);
  } else {
    ensure();
  }
})();

