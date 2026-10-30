import mongoose from "mongoose";
import Producto from "../../models/productos_model/produtos.model.js";
import Venta from "../../models/ventas_model/ventas.model.js";

export const registrar_venta = async (req, res) => {
    const movimientosStock = [];

    try {
        const { productos, cliente } = req.body;

        // 1. Validar los datos recibidos
        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "Debes seleccionar al menos un producto"
            });
        }

        // Evitar repetir una misma variante en diferentes líneas
        const variantesRegistradas = new Set();

        for (const item of productos) {
            const clave = `${item.productoId}-${item.varianteId}`;

            if (variantesRegistradas.has(clave)) {
                return res.status(400).json({
                    ok: false,
                    message: "No debes repetir una misma variante en la venta"
                });
            }

            variantesRegistradas.add(clave);

            if (
                !mongoose.Types.ObjectId.isValid(item.productoId) ||
                !mongoose.Types.ObjectId.isValid(item.varianteId)
            ) {
                return res.status(400).json({
                    ok: false,
                    message: "El identificador del producto o variante no es válido"
                });
            }

            const cantidad = Number(item.cantidad);

            if (!Number.isInteger(cantidad) || cantidad <= 0) {
                return res.status(400).json({
                    ok: false,
                    message: "La cantidad debe ser un número entero mayor que cero"
                });
            }
        }

        // 2. Consultar productos y preparar los detalles de la venta
        const detallesVenta = [];

        for (const item of productos) {
            const producto = await Producto.findOne({
                _id: item.productoId,
                negocioId: req.usuario.negocioId
            });

            if (!producto) {
                throw new Error("Uno de los productos no existe");
            }

            const variante = producto.variantes.id(item.varianteId);

            if (!variante) {
                throw new Error(
                    `No se encontró una variante del producto ${producto.nombre}`
                );
            }

            const cantidad = Number(item.cantidad);

            if (variante.stock < cantidad) {
                throw new Error(
                    `Stock insuficiente para ${producto.nombre}. Disponible: ${variante.stock}`
                );
            }

            const precioUnitario = Number(producto.precio);
            const costoUnitario = Number(producto.costoCompra);

            if (
                !Number.isFinite(precioUnitario) ||
                !Number.isFinite(costoUnitario)
            ) {
                throw new Error(
                    `El producto ${producto.nombre} tiene precios o costos inválidos`
                );
            }

            const subtotal = cantidad * precioUnitario;

            detallesVenta.push({
                productoId: producto._id,
                varianteId: variante._id,
                nombreProducto: producto.nombre,
                atributos: Object.fromEntries(variante.atributos || new Map()),
                cantidad,
                precioUnitario,
                costoUnitario,
                subtotal
            });
        }

        // 3. Calcular valores de la venta
        const total = detallesVenta.reduce(
            (acumulado, item) => acumulado + item.subtotal,
            0
        );

        const costoTotal = detallesVenta.reduce(
            (acumulado, item) =>
                acumulado + item.cantidad * item.costoUnitario,
            0
        );

        const ganancia = total - costoTotal;

        // 4. Descontar stock con actualización condicional
        for (const item of detallesVenta) {
            const resultado = await Producto.updateOne(
                {
                    _id: item.productoId,
                    negocioId: req.usuario.negocioId,
                    variantes: {
                        $elemMatch: {
                            _id: item.varianteId,
                            stock: { $gte: item.cantidad }
                        }
                    }
                },
                {
                    $inc: {
                        "variantes.$.stock": -item.cantidad
                    },
                    $set: {
                        actualizadoPor: req.usuario.id
                    }
                }
            );

            if (resultado.modifiedCount !== 1) {
                throw new Error(
                    `No se pudo descontar el stock de ${item.nombreProducto}. Verifica las existencias.`
                );
            }

            movimientosStock.push({
                productoId: item.productoId,
                varianteId: item.varianteId,
                cantidad: item.cantidad
            });
        }

        // 5. Registrar la venta
        const nuevaVenta = await Venta.create({
            negocioId: req.usuario.negocioId,
            registradoPor: req.usuario.id,
            productos: detallesVenta,
            total,
            costoTotal,
            ganancia,
            cliente: {
                nombre: cliente?.nombre?.trim() || "Cliente general",
                telefono: cliente?.telefono?.trim() || ""
            }
        });

        return res.status(201).json({
            ok: true,
            message: "Venta registrada correctamente",
            venta: nuevaVenta
        });

    } catch (error) {

        console.error("Error al registrar la venta:", error);

        // 6. Revertir los descuentos si no se pudo completar la operación
        for (const movimiento of movimientosStock.reverse()) {
            try {
                await Producto.updateOne(
                    {
                        _id: movimiento.productoId,
                        negocioId: req.usuario.negocioId,
                        "variantes._id": movimiento.varianteId
                    },
                    {
                        $inc: {
                            "variantes.$.stock": movimiento.cantidad
                        },
                        $set: {
                            actualizadoPor: req.usuario.id
                        }
                    }
                );
            } catch (errorReversion) {
                console.error(
                    "No se pudo revertir un descuento de stock:",
                    errorReversion
                );
            }
        }

        return res.status(400).json({
            ok: false,
            message: error.message || "No se pudo registrar la venta"
        });
    }
};