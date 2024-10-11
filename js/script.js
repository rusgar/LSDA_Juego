/* ;(function() { */
    /* 'use strict' */


let palabras = JSON.parse(localStorage.getItem('palabras')) || ['frodo', 'sauron', 'gandalf', 'aragon', 'elrond', 'legolas', 'galadriel', 'balrog',
     'golum', 'gimli', 'bilbo', 'samsagaz', 'nazgul', 'boromir', 'eomer', 'faramir'];

//agregar palabras a la lista
function focus() {
    let input = document.getElementById("input-texto");
    input.focus();
}

function value() {
    let input = document.getElementById("input-texto");
    input.value = "";
}

function seleccionarPersonaje(personaje) {
    personajeSeleccionado = personaje; // Actualiza la variable global
    localStorage.setItem('personajeSeleccionado', personaje); // Guarda la selección en localStorage
 alert(`Tu aventura comieza con el ${personaje}`); // Mensaje opcional para el usuario   
}
function agregar_palabra() {
    let input = document.getElementById('input-texto').value;
    
    if (/[^a-zñ]/.test(input)) {
        Swal.fire({
            icon: 'error',
            iconColor: '#4A5E60',
            background: '#E3E0DE',
            title: 'Oops...',
            showConfirmButton: false,
            text: 'Solo se permiten letras minusculas y sin acento ,recuerdalo por el poder del anillo',
          })
        focus();
    }

    else if (input.length === 0) {
        Swal.fire({
            icon: 'error',
            iconColor: '#4A5E60',
            background: '#E3E0DE',
            title: 'Oops...',
            confirmButtonColor: '#4A5E60',
            text: 'El campo de texto está vacio, escriba una palabra, no valen las compuestas',
          })
        focus();
    }

    else {
        palabras.push(input)
        localStorage.setItem('palabras', JSON.stringify(palabras));
        Swal.fire({
            icon: 'success',
            iconColor: '#4A5E60',
            background: '#E3E0DE',
            title: '¡Bien! has concluido la palabra',
            confirmButtonColor: '#4A5E60',
            text: 'Diccionario completo',
        })

        value()
    }
}

//almacenar la configuración actual
let juego = null
//por si ya se envió alguna alerta
let finalizado = false

let $html = {
    personaje: document.getElementById('elfo-juego'),
    adivinado: document.querySelector('.contenedor-acertadas'),
    errado: document.querySelector('.contenedor-erradas')
}

// Variables globales
let personajeSeleccionado = localStorage.getItem('personajeSeleccionado') || 'ELFO'; // Valor por defecto

function ajustarEstiloPersonaje() {
    let $elemento = $html.personaje;

    // Ajustar tamaño y margen según el personaje seleccionado
    if (personajeSeleccionado === 'ELFO') {
        $elemento.style.width = '212px';
        $elemento.style.margin = '54px -300px';
    } else if (personajeSeleccionado === 'MAGO') {
        $elemento.style.width = '260px';
        $elemento.style.margin = '54px -317px';
    } else if (personajeSeleccionado === 'ORCO') {
        $elemento.style.width = '309px';
        $elemento.style.margin = '58px -355px';
    }
}
function dibujar(juego) {
    // Actualizar la imagen del personaje según el personaje seleccionado
    let $elemento = $html.personaje;
    let estado = juego.estado;

    // Controlar el estado del personaje
    if (estado === 8) {
        estado = juego.previo;
    }

    // Cambiar la ruta de la imagen según el personaje
    if (personajeSeleccionado === 'ELFO') {
        $elemento.src = './image/estado-elfo/0' + estado + '.png';
    } else if (personajeSeleccionado === 'MAGO') {
        $elemento.src = './image/estado-mago/0' + estado + '.png'; // Cambia según la estructura de tus imágenes
    } else if (personajeSeleccionado === 'ORCO') {
        $elemento.src = './image/estado-orco/0' + estado + '.png'; // Cambia según la estructura de tus imágenes
    }

    ajustarEstiloPersonaje();
    // Creamos las letras adivinadas
    let palabra = juego.palabra;
    let adivinado = juego.adivinado;
    $elemento = $html.adivinado;

    // Borramos los elementos anteriores
    $elemento.innerHTML = '';

    for (let letra of palabra) {
        let $span = document.createElement('span');
        let $texto = document.createTextNode('');

        if (adivinado.indexOf(letra) >= 0) {
            $texto.nodeValue = letra;
        }

        $span.setAttribute('class', 'span-acertado');
        $span.appendChild($texto);
        $elemento.appendChild($span);
    }

    // Creamos las letras erradas
    let errado = juego.errado;
    $elemento = $html.errado;

    // Borramos los elementos anteriores
    $elemento.innerHTML = '';

    for (let letra of errado) {
        let $span = document.createElement('span');
        let $texto = document.createTextNode(letra);

        $span.setAttribute('class', 'span-errado');
        $span.appendChild($texto);
        $elemento.appendChild($span);
    }
}


function adivinar(juego, letra) {
    let estado = juego.estado

    //si se ha perdido o ganado, no hay que hacer nada
    if (estado === 1 || estado === 8) {
        return
    }

    let adivinado = juego.adivinado
    let errado = juego.errado

    //si ya hemos errado o adivinado la letra, no hay que hacer nada
    if (adivinado.indexOf(letra) >= 0 || errado.indexOf(letra) >= 0) {
        return
    }

    var palabra = juego.palabra

    //sie es letra de la palabra
    if (palabra.indexOf(letra) >= 0) {
        let ganado = true

        //ver si llegamos al estado ganado
        for (let l of palabra) {
            if (adivinado.indexOf(l) < 0 && l != letra) {
                ganado = false
                juego.previo = juego.estado
                break
            }
        }

        //si ya se ha ganado, indicarlo
        if (ganado) {
            juego.estado = 8
        }

        //agregamos a la lista de letras adivinadas
        adivinado.push(letra)
    }

    //si no es letra de la palabra, se acerca el personaje a la horca
    else {
        juego.estado--

        //agregamos a la lista de letras erradas
        errado.push(letra)
    }
}

window.onkeydown = function adivinarLetra(e) {
    let letra = e.key

    if (/[^a-zñ]/.test(letra)) {
        return
    }

    adivinar(juego, letra)
    let estado = juego.estado

    if (estado === 8 && !finalizado) {
        setTimeout(alerta_ganado, 500)
        finalizado = true
    }

    else if (estado === 1 && !finalizado) {
        let palabra = juego.palabra
        let fn = alerta_perdido.bind(undefined, palabra)
        setTimeout(fn, 500)
        finalizado = true
    }

    dibujar(juego)
}

window.nuevoJuego = function nuevoJuego() {
    let palabra = palabra_aleatoria()
    juego = {}
    juego.palabra = palabra
    juego.estado = 7
    juego.adivinado = []
    juego.errado = []
    finalizado = false
    dibujar(juego)
    /* console.log(juego) */
}

function palabra_aleatoria() {
    let index = ~~(Math.random() * palabras.length)
    return palabras[index]
}

function alerta_ganado() {
    Swal.fire({
        title: '¡Felicidades, salvaste la Tierra Media!',
        width: 280,
        padding: '2rem',
        color: '#D9D9D9',
        background: '#4A5E60',
        imageUrl: './image/banderola_Gondor.png',
        imageHeight: 250,
        confirmButtonColor: '#192323',
        allowEnterKey: true,
        backdrop: `
            rgba(115,115,115,0.6)`
    })
}

function alerta_perdido(palabra) {
    Swal.fire({
        title: 'Perdiste',
        text: 'La palabra era: ' + palabra,
        width: 300,
        padding: '2rem',
        color: '#D9D9D9',
        background: '#4A5E60',
        imageUrl: './image/perdiste.png',
        imageHeight: 250,
        confirmButtonColor: '#192323',
        allowEnterKey: true,
        backdrop: `
            rgba(115,115,115,0.6)`
    })
}

nuevoJuego()

/* }()) */