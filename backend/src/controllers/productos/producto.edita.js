import Producto from "../../models/productos_model/produtos.model.js";

export const editar_producto = async (req, res) => {
    try {
        const { id } = req.params;
        const { varianteId, campo, valor, nombre, categoria, precio } = req.body;

        let producto_actualizado;

        // 1. Actualizar un atributo de una variante
        if (varianteId) {

            if (!campo || valor === undefined) {
                return res.status(400).json({
                    ok: false,
                    message: "Debe proporcionar campo y valor"
                });
            }

            const campoActualizar = `variantes.$.atributos.${campo}`;

            producto_actualizado = await Producto.findOneAndUpdate(
                {
                    _id: id,
                    "variantes._id": varianteId,
                    negocioId: req.usuario.negocioId
                },
                {
                    $set: {
                        [campoActualizar]: valor,
                        actualizadoPor: req.usuario.id
                    }
                },
                {
                    returnDocument: "after"
                }
            );

        } else {

            // 2. Actualizar datos propios del producto
            const datosActualizar = {};

            if (nombre !== undefined) datosActualizar.nombre = nombre;
            if (categoria !== undefined) datosActualizar.categoria = categoria;
            if (precio !== undefined) datosActualizar.precio = precio;

            datosActualizar.actualizadoPor = req.usuario.id;

            producto_actualizado = await Producto.findOneAndUpdate(
                {
                    _id:id,
                    negocioId: req.usuario.negocioId
                },
                {
                    $set: datosActualizar
                },
                {
                    returnDocument: "after"
                }
            );
        }

        if (!producto_actualizado) {
            return res.status(404).json({
                ok: false,
                message: "No se encontró el producto o la variante"
            });
        }

        return res.status(200).json({
            ok: true,
            message: "Producto actualizado correctamente",
            producto_actualizado
        });

    } catch (error) {

        console.error("No se ha podido actualizar el producto", error);

        return res.status(500).json({
            ok: false,
            message: "Error en el servidor",
            error: error.message
        });
    }
};