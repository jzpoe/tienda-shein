

export const perfil =async(req, res)=>{
    try {
     return res.status(200).json({
        ok: true,
        usuario: req.usuario
     })
    } catch (error) {
        
    }
}