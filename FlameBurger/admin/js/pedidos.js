const API_BASE_URL =
    (
        window.FLAME_API_URL ||
        "http://localhost:3000"
    ).replace(
        /\/$/,
        ""
    );

const API_PEDIDOS =
    API_BASE_URL +
    "/api/pedidos";

let pedidos = [];
let filtroActual = "todos";


// =====================================================
// ELEMENTOS
// =====================================================

const ordersList =
    document.getElementById("ordersList");

const pedidosNuevos =
    document.getElementById("pedidosNuevos");


// =====================================================
// CARGAR PEDIDOS
// =====================================================

async function cargarPedidos() {

    try {

        const respuesta =
            await fetch(API_PEDIDOS);

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los pedidos."
            );

        }

        pedidos =
            await respuesta.json();

        mostrarPedidos();

    } catch (error) {

        console.error(
            "❌ ERROR PEDIDOS:",
            error
        );

        ordersList.innerHTML = `

            <div class="empty-orders">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Error al cargar los pedidos
                </h3>

                <p>
                    ${escaparHTML(error.message)}
                </p>

            </div>

        `;

    }

}


// =====================================================
// MOSTRAR PEDIDOS
// =====================================================

function mostrarPedidos() {

    ordersList.innerHTML = "";


    // =================================================
    // CONTADOR DE NUEVOS
    // =================================================

    const cantidadNuevos =
        pedidos.filter(
            pedido =>
                pedido.estado === "nuevo"
        ).length;


    pedidosNuevos.textContent =
        `${cantidadNuevos} pedido${cantidadNuevos !== 1 ? "s" : ""} nuevo${cantidadNuevos !== 1 ? "s" : ""}`;


    // =================================================
    // FILTRAR
    // =================================================

    let pedidosFiltrados =
        pedidos;


    if (
        filtroActual !== "todos"
    ) {

        pedidosFiltrados =
            pedidos.filter(
                pedido =>
                    pedido.estado ===
                    filtroActual
            );

    }


    // =================================================
    // SIN PEDIDOS
    // =================================================

    if (
        pedidosFiltrados.length === 0
    ) {

        ordersList.innerHTML = `

            <div class="empty-orders">

                <div class="empty-icon">
                    🛒
                </div>

                <h3>
                    No hay pedidos
                </h3>

                <p>
                    No hay pedidos en esta categoría.
                </p>

            </div>

        `;

        return;

    }


    // =================================================
    // CREAR TARJETAS
    // =================================================

    pedidosFiltrados.forEach(
        pedido => {

            const tarjeta =
                crearTarjetaPedido(
                    pedido
                );

            ordersList.appendChild(
                tarjeta
            );

        }
    );

}


// =====================================================
// CREAR TARJETA
// =====================================================

function crearTarjetaPedido(
    pedido
) {

    const tarjeta =
        document.createElement(
            "div"
        );


    tarjeta.className =
        "order-card";


    if (
        pedido.estado === "nuevo"
    ) {

        tarjeta.classList.add(
            "new-order"
        );

    }


    const fecha =
        formatearFecha(
            pedido.creado_en
        );


    const estadoTexto =
        obtenerTextoEstado(
            pedido.estado
        );


    const claseEstado =
        `status-${pedido.estado}`;


    tarjeta.innerHTML = `

        <div class="order-top">

            <div>

                <div class="order-number">

                    Pedido #${pedido.id}

                </div>

                <div class="order-date">

                    ${fecha}

                </div>

                ${
                    pedido.estado === "nuevo"
                    ?
                    `
                    <span class="new-label">
                        NUEVO PEDIDO
                    </span>
                    `
                    :
                    ""
                }

            </div>


            <span
                class="order-status ${claseEstado}"
            >

                ${estadoTexto}

            </span>

        </div>


        <div class="order-info-grid">

            <div class="order-info">

                <span>
                    CLIENTE
                </span>

                <strong>
                    ${escaparHTML(
                        pedido.cliente_nombre ||
                        "Sin nombre"
                    )}
                </strong>

            </div>


            <div class="order-info">

                <span>
                    TELÉFONO
                </span>

                <strong>
                    ${escaparHTML(
                        pedido.telefono ||
                        "Sin teléfono"
                    )}
                </strong>

            </div>


            <div class="order-info">

                <span>
                    ENTREGA
                </span>

                <strong>
                    ${obtenerTextoEntrega(
                        pedido.tipo_entrega
                    )}
                </strong>

            </div>


            <div class="order-info">

                <span>
                    DIRECCIÓN
                </span>

                <strong>
                    ${escaparHTML(
                        pedido.direccion ||
                        "—"
                    )}
                </strong>

            </div>


            <div class="order-info">

                <span>
                    PAGO
                </span>

                <strong>
                    ${obtenerTextoPago(
                        pedido.forma_pago
                    )}
                </strong>

            </div>


            <div class="order-info">

                <span>
                    ESTADO
                </span>

                <strong>
                    ${estadoTexto}
                </strong>

            </div>

        </div>


        <div
            class="order-products"
            id="productos-${pedido.id}"
        >

            <div>
                ⏳ Cargando productos...
            </div>

        </div>


        ${
            pedido.observaciones
            ?
            `
            <div class="order-observation">

                <strong>
                    📝 Comentarios:
                </strong>

                <br>

                ${escaparHTML(
                    pedido.observaciones
                )}

            </div>
            `
            :
            ""
        }


        <div class="order-bottom">

            <div>

                <div class="order-total-label">
                    TOTAL
                </div>

                <div class="order-total">

                    $${Number(
                        pedido.total || 0
                    ).toLocaleString(
                        "es-UY"
                    )}

                </div>

            </div>


            <div class="order-actions">

                ${crearBotonesEstado(
                    pedido
                )}

            </div>

        </div>

    `;


    cargarDetallePedido(
        pedido.id
    );


    return tarjeta;

}


// =====================================================
// BOTONES SEGÚN ESTADO
// =====================================================

function crearBotonesEstado(
    pedido
) {

    const estado =
        pedido.estado;


    if (
        estado === "cancelado"
    ) {

        return `
            <button
                class="btn-confirm"
                onclick="cambiarEstado(${pedido.id}, 'nuevo')"
            >
                ↩️ Reactivar
            </button>
        `;

    }


    if (
        estado === "entregado"
    ) {

        return `
            <button
                class="btn-cancel"
                onclick="cambiarEstado(${pedido.id}, 'cancelado')"
            >
                ❌ Cancelar
            </button>
        `;

    }


    if (
        estado === "nuevo"
    ) {

        return `

            <button
                class="btn-confirm"
                onclick="cambiarEstado(${pedido.id}, 'confirmado')"
            >
                ✅ Confirmar
            </button>

            <button
                class="btn-cancel"
                onclick="cambiarEstado(${pedido.id}, 'cancelado')"
            >
                ❌ Cancelar
            </button>

        `;

    }


    if (
        estado === "confirmado"
    ) {

        return `

            <button
                class="btn-preparing"
                onclick="cambiarEstado(${pedido.id}, 'preparando')"
            >
                👨‍🍳 Preparando
            </button>

            <button
                class="btn-cancel"
                onclick="cambiarEstado(${pedido.id}, 'cancelado')"
            >
                ❌ Cancelar
            </button>

        `;

    }


    if (
        estado === "preparando"
    ) {

        return `

            <button
                class="btn-ready"
                onclick="cambiarEstado(${pedido.id}, 'listo')"
            >
                🍔 Listo
            </button>

            <button
                class="btn-cancel"
                onclick="cambiarEstado(${pedido.id}, 'cancelado')"
            >
                ❌ Cancelar
            </button>

        `;

    }


    if (
        estado === "listo"
    ) {

        return `

            <button
                class="btn-delivered"
                onclick="cambiarEstado(${pedido.id}, 'entregado')"
            >
                🛵 Entregado
            </button>

            <button
                class="btn-cancel"
                onclick="cambiarEstado(${pedido.id}, 'cancelado')"
            >
                ❌ Cancelar
            </button>

        `;

    }


    return "";

}


// =====================================================
// CARGAR DETALLE
// =====================================================

async function cargarDetallePedido(
    pedidoId
) {

    try {

        const respuesta =
            await fetch(
                `${API_PEDIDOS}/${pedidoId}`
            );


        if (
            !respuesta.ok
        ) {

            throw new Error(
                "No se pudo obtener el detalle."
            );

        }


        const resultado =
            await respuesta.json();


        const contenedor =
            document.getElementById(
                `productos-${pedidoId}`
            );


        if (!contenedor) {
            return;
        }


        if (
            !resultado.productos ||
            resultado.productos.length === 0
        ) {

            contenedor.innerHTML = `
                <div>
                    Sin productos
                </div>
            `;

            return;

        }


        contenedor.innerHTML = "";


        resultado.productos.forEach(
            producto => {

                const elemento =
                    document.createElement(
                        "div"
                    );


                elemento.className =
                    "order-product";


                elemento.innerHTML = `

                    <div>

                        <strong>
                            ${escaparHTML(
                                producto.nombre ||
                                "Producto"
                            )}
                        </strong>

                        <small>

                            ${producto.cantidad}
                            x
                            $${Number(
                                producto.precio_unitario ||
                                0
                            ).toLocaleString(
                                "es-UY"
                            )}

                        </small>

                    </div>


                    <strong>

                        $${Number(
                            producto.subtotal ||
                            0
                        ).toLocaleString(
                            "es-UY"
                        )}

                    </strong>

                `;


                contenedor.appendChild(
                    elemento
                );

            }
        );


    } catch (error) {

        console.error(
            "ERROR DETALLE:",
            error
        );


        const contenedor =
            document.getElementById(
                `productos-${pedidoId}`
            );


        if (contenedor) {

            contenedor.innerHTML = `
                <div>
                    ⚠️ No se pudo cargar el detalle
                </div>
            `;

        }

    }

}


// =====================================================
// CAMBIAR ESTADO
// =====================================================

async function cambiarEstado(
    pedidoId,
    nuevoEstado
) {

    try {

        const confirmar =
            confirm(
                `¿Cambiar el pedido #${pedidoId} a "${obtenerTextoEstado(nuevoEstado)}"?`
            );


        if (!confirmar) {
            return;
        }


        const respuesta =
            await fetch(
                `${API_PEDIDOS}/${pedidoId}/estado`,
                {

                    method:
                        "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            estado:
                                nuevoEstado

                        })

                }
            );


        const resultado =
            await respuesta.json();


        if (
            !respuesta.ok
        ) {

            throw new Error(
                resultado.error ||
                "No se pudo cambiar el estado."
            );

        }


        // =================================================
        // ACTUALIZAR PEDIDO LOCALMENTE
        // =================================================

        const pedido =
            pedidos.find(
                p =>
                    Number(p.id) ===
                    Number(pedidoId)
            );


        if (pedido) {

            pedido.estado =
                nuevoEstado;

        }


        mostrarPedidos();


    } catch (error) {

        console.error(
            "ERROR CAMBIANDO ESTADO:",
            error
        );


        alert(
            "❌ " +
            error.message
        );

    }

}


// =====================================================
// FILTROS
// =====================================================

document
    .querySelectorAll(
        ".order-filter"
    )
    .forEach(
        boton => {

            boton.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".order-filter"
                        )
                        .forEach(
                            b =>
                                b.classList.remove(
                                    "active"
                                )
                        );


                    boton.classList.add(
                        "active"
                    );


                    filtroActual =
                        boton.dataset.filter;


                    mostrarPedidos();

                }
            );

        }
    );


// =====================================================
// FORMATEAR FECHA
// =====================================================

function formatearFecha(
    fecha
) {

    if (!fecha) {
        return "";
    }


    const fechaObjeto =
        new Date(
            fecha
        );


    return fechaObjeto.toLocaleString(
        "es-UY",
        {

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );

}


// =====================================================
// TEXTO ESTADO
// =====================================================

function obtenerTextoEstado(
    estado
) {

    const estados = {

        nuevo:
            "🆕 Nuevo",

        confirmado:
            "✅ Confirmado",

        preparando:
            "👨‍🍳 Preparando",

        listo:
            "🍔 Listo",

        entregado:
            "🛵 Entregado",

        cancelado:
            "❌ Cancelado"

    };


    return estados[estado] ||
        estado ||
        "Desconocido";

}


// =====================================================
// TEXTO ENTREGA
// =====================================================

function obtenerTextoEntrega(
    entrega
) {

    if (
        entrega === "delivery"
    ) {

        return "🛵 Delivery";

    }


    if (
        entrega === "retiro"
    ) {

        return "🏪 Retiro";

    }


    return entrega || "—";

}


// =====================================================
// TEXTO PAGO
// =====================================================

function obtenerTextoPago(
    pago
) {

    if (
        pago === "efectivo"
    ) {

        return "💵 Efectivo";

    }


    if (
        pago === "mercado_pago"
    ) {

        return "💳 Mercado Pago";

    }


    return pago || "—";

}


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
// ACTUALIZACIÓN AUTOMÁTICA
// =====================================================

setInterval(
    cargarPedidos,
    10000
);


// =====================================================
// INICIAR
// =====================================================

cargarPedidos();