import Usuario from "../../models/usuario_model/usuario.model.js";
import bcrypt from 'bcrypt';



export const crear_usuario = async (req, res) => {
    try {
        const usuario = req.body;

        const password = usuario.contrasena

        const validarUsuario = await Usuario.findOne({
            $or: [
                { usuario: usuario.usuario },
                { correo: usuario.correo }
            ]
        })
        if (validarUsuario) {
            if (validarUsuario.usuario === usuario.usuario) {
                return res.status(409).json({
                    ok: false,
                    message: "El usuario ya esta registrado"
                })
            } else if (validarUsuario.correo === usuario.correo) {
                return res.status(409).json({
                    ok: false,
                    message: "El correo ya esta registrado"
                })
            }
        }

        const hashPassword = await bcrypt.hash(password, 10);
        usuario.contrasena = hashPassword
        const usuario_nuevo = await Usuario.create(usuario);


        return res.status(201).json({
            ok: true,
            message: "Usuario creado exitosamente",
            usuario_nuevo
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