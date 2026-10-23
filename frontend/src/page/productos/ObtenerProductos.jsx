import { useEffect, useState } from "react"
import { Pencil, Trash2 } from 'lucide-react';
import { eliminarProductos, obtenerProductos } from "../../services/productosServices"
import { ModalAgregarProducto } from "../../modal/ModalAgregarProducto/ModalAgregarProducto";
import { EditarProducto } from "../../modal/modalEditarProducto";
import Swal from "sweetalert2";



export const ObtenerProductos = () => {
    const [producto, setProducto] = useState([]);
    const [modalAgregarProductosOpen, setModalAgregarProductosOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const productosObtener = async () => {

        try {
            const response = await obtenerProductos()

            setProducto(response.productos)
        } catch (error) {
            console.error(
                "Error al crear el producto:",
                error.response?.data?.message || error.message
            )
        }


    }

    useEffect(() => {
        productosObtener()
    }, [])

    const abrirModal = () => {
        setModalAgregarProductosOpen(true)
    }
    const cerraModal = () => {
        setModalAgregarProductosOpen(false)
    }

    const abrirModalEditar = (producto) => {
        setProductoSeleccionado(producto)
        setModalEditarOpen(true)

    }

    const cerrarModalEditar = () => {
        setModalEditarOpen(false)
    }

    const eliminarProducto = async (producto) => {
        const resultado = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar el producto "${producto.nombre}"? Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        });

        // Si cancela, no hacemos nada
        if (!resultado.isConfirmed) return;

        try {
            // Solicitar la eliminación al backend
            await eliminarProductos(producto._id);

            // Actualizar las cards sin recargar la página
            setProducto((productosActuales) =>
                productosActuales.filter(
                    (item) => item._id !== producto._id
                )
            );

            await Swal.fire({
                title: "¡Eliminado!",
                text: "El producto se eliminó correctamente.",
                icon: "success",
                confirmButtonColor: "#2563eb"
            });

        } catch (error) {
            console.error("Error al eliminar el producto:", error);

            Swal.fire({
                title: "Error",
                text: error.response?.data?.message ||
                    "No se pudo eliminar el producto.",
                icon: "error",
                confirmButtonColor: "#2563eb"
            });
        }
    };


    return (
        <>
            <section>

                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Productos
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Consulta y administra los productos de tu inventario.
                    </p>

                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                        {/* <button
        type="button"
        onClick={cerrarModalProducto}
        className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
    >
        Cancelar
    </button> */}

                        <button onClick={abrirModal}
                            type="button"
                            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-95"
                        >
                            Crear producto
                        </button>
                    </div>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                    {
                        producto.map((productosObtenidos) => (

                            <article
                                key={productosObtenidos._id}
                                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                            >

                                <div className="mb-4">
                                    <img
                                        src={`https://api-inventario-shein.rodantech.co${productosObtenidos.imagen}`}
                                        alt={productosObtenidos.nombre}
                                        className="w-full h-56 object-contain rounded-xl bg-gray-50"
                                    />
                                </div>

                                <div className="flex justify-between items-start gap-4">

                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {productosObtenidos.nombre}
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {productosObtenidos.categoria}
                                        </p>
                                    </div>

                                    <span className="text-lg font-bold text-blue-600">
                                        ${productosObtenidos.precio.toLocaleString()}
                                    </span>

                                </div>


                                <div className="mt-5">

                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                        Variantes
                                    </h3>

                                    <div className="space-y-3">

                                        {
                                            productosObtenidos.variantes.map((variante) => (

                                                <div
                                                    key={variante._id}
                                                    className="bg-gray-50 rounded-xl p-3"
                                                >

                                                    <div className="flex justify-between items-center mb-2">

                                                        <span className="text-sm font-medium text-gray-700">
                                                            Variante
                                                        </span>

                                                        <span className="text-sm font-semibold text-gray-800">
                                                            Stock: {variante.stock}
                                                        </span>

                                                    </div>


                                                    <div className="flex flex-wrap gap-2">

                                                        {
                                                            Object.entries(variante.atributos).map(
                                                                ([nombre, valor]) => (

                                                                    <span
                                                                        key={nombre}
                                                                        className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-600"
                                                                    >
                                                                        {nombre}: {valor}
                                                                    </span>

                                                                )
                                                            )
                                                        }

                                                    </div>

                                                </div>

                                            ))
                                        }

                                    </div>

                                </div>


                                <div className="mt-5 pt-4 border-t border-gray-100">

                                    <p className="text-xs text-gray-400">
                                        Creado por
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        {productosObtenidos.creadoPor.nombre}
                                    </p>

                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    {/* Botón editar */}
                                    <button
                                        type="button"
                                        onClick={() => abrirModalEditar(productosObtenidos)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        title="Editar producto"
                                    >
                                        <Pencil size={20} />
                                    </button>

                                    {/* Botón eliminar */}
                                    <button
                                        type="button"
                                        onClick={() => eliminarProducto(productosObtenidos)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Eliminar producto"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                            </article>


                        ))
                    }

                </div>

                <ModalAgregarProducto
                    openModalProducto={modalAgregarProductosOpen}
                    cerrarModalProducto={cerraModal}
                    actualizarProductos={productosObtener}
                />

                <EditarProducto
                    open={modalEditarOpen}
                    productos={productoSeleccionado}
                    cerrarModalEditar={cerrarModalEditar}

                />


            </section>
        </>
    );
}