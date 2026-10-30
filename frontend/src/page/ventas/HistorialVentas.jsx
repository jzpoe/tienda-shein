import { useEffect, useState } from "react";
import { Search, CalendarDays, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import { obtenerVentas } from "../../services/productosServices";


export const HistorialVentas = () => {

    const [ventas, setVentas] = useState([]);
    const [resumen, setResumen] = useState({
        cantidadVentas: 0,
        ingresos: 0,
        costos: 0,
        ganancias: 0
    });

    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [buscar, setBuscar] = useState("");

    const [cargando, setCargando] = useState(false);

    // Consultar ventas
    const cargarVentas = async (filtros = {}) => {
        try {
            setCargando(true);

            const response = await obtenerVentas(filtros);

            setVentas(response.ventas || []);
            setResumen(response.resumen || {
                cantidadVentas: 0,
                ingresos: 0,
                costos: 0,
                ganancias: 0
            });

        } catch (error) {
            console.error("Error al obtener ventas:", error);

            Swal.fire({
                title: "Error",
                text: error.response?.data?.message ||
                    "No se pudo cargar el historial de ventas.",
                icon: "error"
            });

        } finally {
            setCargando(false);
        }
    };

    // Cargar todas las ventas al iniciar
    useEffect(() => {
        cargarVentas();
    }, []);

    // Aplicar filtros
    const aplicarFiltros = (e) => {
        e.preventDefault();

        if (desde && hasta && desde > hasta) {
            return Swal.fire({
                title: "Fechas incorrectas",
                text: "La fecha inicial no puede ser posterior a la fecha final.",
                icon: "warning"
            });
        }

        cargarVentas({
            ...(desde && { desde }),
            ...(hasta && { hasta }),
            ...(buscar.trim() && { buscar: buscar.trim() })
        });
    };

    // Limpiar filtros
    const limpiarFiltros = () => {
        setDesde("");
        setHasta("");
        setBuscar("");
        cargarVentas();
    };

    // Formato de moneda
    const formatoMoneda = (valor) => {
        return Number(valor || 0).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        });
    };

    // Formato de fecha
    const formatoFecha = (fecha) => {
        return new Date(fecha).toLocaleString("es-CO", {
            dateStyle: "short",
            timeStyle: "short"
        });
    };

    return (
        <section className="space-y-6">

            {/* Encabezado */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Historial de ventas
                </h1>

                <p className="text-gray-500 mt-1">
                    Consulta las ventas y revisa los ingresos y ganancias de tu negocio.
                </p>
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <div className="bg-white border rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Ventas realizadas
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {resumen.cantidadVentas}
                    </h2>
                </div>

                <div className="bg-white border rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Ingresos
                    </p>

                    <h2 className="text-2xl font-bold text-blue-600 mt-2">
                        {formatoMoneda(resumen.ingresos)}
                    </h2>
                </div>

                <div className="bg-white border rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Costos
                    </p>

                    <h2 className="text-2xl font-bold text-gray-700 mt-2">
                        {formatoMoneda(resumen.costos)}
                    </h2>
                </div>

                <div className="bg-white border rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Ganancias
                    </p>

                    <h2 className="text-2xl font-bold text-green-600 mt-2">
                        {formatoMoneda(resumen.ganancias)}
                    </h2>
                </div>

            </div>

            {/* Filtros */}
            <form
                onSubmit={aplicarFiltros}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >

                <h2 className="font-semibold text-gray-800 mb-4">
                    Filtrar ventas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Desde
                        </label>

                        <input
                            type="date"
                            value={desde}
                            onChange={(e) => setDesde(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Hasta
                        </label>

                        <input
                            type="date"
                            value={hasta}
                            onChange={(e) => setHasta(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Buscar
                        </label>

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Producto o cliente"
                                value={buscar}
                                onChange={(e) => setBuscar(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-end gap-2">

                        <button
                            type="submit"
                            disabled={cargando}
                            className="flex-1 bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            Filtrar
                        </button>

                        <button
                            type="button"
                            onClick={limpiarFiltros}
                            disabled={cargando}
                            title="Limpiar filtros"
                            className="border border-gray-300 rounded-xl p-3 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <RefreshCw size={19} />
                        </button>

                    </div>

                </div>
            </form>

            {/* Tabla de ventas */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800">
                        Ventas registradas
                    </h2>

                    <span className="text-sm text-gray-500">
                        {ventas.length} registros
                    </span>
                </div>

                {cargando ? (

                    <div className="p-10 text-center text-gray-500">
                        Cargando ventas...
                    </div>

                ) : ventas.length === 0 ? (

                    <div className="p-10 text-center">
                        <CalendarDays
                            size={35}
                            className="mx-auto text-gray-300 mb-3"
                        />

                        <p className="text-gray-600 font-medium">
                            No hay ventas registradas
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            Las ventas aparecerán aquí cuando se registren.
                        </p>
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm text-left">

                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-5 py-4">Fecha</th>
                                    <th className="px-5 py-4">Cliente</th>
                                    <th className="px-5 py-4">Productos</th>
                                    <th className="px-5 py-4">Total</th>
                                    <th className="px-5 py-4">Ganancia</th>
                                    <th className="px-5 py-4">Registrado por</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {ventas.map((venta) => (

                                    <tr
                                        key={venta._id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                                            {formatoFecha(venta.fechaVenta)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-800">
                                                {venta.cliente?.nombre || "Cliente general"}
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                {venta.cliente?.telefono || "Sin teléfono"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="space-y-2">

                                                {venta.productos.map((producto, index) => (

                                                    <div key={producto._id || index}>
                                                        <p className="font-medium text-gray-700">
                                                            {producto.nombreProducto}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            Cantidad: {producto.cantidad}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            {Object.entries(producto.atributos || {})
                                                                .map(([nombre, valor]) => `${nombre}: ${valor}`)
                                                                .join(" - ")}
                                                        </p>
                                                    </div>

                                                ))}

                                            </div>
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">
                                            {formatoMoneda(venta.total)}
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-green-600 whitespace-nowrap">
                                            {formatoMoneda(venta.ganancia)}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                            {venta.registradoPor?.nombre || "Usuario"}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </section>
    );
};