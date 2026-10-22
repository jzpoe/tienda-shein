import Usuario from "../../models/usuario_model/usuario.model.js"

export const obtener_usuarios = async (req, res) => {
    try {

        const usuarios = await Usuario.find();

        if (usuarios === 0) {
            return res.status(404).json({
                ok: false,
                message: "No hay usuarios creados actualmente"
            })
        }

        return res.status(200).json({
            ok: true,
            message: "Usuarios creados",
            usuarios
        })



    } catch (error) {
        console.error("No se han podido obtener los Usuarios", error)

        return res.status(500).json({
            ok: false,
            message: "error en el serivor",
            error: error.message
        })
    }
}