/* Pantalla de contraseña simple (no es seguridad real: frena visitas casuales).
   Para cambiar la clave: reemplazá H por el SHA-256 de la nueva clave. */
(function () {
  var H = '82f2d18458c4e7827bbd4f92932646c827d0f491469fc96bf7a3bba4bd65e610', K = 'lfdc-ok', d = document, s = d.currentScript;
  var bg = s.getAttribute('data-bg'), fg = s.getAttribute('data-fg');
  if (!(window.crypto && crypto.subtle)) return;
  try { if (sessionStorage.getItem(K) === H) return; } catch (e) {}
  d.documentElement.classList.add('lfdc-locked');
  function hash(t) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    });
  }
  d.addEventListener('DOMContentLoaded', function () {
    var g = d.createElement('div');
    g.id = 'lfdc-gate';
    g.innerHTML =
      '<form style="display:flex;flex-direction:column;gap:24px;width:min(100%,320px)">' +
      '<span style="align-self:flex-start;background:#1A1A1A;color:#fff;font-size:20px;line-height:1;letter-spacing:.32em;padding:9.4px 8.6px 10.6px 15px">LFdC</span>' +
      '<label for="lfdc-pw" style="font-size:11px;letter-spacing:.08em">MATERIAL CONFIDENCIAL · INGRESÁ LA CLAVE</label>' +
      '<input id="lfdc-pw" type="password" autocomplete="current-password" required style="font:inherit;font-size:16px;padding:12px 0;background:transparent;color:inherit;border:0;border-bottom:1px solid currentColor;outline:none;border-radius:0">' +
      '<button type="submit" style="font:inherit;font-size:12px;letter-spacing:.06em;align-self:flex-start;background:#DDFF00;color:#111;border:0;padding:12px 16px;cursor:pointer">[ ENTRAR ]</button>' +
      '<span id="lfdc-err" role="alert" style="font-size:11px;letter-spacing:.06em;min-height:1em"></span>' +
      '</form>';
    g.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;font-family:"Fabrica Mono",ui-monospace,monospace;background:' + bg + ';color:' + fg;
    d.body.appendChild(g);
    var f = g.querySelector('form'), i = g.querySelector('input'), e = g.querySelector('#lfdc-err');
    i.focus();
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      hash(i.value).then(function (h) {
        if (h === H) {
          try { sessionStorage.setItem(K, H); } catch (x) {}
          d.documentElement.classList.remove('lfdc-locked');
          g.remove();
        } else { e.textContent = 'CLAVE INCORRECTA'; i.value = ''; i.focus(); }
      });
    });
  });
})();
