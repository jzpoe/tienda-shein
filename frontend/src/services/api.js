import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001/api"
    },
)

api.interceptors.request.use((config)=>{

        // obtener token
        const token = localStorage.getItem("token")

        // verificar si existe
        if (!token) {
        console.error("No se ha proporcionado ningún token");
    }
        // agregar Authorization
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
            
        }

        return config
         
    })

export default api;