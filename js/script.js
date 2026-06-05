// ============================================================
// script.js — JavaScript del sitio del III Congreso
// Funciones: validación de formularios, localStorage y redirección
// ============================================================

// Nombre de la clave donde se guardan todos los registros en localStorage
var CLAVE_REGISTROS = "registrosCongreso";

// Mensaje de confirmación al cargar cualquier página del sitio
console.log("Página cargada correctamente");

// --- FUNCIONES PARA localStorage ---

/**
 * Lee los registros guardados y los devuelve como arreglo.
 * Si no hay datos previos, devuelve un arreglo vacío [].
 */
function obtenerRegistrosGuardados() {
    var datosJson = localStorage.getItem(CLAVE_REGISTROS);

    if (datosJson) {
        return JSON.parse(datosJson);
    }

    return [];
}

/**
 * Agrega un nuevo registro al arreglo y lo guarda en localStorage.
 * localStorage solo funciona en el navegador donde se llenó el formulario.
 */
function guardarRegistro(registro) {
    var registros = obtenerRegistrosGuardados();
    registros.push(registro);
    localStorage.setItem(CLAVE_REGISTROS, JSON.stringify(registros));
}

/**
 * Crea la fecha y hora actual en formato: AAAA-MM-DD HH:MM
 * Ejemplo: 2026-06-05 10:30
 */
function obtenerFechaRegistro() {
    var ahora = new Date();

    var anio = ahora.getFullYear();
    var mes = String(ahora.getMonth() + 1).padStart(2, "0");
    var dia = String(ahora.getDate()).padStart(2, "0");
    var horas = String(ahora.getHours()).padStart(2, "0");
    var minutos = String(ahora.getMinutes()).padStart(2, "0");

    return anio + "-" + mes + "-" + dia + " " + horas + ":" + minutos;
}

/**
 * Convierte data-origen en un tipo de registro legible.
 * Ejemplo: "registro-publicacion-formulario.html" → "registro-publicacion"
 */
function obtenerTipoRegistro(dataOrigen) {
    if (!dataOrigen) {
        return "desconocido";
    }

    return dataOrigen.replace("-formulario.html", "");
}

/**
 * Lee los campos del formulario con FormData y los convierte en un objeto.
 * Los archivos no se pueden guardar en localStorage; solo se guarda el nombre.
 */
function crearObjetoRegistro(formulario, tipoRegistro) {
    var datosFormulario = new FormData(formulario);

    // Objeto base con la información del tipo y la fecha
    var registro = {
        tipoRegistro: tipoRegistro,
        fechaRegistro: obtenerFechaRegistro()
    };

    // Recorremos cada campo del formulario (solo los que tienen atributo name)
    datosFormulario.forEach(function (valor, nombreCampo) {

        // Si el campo es un archivo, guardamos solo su nombre
        if (valor instanceof File) {
            registro[nombreCampo] = valor.name;
        } else {
            registro[nombreCampo] = valor;
        }
    });

    return registro;
}

// Esperamos a que el HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    // --- FORMULARIOS DE REGISTRO ---
    // Buscamos todos los formularios con la clase "formulario"
    var formularios = document.querySelectorAll(".formulario");

    formularios.forEach(function (formulario) {

        // Evento que se ejecuta al presionar "Enviar"
        formulario.addEventListener("submit", function (evento) {

            // Evitamos que el navegador envíe el formulario a un servidor
            evento.preventDefault();

            // checkValidity() revisa las reglas HTML5 (required, email, etc.)
            if (!formulario.checkValidity()) {
                // Si hay errores, el navegador muestra los mensajes nativos
                formulario.reportValidity();
                return;
            }

            // Leemos la página de origen desde el atributo data-origen
            var paginaOrigen = formulario.getAttribute("data-origen");
            var tipoRegistro = obtenerTipoRegistro(paginaOrigen);

            // Creamos el objeto con todos los datos del formulario
            var registro = crearObjetoRegistro(formulario, tipoRegistro);

            // Guardamos en localStorage antes de redirigir
            guardarRegistro(registro);

            console.log("Registro guardado en localStorage:", registro);

            // Redirigimos a exito.html solo después de guardar
            window.location.href = "exito.html?origen=" + paginaOrigen;
        });
    });

    // --- BOTÓN EN exito.html ---
    // Configura "Realizar nuevo registro" para volver al formulario correcto
    var btnNuevoRegistro = document.getElementById("btn-nuevo-registro");

    if (btnNuevoRegistro) {

        // URLSearchParams lee los parámetros de la URL (?origen=...)
        var parametros = new URLSearchParams(window.location.search);
        var origen = parametros.get("origen");

        if (origen) {
            btnNuevoRegistro.href = origen;
        } else {
            // Si no hay parámetro, regresa al inicio
            btnNuevoRegistro.href = "index.html";
        }
    }

});
