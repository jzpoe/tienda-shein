import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../page/login/Login";
import { Dashboard } from "../page/Dashboard/Dashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "../layout/DashboardLayout";
import { ObtenerProductos } from "../page/productos/ObtenerProductos";
import { FormularioVenta } from "../page/ventas/FormularioVenta";



export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />                            
                        </ProtectedRoute>
                    }
                    
                >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/productos" element={<ObtenerProductos />} />
                <Route path="/ventas" element={<FormularioVenta />} />
                </Route>


            </Routes>
        </BrowserRouter>
    )
}