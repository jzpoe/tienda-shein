import Producto from "../../models/productos_model/produtos.model.js";


export const productos_eliminar = async (req, res) => {
    try {
        const {id} = req.params;

        const eliminar_producto = await Producto.findOneAndDelete({
            _id:id, 
            negocioId: req.usuario.negocioId
                });

        if (!eliminar_producto) {
            return res.status(404).json({
                ok: false,
                message: "no hay productos que eliminar"
            })
        }

        return res.status(200).json({
            ok: true,
            message: "producto eliminado correctamente"
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