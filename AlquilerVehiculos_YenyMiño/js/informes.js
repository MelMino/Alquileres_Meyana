
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
