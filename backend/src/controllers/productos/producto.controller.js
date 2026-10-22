import Producto from "../../models/productos_model/produtos.model.js"



export const ingresar_producto = async (req, res) => {

    try {
        const productos_body = req.body

        const nuevoObjeto = {
            ...productos_body,
            creadoPor: req.usuario.id,
            actualizadoPor: req.usuario.id,
            negocioId: req.usuario.negocioId
        }

        const productos_db = await Producto.create(nuevoObjeto);

        return res.status(201).json({
            ok: true,
            message: "Producto creado correctamente",
            productos_db
        })


    } catch (error) {
        console.error("error al ingresar el producto", error)

        return res.status(500).json({
            ok: false,
            mensaje: "Ocurrió un error interno en el servidor",
            error: error.message // Opcional en desarrollo
        })
    }

}