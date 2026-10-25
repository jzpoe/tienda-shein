import { useEffect, useState } from "react";
import { obtenerProductos } from "../../services/productosServices";

const iconosCategorias = {
"Ropa": "👕",
"Ropa interior": "🧦",
"Joyas": "💍",
"Calzado": "👟",
"Accesorios": "👜",
"Electrónica": "🎧",
"Hogar": "🏠",
"Belleza": "✨",
"Deportes": "⚽",
"Juguetes": "🧸",
"Mercado": "🛒",
"Otras categorías": "📦"
};

export const Dashboard = () => {
const [productos, setProductos] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState("");


useEffect(() => {
    const cargarProductos = async () => {
        try {
            const respuesta = await obtenerProductos();
            setProductos(respuesta.productos || []);
            setError("");
        } catch (error) {
            if (error.response?.status === 404) {
                setProductos([]);
                setError("");
            } else {
                setError("No se pudieron cargar los productos.");
                console.error(error);
            }
        } finally {
            setCargando(false);
        }
    };

    cargarProductos();
}, []);

// Total de productos registrados
const totalProductos = productos.length;

// Suma las existencias de todas las variantes de un producto
const obtenerStockProducto = (producto) => {
    return (producto.variantes || []).reduce(
        (total, variante) => total + Number(variante.stock || 0),
        0
    );
};

// Total de unidades del inventario
const totalUnidades = productos.reduce(
    (total, producto) => total + obtenerStockProducto(producto),
    0
);

// Productos cuyo stock total es inferior a 5 unidades
const productosStockBajo = productos.filter(
    (producto) => obtenerStockProducto(producto) < 5
).length;

// Agrupa únicamente las categorías que tienen productos registrados
const categorias = Object.values(
    productos.reduce((acumulado, producto) => {
        const nombre = producto.categoria;

        if (!nombre) return acumulado;

        if (!acumulado[nombre]) {
            acumulado[nombre] = {
                nombre,
                cantidad: 0,
                unidades: 0
            };
        }

        acumulado[nombre].cantidad += 1;
        acumulado[nombre].unidades += obtenerStockProducto(producto);

        return acumulado;
    }, {})
);

// Tarjetas del resumen
const resumen = [
    {
        titulo: "Productos",
        valor: totalProductos,
        icono: "📦"
    },
    {
        titulo: "Categorías",
        valor: categorias.length,
        icono: "🗂️"
    },
    {
        titulo: "Unidades en stock",
        valor: totalUnidades,
        icono: "📊"
    },
    {
        titulo: "Stock bajo",
        valor: productosStockBajo,
        icono: "⚠️"
    }
];

// Los productos llegan ordenados del más reciente al más antiguo
const productosRecientes = productos.slice(0, 5);

return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

        {/* Encabezado */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
                <p className="text-sm text-gray-500 mb-2">
                    PANEL PRINCIPAL / INVENTARIO
                </p>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    ¡Bienvenido! 👋
                </h1>

                <p className="text-gray-500 mt-2">
                    Aquí tienes el resumen de tu tienda.
                </p>
            </div>

            <button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-3 rounded-xl transition"
            >
                + Agregar producto
            </button>
        </header>

        {/* Errores y carga */}
        {cargando && (
            <p className="text-gray-500 mb-6">
                Cargando información del inventario...
            </p>
        )}

        {error && (
            <p className="text-red-600 bg-red-50 rounded-xl p-4 mb-6">
                {error}
            </p>
        )}

        {/* Resumen del inventario */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
            {resumen.map((item) => (
                <div
                    key={item.titulo}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            {item.titulo}
                        </p>

                        <span className="text-2xl">
                            {item.icono}
                        </span>
                    </div>

                    <p className="text-3xl font-bold text-gray-800 mt-5">
                        {cargando ? "—" : item.valor}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                        {item.titulo === "Stock bajo"
                            ? "Productos con menos de 5 unidades"
                            : "Según tu inventario registrado"}
                    </p>
                </div>
            ))}
        </section>

        {/* Categorías registradas */}
        <section className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Inventario por categoría
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Consulta los productos y las unidades de cada categoría.
                    </p>
                </div>
            </div>

            {!cargando && !error && categorias.length === 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                    <p className="text-4xl mb-3">📦</p>
                    <h3 className="font-semibold text-gray-700">
                        Aún no tienes productos registrados
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Cuando registres productos, sus categorías aparecerán aquí.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {categorias.map((categoria) => (
                    <div
                        key={categoria.nombre}
                        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
                    >
                        <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-xl text-2xl mb-4">
                            {iconosCategorias[categoria.nombre] || "📦"}
                        </div>

                        <h3 className="font-semibold text-gray-800">
                            {categoria.nombre}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            {categoria.cantidad} productos
                        </p>

                        <p className="text-sm font-semibold text-indigo-600 mt-2">
                            {categoria.unidades} unidades en stock
                        </p>
                    </div>
                ))}
            </div>
        </section>

        {/* Productos recientes */}
        <section className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                    Productos recientes
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Los últimos productos registrados en tu inventario.
                </p>
            </div>

            {cargando ? (
                <p className="text-gray-500 py-6">
                    Cargando productos...
                </p>
            ) : productosRecientes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="text-5xl mb-4">📦</div>

                    <h3 className="font-semibold text-gray-700">
                        No hay productos registrados
                    </h3>

                    <p className="text-sm text-gray-500 mt-2 max-w-md">
                        Los productos que registres aparecerán aquí.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {productosRecientes.map((producto) => (
                        <div
                            key={producto._id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {producto.nombre}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {producto.categoria}
                                    {producto.subcategoria
                                        ? ` · ${producto.subcategoria}`
                                        : ""}
                                </p>
                            </div>

                            <div className="text-sm sm:text-right">
                                <p className="font-semibold text-gray-800">
                                    {obtenerStockProducto(producto)} unidades
                                </p>

                                <p className={
                                    obtenerStockProducto(producto) < 5
                                        ? "text-red-600"
                                        : "text-gray-500"
                                }>
                                    {obtenerStockProducto(producto) < 5
                                        ? "Stock bajo"
                                        : "Stock disponible"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    </div>
);


};
