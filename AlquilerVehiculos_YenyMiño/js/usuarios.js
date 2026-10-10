
/* =====================================================
   MEYANA - GESTIÓN DE USUARIOS
   JavaScript puro + localStorage
   ===================================================== */

let g_seccionPendiente = null;


/* =====================================================
   1. GUARDAR Y CARGAR USUARIOS
   ===================================================== */

function fnGuardarUsuarios() {
    localStorage.setItem(
        g_claveUsuarios,
        JSON.stringify(g_usuarios)
    );
}

function fnCargarUsuarios() {
    let datos = localStorage.getItem(g_claveUsuarios);

    if (datos !== null) {
        try {
            let usuariosGuardados = JSON.parse(datos);

            if (Array.isArray(usuariosGuardados)) {
                g_usuarios = usuariosGuardados;
            } else {
                g_usuarios = [];
            }
        } catch (error) {
            console.error("Error al cargar los usuarios:", error);
            g_usuarios = [];
        }
    } else {
        g_usuarios = [];
    }

    // Crear el administrador inicial si no hay usuarios.
    if (g_usuarios.length === 0) {
        g_usuarios.push({
            id: 1,
            nombre: "Administrador",
            usuario: "admin",
            password: "Meyana2026!"
        });
    }

    // Calcular el próximo ID disponible.
    g_genIdUsuario = 1;

    for (let usuario of g_usuarios) {
        if (Number(usuario.id) >= g_genIdUsuario) {
            g_genIdUsuario = Number(usuario.id) + 1;
        }
    }

    fnGuardarUsuarios();
}


/* =====================================================
   2. RESTAURAR SESIÓN
   ===================================================== */

function fnRestaurarSesion() {
    let idSesion = localStorage.getItem(g_claveSesion);

    if (idSesion === null) {
        g_usuarioActual = null;
        return;
    }

    let usuarioEncontrado = null;

    for (let usuario of g_usuarios) {
        if (Number(usuario.id) === Number(idSesion)) {
            usuarioEncontrado = usuario;
            break;
        }
    }

    if (usuarioEncontrado !== null) {
        g_usuarioActual = usuarioEncontrado;
    } else {
        localStorage.removeItem(g_claveSesion);
        g_usuarioActual = null;
    }
}


/* =====================================================
   3. RUTAS DE LAS PÁGINAS
   ===================================================== */

// Obtener el archivo correspondiente a cada sección.
function fnObtenerRutaSeccion(seccion) {
    if (seccion === "administracion") {
        return "administracion.html";
    }

    if (seccion === "clientes") {
        return "clientes.html";
    }

    if (seccion === "alquileres") {
        return "alquileres.html";
    }

    if (seccion === "informes") {
        return "informes.html";
    }

    if (seccion === "usuario") {
        return "usuarios.html";
    }

    return null;
}

// Comprobar si estamos en una página dentro de pestanas.
function fnEstaEnPaginaPrincipal() {
    return window.location.pathname.indexOf("/pestanas/") === -1;
}


/* =====================================================
   4. ACCEDER A UNA SECCIÓN PRIVADA
   ===================================================== */

function fnAccederSeccion(event, seccion) {
    if (event) {
        event.preventDefault();
    }

    let ruta = fnObtenerRutaSeccion(seccion);

    if (ruta === null) {
        return;
    }

    // Si ya inició sesión, abrir la página seleccionada.
    if (g_usuarioActual !== null) {
        if (fnEstaEnPaginaPrincipal()) {
            window.location.href = "pestanas/" + ruta;
        } else {
            window.location.href = ruta;
        }

        return;
    }

    // Guardar la sección que desea visitar.
    g_seccionPendiente = seccion;
    sessionStorage.setItem("meyana_destino", seccion);

    if (fnEstaEnPaginaPrincipal()) {
        // Mostrar el login en la página principal.
        let login = document.getElementById("pantallaLogin");

        if (login) {
            login.style.display = "flex";
        }

        let mensaje = document.getElementById("mensajeLogin");

        if (mensaje) {
            mensaje.textContent = "";
        }
    } else {
        // Volver al inicio para iniciar sesión.
        window.location.href = "../index.html";
    }
}


/* =====================================================
   5. INICIAR SESIÓN
   ===================================================== */

function fnIniciarSesion(event) {
    event.preventDefault();

    let campoUsuario = document.getElementById("txtUsuarioLogin");
    let campoPassword = document.getElementById("txtPasswordLogin");
    let mensaje = document.getElementById("mensajeLogin");

    if (!campoUsuario || !campoPassword || !mensaje) {
        return;
    }

    let nombreUsuario = campoUsuario.value.trim().toLowerCase();
    let password = campoPassword.value;
    let usuarioEncontrado = null;

    // Buscar al usuario.
    for (let usuario of g_usuarios) {
        if (
            String(usuario.usuario).toLowerCase() === nombreUsuario &&
            usuario.password === password
        ) {
            usuarioEncontrado = usuario;
            break;
        }
    }

    // Si los datos son incorrectos, mostrar un mensaje.
    if (usuarioEncontrado === null) {
        mensaje.textContent = "Usuario o contraseña incorrectos.";
        campoPassword.value = "";
        return;
    }

    // Guardar la sesión.
    g_usuarioActual = usuarioEncontrado;

    localStorage.setItem(
        g_claveSesion,
        String(g_usuarioActual.id)
    );

    mensaje.textContent = "";

    // Recuperar la sección que quería visitar.
    let destino = sessionStorage.getItem("meyana_destino");

    if (destino === null) {
        destino = g_seccionPendiente;
    }

    if (destino === null) {
        destino = "administracion";
    }

    sessionStorage.removeItem("meyana_destino");
    g_seccionPendiente = null;

    // Abrir la página correspondiente.
    let ruta = fnObtenerRutaSeccion(destino);

    if (ruta !== null) {
        window.location.href = "pestanas/" + ruta;
    }
}


/* =====================================================
   6. MOSTRAR PESTAÑAS
   ===================================================== */

function fnMostrarPestana(seccion) {

    // Inicio y Vehículos pertenecen a index.html.
    if (seccion === "inicio" || seccion === "vehiculos") {

        if (fnEstaEnPaginaPrincipal()) {
            let destino = document.getElementById(seccion);

            if (destino) {
                destino.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        } else {
            window.location.href = "../index.html#" + seccion;
        }

        return;
    }

    // Las demás secciones son páginas privadas.
    fnAccederSeccion(null, seccion);
}


/* =====================================================
   7. ACTUALIZAR LA INTERFAZ
   ===================================================== */

function fnAplicarSesion() {
    let pantallaLogin = document.getElementById("pantallaLogin");
    let contenidoSistema = document.getElementById("contenidoSistema");
    let nombreActual = document.getElementById("nombreUsuarioActual");

    let sesionActiva = g_usuarioActual !== null;

    if (contenidoSistema) {
        contenidoSistema.style.display = "";
    }

    if (sesionActiva && nombreActual) {
        nombreActual.textContent = g_usuarioActual.nombre;
    }

    // Ocultar secciones privadas si no hay sesión.
    if (!sesionActiva) {
        let seccionesPrivadas =
            document.querySelectorAll(".seccion-privada");

        for (let seccion of seccionesPrivadas) {
            seccion.style.display = "none";
        }
    }

    // Mostrar u ocultar el login.
    if (pantallaLogin) {
        if (!sesionActiva && g_seccionPendiente !== null) {
            pantallaLogin.style.display = "flex";
        } else {
            pantallaLogin.style.display = "none";
        }
    }

    // Actualizar la tabla si estamos en la página de usuarios.
    if (sesionActiva) {
        fnRenderListaUsuarios();
    }
}


/* =====================================================
   8. VOLVER AL CATÁLOGO
   ===================================================== */

function fnVolverAlCatalogo() {
    g_seccionPendiente = null;
    sessionStorage.removeItem("meyana_destino");

    if (fnEstaEnPaginaPrincipal()) {
        let login = document.getElementById("pantallaLogin");

        if (login) {
            login.style.display = "none";
        }

        document.body.classList.remove("login-visible");
    } else {
        window.location.href = "../index.html";
    }
}


/* =====================================================
   9. CERRAR SESIÓN
   ===================================================== */

function fnCerrarSesion() {
    // Eliminar la sesión guardada.
    localStorage.removeItem(g_claveSesion);

    g_usuarioActual = null;
    g_seccionPendiente = null;

    sessionStorage.removeItem("meyana_destino");

    // Limpiar los campos del login, si existen.
    let usuario = document.getElementById("txtUsuarioLogin");
    let password = document.getElementById("txtPasswordLogin");
    let mensaje = document.getElementById("mensajeLogin");

    if (usuario) {
        usuario.value = "";
    }

    if (password) {
        password.value = "";
    }

    if (mensaje) {
        mensaje.textContent = "";
    }

    // Si estamos en una página privada, volver al inicio.
    if (!fnEstaEnPaginaPrincipal()) {
        window.location.href = "../index.html";
        return;
    }

    fnAplicarSesion();
    fnMostrarPestana("inicio");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   10. LISTAR Y FILTRAR USUARIOS
   ===================================================== */

function fnRenderListaUsuarios(filtro = "") {
    let contenedor = document.getElementById("divTablasUsuarios");

    if (contenedor === null) {
        return;
    }

    let tabla = "";
    let encontrados = 0;
    let busqueda = filtro.toLowerCase().trim();

    tabla += "<table>";
    tabla += "<thead><tr>";
    tabla += "<th>Nombre completo</th>";
    tabla += "<th>Usuario</th>";
    tabla += "<th>Acciones</th>";
    tabla += "</tr></thead><tbody>";

    for (let usuario of g_usuarios) {
        let nombre = String(usuario.nombre);
        let nombreUsuario = String(usuario.usuario);

        if (
            nombre.toLowerCase().includes(busqueda) ||
            nombreUsuario.toLowerCase().includes(busqueda)
        ) {
            tabla += `
                <tr>
                    <td>${fnEscaparTexto(nombre)}</td>
                    <td>${fnEscaparTexto(nombreUsuario)}</td>
                    <td>
                        <button
                            type="button"
                            onclick="fnEditarUsuario(${Number(usuario.id)})">
                            Editar
                        </button>

                        <button
                            type="button"
                            onclick="fnEliminarUsuario(${Number(usuario.id)})">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;

            encontrados++;
        }
    }

    if (encontrados === 0) {
        tabla += `
            <tr>
                <td colspan="3">No se encontraron usuarios.</td>
            </tr>
        `;
    }

    tabla += "</tbody></table>";

    contenedor.innerHTML = tabla;
}


function fnFiltrarUsuarios() {
    let campo = document.getElementById("txtFiltroUsuario");
    let filtro = "";

    if (campo !== null) {
        filtro = campo.value;
    }

    fnRenderListaUsuarios(filtro);
}


/* =====================================================
   11. PREPARAR FORMULARIO DE USUARIO
   ===================================================== */

function fnNuevoUsuario() {
    g_editUsuarioId = null;

    document.getElementById("tituloFormUsuario").textContent =
        "Nuevo usuario";

    document.getElementById("txtNombreUsuario").value = "";
    document.getElementById("txtUsuario").value = "";
    document.getElementById("txtPasswordUsuario").value = "";

    document.getElementById("txtPasswordUsuario").required = true;

    document.getElementById("ayudaPassword").textContent =
        "La contraseña debe tener al menos 6 caracteres.";

    document.getElementById("divListaUsuarios").style.display = "none";
    document.getElementById("divFormUsuario").style.display = "block";
}


function fnEditarUsuario(id) {
    let usuarioEncontrado = null;

    for (let usuario of g_usuarios) {
        if (Number(usuario.id) === Number(id)) {
            usuarioEncontrado = usuario;
            break;
        }
    }

    if (usuarioEncontrado === null) {
        alert("No se encontró el usuario.");
        return;
    }

    g_editUsuarioId = Number(id);

    document.getElementById("tituloFormUsuario").textContent =
        "Editar usuario";

    document.getElementById("txtNombreUsuario").value =
        usuarioEncontrado.nombre;

    document.getElementById("txtUsuario").value =
        usuarioEncontrado.usuario;

    document.getElementById("txtPasswordUsuario").value = "";
    document.getElementById("txtPasswordUsuario").required = false;

    document.getElementById("ayudaPassword").textContent =
        "Dejá la contraseña vacía si no querés cambiarla.";

    document.getElementById("divListaUsuarios").style.display = "none";
    document.getElementById("divFormUsuario").style.display = "block";
}


/* =====================================================
   12. GUARDAR O EDITAR USUARIO
   ===================================================== */

function fnGuardarUsuario(event) {
    event.preventDefault();

    let nombre = document.getElementById("txtNombreUsuario").value.trim();
    let nombreUsuario = document.getElementById("txtUsuario").value.trim();
    let password = document.getElementById("txtPasswordUsuario").value;

    if (nombre.length < 3) {
        alert("El nombre debe tener al menos 3 caracteres.");
        return;
    }

    if (nombreUsuario.length < 3) {
        alert("El usuario debe tener al menos 3 caracteres.");
        return;
    }

    if (password !== "" && password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    if (g_editUsuarioId === null && password.length < 6) {
        alert("Ingresá una contraseña de al menos 6 caracteres.");
        return;
    }

    // Evitar usuarios duplicados.
    for (let usuario of g_usuarios) {
        if (
            String(usuario.usuario).toLowerCase() ===
                nombreUsuario.toLowerCase() &&
            Number(usuario.id) !== Number(g_editUsuarioId)
        ) {
            alert("Ese nombre de usuario ya está registrado.");
            return;
        }
    }

    if (!confirm("¿Deseás guardar los datos del usuario?")) {
        return;
    }

    if (g_editUsuarioId === null) {
        // Crear un usuario nuevo.
        let nuevoUsuario = {
            id: g_genIdUsuario,
            nombre: nombre,
            usuario: nombreUsuario,
            password: password
        };

        g_usuarios.push(nuevoUsuario);
        g_genIdUsuario++;
    } else {
        // Buscar el usuario que se va a editar.
        let usuarioEditado = null;

        for (let usuario of g_usuarios) {
            if (Number(usuario.id) === Number(g_editUsuarioId)) {
                usuarioEditado = usuario;
                break;
            }
        }

        if (usuarioEditado === null) {
            alert("No se encontró el usuario que querés editar.");
            return;
        }

        usuarioEditado.nombre = nombre;
        usuarioEditado.usuario = nombreUsuario;

        if (password !== "") {
            usuarioEditado.password = password;
        }
    }

    fnGuardarUsuarios();

    // Actualizar los datos del usuario conectado.
    if (g_usuarioActual !== null) {
        for (let usuario of g_usuarios) {
            if (Number(usuario.id) === Number(g_usuarioActual.id)) {
                g_usuarioActual = usuario;
                break;
            }
        }
    }

    fnCancelarUsuario();
    fnAplicarSesion();

    alert("Usuario guardado correctamente.");
}


/* =====================================================
   13. CANCELAR FORMULARIO DE USUARIO
   ===================================================== */

function fnCancelarUsuario() {
    g_editUsuarioId = null;

    document.getElementById("txtNombreUsuario").value = "";
    document.getElementById("txtUsuario").value = "";
    document.getElementById("txtPasswordUsuario").value = "";

    document.getElementById("divFormUsuario").style.display = "none";
    document.getElementById("divListaUsuarios").style.display = "block";

    let filtro = document.getElementById("txtFiltroUsuario");

    if (filtro !== null) {
        fnRenderListaUsuarios(filtro.value);
    } else {
        fnRenderListaUsuarios();
    }
}


/* =====================================================
   14. ELIMINAR USUARIO
   ===================================================== */

function fnEliminarUsuario(id) {
    // No permitir eliminar al usuario conectado.
    if (
        g_usuarioActual !== null &&
        Number(g_usuarioActual.id) === Number(id)
    ) {
        alert("No podés eliminar el usuario con el que iniciaste sesión.");
        return;
    }

    // Debe quedar al menos un usuario.
    if (g_usuarios.length <= 1) {
        alert("Debe existir al menos un usuario en el sistema.");
        return;
    }

    let usuarioEncontrado = null;

    for (let usuario of g_usuarios) {
        if (Number(usuario.id) === Number(id)) {
            usuarioEncontrado = usuario;
            break;
        }
    }

    if (usuarioEncontrado === null) {
        alert("No se encontró el usuario.");
        return;
    }

    if (!confirm(
        "¿Estás segura de que querés eliminar al usuario " +
        usuarioEncontrado.nombre + "?"
    )) {
        return;
    }

    g_usuarios = g_usuarios.filter(function (usuario) {
        return Number(usuario.id) !== Number(id);
    });

    fnGuardarUsuarios();
    fnRenderListaUsuarios();

    alert("Usuario eliminado correctamente.");
}
