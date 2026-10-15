/* Esquared Systems — small progressive enhancements. No dependencies. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Old WordPress links (?page_id=N) → new pages
  var legacy = { 18: '/about/', 19: '/contact/', 20: '/portfolio/', 21: '/services/' };
  var m = location.search.match(/[?&]page_id=(\d+)/);
  if (m && legacy[m[1]]) { location.replace(legacy[m[1]]); return; }

  // Theme toggle (choice remembered per browser)
  var tbtn = document.getElementById('theme-toggle');
  if (tbtn) tbtn.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Header: solid background after scrolling
  var header = document.querySelector('[data-header]');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 24); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  var nbtn = document.getElementById('nav-toggle'), nav = document.getElementById('site-nav');
  if (nbtn && nav) {
    nbtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      nbtn.setAttribute('aria-expanded', open);
      nbtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) nbtn.click(); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a') && nav.classList.contains('is-open')) nbtn.click(); });
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('is-in'); });

  // Hero word rotator (typewriter)
  var rot = document.querySelector('.rotator');
  if (rot && !reduce) {
    var words = JSON.parse(rot.dataset.words || '[]'), wi = 0, ci = words[0] ? words[0].length : 0, del = true;
    (function tick() {
      var w = words[wi];
      if (del) { ci--; if (ci < 0) { del = false; wi = (wi + 1) % words.length; ci = 0; } }
      else { ci++; if (ci > words[wi].length) { del = true; ci = words[wi].length; return setTimeout(tick, 1800); } }
      rot.textContent = words[wi].slice(0, Math.max(ci, 0)) || '​';
      setTimeout(tick, del ? 45 : 85);
    })();
  }

  // Carousels (team): arrow buttons page by one card, autoplay pauses on hover/focus
  document.querySelectorAll('[data-carousel]').forEach(function (track) {
    var wrap = track.closest('section') || document;
    var prev = wrap.querySelector('[data-carousel-prev]'), next = wrap.querySelector('[data-carousel-next]');
    function step() { var c = track.children[0]; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16) : track.clientWidth; }
    function atEnd() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
    function update() {
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = atEnd();
      var nav = prev && prev.parentElement; if (nav) nav.hidden = track.scrollWidth <= track.clientWidth + 4;
    }
    function go(dir) { track.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' }); }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update); update();
    if (!reduce) {
      var paused = false, timer = setInterval(function () {
        if (paused || document.hidden || track.scrollWidth <= track.clientWidth + 4) return;
        if (atEnd()) track.scrollTo({ left: 0, behavior: 'smooth' }); else go(1);
      }, 4500);
      ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { wrap.addEventListener(ev, function () { paused = true; }, { passive: true }); });
      ['mouseleave', 'focusout'].forEach(function (ev) { wrap.addEventListener(ev, function () { paused = false; }); });
    }
  });

  // Category filters (services, portfolio)
  document.querySelectorAll('.filters').forEach(function (group) {
    var list = group.parentElement.querySelector('[data-filterable]');
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip'); if (!chip || !list) return;
      group.querySelectorAll('.chip').forEach(function (c) { var on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', on); });
      var f = chip.dataset.filter;
      Array.prototype.forEach.call(list.children, function (el) { el.hidden = !(f === 'all' || el.dataset.category === f); });
    });
  });

  // Contact form: preselect service from ?service=, submit without leaving the page
  var form = document.getElementById('contact-form');
  if (form) {
    var svc = new URLSearchParams(location.search).get('service'), sel = document.getElementById('service-select');
    if (svc && sel) sel.value = svc;
    if (/[?&]sent=1/.test(location.search)) { var st = document.getElementById('form-status'); st.className = 'form-status ok'; st.textContent = 'Thanks! We\u2019ll get back to you within one business day.'; }
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = false;
      form.querySelectorAll('[required]').forEach(function (f) { var ok = f.checkValidity(); f.classList.toggle('is-invalid', !ok); if (!ok) bad = true; });
      if (bad) { status.className = 'form-status err'; status.textContent = 'Please fill in your name, a valid email and a message.'; return; }
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true;
      status.className = 'form-status'; status.textContent = 'Sending…';
      fetch(form.dataset.ajax || form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) !== 'true') throw new Error(); }); })
        .then(function () { form.reset(); status.className = 'form-status ok'; status.textContent = 'Thanks! We’ll get back to you within one business day.'; })
        .catch(function () { status.className = 'form-status err'; status.textContent = 'Something went wrong. Please email us directly.'; })
        .finally(function () { btn.disabled = false; });
    });
  }
})();
