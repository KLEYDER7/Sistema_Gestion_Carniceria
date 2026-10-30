/* Código compartido por todas las páginas */
(function () {
  "use strict";

  // Muestra la fecha actual en la cabecera.
  var elemento = document.getElementById("fecha");
  if (!elemento) return;

  var opciones = { year: "numeric", month: "long", day: "numeric" };
  if (elemento.hasAttribute("data-largo")) opciones.weekday = "long";

  elemento.textContent = new Date().toLocaleDateString("es-BO", opciones);
})();
