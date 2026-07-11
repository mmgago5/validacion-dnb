// ======================================================
// AGREGAR ESTA FUNCIÓN AL CODE.GS EXISTENTE
// (junto a doGet, no reemplaza nada, es una función nueva)
// ======================================================
// Maneja los envíos del <form method="POST"> embebido en la
// página de validación. Reutiliza procesarFormulario(), que ya
// tenías escrita para el flujo de google.script.run.
function doPost(e) {
  try {
    const datos = {
      idSchoology: (e.parameter.idSchoology || "").trim(),
      nombreApellido: (e.parameter.nombreApellido || "").trim(),
      telefono: (e.parameter.telefono || "").trim(),
      mailZimbra: (e.parameter.mailZimbra || "").trim(),
      destacamento: (e.parameter.destacamento || "").trim()
    };

    const resultado = procesarFormulario(datos);

    const colorFondo = resultado.ok ? "#eaf3ec" : "#fbebec";
    const colorTexto = resultado.ok ? "#2F6B3E" : "#A31E22";
    const colorBorde = resultado.ok ? "#2F6B3E" : "#A31E22";
    const titulo = resultado.ok ? "Formulario enviado correctamente" : "No se pudo enviar el formulario";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body{
            font-family:-apple-system, 'Segoe UI', Arial, sans-serif;
            background:#F3EEE5;
            margin:0;
            padding:28px 20px;
            color:#1B1815;
          }
          .caja{max-width:480px; margin:0 auto;}
          .marca{
            font-size:10.5px;
            letter-spacing:0.14em;
            text-transform:uppercase;
            color:#A31E22;
            font-weight:700;
            margin-bottom:14px;
          }
          h2{margin:0 0 18px; font-size:20px; letter-spacing:0.01em;}
          .estado{
            background:${colorFondo};
            color:${colorTexto};
            border-left:4px solid ${colorBorde};
            padding:16px 18px;
            border-radius:4px;
            line-height:1.5;
            font-size:14.5px;
          }
          .volver{
            display:inline-block;
            margin-top:22px;
            padding:10px 18px;
            background:#1B1815;
            color:#F3EEE5;
            border-radius:2px;
            text-decoration:none;
            font-size:13px;
            letter-spacing:0.03em;
            text-transform:uppercase;
          }
        </style>
      </head>
      <body>
        <div class="caja">
          <div class="marca">Escuela de Especialidades · DNB</div>
          <h2>${titulo}</h2>
          <div class="estado">${resultado.mensaje}</div>
        </div>
      </body>
      </html>
    `;

    return HtmlService.createHtmlOutput(html)
      .setTitle(titulo)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  } catch (error) {
    return HtmlService.createHtmlOutput(
      '<h2>Error del sistema</h2><p>' + error.message + '</p>'
    );
  }
}
