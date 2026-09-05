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


  /* ---------- 3D fleet monitor (hero canvas) ----------
     Nodes are laid out on a Fibonacci sphere, projected with a simple perspective
     transform and painted back-to-front. No library: it is a few hundred points,
     so the maths is cheaper than the bytes a 3D engine would cost. */
  function initFleet() {
    var canvas = document.getElementById('fleet-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var NODE_COUNT = 44;
    var stage = canvas.parentNode;
    var w = 0, h = 0, dpr = 1;

    var hud = {
      load: document.querySelector('[data-hud="load"]'),
      inc: document.querySelector('[data-hud="inc"]'),
      ts: document.querySelector('[data-hud="log-ts"]'),
      lv: document.querySelector('[data-hud="log-lv"]'),
      msg: document.querySelector('[data-hud="log-msg"]')
    };

    /* --- build the fleet --- */
    var nodes = [];
    var golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < NODE_COUNT; i++) {
      var y = 1 - (i / (NODE_COUNT - 1)) * 2;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var th = golden * i;
      nodes.push({
        x: Math.cos(th) * r, y: y, z: Math.sin(th) * r,
        pulse: 0,        // incident intensity, 0..1
        blink: Math.random() * Math.PI * 2
      });
    }

    // Link each node to its nearest few neighbours — a plausible mesh, not a cage.
    var edges = [];
    for (var a = 0; a < nodes.length; a++) {
      var d = [];
      for (var b = 0; b < nodes.length; b++) {
        if (a === b) continue;
        var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y, dz = nodes[a].z - nodes[b].z;
        d.push({ b: b, dist: dx * dx + dy * dy + dz * dz });
      }
      d.sort(function (m, n) { return m.dist - n.dist; });
      for (var k = 0; k < 3; k++) {
        var pair = a < d[k].b ? [a, d[k].b] : [d[k].b, a];
        var key = pair[0] + ':' + pair[1];
        if (!edges.some(function (e) { return e.key === key; })) {
          edges.push({ key: key, a: pair[0], b: pair[1] });
        }
      }
    }

    // Radial gradients are expensive to build, and we were creating ~20 of them
    // every frame. Bake each glow into a sprite once and blit it instead.
    function makeGlow(rgb) {
      var size = 64;
      var c = document.createElement('canvas');
      c.width = c.height = size;
      var g2 = c.getContext('2d');
      var grad = g2.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(' + rgb + ', 1)');
      grad.addColorStop(0.4, 'rgba(' + rgb + ', 0.35)');
      grad.addColorStop(1, 'rgba(' + rgb + ', 0)');
      g2.fillStyle = grad;
      g2.fillRect(0, 0, size, size);
      return c;
    }
    var glowCyan = makeGlow('34, 211, 238');
    var glowRose = makeGlow('251, 113, 133');

    function blit(sprite, x, y, radius, alpha) {
      if (alpha <= 0.01) return;
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
      ctx.globalAlpha = 1;
    }

    var packets = [];
    var incidents = 0;
    var loadAvg = 0.42;
    var rotY = 0.6, rotX = -0.18;
    var dragVX = 0, dragVY = 0;
    var reduce = reduceMotion;

    function resize() {
      var rect = stage.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(n) {
      // rotate around Y then X
      var cy = Math.cos(rotY), sy = Math.sin(rotY);
      var x1 = n.x * cy - n.z * sy;
      var z1 = n.x * sy + n.z * cy;
      var cx = Math.cos(rotX), sx = Math.sin(rotX);
      var y1 = n.y * cx - z1 * sx;
      var z2 = n.y * sx + z1 * cx;

      var radius = Math.min(w, h) * 0.37;
      var persp = 1.9 / (1.9 + z2);   // small focal length = pronounced perspective
      return {
        sx: w / 2 + x1 * radius * persp,
        sy: h / 2 + y1 * radius * persp,
        depth: z2,
        scale: persp
      };
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      var pts = nodes.map(project);

      // Edges first, faded by depth
      for (var e = 0; e < edges.length; e++) {
        var pa = pts[edges[e].a], pb = pts[edges[e].b];
        var avg = (pa.depth + pb.depth) / 2;
        var t = (1 - avg) / 2;                       // 0 = far, 1 = near
        var alpha = 0.05 + Math.pow(t, 2.1) * 0.42;  // near edges dominate
        if (alpha <= 0.02) continue;
        var hot = nodes[edges[e].a].pulse + nodes[edges[e].b].pulse;
        ctx.strokeStyle = hot > 0.05
          ? 'rgba(251, 113, 133, ' + (alpha + hot * 0.5).toFixed(3) + ')'
          : 'rgba(34, 211, 238, ' + alpha.toFixed(3) + ')';
        ctx.lineWidth = (hot > 0.05 ? 1.2 : 0.55) + t * 0.7;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      }

      // Packets in transit
      if (packets.length) {
        ctx.fillStyle = 'rgba(167, 139, 250, 0.95)';
        ctx.beginPath();
        for (var q = 0; q < packets.length; q++) {
          var pk = packets[q];
          var qa = pts[edges[pk.edge].a], qb = pts[edges[pk.edge].b];
          var px = qa.sx + (qb.sx - qa.sx) * pk.t;
          var py = qa.sy + (qb.sy - qa.sy) * pk.t;
          ctx.moveTo(px + 2.1, py);
          ctx.arc(px, py, 2.1, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // Nodes painted back to front so nearer ones overlap correctly
      var order = pts.map(function (p, i) { return i; })
                     .sort(function (i, j) { return pts[j].depth - pts[i].depth; });

      for (var o = 0; o < order.length; o++) {
        var idx = order[o];
        var p = pts[idx], n = nodes[idx];
        var size = 1.6 + 3.4 * Math.pow(p.scale / 2, 1.3);
        var near = Math.max(0, Math.min(1, (1 - p.depth) / 2));
        var twinkle = 0.75 + Math.sin(n.blink) * 0.25;

        // Punch a hole in the mesh behind this node so it reads as being in front.
        var pad = size * 1.35;
        ctx.fillStyle = 'rgba(6, 9, 15, ' + (0.35 + near * 0.6).toFixed(3) + ')';
        ctx.fillRect(p.sx - pad, p.sy - pad, pad * 2, pad * 2);

        if (n.pulse > 0.01) {
          blit(glowRose, p.sx, p.sy, size * (3 + n.pulse * 5), 0.6 * n.pulse);
          ctx.fillStyle = 'rgba(251, 113, 133, ' + (0.55 + near * 0.45).toFixed(3) + ')';
        } else {
          if (near > 0.55) {
            blit(glowCyan, p.sx, p.sy, size * 3.4, 0.24 * (near - 0.55) / 0.45);
          }
          ctx.fillStyle = 'rgba(34, 211, 238, ' + (0.18 + near * 0.80 * twinkle).toFixed(3) + ')';
        }

        // Square marks read as machines rather than stars
        ctx.fillRect(p.sx - size / 2, p.sy - size / 2, size, size);
      }
    }

    /* --- simulation --- */
    var logLines = [
      ['info', 'zabbix: health sweep across 44 nodes complete'],
      ['ok', 'web-07: php-fpm pool recycled, memory reclaimed'],
      ['warn', 'db-02: slow query 2.4s — index candidate logged'],
      ['ok', 'mail-01: DKIM signature verified for outbound relay'],
      ['info', 'edge-03: kernel patched live, no reboot required'],
      ['ok', 'backup: nightly restore drill passed on random account'],
      ['warn', 'web-11: I/O wait 38% — scanner burst, LVE cap applied'],
      ['ok', 'csf: 214 brute-force attempts dropped in last hour'],
      ['info', 'app-05: cutover rehearsal green, rollback path verified'],
      ['ok', 'ssl: 12 certificates renewed via acme.sh']
    ];
    var logIdx = 0;

    function pushLog(level, msg) {
      if (!hud.ts) return;
      var d = new Date();
      function pad(v) { return (v < 10 ? '0' : '') + v; }
      hud.ts.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
      hud.lv.textContent = level.toUpperCase();
      hud.lv.className = 'lv lv--' + level;
      hud.msg.textContent = msg;
    }

    var timers = [];

    function startSim() {
      pushLog('info', 'zabbix: agent check-in received from 44 nodes');
      timers.push(setInterval(function () {
        var line = logLines[logIdx % logLines.length];
        logIdx++;
        pushLog(line[0], line[1]);
      }, 3400));

      // Load average drifts, as it does
      timers.push(setInterval(function () {
        loadAvg = Math.max(0.08, Math.min(3.6, loadAvg + (Math.random() - 0.48) * 0.35));
        if (hud.load) hud.load.textContent = loadAvg.toFixed(2);
      }, 1500));

      // Every so often a node goes critical, then gets resolved
      timers.push(setInterval(function () {
        var victim = nodes[Math.floor(Math.random() * nodes.length)];
        if (victim.pulse > 0.01) return;
        victim.pulse = 1;
        incidents++;
        if (hud.inc) { hud.inc.textContent = incidents; hud.inc.classList.add('is-alert'); }
        pushLog('warn', 'node-' + Math.floor(Math.random() * 44 + 1) + ': load spike detected, triaging');

        setTimeout(function () {
          pushLog('ok', 'incident resolved — root cause logged, RCA drafted');
          if (hud.inc) hud.inc.classList.remove('is-alert');
        }, 4200);
      }, 9000));
    }

    /* --- interaction: drag to rotate --- */
    var dragging = false, lastX = 0, lastY = 0;

    canvas.addEventListener('pointerdown', function (ev) {
      dragging = true; lastX = ev.clientX; lastY = ev.clientY;
      canvas.setPointerCapture(ev.pointerId);
    });
    canvas.addEventListener('pointermove', function (ev) {
      if (!dragging) return;
      dragVY = (ev.clientX - lastX) * 0.006;
      dragVX = (ev.clientY - lastY) * 0.004;
      rotY += dragVY;
      rotX = Math.max(-0.9, Math.min(0.9, rotX + dragVX));
      lastX = ev.clientX; lastY = ev.clientY;
    });
    function endDrag(ev) {
      if (!dragging) return;
      dragging = false;
      try { canvas.releasePointerCapture(ev.pointerId); } catch (err) {}
    }
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    /* --- loop --- */
    var raf = null, running = false, last = 0;

    function frame(now) {
      var dt = Math.min((now - last) / 1000, 0.05) || 0.016;
      last = now;

      if (!dragging) {
        rotY += 0.0022 + dragVY;
        dragVY *= 0.94;              // let a flick coast to a stop
        rotX += (-0.18 - rotX) * 0.01;
      }

      for (var i = 0; i < nodes.length; i++) {
        nodes[i].blink += dt * 1.6;
        if (nodes[i].pulse > 0) nodes[i].pulse = Math.max(0, nodes[i].pulse - dt * 0.22);
      }

      if (Math.random() < 0.06 && packets.length < 14) {
        packets.push({ edge: Math.floor(Math.random() * edges.length), t: 0 });
      }
      for (var q = packets.length - 1; q >= 0; q--) {
        packets[q].t += dt * 0.7;
        if (packets[q].t > 1) packets.splice(q, 1);
      }

      draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduce) return;
      running = true; last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }

    resize();
    window.addEventListener('resize', function () { resize(); draw(); });

    if (reduce) {
      // Static frame only — still shows the structure, costs nothing.
      draw();
      if (hud.load) hud.load.textContent = loadAvg.toFixed(2);
      pushLog('ok', 'fleet healthy — 44 nodes reporting');
      return;
    }

    startSim();
    start();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    // Don't burn frames while the hero is scrolled out of view.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
      }, { threshold: 0.05 }).observe(canvas);
    }
  }

  /* ---------- Avatar photo with initials fallback ---------- */
  function initAvatar() {
    document.querySelectorAll('.avatar__img').forEach(function (img) {
      function drop() { if (img.parentNode) img.parentNode.removeChild(img); }
      if (img.complete && img.naturalWidth === 0) drop();
      img.addEventListener('error', drop);
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    var modules = [
      initScroll, initDrawer, initReveal, initCounters, initBars, initTyped,
      initSpotlight, initFilters, initCopy, initForm, initActiveNav, initYear,
      initFleet, initAvatar
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
