// ============================================================
// script.js — JavaScript del sitio del III Congreso
// Funciones: validación de formularios, localStorage y redirección
// ============================================================

// Nombre de la clave donde se guardan todos los registros en localStorage
var CLAVE_REGISTROS = "registrosCongreso";

// Etiquetas amigables para mostrar los nombres de los campos en exito.html
var ETIQUETAS_CAMPOS = {
    tipoRegistro: "Tipo de registro",
    fechaRegistro: "Fecha de registro",
    idRegistro: "ID de registro",
    nombre: "Nombre",
    email: "Correo electrónico",
    correo: "Correo electrónico",
    telefono: "Teléfono",
    institucion: "Institución",
    "tipo-participacion": "Tipo de participación",
    "tipo-asistente": "Tipo de asistente",
    titulo: "Título del trabajo",
    area: "Área temática",
    modalidad: "Modalidad",
    "archivo-resumen": "Archivo de resumen",
    "archivo-extenso": "Archivo de artículo en extenso",
    comentarios: "Comentarios"
};

// Valores amigables para opciones de select y tipos de registro
var VALORES_AMIGABLES = {
    "registro-publicacion": "Registro con publicación",
    "registro-sin-publicacion": "Registro sin publicación",
    "registro-asistente": "Registro como asistente",
    estudiante: "Estudiante",
    docente: "Docente / Investigador",
    profesional: "Profesional",
    naturales: "Ciencias Naturales",
    sociales: "Ciencias Sociales, Económicas y Humanidades",
    ingenierias: "Ingenierías",
    "oral-presencial": "Ponencia oral presencial",
    "oral-virtual": "Ponencia oral virtual",
    cartel: "Cartel presencial",
    tecnm: "Estudiante TecNM",
    "estudiante-externo": "Estudiante externo",
    publico: "Público general",
    asistente: "Asistente"
};


/**
 * Devuelve true si el valor del campo está vacío y no debe mostrarse.
 */
function esValorVacio(valor) {
    if (valor === null || valor === undefined) {
        return true;
    }

    return String(valor).trim() === "";
}

/**
 * Convierte el nombre técnico de un campo en una etiqueta amigable.
 */
function obtenerEtiquetaCampo(nombreCampo) {
    if (ETIQUETAS_CAMPOS[nombreCampo]) {
        return ETIQUETAS_CAMPOS[nombreCampo];
    }

    // Si no hay etiqueta definida, formatea el nombre del campo
    return nombreCampo
        .replace(/-/g, " ")
        .replace(/\b\w/g, function (letra) {
            return letra.toUpperCase();
        });
}

/**
 * Convierte valores técnicos (select, tipo de registro) en texto amigable.
 */
function obtenerValorAmigable(valor) {
    if (VALORES_AMIGABLES[valor]) {
        return VALORES_AMIGABLES[valor];
    }

    return valor;
}

/**
 * Muestra en exito.html TODOS los registros guardados en localStorage.
 * Cada registro se muestra en una tarjeta con todas sus propiedades.
 */
function mostrarTodosLosRegistros() {
    var contenedorLista = document.getElementById("lista-registros");
    var contenedorTotal = document.getElementById("total-registros");

    if (!contenedorLista) {
        return;
    }

    // Leemos el arreglo completo desde localStorage
    var registros = JSON.parse(localStorage.getItem(CLAVE_REGISTROS)) || [];

    // Mostramos cuántos registros hay guardados
    if (contenedorTotal) {
        contenedorTotal.textContent =
            "Total de registros almacenados: " + registros.length;
    }

    // Si no hay registros, mostramos un mensaje simple
    if (registros.length === 0) {
        contenedorLista.innerHTML = "<p>No existen registros almacenados.</p>";
        return;
    }

    var htmlTarjetas = "";

    // Recorremos cada registro del arreglo
    registros.forEach(function (registro, indice) {
        htmlTarjetas += '<div class="registro-card">';
        htmlTarjetas += "<h3>Registro #" + (indice + 1) + "</h3>";

        // Recorremos todas las propiedades del objeto (campo y valor)
        Object.entries(registro).forEach(function (entrada) {
            var campo = entrada[0];
            var valor = entrada[1];

            // No mostramos campos vacíos
            if (esValorVacio(valor)) {
                return;
            }

            var etiqueta = obtenerEtiquetaCampo(campo);
            var valorMostrar = obtenerValorAmigable(valor);

            htmlTarjetas +=
                "<p><strong>" + etiqueta + ":</strong> " + valorMostrar + "</p>";
        });

        htmlTarjetas += "</div>";
    });

    contenedorLista.innerHTML = htmlTarjetas;
}

// Esperamos a que el HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    // Mostramos el listado completo de registros almacenados
    mostrarTodosLosRegistros();
});
