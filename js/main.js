/* =====================================================
   LISTA DE AMIGOS (el corazón se arma solo con esto)
   - Agrega, borra o cambia personas copiando un bloque { ... },
   - Hasta 16 personas sin que se repita ninguna foto.
   - Si hay menos de 16, las fotos se repiten para completar el corazón.
   ===================================================== */
const CONFIG = {
  amigos: [
    { nombre: "Mi socio", foto: "img/amigos/amigo-01.svg", nota: "Con él aprendí que dos cabezas piensan mejor, sobre todo cuando una de las dos se ríe de las ideas de la otra." },
    { nombre: "Mi mentor", foto: "img/amigos/amigo-02.svg", nota: "Me dijo la verdad cuando más la necesitaba. Eso vale más que cualquier elogio." },
    { nombre: "Mi mejor amigo", foto: "img/amigos/amigo-03.svg", nota: "Estuvo antes del primer proyecto y sigue después de cada uno." },
    { nombre: "Mi primera clienta", foto: "img/amigos/amigo-04.svg", nota: "Confió en mí cuando nadie me conocía. Eso no se olvida." },
    { nombre: "Mi equipo de siempre", foto: "img/amigos/amigo-05.svg", nota: "Los que se quedan hasta tarde y todavía sacan chistes." },
    { nombre: "Quien creyó en mí", foto: "img/amigos/amigo-06.svg", nota: "Vio algo en mí antes que yo mismo. Gracias por apostar." },
    { nombre: "El que me hace reír", foto: "img/amigos/amigo-07.svg", nota: "Sin él, las semanas difíciles serían mucho más largas." },
    { nombre: "Mi familia elegida", foto: "img/amigos/amigo-08.svg", nota: "Gente que llegó por el trabajo y se quedó por cariño." }
  ]
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Navegación: marca la sección activa ---------- */
const enlaces = $$(".barra nav a");
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (e.isIntersecting) {
      enlaces.forEach((a) =>
        a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id ? "true" : "false")
      );
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main > section").forEach((s) => observador.observe(s));

/* ---------- Corazón de amigos ---------- */
// Cada # es una pieza del corazón (5 columnas por 5 filas, 16 piezas)
const FORMA = [
  ".#.#.",
  "#####",
  "#####",
  ".###.",
  "..#.."
];
const corazon = $("#corazon");
const fotoFicha = $("#ficha-foto");
const nombreFicha = $("#ficha-nombre");
const notaFicha = $("#ficha-nota");
const piezas = [];

function elegir(indiceAmigo, boton) {
  const a = CONFIG.amigos[indiceAmigo];
  fotoFicha.src = a.foto;
  fotoFicha.alt = "Foto de " + a.nombre;
  nombreFicha.textContent = a.nombre;
  notaFicha.textContent = a.nota;
  piezas.forEach((p) => {
    p.boton.setAttribute("aria-pressed", p.boton === boton ? "true" : "false");
    p.boton.classList.toggle("misma", p.amigo === indiceAmigo && p.boton !== boton);
  });
}

if (corazon && CONFIG.amigos.length) {
  let contador = 0;
  FORMA.forEach((fila, r) => {
    [...fila].forEach((c, col) => {
      if (c !== "#") return;
      const amigo = contador % CONFIG.amigos.length;
      const a = CONFIG.amigos[amigo];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pieza";
      b.style.setProperty("--i", contador);
      b.style.gridRow = r + 1;
      b.style.gridColumn = col + 1;
      b.setAttribute("aria-pressed", "false");
      b.setAttribute("aria-label", a.nombre);
      b.innerHTML = '<img src="' + a.foto + '" alt="">';
      b.addEventListener("click", () => elegir(amigo, b));
      corazon.appendChild(b);
      piezas.push({ boton: b, amigo });
      contador++;
    });
  });
  // Pieza inicial: una del centro del corazón
  const inicial = piezas[Math.floor(piezas.length / 2)];
  elegir(inicial.amigo, inicial.boton);
}

/* ---------- Video MP4: botón de play grande y aviso si falta el archivo ---------- */
const video = $("#mi-video");
if (video) {
  const aviso = $("#video-aviso");
  const play = $("#video-play");
  const mostrarAviso = () => { aviso.hidden = false; play.hidden = true; };
  $("source", video).addEventListener("error", mostrarAviso);
  video.addEventListener("error", mostrarAviso);
  play.addEventListener("click", () => video.play());
  video.addEventListener("play", () => { play.hidden = true; });
  video.addEventListener("pause", () => { if (!video.ended) play.hidden = false; });
  video.addEventListener("ended", () => { play.hidden = false; });
}

/* ---------- Luz que sigue al mouse en el inicio ---------- */
const inicio = $("#inicio");
if (inicio && window.matchMedia("(hover: hover)").matches) {
  inicio.addEventListener("mousemove", (e) => {
    const r = inicio.getBoundingClientRect();
    inicio.style.setProperty("--mx", (e.clientX - r.left) + "px");
    inicio.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
}

/* ---------- Proyectos: foto flotante y un solo proyecto abierto a la vez ---------- */
const vista = $("#vista");
const proyectos = $$(".proy");
proyectos.forEach((d) => {
  const resumen = $("summary", d);
  d.addEventListener("toggle", () => {
    if (d.open) proyectos.forEach((o) => { if (o !== d) o.open = false; });
  });
  if (!vista) return;
  resumen.addEventListener("mouseenter", () => {
    vista.src = resumen.dataset.preview || "";
    vista.classList.add("activa");
  });
  resumen.addEventListener("mouseleave", () => vista.classList.remove("activa"));
  resumen.addEventListener("mousemove", (e) => {
    vista.style.transform = "translate(" + (e.clientX + 24) + "px, " + (e.clientY - 110) + "px)";
  });
});

/* ---------- Galería con visor ---------- */
const visor = $("#visor");
const fotos = $$(".galeria button");
let actual = 0;
function abrir(i) {
  actual = (i + fotos.length) % fotos.length;
  const img = $("img", fotos[actual]);
  $("#visor-img").src = img.src;
  $("#visor-img").alt = img.alt;
  $("#visor-pie").textContent = $("figcaption", fotos[actual].parentElement)?.textContent || "";
  if (!visor.open) visor.showModal();
}
fotos.forEach((b, i) => b.addEventListener("click", () => abrir(i)));
$("#visor-cerrar").addEventListener("click", () => visor.close());
$("#visor-ant").addEventListener("click", () => abrir(actual - 1));
$("#visor-sig").addEventListener("click", () => abrir(actual + 1));
visor.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });
document.addEventListener("keydown", (e) => {
  if (!visor.open) return;
  if (e.key === "ArrowLeft") abrir(actual - 1);
  if (e.key === "ArrowRight") abrir(actual + 1);
});


/* =====================================================
   MOVIMIENTO
   ===================================================== */
const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Aparecer al hacer scroll ---------- */
const revelar = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("ve");
    revelar.unobserve(e.target);
  });
}, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
$$("[data-rev]").forEach((el, i) => {
  el.style.transitionDelay = ((i % 3) * 90) + "ms";
  revelar.observe(el);
});
if (corazon) revelar.observe(corazon);

/* ---------- Contadores ---------- */
function contar(el) {
  const meta = +el.dataset.count, suf = el.dataset.suf || "";
  if (quieto) { el.textContent = meta + suf; return; }
  const t0 = performance.now(), dur = 1600;
  (function paso(t) {
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(meta * (1 - Math.pow(1 - p, 3))) + suf;
    if (p < 1) requestAnimationFrame(paso);
  })(t0);
}
const obsContar = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => { if (e.isIntersecting) { contar(e.target); obsContar.unobserve(e.target); } });
}, { threshold: 0.6 });
$$("[data-count]").forEach((el) => obsContar.observe(el));

/* ---------- Palabra que cambia en el inicio ---------- */
const rota = $("#rota");
if (rota && !quieto) {
  const palabras = ["emprendedor.", "líder.", "el del buen humor.", "amigo de mi gente."];
  let k = 0;
  setInterval(() => {
    rota.classList.add("sale");
    setTimeout(() => { k = (k + 1) % palabras.length; rota.textContent = palabras[k]; rota.classList.remove("sale"); }, 380);
  }, 2600);
}

/* ---------- Cinta: se duplica para que no tenga cortes ---------- */
$$(".cinta__pista").forEach((p) => p.appendChild(p.firstElementChild.cloneNode(true)));

/* ---------- Paralaje con el mouse en las fotos del inicio ---------- */
if (inicio && !quieto && window.matchMedia("(hover: hover)").matches) {
  inicio.addEventListener("mousemove", (e) => {
    const r = inicio.getBoundingClientRect();
    inicio.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    inicio.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  });
}

/* ---------- Scroll: barra de progreso, línea de tiempo y foto con paralaje ---------- */
const barra = $("#progreso");
const lista = $("#camino-lista");
const fotoHist = $(".historia__fotos .h1");
function alScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  barra.style.setProperty("--s", max > 0 ? (scrollY / max).toFixed(4) : 0);
  if (lista) {
    const r = lista.getBoundingClientRect();
    const p = (innerHeight * 0.6 - r.top) / r.height;
    lista.style.setProperty("--prog", Math.min(1, Math.max(0, p)).toFixed(3));
  }
  if (fotoHist && !quieto) {
    const r = fotoHist.parentElement.getBoundingClientRect();
    const centro = r.top + r.height / 2 - innerHeight / 2;
    fotoHist.style.setProperty("--pf", (centro * -0.08).toFixed(1) + "px");
  }
}
addEventListener("scroll", alScroll, { passive: true });
addEventListener("resize", alScroll);
alScroll();

/* ---------- Cursor circular que sigue al mouse ---------- */
const cursor = $("#cursor");
if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let x = 0, y = 0, cx = 0, cy = 0;
  addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; cursor.classList.add("visible"); });
  document.addEventListener("mouseleave", () => cursor.classList.remove("visible"));
  (function seguir() {
    cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
    cursor.style.transform = "translate(" + cx + "px," + cy + "px)";
    requestAnimationFrame(seguir);
  })();
  $$("a, button, summary, .pieza").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("grande"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("grande"));
  });
}
