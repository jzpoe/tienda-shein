import Usuario from "../../models/usuario_model/usuario.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


export const login = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        const encontrarUsuario = await Usuario.findOne({
            usuario: usuario
        });

        

        if (!encontrarUsuario) {
            return res.status(404).json({
                ok: false,
                message: "Usuario no existe, por favor registrarse"
            })
        }



        
        const validarPass = await bcrypt.compare(contrasena, encontrarUsuario.contrasena)
        

        if (!validarPass) {
            return res.status(404).json({
                ok: false,
                message: "usuario o contraseña incorrectos"
            })
        }





        const token = jwt.sign(
            {
                id: encontrarUsuario._id,
                usuario: encontrarUsuario.usuario,
                rol: encontrarUsuario.rol,
                negocioId: encontrarUsuario.negocioId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            ok: true,
            message: "Bienvenido",
            token,
            usuario: {
                id: encontrarUsuario._id,
                nombre: encontrarUsuario.nombre,
                usuario: encontrarUsuario.usuario,
                rol: encontrarUsuario.rol,
                negocioId: encontrarUsuario.negocioId
            }
        })



    } catch (error) {
        console.error("error al ingresar el usuario", error)

        return res.status(500).json({
            ok: false,
            mensaje: "Ocurrió un error interno en el servidor",
            error: error.message // Opcional en desarrollo
        })
    }
}