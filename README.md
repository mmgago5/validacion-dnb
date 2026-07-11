# Validación de Inscripciones — Escuela de Especialidades DNB

Página web para el trámite de validación de inscripciones a cursos prácticos
de la Escuela de Especialidades, Dirección Nacional de Bomberos (Uruguay).

## Qué hace

1. Muestra el protocolo de inscripción en 6 pasos (aprobación teórica en
   Schoology, selección de curso práctico, formulario de validación,
   condición bloqueante por nota no validada, correo de confirmación y
   confirmación final de cupo por parte de la Escuela).
2. Lista los cursos prácticos disponibles como tarjetas seleccionables
   (por ahora, "Rescate Agreste").
3. Al elegir un curso, muestra su formulario de validación embebido en
   la página.
4. Al enviar, valida la nota contra Schoology y muestra el resultado
   **en la misma página** (aprobado / rechazado, con el mensaje del
   sistema), sin abrir pestañas ni ventanas emergentes. Esto se logra
   con una técnica JSONP que evita los bloqueos de CORS e iframe que
   tiene Google Apps Script.

## Estructura

```
.
├── index.html                    → página completa (HTML + CSS + JS en un solo archivo)
├── Code-completo-final.gs        → código completo para pegar en Apps Script
├── doGet-jsonp-para-agregar.gs   → mismo cambio de JSONP, en formato "agregar a tu script" (referencia)
├── doPost-para-agregar.gs        → función doPost de respaldo (ya no se usa en el flujo actual, se deja por si sirve)
└── README.md
```

No hay build ni dependencias en el front: es HTML estático, se puede
abrir directo en el navegador o publicar en cualquier hosting estático.

## Apps Script

El archivo que hay que tener pegado en tu proyecto de Apps Script es
**`Code-completo-final.gs`** — reemplaza el Code.gs entero. Incluye:

- El formulario original (`doGet` sin parámetros), igual que antes.
- `manejarValidacionJSONP`, que es lo que le permite a `index.html`
  mostrar el resultado de la validación sin salir de la página.
- Toda la lógica de validación de nota, envío al Google Form, respaldo
  en planilla y mail de confirmación, sin cambios.

Cada vez que se edite este archivo hay que volver a implementar:
**Implementar → Administrar implementaciones → lápiz de editar →
Nueva versión → Implementar.**

## Cómo agregar o editar cursos prácticos

Todo se controla desde el array `CURSOS` dentro del `<script>` al final de
`index.html`:

```js
const CURSOS = [
  {
    id: "rescate-agreste",
    nombre: "Rescate Agreste",
    codigo: "AGRESTE-2026",
    cupos: "Turno único",
    formUrl: "https://script.google.com/macros/s/AKfycbx.../exec",
  },
  // agregar más cursos acá, cada uno con su propia formUrl
];
```

- `formUrl` es la URL de despliegue (`/exec`) de la Web App de Apps Script
  que procesa la validación de ese curso específico.
- Cada curso puede tener su propia `formUrl`, o repetir la misma si varios
  cursos comparten un mismo formulario/planilla.

## Publicar en GitHub Pages

1. Crear el repositorio en GitHub y subir estos archivos (ver pasos abajo).
2. En el repo: **Settings → Pages → Source**, elegir la rama `main` y la
   carpeta `/ (root)`.
3. GitHub va a publicar el sitio en `https://<usuario>.github.io/<repo>/`.


## Notas técnicas

- El formulario embebido corre en un `<iframe>` apuntando directamente a la
  Web App de Apps Script — no hay llamadas fetch/POST desde esta página, así
  que no aplican los problemas de CORS de Apps Script.
- Para que el `<iframe>` cargue correctamente, la Web App debe estar
  desplegada con acceso **"Cualquier usuario"** (Anyone), si no el navegador
  va a bloquear el contenido dentro del iframe.
