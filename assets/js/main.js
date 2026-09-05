/* ==========================================================================
   Alan Joy — Personal site
   assets/js/main.js
   Vanilla JS. No dependencies. Every module fails soft if its markup is absent.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky nav + scroll progress ---------- */
  function initScroll() {
    var nav = document.querySelector('.nav');
    var bar = document.querySelector('.progress-bar');
    var toTop = document.querySelector('.to-top');
    var ticking = false;

    function update() {
      var y = window.scrollY || document.documentElement.scrollTop;

      if (nav) nav.classList.toggle('is-stuck', y > 20);
      if (toTop) toTop.classList.toggle('is-visible', y > 600);

      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    update();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  }

  /* ---------- Mobile drawer ---------- */
  function initDrawer() {
    var burger = document.getElementById('burger');
    var drawer = document.getElementById('drawer');
    if (!burger || !drawer) return;

    var links = drawer.querySelectorAll('a');

    function setOpen(open) {
      burger.classList.toggle('is-open', open);
      drawer.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';

      if (open) {
        links.forEach(function (a, i) {
          a.style.animationDelay = (0.05 + i * 0.06) + 's';
        });
      }
    }

    burger.addEventListener('click', function () {
      setOpen(!drawer.classList.contains('is-open'));
    });

    links.forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (el.getAttribute('data-decimals') | 0);

      if (reduceMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }

      var start = performance.now();
      var dur = 1600;

      function step(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      nums.forEach(run);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Skill bars ---------- */
  function initBars() {
    var fills = document.querySelectorAll('.bar__fill[data-pct]');
    if (!fills.length) return;

    function fill(el) { el.style.width = el.getAttribute('data-pct') + '%'; }

    if (!('IntersectionObserver' in window)) { fills.forEach(fill); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { fill(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });

    fills.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Typewriter for hero role ---------- */
  function initTyped() {
    var el = document.querySelector('[data-typed]');
    if (!el) return;

    var words;
    try { words = JSON.parse(el.getAttribute('data-typed')); }
    catch (err) { return; }
    if (!Array.isArray(words) || !words.length) return;

    if (reduceMotion) { el.textContent = words[0]; return; }

    var w = 0, c = 0, deleting = false;

    function tick() {
      var word = words[w];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);

      var delay = deleting ? 40 : 75;

      if (!deleting && c === word.length) {
        delay = 1900;
        deleting = true;
      } else if (deleting && c === 0) {
        deleting = false;
        w = (w + 1) % words.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    }
    setTimeout(tick, 500);
  }

  /* ---------- Card spotlight (pointer-follow glow) ---------- */
  function initSpotlight() {
    if (reduceMotion || window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Filter + search (projects & blog) ---------- */
  function initFilters() {
    document.querySelectorAll('[data-filter-group]').forEach(function (group) {
      var targetSel = group.getAttribute('data-filter-target');
      var list = document.querySelector(targetSel);
      if (!list) return;

      var items = Array.prototype.slice.call(list.querySelectorAll('[data-tags]'));
      var buttons = Array.prototype.slice.call(group.querySelectorAll('.filter-btn'));
      var searchSel = group.getAttribute('data-search');
      var emptySel = group.getAttribute('data-empty');
      var searchInput = searchSel ? document.querySelector(searchSel) : null;
      var empty = emptySel ? document.querySelector(emptySel) : null;

      var activeTag = 'all';

      function apply() {
        var q = (searchInput && searchInput.value || '').trim().toLowerCase();
        var shown = 0;

        items.forEach(function (item) {
          var tags = (item.getAttribute('data-tags') || '').toLowerCase();
          var text = (item.textContent || '').toLowerCase();
          var okTag = activeTag === 'all' || tags.indexOf(activeTag) !== -1;
          var okQuery = !q || text.indexOf(q) !== -1 || tags.indexOf(q) !== -1;
          var visible = okTag && okQuery;

          item.classList.toggle('is-hidden', !visible);
          if (visible) shown++;
        });

        if (empty) empty.classList.toggle('is-hidden', shown !== 0);
      }

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          buttons.forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-pressed', 'true');
          activeTag = (btn.getAttribute('data-tag') || 'all').toLowerCase();
          apply();
        });
      });

      if (searchInput) {
        var t;
        searchInput.addEventListener('input', function () {
          clearTimeout(t);
          t = setTimeout(apply, 120);
        });
      }

      apply();
    });
  }

  /* ---------- Copy code blocks ---------- */
  function initCopy() {
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var block = btn.closest('.codeblock');
        var pre = block && block.querySelector('pre');
        if (!pre) return;

        var text = pre.innerText;
        var done = function () {
          var old = btn.textContent;
          btn.textContent = 'Copied';
          btn.classList.add('is-done');
          setTimeout(function () {
            btn.textContent = old;
            btn.classList.remove('is-done');
          }, 1800);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () {});
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    });
  }

  /* ---------- Contact form validation ---------- */
  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var status = form.querySelector('.form-status');

    // Only POST once a real access key has replaced the placeholder; otherwise fall
    // back to mailto, so the form is never quietly broken while setup is pending.
    function endpointReady() {
      var key = form.querySelector('[name="access_key"]');
      var value = key ? key.value.trim() : '';
      return !!(form.getAttribute('action') && value && value.indexOf('PASTE-') !== 0);
    }

    // The setup reminder is for the site owner, not visitors — drop it once wired up.
    if (endpointReady()) {
      var note = document.getElementById('form-setup-note');
      if (note) note.remove();
    }

    // Non-JS submits round-trip through Web3Forms and come back with ?sent=1.
    // Acknowledge that here so those visitors still get a confirmation.
    if (/[?&]sent=1(&|$)/.test(window.location.search)) {
      if (status) {
        status.className = 'form-status is-ok';
        status.textContent = 'Thanks — your message is on its way. I usually reply within 24 hours.';
      }
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }

    function fail(field, msg) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.add('has-error');
      var err = wrap.querySelector('.field__err');
      if (err) err.textContent = msg;
    }

    function clear(field) {
      var wrap = field.closest('.field');
      if (wrap) wrap.classList.remove('has-error');
    }

    form.querySelectorAll('input, textarea').forEach(function (f) {
      f.addEventListener('input', function () { clear(f); });
    });

    form.addEventListener('submit', function (e) {
      var name = form.querySelector('#cf-name');
      var email = form.querySelector('#cf-email');
      var message = form.querySelector('#cf-message');
      var ok = true;

      [name, email, message].forEach(function (f) { if (f) clear(f); });

      if (name && !name.value.trim()) { fail(name, 'Please enter your name.'); ok = false; }

      if (email) {
        var v = email.value.trim();
        if (!v) { fail(email, 'Please enter your email.'); ok = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { fail(email, 'That email address looks invalid.'); ok = false; }
      }

      if (message && message.value.trim().length < 15) {
        fail(message, 'Please add a little more detail (15+ characters).');
        ok = false;
      }

      if (!ok) {
        e.preventDefault();
        if (status) {
          status.className = 'form-status is-err';
          status.textContent = 'Please fix the highlighted fields and try again.';
        }
        return;
      }

      // Validation passed. JS always owns the submit from here, so the visitor can
      // never be shown the endpoint's raw JSON response.
      e.preventDefault();

      var mailto = form.getAttribute('data-mailto');

      function mailtoFallback(reason) {
        var subject = encodeURIComponent('Website enquiry from ' + (name ? name.value.trim() : ''));
        var body = encodeURIComponent(
          (message ? message.value.trim() : '') +
          '\n\n---\nFrom: ' + (name ? name.value.trim() : '') +
          '\nEmail: ' + (email ? email.value.trim() : '')
        );
        window.location.href = 'mailto:' + mailto + '?subject=' + subject + '&body=' + body;
        if (status) {
          status.className = 'form-status is-ok';
          status.textContent = reason + ' Opening your email client instead — if nothing happens, write to ' + mailto + ' directly.';
        }
      }

      if (!endpointReady()) {
        mailtoFallback('The contact form is not connected yet.');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var btnHTML = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      if (status) { status.className = 'form-status'; }

      fetch(form.getAttribute('action'), {
        method: 'POST',
        body: new FormData(form)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!data || !data.success) throw new Error((data && data.message) || 'Submission rejected');
          form.reset();
          if (status) {
            status.className = 'form-status is-ok';
            status.textContent = 'Thanks — your message is on its way. I usually reply within 24 hours.';
          }
        })
        .catch(function () {
          mailtoFallback("Sorry, that didn't send.");
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = btnHTML; }
        });
    });
  }

  /* ---------- Active nav link ---------- */
  function initActiveNav() {
    var page = document.body.getAttribute('data-page');
    if (!page) return;

    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === page) a.classList.add('is-active');
    });
  }

  /* ---------- Dynamic year ---------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    var modules = [
      initScroll, initDrawer, initReveal, initCounters, initBars, initTyped,
      initSpotlight, initFilters, initCopy, initForm, initActiveNav, initYear
    ];
    // Isolate each module: a failure in one must not stop the others from running.
    modules.forEach(function (fn) {
      try { fn(); }
      catch (err) { if (window.console) console.error('[init] ' + fn.name + ':', err); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
