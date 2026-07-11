// ======================================================
// CÓMO INTEGRAR ESTO A TU CODE.GS EXISTENTE
// ======================================================
//
// PASO 1
// Buscá tu función actual:
//
//     function doGet() {
//
// y cambiala por:
//
//     function doGet(e) {
//
// Inmediatamente después de esa línea (antes de "const html = ..."),
// pegá este bloque:
//
//     if (e && e.parameter && e.parameter.callback) {
//       return manejarValidacionJSONP(e);
//     }
//
// El resto de tu doGet (el que arma la página con google.script.run)
// queda exactamente igual, sin tocar nada más.
//
// PASO 2
// En cualquier parte del archivo (fuera de doGet), pegá esta función
// nueva completa:

function manejarValidacionJSONP(e) {
  const callback = e.parameter.callback;
  let resultado;
  try {
    const datos = {
      idSchoology: e.parameter.idSchoology || "",
      nombreApellido: e.parameter.nombreApellido || "",
      telefono: e.parameter.telefono || "",
      mailZimbra: e.parameter.mailZimbra || "",
      destacamento: e.parameter.destacamento || ""
    };
    // Reutiliza tu función procesarFormulario() ya existente:
    // misma validación de nota, mismo envío al Google Form,
    // mismo respaldo en planilla, mismo mail de confirmación.
    resultado = procesarFormulario(datos);
  } catch (err) {
    resultado = { ok: false, mensaje: "Error del sistema: " + err.message };
  }
  const salida = callback + "(" + JSON.stringify(resultado) + ");";
  return ContentService
    .createTextOutput(salida)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// PASO 3
// Implementar → Administrar implementaciones → lápiz de editar →
// Nueva versión → Implementar. (Como siempre, /exec no toma el cambio
// hasta que hagas esto.)
//
// ======================================================
// POR QUÉ FUNCIONA ESTO Y EL IFRAME NO
// ======================================================
// El iframe fallaba porque Google bloquea que cualquier otro sitio
// lo incruste (X-Frame-Options), a nivel del dominio script.google.com,
// sin excepción posible.
//
// JSONP no usa iframe ni fetch: carga la respuesta como si fuera un
// archivo de JavaScript normal (con una etiqueta <script>), algo que
// los navegadores permiten entre sitios distintos desde siempre, y por
// eso no choca con esa restricción ni con las políticas de cookies de
// terceros que bloqueaban el iframe.
//
// La limitación es que solo funciona con GET (por eso los datos viajan
// como parámetros en la URL en vez de en el body de un POST), pero para
// este formulario (5 campos cortos) no hay problema de longitud de URL.
