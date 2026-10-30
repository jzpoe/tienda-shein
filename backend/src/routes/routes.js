import express from "express"
import { ingresar_producto } from "../controllers/productos/producto.controller.js";
import { obtener_productos } from "../controllers/productos/productos.obtener.js";
import { obtener_producto_id } from "../controllers/productos/producto.obtenerID.js";
import { editar_producto } from "../controllers/productos/producto.edita.js";
import { productos_eliminar } from "../controllers/productos/productos.eliminar.js";
import { crear_usuario } from "../controllers/usuario/usuario.controlles.js";
import { login } from "../controllers/usuario/usuario.login.js";
import { perfil } from "../controllers/usuario/usuario.perfil.js";
import { authMiddleware } from "../auth_middleware/auth.middleware.js";
import { auth_administrador } from "../auth_middleware/auth.administrador.js";
import { obtener_usuarios } from "../controllers/usuario/usuarios.verUsuarios.js";
import { registrar_negocio } from "../controllers/negocio_controller/registrar_negocio.controller.js";
import subirImagen from "../image_middleware/subirImagen.js";
import { registrar_venta } from "../controllers/ventas/ventas.registrar.js";

const router = express.Router();


//crear productos
router.post("/productos",authMiddleware,  auth_administrador,subirImagen.single("imagen"), ingresar_producto);
router.get("/productos",authMiddleware, obtener_productos);
// router.put("/productos/:id", authMiddleware, obtener_producto_id)
router.patch("/productoS/:id",authMiddleware, editar_producto)
router.delete("/productos/:id",authMiddleware,  productos_eliminar)


//crear usuarios 

router.post('/usuarios', crear_usuario)
router.post('/login', login)
router.get('/usuarios', obtener_usuarios)

router.get("/perfil", authMiddleware, perfil);


router.post("/registro-negocio", registrar_negocio);

// Registrar una venta
router.post("/ventas", authMiddleware, registrar_venta);
// Consultar historial de ventas
router.get("/ventas", authMiddleware, obtener_ventas);


export default router