
import mongoose from "mongoose";

const detalleVentaSchema = new mongoose.Schema({
    productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
    },
    varianteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    nombreProducto: {
        type: String,
        required: true
    },
    atributos: {
        type: Map,
        of: String
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    precioUnitario: {
        type: Number,
        required: true,
        min: 0
    },
    costoUnitario: {
        type: Number,
        required: true,
        min: 0
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    }
});

const ventaSchema = new mongoose.Schema({
    negocioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Negocio",
        required: true
    },
    registradoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    productos: {
        type: [detalleVentaSchema],
        required: true,
        validate: {
            validator: (productos) => productos.length > 0,
            message: "La venta debe contener al menos un producto"
        }
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    costoTotal: {
        type: Number,
        required: true,
        min: 0
    },
    ganancia: {
        type: Number,
        required: true
    },
    cliente: {
        nombre: {
            type: String,
            default: "Cliente general"
        },
        telefono: {
            type: String,
            default: ""
        }
    },
    fechaVenta: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Venta = mongoose.model("Venta", ventaSchema);

export default Venta;

