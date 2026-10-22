import mongoose from "mongoose";


const usuarioschema = new mongoose.Schema({

    negocioId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Negocio",
        required: true
    },

    nombre: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: false
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true
    },
    rol:

    {
        type: String,
        enum: [
            "administrador",
            "vendedor"
        ],
        required: true
    }


},
    {
        timestamps: true
    })

const Usuario = mongoose.model('Usuario', usuarioschema);

export default Usuario