import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { obtenerProductos, registrarVenta } from "../../services/productosServices";

export const FormularioVenta = () => {

    const [productos, setProductos] = useState([]);

    const [productoId, setProductoId] = useState("");
    const [varianteId, setVarianteId] = useState("");
    const [cantidad, setCantidad] = useState(1);

    const [cliente, setCliente] = useState({
        nombre: "",
        telefono: ""
    });

    const [cargando, setCargando] = useState(false);

    // Cargar productos del inventario
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const response = await obtenerProductos();

                setProductos(response.productos || []);

            } catch (error) {
                console.error("Error al cargar productos:", error);

                Swal.fire({
                    title: "Error",
                    text: "No se pudieron cargar los productos.",
                    icon: "error"
                });
            }
        };

        cargarProductos();
    }, []);

    // Obtener producto seleccionado
    const productoSeleccionado = productos.find(
        (producto) => producto._id === productoId
    );

    // Obtener variantes del producto
    const varianteSeleccionada = productoSeleccionado?.variantes.find(
        (variante) => variante._id === varianteId
    );

    // Calcular valores
    const precio = productoSeleccionado?.precio || 0;
    const costo = productoSeleccionado?.costoCompra || 0;

    const subtotal = precio * Number(cantidad);
    const costoTotal = costo * Number(cantidad);
    const ganancia = subtotal - costoTotal;

    // Registrar venta
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productoId || !varianteId) {
            return Swal.fire({
                title: "Atención",
                text: "Selecciona un producto y una variante.",
                icon: "warning"
            });
        }

        if (
            !Number.isInteger(Number(cantidad)) ||
            Number(cantidad) <= 0
        ) {
            return Swal.fire({
                title: "Atención",
                text: "Ingresa una cantidad válida.",
                icon: "warning"
            });
        }

        if (Number(cantidad) > varianteSeleccionada.stock) {
            return Swal.fire({
                title: "Stock insuficiente",
                text: `Solo tienes ${varianteSeleccionada.stock} unidades disponibles.`,
                icon: "warning"
            });
        }

        const datosVenta = {
            productos: [
                {
                    productoId,
                    varianteId,
                    cantidad: Number(cantidad)
                }
            ],
            cliente
        };

        try {
            setCargando(true);

            await registrarVenta(datosVenta);

            await Swal.fire({
                title: "¡Venta registrada!",
                text: "La venta se registró correctamente.",
                icon: "success"
            });

            // Limpiar formulario
            setProductoId("");
            setVarianteId("");
            setCantidad(1);

            setCliente({
                nombre: "",
                telefono: ""
            });

            // Actualizar inventario
            const response = await obtenerProductos();
            setProductos(response.productos || []);

        } catch (error) {
            console.error("Error al registrar venta:", error);

            Swal.fire({
                title: "Error",
                text: error.response?.data?.message ||
                    "No se pudo registrar la venta.",
                icon: "error"
            });

        } finally {
            setCargando(false);
        }
    };

    return (
        <section className="max-w-3xl mx-auto">

            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Registrar venta
                </h1>

                <p className="text-gray-500 mt-1">
                    Registra los productos vendidos y actualiza tu inventario.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6"
            >

                {/* Seleccionar producto */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Producto
                    </label>

                    <select
                        value={productoId}
                        onChange={(e) => {
                            setProductoId(e.target.value);
                            setVarianteId("");
                        }}
                        className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Seleccionar producto</option>

                        {productos.map((producto) => (
                            <option
                                key={producto._id}
                                value={producto._id}
                            >
                                {producto.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Seleccionar variante */}
                {productoSeleccionado && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Variante
                        </label>

                        <select
                            value={varianteId}
                            onChange={(e) => setVarianteId(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccionar variante</option>

                            {productoSeleccionado.variantes.map((variante) => (
                                <option
                                    key={variante._id}
                                    value={variante._id}
                                    disabled={variante.stock <= 0}
                                >
                                    {Object.entries(variante.atributos || {})
                                        .map(([nombre, valor]) => `${nombre}: ${valor}`)
                                        .join(" - ")}
                                    {" "} | Stock: {variante.stock}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Información de la variante */}
                {varianteSeleccionada && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-sm text-gray-600">
                            Stock disponible
                        </p>

                        <p className="text-2xl font-bold text-blue-700">
                            {varianteSeleccionada.stock} unidades
                        </p>
                    </div>
                )}

                {/* Cantidad */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cantidad vendida
                    </label>

                    <input
                        type="number"
                        min="1"
                        max={varianteSeleccionada?.stock || undefined}
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Datos del cliente */}
                <div className="border-t border-gray-100 pt-5">
                    <h2 className="font-semibold text-gray-800 mb-4">
                        Información del cliente (opcional)
                    </h2>

                    <div className="space-y-4">

                        <input
                            type="text"
                            placeholder="Nombre del cliente"
                            value={cliente.nombre}
                            onChange={(e) =>
                                setCliente({
                                    ...cliente,
                                    nombre: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="tel"
                            placeholder="Teléfono del cliente"
                            value={cliente.telefono}
                            onChange={(e) =>
                                setCliente({
                                    ...cliente,
                                    telefono: e.target.value
                                })
                            }
                            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>
                </div>

                {/* Resumen */}
                {varianteSeleccionada && (
                    <div className="bg-gray-50 rounded-xl p-5 space-y-3">

                        <h2 className="font-semibold text-gray-800">
                            Resumen de la venta
                        </h2>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                                Precio unitario
                            </span>

                            <span>
                                ${precio.toLocaleString("es-CO")}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                                Cantidad
                            </span>

                            <span>{cantidad}</span>
                        </div>

                        <div className="border-t pt-3 flex justify-between">
                            <span className="font-semibold">
                                Total venta
                            </span>

                            <span className="font-bold text-blue-600">
                                ${subtotal.toLocaleString("es-CO")}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                                Ganancia estimada
                            </span>

                            <span className="font-semibold text-green-600">
                                ${ganancia.toLocaleString("es-CO")}
                            </span>
                        </div>

                    </div>
                )}

                {/* Botón */}
                <button
                    type="submit"
                    disabled={cargando || !varianteSeleccionada}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {cargando ? "Registrando venta..." : "Confirmar venta"}
                </button>

            </form>

        </section>
    );
};