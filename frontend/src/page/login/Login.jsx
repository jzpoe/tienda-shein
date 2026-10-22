import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { inicioSesion } from "../../services/authServices";

export const Login = () => {

    const navigate = useNavigate();
    const [datosLogin, setDatosLogin] = useState({
        user: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosLogin({
            ...datosLogin,
            [name]: value
        })


    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await inicioSesion(
                datosLogin.user,
                datosLogin.password
            )


            localStorage.setItem("token", response.token)
            navigate("/dashboard");


        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 px-4"
        >
            <div className="w-full max-w-md">

                {/* Encabezado */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 mb-4">
                        <span className="text-white text-2xl font-bold">
                            SI
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Sistema de Inventario
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Ingresa a tu cuenta para continuar
                    </p>
                </div>

                {/* Tarjeta */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-gray-200/60 border border-gray-100">

                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Iniciar sesión
                    </h2>

                    {/* Usuario */}
                    <div className="mb-5">
                        <label
                            htmlFor="user"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Usuario
                        </label>

                        <input
                            id="user"
                            type="text"
                            placeholder="Escribe tu usuario"
                            name="user"
                            value={datosLogin.user}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    {/* Contraseña */}
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Escribe tu contraseña"
                            name="password"
                            value={datosLogin.password}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-200 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Iniciar sesión
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        Sistema de gestión de inventario
                    </p>

                </div>
            </div>
        </form>
    )

}