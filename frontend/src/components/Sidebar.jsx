import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package
} from "lucide-react";

export const Sidebar = () => {

    const opciones = [
        {
            nombre: "Dashboard",
            ruta: "/dashboard",
            icono: LayoutDashboard
        },
        {
            nombre: "Productos",
            ruta: "/productos",
            icono: Package
        },
        {
            nombre: "Ventas",
            ruta: "/ventas",
            icono: Package
        },
        {
            nombre: "Historial de Ventas",
            ruta: "/historial-ventas",
            icono: Package
        }
        
    ];

    return (
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200">

            {/* Encabezado */}
            <div className="h-16 flex items-center px-5 border-b border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold">
                        SI
                    </span>
                </div>

                <h1 className="ml-3 font-semibold text-gray-800">
                    Sistema Inventario
                </h1>
            </div>


            {/* Navegación */}
            <nav className="p-3 flex md:flex-col gap-1 overflow-x-auto">

                {opciones.map((opcion) => {

                    const Icono = opcion.icono;

                    return (
                        <NavLink
                            key={opcion.ruta}
                            to={opcion.ruta}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap transition-colors
                                ${
                                    isActive
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`
                            }
                        >
                            <Icono size={20} />

                            <span>
                                {opcion.nombre}
                            </span>

                        </NavLink>
                    );
                })}

            </nav>

        </aside>
    );
};