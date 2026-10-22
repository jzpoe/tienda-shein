import api from "./api";


export const inicioSesion = async(user, password)=>{
    const response = await api.post("/login",{
        usuario: user,
        contrasena:password
    })
    return response.data
};