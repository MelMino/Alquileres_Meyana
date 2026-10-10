/* =====================================================
   MEYANA - ALQUILER DE VEHÍCULOS
   JavaScript puro + localStorage
   ===================================================== */


/* =====================================================
   1. VARIABLES GLOBALES
   Las variables globales permiten compartir datos
   entre las distintas funciones del sistema.
   ===================================================== */

let g_vehiculos = [];
let g_genIdVehiculo = 1;
let g_editVehiculoId = null;
const g_claveVehiculos = "meyana_vehiculos";

let g_clientes = [];
let g_genIdCliente = 1;
let g_editClienteId = null;
const g_claveClientes = "meyana_clientes";

let g_alquileres = [];
let g_genIdAlquiler = 1;
const g_claveAlquileres = "meyana_alquileres";

let g_usuarios = [];
let g_genIdUsuario = 1;
let g_editUsuarioId = null;
let g_usuarioActual = null;

const g_claveUsuarios = "meyana_usuarios";
const g_claveSesion = "meyana_sesion";


/* =====================================================
   2. FUNCIONES AUXILIARES REUTILIZABLES
   Estas funciones se pueden utilizar desde cualquier
   sección del sistema.
   ===================================================== */

/*
  fnFechaActual:
  Devuelve la fecha actual en formato AAAA-MM-DD.
  getFullYear obtiene el año.
  getMonth devuelve el mes desde 0 hasta 11, por eso
  sumamos 1.
  padStart agrega un cero al comienzo cuando hace falta.
*/
function fnFechaActual() {
    let hoy = new Date();

    let anio = hoy.getFullYear();
    let mes = String(hoy.getMonth() + 1).padStart(2, "0");
    let dia = String(hoy.getDate()).padStart(2, "0");

    return anio + "-" + mes + "-" + dia;
}

/*
  fnFormatearFecha:
  Convierte AAAA-MM-DD en DD/MM/AAAA para mostrar
  las fechas de forma más familiar.
*/
function fnFormatearFecha(fecha) {
    if (!fecha) {
        return "-";
    }

    let partes = fecha.split("-");

    if (partes.length !== 3) {
        return fecha;
    }

    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

/*
  fnFormatearGuaranies:
  Convierte un número en un importe con formato
  monetario de Paraguay.
*/
function fnFormatearGuaranies(monto) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        maximumFractionDigits: 0
    }).format(Number(monto));
}

/*
  fnCalcularDias:
  Calcula la cantidad de días entre dos fechas.
  Usamos UTC para evitar diferencias de horas por
  cambios de horario o zona horaria.
*/
function fnCalcularDias(fechaInicio, fechaFin) {
    let inicio = new Date(fechaInicio + "T00:00:00Z");
    let fin = new Date(fechaFin + "T00:00:00Z");

    return Math.round((fin - inicio) / 86400000);
}

/*
  fnEscaparTexto:
  Evita que un texto ingresado por una persona se
  interprete como código HTML al mostrarlo en una tabla.
  replace busca un carácter y lo reemplaza por su
  equivalente seguro.
*/
function fnEscaparTexto(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/*
  fnBuscarVehiculo:
  Busca un vehículo por su ID.
  Devuelve el objeto encontrado o null si no existe.
*/
function fnBuscarVehiculo(id) {
    for (let vehiculo of g_vehiculos) {
        if (Number(vehiculo.id) === Number(id)) {
            return vehiculo;
        }
    }

    return null;
}

/*
  fnBuscarCliente:
  Busca un cliente por su ID.
*/
function fnBuscarCliente(id) {
    for (let cliente of g_clientes) {
        if (Number(cliente.id) === Number(id)) {
            return cliente;
        }
    }

    return null;
}

/*
  fnMostrarMensaje:
  Centraliza la presentación de mensajes emergentes.
*/
function fnMostrarMensaje(mensaje) {
    alert(mensaje);
}