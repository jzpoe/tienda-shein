import Negocio from "../../models/negocios_model/negocio.model.js"
import Usuario from "../../models/usuario_model/usuario.model.js"
import bcrypt from 'bcrypt';


export const registrar_negocio = async (req, res) => {
    try {
        const { nombreNegocio, telefonoNegocio, correoNegocio,
            nombreUsuario, usuario, correo, contrasena
        } = req.body;

        const datos_usuario = {
            nombre: nombreUsuario,
            usuario,
            correo,
            contrasena
        };

        const datos_negocio = {
            nombre: nombreNegocio,
            telefono: telefonoNegocio,
            correo: correoNegocio
        };

        if (
            !datos_usuario.nombre ||
            !datos_usuario.usuario ||
            !datos_usuario.correo ||
            !datos_usuario.contrasena
        ) {
            return res.status(400).json({
                ok: false,
                message: "Se requieren los datos del usuario"
            })
        }

        if (!datos_negocio.nombre ||
            !datos_negocio.telefono ||
            !datos_negocio.correo) {
            return res.status(400).json({
                ok: false,
                message: "se requieren los datos del negocio"
            })
        }

        const nuevo_negocio = await Negocio.create(datos_negocio);
        datos_usuario.negocioId = nuevo_negocio._id;
        datos_usuario.rol = "administrador";

        
        const password = await bcrypt.hash(datos_usuario.contrasena, 10);
        datos_usuario.contrasena = password;

        const nuevo_usuario = await Usuario.create(datos_usuario);

        return res.status(202).json({
            ok: true,
            message: "usuario creado con exito",
            nuevo_usuario
        })



    } catch (error) {
        console.error("Error al registrar negocio:", error);

        return res.status(500).json({
            ok: false,
            message: "Error al registrar el negocio",
            error: error.message
        });
    }
}