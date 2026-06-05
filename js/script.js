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

// Orden preferido para mostrar los campos en exito.html
var ORDEN_CAMPOS = [
    "tipoRegistro",
    "fechaRegistro",
    "nombre",
    "email",
    "correo",
    "telefono",
    "institucion",
    "tipo-participacion",
    "tipo-asistente",
    "titulo",
    "area",
    "modalidad",
    "archivo-resumen",
    "archivo-extenso",
    "comentarios"
];

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
 * Busca un registro por su idRegistro dentro del arreglo guardado.
 */
function buscarRegistroPorId(idRegistro) {
    var registros = obtenerRegistrosGuardados();

    for (var i = 0; i < registros.length; i++) {
        if (String(registros[i].idRegistro) === String(idRegistro)) {
            return registros[i];
        }
    }

    return null;
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
 * Lee los campos del formulario con FormData y los convierte en un objeto.
 * Los archivos no se pueden guardar en localStorage; solo se guarda el nombre.
 * Si hay checkboxes o radios con el mismo name, se unen con comas.
 */
function crearObjetoRegistro(formulario, tipoRegistro, idRegistro) {
    var datosFormulario = new FormData(formulario);

    // Objeto base con identificador, tipo y fecha
    var registro = {
        idRegistro: idRegistro,
        tipoRegistro: tipoRegistro,
        fechaRegistro: obtenerFechaRegistro()
    };

    // Recorremos cada campo del formulario (solo los que tienen atributo name)
    datosFormulario.forEach(function (valor, nombreCampo) {
        var valorFinal;

        // Si el campo es un archivo, guardamos solo su nombre
        if (valor instanceof File) {
            valorFinal = valor.name;
        } else {
            valorFinal = valor;
        }

        // Varios checkboxes con el mismo name se guardan separados por coma
        if (registro[nombreCampo] !== undefined && !esValorVacio(registro[nombreCampo])) {
            registro[nombreCampo] = registro[nombreCampo] + ", " + valorFinal;
        } else {
            registro[nombreCampo] = valorFinal;
        }
    });

    return registro;
}

/**
 * Obtiene la lista de campos a mostrar respetando el orden definido.
 */
function obtenerCamposParaMostrar(registro) {
    var camposMostrados = [];
    var camposYaUsados = {};

    ORDEN_CAMPOS.forEach(function (nombreCampo) {
        if (
            nombreCampo !== "idRegistro" &&
            registro[nombreCampo] !== undefined &&
            !esValorVacio(registro[nombreCampo])
        ) {
            camposMostrados.push(nombreCampo);
            camposYaUsados[nombreCampo] = true;
        }
    });

    // Agrega cualquier otro campo que no esté en la lista de orden
    Object.keys(registro).forEach(function (nombreCampo) {
        if (
            nombreCampo !== "idRegistro" &&
            !camposYaUsados[nombreCampo] &&
            !esValorVacio(registro[nombreCampo])
        ) {
            camposMostrados.push(nombreCampo);
        }
    });

    return camposMostrados;
}

/**
 * Muestra en exito.html los datos del registro guardado en localStorage.
 */
function mostrarDatosRegistroEnExito() {
    var contenedor = document.getElementById("datos-registro");

    if (!contenedor) {
        return;
    }

    var parametros = new URLSearchParams(window.location.search);
    var idRegistro = parametros.get("id");

    if (!idRegistro) {
        contenedor.innerHTML = "<p>No se encontró información del registro.</p>";
        return;
    }

    var registro = buscarRegistroPorId(idRegistro);

    if (!registro) {
        contenedor.innerHTML = "<p>No se encontró información del registro.</p>";
        return;
    }

    var campos = obtenerCamposParaMostrar(registro);
    var tablaHtml = '<table class="tabla-datos"><tbody>';

    campos.forEach(function (nombreCampo) {
        var etiqueta = obtenerEtiquetaCampo(nombreCampo);
        var valor = obtenerValorAmigable(registro[nombreCampo]);

        tablaHtml += "<tr><td>" + etiqueta + "</td><td>" + valor + "</td></tr>";
    });

    tablaHtml += "</tbody></table>";

    contenedor.innerHTML = tablaHtml;
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

            // Identificador único para encontrar este registro en exito.html
            var idRegistro = Date.now();

            // Creamos el objeto con todos los datos del formulario
            var registro = crearObjetoRegistro(formulario, tipoRegistro, idRegistro);

            // Guardamos en localStorage antes de redirigir
            guardarRegistro(registro);

            console.log("Registro guardado en localStorage:", registro);

            // Redirigimos a exito.html con el id y la página de origen
            window.location.href =
                "exito.html?id=" + idRegistro + "&origen=" + paginaOrigen;
        });
    });

    // --- PÁGINA exito.html ---
    // Si existe el contenedor, mostramos los datos del registro recién guardado
    mostrarDatosRegistroEnExito();

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
