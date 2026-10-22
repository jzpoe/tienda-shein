import jwt from 'jsonwebtoken';


export const authMiddleware  =async(req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                ok:false,
                message:"no se ha proporcionado autorización"
            })
        }

        const partes= authHeader.split(" ")
        const token = partes[1];

        const usuario= jwt.verify(token, process.env.JWT_SECRET)

         req.usuario = usuario
         next();

    } catch (error) {
        return res.status(401).json({
        ok: false,
        message: "El token es inválido o ha expirado"
    })
    }
}