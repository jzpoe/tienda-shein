

export const auth_administrador =async(req, res, next)=>{

    try {
        const validar_admin = req.usuario.rol

        if(validar_admin !== "administrador"){
            return res.status(403).json({
                ok:false,
                message:"no tiene permisos para esta acción"
            })
        }


        next()

    } catch (error) {
        return res.status(401).json({
        ok: false,
        message: "El token es inválido o ha expirado"
    })
    }

}