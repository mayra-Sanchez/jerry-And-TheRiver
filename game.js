//                       G A M E

/* En este script se define el mapa como la matriz, las uvas, quesos, la actualización del mundo por cada frame, el funcionamiento de las vidas y los estados de Jerry.
*/

// Importamos libreria fl-extended 
const { append, cons, first, isEmpty, isList, length, rest, map } = require("fl-extended");

//--------------- Función dibujarMapa ------------------

/*Contrato: dibujarMapa: world, processing
Proposito: Dibuja el mapa segun el tipo de la celda
Propotipo:function dibujarMapa(world, processing) {
   {...}
}*/

function dibujarMapa(world, processing) {
  processing.background(0, 0, 0);
  forEach(world.matrix, (row, i) => {
    forEach(row, (cell, j) => {

      // Dibuja las paredes
      if (cell == mapa.pared) {
        processing.image(Muro, j * celdas, i * celdas, celdas, celdas);
      }

      // Dibuja las uvas
      if (cell == mapa.uva) {
        processing.image(Uva,
        j * celdas + celdas / 2 - 6,
        i * celdas + celdas / 2 - 6,
        12, 12);
      }

      // Dibuja los quesos
      if (cell == mapa.queso) {
        if (world.time % (framesPerSecond / 3) <= framesPerSecond / 6) {
          canvas.getContext("2d").drawImage($("#queso")[0], j * celdas + celdas / 2 - 11.5, i * celdas + celdas / 2 - 11.5, 23, 23);
        }
      }
    });
  });
}

// FUNCIONES AUXILIARES
//--------------- Función forEach --------------------
/*Contrato: forEach: lista, function, int
Prototipo: function forEach(l, f, index = 0) {
    {...}
}*/

function forEach(l, f, index = 0) {
  if (!isEmpty(l)) {
    f(first(l), index);
    forEach(rest(l), f, index + 1);
  }
}

//--------------- Función forEachWithReturn --------------------
/*Contrato: forEachWithReturn: lista, function, int
Proposito:
Prototipo:function forEachWithReturn(l, f, index = 0) {
    {...}
}*/

function forEachWithReturn(l, f, index = 0) {
  if (!isEmpty(l)) {
    let r = f(first(l), index);
    if (r) return r;
    return forEachWithReturn(rest(l), f, index + 1);
  }
}

// Jerry
const J = "p";

// Agua
const T1 = "t1";

// Uva
const U = 0;

// Espacio donde Jerry muere si pasa por ahí
const M = 4;

// Queso
const Q = 3;

// Mapa
const mapa = {
  size: {
    width: 888,
    height: 555,
  },
  pared: 1,
  camino: 2,
  uva: 0,
  queso: 3,
  nada: 4,
  jerry: "p"
};

// Tamaño en pixeles de cada celda
const celdas = 37;

// Determina el tamaño de los pasos de Jerry
const pasos = celdas / 16;

// El mundo se dibuja en 60 veces por segundo
const framesPerSecond = 60;
const processing = { RIGHT: 39, LEFT: 37, UP: 38, DOWN: 40 };

// Estados de Jerry cuando esta muerto, vivo (mientras come uvas) y cuando come quesos.
const EstadoJerry = { DEAD: 0, ALIVE: 1, SUPER: 2 };

// Muestra vidas y puntaje
const estadoJuego = document.getElementById("game-status");

// Tiempo de espera del mundo
const tiempoDePausa = 1;
play = false;

// PRINCIPAL
// Esto se llama antes de iniciar el juego
function sketchProc(processing) {

  // Se ejecuta una vez cuando se inicia el juego
  processing.setup = function () {

    // Se actualiza 60 veces por segundo
    processing.frameRate(framesPerSecond);

    // Tamaño del mapa
    processing.size(mapa.size.width, mapa.size.height);

    // Se importan las imagenes
    Uva = processing.loadImage("images/Uva.png");
    Queso = processing.loadImage("images/Queso.png");
    imagenJerry = processing.loadImage("images/Jerry.png");
    JerryArriba = processing.loadImage("images/JerryArriba.png");
    JerryAbajo = processing.loadImage("images/JerryAbajo.png");
    JerryIzquierda = processing.loadImage("images/JerryIzquierda.png");
    JerryDerecha = processing.loadImage("images/JerryDerecha.png");
    imagenAgua = processing.loadImage("images/Agua.jpg");
    Perdiste = processing.loadImage("images/Perdiste.jpg");
    Ganaste = processing.loadImage("images/Ganaste.jpg");
    Muro = processing.loadImage("images/Muro.jpg")

    // Estado inicial del juego 
    processing.state = {
      time: -framesPerSecond * tiempoDePausa - 1,
      jerry: {
        x: 0,
        y: 0,
        currentMovement: null,
        nextMove: null,
        lastDir: null,
        inputDir: null,
        estado: EstadoJerry.ALIVE,
        SUPER: 0
      },
      puntaje: 0,
      vidas: 3,
      matrix: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 3, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [M, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, J, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, M],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [4, 2, 2, 2, 2, 2, 2, T1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4]
      ],
      aqua1: {
        x: 0,
        y: 0,
        letra: T1
      },
      numUvas: null,
      numQuesos: null
    };

    // Enfocar el canvas al inicio
    document.getElementById("canvas").focus();
  };

  // Se ejecuta 60 veces por segundo.
  processing.draw = function () {
    if (play) {
      processing.state = processing.onTic(processing.state);
      processing.drawGame(processing.state);
    }
  };

  // Se dibujan a Jerry en diferentes posiciones dependiendo de la tecla que se pulse
  processing.drawGame = function (world) {

    dibujarMapa(world, processing);
    if (processing.keyCode == processing.UP) {
      dibujarJerryAnimado(JerryArriba, world, processing);
    } else if (processing.keyCode == processing.DOWN) {
      dibujarJerryAnimado(JerryAbajo, world, processing);
    } else if (processing.keyCode == processing.LEFT) {
      dibujarJerryAnimado(JerryIzquierda, world, processing);
    } else {
      dibujarJerryAnimado(JerryDerecha, world, processing);
    }
    dibujarAgua(world.aqua1, imagenAgua, world, processing);

    actualizarVidasPuntaje(world);

    // Muestra la imagen Ganaste cuando no hay mas uvas y quesos en el mapa.
    if (world.numUvas == 0) {
      processing.background(0, 0, 0);
      processing.image(Ganaste, 0, -54, 888, 626);
    }

    // Muestra la imagen Perdiste cuando se acaban las vidas.
    if (world.vidas == 0) {
      processing.background(0, 0, 0);
      processing.image(Perdiste, 0, -54, 888, 626);
    }

    // Pone vidas y puntaje en cero
    if (world.vidas == 0 || world.numUvas == 0) {
      $(estadoJuego).css("display", "none");
    }
  };

  // Actualiza el mundo en cada tic del reloj. Retorna el nuevo estado del mundo
  processing.onTic = function (world) {
    // Condicion de perder y condicion de ganar
    if (world.vidas == 0 || world.numUvas == 0)
      return world;

    // Cambia en el mundo el numero de uvas y aumenta el tiempo en 1
    if (world.time == -framesPerSecond * tiempoDePausa - 1)
      return Object.assign(world, { numUvas: contar(world.matrix) }, { time: world.time + 1 });

    // Inicializar los personajes del juego
    if (world.time == -framesPerSecond * tiempoDePausa) {
      return Object.assign(world,
        { time: world.time + 1, },
        {
          jerry: inicializarJerry(world),
          tsunami1: inicializarAqua(world, world.aqua1, T1)
        }
      );
    }

    // Tiempo de pausa
    if (world.time < 1)
      return Object.assign(world, { time: world.time + 1 });
    let [jerry, newWorld] = moverJerry(world.jerry, world);
    let aqua1 = agua(world.aqua1, world);

    // Duracion del estado SUPER de Jerry
    if (world.jerry.estado == EstadoJerry.SUPER && world.time > world.jerry.super + framesPerSecond * 5)
      jerry.estado = EstadoJerry.ALIVE;
    return Object.assign(world, newWorld, { time: world.time + 1 });
  };

  // Actualiza el mundo cada vez que se oprime una tecla. Retorna el nuevo estado del mundo
  processing.onKeyEvent = function (world, keyCode) {
    let jerry = world.jerry;
    switch (keyCode) {
      case processing.UP:
        return Object.assign(world, { jerry: Object.assign(jerry, { inputDir: processing.UP }) });
      case processing.DOWN:
        return Object.assign(world, { jerry: Object.assign(jerry, { inputDir: processing.DOWN }) });
      case processing.LEFT:
        return Object.assign(world, { jerry: Object.assign(jerry, { inputDir: processing.LEFT }) });
      case processing.RIGHT:
        return Object.assign(world, { jerry: Object.assign(jerry, { inputDir: processing.RIGHT }) });
      default:
        return world;
    }
  };

  // Esta función se ejecuta cada vez que presionamos una tecla.
  processing.keyPressed = function () {
    processing.state = processing.onKeyEvent(processing.state, processing.keyCode);
  };
}

var canvas = document.getElementById("canvas");
var processingInstance = new Processing(canvas, sketchProc);

// FUNCIONES AUXILIARES
/*Contrato: actualizarVidasPuntaje: world
Proposito: Imprime en pantalla los valores de vida y puntaje del ratón
Prototipo: function actualizarVidasPuntaje(world) {
 {...}
}*/

function actualizarVidasPuntaje(world) {
  $(estadoJuego).find("#vidas").html(world.vidas);
  $(estadoJuego).find("#puntaje").html(world.puntaje);
}