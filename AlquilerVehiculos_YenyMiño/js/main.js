
/* =====================================================
   MEYANA - INICIALIZACIÓN DEL SISTEMA
   ===================================================== */

function fnInicializarSistema() {

    // 1. Cargar los datos guardados.
    fnCargarVehiculos();
    fnCargarClientes();
    fnCargarAlquileres();
    fnCargarUsuarios();

    // 2. Recuperar la sesión.
    fnRestaurarSesion();

    // 3. Comprobar si estamos en una página privada.
    if (!fnEstaEnPaginaPrincipal()) {

        // Si no hay sesión, volver al login.
        if (g_usuarioActual === null) {

            // Guardar la página que quería visitar.
            let ruta = window.location.pathname;
            let destino = ruta.substring(ruta.lastIndexOf("/") + 1);

            if (destino === "administracion.html") {
                sessionStorage.setItem("meyana_destino", "administracion");
            } else if (destino === "clientes.html") {
                sessionStorage.setItem("meyana_destino", "clientes");
            } else if (destino === "alquileres.html") {
                sessionStorage.setItem("meyana_destino", "alquileres");
            } else if (destino === "informes.html") {
                sessionStorage.setItem("meyana_destino", "informes");
            } else if (destino === "usuarios.html") {
                sessionStorage.setItem("meyana_destino", "usuario");
            }

            window.location.href = "../index.html";
            return;
        }
    }

    // 4. Actualizar la interfaz según la sesión.
    fnAplicarSesion();

    // 5. Mostrar el catálogo, si existe.
    if (document.getElementById("vehiculos") !== null) {
        fnRenderVehiculos();
    }

    // 6. Mostrar la tabla de vehículos, si existe.
    if (document.getElementById("divTablaVehiculos") !== null) {
        fnRenderListaVehiculos();
    }

    // 7. Mostrar la tabla de clientes, si existe.
    if (document.getElementById("divTablaClientes") !== null) {
        fnRenderListaClientes();
    }

    // 8. Mostrar la tabla de alquileres, si existe.
    if (document.getElementById("divTablaAlquileres") !== null) {
        fnRenderListaAlquileres();
    }

    // 9. Mostrar la tabla de usuarios, si existe.
    if (document.getElementById("divTablasUsuarios") !== null) {
        fnRenderListaUsuarios();
    }
}

// Esperar a que el HTML esté cargado.
document.addEventListener("DOMContentLoaded", function () {
    fnInicializarSistema();
});
