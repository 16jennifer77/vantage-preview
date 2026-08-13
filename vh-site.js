(function () {
  'use strict';
  var PFX = location.pathname.indexOf('/products/') > -1 ? '../' : '';
  var CAT = {"glp-1-r": "glp", "glp-1-t": "glp", "nad-plus": "single", "glp-1-s": "glp", "cagrilintide": "glp", "eloralintide": "glp", "aod-9604": "glp", "5-amino-1mq": "glp", "slu-pp-332": "glp", "bpc-157": "single", "bpc-157-caps": "single", "tb-500": "single", "ghk-cu": "single", "ahk-cu": "single", "pt-141": "single", "semax": "single", "selank": "single", "ipamorelin": "single", "dsip": "single", "mots-c": "single", "epithalon": "single", "tesamorelin": "single", "sermorelin": "single", "glutathione": "single", "kpv": "single", "kpv-oral": "single", "ll-37": "single", "ss-31": "single", "foxo4-dri": "single", "ara-290": "single", "b12": "single", "l-carnitine": "single", "hcg": "single", "igf-1-lr3": "single", "thymalin": "single", "oxytocin": "single", "pinealon": "single", "pe-22-28": "single", "vip": "single", "chonluten": "single", "bac-water": "single", "bpc-tb-blend": "blend", "bpc-tb-kpv-blend": "blend", "ghk-cu-kpv-blend": "blend", "cjc-ipa-blend": "blend", "tesa-ipa-blend": "blend", "ss31-motsc-blend": "blend", "selank-semax-blend": "blend", "nad-motsc-5a1mq-blend": "blend", "klow-blend": "blend"};
  var STOCK = {
    'glp-1-r':  { title: 'GLP-1 R', size: '30mg',   price: 180 },
    'glp-1-t':  { title: 'GLP-1 T', size: '60mg',   price: 150 },
    'nad-plus': { title: 'NAD+',    size: '1000mg', price: 80 }
  };
  function $(s, r) { return (r || document).querySelector(s) }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  function money(n) { return '$' + (Math.round(n * 100) / 100).toLocaleString('en-US') }
  function el(tag, css, htmlStr) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (htmlStr) e.innerHTML = htmlStr; return e }
  var SESSION_KEY = 'vh-preview-session';
  function session() { try { return !!localStorage.getItem(SESSION_KEY) } catch (e) { return false } }

  /* ============ styles ============ */
  var style = document.createElement('style');
  style.textContent = '\
#vh-drawer-ov{position:fixed;inset:0;z-index:95;background:rgba(20,10,40,.45);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .25s}\
#vh-drawer-ov.on{opacity:1;pointer-events:auto}\
#vh-drawer{position:fixed;top:0;right:0;bottom:0;z-index:96;width:min(400px,92vw);background:#fff;box-shadow:-24px 0 60px rgba(20,8,50,.25);transform:translateX(105%);transition:transform .28s cubic-bezier(.2,.7,.3,1);display:flex;flex-direction:column}\
#vh-drawer.on{transform:none}\
.vh-dr-head{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(36,26,63,.12)}\
.vh-dr-title{font-size:17px;font-weight:700;color:#241a3f}\
.vh-dr-x{border:none;background:rgba(124,58,237,.08);color:#6d28d9;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px}\
.vh-dr-body{flex:1;overflow:auto;padding:16px 22px}\
.vh-dr-line{display:flex;justify-content:space-between;align-items:center;gap:10px;border:1px solid rgba(76,29,149,.12);border-radius:12px;padding:10px 14px;margin-bottom:10px;font-size:14px}\
.vh-dr-qty{display:inline-flex;align-items:center;gap:8px}\
.vh-dr-qty button{border:none;background:rgba(124,58,237,.1);color:#6d28d9;width:24px;height:24px;border-radius:7px;cursor:pointer;font-weight:700}\
.vh-dr-foot{border-top:1px solid rgba(36,26,63,.12);padding:16px 22px}\
.vh-dr-sub{display:flex;justify-content:space-between;font-size:15px;font-weight:700;color:#241a3f;margin-bottom:12px}\
.vh-dr-co{width:100%;border:none;border-radius:12px;background:#6d28d9;color:#fff;padding:13px;font-size:15px;font-weight:600;cursor:pointer}\
.vh-dr-co:hover{background:#5b21b6}\
.vh-dr-note{margin-top:10px;font-size:12.5px;color:#b45309;text-align:center;display:none}\
.vh-dr-info{margin-top:10px;font-size:12px;color:#8d82ab;text-align:center;line-height:1.5}\
.vh-dr-empty{padding:30px 0;text-align:center;color:#8d82ab;font-size:14px}\
.vh-dr-browse{display:inline-block;margin-top:16px;background:#6d28d9;color:#fff;font-size:14px;font-weight:600;padding:11px 22px;border-radius:11px;text-decoration:none}\
.vh-dr-browse:hover{background:#5b21b6}\
#vh-toast{position:fixed;bottom:26px;left:50%;transform:translate(-50%,16px);z-index:97;background:#241a3f;color:#fff;font-size:13.5px;font-weight:600;padding:10px 18px;border-radius:999px;opacity:0;transition:.25s;pointer-events:none}\
#vh-toast.on{opacity:1;transform:translate(-50%,0)}\
.vh-badge{position:absolute;top:-6px;right:-6px;min-width:17px;height:17px;border-radius:999px;background:#6d28d9;color:#fff;font-size:10.5px;font-weight:700;display:grid;place-items:center;padding:0 4px}\
#vh-menu{position:absolute;top:100%;left:0;right:0;background:#fff;border-bottom:1px solid rgba(36,26,63,.12);box-shadow:0 24px 50px rgba(20,8,50,.16);display:none;z-index:60}\
#vh-menu.on{display:block}\
#vh-menu a{display:block;padding:13px 26px;font-size:15px;font-weight:500;color:#241a3f;text-decoration:none;border-top:1px solid rgba(36,26,63,.07)}\
#vh-menu a:hover{background:rgba(124,58,237,.06);color:#6d28d9}\
.vh-form-note{margin-top:10px;font-size:13px;text-align:center;border-radius:10px;padding:10px 14px}\
@media (max-width:767px){\
header button[aria-label="Menu"]{order:-2;margin-left:0}\
header a.gap-3{order:-1}\
header div.md\\:ml-0{margin-left:auto}\
header div.gap-8{gap:14px}\
div[class*="minmax(240px"]{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}\
footer .justify-between{justify-content:center!important;text-align:center}\
}';
  document.head.appendChild(style);

  /* ============ toast ============ */
  var toastEl = el('div'); toastEl.id = 'vh-toast'; document.body.appendChild(toastEl);
  var toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on') }, 1800);
  }

  /* ============ demo cart + drawer ============ */
  var KEY = 'vh-cart-v1';
  function items() { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch (e) { return [] } }
  function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); badge(); renderDrawer() }
  function add(item, qty, quiet) {
    var list = items(), hit = null;
    list.forEach(function (x) { if (x.handle === item.handle && x.size === item.size) hit = x });
    if (hit) hit.qty += qty; else list.push({ handle: item.handle, title: item.title, size: item.size, price: item.price, qty: qty });
    save(list);
    if (!quiet) toast(session() ? item.title + ' added to cart' : item.title + ' added to cart · Sign in to submit an order request');
  }
  var ov = el('div'); ov.id = 'vh-drawer-ov';
  var dr = el('div'); dr.id = 'vh-drawer';
  dr.innerHTML = '<div class="vh-dr-head"><span class="vh-dr-title">Your cart</span><button type="button" class="vh-dr-x" aria-label="Close cart">✕</button></div><div class="vh-dr-body"></div><div class="vh-dr-foot"><div class="vh-dr-sub"><span>Subtotal</span><span class="vh-dr-total">$0</span></div><button type="button" class="vh-dr-co">Start order request</button><div class="vh-dr-info">No payment is collected online. Final details are coordinated by email.</div><div class="vh-dr-note">Preview build — sign in to submit an order request.</div></div>';
  document.body.appendChild(ov); document.body.appendChild(dr);
  function openDrawer() { renderDrawer(); ov.classList.add('on'); dr.classList.add('on'); document.body.style.overflow = 'hidden' }
  function closeDrawer() { ov.classList.remove('on'); dr.classList.remove('on'); document.body.style.overflow = '' }
  ov.addEventListener('click', closeDrawer);
  $('.vh-dr-x', dr).addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer() });
  $('.vh-dr-co', dr).addEventListener('click', function () {
    if (session()) location.href = PFX + 'order-request.html';
    else $('.vh-dr-note', dr).style.display = 'block';
  });
  function renderDrawer() {
    var body = $('.vh-dr-body', dr), list = items(), sum = 0;
    body.innerHTML = '';
    if (!list.length) {
      body.innerHTML = '<div class="vh-dr-empty">Your cart is empty.<br><a href="' + PFX + 'index.html#catalog" class="vh-dr-browse">Browse the shop</a></div>';
      body.querySelector('.vh-dr-browse').addEventListener('click', closeDrawer);
    }
    list.forEach(function (x, i) {
      sum += x.price * x.qty;
      var row = el('div');
      row.className = 'vh-dr-line';
      row.innerHTML = '<span style="flex:1"><b style="color:#241a3f">' + x.title + '</b> <span style="color:#8d82ab">' + x.size + '</span><br><span style="color:#4a4066">' + money(x.price) + '/vial</span></span>' +
        '<span class="vh-dr-qty"><button type="button" data-a="-">−</button><b>' + x.qty + '</b><button type="button" data-a="+">+</button></span>' +
        '<b style="color:#241a3f;min-width:52px;text-align:right">' + money(x.price * x.qty) + '</b>' +
        '<button type="button" data-a="x" aria-label="Remove ' + x.title + ' from cart" title="Remove from cart" style="border:none;background:none;color:#8d82ab;width:26px;height:26px;flex:none;display:grid;place-items:center;cursor:pointer;padding:0;margin-left:2px"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="pointer-events:none"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>';
      $$('button', row).forEach(function (b) {
        b.addEventListener('click', function () {
          var l = items();
          if (b.getAttribute('data-a') === 'x') l.splice(i, 1);
          else {
            l[i].qty += b.getAttribute('data-a') === '+' ? 1 : -1;
            if (l[i].qty <= 0) l.splice(i, 1);
          }
          save(l);
        });
      });
      body.appendChild(row);
    });
    $('.vh-dr-total', dr).textContent = money(sum);
    $('.vh-dr-foot', dr).style.display = list.length ? '' : 'none';
  }
  function badge() {
    $$('a[aria-label="Cart"]').forEach(function (a) {
      var n = items().reduce(function (s, x) { return s + x.qty }, 0);
      var b = $('.vh-badge', a);
      if (!n) { if (b) b.remove(); return }
      if (!b) { b = el('span'); b.className = 'vh-badge'; a.appendChild(b) }
      b.textContent = n;
    });
  }

  $$('a[aria-label="Cart"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (session()) { e.preventDefault(); openDrawer() }
    });
  });
  function favs() { try { return JSON.parse(localStorage.getItem('vh-favs-v1')) || [] } catch (e) { return [] } }
  function saveFavs(list) { try { localStorage.setItem('vh-favs-v1', JSON.stringify(list)) } catch (e) {} }
  window.VHCart = { add: add, open: openDrawer, session: session, favs: favs, saveFavs: saveFavs };
  badge();
  if (session()) {
    // signed in: the header "Sign in" pill becomes a profile avatar circle
    var initials = 'J';
    try {
      var prof = JSON.parse(localStorage.getItem('vh-profile-v1')) || {};
      var st = JSON.parse(sessionStorage.getItem('vh-checkout')) || {};
      var nm = ((prof.firstName || st.firstName || 'Jennifer') + ' ' + (prof.lastName || st.lastName || '')).trim();
      initials = nm.split(/\s+/).map(function (w) { return w.charAt(0) }).slice(0, 2).join('').toUpperCase() || 'J';
    } catch (e) {}
    $$('a[href*="sign-in.html"]').forEach(function (a) {
      if (a.textContent.trim() !== 'Sign in') return;
      a.textContent = initials;
      a.setAttribute('href', PFX + 'profile.html?v=1786473267');
      a.setAttribute('aria-label', 'Your profile');
      a.style.cssText = 'width:36px;height:36px;flex:none;border-radius:50%;background:#0b0b0f;color:#fff;display:grid;place-items:center;font-size:12.5px;font-weight:700;letter-spacing:.02em;text-decoration:none;border:none;padding:0';
    });
  }

  /* ============ hamburger menu ============ */
  var menuBtn = $('button[aria-label="Menu"]');
  if (menuBtn) {
    var header = menuBtn.closest('header');
    var panel = el('div'); panel.id = 'vh-menu';
    var links = $$('header nav a');
    if (!links.length) {
      var defs = [['Catalog', 'index.html#catalog'], ['Order Builder', 'order-builder.html'], ['Quality', 'index.html#quality'], ['Wholesale', 'index.html#wholesale'], ['Support', 'contact.html'], ['FAQ', 'index.html#faq']];
      links = defs.map(function (d) { var a = document.createElement('a'); a.textContent = d[0]; a.href = PFX + d[1]; return a });
    } else {
      links = links.map(function (a) { return a.cloneNode(true) });
    }
    links.forEach(function (a) { a.removeAttribute('class'); panel.appendChild(a) });
    header.appendChild(panel);
    if (getComputedStyle(header).position === 'static') header.style.position = 'relative';
    menuBtn.addEventListener('click', function () {
      var on = panel.classList.toggle('on');
      menuBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (panel.classList.contains('on') && !header.contains(e.target)) panel.classList.remove('on');
    });
  }

  /* ============ theme toggle (app-chrome pages) ============ */
  $$('button').filter(function (b) {
    return /theme/i.test(b.getAttribute('aria-label') || '') || /toggle theme/i.test(b.textContent);
  }).forEach(function (b) {
    b.addEventListener('click', function () {
      var root = document.documentElement;
      var dark = root.classList.toggle('dark');
      root.classList.toggle('light', !dark);
      root.style.colorScheme = dark ? 'dark' : 'light';
      try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch (e) {}
    });
  });

  /* ============ catalog cards: Add buttons (index + products.html) ============ */
  $$('button').filter(function (b) { return b.textContent.trim() === 'Add' }).forEach(function (b) {
    var card = b.closest('article') || b.closest('div.grid');
    var a = card && $('a[href*="products/"]', card);
    var m = a && a.getAttribute('href').match(/products\/([a-z0-9-]+)\.html/);
    if (!m || !STOCK[m[1]]) return;
    b.addEventListener('click', function () {
      var p = STOCK[m[1]];
      add({ handle: m[1], title: p.title, size: p.size, price: p.price }, 1);
    });
  });

  /* ============ category pills (products.html; index wires its own) ============ */
  if (!window.__vhCatalogWired) {
    var pillWrap = null;
    $$('div').forEach(function (d) {
      if (pillWrap) return;
      var c = d.children;
      if (c.length === 4 && c[0].tagName === 'BUTTON' && c[0].textContent.trim() === 'All compounds') pillWrap = d;
    });
    var grid = pillWrap && pillWrap.nextElementSibling;
    if (pillWrap && grid) {
      var cards = $$(':scope > div', grid);
      var cardCat = cards.map(function (c) {
        var a = $('a[href*="products/"]', c);
        var m = a && a.getAttribute('href').match(/products\/([a-z0-9-]+)\.html/);
        return m && CAT[m[1]] ? CAT[m[1]] : '';
      });
      var pills = $$('button', pillWrap);
      var F = [null, 'glp', 'single', 'blend'];
      var ON = ['border-violet-brand', 'bg-violet-brand', 'text-white', 'hover:text-white'];
      var OFF = ['border-vline', 'bg-white', 'text-ink-muted', 'hover:text-ink'];
      pills.forEach(function (pill, i) {
        pill.addEventListener('click', function () {
          cards.forEach(function (c, j) { c.style.display = (!F[i] || cardCat[j] === F[i]) ? '' : 'none' });
          pills.forEach(function (p, k) {
            (k === i ? OFF : ON).forEach(function (cl) { p.classList.remove(cl) });
            (k === i ? ON : OFF).forEach(function (cl) { p.classList.add(cl) });
          });
        });
      });
    }
  }

  /* ============ card dose chips -> product page ============ */
  if (location.pathname.indexOf('/products/') === -1) {
    $$('article button').filter(function (b) { return /^\d+(mg|\s?tabs)/.test(b.textContent.trim()) && !b.disabled }).forEach(function (b) {
      var a = b.closest('article') && b.closest('article').querySelector('a[href*="products/"]');
      if (a) b.addEventListener('click', function () { location.href = a.getAttribute('href') });
    });
  }

  /* ============ product detail page ============ */
  var addBtn = $$('button').filter(function (b) { return b.textContent.indexOf('Add to cart') === 0 })[0];
  var buyBtn = $$('button').filter(function (b) { return b.textContent.trim() === 'Buy now' })[0];
  var notif = $('#notify form');
  if (addBtn || notif) {
    var handle = (location.pathname.match(/products\/([a-z0-9-]+)\.html/) || [])[1] || '';
    var title = ($('h1') || {}).textContent || handle;
    {
      var qtyInput = $('input[aria-label="Quantity"]');
      var dec = $('button[aria-label="Decrease"]'), inc = $('button[aria-label="Increase"]');
      var quicks = $$('button').filter(function (b) { return /^(1|3|5|10)$/.test(b.textContent.trim()) && b.className.indexOf('w-[38px]') > -1 });
      var priceEl = $$('div').filter(function (d) { return d.className.indexOf('text-[32px]') > -1 })[0];
      var base = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 0;
      var sizeBtns = $$('button').filter(function (b) { return /^\d+(mg|\s?tabs)/.test(b.textContent.trim()) && !b.disabled && b.closest('div') && !b.className.match(/w-\[38px\]/) });
      var activeSize = sizeBtns.length ? sizeBtns[0].textContent.trim() : '';
      var SZ_ON = ['border-violet-brand', 'bg-[rgba(124,58,237,0.08)]', 'font-semibold', 'text-violet-brand-3'];
      var SZ_OFF = ['border-vline', 'bg-white', 'text-ink-muted'];
      sizeBtns.forEach(function (b) {
        b.addEventListener('click', function () {
          activeSize = b.textContent.trim();
          sizeBtns.forEach(function (o) {
            (o === b ? SZ_OFF : SZ_ON).forEach(function (c) { o.classList.remove(c) });
            (o === b ? SZ_ON : SZ_OFF).forEach(function (c) { o.classList.add(c) });
          });
        });
      });
      var tierRows = $$('div').filter(function (d) {
        var s = d.children;
        return s.length === 2 && s[0].tagName === 'SPAN' && /vials$/.test(s[0].textContent.trim()) && d.className.indexOf('justify-between') > -1;
      });
      var tiers = tierRows.map(function (r) {
        var lab = r.children[0].textContent.trim();
        var min = parseInt(lab, 10);
        var max = /\+/.test(lab) ? Infinity : (lab.match(/–\s*(\d+)/) ? parseInt(lab.match(/–\s*(\d+)/)[1], 10) : min);
        var pv = parseFloat((r.children[1].textContent.match(/\$\s*([0-9.]+)/) || [0, base])[1]);
        var sv = parseInt((r.children[1].textContent.match(/save\s*(\d+)/) || [0, 0])[1], 10);
        return { min: min, max: max, pv: pv, save: sv, row: r };
      });
      var totalEl = null, hintEl = null;
      $$('div').forEach(function (d) {
        if (!totalEl && d.textContent.indexOf('Total') === 0 && $('b', d)) totalEl = $('b', d);
        if (!hintEl && /^Add\s.*unlock/.test(d.textContent.trim()) && !d.children.length) hintEl = d;
      });
      if (!hintEl) hintEl = $$('div').filter(function (d) { return /unlock/.test(d.textContent) && d.className.indexOf('b45309') > -1 })[0];
      var qty = 1;
      function perVial(q) {
        var t = tiers.filter(function (t) { return q >= t.min && q <= t.max })[0];
        return t ? t.pv : base;
      }
      function update() {
        if (qtyInput) qtyInput.value = qty;
        var pv = perVial(qty), tot = pv * qty;
        if (totalEl) totalEl.textContent = money(tot);
        if (addBtn) addBtn.textContent = 'Add to cart — ' + money(tot);
        var next = tiers.filter(function (t) { return t.min > qty })[0];
        if (hintEl) {
          if (next) { hintEl.style.display = ''; hintEl.textContent = 'Add ' + (next.min - qty) + ' more to unlock ' + next.save + '% off' }
          else hintEl.style.display = 'none';
        }
        tiers.forEach(function (t) {
          t.row.style.background = (qty >= t.min && qty <= t.max) ? 'rgba(124,58,237,0.07)' : '';
        });
        quicks.forEach(function (b) {
          var on = parseInt(b.textContent, 10) === qty;
          ['border-violet-brand', 'bg-[rgba(124,58,237,0.08)]', 'text-violet-brand-3'].forEach(function (c) { b.classList[on ? 'add' : 'remove'](c) });
          ['border-vline', 'bg-white', 'text-ink-muted'].forEach(function (c) { b.classList[on ? 'remove' : 'add'](c) });
        });
      }
      if (dec) dec.addEventListener('click', function () { qty = Math.max(1, qty - 1); update() });
      if (inc) inc.addEventListener('click', function () { qty = Math.min(99, qty + 1); update() });
      if (qtyInput) qtyInput.addEventListener('change', function () { qty = Math.max(1, Math.min(99, parseInt(qtyInput.value, 10) || 1)); update() });
      quicks.forEach(function (b) { b.addEventListener('click', function () { qty = parseInt(b.textContent, 10); update() }) });
      function doAdd() { add({ handle: handle, title: title, size: activeSize, price: perVial(qty) }, qty) }
      if (addBtn) addBtn.addEventListener('click', doAdd);
      if (buyBtn) buyBtn.addEventListener('click', function () { doAdd(); if (session()) openDrawer(); else location.href = PFX + 'sign-in.html' });
      // save-to-favorites heart beside Add to cart
      if (addBtn && handle) {
        var HEART = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="FILL" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="pointer-events:none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>';
        var favBtn = document.createElement('button');
        favBtn.type = 'button';
        function paintFav() {
          var on = favs().some(function (f) { return f.handle === handle });
          favBtn.innerHTML = HEART.replace('FILL', on ? '#df2225' : 'none');
          favBtn.style.color = on ? '#df2225' : '#61626f';
          favBtn.setAttribute('aria-label', on ? 'Remove from favorites' : 'Save to favorites');
          favBtn.title = on ? 'Saved — click to remove' : 'Save to favorites';
        }
        favBtn.style.cssText = 'width:46px;height:46px;flex:none;display:grid;place-items:center;border:1px solid rgba(11,12,22,.14);border-radius:12px;background:#fff;cursor:pointer;margin-left:10px';
        favBtn.addEventListener('click', function () {
          var list = favs();
          var i = list.findIndex(function (f) { return f.handle === handle });
          if (i > -1) list.splice(i, 1);
          else list.push({ handle: handle, title: title.trim(), size: activeSize, price: base });
          saveFavs(list);
          paintFav();
        });
        paintFav();
        addBtn.parentNode.appendChild(favBtn);
      }
      if (qtyInput) update();
    }
    if (notif) {
      notif.addEventListener('submit', function (e) {
        e.preventDefault();
        var em = $('input[type="email"]', notif);
        if (!em || !em.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) { em && em.focus(); return }
        notif.parentElement.innerHTML = '<div style="border:1px solid rgba(5,150,105,0.3);background:rgba(5,150,105,0.06);border-radius:12px;padding:13px 16px;font-size:14px;font-weight:600;color:#059669">You’re on the list — we’ll email ' + em.value.trim() + ' when this restocks.</div>';
      });
    }
  }

  /* ============ password eyes + strength rules ============ */
  var EYE = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  var EYEOFF = '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path></svg>';
  $$('input[type="password"]').forEach(function (inp) {
    inp.setAttribute('data-vh-pw', '1');
    var span = document.createElement('span');
    span.style.cssText = 'position:relative;display:block';
    inp.parentElement.insertBefore(span, inp);
    span.appendChild(inp);
    inp.style.paddingRight = '40px';
    inp.style.width = '100%';
    var btn = el('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Show password');
    btn.style.cssText = 'position:absolute;right:7px;top:50%;transform:translateY(-50%);border:none;background:none;cursor:pointer;color:#8d82ab;width:28px;height:28px;display:grid;place-items:center;padding:0';
    btn.innerHTML = EYE;
    btn.addEventListener('click', function () {
      var show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      btn.innerHTML = show ? EYEOFF : EYE;
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
    span.appendChild(btn);
  });
  var PW_RULES = [
    ['At least 8 characters', function (v) { return v.length >= 8 }],
    ['An uppercase letter', function (v) { return /[A-Z]/.test(v) }],
    ['A lowercase letter', function (v) { return /[a-z]/.test(v) }],
    ['A number', function (v) { return /[0-9]/.test(v) }]
  ];
  function pwUnmet(v) { return PW_RULES.filter(function (r) { return !r[1](v) }) }
  var suForm = $$('form').filter(function (f) {
    return $$('button', f).some(function (b) { return b.textContent.trim() === 'Create account' });
  })[0];
  if (suForm) {
    var suPw = $('input[type="password"]', suForm);
    if (suPw) {
      var list = el('div', 'margin-top:8px;display:none;grid-template-columns:1fr;gap:4px;font-size:12px;text-align:left');
      var rows = PW_RULES.map(function (r) {
        var row = el('div', 'display:flex;align-items:center;gap:7px;color:#8d82ab;transition:color .15s');
        row.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:currentColor;flex:none"></span>' + r[0];
        list.appendChild(row);
        return row;
      });
      suPw.parentElement.parentElement.appendChild(list);
      suPw.addEventListener('input', function () {
        PW_RULES.forEach(function (r, i) {
          rows[i].style.color = r[1](suPw.value) ? '#059669' : '#8d82ab';
        });
      });
      suPw.addEventListener('focus', function () { list.style.display = 'grid' });
      suPw.addEventListener('blur', function () { list.style.display = 'none' });
    }
  }

  /* ============ contact + auth forms ============ */
  $$('form').forEach(function (f) {
    var send = $$('button', f).filter(function (b) { return /^(Send message|Sign in|Create account)$/.test(b.textContent.trim()) })[0];
    if (!send) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return }
      var old = $('.vh-form-note', f.parentElement);
      if (old) old.remove();
      var note = el('div');
      note.className = 'vh-form-note';
      if (send.textContent.trim() === 'Create account') {
        var pwInp = $('#password', f) || $('input[data-vh-pw]', f);
        var confInp = $('#confirmPassword', f);
        if (pwInp && confInp && pwInp.value !== confInp.value) {
          note.style.cssText += 'border:1px solid rgba(185,28,28,0.3);background:rgba(185,28,28,0.05);color:#b91c1c;font-weight:600';
          note.textContent = 'Passwords do not match — please re-enter them.';
          f.appendChild(note);
          confInp.focus();
          return;
        }
        var unmet = pwInp ? pwUnmet(pwInp.value) : [];
        if (unmet.length) {
          note.style.cssText += 'border:1px solid rgba(185,28,28,0.3);background:rgba(185,28,28,0.05);color:#b91c1c;font-weight:600';
          note.textContent = 'Password still needs: ' + unmet.map(function (r) { return r[0].toLowerCase() }).join(', ') + '.';
          f.appendChild(note);
          pwInp.focus();
          return;
        }
      }
      if (send.textContent.trim() === 'Send message') {
        note.style.cssText += 'border:1px solid rgba(5,150,105,0.3);background:rgba(5,150,105,0.06);color:#059669;font-weight:600';
        note.textContent = 'Message received — we reply within one business day.';
        f.reset();
      } else if (send.textContent.trim() === 'Create account') {
        // preview: the account lives in this browser's storage only
        var suProf = {};
        try { suProf = JSON.parse(localStorage.getItem('vh-profile-v1')) || {} } catch (eP) {}
        var gv = function (id) { var i2 = $('#' + id, f); return i2 ? i2.value.trim() : '' };
        suProf.firstName = gv('firstName') || suProf.firstName || '';
        suProf.lastName = gv('lastName');
        suProf.email = gv('email');
        var mkt = $('#vh-su-marketing', f);
        suProf.marketing = mkt ? mkt.checked : false;
        if (!suProf.memberSince) suProf.memberSince = Date.now();
        try {
          localStorage.setItem('vh-profile-v1', JSON.stringify(suProf));
          localStorage.setItem('vh-preview-pw', ($('#password', f) || $('input[data-vh-pw]', f)).value);
          localStorage.setItem(SESSION_KEY, '1');
        } catch (e3) {}
        note.style.cssText += 'border:1px solid rgba(5,150,105,0.3);background:rgba(5,150,105,0.06);color:#059669;font-weight:600';
        note.textContent = 'Account created — signing you in…';
        f.appendChild(note);
        setTimeout(function () { location.href = PFX + 'index.html' }, 900);
        return;
      } else {
        if (send.textContent.trim() === 'Sign in') {
          var em = $('input[type="email"]', f), pw = $('input[data-vh-pw]', f) || $('input[type="password"]', f);
          var expectedPw = 'preview';
          try { expectedPw = localStorage.getItem('vh-preview-pw') || 'preview' } catch (ePw) {}
          var knownEmail = 'jennifer@vantagebiology.com';
          try { var prof0 = JSON.parse(localStorage.getItem('vh-profile-v1')) || {}; if (prof0.email) knownEmail = String(prof0.email).toLowerCase() } catch (eK) {}
          var typed = em ? em.value.trim().toLowerCase() : '';
          if (em && pw && (typed === knownEmail || typed === 'jennifer@vantagebiology.com') && pw.value === expectedPw) {
            try { localStorage.setItem(SESSION_KEY, '1') } catch (e2) {}
            note.style.cssText += 'border:1px solid rgba(5,150,105,0.3);background:rgba(5,150,105,0.06);color:#059669;font-weight:600';
            note.textContent = 'Signed in — loading the catalog…';
            f.appendChild(note);
            setTimeout(function () { location.href = PFX + 'index.html' }, 900);
            return;
          }
        }
        note.style.cssText += 'border:1px solid rgba(180,83,9,0.3);background:rgba(180,83,9,0.06);color:#b45309;font-weight:600';
        note.textContent = 'That email and password don’t match an account on this device. Create an account, or use the reset link above.';
      }
      f.appendChild(note);
    });
  });

  /* ============ hero search (index) ============ */
  var searchInput = $('input[aria-label="Find your compound"]');
  if (searchInput) {
    searchInput.closest('form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (window.vhCatalogSearch) window.vhCatalogSearch(searchInput.value.trim());
    });
  }
})();
