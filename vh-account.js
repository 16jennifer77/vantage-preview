/* Runtime wiring for the account pages captured from the live site 2026-08-12.
   The captured React never hydrates; this makes the pages work in the preview:
   identity, sign-out, editable profile, order history, favorites, bulk quotes. */
(function () {
  'use strict';
  var V = '20260812';
  function $(s, r) { return (r || document).querySelector(s) }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var session = false;
  try { session = !!localStorage.getItem('vh-preview-session') } catch (e) {}
  if (!session) { location.href = 'sign-in.html'; return }

  function store(k, fb) { try { return JSON.parse(localStorage.getItem(k)) || fb } catch (e) { return fb } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} }
  var money = window.VHCheckout ? VHCheckout.money : function (n) { return '$' + n.toFixed(2) };

  function toast(t) {
    var el = $('#vh-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'vh-toast';
      el.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:#0b0c16;color:#fff;border-radius:11px;padding:11px 18px;font-size:13.5px;opacity:0;pointer-events:none;transition:opacity .25s;z-index:60';
      document.body.appendChild(el);
    }
    el.textContent = t; el.style.opacity = '1';
    clearTimeout(toast._t); toast._t = setTimeout(function () { el.style.opacity = '0' }, 2200);
  }

  /* ---------- identity ---------- */
  var S = window.VHCheckout ? VHCheckout.state() : {};
  var P = store('vh-profile-v1', {});
  if (!P.memberSince) { P.memberSince = Date.now(); put('vh-profile-v1', P) }
  P.firstName = P.firstName || S.firstName || 'Jennifer';
  P.lastName = P.lastName == null ? (S.lastName || '') : P.lastName;
  P.email = P.email || S.email || 'jennifer@vantagebiology.com';
  P.phone = P.phone == null ? (S.phone || '') : P.phone;
  P.org = P.org == null ? (S.org || '') : P.org;
  P.addresses = P.addresses || [];

  function fullName() { return (P.firstName + ' ' + P.lastName).trim() }
  function initials() {
    return fullName().split(/\s+/).map(function (w) { return w.charAt(0) }).slice(0, 2).join('').toUpperCase() || 'J';
  }
  function paintIdentity() {
    $$('[data-vh="name"]').forEach(function (el) { el.textContent = fullName() });
    $$('[data-vh="initials"]').forEach(function (el) { el.textContent = initials() });
    // header avatar circle + sidebar email line
    $$('a,span,div').forEach(function (el) {
      if (el.children.length === 0) {
        var t = el.textContent.trim();
        if (t === 'VP' || t === 'JC') el.textContent = initials();
        if (/^jennifer@vantagebiology\.com$/.test(t) && P.email !== t) el.textContent = P.email;
      }
    });
  }
  paintIdentity();

  // sign out (sidebar button)
  $$('button').forEach(function (b) {
    if (b.textContent.trim() === 'Sign Out') {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        try { localStorage.removeItem('vh-preview-session') } catch (e2) {}
        location.href = 'sign-in.html';
      });
    }
  });
  // header theme toggles are wired for real in vh-site.js (window.vhTheme)

  var page = (location.pathname.split('/').pop() || '').replace(/\.html.*/, '');

  /* mobile: account sub-pages stand alone — sidebar hidden, back-link to Profile */
  if (page === 'orders' || page === 'favorites' || page === 'bulk-quotes') {
    var acSide = $('aside');
    var acContent = acSide && acSide.nextElementSibling;
    if (acSide && acContent) {
      var back = document.createElement('a');
      back.href = 'profile.html';
      back.className = 'vh-back-profile';
      back.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="pointer-events:none"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>Profile';
      acContent.insertBefore(back, acContent.firstChild);
      var backCss = document.createElement('style');
      backCss.textContent = '.vh-back-profile{display:none}@media (max-width:767px){aside{display:none!important}.vh-back-profile{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#0b0c16;text-decoration:none;margin:0 0 14px;padding:8px 14px 8px 10px;border:1px solid rgba(11,12,22,.12);border-radius:10px;background:#fff}}';
      document.head.appendChild(backCss);
    }
  }

  /* ---------- profile ---------- */
  if (page === 'profile') {
    var f = {
      firstName: $('input[name="firstName"]'), lastName: $('input[name="lastName"]'),
      email: $('input[type="email"]'), phone: $('input[name="phone"]'),
      org: $('input[name="practiceName"]'), mkt: $('input[name="marketingOptIn"]')
    };
    if (f.firstName) f.firstName.value = P.firstName;
    if (f.lastName) f.lastName.value = P.lastName;
    if (f.email) f.email.value = P.email;
    if (f.phone) f.phone.value = P.phone;
    if (f.org) f.org.value = P.org;
    if (f.mkt) f.mkt.checked = !!P.marketing;
    var since = $$('p').filter(function (p) { return p.textContent.indexOf('Member since') === 0 })[0];
    if (since) since.textContent = 'Member since ' + new Date(P.memberSince).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // ----- Appearance card (dark-mode switch), cloned from the Communication card so classes match -----
    var commTitle = $$('[data-slot="card-title"]').filter(function (t) { return t.textContent.trim() === 'Communication' })[0];
    var commCard = commTitle && commTitle.closest('[data-slot="card"]');
    if (commCard && window.vhTheme) {
      var appCard = commCard.cloneNode(true);
      appCard.querySelector('[data-slot="card-title"]').textContent = 'Appearance';
      var content = appCard.querySelector('[data-slot="card-content"]');
      content.innerHTML = '<div class="flex items-start justify-between gap-4">' +
        '<span><span class="block text-sm font-medium">Dark mode</span>' +
        '<span class="block text-xs text-muted-foreground">Use the dark theme on this device.</span></span>' +
        '<button type="button" class="vh-switch" role="switch" aria-label="Dark mode"></button></div>';
      var sw = content.querySelector('.vh-switch');
      function paintSwitch() { sw.setAttribute('aria-checked', vhTheme.mode() === 'dark' ? 'true' : 'false') }
      paintSwitch();
      sw.addEventListener('click', function (e) { e.preventDefault(); vhTheme.toggle() });
      document.addEventListener('vh-theme', paintSwitch);
      commCard.parentNode.insertBefore(appCard, commCard.nextSibling);
    }

    $$('form').forEach(function (fm) { fm.addEventListener('submit', function (e) { e.preventDefault() }) });
    $$('button').forEach(function (b) {
      var t = b.textContent.trim();
      if (t === 'Save changes') b.addEventListener('click', function (e) {
        e.preventDefault();
        P.firstName = (f.firstName.value.trim() || P.firstName);
        P.lastName = f.lastName.value.trim();
        P.phone = f.phone ? f.phone.value.trim() : '';
        P.org = f.org ? f.org.value.trim() : '';
        P.marketing = f.mkt ? f.mkt.checked : false;
        put('vh-profile-v1', P);
        if (window.VHCheckout) VHCheckout.saveState({ firstName: P.firstName, lastName: P.lastName, phone: P.phone, org: P.org });
        paintIdentity();
        toast('Profile saved.');
      });
    });

    // ----- addresses -----
    function emptyAddrEl() {
      return $$('div').filter(function (d) { return d.children.length === 0 && d.textContent.indexOf('No shipping addresses yet') > -1 })[0];
    }
    var addrAnchor = emptyAddrEl();
    var addrHost = addrAnchor ? addrAnchor.parentNode : null;
    function renderAddr() {
      if (!addrHost) return;
      $$('.vh-addr', addrHost).forEach(function (n) { n.remove() });
      var empty = emptyAddrEl();
      if (empty) empty.style.display = P.addresses.length ? 'none' : '';
      P.addresses.forEach(function (a, i) {
        var d = document.createElement('div');
        d.className = 'vh-addr';
        d.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;gap:16px;border:1px solid rgba(11,12,22,.1);border-radius:12px;padding:13px 15px;margin-bottom:10px;font-size:13.5px;line-height:1.6;color:#41424f';
        d.innerHTML = '<span><b style="color:#0b0c16">' + a.label + (i === 0 ? ' <span style="font-size:10.5px;font-weight:700;color:#6e59e2;background:rgba(110,89,226,.1);border-radius:999px;padding:2px 8px;margin-left:6px">DEFAULT</span>' : '') + '</b><br>' + [a.org, a.a1, a.a2, a.city + ', ' + a.st + ' ' + a.zip].filter(Boolean).join('<br>') + '</span>' +
          '<button type="button" style="border:1px solid rgba(11,12,22,.14);border-radius:9px;background:#fff;color:#df2225;padding:6px 12px;font-size:12.5px;cursor:pointer;font-family:inherit">Remove</button>';
        d.querySelector('button').addEventListener('click', function () { P.addresses.splice(i, 1); put('vh-profile-v1', P); renderAddr() });
        addrHost.insertBefore(d, addrHost.firstChild);
      });
    }
    renderAddr();
    $$('button').forEach(function (b) {
      if (b.textContent.trim() === 'Add address') b.addEventListener('click', function (e) {
        e.preventDefault();
        if ($('#vh-addr-form')) { $('#vh-addr-form').remove(); return }
        var fm = document.createElement('div');
        fm.id = 'vh-addr-form';
        fm.style.cssText = 'border:1px solid rgba(11,12,22,.12);border-radius:12px;padding:16px;margin-top:12px;font-size:13.5px';
        function fld(id, ph, w) { return '<input id="' + id + '" placeholder="' + ph + '" style="width:' + (w || '100%') + ';height:36px;border:1px solid rgba(11,12,22,.14);border-radius:9px;padding:0 11px;font-size:13.5px;font-family:inherit;margin:0 0 10px;outline:none"/>' }
        fm.innerHTML = fld('va-label', 'Label (Lab, clinic…)') + fld('va-org', 'Facility / organization') + fld('va-a1', 'Address line 1') + fld('va-a2', 'Address line 2 (optional)') +
          '<div style="display:flex;gap:8px">' + fld('va-city', 'City', '40%') + fld('va-st', 'State', '25%') + fld('va-zip', 'ZIP', '30%') + '</div>' +
          '<p id="va-err" style="display:none;color:#df2225;font-size:12.5px;margin:0 0 10px"></p>' +
          '<button type="button" id="va-save" style="border:none;border-radius:9px;background:#6e59e2;color:#fff;padding:9px 16px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">Save address</button>';
        addrHost.parentNode.appendChild(fm);
        $('#va-save').addEventListener('click', function () {
          var g = function (id) { return $('#' + id).value.trim() };
          var a = { label: g('va-label') || 'Address', org: g('va-org'), a1: g('va-a1'), a2: g('va-a2'), city: g('va-city'), st: g('va-st'), zip: g('va-zip') };
          if (!a.a1 || !a.city || !a.st || !a.zip) { $('#va-err').textContent = 'Address line 1, city, state, and ZIP are required.'; $('#va-err').style.display = 'block'; return }
          P.addresses.push(a); put('vh-profile-v1', P); fm.remove(); renderAddr(); toast('Address saved.');
        });
      });
    });

    // ----- security -----
    $$('button').forEach(function (b) {
      var t = b.textContent.trim();
      if (t === 'Change') b.addEventListener('click', function (e) {
        e.preventDefault();
        if ($('#vh-pw-form')) { $('#vh-pw-form').remove(); return }
        var fm = document.createElement('div');
        fm.id = 'vh-pw-form';
        fm.style.cssText = 'border:1px solid rgba(11,12,22,.12);border-radius:12px;padding:16px;margin-top:12px;font-size:13.5px';
        function fld(id, ph) { return '<input id="' + id + '" type="password" placeholder="' + ph + '" style="width:100%;height:36px;border:1px solid rgba(11,12,22,.14);border-radius:9px;padding:0 11px;font-size:13.5px;font-family:inherit;margin:0 0 10px;outline:none"/>' }
        fm.innerHTML = fld('vp-cur', 'Current password') + fld('vp-new', 'New password (8+ characters)') + fld('vp-new2', 'Confirm new password') +
          '<p id="vp-err" style="display:none;color:#df2225;font-size:12.5px;margin:0 0 10px"></p>' +
          '<button type="button" id="vp-save" style="border:none;border-radius:9px;background:#6e59e2;color:#fff;padding:9px 16px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">Update password</button>';
        b.closest('div').parentNode.appendChild(fm);
        $('#vp-save').addEventListener('click', function () {
          var cur = $('#vp-cur').value, nw = $('#vp-new').value, nw2 = $('#vp-new2').value;
          var actual = localStorage.getItem('vh-preview-pw') || 'preview';
          var err = $('#vp-err');
          if (cur !== actual) { err.textContent = 'Current password is incorrect.'; err.style.display = 'block'; return }
          if (nw.length < 8) { err.textContent = 'New password must be at least 8 characters.'; err.style.display = 'block'; return }
          if (nw !== nw2) { err.textContent = 'New passwords do not match.'; err.style.display = 'block'; return }
          localStorage.setItem('vh-preview-pw', nw);
          fm.remove(); toast('Password updated — use it at the next sign-in.');
        });
      });
      if (t === 'Enable' || t === 'Disable') {
        function paint2fa() {
          b.textContent = P.twoFactor ? 'Disable' : 'Enable';
          var chip = $('#vh-2fa-chip');
          if (P.twoFactor && !chip) {
            chip = document.createElement('span');
            chip.id = 'vh-2fa-chip';
            chip.style.cssText = 'display:inline-flex;align-items:center;background:rgba(5,150,105,.1);color:#059669;border-radius:999px;padding:3px 11px;font-size:11px;font-weight:700;margin-right:10px';
            chip.textContent = 'ENABLED';
            b.parentNode.insertBefore(chip, b);
          } else if (!P.twoFactor && chip) chip.remove();
        }
        paint2fa();
        b.addEventListener('click', function (e) {
          e.preventDefault();
          P.twoFactor = !P.twoFactor; put('vh-profile-v1', P); paint2fa();
          toast(P.twoFactor ? 'Two-factor enabled for this preview account.' : 'Two-factor disabled.');
        });
      }
    });
  }

  /* ---------- orders ---------- */
  if (page === 'orders') {
    var orders = store('vh-orders-v1', []);
    try {
      var last = JSON.parse(sessionStorage.getItem('vh-order'));
      if (last && !orders.some(function (o) { return o.number === last.number })) {
        if (!last.placedAt) last.placedAt = Date.now();
        orders.unshift(last); put('vh-orders-v1', orders);
      }
    } catch (e) {}
    orders.forEach(function (o) { o.status = o.status || 'Active' });

    var F = { q: '', status: '', from: '', to: '', pill: '' };
    var q = $('input[placeholder="Search by order #"]');
    var sel = $('select');
    var dates = $$('input[type="date"]');
    var clearBtn = $$('button').filter(function (b) { return b.textContent.trim() === 'Clear' })[0];
    var pills = $$('button').filter(function (b) { return /^(All|Active|Delivered|Cancelled)/.test(b.textContent.trim()) });
    if (pills.length && pills[0].parentElement) {
      pills[0].parentElement.classList.add('vh-pillrow');
      var pillCss = document.createElement('style');
      pillCss.textContent = '@media (max-width:767px){.vh-pillrow{flex-wrap:nowrap!important;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:2px}.vh-pillrow::-webkit-scrollbar{display:none}.vh-pillrow button{flex:none;white-space:nowrap}}';
      document.head.appendChild(pillCss);
    }
    function fmt(ts) { return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) }
    var oEmpty = $$('div').filter(function (d) { return d.children.length === 0 && d.textContent.indexOf("You haven't placed any orders yet") > -1 })[0];
    var host = oEmpty ? oEmpty.parentNode : null;
    function matches(o) {
      if (F.q && o.number.toLowerCase().indexOf(F.q.toLowerCase()) === -1) return false;
      var st = F.pill || F.status;
      if (st && st !== 'All' && st !== 'All Statuses' && o.status !== st) return false;
      if (F.from && o.placedAt < new Date(F.from + 'T00:00:00').getTime()) return false;
      if (F.to && o.placedAt > new Date(F.to + 'T23:59:59').getTime()) return false;
      return true;
    }
    function paintPills() {
      var by = { All: orders.length, Active: 0, Delivered: 0, Cancelled: 0 };
      orders.forEach(function (o) { if (by[o.status] != null) by[o.status]++ });
      pills.forEach(function (b) {
        var k = (b.textContent.trim().match(/^(All|Active|Delivered|Cancelled)/) || ['All'])[1];
        var cnt = b.querySelector('span,b');
        if (cnt) cnt.textContent = by[k] != null ? by[k] : 0;
        b.addEventListener('click', function (e) { e.preventDefault(); F.pill = k === 'All' ? '' : k; render() });
      });
    }
    function invoiceDoc(o) {
      var rows = o.items.map(function (x) {
        return '<tr><td>' + x.title + ' ' + x.size + '</td><td style="text-align:center">' + x.qty + '</td><td style="text-align:right">' + money(x.price) + '</td><td style="text-align:right">' + money(x.price * x.qty) + '</td></tr>';
      }).join('');
      return '<!DOCTYPE html><html><head><title>Invoice ' + o.number + '</title><style>body{font:14px/1.6 Inter,system-ui,sans-serif;color:#0b0c16;max-width:640px;margin:40px auto;padding:0 20px}h1{font-size:20px}table{width:100%;border-collapse:collapse;margin:18px 0}td,th{padding:8px 6px;border-bottom:1px solid #e5e5ea;font-size:13.5px}th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#61626f}.tot{font-weight:700}.muted{color:#61626f;font-size:12.5px}</style></head><body>' +
        '<h1>Vantage Labs — Order ' + o.number + '</h1>' +
        '<p class="muted">Placed ' + fmt(o.placedAt) + ' · Status: Awaiting payment (Zelle)</p>' +
        '<p class="muted">Bill / ship to: ' + o.name + ', ' + o.addr + '</p>' +
        '<table><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit</th><th style="text-align:right">Amount</th></tr>' + rows +
        '<tr class="tot"><td colspan="3">Estimated subtotal</td><td style="text-align:right">' + money(o.sub) + '</td></tr></table>' +
        '<p class="muted">No payment collected online. Send ' + money(o.sub) + ' by Zelle to mysticvalleylogistics@gmail.com with ' + o.number + ' in the memo. Research use only.</p>' +
        '<scr' + 'ipt>window.print()</scr' + 'ipt></body></html>';
    }
    function render() {
      if (!host) return;
      $$('.vh-orow', host).forEach(function (n) { n.remove() });
      var list = orders.filter(matches);
      if (oEmpty) {
        oEmpty.style.display = list.length ? 'none' : '';
        if (!list.length && orders.length) oEmpty.textContent = 'No orders match these filters.';
      }
      list.forEach(function (o) {
        var d = document.createElement('div');
        d.className = 'vh-orow';
        d.style.cssText = 'background:#fff;border:1px solid rgba(11,12,22,.09);border-radius:14px;padding:16px 20px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap';
        d.innerHTML =
          '<div style="min-width:0"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
          '<span style="font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#61626f">Order</span>' +
          '<b style="font-family:var(--font-mono),ui-monospace,monospace;font-size:14.5px;color:#0b0c16">' + o.number + '</b>' +
          '<span style="display:inline-flex;border-radius:999px;padding:3px 10px;font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:rgba(110,89,226,.1);color:#6e59e2">' + o.status + '</span></div>' +
          '<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:9px;font-size:13.5px;color:#41424f">' +
          '<span>' + o.count + ' item' + (o.count === 1 ? '' : 's') + '</span>' +
          '<span style="display:inline-flex;align-items:center;gap:8px"><b style="color:#0b0c16">' + money(o.sub) + '</b><span style="display:inline-flex;border-radius:999px;padding:3px 10px;font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:rgba(180,83,9,.08);color:#b45309">Pending</span></span>' +
          '<span>' + fmt(o.placedAt) + '</span></div></div>' +
          '<div style="display:flex;align-items:center;gap:8px">' +
          '<button type="button" data-a="inv" style="display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(11,12,22,.14);border-radius:10px;background:#fff;color:#0b0c16;padding:8px 14px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit">Invoice</button>' +
          '<button type="button" data-a="view" style="display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(11,12,22,.14);border-radius:10px;background:#fff;color:#0b0c16;padding:8px 14px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit">View details</button></div>';
        d.querySelector('[data-a="inv"]').addEventListener('click', function () {
          var w = window.open('', '_blank');
          if (!w) { toast('Allow pop-ups to open the invoice.'); return }
          w.document.write(invoiceDoc(o)); w.document.close();
        });
        d.querySelector('[data-a="view"]').addEventListener('click', function () {
          try { sessionStorage.setItem('vh-order-view', JSON.stringify(o)) } catch (e) {}
          location.href = 'order-detail.html?v=1786473267';
        });
        host.insertBefore(d, oEmpty);
      });
    }
    if (q) q.addEventListener('input', function () { F.q = q.value; render() });
    if (sel) sel.addEventListener('change', function () { F.status = sel.value; F.pill = ''; render() });
    if (dates[0]) dates[0].addEventListener('change', function () { F.from = dates[0].value; render() });
    if (dates[1]) dates[1].addEventListener('change', function () { F.to = dates[1].value; render() });
    if (clearBtn) clearBtn.addEventListener('click', function (e) {
      e.preventDefault();
      F = { q: '', status: '', from: '', to: '', pill: '' };
      if (q) q.value = ''; if (sel) sel.selectedIndex = 0;
      dates.forEach(function (d) { d.value = '' });
      render();
    });
    paintPills(); render();
  }

  /* ---------- favorites ---------- */
  if (page === 'favorites') {
    function favs() { return store('vh-favs-v1', []) }
    function emptyFavEl() {
      return $$('div,p').filter(function (d) { return d.children.length <= 1 && d.textContent.trim().indexOf("You haven't saved any products yet") === 0 })[0];
    }
    var anchor = emptyFavEl();
    var hostF = anchor ? anchor.closest('div[class*="rounded"]') || anchor.parentNode : null;
    function renderF() {
      if (!hostF) return;
      $$('.vh-frow').forEach(function (n) { n.remove() });
      var list = favs();
      hostF.style.display = list.length ? 'none' : '';
      var wrap = hostF.parentNode;
      list.forEach(function (f, i) {
        var d = document.createElement('div');
        d.className = 'vh-frow';
        d.style.cssText = 'background:#fff;border:1px solid rgba(11,12,22,.09);border-radius:14px;padding:18px 22px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap';
        d.innerHTML =
          '<div style="display:flex;align-items:center;gap:16px;min-width:0">' +
          '<img src="products/' + f.handle + '.png" alt="' + f.title + ' vial" style="width:64px;height:64px;object-fit:cover;border-radius:11px;flex:none" onerror="this.style.display=\'none\'"/>' +
          '<span style="min-width:0"><a href="products/' + f.handle + '.html" style="font-size:15.5px;font-weight:700;color:#0b0c16;text-decoration:none">' + f.title + '</a>' +
          (f.size ? ' <span style="border:1px solid rgba(11,12,22,.14);border-radius:999px;padding:2px 9px;font-size:11.5px;color:#41424f;margin-left:6px">' + f.size + '</span>' : '') +
          '<br/><b style="font-size:14.5px;color:#0b0c16;line-height:1.9">' + money(f.price) + '</b><span style="font-size:12.5px;color:#61626f">/vial</span></span></div>' +
          '<div style="display:flex;align-items:center;gap:8px">' +
          '<button type="button" data-a="cart" style="border:none;border-radius:10px;background:#6e59e2;color:#fff;padding:10px 18px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">Add to cart</button>' +
          '<a href="products/' + f.handle + '.html" style="display:inline-flex;border:1px solid rgba(11,12,22,.14);border-radius:10px;background:#fff;color:#0b0c16;padding:9px 16px;font-size:13.5px;font-weight:500;text-decoration:none">View</a>' +
          '<button type="button" data-a="rm" aria-label="Remove from favorites" style="border:1px solid rgba(11,12,22,.14);border-radius:10px;background:#fff;padding:9px 12px;cursor:pointer"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#df2225" stroke="#df2225" stroke-width="2" aria-hidden="true" style="pointer-events:none;display:block"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg></button></div>';
        d.querySelector('[data-a="cart"]').addEventListener('click', function () {
          var cart = store('vh-cart-v1', []);
          var hit = cart.filter(function (x) { return x.handle === f.handle && x.size === f.size })[0];
          if (hit) hit.qty += 1; else cart.push({ handle: f.handle, title: f.title, size: f.size, price: f.price, qty: 1 });
          put('vh-cart-v1', cart);
          toast('Added to cart.');
        });
        d.querySelector('[data-a="rm"]').addEventListener('click', function () {
          var l = favs(); l.splice(i, 1); put('vh-favs-v1', l); renderF();
          toast('Removed from favorites.');
        });
        wrap.insertBefore(d, hostF);
      });
    }
    renderF();
  }

  /* ---------- bulk quotes ---------- */
  if (page === 'bulk-quotes') {
    var quotes = store('vh-quotes-v1', []);
    function emptyQEl() {
      return $$('div,p').filter(function (d) { return d.children.length <= 1 && d.textContent.indexOf("You haven't submitted any bulk quotes yet") > -1 })[0];
    }
    function renderQ() {
      var empty = emptyQEl();
      if (!empty) return;
      $$('.vh-qrow').forEach(function (n) { n.remove() });
      empty.style.display = quotes.length ? 'none' : '';
      var wrap = (empty.closest('div[class*="rounded"]') || empty).parentNode;
      quotes.forEach(function (qt) {
        var d = document.createElement('div');
        d.className = 'vh-qrow';
        d.style.cssText = 'background:#fff;border:1px solid rgba(11,12,22,.09);border-radius:14px;padding:16px 20px;margin-bottom:12px;font-size:13.5px;color:#41424f;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap';
        d.innerHTML = '<span><b style="color:#0b0c16">' + qt.product + '</b> · ' + qt.qty + ' vials<br><span style="color:#61626f">' + qt.notes + '</span></span>' +
          '<span style="display:inline-flex;align-self:flex-start;border-radius:999px;padding:3px 10px;font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:rgba(180,83,9,.08);color:#b45309">Under review</span>';
        wrap.insertBefore(d, wrap.firstChild);
      });
    }
    renderQ();
    $$('button,a').forEach(function (b) {
      if (b.textContent.trim() === 'New quote') b.addEventListener('click', function (e) {
        e.preventDefault();
        if ($('#vh-q-form')) { $('#vh-q-form').remove(); return }
        var fm = document.createElement('div');
        fm.id = 'vh-q-form';
        fm.style.cssText = 'border:1px solid rgba(11,12,22,.12);border-radius:12px;padding:16px;margin:14px 0;font-size:13.5px;background:#fff';
        fm.innerHTML = '<input id="vq-p" placeholder="Product (e.g. BPC-157 10mg)" style="width:100%;height:36px;border:1px solid rgba(11,12,22,.14);border-radius:9px;padding:0 11px;font-size:13.5px;font-family:inherit;margin-bottom:10px;outline:none"/>' +
          '<input id="vq-n" placeholder="Quantity (vials)" inputmode="numeric" style="width:100%;height:36px;border:1px solid rgba(11,12,22,.14);border-radius:9px;padding:0 11px;font-size:13.5px;font-family:inherit;margin-bottom:10px;outline:none"/>' +
          '<textarea id="vq-t" placeholder="Timeline, standing-order cadence, or anything else" style="width:100%;min-height:70px;border:1px solid rgba(11,12,22,.14);border-radius:9px;padding:9px 11px;font-size:13.5px;font-family:inherit;margin-bottom:10px;outline:none;resize:vertical"></textarea>' +
          '<p id="vq-err" style="display:none;color:#df2225;font-size:12.5px;margin:0 0 10px"></p>' +
          '<button type="button" id="vq-save" style="border:none;border-radius:9px;background:#6e59e2;color:#fff;padding:9px 16px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit">Submit quote request</button>';
        var main = $('main') || document.body;
        var head = $$('h1', main)[0];
        (head ? head.parentNode.parentNode : main).appendChild(fm);
        $('#vq-save').addEventListener('click', function () {
          var pr = $('#vq-p').value.trim(), n = $('#vq-n').value.trim();
          if (!pr || !n) { $('#vq-err').textContent = 'Product and quantity are required.'; $('#vq-err').style.display = 'block'; return }
          quotes.unshift({ product: pr, qty: n, notes: $('#vq-t').value.trim(), at: Date.now() });
          put('vh-quotes-v1', quotes);
          fm.remove(); renderQ();
          toast('Quote request received — reviewed by an account manager within 1 business day.');
        });
      });
    });
  }
})();
