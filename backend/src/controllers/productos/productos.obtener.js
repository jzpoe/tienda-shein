import Producto from "../../models/productos_model/produtos.model.js"

export const obtener_productos = async (req, res) => {
    try {
        const productos = await Producto.find({
            negocioId: req.usuario.negocioId
        })
            .sort({ _id: -1 })
            .populate("creadoPor", "nombre usuario rol")
            .populate("actualizadoPor", "nombre usuario rol")


        if (productos.length === 0) {
            return res.status(404).json({
                ok: false,
                message: "no hay productos"
            })
        }

        return res.status(200).json({
            ok: true,
            message: "Productos obtenidos",
            productos,
        })

    } catch (error) {
        console.error("No se han podido obtener los productos", error)

        return res.status(500).json({
            ok: false,
            message: "error en el serivor",
            error: error.message
        })
    }


}


