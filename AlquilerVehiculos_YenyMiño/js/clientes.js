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
  localStorage.setItem(g_claveClientes, JSON.stringify(g_clientes));
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
      direccion,
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

    // Verificar si el cliente tiene algún alquiler activo.
    for (let alquiler of g_alquileres) {
        let estado = String(alquiler.estado || "")
            .trim()
            .toLowerCase();

        if (
            Number(alquiler.clienteId) === Number(id) &&
            estado !== "devuelto"
        ) {
            alert(
                "No se puede eliminar este cliente porque tiene un alquiler pendiente de devolución."
            );
            return;
        }
    }

    // Confirmar la eliminación.
    if (!confirm(
        "¿Deseás eliminar al cliente " + cliente.nombre + "?"
    )) {
        return;
    }

    // Eliminar el cliente.
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
      cliente.nombre +
      " " +
      cliente.documento +
      " " +
      cliente.telefono +
      " " +
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

                    <button class="btn-eliminar"
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
