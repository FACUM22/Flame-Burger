const API_BASE_URL =
    (
        window.FLAME_API_URL ||
        "http://localhost:3000"
    ).replace(
        /\/$/,
        ""
    );

const API_PRODUCTOS =
    API_BASE_URL +
    "/api/productos";

const API_CATEGORIAS =
    API_BASE_URL +
    "/api/categorias";


let productos = [];
let categorias = [];

let categoriaActual = "todas";

let carrito =
    JSON.parse(
        localStorage.getItem(
            "flameCarrito"
        )
    ) || [];


// =====================================================
// ELEMENTOS
// =====================================================

const contenedorProductos =
    document.getElementById(
        "productos"
    );

const contenedorCategorias =
    document.getElementById(
        "categoriasMenu"
    );

const cantidadCarrito =
    document.getElementById(
        "cantidadCarrito"
    );

const itemsCarrito =
    document.getElementById(
        "itemsCarrito"
    );

const totalCarrito =
    document.getElementById(
        "totalCarrito"
    );

const carritoOverlay =
    document.getElementById(
        "carritoOverlay"
    );


// =====================================================
// CARGAR CATEGORÍAS
// =====================================================

async function cargarCategorias() {

    try {

        const respuesta =
            await fetch(
                API_CATEGORIAS
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las categorías."
            );

        }


        const datos =
            await respuesta.json();


        categorias =
            datos.filter(
                categoria =>
                    categoria.activa === true
            );


        mostrarCategorias();


    } catch (error) {

        console.error(
            "Error categorías:",
            error
        );

    }

}


// =====================================================
// MOSTRAR CATEGORÍAS
// =====================================================

function mostrarCategorias() {

    contenedorCategorias.innerHTML = "";


    // Todos

    const todos =
        document.createElement(
            "button"
        );


    todos.type =
        "button";


    todos.className =
        "categoria-btn active";


    todos.dataset.categoria =
        "todas";


    todos.textContent =
        "Todos";


    todos.addEventListener(
        "click",
        () => {

            seleccionarCategoria(
                "todas"
            );

        }
    );


    contenedorCategorias.appendChild(
        todos
    );


    // Categorías

    categorias.forEach(
        categoria => {

            const boton =
                document.createElement(
                    "button"
                );


            boton.type =
                "button";


            boton.className =
                "categoria-btn";


            boton.dataset.categoria =
                String(
                    categoria.id
                );


            boton.textContent =
                categoria.nombre;


            boton.addEventListener(
                "click",
                () => {

                    seleccionarCategoria(
                        categoria.id
                    );

                }
            );


            contenedorCategorias.appendChild(
                boton
            );

        }
    );

}


// =====================================================
// SELECCIONAR CATEGORÍA
// =====================================================

function seleccionarCategoria(
    categoriaId
) {

    categoriaActual =
        String(
            categoriaId
        );


    document
        .querySelectorAll(
            ".categoria-btn"
        )
        .forEach(
            boton => {

                boton.classList.remove(
                    "active"
                );

            }
        );


    const botonActivo =
        document.querySelector(
            `[data-categoria="${categoriaActual}"]`
        );


    if (botonActivo) {

        botonActivo.classList.add(
            "active"
        );

    }


    mostrarProductos();

}


// =====================================================
// CARGAR PRODUCTOS
// =====================================================

async function cargarProductos() {

    try {

        const respuesta =
            await fetch(
                API_PRODUCTOS
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los productos."
            );

        }


        const datos =
            await respuesta.json();


        if (
            !Array.isArray(datos)
        ) {

            throw new Error(
                "La API no devolvió una lista."
            );

        }


        // Solo productos disponibles

        productos =
            datos.filter(
                producto =>
                    producto.disponible === true
            );


        mostrarProductos();


    } catch (error) {

        console.error(
            "Error productos:",
            error
        );


        contenedorProductos.innerHTML = `

            <div
                class="error-productos"
            >

                <div>
                    ⚠️
                </div>

                <h3>
                    No se pudo cargar el menú
                </h3>

                <p>
                    Intentá nuevamente.
                </p>

                <button
                    type="button"
                    onclick="cargarProductos()"
                >
                    🔄 Reintentar
                </button>

            </div>

        `;

    }

}


// =====================================================
// MOSTRAR PRODUCTOS
// =====================================================

function mostrarProductos() {

    contenedorProductos.innerHTML =
        "";


    let filtrados =
        productos;


    if (
        categoriaActual !==
        "todas"
    ) {

        filtrados =
            productos.filter(
                producto =>
                    String(
                        producto.categoria_id
                    ) ===
                    categoriaActual
            );

    }


    if (
        filtrados.length === 0
    ) {

        contenedorProductos.innerHTML = `

            <div
                class="sin-productos"
            >

                <div>
                    🍔
                </div>

                <h3>
                    No hay productos
                </h3>

                <p>
                    No hay productos disponibles
                    en esta categoría.
                </p>

            </div>

        `;

        return;
    }


    filtrados.forEach(
        producto => {

            crearTarjetaProducto(
                producto
            );

        }
    );

}


// =====================================================
// CREAR TARJETA
// =====================================================

function crearTarjetaProducto(
    producto
) {

    const tarjeta =
        document.createElement(
            "article"
        );


    tarjeta.className =
        "producto";


    let imagenHTML = `

        <div class="producto-sin-imagen">
            🍔
        </div>

    `;


    if (
        producto.imagen
    ) {

        let imagenURL =
            producto.imagen;


        if (
            imagenURL.startsWith(
                "http://"
            ) ||
            imagenURL.startsWith(
                "https://"
            )
        ) {

            // Ya es una URL completa

        } else if (
            imagenURL.startsWith("/")
        ) {

            imagenURL =
                API_BASE_URL +
                imagenURL;

        } else {

            imagenURL =
                API_BASE_URL +
                "/" +
                imagenURL;

        }


        imagenHTML = `

            <img
                src="${imagenURL}"
                alt="${escaparHTML(
                    producto.nombre
                )}"
                onerror="imagenFallback(this)"
            >

        `;

    }


    tarjeta.innerHTML = `

        <div class="producto-imagen">

            ${imagenHTML}

        </div>


        <div class="producto-contenido">


            <span class="categoria">

                ${escaparHTML(
                    producto.categoria ||
                    ""
                )}

            </span>


            <h3>

                ${escaparHTML(
                    producto.nombre
                )}

            </h3>


            <p>

                ${escaparHTML(
                    producto.descripcion ||
                    ""
                )}

            </p>


            <div
                class="producto-bottom"
            >

                <strong>

                    $${Number(
                        producto.precio
                    ).toLocaleString(
                        "es-UY"
                    )}

                </strong>


                <button
                    type="button"
                    class="agregar-btn"
                >

                    +

                </button>


            </div>


        </div>

    `;


    tarjeta
        .querySelector(
            ".agregar-btn"
        )
        .addEventListener(
            "click",
            () => {

                agregarAlCarrito(
                    producto
                );

            }
        );


    contenedorProductos.appendChild(
        tarjeta
    );

}


// =====================================================
// IMAGEN FALLBACK
// =====================================================

function imagenFallback(
    imagen
) {

    imagen.style.display =
        "none";


    imagen.parentElement.innerHTML = `

        <div class="producto-sin-imagen">
            🍔
        </div>

    `;

}


// =====================================================
// AGREGAR AL CARRITO
// =====================================================

function agregarAlCarrito(
    producto
) {

    const existente =
        carrito.find(
            item =>
                item.producto_id ===
                producto.id
        );


    if (existente) {

        existente.cantidad +=
            1;

    } else {

        carrito.push({

            producto_id:
                producto.id,

            nombre:
                producto.nombre,

            precio:
                Number(
                    producto.precio
                ),

            imagen:
                producto.imagen,

            cantidad:
                1

        });

    }


    guardarCarrito();

    actualizarCarrito();

    abrirCarrito();

}


// =====================================================
// GUARDAR CARRITO
// =====================================================

function guardarCarrito() {

    localStorage.setItem(
        "flameCarrito",
        JSON.stringify(
            carrito
        )
    );

}


// =====================================================
// ACTUALIZAR CARRITO
// =====================================================

function actualizarCarrito() {

    itemsCarrito.innerHTML =
        "";


    let total =
        0;

    let cantidadTotal =
        0;


    if (
        carrito.length === 0
    ) {

        itemsCarrito.innerHTML = `

            <div class="carrito-vacio">

                <div>
                    🛒
                </div>

                <p>
                    Tu carrito está vacío.
                </p>

            </div>

        `;

    }


    carrito.forEach(
        item => {

            const subtotal =
                item.precio *
                item.cantidad;


            total +=
                subtotal;


            cantidadTotal +=
                item.cantidad;


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "carrito-item";


            elemento.innerHTML = `

                <div>

                    <strong>
                        ${escaparHTML(
                            item.nombre
                        )}
                    </strong>

                    <small>
                        $${Number(
                            item.precio
                        ).toLocaleString(
                            "es-UY"
                        )}
                    </small>

                </div>


                <div class="cantidad">


                    <button
                        type="button"
                        class="menos"
                    >
                        −
                    </button>


                    <span>
                        ${item.cantidad}
                    </span>


                    <button
                        type="button"
                        class="mas"
                    >
                        +
                    </button>


                </div>

            `;


            elemento
                .querySelector(
                    ".menos"
                )
                .addEventListener(
                    "click",
                    () => {

                        cambiarCantidad(
                            item.producto_id,
                            -1
                        );

                    }
                );


            elemento
                .querySelector(
                    ".mas"
                )
                .addEventListener(
                    "click",
                    () => {

                        cambiarCantidad(
                            item.producto_id,
                            1
                        );

                    }
                );


            itemsCarrito.appendChild(
                elemento
            );

        }
    );


    totalCarrito.textContent =
        "$" +
        total.toLocaleString(
            "es-UY"
        );


    cantidadCarrito.textContent =
        cantidadTotal;

}


// =====================================================
// CAMBIAR CANTIDAD
// =====================================================

function cambiarCantidad(
    productoId,
    cambio
) {

    const item =
        carrito.find(
            producto =>
                producto.producto_id ===
                productoId
        );


    if (!item) {
        return;
    }


    item.cantidad +=
        cambio;


    if (
        item.cantidad <= 0
    ) {

        carrito =
            carrito.filter(
                producto =>
                    producto.producto_id !==
                    productoId
            );

    }


    guardarCarrito();

    actualizarCarrito();

}


// =====================================================
// ABRIR CARRITO
// =====================================================

function abrirCarrito() {

    carritoOverlay.classList.add(
        "show"
    );

}


// =====================================================
// CERRAR CARRITO
// =====================================================

function cerrarCarrito() {

    carritoOverlay.classList.remove(
        "show"
    );

}


document
    .getElementById(
        "abrirCarrito"
    )
    .addEventListener(
        "click",
        abrirCarrito
    );


document
    .getElementById(
        "cerrarCarrito"
    )
    .addEventListener(
        "click",
        cerrarCarrito
    );


// =====================================================
// CONTINUAR AL CHECKOUT
// =====================================================

document
    .getElementById(
        "irCheckout"
    )
    .addEventListener(
        "click",
        () => {

            if (
                carrito.length === 0
            ) {

                alert(
                    "El carrito está vacío."
                );

                return;

            }


            window.location.href =
                "/checkout.html";

        }
    );


// =====================================================
// ESCAPAR HTML
// =====================================================

function escaparHTML(
    texto
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texto ?? "";


    return div.innerHTML;

}


// =====================================================
// INICIO
// =====================================================

async function iniciar() {

    actualizarCarrito();

    await cargarCategorias();

    await cargarProductos();

}


iniciar();