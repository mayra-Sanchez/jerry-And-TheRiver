//                          A G U A 

/*
En este Script se van a crear dos funciones las cuales harán que funcione el agua dentro del mapa del juego.
*/

//--------- Función inicializarAqua -----------------
/*Contrato: inicializarAqua: world, aqua, letra
Proposito: Posiciona el agua en la matrix
Prototipo: function inicializarAqua(world, aqua, letra) {
    {...}   
}*/

function inicializarAqua(world, aqua, letra) {
  return forEachWithReturn(world.matrix, (row, i) => {
    return forEachWithReturn(row, (cell, j) => {
      if (cell == letra)
        return Object.assign(aqua,
          { x: j * celdas },
          { y: i * celdas },
          { estado: EstadoJerry.Alive }
        );
    });
  });
}

//------------ Función Agua -------------
/*Contrato: agua: object, object -> object
Proposito: Mueve el agua a través del mapa en una misma direcion
Prototipo: function agua(aqua, world) {
  {...}
}*/

function agua(aqua, world) {
  // Convierte a entero la posicion del agua en filas y columnas
  let posicion = {
    fila: Math.round10(aqua.y / celdas, -10),  
    column: Math.round10(aqua.x / celdas, -10)   
  }

  // Convierte a entero la posicion de Jerry en filas y columnas
  let JerryPos = { 
    fila: Math.round10((world.jerry.y - celdas / 2) / celdas, -10), 
    column: Math.round10((world.jerry.x - celdas / 2) / celdas, -10) 
  }

  // Velocidad con que baja el agua
  if(world.jerry.estado == EstadoJerry.SUPER) {
     return Object.assign(aqua, { y: aqua.y + pasos / 60 }); 
  }

  // velocidad con que sube el agua
  return Object.assign(aqua, { y: aqua.y - pasos / 9 }); 
}

//----------- Función dibujarAgua -------
/*Contrato: dibujarAgua: aqua, imagen, world, processing -> null
Proposito: Dibuja un agua
Prototipo: function dibujarAgua(aqua, imagen, world, processing) {
  {...}
}*/

function dibujarAgua(aqua, imagen, world, processing) {
  processing.image(imagenAgua, aqua.x * -1, aqua.y, celdas * 70, celdas * 13);
}