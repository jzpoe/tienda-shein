import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { agregarProductos } from "../../services/productosServices";

export const ModalAgregarProducto = ({ openModalProducto, cerrarModalProducto, actualizarProductos }) => {

    const [datosProducto, setDatosProducto] = useState({ nombre: "", categoria: "", precio: "" });
    const [variantes, setVariantes] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDatosProducto({
            ...datosProducto,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            if (datosProducto.nombre.trim() === "" ||
                datosProducto.precio.trim() === "" ||
                datosProducto.categoria.trim() === "") {
                toast.error("por favor ingrese los campos requeridos")
                return;
            }

            //variantes.length === 0 detecta que no agregaste ninguna variante.
            if (variantes.length === 0) {
                toast.error("Por favor, agrega al menos una variante");
                return;
            }

            // some() detecta si alguna de las variantes agregadas tiene el objeto atributos vacío.
            if (variantes.some((variante) => Object.keys(variante.atributos).length === 0)) {
                toast.error('¡Por favor ingresar las variantes!');
                return
            }

            

            const precio = Number(datosProducto.precio);

            //Number.isFinite() comprueba que el resultado sea un número válido y finito.

            if (!Number.isFinite(precio) || precio <= 0) {
                toast.error("Ingrese un precio válido mayor que cero");
                return;
            }

            const productos = {
                ...datosProducto,
                precio: precio,
                variantes: variantes.map((variante) => ({
                    atributos: variante.atributos,
                    stock: Number(variante.stock)
                }))
            };

            const existeStockInvalido  = variantes.some((item) => Number(item.stock) <= 0);

            if (existeStockInvalido ) {
                toast.error("Ingrese un stock válido mayor que cero para todas las variantes");
                return;
            }

            await agregarProductos(productos)
            toast.success('¡Productos guardado con éxito!');


            await actualizarProductos()

            cerrarModalProducto();

            setDatosProducto({
                nombre: "",
                categoria: "",
                precio: ""
            });

            setVariantes([]);

        } catch (error) {
            "Error al crear el producto:",
                error.response?.data?.message || error.message
        }

    }



    const agregarVariante = () => {
        setVariantes([
            ...variantes,
            {
                atributos: {},
                stock: 0,
                nombreAtributo: "",
                valorAtributo: ""
            }
        ]);
    }

    const handleNombreAtributo = (e, index) => {

        const nuevosAtributos = variantes.map((copiaVariantes, i) => (
            i === index ? { ...copiaVariantes, nombreAtributo: e.target.value } : copiaVariantes
        ))

        setVariantes(nuevosAtributos)
    }

    const handleValorAtributo = (e, index) => {

        const nuevoAtributoValor = variantes.map((copiaVariantes, i) => (
            i === index ? { ...copiaVariantes, valorAtributo: e.target.value } : copiaVariantes
        ))
        setVariantes(nuevoAtributoValor)

    }

    const agregarAtributo = (index) => {
        const nuevosAtributos = [...variantes];

        const variante = {
            ...nuevosAtributos[index],
            atributos: {
                ...nuevosAtributos[index].atributos
            }
        };

        const nombreAtributo = variante.nombreAtributo.trim();
        const valorAtributo = variante.valorAtributo.trim();

        if (!nombreAtributo || !valorAtributo) {
            return;
        }

        if (nombreAtributo in variante.atributos) {
            return console.log(
                `El atributo ${nombreAtributo} ya existe con el valor ${variante.atributos[nombreAtributo]}`
            );
        }

        variante.atributos[nombreAtributo] = valorAtributo;

        variante.nombreAtributo = "";
        variante.valorAtributo = "";

        nuevosAtributos[index] = variante;

        setVariantes(nuevosAtributos);
    };


    const handleStock = (e, index) => {

        const valor = Number.parseInt(e.target.value);

        const nuevasVariantes = variantes.map((varisanteStock, i) => {
            return i === index ?
                { ...varisanteStock, stock: valor } : varisanteStock
        })


        setVariantes(nuevasVariantes)

    }

    // useEffect(() => {
    //     console.log("Variantes actualizadas:", variantes);
    // }, [variantes]);





    return (
        <>
            {openModalProducto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                        {/* Encabezado */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Agregar producto
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Ingresa la información del producto
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={cerrarModalProducto}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-red-100 hover:text-gray-800"
                            >
                                ✕
                            </button>

                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="space-y-5 p-6">

                            {/* Nombre */}
                            <div>
                                <label
                                    htmlFor="nombre"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Nombre del producto
                                </label>

                                <input
                                    id="nombre"
                                    type="text"
                                    name="nombre"
                                    placeholder="Ej. Camisa"
                                    value={datosProducto.nombre}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Categoría */}
                            <div>
                                <label
                                    htmlFor="categoria"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Categoría
                                </label>

                                <input
                                    id="categoria"
                                    type="text"
                                    name="categoria"
                                    placeholder="Ej. Ropa"
                                    value={datosProducto.categoria}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Precio */}
                            <div>
                                <label
                                    htmlFor="precio"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Precio
                                </label>

                                <input
                                    id="precio"
                                    type="number"
                                    name="precio"
                                    placeholder="Ej. 50000"
                                    value={datosProducto.precio}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={agregarVariante}
                                className="rounded-xl border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                            >
                                + Agregar variante
                            </button>



                            {variantes.map((variante, index) => (
                                <div key={index}>
                                    <h3>Variante agregadas </h3>
                                    {Object.entries(variante.atributos).map(([nombre, valor]) => (
                                        <p key={nombre}>
                                            {nombre}:{valor}
                                            {variante.stock}
                                        </p>
                                    ))}

                                    {/* Valor del atributo */}
                                    <input
                                        type="text"
                                        placeholder="Nombre del atributo"
                                        value={variante.nombreAtributo}
                                        onChange={(e) => { handleNombreAtributo(e, index) }}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Valor del atributo"
                                        value={variante.valorAtributo}
                                        onChange={(e) => handleValorAtributo(e, index)}

                                    />

                                    <input
                                        type="number"
                                        placeholder="Stock"
                                        min="0"
                                        step="1"
                                        value={variante.stock}
                                        onChange={(e) => {
                                            const nuevasVariantes = [...variantes];
                                            nuevasVariantes[index].stock = e.target.value;
                                            setVariantes(nuevasVariantes);
                                        }}
                                    />

                                    <button type="button" onClick={() => { agregarAtributo(index) }} >Agregar</button>

                                </div>
                            ))}


                            {/* Botones */}
                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                                <button
                                    type="button"
                                    onClick={cerrarModalProducto}
                                    className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-red-100 hover:text-red-600"                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                >
                                    Crear producto
                                </button>

                            </div>

                        </form>
                    </div >
                </div >
            )}
        </>
    );
};