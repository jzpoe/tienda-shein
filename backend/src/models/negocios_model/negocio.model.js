import mongoose from "mongoose";



const negocioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    telefono:{
        type:String,
        
    },
    correo:{
        type:String,
        required: false
    }
})

const Negocio = mongoose.model('Negocio', negocioSchema);
export default Negocio