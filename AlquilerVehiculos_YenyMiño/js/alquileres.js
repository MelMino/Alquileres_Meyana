
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
    alquiler.estado = "devuelto";

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
