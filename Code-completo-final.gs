const SHEET_ID = "1TrkXzcvHUTVbvSAM_INK8gTQCUa_ZYQa";
const FORM_ID = "12lbgmohg1aIqBeZlhfBHwwnjWAWcGMu-KLY_kTNFn98";
const MINIMO_APROBACION = 80;
const DOMINIO_ZIMBRA = "@minterior.gub.uy";

// ======================================================
// PÁGINA WEB PRINCIPAL
// ======================================================
function doGet(e) {
  // Si viene con parámetro "callback", es una petición de validación
  // JSONP desde la página externa de inscripción (no la carga normal
  // de este formulario). La resolvemos y cortamos acá.
  if (e && e.parameter && e.parameter.callback) {
    return manejarValidacionJSONP(e);
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .contenedor {
      max-width: 600px;
      margin: 30px auto;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.10);
    }
    h2 {
      margin-top: 0;
      color: #202124;
    }
    .aviso {
      background: #fff8e1;
      border-left: 5px solid #f9ab00;
      padding: 15px;
      margin-bottom: 25px;
      border-radius: 5px;
    }
    label {
      display: block;
      margin-top: 15px;
      margin-bottom: 6px;
      font-weight: bold;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 16px;
    }
    button {
      width: 100%;
      margin-top: 25px;
      padding: 14px;
      background: #673ab7;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 17px;
      font-weight: bold;
      cursor: pointer;
    }
    button:hover {
      background: #5e35b1;
    }
    button:disabled {
      background: #aaa;
      cursor: not-allowed;
    }
    #resultado {
      margin-top: 20px;
    }
    .exito {
      background: #e6f4ea;
      color: #137333;
      padding: 15px;
      border-radius: 6px;
      border-left: 5px solid #34a853;
    }
    .error {
      background: #fce8e6;
      color: #c5221f;
      padding: 15px;
      border-radius: 6px;
      border-left: 5px solid #d93025;
    }
    .cargando {
      background: #e8f0fe;
      color: #1967d2;
      padding: 15px;
      border-radius: 6px;
    }
    @media (max-width: 600px) {
      body {
        padding: 8px;
      }
      .contenedor {
        margin: 10px auto;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="contenedor">
    <h2>Formulario de inscripción</h2>
    <div class="aviso">
      Para enviar este formulario debe tener una nota
      igual o mayor al <b>80%</b>.
      <br><br>
      Si ya realizó un ingreso anterior,
      se tomará como válido el último formulario enviado.
    </div>
    <label for="idSchoology">
      ID de Schoology *
    </label>
    <input
      type="text"
      id="idSchoology"
      placeholder="Ingrese su ID de Schoology"
    >
    <label for="nombreApellido">
      Nombre y apellido *
    </label>
    <input
      type="text"
      id="nombreApellido"
      placeholder="Ingrese nombre y apellido"
    >
    <label for="telefono">
      Número de teléfono *
    </label>
    <input
      type="tel"
      id="telefono"
      placeholder="Ingrese su teléfono"
    >
    <label for="mailZimbra">
      Mail Zimbra *
    </label>
    <input
      type="email"
      id="mailZimbra"
      placeholder="Ingrese su mail Zimbra"
    >
    <label for="destacamento">
      Destacamento al cual pertenece *
    </label>
    <input
      type="text"
      id="destacamento"
      placeholder="Ingrese su destacamento"
    >
    <button
      id="btnEnviar"
      onclick="enviarFormulario()"
    >
      Enviar formulario
    </button>
    <div id="resultado"></div>
  </div>
<script>
function enviarFormulario() {
  const boton =
    document.getElementById("btnEnviar");
  const resultado =
    document.getElementById("resultado");
  const datos = {
    idSchoology:
      document
        .getElementById("idSchoology")
        .value
        .trim(),
    nombreApellido:
      document
        .getElementById("nombreApellido")
        .value
        .trim(),
    telefono:
      document
        .getElementById("telefono")
        .value
        .trim(),
    mailZimbra:
      document
        .getElementById("mailZimbra")
        .value
        .trim(),
    destacamento:
      document
        .getElementById("destacamento")
        .value
        .trim()
  };
  if (!datos.idSchoology) {
    resultado.innerHTML =
      '<div class="error">' +
      'Debe ingresar su ID de Schoology.' +
      '</div>';
    return;
  }
  if (!datos.nombreApellido) {
    resultado.innerHTML =
      '<div class="error">' +
      'Debe ingresar nombre y apellido.' +
      '</div>';
    return;
  }
  if (!datos.telefono) {
    resultado.innerHTML =
      '<div class="error">' +
      'Debe ingresar número de teléfono.' +
      '</div>';
    return;
  }
  if (!datos.mailZimbra) {
    resultado.innerHTML =
      '<div class="error">' +
      'Debe ingresar mail Zimbra.' +
      '</div>';
    return;
  }
  if (!datos.destacamento) {
    resultado.innerHTML =
      '<div class="error">' +
      'Debe ingresar el destacamento.' +
      '</div>';
    return;
  }
  boton.disabled = true;
  boton.innerText =
    "Validando...";
  resultado.innerHTML =
    '<div class="cargando">' +
    'Validando nota de aprobación...' +
    '</div>';
  google.script.run
    .withSuccessHandler(function(respuesta) {
      boton.disabled = false;
      boton.innerText =
        "Enviar formulario";
      if (respuesta.ok) {
        resultado.innerHTML =
          '<div class="exito">' +
          '<b>Formulario enviado correctamente.</b>' +
          '<br><br>' +
          respuesta.mensaje +
          '</div>';
        limpiarFormulario();
      } else {
        resultado.innerHTML =
          '<div class="error">' +
          '<b>No se pudo enviar.</b>' +
          '<br><br>' +
          respuesta.mensaje +
          '</div>';
      }
    })
    .withFailureHandler(function(error) {
      boton.disabled = false;
      boton.innerText =
        "Enviar formulario";
      resultado.innerHTML =
        '<div class="error">' +
        '<b>Error del sistema:</b>' +
        '<br><br>' +
        error.message +
        '</div>';
    })
    .procesarFormulario(datos);
}
function limpiarFormulario() {
  document.getElementById("idSchoology").value = "";
  document.getElementById("nombreApellido").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("mailZimbra").value = "";
  document.getElementById("destacamento").value = "";
}
</script>
</body>
</html>
`;
  return HtmlService
    .createHtmlOutput(html)
    .setTitle("Formulario de inscripción")
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );
}

// ======================================================
// VALIDACIÓN JSONP (para la página externa de inscripción)
// ======================================================
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
    resultado = procesarFormulario(datos);
  } catch (err) {
    resultado = { ok: false, mensaje: "Error del sistema: " + err.message };
  }
  const salida = callback + "(" + JSON.stringify(resultado) + ");";
  return ContentService
    .createTextOutput(salida)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// ======================================================
// PROCESAR FORMULARIO
// ======================================================
function procesarFormulario(datos) {
  try {
    if (!datos) {
      return {
        ok: false,
        mensaje: "No se recibieron datos."
      };
    }
    if (!datos.idSchoology) {
      return {
        ok: false,
        mensaje:
          "Debe ingresar el ID de Schoology."
      };
    }
    if (!datos.nombreApellido) {
      return {
        ok: false,
        mensaje:
          "Debe ingresar nombre y apellido."
      };
    }
    if (!datos.telefono) {
      return {
        ok: false,
        mensaje:
          "Debe ingresar número de teléfono."
      };
    }
    if (!datos.mailZimbra) {
      return {
        ok: false,
        mensaje:
          "Debe ingresar el mail Zimbra."
      };
    }
    if (!datos.destacamento) {
      return {
        ok: false,
        mensaje:
          "Debe ingresar el destacamento."
      };
    }
    if (!validarMailZimbra(datos.mailZimbra)) {
      return {
        ok: false,
        mensaje:
          "Debe ingresar un mail Zimbra válido " +
          "terminado en " +
          DOMINIO_ZIMBRA
      };
    }
    const alumno =
      buscarAlumno(datos.idSchoology);
    if (!alumno) {
      return {
        ok: false,
        mensaje:
          "No se encontró el ID de Schoology " +
          datos.idSchoology +
          " en la base de datos."
      };
    }
    if (
      alumno.nota === null ||
      alumno.nota === "" ||
      isNaN(alumno.nota)
    ) {
      return {
        ok: false,
        mensaje:
          "El alumno fue encontrado, " +
          "pero no tiene una nota válida registrada."
      };
    }
    if (
      alumno.nota <
      MINIMO_APROBACION
    ) {
      return {
        ok: false,
        mensaje:
          "Su nota actual es " +
          alumno.nota +
          "%. Debe alcanzar al menos " +
          MINIMO_APROBACION +
          "% para poder enviar el formulario."
      };
    }
    const eraDuplicado =
      verificarSiYaExistia(
        datos.idSchoology
      );
    enviarAGoogleForm(datos);
    guardarRespuestaBackup(
      datos,
      alumno.nota,
      alumno.nombre,
      alumno.apellido
    );
    enviarCorreoConfirmacion(
      datos,
      alumno.nota,
      eraDuplicado
    );
    return {
      ok: true,
      mensaje:
        "Validación aprobada. " +
        "Nota registrada: " +
        alumno.nota +
        "%. " +
        "Se envió una confirmación " +
        "al mail Zimbra ingresado." +
        (
          eraDuplicado
            ? "<br><br>" +
              "<b>Atención:</b> " +
              "ya existía un ingreso anterior " +
              "con este ID de Schoology. " +
              "Se tomará como válido " +
              "el último formulario ingresado."
            : ""
        )
    };
  } catch (error) {
    console.error(error);
    throw new Error(
      "Error al procesar formulario: " +
      error.message
    );
  }
}

// ======================================================
// BUSCAR ALUMNO EN NOTAS
// ======================================================
function buscarAlumno(idSchoology) {
  const ss =
    SpreadsheetApp.openById(
      SHEET_ID
    );
  const sheet =
    ss.getSheetByName(
      "NOTAS"
    );
  if (!sheet) {
    throw new Error(
      'No existe una hoja llamada "NOTAS".'
    );
  }
  const datos =
    sheet
      .getDataRange()
      .getValues();
  const idBuscado =
    String(idSchoology)
      .trim();
  for (
    let i = 1;
    i < datos.length;
    i++
  ) {
    const id =
      String(
        datos[i][0] || ""
      ).trim();
    const nombre =
      String(
        datos[i][1] || ""
      ).trim();
    const apellido =
      String(
        datos[i][2] || ""
      ).trim();
    const nota =
      convertirNota(
        datos[i][3]
      );
    if (
      id === idBuscado
    ) {
      return {
        id: id,
        nombre: nombre,
        apellido: apellido,
        nota: nota
      };
    }
  }
  return null;
}

// ======================================================
// CONVERTIR NOTA
// ======================================================
function convertirNota(valor) {
  if (
    valor === null ||
    valor === ""
  ) {
    return null;
  }
  if (
    typeof valor === "number"
  ) {
    if (
      valor >= 0 &&
      valor <= 1
    ) {
      return Math.round(
        valor * 10000
      ) / 100;
    }
    return Math.round(
      valor * 100
    ) / 100;
  }
  let texto =
    String(valor)
      .trim()
      .replace("%", "")
      .replace(",", ".");
  const numero =
    Number(texto);
  if (
    isNaN(numero)
  ) {
    return null;
  }
  return numero;
}

// ======================================================
// ENVIAR AL GOOGLE FORM
// ======================================================
function enviarAGoogleForm(datos) {
  const form =
    FormApp.openById(
      FORM_ID
    );
  const items =
    form.getItems();
  const response =
    form.createResponse();
  if (
    items.length < 4
  ) {
    throw new Error(
      "El Google Form tiene menos de 4 preguntas. " +
      "Se encontraron " +
      items.length +
      " elementos."
    );
  }
  agregarRespuestaTexto(
    response,
    items[0],
    datos.nombreApellido,
    1
  );
  agregarRespuestaTexto(
    response,
    items[1],
    datos.telefono,
    2
  );
  agregarRespuestaTexto(
    response,
    items[2],
    datos.mailZimbra,
    3
  );
  agregarRespuestaTexto(
    response,
    items[3],
    datos.destacamento,
    4
  );
  response.submit();
}

// ======================================================
// AGREGAR RESPUESTA DE TEXTO
// ======================================================
function agregarRespuestaTexto(
  response,
  item,
  valor,
  numeroPregunta
) {
  const tipo =
    item.getType();
  if (
    tipo ===
    FormApp.ItemType.TEXT
  ) {
    response.withItemResponse(
      item
        .asTextItem()
        .createResponse(
          String(valor)
        )
    );
    return;
  }
  if (
    tipo ===
    FormApp.ItemType.PARAGRAPH_TEXT
  ) {
    response.withItemResponse(
      item
        .asParagraphTextItem()
        .createResponse(
          String(valor)
        )
    );
    return;
  }
  throw new Error(
    "La pregunta número " +
    numeroPregunta +
    ' titulada "' +
    item.getTitle() +
    '" no es de tipo texto ni párrafo. ' +
    "Tipo detectado: " +
    tipo
  );
}

// ======================================================
// GUARDAR RESPUESTA DE RESPALDO
// ======================================================
function guardarRespuestaBackup(
  datos,
  nota,
  nombreBase,
  apellidoBase
) {
  const ss =
    SpreadsheetApp.openById(
      SHEET_ID
    );
  let sheet =
    ss.getSheetByName(
      "RESPUESTAS"
    );
  if (!sheet) {
    sheet =
      ss.insertSheet(
        "RESPUESTAS"
      );
    sheet.appendRow([
      "FECHA",
      "ID_SCHOOLOGY",
      "NOMBRE_APELLIDO",
      "TELEFONO",
      "MAIL_ZIMBRA",
      "DESTACAMENTO",
      "NOTA",
      "NOMBRE_BASE",
      "APELLIDO_BASE",
      "ESTADO"
    ]);
  }
  const datosHoja =
    sheet
      .getDataRange()
      .getValues();
  const idBuscado =
    String(
      datos.idSchoology
    ).trim();
  for (
    let i = 1;
    i < datosHoja.length;
    i++
  ) {
    const idExistente =
      String(
        datosHoja[i][1] || ""
      ).trim();
    if (
      idExistente ===
      idBuscado
    ) {
      sheet
        .getRange(
          i + 1,
          10
        )
        .setValue(
          "REEMPLAZADO"
        );
    }
  }
  sheet.appendRow([
    new Date(),
    datos.idSchoology,
    datos.nombreApellido,
    datos.telefono,
    datos.mailZimbra,
    datos.destacamento,
    nota,
    nombreBase,
    apellidoBase,
    "VIGENTE"
  ]);
}

// ======================================================
// VERIFICAR DUPLICADO
// ======================================================
function verificarSiYaExistia(
  idSchoology
) {
  const ss =
    SpreadsheetApp.openById(
      SHEET_ID
    );
  const sheet =
    ss.getSheetByName(
      "RESPUESTAS"
    );
  if (!sheet) {
    return false;
  }
  const datos =
    sheet
      .getDataRange()
      .getValues();
  const idBuscado =
    String(idSchoology)
      .trim();
  for (
    let i = 1;
    i < datos.length;
    i++
  ) {
    const id =
      String(
        datos[i][1] || ""
      ).trim();
    if (
      id === idBuscado
    ) {
      return true;
    }
  }
  return false;
}

// ======================================================
// VALIDAR MAIL ZIMBRA
// ======================================================
function validarMailZimbra(mail) {
  const correo =
    String(mail || "")
      .trim()
      .toLowerCase();
  return correo.endsWith(
    DOMINIO_ZIMBRA
  );
}

// ======================================================
// ENVIAR CORREO DE CONFIRMACIÓN
// ======================================================
function enviarCorreoConfirmacion(
  datos,
  nota,
  eraDuplicado
) {
  const asunto =
    "Confirmación de inscripción";
  const cuerpoTexto =
    "Estimado/a " +
    datos.nombreApellido +
    ",\\n\\n" +
    "Su formulario fue ingresado correctamente.\\n\\n" +
    (
      eraDuplicado
        ? "IMPORTANTE: Ya existía un ingreso anterior " +
          "con este ID de Schoology. " +
          "Se tomará como válido el último formulario ingresado.\\n\\n"
        : ""
    ) +
    "Datos registrados:\\n" +
    "Nombre y apellido: " +
    datos.nombreApellido +
    "\\n" +
    "Número de teléfono: " +
    datos.telefono +
    "\\n" +
    "Mail Zimbra: " +
    datos.mailZimbra +
    "\\n" +
    "Destacamento: " +
    datos.destacamento +
    "\\n" +
    "Nota validada: " +
    nota +
    "%\\n\\n" +
    "Saludos.";

  const filaDato = (etiqueta, valor) => `
    <tr>
      <td style="padding:14px 0; border-bottom:1px solid #e5e7eb; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:700; color:#1f2937; width:170px; vertical-align:top;">
        ${etiqueta}
      </td>
      <td style="padding:14px 0; border-bottom:1px solid #e5e7eb; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:#3730a3; vertical-align:top;">
        ${valor}
      </td>
    </tr>
  `;

  const cuerpoHtml = `
    <div style="background:#f3f4f6; padding:24px; font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

        <div style="background:#7f1d1d; padding:24px 30px;">
          <h1 style="margin:0; color:#ffffff; font-family:Arial,Helvetica,sans-serif; font-size:21px; font-weight:700;">
            Confirmación de inscripción
          </h1>
        </div>

        <div style="padding:30px;">
          <p style="margin:0 0 16px; font-family:Arial,Helvetica,sans-serif; font-size:14.5px; color:#1f2937;">
            Estimado/a <b>${escaparHtml(datos.nombreApellido)}</b>,
          </p>
          <p style="margin:0 0 20px; font-family:Arial,Helvetica,sans-serif; font-size:14.5px; color:#1f2937;">
            Su formulario fue ingresado correctamente.
          </p>

          ${
            eraDuplicado
              ? `
                <div style="background:#fff7ed; border-left:4px solid #f97316; border-radius:6px; padding:14px 16px; margin-bottom:22px; font-family:Arial,Helvetica,sans-serif; font-size:13.5px; color:#7c2d12; line-height:1.5;">
                  <b>Importante:</b> ya existía un ingreso anterior con este ID de Schoology.
                  Se tomará como válido el último formulario ingresado.
                </div>
              `
              : ""
          }

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:8px;">
            ${filaDato("Nombre y apellido", escaparHtml(datos.nombreApellido))}
            ${filaDato("Teléfono", escaparHtml(datos.telefono))}
            ${filaDato("Correo Zimbra", `<a href="mailto:${escaparHtml(datos.mailZimbra)}" style="color:#3730a3; text-decoration:none;">${escaparHtml(datos.mailZimbra)}</a>`)}
            ${filaDato("Destacamento", escaparHtml(datos.destacamento))}
            ${filaDato("Nota validada", escaparHtml(String(nota)) + "%")}
          </table>

          <p style="margin:22px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:14.5px; color:#1f2937;">
            Saludos.
          </p>
        </div>

      </div>
    </div>
  `;
  MailApp.sendEmail({
    to:
      datos.mailZimbra,
    subject:
      asunto,
    body:
      cuerpoTexto,
    htmlBody:
      cuerpoHtml,
    name:
      "Sistema de Inscripción"
  });
}

// ======================================================
// ESCAPAR HTML
// ======================================================
function escaparHtml(valor) {
  return String(valor || "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}

// ======================================================
// PROBAR CONEXIONES
// ======================================================
function probarConexiones() {
  const ss =
    SpreadsheetApp.openById(
      SHEET_ID
    );
  Logger.log(
    "Planilla conectada: " +
    ss.getName()
  );
  const form =
    FormApp.openById(
      FORM_ID
    );
  Logger.log(
    "Formulario conectado: " +
    form.getTitle()
  );
  const items =
    form.getItems();
  Logger.log(
    "Cantidad de preguntas: " +
    items.length
  );
  items.forEach(
    function(item, index) {
      Logger.log(
        "Pregunta " +
        (index + 1) +
        ": " +
        item.getTitle() +
        " | Tipo: " +
        item.getType()
      );
    }
  );
}

// ======================================================
// PRUEBA DE CORREO
// ======================================================
function probarCorreo() {
  MailApp.sendEmail({
    to:
      "TU_CORREO@minterior.gub.uy",
    subject:
      "Prueba del sistema de inscripción",
    body:
      "Este es un correo de prueba. " +
      "El sistema puede enviar confirmaciones correctamente.",
    htmlBody:
      "<p>" +
      "<b>Prueba correcta.</b>" +
      "</p>" +
      "<p>" +
      "El sistema puede enviar confirmaciones correctamente." +
      "</p>",
    name:
      "Sistema de Inscripción"
  });
}
