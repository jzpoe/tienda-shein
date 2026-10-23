import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { agregarProductos } from "../../services/productosServices";

export const ModalAgregarProducto = ({ openModalProducto, cerrarModalProducto, actualizarProductos }) => {

    const [datosProducto, setDatosProducto] = useState({ nombre: "", categoria: "", precio: "" });
    const [variantes, setVariantes] = useState([]);
    const [imagenProducto, setImagenProducto] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState("");
    const [guardando, setGuardando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDatosProducto({
            ...datosProducto,
            [name]: value
        });
    };

    const handleImagenChange = (e) => {
        const archivo = e.target.files[0];

        if (!archivo) return;

        if (!archivo.type.startsWith("image/")) {
            toast.error("Selecciona un archivo de imagen válido");
            return;
        }

        setImagenProducto(archivo);
        setVistaPrevia(URL.createObjectURL(archivo));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (guardando) return;

        setGuardando(true);

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

            const existeStockInvalido = variantes.some((item) => Number(item.stock) <= 0);

            if (existeStockInvalido) {
                toast.error("Ingrese un stock válido mayor que cero para todas las variantes");
                return;
            }

            const formData = new FormData();

            formData.append("producto", JSON.stringify(productos));

            if (imagenProducto) {
                formData.append("imagen", imagenProducto);
            }
            await agregarProductos(formData);
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
        } finally {
            setGuardando(false);
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5">

                    <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Encabezado */}
                        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Agregar producto
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Ingresa la información del producto.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={cerrarModalProducto}
                                aria-label="Cerrar formulario"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                            >
                                ✕
                            </button>

                        </div>

                        {/* Formulario */}
                        <form
                            onSubmit={handleSubmit}
                            className="min-h-0 space-y-6 overflow-y-auto p-5 sm:p-6"
                        >

                            {/* Información general */}
                            <section className="space-y-4">

                                <div>
                                    <h3 className="text-base font-semibold text-gray-800">
                                        Información general
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Describe el producto que deseas registrar.
                                    </p>
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label
                                        htmlFor="nombre"
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Nombre del producto
                                    </label>

                                    <input
                                        id="nombre"
                                        type="text"
                                        name="nombre"
                                        placeholder="Ej. Camisa, Zapatos, Mesa"
                                        value={datosProducto.nombre}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition placeholder:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                {/* Categoría y precio */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <div>
                                        <label
                                            htmlFor="categoria"
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                        >
                                            Categoría
                                        </label>

                                        <input
                                            id="categoria"
                                            type="text"
                                            name="categoria"
                                            placeholder="Ej. Ropa, Hogar, Calzado"
                                            value={datosProducto.categoria}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition placeholder:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="precio"
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                        >
                                            Precio
                                        </label>

                                        <input
                                            id="precio"
                                            type="number"
                                            name="precio"
                                            min="0"
                                            step="any"
                                            placeholder="Ej. 50000"
                                            value={datosProducto.precio}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition placeholder:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                        <p className="mt-1 text-xs text-gray-500">
                                            Ingresa el precio del producto.
                                        </p>
                                    </div>

                                </div>

                            </section>

                            {/* Fotografía del producto */}
                            <section className="space-y-3 border-t border-gray-100 pt-5">

                                <div>
                                    <h3 className="text-base font-semibold text-gray-800">
                                        Fotografía del producto
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Agrega una imagen para identificar el producto fácilmente.
                                    </p>
                                </div>

                                <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 sm:flex-row sm:p-5">

                                    {/* Vista previa de tamaño fijo */}
                                    <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white">

                                        {vistaPrevia ? (
                                            <img
                                                src={vistaPrevia}
                                                alt="Vista previa del producto"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="px-2 text-center text-gray-400">
                                                <span className="text-3xl">
                                                    📷
                                                </span>

                                                <p className="mt-2 text-xs">
                                                    Sin fotografía
                                                </p>
                                            </div>
                                        )}

                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:items-start">

                                        <label
                                            htmlFor="imagenProducto"
                                            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                                        >
                                            {imagenProducto
                                                ? "Cambiar imagen"
                                                : "Seleccionar imagen"}
                                        </label>

                                        <input
                                            id="imagenProducto"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImagenChange}
                                            className="sr-only"
                                        />

                                        <p className="text-center text-xs text-gray-500 sm:text-left">
                                            Puedes seleccionar una imagen de tu dispositivo.
                                        </p>

                                        {imagenProducto && (
                                            <p className="max-w-full break-all text-xs font-medium text-gray-600">
                                                {imagenProducto.name}
                                            </p>
                                        )}

                                    </div>

                                </div>

                            </section>

                            {/* Variantes */}
                            <section className="space-y-4 border-t border-gray-100 pt-5">

                                {/* Encabezado de variantes */}
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <h3 className="text-base font-semibold text-gray-800">
                                            Variantes del producto
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Define características como color, talla, material o tamaño.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={agregarVariante}
                                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    >
                                        <span className="text-lg leading-none">
                                            +
                                        </span>

                                        Agregar variante
                                    </button>

                                </div>

                                {/* Estado vacío */}
                                {variantes.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">

                                        <div className="mb-2 text-3xl">
                                            📦
                                        </div>

                                        <p className="text-sm font-medium text-gray-700">
                                            Todavía no has agregado variantes
                                        </p>

                                        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-500">
                                            Agrega una variante para registrar sus atributos y las unidades disponibles.
                                        </p>

                                    </div>
                                )}

                                {/* Lista de variantes */}
                                <div className="space-y-4">

                                    {variantes.map((variante, index) => (

                                        <div
                                            key={index}
                                            className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
                                        >

                                            {/* Encabezado de la tarjeta */}
                                            <div className="mb-4 flex items-center justify-between gap-3">

                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-800">
                                                        Variante {index + 1}
                                                    </h4>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Configura sus características y stock.
                                                    </p>
                                                </div>

                                                <span className="shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600">
                                                    {Object.keys(variante.atributos || {}).length} atributos
                                                </span>

                                            </div>

                                            {/* Atributos agregados */}
                                            <div className="mb-4">

                                                <p className="mb-2 text-xs font-medium text-gray-600">
                                                    Atributos agregados
                                                </p>

                                                {Object.keys(variante.atributos || {}).length > 0 ? (

                                                    <div className="flex flex-wrap gap-2">

                                                        {Object.entries(variante.atributos || {}).map(
                                                            ([nombre, valor]) => (

                                                                <span
                                                                    key={nombre}
                                                                    className="inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800"
                                                                >
                                                                    <span className="font-semibold">
                                                                        {nombre}:
                                                                    </span>

                                                                    <span className="break-words">
                                                                        {valor}
                                                                    </span>
                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                ) : (

                                                    <p className="rounded-lg border border-gray-200 bg-white px-3 py-3 text-xs text-gray-400">
                                                        Aquí aparecerán los atributos que agregues.
                                                    </p>

                                                )}

                                            </div>

                                            {/* Formulario de atributos */}
                                            <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4">

                                                <div className="mb-3">
                                                    <h5 className="text-sm font-semibold text-gray-800">
                                                        Agregar característica
                                                    </h5>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Escribe el nombre del atributo y su valor.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                                    {/* Nombre del atributo */}
                                                    <div>
                                                        <label
                                                            htmlFor={`nombreAtributo-${index}`}
                                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                                        >
                                                            Nombre del atributo
                                                        </label>

                                                        <input
                                                            id={`nombreAtributo-${index}`}
                                                            type="text"
                                                            placeholder="Ej. Color, Talla, Material"
                                                            value={variante.nombreAtributo}
                                                            onChange={(e) =>
                                                                handleNombreAtributo(e, index)
                                                            }
                                                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none transition placeholder:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                        />

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            ¿Qué característica deseas indicar?
                                                        </p>
                                                    </div>

                                                    {/* Valor del atributo */}
                                                    <div>
                                                        <label
                                                            htmlFor={`valorAtributo-${index}`}
                                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                                        >
                                                            Valor del atributo
                                                        </label>

                                                        <input
                                                            id={`valorAtributo-${index}`}
                                                            type="text"
                                                            placeholder="Ej. Blanco, M, Cuero"
                                                            value={variante.valorAtributo}
                                                            onChange={(e) =>
                                                                handleValorAtributo(e, index)
                                                            }
                                                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none transition placeholder:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                        />

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Escribe el valor correspondiente.
                                                        </p>
                                                    </div>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => agregarAtributo(index)}
                                                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-auto"
                                                >
                                                    + Agregar atributo
                                                </button>

                                            </div>

                                            {/* Stock */}
                                            <div className="mt-4">

                                                <label
                                                    htmlFor={`stock-${index}`}
                                                    className="mb-1.5 block text-sm font-medium text-gray-700"
                                                >
                                                    Stock disponible
                                                </label>

                                                <div className="relative sm:max-w-xs">

                                                    <input
                                                        id={`stock-${index}`}
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        placeholder="Ej. 10"
                                                        value={variante.stock}
                                                        onChange={(e) => {
                                                            const nuevasVariantes = variantes.map(
                                                                (item, i) =>
                                                                    i === index
                                                                        ? {
                                                                            ...item,
                                                                            stock: e.target.value
                                                                        }
                                                                        : item
                                                            );

                                                            setVariantes(nuevasVariantes);
                                                        }}
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base outline-none transition placeholder:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    />

                                                </div>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Cantidad de unidades disponibles de esta variante.
                                                </p>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </section>

                            {/* Botones de acción */}
                            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={cerrarModalProducto}
                                    className="min-h-11 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={guardando}
                                    className={`min-h-11 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${guardando
                                            ? "cursor-not-allowed bg-gray-400"
                                            : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                >
                                    {guardando ? "Guardando producto..." : "Crear producto"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}
        </>
    );

};