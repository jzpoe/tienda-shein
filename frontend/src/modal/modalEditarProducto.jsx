import { useEffect, useState } from "react";

export const EditarProducto = ({ open, productos, cerrarModalEditar, actualizarProducto }) => {
    const [datosProducto, setDatosProducto] = useState({
        nombre: "",
        categoria: "",
        costoCompra: "",
        precio: "",
        variantes: []
    })
    const [variantes, setVariantes] = useState([]);


    useEffect(() => {
        if (productos) {
            setDatosProducto({
                nombre: productos.nombre || "",
                categoria: productos.categoria || "",
                costoCompra: productos.costoCompra ?? "",
                precio: productos.precio ?? "",
                variantes: productos.variantes || []
            });

            setVariantes(productos.variantes || []);
        }
    }, [productos]);

    const handleChangue = (e) => {
        const { name, value } = e.target;

        setDatosProducto({
            ...datosProducto,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            const costoCompra = Number(datosProducto.costoCompra);
            const precio = Number(datosProducto.precio);

            if (!Number.isFinite(costoCompra) || costoCompra < 0) {
                return alert("Ingresa un costo de compra válido");
            }

            if (!Number.isFinite(precio) || precio <= 0) {
                return alert("Ingresa un precio de venta válido");
            }


            const productoActualizado = {
                ...datosProducto,
                costoCompra,
                precio,
                variantes: variantes.map((variante) => ({
                    _id: variante._id,
                    atributos: variante.atributos,
                    stock: Number(variante.stock)
                }))
            };

            await actualizarProducto(productoActualizado);

        } catch (error) {

        }


    }

    const handleStockChange = (index, value) => {
        setVariantes((variantesActuales) =>
            variantesActuales.map((variante, i) => {
                if (i !== index) return variante;

                return {
                    ...variante,
                    stock: value
                };
            })
        );
    };

    useEffect(() => {
    console.log("Variantes actualizadas:", variantes);
}, [variantes]);

    return (
        <>
            {open && (
                <form
                    onSubmit={handleSubmit}
                    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4"
                >
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Encabezado */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Editar producto
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Modifica la información del producto.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={cerrarModalEditar}
                                className="rounded-lg px-3 py-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Contenido */}
                        <div className="space-y-5 p-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Nombre del producto
                                </label>

                                <input
                                    value={datosProducto.nombre}
                                    name="nombre"
                                    onChange={handleChangue}
                                    type="text"
                                    placeholder="Nombre del producto"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

                                />

                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Categoría
                                </label>

                                <input
                                    type="text"
                                    name="categoria"
                                    value={datosProducto.categoria}
                                    onChange={handleChangue}
                                    placeholder="Categoría del producto"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Costo de compra
                                    </label>

                                    <input
                                        type="number"
                                        name="costoCompra"
                                        value={datosProducto.costoCompra}
                                        onChange={handleChangue}
                                        min="0"
                                        placeholder="0"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Precio
                                </label>

                                <input
                                    type="number"
                                    value={datosProducto.precio}
                                    onChange={handleChangue}
                                    name="precio"
                                    min="0"
                                    placeholder="0"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="space-y-3">
                                {variantes.map((variante, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                                    >
                                        {/* Encabezado de la variante */}
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-semibold text-gray-800">
                                                Variante {index + 1}
                                            </h4>

                                            <span className="text-xs text-gray-500">
                                                {Object.keys(variante.atributos).length} atributos
                                            </span>
                                        </div>

                                        {/* Atributos */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {Object.entries(variante.atributos).map(([nombre, valor]) => (
                                                <span
                                                    key={nombre}
                                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600"
                                                >
                                                    <span className="font-medium text-gray-800">
                                                        {nombre}:
                                                    </span>{" "}
                                                    {valor}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Stock */}
                                        <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-200">
                                            <span className="text-sm text-gray-500">
                                                Stock disponible
                                            </span>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={variante.stock ?? ""}
                                                    onChange={(e) => handleStockChange(index, e.target.value)}
                                                    className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-blue-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                />

                                                <span className="text-sm text-gray-500">
                                                    unidades
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <button
                                type="button"
                                onClick={cerrarModalEditar}
                                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Guardar cambios
                            </button>
                        </div>

                    </div>
                </form>
            )}
        </>
    );
};