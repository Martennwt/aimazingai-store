/* Cookie-Einwilligung fuer aimazingai.de (eigener Bau, kein gekauftes Tool). Stand 25.09.2026.
 *
 * Regeln, die hier umgesetzt sind (TDDDG § 25, DSGVO Art. 6/7, Leitlinien der Datenschutzkonferenz):
 * - Nichts ausser dem Einwilligungs-Eintrag selbst wird gespeichert oder geladen, bevor zugestimmt wurde.
 * - "Ablehnen" ist auf der ersten Ebene genauso gross und sichtbar wie "Zustimmen".
 * - Keine vorab gesetzten Haken, jede Kategorie einzeln waehlbar, Auswahl jederzeit aenderbar
 *   (Link mit data-consent-open, steht im Footer jeder Seite).
 * - Die Auswahl verfaellt nach 12 Monaten oder wenn sich DIENSTE unten aendern (Version hochzaehlen!).
 *
 * Neuen Dienst einbauen (z. B. TikTok Pixel): Eintrag in DIENSTE, Loader schreiben, VERSION + 1,
 * Datenschutzerklaerung ergaenzen. Pixel-ID leer = Dienst wird angezeigt, aber nie geladen.
 */
(function () {
  var VERSION = 1;
  var KEY = 'aimazing-consent';
  var MAX_MS = 365 * 24 * 3600 * 1000;

  var DIENSTE = {
    marketing: {
      titel: 'Marketing',
      text: 'Meta Pixel (Meta Platforms Ireland): zeigt mir, welche Anzeigen auf Facebook und Instagram Leute hierher bringen, und macht passende Werbung für dich möglich. Setzt Cookies, Daten können in die USA gehen.',
      laden: function () {
        var id = window.META_PIXEL_ID || '';
        if (!id || window.fbq) return;
        !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
          if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
          t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', id);
        window.fbq('track', 'PageView');
      }
    }
  };

  function lesen() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (!c || c.v !== VERSION || Date.now() - c.t > MAX_MS) return null;
      return c;
    } catch (e) { return null; }
  }
  function schreiben(wahl) {
    var c = { v: VERSION, t: Date.now(), wahl: wahl };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    anwenden(c);
    document.dispatchEvent(new CustomEvent('consent-changed', { detail: wahl }));
  }
  function anwenden(c) {
    window.aiConsent = c ? c.wahl : {};
    Object.keys(DIENSTE).forEach(function (k) { if (c && c.wahl[k]) DIENSTE[k].laden(); });
  }

  var CSS = '' +
    '.ck{position:fixed;left:0;right:0;bottom:0;z-index:50;padding:0 12px calc(12px + env(safe-area-inset-bottom,0px));pointer-events:none}' +
    '.ck-box{pointer-events:auto;max-width:480px;margin:0 auto;background:#F2F1EA;color:#0B0B0B;border:1px solid #0B0B0B;box-shadow:6px 6px 0 #0B0B0B;font-family:"Archivo",system-ui,sans-serif;transform:translateY(24px);opacity:0;transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .35s}' +
    '.ck.on .ck-box{transform:none;opacity:1}' +
    '.ck-kopf{display:flex;justify-content:space-between;align-items:center;height:38px;padding:0 14px;border-bottom:1px solid #0B0B0B;font:500 10.5px/1 "IBM Plex Mono",monospace;letter-spacing:.06em;text-transform:uppercase}' +
    '.ck-kopf mark{background:#C9E266;color:#0B0B0B;padding:3px 6px;font-weight:700}' +
    '.ck-in{padding:14px 14px 0}' +
    '.ck h2{margin:0 0 8px;font-weight:700;font-variation-settings:"wdth" 82;font-size:21px;line-height:1.05;letter-spacing:-.02em}' +
    '.ck p{margin:0;font-size:13.5px;line-height:1.45;color:#5B5B55}' +
    '.ck p a{color:#0B0B0B}' +
    '.ck-row{display:grid;grid-template-columns:1fr 1fr;gap:0;margin:14px -1px 0;border-top:1px solid #0B0B0B}' +
    '.ck-b{height:52px;border:0;background:#0B0B0B;color:#C9E266;font:700 14.5px "Archivo",sans-serif;font-variation-settings:"wdth" 90;cursor:pointer;transition:background .2s,color .2s}' +
    '.ck-b+.ck-b{border-left:1px solid #F2F1EA}' +
    '.ck-b:hover,.ck-b:focus-visible{background:#C9E266;color:#0B0B0B;outline:none}' +
    '.ck-mehr{display:block;width:100%;height:40px;border:0;border-top:1px solid #0B0B0B;background:transparent;font:500 11px "IBM Plex Mono",monospace;letter-spacing:.06em;text-transform:uppercase;color:#0B0B0B;cursor:pointer}' +
    '.ck-mehr:hover{background:#C9E266}' +
    '.ck-liste{margin:12px 0 0;border-top:1px solid #0B0B0B}' +
    '.ck-kat{display:grid;grid-template-columns:1fr auto;gap:4px 14px;padding:11px 0;border-bottom:1px solid #D8D6CB}' +
    '.ck-kat b{font-size:14.5px}' +
    '.ck-kat p{grid-column:1/-1;font-size:12.5px}' +
    '.ck-sw{position:relative;width:44px;height:24px;border:1px solid #0B0B0B;background:#F2F1EA;cursor:pointer;padding:0}' +
    '.ck-sw::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;background:#0B0B0B;transition:transform .25s cubic-bezier(.2,.8,.2,1)}' +
    '.ck-sw[aria-checked="true"]{background:#C9E266}' +
    '.ck-sw[aria-checked="true"]::after{transform:translateX(20px)}' +
    '.ck-sw[disabled]{cursor:default;opacity:.55}' +
    '.ck[hidden]{display:none!important}' +
    '@media (prefers-reduced-motion:reduce){.ck-box,.ck-sw::after{transition:none}}';

  var el, ansicht = 'kurz';
  function bauen() {
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    el = document.createElement('div');
    el.className = 'ck'; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'false'); el.setAttribute('aria-labelledby', 'ck-t');
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      var a = e.target.closest('[data-ck]'); if (!a) return;
      var was = a.getAttribute('data-ck');
      if (was === 'alle') schreiben(allesAuf(true));
      else if (was === 'keine') schreiben(allesAuf(false));
      else if (was === 'mehr') { ansicht = 'lang'; zeichnen(lesen()); }
      else if (was === 'sw') { a.setAttribute('aria-checked', a.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); return; }
      else if (was === 'speichern') {
        var w = {}; el.querySelectorAll('[data-kat]').forEach(function (s) { w[s.getAttribute('data-kat')] = s.getAttribute('aria-checked') === 'true'; });
        schreiben(w);
      }
      if (was !== 'mehr') schliessen();
    });
  }
  function allesAuf(an) { var w = {}; Object.keys(DIENSTE).forEach(function (k) { w[k] = an; }); return w; }

  function zeichnen(c) {
    var wahl = c ? c.wahl : {};
    var h = '<div class="ck-box"><div class="ck-kopf"><span>Cookies</span><mark>deine Wahl</mark></div><div class="ck-in">' +
      '<h2 id="ck-t">Darf ich messen, was Werbung bringt?</h2>' +
      '<p>Mit deiner Zustimmung lade ich den Meta Pixel. Ohne Zustimmung läuft hier nichts davon, die Seite funktioniert genauso. Du kannst deine Wahl jederzeit unten auf der Seite ändern. Mehr in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>';
    if (ansicht === 'lang') {
      h += '<div class="ck-liste"><div class="ck-kat"><b>Notwendig</b><button class="ck-sw" role="switch" aria-checked="true" disabled aria-label="Notwendig, immer an"></button>' +
        '<p>Speichert nur deine Auswahl hier im Browser. Ohne diesen Eintrag würde der Banner bei jedem Besuch wieder auftauchen.</p></div>';
      Object.keys(DIENSTE).forEach(function (k) {
        h += '<div class="ck-kat"><b>' + DIENSTE[k].titel + '</b><button class="ck-sw" role="switch" data-ck="sw" data-kat="' + k + '" aria-checked="' + (wahl[k] ? 'true' : 'false') + '" aria-label="' + DIENSTE[k].titel + '"></button><p>' + DIENSTE[k].text + '</p></div>';
      });
      h += '</div></div><div class="ck-row"><button class="ck-b" data-ck="keine">Alle ablehnen</button><button class="ck-b" data-ck="speichern">Auswahl speichern</button></div></div>';
    } else {
      h += '</div><div class="ck-row"><button class="ck-b" data-ck="keine">Ablehnen</button><button class="ck-b" data-ck="alle">Zustimmen</button></div>' +
        '<button class="ck-mehr" data-ck="mehr">Einstellungen</button></div>';
    }
    el.innerHTML = h;
  }
  function oeffnen(lang) {
    ansicht = lang ? 'lang' : 'kurz';
    zeichnen(lesen());
    el.hidden = false;
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('on'); }); });
  }
  function schliessen() { el.classList.remove('on'); setTimeout(function () { el.hidden = true; }, 350); }

  function start() {
    bauen();
    var c = lesen();
    anwenden(c);
    var p = new URLSearchParams(location.search);
    if (p.has('cookies')) oeffnen(p.get('cookies') === 'lang');
    else if (!c) oeffnen(false);
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-consent-open]');
      if (a) { e.preventDefault(); oeffnen(true); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
