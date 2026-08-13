(function () {
  'use strict';
  var CAS = {"pt-141": "189691-06-3", "bpc-157": "137525-51-0", "glutathione": "70-18-8", "sermorelin": "86168-78-7", "tesamorelin": "218949-48-5", "tb-500": "77591-33-4", "nad-plus": "53-84-9", "semax": "80714-61-0", "cagrilintide": "1415456-99-3", "aod-9604": "221231-10-3", "selank": "129954-34-3", "dsip": "62568-57-4", "glp-1-t": "2023788-19-2", "ghk-cu": "49557-75-7", "kpv": "61512-21-8", "glp-1-s": "910463-68-2", "mots-c": "1627580-64-6", "glp-1-r": "2381089-83-2", "ipamorelin": "170851-70-4", "epithalon": "307297-39-8"};
  function money(n) { return '$' + (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
  function cart() { try { return JSON.parse(localStorage.getItem('vh-cart-v1')) || [] } catch (e) { return [] } }
  function saveCart(list) { localStorage.setItem('vh-cart-v1', JSON.stringify(list)) }
  var MEM = null;
  function state() {
    var h = location.hash.indexOf('s=') > -1 ? location.hash.split('s=')[1] : '';
    if (h) {
      try {
        var fromHash = JSON.parse(decodeURIComponent(h));
        try { sessionStorage.setItem('vh-checkout', JSON.stringify(fromHash)) } catch (e) {}
        MEM = fromHash;
        return fromHash;
      } catch (e) {}
    }
    try { var v = JSON.parse(sessionStorage.getItem('vh-checkout')); if (v) return v } catch (e) {}
    return MEM || {};
  }
  function saveState(patch) {
    var s = state();
    for (var k in patch) s[k] = patch[k];
    MEM = s;
    try { sessionStorage.setItem('vh-checkout', JSON.stringify(s)) } catch (e) {}
    return s;
  }
  // Navigate carrying the state in the URL when sessionStorage did not take the write.
  function goWith(href, s) {
    var stored = null;
    try { stored = sessionStorage.getItem('vh-checkout') } catch (e) {}
    location.href = stored ? href : href + '#s=' + encodeURIComponent(JSON.stringify(s));
  }
  function subtotal() { return cart().reduce(function (s, x) { return s + x.price * x.qty }, 0) }
  function count() { return cart().reduce(function (s, x) { return s + x.qty }, 0) }
  function guard(opts) {
    opts = opts || {};
    var ok = false;
    try { ok = !!localStorage.getItem('vh-preview-session') } catch (e) {}
    if (!ok) { location.href = 'cart.html?v=1786473267'; return false }
    if (!opts.allowEmpty && !cart().length) { location.href = 'index.html#catalog'; return false }
    return true;
  }
  function renderSummary(elId, submitHref) {
    var box = document.getElementById(elId || 'vh-summary');
    if (!box) return;
    var sub = subtotal();
    box.innerHTML = '<div style="font-weight:700;font-size:16px;color:#0b0c16;margin-bottom:12px">Request summary</div>' +
      '<div style="display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid rgba(11,12,22,0.08);font-size:13.5px;color:#41424f"><span>Items</span><b style="color:#0b0c16">' + count() + '</b></div>' +
      '<div style="display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid rgba(11,12,22,0.08);font-size:14.5px;color:#41424f"><span>Estimated subtotal</span><b style="color:#0b0c16">' + money(sub) + '</b></div>' +
      '<div style="background:#f1f1f5;border-radius:11px;padding:13px 15px;font-size:12.5px;line-height:1.6;color:#41424f;margin:10px 0 14px">Final payment, shipping, and availability are confirmed manually after the order request is reviewed.</div>' +
      (submitHref ? '<a href="' + submitHref + '" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;border:none;border-radius:12px;background:#6e59e2;color:#fff;padding:14px;font-size:15px;font-weight:600;cursor:pointer;text-decoration:none">Submit order request <span aria-hidden="true">&rarr;</span></a>' : '');
  }
  function renderOrderSummary(elId) {
    var box = document.getElementById(elId || 'vh-summary');
    if (!box) return;
    var rows = cart().map(function (x) {
      return '<div style="display:flex;justify-content:space-between;gap:16px;align-items:baseline;margin-bottom:12px">' +
        '<div style="min-width:0"><div style="font-size:14.5px;font-weight:700;color:#0b0c16">' + x.title + '</div>' +
        '<div style="font-size:12.5px;color:#61626f;margin-top:2px">' + x.size + ' &times; ' + x.qty + ' &middot; ' + money(x.price) + '/vial</div></div>' +
        '<b style="font-size:15px;color:#0b0c16;white-space:nowrap">' + money(x.price * x.qty) + '</b></div>';
    }).join('');
    function reassure(icon, text) {
      return '<div style="display:flex;align-items:flex-start;gap:10px;font-size:12.5px;line-height:1.5;color:#41424f">' + icon + '<span>' + text + '</span></div>';
    }
    var mail = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#61626f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex:none;margin-top:2px" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>';
    var shield = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#61626f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex:none;margin-top:2px" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>';
    box.innerHTML = '<div style="font-weight:700;font-size:16px;color:#0b0c16;margin-bottom:14px">Order summary</div>' +
      rows +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;padding-top:12px;border-top:1px solid rgba(11,12,22,0.09);font-size:14px;color:#41424f"><span>Estimated subtotal</span><b style="font-size:15.5px;color:#0b0c16">' + money(subtotal()) + '</b></div>' +
      '<div style="background:#f1f1f5;border-radius:10px;padding:13px 14px;margin-top:14px;display:flex;flex-direction:column;gap:10px">' +
      reassure(mail, 'Confirmation email + payment instructions arrive immediately.') +
      reassure(shield, 'No card required: Zelle, reconciled by our team.') +
      '</div>';
  }
  function renderItems(elId, editable) {
    var box = document.getElementById(elId || 'vh-items');
    if (!box) return;
    var list = cart();
    box.innerHTML = '';
    list.forEach(function (x, i) {
      var card = document.createElement('div');
      card.style.cssText = 'display:flex;gap:14px;align-items:center;background:#fff;border:1px solid rgba(11,12,22,0.09);border-radius:14px;padding:14px 16px;margin-bottom:10px';
      card.innerHTML =
        '<img src="products/' + x.handle + '.png" alt="' + x.title + ' vial" style="width:62px;height:62px;object-fit:cover;border-radius:9px;flex:none"/>' +
        '<div style="flex:1;min-width:0">' +
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><b style="font-size:15px;color:#0b0c16">' + x.title + '</b>' +
        '<span style="border:1px solid rgba(11,12,22,0.14);border-radius:999px;padding:2px 9px;font-size:11.5px;color:#41424f">' + x.size + '</span></div>' +
        (CAS[x.handle] ? '<div style="font-family:var(--font-mono),ui-monospace,monospace;font-size:11.5px;color:#61626f;margin-top:3px">CAS ' + CAS[x.handle] + '</div>' : '') +
        '<div style="font-size:15px;font-weight:700;color:#0b0c16;margin-top:5px">' + money(x.price * x.qty) + '</div>' +
        '</div>' +
        (editable ?
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px">' +
        '<span style="display:inline-flex;align-items:center;border:1px solid rgba(11,12,22,0.14);border-radius:10px;overflow:hidden">' +
        '<button type="button" data-a="-" aria-label="Decrease quantity" style="width:32px;height:32px;border:none;background:rgba(110,89,226,0.08);color:#6e59e2;font-size:16px;cursor:pointer">&minus;</button>' +
        '<b style="width:36px;text-align:center;font-size:14px">' + x.qty + '</b>' +
        '<button type="button" data-a="+" aria-label="Increase quantity" style="width:32px;height:32px;border:none;background:rgba(110,89,226,0.08);color:#6e59e2;font-size:16px;cursor:pointer">+</button></span>' +
        '<button type="button" data-a="x" style="display:inline-flex;align-items:center;gap:5px;border:none;background:none;color:#61626f;font-size:12.5px;cursor:pointer"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>Remove</button>' +
        '</div>' : '<span style="font-size:13px;color:#61626f">&times; ' + x.qty + '</span>');
      if (editable) {
        var btns = card.querySelectorAll('button[data-a]');
        Array.prototype.forEach.call(btns, function (b) {
          b.addEventListener('click', function () {
            var l = cart();
            var a = b.getAttribute('data-a');
            if (a === 'x') l.splice(i, 1);
            else { l[i].qty += a === '+' ? 1 : -1; if (l[i].qty <= 0) l.splice(i, 1) }
            saveCart(l);
            if (!l.length) { location.href = 'index.html#catalog'; return }
            renderItems(elId, true);
            renderSummary();
            renderSummary('vh-summary', document.getElementById('vh-summary') && document.getElementById('vh-summary').getAttribute('data-submit') || null);
          });
        });
      }
      box.appendChild(card);
    });
  }
  window.VHCheckout = { cart: cart, state: state, saveState: saveState, goWith: goWith, subtotal: subtotal, count: count, guard: guard, renderSummary: renderSummary, renderOrderSummary: renderOrderSummary, renderItems: renderItems, money: money, CAS: CAS };
})();
