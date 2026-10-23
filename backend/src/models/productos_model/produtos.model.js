import mongoose from "mongoose";


const poductoSchema = new mongoose.Schema({

    negocioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Negocio",
        required: true
    },
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },

    actualizadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    nombre: {
        type: String,
        required: true,
    },
    categoria: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    imagen: {
    type: String,
    default: null
},
    variantes: [
        {
            atributos: {
                type: Map,
                of: String
            },
            stock: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],


})

const Producto = mongoose.model("Producto", poductoSchema);
export default Producto