import Producto from "../../models/productos_model/produtos.model.js"


export const obtener_producto_id = async (req, res)=>{
    try {
        const {id} = req.params
        
        const buscar_producto = await Producto.findOne({
            
            _id:id,
        negocioId: req.usuario.negocioId});

        if(!buscar_producto){
            return res.status(404).json({
                ok: false,
                message:"no hay productos"
            })
        }

        return res.status(200).json({
            ok:true,
            message:`Productos obtenidos con el id: ${id} `,
            buscar_producto
        })


    } catch (error) {
    console.error("No se han podido obtener productos", error)

    return res.status(500).json({
        ok: false,
        message: "Error en el servidor",
        error: error.message
    })
}
}