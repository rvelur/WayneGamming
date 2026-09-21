/**
 * ============================================================================
 * FUNCIONALIDADES:
 *  - Carga asíncrona mediante Fetch API de JSON local con manejo de errores.
 *  - Renderizado dinámico en el DOM usando componentes Cards de Bootstrap 5.
 *  - Gestión de eventos: 'click' (agregar/quitar items) y 'submit' (búsqueda).
 *  - Carrito de compras reactivo con persistencia opcional en memoria.
 * ============================================================================
 */

// Estado global de la aplicación
let productosGlobales = [];
let carrito = [];

// Elementos del DOM
const contenedorProductos = document.getElementById('contenedorProductos');
const mensajeError = document.getElementById('mensajeError');
const contadorJuegos = document.getElementById('contadorJuegos');
const formBusqueda = document.getElementById('formBusqueda');
const inputBuscar = document.getElementById('inputBuscar');
const cartCount = document.getElementById('cartCount');
const itemsCarrito = document.getElementById('itemsCarrito');
const precioTotal = document.getElementById('precioTotal');
const btnComprarTodo = document.getElementById('btnComprarTodo');
const btnVaciarCarrito = document.getElementById('btnVaciarCarrito');
const btnVerTodos = document.getElementById('btnVerTodos');

/**
 * Función 1: Obtiene datos del archivo JSON local mediante Fetch API
 * Incluye gestión de errores.
 */
async function cargarProductos() {
    try {
        const respuesta = await fetch('data/productos.json');
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        productosGlobales = datos;
        
        // Renderizado inicial
        mostrarProductos(productosGlobales);
        actualizarContador(productosGlobales.length);

    } catch (error) {
        console.error('Fallo al obtener los productos:', error);
        mostrarError('No fue posible contactar los servidores de WayneTech. Por favor, intenta de nuevo más tarde.');
    }
}

/**
 * Función 2: Renderiza tarjetas en el DOM con Bootstrap 5
 * @param {Array} lista - Array de objetos de productos
 */
function mostrarProductos(lista) {
    contenedorProductos.innerHTML = '';

    if (lista.length === 0) {
        contenedorProductos.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search text-secondary display-3"></i>
                <p class="text-secondary mt-3 fs-5">No se encontraron expedientes con ese criterio.</p>
            </div>
        `;
        return;
    }

    lista.forEach(producto => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4 d-flex';

        col.innerHTML = `
            <article class="card card-batman w-100 d-flex flex-column text-light">
                <div class="position-relative">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.titulo}">
                    <span class="badge bg-danger position-absolute top-0 end-0 m-2">${producto.badge}</span>
                </div>
                <div class="card-body d-flex flex-column">
                    <span class="text-warning text-uppercase small fw-bold">${producto.categoria}</span>
                    <h3 class="h5 card-title fw-bold mt-1 text-white">${producto.titulo}</h3>
                    <p class="card-text text-secondary small flex-grow-1">${producto.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                        <span class="fs-5 fw-bold text-warning">$${producto.precio.toLocaleString('es-CL')}</span>
                        <!-- Evento click delegado o asignado con data-id -->
                        <button class="btn btn-warning btn-sm fw-bold btn-agregar" data-id="${producto.id}">
                            <i class="bi bi-cart-plus"></i> Añadir
                        </button>
                    </div>
                </div>
            </article>
        `;
        contenedorProductos.appendChild(col);
    });

    // Asignar listeners a los botones generados
    asignarEventosAgregar();
}

/**
 * Función 3: Asigna el evento 'click' a los botones "Añadir"
 */
function asignarEventosAgregar() {
    const botones = document.querySelectorAll('.btn-agregar');
    botones.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            agregarAlCarrito(id);
        });
    });
}

/**
 * Función 4: Lógica de agregado al carrito y manipulación del DOM
 * @param {number} id - Identificador del producto
 */
function agregarAlCarrito(id) {
    const producto = productosGlobales.find(p => p.id === id);
    if (!producto) return;

    // Verificar si ya existe en el carrito
    const existe = carrito.find(item => item.id === id);
    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarritoDOM();
}

/**
 * Función 5: Renderiza el resumen dinámico del carrito en el DOM
 */
function actualizarCarritoDOM() {
    // Actualizar badge contador
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cartCount.textContent = totalUnidades;

    // Calcular precio total
    const totalDinero = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    precioTotal.textContent = `$${totalDinero.toLocaleString('es-CL')}`;

    // Habilitar o deshabilitar botón de compra
    btnComprarTodo.disabled = carrito.length === 0;

    // Generar vista en el Offcanvas
    if (carrito.length === 0) {
        itemsCarrito.innerHTML = '<p class="text-secondary text-center my-4">Tu bat-carrito está vacío.</p>';
        return;
    }

    itemsCarrito.innerHTML = '';
    carrito.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item d-flex justify-content-between align-items-center';
        itemDiv.innerHTML = `
            <div>
                <h6 class="mb-0 text-white small fw-bold">${item.titulo}</h6>
                <span class="text-secondary small">$${item.precio.toLocaleString('es-CL')} x ${item.cantidad}</span>
            </div>
            <div class="d-flex align-items-center gap-2">
                <span class="fw-bold text-warning small">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                <button class="btn btn-sm btn-outline-danger py-0 px-1 btn-eliminar" data-id="${item.id}" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        itemsCarrito.appendChild(itemDiv);
    });

    // Listeners para eliminar producto
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            eliminarDelCarrito(id);
        });
    });
}

/**
 * Función 6: Elimina un producto específico del carrito
 * @param {number} id 
 */
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarritoDOM();
}

/**
 * Función 7: Muestra mensaje amigable en pantalla si falla la Fetch API
 * @param {string} mensaje 
 */
function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.classList.remove('d-none');
    contadorJuegos.textContent = 'Error al cargar';
}

/**
 * Función 8: Actualiza el texto de conteo de productos
 * @param {number} cantidad 
 */
function actualizarContador(cantidad) {
    contadorJuegos.textContent = `${cantidad} juegos disponibles`;
}

/* ==========================================================================
   GESTIÓN DE EVENTOS (CLICK Y SUBMIT)
   ========================================================================== */

// Evento SUBMIT: Búsqueda dinámica sin recargar página
formBusqueda.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recarga del navegador
    const termino = inputBuscar.value.trim().toLowerCase();
    
    const filtrados = productosGlobales.filter(juego => 
        juego.titulo.toLowerCase().includes(termino) || 
        juego.categoria.toLowerCase().includes(termino)
    );

    mostrarProductos(filtrados);
    actualizarContador(filtrados.length);
});

// Evento CLICK: Filtros por categoría en el dropdown
document.querySelectorAll('.filtro-categoria').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
        e.preventDefault();
        const categoria = e.target.getAttribute('data-cat');
        
        if (categoria === 'Todas') {
            mostrarProductos(productosGlobales);
            actualizarContador(productosGlobales.length);
        } else {
            const filtrados = productosGlobales.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
            mostrarProductos(filtrados);
            actualizarContador(filtrados.length);
        }
    });
});

// Evento CLICK: Botón para restablecer el catálogo completo
btnVerTodos.addEventListener('click', (e) => {
    e.preventDefault();
    inputBuscar.value = '';
    mostrarProductos(productosGlobales);
    actualizarContador(productosGlobales.length);
});

// Evento CLICK: Vaciar todo el carrito
btnVaciarCarrito.addEventListener('click', () => {
    carrito = [];
    actualizarCarritoDOM();
});

// Evento CLICK: Finalizar compra simulada
btnComprarTodo.addEventListener('click', () => {
    alert('🦇 ¡Transacción autorizada por Wayne Enterprises! Tus bat-keys han sido enviadas.');
    carrito = [];
    actualizarCarritoDOM();
    // Cerrar offcanvas mediante API de Bootstrap
    const offcanvasEl = document.getElementById('offcanvasCart');
    const offcanvasInstancia = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (offcanvasInstancia) offcanvasInstancia.hide();
});

// Carga inicial al parsear el documento
document.addEventListener('DOMContentLoaded', cargarProductos);