(function () {
  var WHATSAPP = '523314563001';

  // Menú móvil
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Animación al aparecer
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  // Reservas
  var form = document.getElementById('bookingForm');
  var fecha = document.getElementById('fecha');
  var servicio = document.getElementById('servicio');
  var errorBox = document.getElementById('formError');
  var okBox = document.getElementById('formOk');

  function toISO(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  fecha.min = toISO(new Date());
  fecha.value = fecha.min;

  // Botones "Reservar" de las tarjetas preseleccionan el servicio
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () { servicio.value = a.getAttribute('data-service'); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    okBox.hidden = true;
    var missing = [];
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || !el.required) return;
      var bad = !el.value.trim();
      el.classList.toggle('is-invalid', bad);
      if (bad) missing.push(el);
    });
    if (missing.length) {
      errorBox.textContent = 'Por favor completa los campos marcados.';
      errorBox.hidden = false;
      missing[0].focus();
      return;
    }
    var tel = form.telefono.value.replace(/\D/g, '');
    if (tel.length < 10) {
      form.telefono.classList.add('is-invalid');
      errorBox.textContent = 'Escribe un teléfono de 10 dígitos.';
      errorBox.hidden = false;
      form.telefono.focus();
      return;
    }
    errorBox.hidden = true;

    var partes = fecha.value.split('-');
    var fechaMx = partes[2] + '/' + partes[1] + '/' + partes[0];
    var lines = [
      'Hola, quiero reservar un servicio:',
      '',
      '*Nombre:* ' + form.nombre.value.trim(),
      '*Teléfono:* ' + form.telefono.value.trim(),
      '*Servicio:* ' + form.servicio.value,
      '*Fecha:* ' + fechaMx,
      '*Hora:* ' + form.hora.value,
      '*Dirección:* ' + form.direccion.value.trim()
    ];
    if (form.notas.value.trim()) lines.push('*Notas:* ' + form.notas.value.trim());

    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
    okBox.hidden = false;
  });
})();
