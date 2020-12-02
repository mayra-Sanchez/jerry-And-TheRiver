//                       F R U T  &  C H E E S E

/*
En este Script se van a tener las funciones de las uvas y los quesos que va comer jerry en todo el mapa.
*/

//-----------------Funcón uvas ------------------

/*Contrato: uvas: world, int -> world
Prososito: Si la posicion en la que se encuentra el ratón en la matriz es igual a mapa.uva (0), cambia el valor por mapa.camino (2), cuando se ejecuta la funcion se aumenta en 1 el puntaje.
Prototipo:function uvas(world, pos) {
 {...}
}*/

function uvas(world, pos) {
  return Object.assign(world,
    { matrix: granCopia(world.matrix, pos, mapa.camino) },
    { puntaje: world.puntaje + 1 },
    { numUvas: world.numUvas - 1 }
  );
}

//-----------------Funcón quesos ------------------
/*Contrato: quesos: world, int -> world
Prososito: Si la posicion en la que se encuentra el ratón en la matriz es igual a mapa.quesos (0), cambia el valor por mapa.camino (2), cuando se ejecuta la funcion se aumenta en 1 el puntaje.
Prototipo:function quesos(world, pos) {
 {...}
}*/

function quesos(world, pos) {
  return Object.assign(world,
    { matrix: granCopia(world.matrix, pos, mapa.camino) },
    { puntaje: world.puntaje + 100 },
    {numQuesos: world.numQuesos - 1 }
  );
}

// ---------------- Función  contar -----------------
/*Contrato: contar: matrix -> int
Prototipo: Recorre la matrix y cuenta la cantidad de uvas (0) que hay.
Prototipo: function contar(matrix) {
 {...}
}*/

function contar(matrix) {
  return igualdad(matrix, mapa.uva);
}

// FUNCIONES AUXILIARES

// ---------------- Función  granCopia -----------------
/*Contrato: granCopia: lista, object, number -> matix
Prososito: Realiza una copia profunda de la matrix, sirve para una lista de listas
Prototipo: function granCopia(lista, pos, val) {
 {...}
}*/

function granCopia(lista, pos, val) {
  if (length(lista) == 0) {
    return [];
     // El elemento es una lista
  }if (isList(first(lista))) {
    if (pos.fil == 0) {
      var listaNueva = cambioValor(first(lista), val, pos.col);
    } else {
      var listaNueva = first(lista);
    }
    return cons(granCopia(listaNueva, pos, val), granCopia(rest(lista), { fil: pos.fil - 1, col: pos.col }, val));
  } else { 

    // El primer elemento no es una lista isList(first([1,2]))
    return cons(first(lista), granCopia(rest(lista), pos, val));
  }
}

// ---------------- Función  verificar -----------------
/*Contrato: verificar: lista, num, num -> bool
Prososito: Verificar si se puede reemplazar un numero x en la posicion n de una lista
Prototipo:function verificar(lista, x, n) {
 {...}
}*/

function verificar(lista, x, n) {
  if (length(lista) > n && n >= 0) {
    return true;
  }else {
    return false;
  }
}
// ---------------- Función  cambioValor ---------------

/*Contrato: cambioValor: lista, num, num -> lista
Proposito: Cambiar  un valor por x en la posicion n de una lista
Prototipo: function cambioValor(lista, x, n) {
  {...}
}*/

function cambioValor(lista, x, n) {
  if (verificar(lista, x, n) == true && n == 0) {
    return cons(x, rest(lista))
  }else if (verificar(lista, x, n)) {
    return cons(first(lista), cambioValor(rest(lista), x, n - 1));
  }else {
    return lista;
  }
}

// ---------------- Función  bidixuni ---------------

/*Contrato: bidixuni: lista -> lista
Proposito: Vuelve una lista bidimensional [[0],[0]] una lista unidimensional [0,0]
Prototipo:function bidixuni(lista) {
  {...}
}*/

function bidixuni(lista) {
  if (length(lista) == 1)
    return first(lista)
  else
    return append(first(lista), bidixuni(rest(lista)))
}

// -------------- Función igualdad  -------------

/*Contrato: igualdad: lista, num -> lista
Proposito: Crea una lista con todos los valores que hayan iguales al parametro val en la lista
Prototipo: function igualdad(lista, val) {
  {...}
}*/

function igualdad(lista, val) {
  let unidi = bidixuni(lista);
  let filtro = filtrador(unidi, (a) => a == val);
  return length(filtro);
}

// -------------- Función filtrador -------------

/*Contrato: filtrador: lista, funcion -> lista
Proposito: Filtra los elementos de una lista 
Prototipo: function filtrador(list, f) {
  {...}
}*/

function filtrador(list, f) {
  if (isEmpty(list)) {
    return [];
  }
  else {
    const resta = filtrador(rest(list), f);
    if (f(first(list))) {
      return cons(first(list), resta)
    }
    else {
      return resta
    }
  }
}