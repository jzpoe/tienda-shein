import { Navigate } from "react-router-dom";


export const ProtectedRoute=({ children })=>{

   const  validarToken = localStorage.getItem('token')


   if(!validarToken){
    return <Navigate to="/login" />;
   }
   return children;

    
}