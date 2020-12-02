//                             J E R R Y

/*En este Script se van a crear 9 funciones las cuales van a hacer que el ratón se mueva en el mapa y tenga animación.
*/

//------------ Función inicializarJerry ----------------

/*Contrato: inicializarJerry: world -> jerry
Proposito: Posiciona a jerry donde haya una "P" en la matrix
Prototipo: function inicializarJerry(world) {
    {...}
}*/

function inicializarJerry(world) {
  return forEachWithReturn(world.matrix, (row, i) => {
    return forEachWithReturn(row, (cell, j) => {
      if (cell == mapa.jerry)
        return Object.assign(world.jerry,
          { x: j * celdas },
          { y: i * celdas }
        );
    });
  });
}

//----------- Función moverJerry -------
/*
Contrato: moverJerry: jerry(object), world(object), aqua 
Proposito: Muestra la nueva posicion y el nuevo estado en el que se encuentra el ratón jerry 
Proposito:function moverJerry(jerry, world, aqua) {
  {...}
}*/

function moverJerry(jerry, world, aqua) {
  let pos = {
    fil: Math.round10((jerry.y) / celdas, -10),
    col: Math.round10((jerry.x) / celdas, -10)
  }

  // Verifica si se encuentra con agua y si lo hace le resta 1 vida
  if (jerrySeEncuentraConAqua(jerry, [world.tsunami1], world)){
    jerry.estado = EstadoJerry.ALIVE;
    return [jerry, Object.assign(world, { time: -framesPerSecond * tiempoDePausa - 1 }, { vidas: world.vidas - 1 })];
  }

    // Verifica si jerry se encuentra en un centro
    if (isInteger(pos.fil) && isInteger(pos.col)) {
      // Comer uva
      if (world.matrix[pos.fil][pos.col] == mapa.uva) {
        let newWorld = uvas(world, pos);
        return [moverJerry(jerry, newWorld)[0], newWorld];
    }

    // Cuando Jerry se come un queso, entra en estado SUPER.
    if (world.matrix[pos.fil][pos.col] == mapa.queso) { 
      let newWorld = quesos(world, pos);
      return [moverJerry(Object.assign(jerry, { estado: EstadoJerry.SUPER, super: world.time }), newWorld)[0], newWorld];
    }

// Se choca contra un muro invisible
    if (world.matrix[pos.fil][pos.col] == mapa.nada) { 
      jerry.estado = EstadoJerry.ALIVE;
      return [jerry, Object.assign(world, { time: -framesPerSecond * tiempoDePausa - 1 }, { vidas: world.vidas - 1 })];
    }
  }

  // Si hay una tecla entrante 
  if (jerry.inputDir)
    return [moverJerry(Object.assign(jerry, { nextMove: jerry.inputDir, inputDir: null }), world)[0], world];

  // Si jerry se va a mover
  if (jerry.nextMove)
    // Si esta en un centro
    if (isInteger(pos.fil) && isInteger(pos.col))
      // Si no hay pared
      if (nextPosition(world.matrix, pos, jerry.nextMove) != mapa.pared) 
        return [mover(Object.assign(jerry, { lastDir: jerry.nextMove, currentMovement: jerry.nextMove, nextMove: null })), world];

  // Si jerry se esta moviendo
  if (jerry.currentMovement)
    // SI está en un centro
    if (isInteger(pos.fil) && isInteger(pos.col))
      // Si hay pared
      if (nextPosition(world.matrix, pos, jerry.currentMovement) == mapa.pared)
        return [Object.assign(jerry, { currentMovement: null }), world];

  // Mover a jerry en la direccion actual
  return [mover(jerry), world]; 
 
}

//----------- Función mover -------
/*Contrato: mover: personaje
Proposito: Cambia la posicion de jerry de acuerdo a la dirección dada
Prototipo: function mover(personaje) {
{...}
}*/

function mover(personaje) {
  // Mover el personaje un step
  if (personaje.currentMovement == processing.UP)
    return Object.assign(personaje, { y: personaje.y - pasos * 2 });
  if (personaje.currentMovement == processing.LEFT)
    return Object.assign(personaje, { x: personaje.x - pasos * 2 });
  if (personaje.currentMovement == processing.DOWN)
    return Object.assign(personaje, { y: personaje.y + pasos * 2 });
  if (personaje.currentMovement == processing.RIGHT)
    return Object.assign(personaje, { x: personaje.x + pasos * 2 });
  if (personaje.currentMovement == null)
    return personaje;
}

//----------- Función nextPosition -------
/*Contrato: nextPosition: matrix, pos, direccion
Proposito: Teniendo en cuenta la dirección dada, jerry se posiciona en la siguiente celda
Prototipo: function nextPosition(matrix, pos, direccion) {
  {...}
}*/

function nextPosition(matrix, pos, direccion) {
  // Se mueve una celda a la derecha
  if (direccion == processing.RIGHT)
    return matrix[pos.fil][pos.col + 1];

  // Se mueve una celda a la izquierda
  if (direccion == processing.LEFT)
    return matrix[pos.fil][pos.col - 1];

  // Se mueve una celda hacia arriba
  if (direccion == processing.UP)
  
    return matrix[pos.fil - 1][pos.col];

  // Se mueve una celda hacia abajo
  if (direccion == processing.DOWN)
  
    return matrix[pos.fil + 1][pos.col];
}

//----------- Función jerrySeEncuentraConAqua -------
/* Contrato: jerrySeEncuentraConAqua: jerry, list, world ->bool
Proposito: Determinar si jerry se ha encontrado con aqua en el mapa
Prototipo: function  jerrySeEncuentraConAqua(jerry, listaAqua, world) {
  {...}
} */

function  jerrySeEncuentraConAqua(jerry, listaAqua, world) {
  if (length(listaAqua) == 0)
    return false;
  let aqua = first(listaAqua);
  if (JerryEnAgua(jerry, aqua, world)) {
    // Si Jerry está en estado SUPER y toca el agua bajando, se reinicia el agua y Jerry
    if (jerry.estado == EstadoJerry.SUPER) {
      inicializarAqua(world, aqua, aqua.letra);
      return true;
    }
    return true;
  }
  else
    return jerrySeEncuentraConAqua(jerry, rest(listaAqua), world);
}

// ANIMACIÓN

//----------- Función dibujarJerryAnimado -------
/*Contrato: dibujarJerryAnimado: imagen, world, processing -> jerry
Proposito: Dibuja a Jerry en el mapa (matriz) 
Prototipo: function dibujarJerryAnimado(imagen, world, processing) {
  {...}
}*/

function dibujarJerryAnimado(imagen, world, processing) {
  let jerry = world.jerry;
  
  canvas.getContext("2d").globalAlpha = 0.8;
  processing.image(imagen, jerry.x, jerry.y, celdas, celdas);
}

// FUNCIONES AUXILIARES

//----------- Función JerryEnAgua -------
/*Contrato: JerryEnAgua: punto, aqua, world -> bool
Proposito: Determinar si un punto (jerry) esta contenido en un cuadrado (aqua)
Prototipo: function JerryEnAgua(punto, aqua, world) {
  {...}
}*/

function JerryEnAgua(punto, aqua, world) {
  let dentroDeX = punto.x >= aqua.x * -1 && punto.x <= (aqua.x * -1 + celdas * 70);
  let dentroDeY = punto.y >= aqua.y && punto.y <= (aqua.y + celdas * 13);

  if (dentroDeX && dentroDeY)
    return true;
  else
    return false;
}

//----------- Función radianes -------
/*Contrato: radianes: num -> num
Proposito: Toma como parametro una ángulo (45) y da como salida un radian (PI/4)
Prototipo: function radianes(angulo) {
  {...}
}*/

function radianes(angulo) {
  return angulo * (Math.PI / 180);
}

//----------- Función isInteger -------
/* 
 Contrato:  isInteger: value
*/

function isInteger(value) {
  return (
    typeof value === "number" && isFinite(value) && Math.floor(value) === value
  );
}

//----------- Función ajusteDecimal -------
/*Contrato: ajusteDecimal: String, num, int -> num
Proposito: Ajuste decimal de un número.
Prototipo: function ajusteDecimal(type, value, exp) {
 {...}
}*/

function ajusteDecimal(type, value, exp) {
  // Si el exp es indefinido o cero
  if (typeof exp === "undefined" || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;

  // Si el valor no es un número o el exp no es un entero
  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
    return NaN;
  }

  // Cambio
  value = value.toString().split("e");
  value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));

  // Volver a cambiar
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
}

if (!Math.round10) {
  Math.round10 = function (value, exp) {
    return ajusteDecimal("round", value, exp);
  };
}