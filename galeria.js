const galeria = document.querySelector(".collage");
const ventana = document.querySelector("#ventana-recuerdo");
const fotoAmpliada = document.querySelector(".foto-ampliada");
const fraseAmpliada = document.querySelector(".frase-ampliada");
const botonCerrar = document.querySelector(".cerrar-ventana");
const vistaCarta = document.querySelector("#vista-carta");
const vistaCollage = document.querySelector("#vista-collage");
const botonMostrarCollage = document.querySelector("#mostrar-collage");
const botonVolverCarta = document.querySelector("#volver-carta");
let fotoSeleccionada = null;
let cambiandoVista = false;

galeria.addEventListener("click", (evento) => {
  const botonFoto = evento.target.closest(".foto-recuerdo");
  if (!botonFoto) return;

  fotoSeleccionada = botonFoto;
  fotoAmpliada.src = botonFoto.dataset.foto;
  fotoAmpliada.alt = botonFoto.dataset.alt;
  fraseAmpliada.textContent = botonFoto.dataset.frase;
  ventana.showModal();
});

botonCerrar.addEventListener("click", () => {
  ventana.close();
});

ventana.addEventListener("click", (evento) => {
  if (evento.target === ventana) ventana.close();
});

ventana.addEventListener("close", () => {
  fotoSeleccionada?.focus();
});

async function mostrarVista(vista) {
  if (cambiandoVista) return false;

  const vistaActual = vista === vistaCarta ? vistaCollage : vistaCarta;
  if (vista.hidden === false) return false;

  cambiandoVista = true;
  botonMostrarCollage.disabled = true;
  botonVolverCarta.disabled = true;
  const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!movimientoReducido) {
    vistaActual.classList.add("vista-saliendo");
    await new Promise((resolve) => window.setTimeout(resolve, 220));
  }

  vistaActual.hidden = true;
  vistaActual.classList.remove("vista-saliendo", "vista-entrando");
  vista.hidden = false;
  vista.classList.remove("vista-entrando");
  void vista.offsetWidth;
  vista.classList.add("vista-entrando");
  window.scrollTo({ top: 0, behavior: movimientoReducido ? "auto" : "smooth" });

  if (!movimientoReducido) {
    await new Promise((resolve) => window.setTimeout(resolve, 500));
  }

  vista.classList.remove("vista-entrando");
  botonMostrarCollage.disabled = false;
  botonVolverCarta.disabled = false;
  cambiandoVista = false;
  return true;
}

botonMostrarCollage.addEventListener("click", async () => {
  if (await mostrarVista(vistaCollage)) {
    document.querySelector("#titulo-recuerdos").focus();
  }
});

botonVolverCarta.addEventListener("click", async () => {
  if (await mostrarVista(vistaCarta)) botonMostrarCollage.focus();
});
