
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Interceptor de petición: agrega el token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor de respuesta: detecta sesiones inválidas
api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            // Eliminar el token vencido o inválido
            localStorage.removeItem("token");

            // Redirigir al login si no estamos ya allí
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;

