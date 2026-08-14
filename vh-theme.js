/* Vantage preview — light/dark theme engine. Loaded synchronously in <head>
   on every page so the saved choice applies before first paint (no flash).
   window.vhTheme is the single source of truth; the profile Appearance
   switch and the header sun/moon buttons both call set()/toggle().
   The .dark token block already ships in the captured Tailwind sheet; the
   CSS below only covers hardcoded-light utilities, the index hero system,
   the vh-checkout --v-* vars, and inline-styled JS-rendered widgets. */
(function () {
  /* KEY must stay 'theme': the captured pages embed a next-themes bootstrap at
     the top of <body> that re-applies the class from localStorage('theme') —
     using the same key makes it agree with us instead of stomping us. */
  var KEY = 'theme';
  var root = document.documentElement;
  function saved() { try { return localStorage.getItem(KEY) } catch (e) { return null } }
  function apply(mode) {
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    root.style.colorScheme = mode;
  }
  window.vhTheme = {
    mode: function () { return saved() === 'dark' ? 'dark' : 'light' },
    set: function (mode) {
      mode = mode === 'dark' ? 'dark' : 'light';
      try { localStorage.setItem(KEY, mode) } catch (e) {}
      apply(mode);
      try { document.dispatchEvent(new CustomEvent('vh-theme', { detail: mode })) } catch (e) {}
    },
    toggle: function () { window.vhTheme.set(window.vhTheme.mode() === 'dark' ? 'light' : 'dark') }
  };
  apply(window.vhTheme.mode());

  var css = '\
html.dark{\
--color-ink:#f1f1f5;--color-ink-muted:#a7a1bd;--color-ink-faint:#7d7793;--color-vline:#f1f1f51f;\
--v-fg:#f1f1f5;--v-mid:#b6b7c4;--v-muted:#9697a2;--v-faint:#6f7080;\
--v-bd:rgba(241,241,245,.1);--v-in:rgba(241,241,245,.16);\
--v-bg:#030210;--v-subtle:#0f101f;\
--color-tint-1:#0b0a20;\
}\
.dark [class*="#f7f4fe"],.dark [class*="#f6f2fe"]{background-image:radial-gradient(500px 260px at 90% 0,rgba(124,58,237,.18),transparent 60%),linear-gradient(160deg,#100d28,#0a081c)}\
.dark .bg-white{background-color:var(--card)}\
.dark .bg-white\\/85{background-color:rgba(7,7,25,.85)}\
.dark .bg-white\\/75{background-color:rgba(7,7,25,.75)}\
.dark .bg-white\\/70{background-color:rgba(7,7,25,.7)}\
.dark .bg-white\\/60{background-color:rgba(7,7,25,.6)}\
.dark .text-\\[\\#059669\\]{color:#34d399}\
.dark .text-\\[\\#b45309\\]{color:#fbbf24}\
.dark .text-\\[\\#4c1d95\\]{color:#c4b5fd}\
.dark .vh-hero{color:#e7e3f5;background:#08051a;background-image:radial-gradient(640px 400px at 84% -12%,rgba(124,58,237,.16),transparent 60%)}\
.dark .vh-h1{color:#f1f1f5}\
.dark .vh-h1 em{color:#a78bfa}\
.dark .vh-kicker{color:#a78bfa}\
.dark .vh-kicker::before{background:rgba(168,132,255,.5)}\
.dark .vh-lede{color:#a9a3bd}\
.dark .vh-input{background:#0f101f;border-color:rgba(241,241,245,.18);color:#f1f1f5}\
.dark .vh-input::placeholder{color:#6f7080}\
.dark .vh-ghost{color:#c4b5fd;border-color:rgba(196,181,253,.35)!important}\
.dark .vh-ghost:hover{background:rgba(124,58,237,.16)}\
.dark .vh-doc{background:#0b0a20;color:#e7e3f5;border-color:rgba(241,241,245,.12)}\
.dark .vh-stamp{color:#a78bfa;border-color:rgba(168,132,255,.5)}\
.dark .vh-row{color:#b6b7c4;border-top-color:rgba(241,241,245,.12)}\
.dark .vh-coa{color:#4ade80}\
.dark .vh-stats{border-top-color:rgba(241,241,245,.12)}\
.dark .vh-stat b{color:#f1f1f5}\
.dark .vh-stat span{color:#9697a2}\
.dark .vh-coa-card{background:#0b0a20;box-shadow:0 30px 80px rgba(0,0,0,.6)}\
.dark .vh-coa-title,.dark .vh-coa-field label{color:#f1f1f5}\
.dark .vh-coa-sub,.dark .vh-coa-alt{color:#9697a2}\
.dark .vh-coa-kicker,.dark .vh-coa-req,.dark .vh-coa-alt a{color:#a78bfa}\
.dark .vh-coa-field input{background:#0f101f;border-color:rgba(241,241,245,.2);color:#f1f1f5}\
.dark .vh-coa-x{background:rgba(168,132,255,.12);color:#c4b5fd}\
.dark .vh-coa-fine{color:#6f7080}\
.dark #vh-drawer{background:#0b0a20;box-shadow:-24px 0 60px rgba(0,0,0,.6)}\
.dark .vh-dr-head,.dark .vh-dr-foot{border-color:rgba(241,241,245,.12)}\
.dark .vh-dr-title,.dark .vh-dr-sub{color:#f1f1f5}\
.dark .vh-dr-line{border-color:rgba(241,241,245,.14);color:#e7e3f5}\
.dark .vh-dr-x{background:rgba(168,132,255,.14);color:#c4b5fd}\
.dark .vh-dr-qty button{background:rgba(168,132,255,.16);color:#c4b5fd}\
.dark #vh-menu{background:#0b0a20;border-bottom-color:rgba(241,241,245,.12)}\
.dark #vh-menu a{color:#e7e3f5;border-top-color:rgba(241,241,245,.08)}\
.dark #vh-menu a:hover{background:rgba(124,58,237,.14);color:#c4b5fd}\
.dark .vh-back-profile{color:#f1f1f5;background:var(--card);border-color:rgba(241,241,245,.16)}\
.dark .ck-header,.dark .ck-card,.dark .ck-side,.dark .ck-ghost,.dark .ck-sendto,.dark .ck-copy,.dark .ac-side,.dark .ac-pill,.dark .ac-filter,.dark .ac-row,.dark .ac-btn2{background:var(--card)}\
.dark .ck-field input,.dark .ck-field select,.dark .ck-field textarea,.dark .ac-filter input,.dark .ac-filter select{background:#0f101f}\
.dark .ck-mono{color:#f1f1f5}\
.dark .ac-nav a.is-active{background:#f1f1f5;color:#0b0c16}\
.dark [style*="color:#0b0c16"]{color:#f1f1f5!important}\
.dark [style*="color:#241a3f"]{color:#e7e3f5!important}\
.dark [style*="color:#41424f"]{color:#b6b7c4!important}\
.dark [style*="color:#61626f"]{color:#9697a2!important}\
.dark [style*="background:#f1f1f5"]{background:#0f101f!important}\
.dark [style*="background:#fff"]{background:var(--card)!important}\
.vh-switch{position:relative;width:40px;height:22px;border-radius:999px;border:1px solid var(--input);background:var(--muted);cursor:pointer;transition:background .2s,border-color .2s;flex:none;margin-top:2px;padding:0}\
.vh-switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .2s}\
.vh-switch[aria-checked="true"]{background:var(--primary);border-color:var(--primary)}\
.vh-switch[aria-checked="true"]::after{transform:translateX(18px)}';
  var st = document.createElement('style');
  st.id = 'vh-theme-css';
  st.textContent = css;
  document.head.appendChild(st);
})();
