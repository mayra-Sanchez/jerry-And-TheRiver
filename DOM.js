//                       D O M
/*
Este script es conocido como Document Object Model a lo que traduce en sencillas palabras a los nodos que tiene cada archivo HTML.

DOM es una API de JavaScript para HTML. Recorrer etiquetas, guardarlas en variables, etc.
*/

const botonJugar = document.getElementById("boton_jugar"),
  botonInstrucciones = document.getElementById("boton_instrucciones"),
  botonIntegrantes = document.getElementById("boton_integrantes"),
  botonCerrarJuego = document.getElementById("back-juego"),
  botonCerrarInstrucciones = document.getElementById("back-instrucciones"),
  botonCerrarIntegrantes = document.getElementById("back-integrantes"),
  boton_play_musica = document.getElementById("boton_play"),
  boton_pause_musica = document.getElementById("boton_pause"),
  canvasGame = document.getElementById("canvas-container"),
  contenedorInstrucciones = document.getElementById("instrucciones"),
  contenedorIntegrantes = document.getElementById("integrantes")

var musica = new Audio("Música.mp3");
musica.volume = 0.1;

boton_play_musica.addEventListener("click", () => {
  boton_play_musica.classList.add("hide")
  boton_pause_musica.classList.remove("hide")
  boton_pause_musica.style.display="block"
  musica.play();
})

boton_pause_musica.addEventListener("click", () => {
    boton_pause_musica.style.display="none"

  boton_pause_musica.classList.add("hide")
  boton_play_musica.classList.remove("hide")
  musica.pause();
})

botonJugar.addEventListener("click", () => {
  botonJugar.classList.add("hide")
  botonInstrucciones.classList.add("hide")
  botonIntegrantes.classList.add("hide")
  canvasGame.classList.toggle("show")
  document.getElementById("canvas").focus()
  play = true;
})

botonInstrucciones.addEventListener("click", () => {
  botonJugar.classList.add("hide")
  botonInstrucciones.classList.add("hide")
  botonIntegrantes.classList.add("hide")
  contenedorInstrucciones.classList.toggle("show")
})

botonIntegrantes.addEventListener("click", () => {
  botonJugar.classList.add("hide")
  botonInstrucciones.classList.add("hide")
  botonIntegrantes.classList.add("hide")
  contenedorIntegrantes.classList.toggle("show")
})

botonCerrarJuego.addEventListener("click", () => {
  location.reload()
})

botonCerrarInstrucciones.addEventListener("click", () => {
  botonJugar.classList.remove("hide")
  botonInstrucciones.classList.remove("hide")
  botonIntegrantes.classList.remove("hide")
  contenedorInstrucciones.classList.remove("show")
})

botonCerrarIntegrantes.addEventListener("click", () => {
  botonJugar.classList.remove("hide")
  botonInstrucciones.classList.remove("hide")
  botonIntegrantes.classList.remove("hide")
  contenedorIntegrantes.classList.remove("show")
})