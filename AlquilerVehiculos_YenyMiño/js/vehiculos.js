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

                    <button class="btn-eliminar"
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