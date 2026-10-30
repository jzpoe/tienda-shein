
import Producto from "../../models/productos_model/produtos.model.js";

export const editar_producto = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            varianteId,
            campo,
            valor,
            nombre,
            categoria,
            costoCompra,
            precio,
            variantes
        } = req.body;

        console.log("ID del producto:", id);

        let producto_actualizado;

        // ==========================================
        // 1. ACTUALIZAR UN ATRIBUTO DE UNA VARIANTE
        // ==========================================

        if (varianteId) {

            if (!campo || valor === undefined) {
                return res.status(400).json({
                    ok: false,
                    message: "Debe proporcionar el campo y el valor"
                });
            }

            // Evitar modificar campos que no sean atributos
            if (!/^[a-zA-Z0-9_-]+$/.test(campo)) {
                return res.status(400).json({
                    ok: false,
                    message: "Nombre de atributo no válido"
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
                    returnDocument: "after",
                    runValidators: true
                }
            );

        } else {

            // ==========================================
            // 2. ACTUALIZAR DATOS GENERALES DEL PRODUCTO
            // ==========================================

            const datosActualizar = {};

            if (nombre !== undefined) {
                datosActualizar.nombre = nombre;
            }

            if (categoria !== undefined) {
                datosActualizar.categoria = categoria;
            }

            if (costoCompra !== undefined) {
                const costo = Number(costoCompra);

                if (!Number.isFinite(costo) || costo < 0) {
                    return res.status(400).json({
                        ok: false,
                        message: "El costo de compra no es válido"
                    });
                }

                datosActualizar.costoCompra = costo;
            }

            if (precio !== undefined) {
                const precioVenta = Number(precio);

                if (!Number.isFinite(precioVenta) || precioVenta <= 0) {
                    return res.status(400).json({
                        ok: false,
                        message: "El precio de venta no es válido"
                    });
                }

                datosActualizar.precio = precioVenta;
            }

            // ==========================================
            // 3. ACTUALIZAR VARIANTES Y STOCK
            // ==========================================

            if (variantes !== undefined) {

                if (!Array.isArray(variantes)) {
                    return res.status(400).json({
                        ok: false,
                        message: "Las variantes deben enviarse como una lista"
                    });
                }

                datosActualizar.variantes = variantes.map((variante) => {

                    const stock = Number(variante.stock);

                    if (!Number.isFinite(stock) || stock < 0) {
                        throw new Error("El stock de una variante no es válido");
                    }

                    return {
                        ...(variante._id ? { _id: variante._id } : {}),
                        atributos: variante.atributos,
                        stock
                    };
                });
            }

            datosActualizar.actualizadoPor = req.usuario.id;

            console.log(
                "Datos que se actualizarán:",
                JSON.stringify(datosActualizar, null, 2)
            );

            // ==========================================
            // 4. GUARDAR CAMBIOS EN MONGODB
            // ==========================================

            producto_actualizado = await Producto.findOneAndUpdate(
                {
                    _id: id,
                    negocioId: req.usuario.negocioId
                },
                {
                    $set: datosActualizar
                },
                {
                    returnDocument: "after",
                    runValidators: true
                }
            );
        }

        // ==========================================
        // 5. COMPROBAR SI SE ENCONTRÓ EL PRODUCTO
        // ==========================================

        if (!producto_actualizado) {
            return res.status(404).json({
                ok: false,
                message: "No se encontró el producto o la variante"
            });
        }

        console.log(
            "Producto guardado en MongoDB:",
            JSON.stringify(producto_actualizado, null, 2)
        );

        // ==========================================
        // 6. RESPUESTA AL FRONTEND
        // ==========================================

        return res.status(200).json({
            ok: true,
            message: "Producto actualizado correctamente",
            producto_actualizado
        });

    } catch (error) {

        console.error(
            "No se ha podido actualizar el producto:",
            error
        );

        return res.status(500).json({
            ok: false,
            message: "Error en el servidor",
            error: error.message
        });
    }
};

