import api from "./api";

export const obtenerProductos = async () => {
    const response = await api.get("/productos");
    return response.data;
};

export const agregarProductos = async (productos) => {
    const response = await api.post("/productos", productos);
    return response.data;
};


export const eliminarProductos = async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
};

