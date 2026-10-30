import Venta from "../../models/ventas_model/ventas.model.js";

export const obtener_ventas = async (req, res) => {
    try {
        const { desde, hasta, buscar } = req.query;

        // 1. Filtrar exclusivamente por el negocio autenticado
        const filtro = {
            negocioId: req.usuario.negocioId
        };

        // 2. Filtrar por fechas
        if (desde || hasta) {
            filtro.fechaVenta = {};

            if (desde) {
                const fechaDesde = new Date(`${desde}T00:00:00.000`);

                if (Number.isNaN(fechaDesde.getTime())) {
                    return res.status(400).json({
                        ok: false,
                        message: "La fecha inicial no es válida"
                    });
                }

                filtro.fechaVenta.$gte = fechaDesde;
            }

            if (hasta) {
                const fechaHasta = new Date(`${hasta}T23:59:59.999`);

                if (Number.isNaN(fechaHasta.getTime())) {
                    return res.status(400).json({
                        ok: false,
                        message: "La fecha final no es válida"
                    });
                }

                filtro.fechaVenta.$lte = fechaHasta;
            }
        }

        // 3. Consultar las ventas
        let consulta = Venta.find(filtro)
            .populate("registradoPor", "nombre usuario")
            .sort({ fechaVenta: -1 });

        const ventas = await consulta;

        // 4. Filtrar por nombre del producto o cliente
        // Se hace sobre las ventas ya consultadas del negocio.
        let ventasFiltradas = ventas;

        if (buscar && buscar.trim()) {
            const termino = buscar.trim().toLowerCase();

            ventasFiltradas = ventas.filter((venta) => {
                const coincideCliente =
                    venta.cliente?.nombre?.toLowerCase().includes(termino);

                const coincideProducto = venta.productos.some((producto) =>
                    producto.nombreProducto.toLowerCase().includes(termino)
                );

                return coincideCliente || coincideProducto;
            });
        }

        // 5. Calcular resumen de las ventas consultadas
        const resumen = ventasFiltradas.reduce(
            (acumulado, venta) => {
                acumulado.cantidadVentas += 1;
                acumulado.ingresos += venta.total;
                acumulado.costos += venta.costoTotal;
                acumulado.ganancias += venta.ganancia;

                return acumulado;
            },
            {
                cantidadVentas: 0,
                ingresos: 0,
                costos: 0,
                ganancias: 0
            }
        );

        return res.status(200).json({
            ok: true,
            message: "Ventas obtenidas correctamente",
            resumen,
            total: ventasFiltradas.length,
            ventas: ventasFiltradas
        });

    } catch (error) {
        console.error("Error al obtener las ventas:", error);

        return res.status(500).json({
            ok: false,
            message: "No se pudieron obtener las ventas",
            error: error.message
        });
    }
};