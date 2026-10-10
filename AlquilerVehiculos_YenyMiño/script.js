
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


/* =====================================================
   3. CONSTRUCTOR DE VEHÍCULOS
   El constructor crea un objeto con las propiedades
   necesarias para representar un vehículo.
   ===================================================== */

function Vehiculo(
    marca,
    modelo,
    anio,
    color,
    cant_asientos,
    chapa,
    precio,
    imagen
) {
    this.id = g_genIdVehiculo++;
    this.marca = marca;
    this.modelo = modelo;
    this.anio = anio;
    this.color = color;
    this.cant_asientos = cant_asientos;
    this.chapa = chapa;
    this.precio = precio;
    this.imagen = imagen;
    this.disponibilidad = true;
}


/* =====================================================
   4. GUARDAR Y CARGAR VEHÍCULOS
   JSON.stringify convierte los objetos en texto para
   guardarlos. JSON.parse recupera ese texto como datos.
   ===================================================== */

/*
  fnGuardarVehiculos:
  Guarda la lista completa de vehículos en localStorage.
*/
function fnGuardarVehiculos() {
    localStorage.setItem(
        g_claveVehiculos,
        JSON.stringify(g_vehiculos)
    );
}

/*
  fnCargarVehiculos:
  Recupera los vehículos guardados.
  Si es la primera ejecución, crea dos vehículos iniciales.
  Después calcula el siguiente ID disponible.
*/
function fnCargarVehiculos() {
    let datos = localStorage.getItem(g_claveVehiculos);

    if (datos !== null) {
        try {
            let vehiculosGuardados = JSON.parse(datos);

            if (Array.isArray(vehiculosGuardados)) {
                g_vehiculos = vehiculosGuardados;
            } else {
                g_vehiculos = [];
            }
        } catch (error) {
            console.error("Error al cargar los vehículos:", error);
            g_vehiculos = [];
        }
    } else {
        g_vehiculos = [];

        let vehiculoUno = new Vehiculo(
            "Kia",
            "Rio",
            2020,
            "Blanco",
            5,
            "ABC 456",
            100000,
            "imagenes/naranjoso.jpeg"
        );

        let vehiculoDos = new Vehiculo(
            "Toyota",
            "Corolla",
            2022,
            "Negro",
            5,
            "XYZ 789",
            150000,
            "imagenes/naranjoso.jpeg"
        );

        g_vehiculos.push(vehiculoUno);
        g_vehiculos.push(vehiculoDos);
    }

    g_genIdVehiculo = 1;

    for (let vehiculo of g_vehiculos) {
        if (Number(vehiculo.id) >= g_genIdVehiculo) {
            g_genIdVehiculo = Number(vehiculo.id) + 1;
        }

        // Compatibilidad con vehículos guardados sin disponibilidad.
        if (vehiculo.disponibilidad === undefined) {
            vehiculo.disponibilidad = true;
        }
    }

    fnGuardarVehiculos();
}


/* =====================================================
   5. CREAR Y ACTUALIZAR VEHÍCULOS
   ===================================================== */

/*
  fnCrearVehiculo:
  Construye un vehículo nuevo, lo agrega al arreglo
  y guarda los cambios.
*/
function fnCrearVehiculo(
    marca,
    modelo,
    anio,
    color,
    cant_asientos,
    chapa,
    precio,
    imagen
) {
    let vehiculo = new Vehiculo(
        marca,
        modelo,
        anio,
        color,
        cant_asientos,
        chapa,
        precio,
        imagen
    );

    g_vehiculos.push(vehiculo);
    fnGuardarVehiculos();

    return vehiculo;
}

/*
  fnActualizarVehiculo:
  Busca un vehículo por su ID y modifica sus datos.
  Devuelve true si lo actualizó y false si no lo encontró.
*/
function fnActualizarVehiculo(
    id,
    marca,
    modelo,
    anio,
    color,
    cant_asientos,
    chapa,
    precio,
    imagen
) {
    let vehiculo = fnBuscarVehiculo(id);

    if (vehiculo === null) {
        return false;
    }

    vehiculo.marca = marca;
    vehiculo.modelo = modelo;
    vehiculo.anio = anio;
    vehiculo.color = color;
    vehiculo.cant_asientos = cant_asientos;
    vehiculo.chapa = chapa;
    vehiculo.precio = precio;
    vehiculo.imagen = imagen;

    fnGuardarVehiculos();

    return true;
}


/* =====================================================
   6. CATÁLOGO PÚBLICO DE VEHÍCULOS
   Permite filtrar por disponibilidad, marca, modelo
   y año.
   ===================================================== */

/*
  fnRenderVehiculos:
  "Renderizar" significa construir y mostrar el HTML
  a partir de los datos que tenemos en JavaScript.
*/
function fnRenderVehiculos(filtro = "todos") {
    let buff = [];

    let campoMarca = document.getElementById("txtMarcaFiltro");
    let campoModelo = document.getElementById("txtModeloFiltro");
    let campoAnio = document.getElementById("txtAnioFiltro");

    let filtroMarca = "";
    let filtroModelo = "";
    let filtroAnio = "";

    if (campoMarca !== null) {
        filtroMarca = campoMarca.value.toLowerCase().trim();
    }

    if (campoModelo !== null) {
        filtroModelo = campoModelo.value.toLowerCase().trim();
    }

    if (campoAnio !== null) {
        filtroAnio = campoAnio.value.trim();
    }

    for (let vehiculo of g_vehiculos) {
        // Se omiten los vehículos que no coinciden con el filtro.
        if (filtro === "disponibles" && !vehiculo.disponibilidad) {
            continue;
        }

        if (filtro === "noDisponibles" && vehiculo.disponibilidad) {
            continue;
        }

        if (
            filtroMarca !== "" &&
            !String(vehiculo.marca).toLowerCase().includes(filtroMarca)
        ) {
            continue;
        }

        if (
            filtroModelo !== "" &&
            !String(vehiculo.modelo).toLowerCase().includes(filtroModelo)
        ) {
            continue;
        }

        if (
            filtroAnio !== "" &&
            String(vehiculo.anio) !== filtroAnio
        ) {
            continue;
        }

        let estado = "Disponible";

        if (!vehiculo.disponibilidad) {
            estado = "No disponible";
        }

        buff.push(`
            <div class="vehiculo-card">
                <img
                    src="${fnEscaparTexto(vehiculo.imagen)}"
                    alt="${fnEscaparTexto(vehiculo.marca)} ${fnEscaparTexto(vehiculo.modelo)}"
                    class="autos-fotos"
                >

                <div class="vehiculo-info">
                    <p><strong>Marca:</strong> ${fnEscaparTexto(vehiculo.marca)}</p>
                    <p><strong>Modelo:</strong> ${fnEscaparTexto(vehiculo.modelo)}</p>
                    <p><strong>Año:</strong> ${vehiculo.anio}</p>
                    <p><strong>Color:</strong> ${fnEscaparTexto(vehiculo.color)}</p>
                    <p><strong>Asientos:</strong> ${vehiculo.cant_asientos}</p>
                    <p><strong>Chapa:</strong> ${fnEscaparTexto(vehiculo.chapa)}</p>

                    <div class="precio">
                        <span>Precio por día</span>
                        <strong>${fnFormatearGuaranies(vehiculo.precio)}</strong>
                        <small>/ día</small>
                    </div>

                    <div class="disponibilidad">
                        <span>●</span>
                        <strong>${estado}</strong>
                    </div>
                </div>
            </div>
        `);
    }

    let contenedor = document.querySelector(".container");

    if (contenedor !== null) {
        if (buff.length === 0) {
            contenedor.innerHTML =
                "<p>No hay vehículos que coincidan con los filtros.</p>";
        } else {
            contenedor.innerHTML = buff.join("\n");
        }
    }
}

/*
  fnFiltrarVehiculos:
  Lee el filtro de disponibilidad y vuelve a dibujar
  el catálogo.
*/
function fnFiltrarVehiculos() {
    let campoDisponibilidad = document.getElementById("txtDisponibilidad");
    let filtro = "todos";

    if (campoDisponibilidad !== null) {
        filtro = campoDisponibilidad.value;
    }

    fnRenderVehiculos(filtro);
}

/*
  fnLimpiarFiltrosVehiculos:
  Restablece todos los campos de búsqueda.
*/
function fnLimpiarFiltrosVehiculos() {
    let ids = [
        "txtDisponibilidad",
        "txtMarcaFiltro",
        "txtModeloFiltro",
        "txtAnioFiltro"
    ];

    for (let id of ids) {
        let campo = document.getElementById(id);

        if (campo !== null) {
            if (id === "txtDisponibilidad") {
                campo.value = "todos";
            } else {
                campo.value = "";
            }
        }
    }

    fnRenderVehiculos();
}


/* =====================================================
   7. FORMULARIO DE ADMINISTRACIÓN DE VEHÍCULOS
   ===================================================== */

/*
  Estas funciones muestran una sección y ocultan la otra.
  Se comprueba que el elemento exista antes de modificarlo.
*/
function fnShowListaVehiculos() {
    let lista = document.getElementById("divListaVehiculos");
    let formulario = document.getElementById("divFormVehiculo");

    if (lista !== null) {
        lista.style.display = "block";
    }

    if (formulario !== null) {
        formulario.style.display = "none";
    }
}

function fnShowFormVehiculo() {
    let lista = document.getElementById("divListaVehiculos");
    let formulario = document.getElementById("divFormVehiculo");

    if (lista !== null) {
        lista.style.display = "none";
    }

    if (formulario !== null) {
        formulario.style.display = "block";
    }
}

/*
  fnLimpiarFormVehiculo:
  Vacía los campos del formulario y coloca una imagen
  predeterminada.
*/
function fnLimpiarFormVehiculo() {
    let ids = [
        "txtMarca",
        "txtModelo",
        "txtAnio",
        "txtColor",
        "txtAsientos",
        "txtChapa",
        "txtPrecio"
    ];

    for (let id of ids) {
        let campo = document.getElementById(id);

        if (campo !== null) {
            campo.value = "";
        }
    }

    let campoImagen = document.getElementById("txtImagen");

    if (campoImagen !== null) {
        campoImagen.value = "imagenes/naranjoso.jpeg";
    }
}

/*
  fnNuevoVehiculo:
  Prepara el formulario para registrar un vehículo nuevo.
*/
function fnNuevoVehiculo() {
    g_editVehiculoId = null;

    let titulo = document.getElementById("tituloFormVehiculo");

    if (titulo !== null) {
        titulo.textContent = "Nuevo vehículo";
    }

    fnLimpiarFormVehiculo();
    fnShowFormVehiculo();
}

/*
  fnGuardarVehiculo:
  Valida los campos y decide si debe crear un vehículo
  o actualizar uno existente.
  preventDefault evita que el formulario recargue la página.
*/
function fnGuardarVehiculo(event) {
    event.preventDefault();

    let marca = document.getElementById("txtMarca").value.trim();
    let modelo = document.getElementById("txtModelo").value.trim();
    let anio = Number(document.getElementById("txtAnio").value);
    let color = document.getElementById("txtColor").value.trim();
    let asientos = Number(document.getElementById("txtAsientos").value);
    let chapa = document.getElementById("txtChapa").value.trim();
    let precio = Number(document.getElementById("txtPrecio").value);
    let imagen = document.getElementById("txtImagen").value.trim();

    if (
        marca === "" ||
        modelo === "" ||
        color === "" ||
        chapa === "" ||
        imagen === "" ||
        !Number.isInteger(anio) ||
        anio < 1900 ||
        anio > new Date().getFullYear() ||
        !Number.isInteger(asientos) ||
        asientos < 1 ||
        !Number.isFinite(precio) ||
        precio <= 0
    ) {
        alert("Verificá los datos ingresados.");
        return;
    }

    // La chapa debe ser única, excepto al editar el mismo vehículo.
    for (let vehiculo of g_vehiculos) {
        if (
            String(vehiculo.chapa).toLowerCase() === chapa.toLowerCase() &&
            Number(vehiculo.id) !== Number(g_editVehiculoId)
        ) {
            alert("Ya existe un vehículo registrado con esa chapa.");
            return;
        }
    }

    if (!confirm("¿Deseás guardar este vehículo?")) {
        return;
    }

    if (g_editVehiculoId === null) {
        fnCrearVehiculo(
            marca,
            modelo,
            anio,
            color,
            asientos,
            chapa,
            precio,
            imagen
        );
    } else {
        let actualizado = fnActualizarVehiculo(
            g_editVehiculoId,
            marca,
            modelo,
            anio,
            color,
            asientos,
            chapa,
            precio,
            imagen
        );

        if (!actualizado) {
            alert("No se encontró el vehículo que querés editar.");
            return;
        }
    }

    g_editVehiculoId = null;

    fnLimpiarFormVehiculo();
    fnRenderListaVehiculos();
    fnFiltrarVehiculos();
    fnShowListaVehiculos();

    alert("Vehículo guardado correctamente.");
}

/*
  fnEditarVehiculo:
  Busca el vehículo y coloca sus datos actuales
  en los campos del formulario.
*/
function fnEditarVehiculo(id) {
    let vehiculoEncontrado = fnBuscarVehiculo(id);

    if (vehiculoEncontrado === null) {
        alert("No se encontró el vehículo.");
        return;
    }

    g_editVehiculoId = Number(vehiculoEncontrado.id);

    document.getElementById("tituloFormVehiculo").textContent =
        "Editar vehículo";

    document.getElementById("txtMarca").value = vehiculoEncontrado.marca;
    document.getElementById("txtModelo").value = vehiculoEncontrado.modelo;
    document.getElementById("txtAnio").value = vehiculoEncontrado.anio;
    document.getElementById("txtColor").value = vehiculoEncontrado.color;
    document.getElementById("txtAsientos").value = vehiculoEncontrado.cant_asientos;
    document.getElementById("txtChapa").value = vehiculoEncontrado.chapa;
    document.getElementById("txtPrecio").value = vehiculoEncontrado.precio;
    document.getElementById("txtImagen").value = vehiculoEncontrado.imagen;

    fnShowFormVehiculo();
}

/*
  fnCancelarVehiculo:
  Descarta la edición en curso y vuelve al listado.
*/
function fnCancelarVehiculo() {
    g_editVehiculoId = null;
    fnLimpiarFormVehiculo();
    fnShowListaVehiculos();
}

/*
  fnEliminarVehiculo:
  Impide eliminar vehículos que tengan alquileres
  registrados. Esto mantiene el historial consistente.
*/
function fnEliminarVehiculo(id) {
    let vehiculo = fnBuscarVehiculo(id);

    if (vehiculo === null) {
        alert("No se encontró el vehículo.");
        return;
    }

    for (let alquiler of g_alquileres) {
        if (Number(alquiler.vehiculoId) === Number(id)) {
            alert(
                "No se puede eliminar este vehículo porque tiene alquileres registrados."
            );
            return;
        }
    }

    if (!confirm("¿Deseás eliminar el vehículo " + vehiculo.marca + " " + vehiculo.modelo + "?")) {
        return;
    }

    /*
      filter crea un arreglo nuevo con los vehículos que
      cumplen la condición. Aquí conserva todos menos el elegido.
    */
    g_vehiculos = g_vehiculos.filter(function (elemento) {
        return Number(elemento.id) !== Number(id);
    });

    fnGuardarVehiculos();
    fnRenderListaVehiculos();
    fnFiltrarVehiculos();

    alert("Vehículo eliminado correctamente.");
}

/*
  fnRenderListaVehiculos:
  Construye la tabla administrativa de vehículos.
  Recibe un texto opcional para filtrar por marca, modelo,
  año, chapa o color.
*/
function fnRenderListaVehiculos(filtro = "") {
    let contenedor = document.getElementById("divTablaVehiculos");

    if (contenedor === null) {
        return;
    }

    let textoFiltro = filtro.toLowerCase().trim();
    let campoFiltro = document.getElementById("txtFiltroVehiculo");

    if (campoFiltro !== null && filtro === "") {
        textoFiltro = campoFiltro.value.toLowerCase().trim();
    }

    let filas = [];

    for (let vehiculo of g_vehiculos) {
        let textoCompleto = (
            vehiculo.marca + " " +
            vehiculo.modelo + " " +
            vehiculo.anio + " " +
            vehiculo.chapa + " " +
            vehiculo.color
        ).toLowerCase();

        if (
            textoFiltro !== "" &&
            !textoCompleto.includes(textoFiltro)
        ) {
            continue;
        }

        let estado = "Disponible";

        if (!vehiculo.disponibilidad) {
            estado = "Alquilado";
        }

        filas.push(`
            <tr>
                <td>${vehiculo.id}</td>
                <td>${fnEscaparTexto(vehiculo.marca)}</td>
                <td>${fnEscaparTexto(vehiculo.modelo)}</td>
                <td>${vehiculo.anio}</td>
                <td>${fnEscaparTexto(vehiculo.color)}</td>
                <td>${fnEscaparTexto(vehiculo.chapa)}</td>
                <td>${fnFormatearGuaranies(vehiculo.precio)}</td>
                <td>${estado}</td>
                <td>
                    <button
                        type="button"
                        onclick="fnEditarVehiculo(${Number(vehiculo.id)})">
                        Editar
                    </button>

                    <button
                        type="button"
                        onclick="fnEliminarVehiculo(${Number(vehiculo.id)})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `);
    }

    if (filas.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron vehículos.</p>";
        return;
    }

    contenedor.innerHTML = `
        <table class="tabla-vehiculos">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Año</th>
                    <th>Color</th>
                    <th>Chapa</th>
                    <th>Precio por día</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${filas.join("")}
            </tbody>
        </table>
    `;
}

/*
  fnFiltrarListaVehiculos:
  Lee el campo de búsqueda de la tabla y vuelve a
  construirla con el filtro aplicado.
*/
function fnFiltrarListaVehiculos() {
    let campo = document.getElementById("txtFiltroVehiculo");
    let filtro = "";

    if (campo !== null) {
        filtro = campo.value;
    }

    fnRenderListaVehiculos(filtro);
}

/*
  fnCambiarDisponibilidad:
  Cambia manualmente la disponibilidad de un vehículo.
  Para mantener la consistencia, no debe usarse para
  reemplazar el registro de alquiler o devolución.
*/
function fnCambiarDisponibilidad(id, disponible) {
    let vehiculo = fnBuscarVehiculo(id);

    if (vehiculo === null) {
        alert("No se encontró el vehículo.");
        return;
    }

    vehiculo.disponibilidad = disponible;

    fnGuardarVehiculos();
    fnFiltrarVehiculos();
    fnRenderListaVehiculos();
}


/* =====================================================
   8. CONSTRUCTOR DE CLIENTES
   ===================================================== */

/*
  Cliente crea un objeto con los datos de una persona
  que puede realizar alquileres.
*/
function Cliente(nombre, documento, telefono, correo, direccion) {
    this.id = g_genIdCliente++;
    this.nombre = nombre;
    this.documento = documento;
    this.telefono = telefono;
    this.correo = correo;
    this.direccion = direccion;
}


/* =====================================================
   9. GUARDAR Y CARGAR CLIENTES
   ===================================================== */

/*
  Guarda todos los clientes en localStorage.
*/
function fnGuardarClientes() {
    localStorage.setItem(
        g_claveClientes,
        JSON.stringify(g_clientes)
    );
}

/*
  Recupera los clientes y determina cuál será el
  próximo ID disponible.
*/
function fnCargarClientes() {
    let datos = localStorage.getItem(g_claveClientes);

    if (datos !== null) {
        try {
            let clientesGuardados = JSON.parse(datos);

            if (Array.isArray(clientesGuardados)) {
                g_clientes = clientesGuardados;
            } else {
                g_clientes = [];
            }
        } catch (error) {
            console.error("Error al cargar los clientes:", error);
            g_clientes = [];
        }
    } else {
        g_clientes = [];
    }

    g_genIdCliente = 1;

    for (let cliente of g_clientes) {
        if (Number(cliente.id) >= g_genIdCliente) {
            g_genIdCliente = Number(cliente.id) + 1;
        }
    }

    fnRenderListaClientes();
}


/* =====================================================
   10. FORMULARIO DE CLIENTES
   ===================================================== */

/*
  Prepara el formulario para registrar un cliente nuevo.
*/
function fnNuevoCliente() {
    g_editClienteId = null;

    fnLimpiarFormCliente();

    document.getElementById("tituloFormCliente").textContent =
        "Registrar cliente";

    document.getElementById("divListaClientes").style.display = "none";
    document.getElementById("divFormCliente").style.display = "block";
}

/*
  Limpia todos los campos del formulario de clientes.
*/
function fnLimpiarFormCliente() {
    document.getElementById("txtNombreCliente").value = "";
    document.getElementById("txtDocumentoCliente").value = "";
    document.getElementById("txtTelefonoCliente").value = "";
    document.getElementById("txtCorreoCliente").value = "";
    document.getElementById("txtDireccionCliente").value = "";
}

/*
  Valida los datos y registra un cliente nuevo o
  actualiza los datos del cliente seleccionado.
*/
function fnGuardarCliente(event) {
    event.preventDefault();

    let nombre = document.getElementById("txtNombreCliente").value.trim();
    let documento = document.getElementById("txtDocumentoCliente").value.trim();
    let telefono = document.getElementById("txtTelefonoCliente").value.trim();
    let correo = document.getElementById("txtCorreoCliente").value.trim();
    let direccion = document.getElementById("txtDireccionCliente").value.trim();

    if (nombre.length < 3) {
        alert("El nombre debe tener al menos 3 caracteres.");
        return;
    }

    if (documento === "" || telefono === "") {
        alert("El documento y el teléfono son obligatorios.");
        return;
    }

    // El documento no puede pertenecer a dos clientes diferentes.
    for (let cliente of g_clientes) {
        if (
            String(cliente.documento).toLowerCase() === documento.toLowerCase() &&
            Number(cliente.id) !== Number(g_editClienteId)
        ) {
            alert("Ya existe un cliente con ese documento.");
            return;
        }
    }

    let mensaje = "¿Deseás registrar este cliente?";

    if (g_editClienteId !== null) {
        mensaje = "¿Deseás guardar los cambios del cliente?";
    }

    if (!confirm(mensaje)) {
        return;
    }

    if (g_editClienteId === null) {
        let nuevoCliente = new Cliente(
            nombre,
            documento,
            telefono,
            correo,
            direccion
        );

        g_clientes.push(nuevoCliente);
    } else {
        let cliente = fnBuscarCliente(g_editClienteId);

        if (cliente === null) {
            alert("No se encontró el cliente que querés editar.");
            return;
        }

        cliente.nombre = nombre;
        cliente.documento = documento;
        cliente.telefono = telefono;
        cliente.correo = correo;
        cliente.direccion = direccion;
    }

    fnGuardarClientes();
    fnLimpiarFormCliente();
    fnCancelarCliente();
    fnRenderListaClientes();

    alert("Cliente guardado correctamente.");
}

/*
  Busca el cliente y carga sus datos en el formulario
  para que se puedan modificar.
*/
function fnEditarCliente(id) {
    let cliente = fnBuscarCliente(id);

    if (cliente === null) {
        alert("No se encontró el cliente.");
        return;
    }

    g_editClienteId = Number(cliente.id);

    document.getElementById("txtNombreCliente").value = cliente.nombre;
    document.getElementById("txtDocumentoCliente").value = cliente.documento;
    document.getElementById("txtTelefonoCliente").value = cliente.telefono;

    document.getElementById("txtCorreoCliente").value = "";

    if (cliente.correo) {
        document.getElementById("txtCorreoCliente").value = cliente.correo;
    }

    document.getElementById("txtDireccionCliente").value = "";

    if (cliente.direccion) {
        document.getElementById("txtDireccionCliente").value = cliente.direccion;
    }

    document.getElementById("tituloFormCliente").textContent = "Editar cliente";
    document.getElementById("divListaClientes").style.display = "none";
    document.getElementById("divFormCliente").style.display = "block";
}

/*
  Elimina un cliente únicamente si no tiene alquileres
  relacionados. De esta forma no se rompe el historial.
*/
function fnBorrarCliente(id) {
    let cliente = fnBuscarCliente(id);

    if (cliente === null) {
        alert("No se encontró el cliente.");
        return;
    }

    for (let alquiler of g_alquileres) {
        if (Number(alquiler.clienteId) === Number(id)) {
            alert(
                "No se puede eliminar este cliente porque tiene alquileres registrados."
            );
            return;
        }
    }

    if (!confirm("¿Deseás eliminar al cliente " + cliente.nombre + "?")) {
        return;
    }

    g_clientes = g_clientes.filter(function (elemento) {
        return Number(elemento.id) !== Number(id);
    });

    fnGuardarClientes();
    fnRenderListaClientes();

    alert("Cliente eliminado correctamente.");
}

/*
  Cancela el formulario y regresa al listado de clientes.
*/
function fnCancelarCliente() {
    g_editClienteId = null;

    document.getElementById("divFormCliente").style.display = "none";
    document.getElementById("divListaClientes").style.display = "block";

    fnRenderListaClientes();
}

/*
  Dibuja la tabla de clientes.
  El filtro busca coincidencias en nombre, documento,
  teléfono y correo.
*/
function fnRenderListaClientes(filtro = "") {
    let divTabla = document.getElementById("divTablaClientes");

    if (divTabla === null) {
        return;
    }

    let busqueda = filtro.trim().toLowerCase();
    let filas = [];

    for (let cliente of g_clientes) {
        let textoCliente = (
            cliente.nombre + " " +
            cliente.documento + " " +
            cliente.telefono + " " +
            (cliente.correo || "")
        ).toLowerCase();

        if (!textoCliente.includes(busqueda)) {
            continue;
        }

        filas.push(`
            <tr>
                <td>${fnEscaparTexto(cliente.nombre)}</td>
                <td>${fnEscaparTexto(cliente.documento)}</td>
                <td>${fnEscaparTexto(cliente.telefono)}</td>
                <td>${fnEscaparTexto(cliente.correo || "")}</td>
                <td>
                    <button
                        type="button"
                        onclick="fnEditarCliente(${Number(cliente.id)})">
                        Editar
                    </button>

                    <button
                        type="button"
                        onclick="fnBorrarCliente(${Number(cliente.id)})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `);
    }

    if (filas.length === 0) {
        divTabla.innerHTML = "<p>No se encontraron clientes.</p>";
        return;
    }

    divTabla.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${filas.join("")}
            </tbody>
        </table>
    `;
}

/*
  Lee el campo de búsqueda y actualiza la tabla.
*/
function fnFiltrarListaClientes() {
    let campo = document.getElementById("txtFiltroCliente");
    let filtro = "";

    if (campo !== null) {
        filtro = campo.value;
    }

    fnRenderListaClientes(filtro);
}


/* =====================================================
   11. CONSTRUCTOR DE ALQUILERES
   ===================================================== */

/*
  Crea un registro de alquiler.
  El total se calcula multiplicando los días por el
  precio diario del vehículo.
*/
function Alquiler(
    clienteId,
    vehiculoId,
    fechaAlquiler,
    fechaDevolucionPrevista,
    precioPorDia
) {
    this.id = g_genIdAlquiler++;
    this.clienteId = Number(clienteId);
    this.vehiculoId = Number(vehiculoId);
    this.fechaAlquiler = fechaAlquiler;
    this.fechaDevolucionPrevista = fechaDevolucionPrevista;
    this.fechaDevolucionReal = null;
    this.precioPorDia = Number(precioPorDia);
    this.dias = fnCalcularDias(fechaAlquiler, fechaDevolucionPrevista);
    this.total = this.dias * this.precioPorDia;
    this.estado = "Activo";
}


/* =====================================================
   12. GUARDAR Y CARGAR ALQUILERES
   ===================================================== */

function fnGuardarAlquileres() {
    localStorage.setItem(
        g_claveAlquileres,
        JSON.stringify(g_alquileres)
    );
}

/*
  Carga el historial de alquileres.
  Luego reconstruye la disponibilidad de cada vehículo
  según los alquileres que continúan activos.
*/
function fnCargarAlquileres() {
    let datos = localStorage.getItem(g_claveAlquileres);

    if (datos !== null) {
        try {
            let alquileresGuardados = JSON.parse(datos);

            if (Array.isArray(alquileresGuardados)) {
                g_alquileres = alquileresGuardados;
            } else {
                g_alquileres = [];
            }
        } catch (error) {
            console.error("Error al cargar los alquileres:", error);
            g_alquileres = [];
        }
    } else {
        g_alquileres = [];
    }

    g_genIdAlquiler = 1;

    for (let alquiler of g_alquileres) {
        if (Number(alquiler.id) >= g_genIdAlquiler) {
            g_genIdAlquiler = Number(alquiler.id) + 1;
        }
    }

    // Primero consideramos disponibles todos los vehículos.
    for (let vehiculo of g_vehiculos) {
        vehiculo.disponibilidad = true;
    }

    // Los vehículos que tengan alquileres activos quedan ocupados.
    for (let alquiler of g_alquileres) {
        if (alquiler.estado === "Activo") {
            let vehiculo = fnBuscarVehiculo(alquiler.vehiculoId);

            if (vehiculo !== null) {
                vehiculo.disponibilidad = false;
            }
        }
    }

    fnGuardarVehiculos();
    fnRenderVehiculos();
    fnRenderListaVehiculos();
    fnRenderListaAlquileres();
}


/* =====================================================
   13. INICIAR UN ALQUILER
   ===================================================== */

/*
  Verifica que existan clientes y vehículos disponibles.
  Después prepara el formulario de alquiler.
*/
function fnNuevoAlquiler() {
    if (g_clientes.length === 0) {
        alert("Primero debés registrar al menos un cliente.");
        return;
    }

    let disponibles = [];

    for (let vehiculo of g_vehiculos) {
        if (vehiculo.disponibilidad === true) {
            disponibles.push(vehiculo);
        }
    }

    if (disponibles.length === 0) {
        alert("No hay vehículos disponibles para alquilar.");
        return;
    }

    fnCargarOpcionesAlquiler();

    document.getElementById("divListaAlquileres").style.display = "none";
    document.getElementById("divFormAlquiler").style.display = "block";

    let hoy = fnFechaActual();

    document.getElementById("txtFechaAlquiler").value = hoy;
    document.getElementById("txtFechaAlquiler").min = hoy;
    document.getElementById("txtFechaDevolucion").value = "";
    document.getElementById("txtFechaDevolucion").min = hoy;

    document.getElementById("resumenAlquiler").textContent =
        "Seleccioná un vehículo y las fechas para calcular el precio.";
}

/*
  Llena las listas desplegables con los clientes
  registrados y los vehículos disponibles.
*/
function fnCargarOpcionesAlquiler() {
    let selCliente = document.getElementById("selClienteAlquiler");
    let selVehiculo = document.getElementById("selVehiculoAlquiler");

    if (selCliente === null || selVehiculo === null) {
        return;
    }

    selCliente.innerHTML = '<option value="">Seleccionar cliente</option>';
    selVehiculo.innerHTML = '<option value="">Seleccionar vehículo</option>';

    for (let cliente of g_clientes) {
        selCliente.innerHTML +=
            '<option value="' + cliente.id + '">' +
            fnEscaparTexto(cliente.nombre) + " - " +
            fnEscaparTexto(cliente.documento) +
            "</option>";
    }

    for (let vehiculo of g_vehiculos) {
        if (vehiculo.disponibilidad === true) {
            selVehiculo.innerHTML +=
                '<option value="' + vehiculo.id + '">' +
                fnEscaparTexto(vehiculo.marca) + " " +
                fnEscaparTexto(vehiculo.modelo) + " - " +
                fnEscaparTexto(vehiculo.chapa) + " - " +
                fnFormatearGuaranies(vehiculo.precio) +
                "/día</option>";
        }
    }
}

/*
  Calcula el total al cambiar el vehículo o alguna fecha.
  Esta función se puede conectar a los eventos change
  de los campos del formulario.
*/
function fnCalcularTotalAlquiler() {
    let vehiculoId = document.getElementById("selVehiculoAlquiler").value;
    let fechaInicio = document.getElementById("txtFechaAlquiler").value;
    let fechaFin = document.getElementById("txtFechaDevolucion").value;
    let resumen = document.getElementById("resumenAlquiler");

    if (resumen === null) {
        return;
    }

    let vehiculo = fnBuscarVehiculo(vehiculoId);

    if (vehiculo === null || fechaInicio === "" || fechaFin === "") {
        resumen.textContent =
            "Seleccioná un vehículo y las fechas para calcular el precio.";
        return;
    }

    let dias = fnCalcularDias(fechaInicio, fechaFin);

    if (dias < 1) {
        resumen.textContent =
            "La fecha de devolución debe ser posterior a la fecha de alquiler.";
        return;
    }

    let total = dias * Number(vehiculo.precio);
    let textoDias = " días";

    if (dias === 1) {
        textoDias = " día";
    }

    resumen.textContent =
        "Duración: " + dias + textoDias +
        " | Precio por día: " + fnFormatearGuaranies(vehiculo.precio) +
        " | Total: " + fnFormatearGuaranies(total);
}

/*
  Guarda el alquiler luego de validar cliente, vehículo
  y fechas. También marca el vehículo como no disponible.
*/
function fnGuardarAlquiler(event) {
    event.preventDefault();

    let clienteId = Number(
        document.getElementById("selClienteAlquiler").value
    );

    let vehiculoId = Number(
        document.getElementById("selVehiculoAlquiler").value
    );

    let fechaInicio = document.getElementById("txtFechaAlquiler").value;
    let fechaFin = document.getElementById("txtFechaDevolucion").value;

    let cliente = fnBuscarCliente(clienteId);
    let vehiculo = fnBuscarVehiculo(vehiculoId);

    if (cliente === null || vehiculo === null) {
        alert("Seleccioná un cliente y un vehículo válidos.");
        return;
    }

    if (vehiculo.disponibilidad !== true) {
        alert("Este vehículo ya no está disponible.");
        fnCancelarAlquiler();
        return;
    }

    if (fechaInicio === "" || fechaFin === "") {
        alert("Completá las fechas del alquiler.");
        return;
    }

    let hoy = fnFechaActual();

    if (fechaInicio < hoy) {
        alert("La fecha de alquiler no puede estar en el pasado.");
        return;
    }

    let dias = fnCalcularDias(fechaInicio, fechaFin);

    if (dias < 1) {
        alert("La devolución debe ser al menos un día después del alquiler.");
        return;
    }

    let nuevoAlquiler = new Alquiler(
        clienteId,
        vehiculoId,
        fechaInicio,
        fechaFin,
        vehiculo.precio
    );

    let mensaje =
        "Cliente: " + cliente.nombre +
        "\nVehículo: " + vehiculo.marca + " " + vehiculo.modelo +
        "\nDuración: " + nuevoAlquiler.dias + " días" +
        "\nTotal: " + fnFormatearGuaranies(nuevoAlquiler.total) +
        "\n\n¿Confirmás el alquiler?";

    if (!confirm(mensaje)) {
        return;
    }

    g_alquileres.push(nuevoAlquiler);
    vehiculo.disponibilidad = false;

    fnGuardarAlquileres();
    fnGuardarVehiculos();

    fnCancelarAlquiler();
    fnRenderVehiculos();
    fnRenderListaVehiculos();
    fnRenderListaAlquileres();

    alert("Alquiler registrado correctamente.");
}

/*
  Cancela el formulario y vuelve a la lista de alquileres.
*/
function fnCancelarAlquiler() {
    document.getElementById("divFormAlquiler").style.display = "none";
    document.getElementById("divListaAlquileres").style.display = "block";

    document.getElementById("selClienteAlquiler").value = "";
    document.getElementById("selVehiculoAlquiler").value = "";
    document.getElementById("txtFechaAlquiler").value = "";
    document.getElementById("txtFechaDevolucion").value = "";

    let resumen = document.getElementById("resumenAlquiler");

    if (resumen !== null) {
        resumen.textContent = "";
    }

    fnRenderListaAlquileres();
}


/* =====================================================
   14. DATOS PARA MOSTRAR ALQUILERES
   ===================================================== */

/*
  Devuelve el nombre del cliente correspondiente a un ID.
*/
function fnObtenerNombreCliente(id) {
    let cliente = fnBuscarCliente(id);

    if (cliente !== null) {
        return cliente.nombre;
    }

    return "Cliente no encontrado";
}

/*
  Devuelve la marca, modelo y chapa del vehículo.
*/
function fnObtenerNombreVehiculo(id) {
    let vehiculo = fnBuscarVehiculo(id);

    if (vehiculo !== null) {
        return vehiculo.marca + " " + vehiculo.modelo +
            " (" + vehiculo.chapa + ")";
    }

    return "Vehículo no encontrado";
}


/* =====================================================
   15. LISTAR Y FILTRAR ALQUILERES
   ===================================================== */

/*
  Construye la tabla de alquileres.
  Los alquileres activos cuya devolución prevista ya
  pasó se muestran como vencidos, sin modificar el
  estado almacenado.
*/
function fnRenderListaAlquileres(filtro = "") {
    let tabla = document.getElementById("divTablaAlquileres");

    if (tabla === null) {
        return;
    }

    let busqueda = filtro.trim().toLowerCase();
    let filas = [];
    let hoy = fnFechaActual();

    for (let alquiler of g_alquileres) {
        let nombreCliente = fnObtenerNombreCliente(alquiler.clienteId);
        let nombreVehiculo = fnObtenerNombreVehiculo(alquiler.vehiculoId);

        let coincide =
            nombreCliente.toLowerCase().includes(busqueda) ||
            nombreVehiculo.toLowerCase().includes(busqueda);

        if (!coincide) {
            continue;
        }

        let estado = alquiler.estado;

        if (
            alquiler.estado === "Activo" &&
            alquiler.fechaDevolucionPrevista < hoy
        ) {
            estado = "Vencido";
        }

        let acciones = "Finalizado";

        if (alquiler.estado === "Activo") {
            acciones =
                '<button type="button" onclick="fnRegistrarDevolucion(' +
                Number(alquiler.id) + ')">Devolver</button>';
        }

        filas.push(`
            <tr>
                <td>${fnEscaparTexto(nombreCliente)}</td>
                <td>${fnEscaparTexto(nombreVehiculo)}</td>
                <td>${fnFormatearFecha(alquiler.fechaAlquiler)}</td>
                <td>${fnFormatearFecha(alquiler.fechaDevolucionPrevista)}</td>
                <td>${alquiler.dias}</td>
                <td>${fnFormatearGuaranies(alquiler.total)}</td>
                <td>${estado}</td>
                <td>${acciones}</td>
            </tr>
        `);
    }

    if (filas.length === 0) {
        tabla.innerHTML = "<p>No se encontraron alquileres.</p>";
        return;
    }

    tabla.innerHTML = `
        <div class="tabla-contenedor">
            <table class="tabla-vehiculos">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Vehículo</th>
                        <th>Inicio</th>
                        <th>Devolución prevista</th>
                        <th>Días</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas.join("")}
                </tbody>
            </table>
        </div>
    `;
}

/*
  Lee el campo de búsqueda de alquileres.
*/
function fnFiltrarAlquileres() {
    let campo = document.getElementById("txtFiltroAlquiler");
    let filtro = "";

    if (campo !== null) {
        filtro = campo.value;
    }

    fnRenderListaAlquileres(filtro);
}


/* =====================================================
   16. REGISTRAR UNA DEVOLUCIÓN
   ===================================================== */

/*
  Busca un alquiler activo, solicita la fecha real de
  devolución y libera el vehículo al confirmar.
*/
function fnRegistrarDevolucion(id) {
    let alquiler = null;

    for (let elemento of g_alquileres) {
        if (Number(elemento.id) === Number(id)) {
            alquiler = elemento;
            break;
        }
    }

    if (alquiler === null || alquiler.estado !== "Activo") {
        alert("Este alquiler ya fue finalizado o no existe.");
        return;
    }

    let fechaReal = prompt(
        "Ingresá la fecha real de devolución (AAAA-MM-DD):",
        fnFechaActual()
    );

    if (fechaReal === null) {
        return;
    }

    fechaReal = fechaReal.trim();

    // Comprueba primero el formato de la fecha.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaReal)) {
        alert("La fecha debe tener el formato AAAA-MM-DD.");
        return;
    }

    // Comprueba que la fecha exista realmente en el calendario.
    let fecha = new Date(fechaReal + "T00:00:00Z");

    if (
        isNaN(fecha.getTime()) ||
        fecha.toISOString().slice(0, 10) !== fechaReal
    ) {
        alert("La fecha ingresada no es válida.");
        return;
    }

    if (fechaReal < alquiler.fechaAlquiler) {
        alert("La devolución no puede ser anterior al alquiler.");
        return;
    }

    if (!confirm("¿Confirmás la devolución del vehículo?\nFecha: " + fechaReal)) {
        return;
    }

    alquiler.fechaDevolucionReal = fechaReal;
    alquiler.estado = "Devuelto";

    let vehiculo = fnBuscarVehiculo(alquiler.vehiculoId);

    if (vehiculo !== null) {
        vehiculo.disponibilidad = true;
    }

    fnGuardarAlquileres();
    fnGuardarVehiculos();

    fnRenderVehiculos();
    fnRenderListaVehiculos();
    fnRenderListaAlquileres();

    alert("Devolución registrada correctamente.");
}


/* =====================================================
   17. INFORME DE ALQUILERES POR FECHA
   ===================================================== */

/*
  Genera un informe de los alquileres cuya fecha de
  inicio está dentro del período seleccionado.
  El total general representa la suma de los importes
  registrados en esos alquileres.
*/
function fnGenerarInformeFechas(event) {
    event.preventDefault();

    let desde = document.getElementById("txtInformeDesde").value;
    let hasta = document.getElementById("txtInformeHasta").value;
    let resultado = document.getElementById("resultadoInformeFechas");

    if (resultado === null) {
        return;
    }

    if (desde === "" || hasta === "") {
        alert("Debés seleccionar las dos fechas.");
        return;
    }

    if (desde > hasta) {
        alert("La fecha inicial no puede ser posterior a la fecha final.");
        return;
    }

    let alquileresEncontrados = [];

    for (let alquiler of g_alquileres) {
        if (
            alquiler.fechaAlquiler >= desde &&
            alquiler.fechaAlquiler <= hasta
        ) {
            alquileresEncontrados.push(alquiler);
        }
    }

    let buff = "";

    buff += '<div class="tabla-informe">';
    buff += "<h4>Período: " + fnFormatearFecha(desde) +
        " al " + fnFormatearFecha(hasta) + "</h4>";

    buff += "<p>Alquileres encontrados: " +
        alquileresEncontrados.length + "</p>";

    if (alquileresEncontrados.length === 0) {
        buff += "<p>No existen alquileres registrados en este período.</p>";
        buff += "</div>";

        resultado.innerHTML = buff;
        return;
    }

    buff += "<table><thead><tr>";
    buff += "<th>Cliente</th>";
    buff += "<th>Vehículo</th>";
    buff += "<th>Chapa</th>";
    buff += "<th>Fecha de alquiler</th>";
    buff += "<th>Devolución prevista</th>";
    buff += "<th>Estado</th>";
    buff += "<th>Total</th>";
    buff += "</tr></thead><tbody>";

    let totalGeneral = 0;

    for (let alquiler of alquileresEncontrados) {
        let cliente = fnBuscarCliente(alquiler.clienteId);
        let vehiculo = fnBuscarVehiculo(alquiler.vehiculoId);

        let nombreCliente = "Cliente no encontrado";
        let nombreVehiculo = "Vehículo no encontrado";
        let chapa = "-";

        if (cliente !== null) {
            nombreCliente = cliente.nombre;
        }

        if (vehiculo !== null) {
            nombreVehiculo = vehiculo.marca + " " + vehiculo.modelo;
            chapa = vehiculo.chapa;
        }

        buff += "<tr>";
        buff += "<td>" + fnEscaparTexto(nombreCliente) + "</td>";
        buff += "<td>" + fnEscaparTexto(nombreVehiculo) + "</td>";
        buff += "<td>" + fnEscaparTexto(chapa) + "</td>";
        buff += "<td>" + fnFormatearFecha(alquiler.fechaAlquiler) + "</td>";
        buff += "<td>" + fnFormatearFecha(alquiler.fechaDevolucionPrevista) + "</td>";
        buff += "<td>" + fnEscaparTexto(alquiler.estado) + "</td>";
        buff += "<td>" + fnFormatearGuaranies(alquiler.total) + "</td>";
        buff += "</tr>";

        totalGeneral += Number(alquiler.total);
    }

    buff += "</tbody></table>";

    buff += '<div class="total-informe">';
    buff += "<strong>Total de los alquileres: " +
        fnFormatearGuaranies(totalGeneral) + "</strong>";
    buff += "</div></div>";

    resultado.innerHTML = buff;
}


/* =====================================================
   18. INFORME DE ALQUILERES VENCIDOS
   ===================================================== */

/*
  Busca los alquileres que siguen activos y cuya fecha
  de devolución prevista ya pasó.
  No modifica el estado de los alquileres.
*/
function fnGenerarInformeVencidos() {
    let resultado = document.getElementById("resultadoInformeVencidos");

    if (resultado === null) {
        return;
    }

    let hoy = fnFechaActual();
    let vencidos = [];

    for (let alquiler of g_alquileres) {
        if (
            alquiler.estado === "Activo" &&
            alquiler.fechaDevolucionPrevista < hoy
        ) {
            vencidos.push(alquiler);
        }
    }

    let buff = "";

    buff += '<div class="tabla-informe">';
    buff += "<h4>Fecha de consulta: " + fnFormatearFecha(hoy) + "</h4>";
    buff += "<p>Alquileres vencidos sin devolución: " +
        vencidos.length + "</p>";

    if (vencidos.length === 0) {
        buff += "<p>No hay alquileres vencidos pendientes de devolución.</p>";
        buff += "</div>";

        resultado.innerHTML = buff;
        return;
    }

    buff += "<table><thead><tr>";
    buff += "<th>Cliente</th>";
    buff += "<th>Documento</th>";
    buff += "<th>Teléfono</th>";
    buff += "<th>Vehículo</th>";
    buff += "<th>Chapa</th>";
    buff += "<th>Devolución prevista</th>";
    buff += "<th>Días de retraso</th>";
    buff += "</tr></thead><tbody>";

    for (let alquiler of vencidos) {
        let cliente = fnBuscarCliente(alquiler.clienteId);
        let vehiculo = fnBuscarVehiculo(alquiler.vehiculoId);

        let nombreCliente = "Cliente no encontrado";
        let documento = "-";
        let telefono = "-";
        let nombreVehiculo = "Vehículo no encontrado";
        let chapa = "-";

        if (cliente !== null) {
            nombreCliente = cliente.nombre;
            documento = cliente.documento;
            telefono = cliente.telefono;
        }

        if (vehiculo !== null) {
            nombreVehiculo = vehiculo.marca + " " + vehiculo.modelo;
            chapa = vehiculo.chapa;
        }

        let diasRetraso = fnCalcularDias(
            alquiler.fechaDevolucionPrevista,
            hoy
        );

        buff += "<tr>";
        buff += "<td>" + fnEscaparTexto(nombreCliente) + "</td>";
        buff += "<td>" + fnEscaparTexto(documento) + "</td>";
        buff += "<td>" + fnEscaparTexto(telefono) + "</td>";
        buff += "<td>" + fnEscaparTexto(nombreVehiculo) + "</td>";
        buff += "<td>" + fnEscaparTexto(chapa) + "</td>";
        buff += "<td>" +
            fnFormatearFecha(alquiler.fechaDevolucionPrevista) + "</td>";
        buff += "<td>" + diasRetraso + "</td>";
        buff += "</tr>";
    }

    buff += "</tbody></table></div>";

    resultado.innerHTML = buff;
}


/* =====================================================
   19. GUARDAR Y CARGAR USUARIOS
   ===================================================== */

/*
  Guarda la lista de usuarios en localStorage.
*/
function fnGuardarUsuarios() {
    localStorage.setItem(
        g_claveUsuarios,
        JSON.stringify(g_usuarios)
    );
}

/*
  Recupera los usuarios guardados.
  Si todavía no existe ninguno, crea una cuenta inicial.
  Finalmente determina el siguiente ID disponible.
*/
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

    if (g_usuarios.length === 0) {
        g_usuarios.push({
            id: 1,
            nombre: "Administrador",
            usuario: "admin",
            password: "Meyana2026!"
        });
    }

    g_genIdUsuario = 1;

    for (let usuario of g_usuarios) {
        if (Number(usuario.id) >= g_genIdUsuario) {
            g_genIdUsuario = Number(usuario.id) + 1;
        }
    }

    fnGuardarUsuarios();
}


/* =====================================================
   20. INICIAR SESIÓN
   ===================================================== */

/*
  Comprueba las credenciales ingresadas.
  Si coinciden con un usuario registrado, guarda el ID
  de la sesión y actualiza la interfaz.
*/
function fnIniciarSesion(event) {
    event.preventDefault();

    let campoUsuario = document.getElementById("txtUsuarioLogin");
    let campoPassword = document.getElementById("txtPasswordLogin");
    let mensaje = document.getElementById("mensajeLogin");

    if (
        campoUsuario === null ||
        campoPassword === null ||
        mensaje === null
    ) {
        return;
    }

    let nombreUsuario = campoUsuario.value.trim().toLowerCase();
    let password = campoPassword.value;
    let usuarioEncontrado = null;

    for (let usuario of g_usuarios) {
        if (
            String(usuario.usuario).toLowerCase() === nombreUsuario &&
            usuario.password === password
        ) {
            usuarioEncontrado = usuario;
            break;
        }
    }

    if (usuarioEncontrado === null) {
        mensaje.textContent = "Usuario o contraseña incorrectos.";
        campoPassword.value = "";
        return;
    }

    g_usuarioActual = usuarioEncontrado;

    localStorage.setItem(
        g_claveSesion,
        String(g_usuarioActual.id)
    );

    mensaje.textContent = "";
    campoPassword.value = "";

    fnAplicarSesion();
}


/* =====================================================
   21. CONTROL DE SESIÓN
   ===================================================== */

/*
  Actualiza la interfaz según exista o no una sesión.
  classList.add agrega una clase CSS al elemento.
  classList.remove quita una clase CSS.
*/
function fnAplicarSesion() {
    if (g_usuarioActual !== null) {
        document.body.classList.add("sesion-iniciada");

        let nombreActual = document.getElementById(
            "nombreUsuarioActual"
        );

        if (nombreActual !== null) {
            nombreActual.textContent = g_usuarioActual.nombre;
        }

        fnRenderListaUsuarios();
    } else {
        document.body.classList.remove("sesion-iniciada");
    }
}

/*
  Restaura la sesión al volver a abrir o recargar la página.
  Se guarda el ID del usuario, no el objeto completo.
*/
function fnRestaurarSesion() {
    let idSesion = localStorage.getItem(g_claveSesion);

    g_usuarioActual = null;

    if (idSesion !== null) {
        for (let usuario of g_usuarios) {
            if (Number(usuario.id) === Number(idSesion)) {
                g_usuarioActual = usuario;
                break;
            }
        }
    }

    if (g_usuarioActual === null) {
        localStorage.removeItem(g_claveSesion);
    }

    fnAplicarSesion();
}

/*
  Cierra la sesión actual y limpia los campos del login.
*/
function fnCerrarSesion() {
    localStorage.removeItem(g_claveSesion);
    g_usuarioActual = null;

    let campoUsuario = document.getElementById("txtUsuarioLogin");
    let campoPassword = document.getElementById("txtPasswordLogin");
    let mensaje = document.getElementById("mensajeLogin");

    if (campoUsuario !== null) {
        campoUsuario.value = "";
    }

    if (campoPassword !== null) {
        campoPassword.value = "";
    }

    if (mensaje !== null) {
        mensaje.textContent = "";
    }

    fnAplicarSesion();
    window.scrollTo(0, 0);
}


/* =====================================================
   22. LISTAR Y FILTRAR USUARIOS
   ===================================================== */

/*
  Dibuja la tabla de usuarios.
  El filtro permite buscar por nombre o nombre de usuario.
*/
function fnRenderListaUsuarios(filtro = "") {
    let contenedor = document.getElementById("divTablaUsuarios");

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

/*
  Obtiene el texto del campo de búsqueda y actualiza
  el listado de usuarios.
*/
function fnFiltrarUsuarios() {
    let campo = document.getElementById("txtFiltroUsuario");
    let filtro = "";

    if (campo !== null) {
        filtro = campo.value;
    }

    fnRenderListaUsuarios(filtro);
}


/* =====================================================
   23. FORMULARIO DE USUARIOS
   ===================================================== */

/*
  Prepara el formulario para crear un usuario.
*/
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

/*
  Busca el usuario seleccionado y carga sus datos
  en el formulario para modificarlos.
*/
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
   24. GUARDAR O EDITAR USUARIO
   ===================================================== */

/*
  Valida los datos antes de crear un usuario o actualizar
  uno existente.
  Al editar, una contraseña vacía conserva la anterior.
*/
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

    // Evita registrar dos usuarios con el mismo nombre de usuario.
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
        let nuevoUsuario = {
            id: g_genIdUsuario,
            nombre: nombre,
            usuario: nombreUsuario,
            password: password
        };

        g_usuarios.push(nuevoUsuario);
        g_genIdUsuario++;
    } else {
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

    // Actualiza el usuario de la sesión si sus datos cambiaron.
    if (g_usuarioActual !== null) {
        for (let usuario of g_usuarios) {
            if (Number(usuario.id) === Number(g_usuarioActual.id)) {
                g_usuarioActual = usuario;
                break;
            }
        }
    }

    fnAplicarSesion();
    fnCancelarUsuario();

    alert("Usuario guardado correctamente.");
}


/* =====================================================
   25. CANCELAR FORMULARIO DE USUARIOS
   ===================================================== */

/*
  Limpia el formulario y vuelve al listado.
*/
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
   26. ELIMINAR USUARIO
   ===================================================== */

/*
  Impide eliminar al usuario que tiene la sesión iniciada
  y evita que el sistema se quede sin usuarios.
*/
function fnEliminarUsuario(id) {
    if (
        g_usuarioActual !== null &&
        Number(g_usuarioActual.id) === Number(id)
    ) {
        alert("No podés eliminar el usuario con el que iniciaste sesión.");
        return;
    }

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


/* =====================================================
   27. INICIALIZACIÓN DEL SISTEMA
   Este bloque debe aparecer una sola vez, al final
   del archivo, después de todas las funciones.
   ===================================================== */

/*
  El orden importa:
  1. Cargar vehículos.
  2. Cargar clientes.
  3. Cargar alquileres y reconstruir disponibilidad.
  4. Cargar usuarios.
  5. Restaurar la sesión.
*/
function fnInicializarSistema() {
    fnCargarVehiculos();
    fnCargarClientes();
    fnCargarAlquileres();
    fnCargarUsuarios();
    fnRestaurarSesion();

    fnRenderVehiculos();
    fnRenderListaVehiculos();
    fnRenderListaClientes();
    fnRenderListaAlquileres();
}

/*
  Espera a que el HTML esté cargado antes de buscar
  sus elementos.
  DOMContentLoaded es un evento que se dispara cuando
  el documento HTML ya fue procesado.
*/
document.addEventListener("DOMContentLoaded", function () {
    fnInicializarSistema();
});
