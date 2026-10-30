import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { agregarProductos } from "../../services/productosServices";

export const ModalAgregarProducto = ({
    openModalProducto,
    cerrarModalProducto,
    actualizarProductos
}) => {
    const [datosProducto, setDatosProducto] = useState({
        nombre: "",
        categoria: "",
        subcategoria: "",
        costoCompra: "",
        precio: ""
    });

    const categorias = [
        "Ropa",
        "Ropa interior",
        "Joyas",
        "Calzado",
        "Accesorios",
        "Electrónica",
        "Hogar",
        "Belleza",
        "Deportes",
        "Juguetes",
        "Mercado",
        "Otras categorías"
    ];

    const subcategorias = {
        "Ropa": ["Camisetas", "Polos", "Pantalones", "Vestidos"],
        "Ropa interior": ["Brasieres", "Panties", "Bóxeres"],
        "Joyas": ["Anillos", "Collares", "Pulseras", "Aretes"],
        "Calzado": ["Tenis", "Sandalias", "Botas"],
        "Accesorios": ["Bolsos", "Cinturones", "Gafas"],
        "Electrónica": ["Celulares", "Audífonos", "Accesorios electrónicos"],
        "Hogar": ["Decoración", "Cocina", "Organización"],
        "Belleza": ["Maquillaje", "Cuidado facial", "Cuidado capilar"],
        "Deportes": ["Ropa deportiva", "Accesorios deportivos"],
        "Juguetes": ["Muñecos", "Juegos de mesa"],
        "Mercado": ["Alimentos", "Bebidas"],
        "Otras categorías": ["Otros"]
    };

    // Cada atributo puede tener varias opciones: Color -> Negro, Blanco; Talla -> S, M, L.
    const [atributosConfigurados, setAtributosConfigurados] = useState([]);
    const [nuevoNombreAtributo, setNuevoNombreAtributo] = useState("");
    const [tipoAtributoSeleccionado, setTipoAtributoSeleccionado] = useState("Color");
    const [variantes, setVariantes] = useState([]);

    // Opciones listas para seleccionar; también se pueden crear opciones personalizadas.
    const opcionesPredeterminadas = {
        Color: ["Negro", "Blanco", "Azul", "Rojo", "Verde", "Amarillo", "Rosado", "Gris", "Beige", "Morado", "Naranja", "Café"],
        Talla: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        Material: ["Algodón", "Poliéster", "Cuero", "Lana", "Lino", "Denim"],
        Dimensiones: [],
        Capacidad: []
    };
    const [imagenProducto, setImagenProducto] = useState(null);
    const [vistaPrevia, setVistaPrevia] = useState("");
    const [guardando, setGuardando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDatosProducto((actual) => ({
            ...actual,
            [name]: value,
            ...(name === "categoria" ? { subcategoria: "" } : {})
        }));
    };

    const handleImagenChange = (e) => {
        const archivo = e.target.files?.[0];
        if (!archivo) return;

        const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
        if (!tiposPermitidos.includes(archivo.type)) {
            toast.error("Selecciona una imagen JPG, PNG o WEBP");
            e.target.value = "";
            return;
        }

        if (archivo.size > 5 * 1024 * 1024) {
            toast.error("La imagen no puede superar los 5 MB");
            e.target.value = "";
            return;
        }

        setImagenProducto(archivo);
        setVistaPrevia((anterior) => {
            if (anterior) URL.revokeObjectURL(anterior);
            return URL.createObjectURL(archivo);
        });
    };

    useEffect(() => {
        return () => {
            if (vistaPrevia) URL.revokeObjectURL(vistaPrevia);
        };
    }, [vistaPrevia]);

    const agregarAtributoConfigurado = (nombreRecibido = "") => {
        const nombre = (nombreRecibido || nuevoNombreAtributo).trim();
        if (!nombre) {
            toast.error("Selecciona una característica o escribe una nueva");
            return;
        }

        const existe = atributosConfigurados.some(
            (atributo) => atributo.nombre.toLowerCase() === nombre.toLowerCase()
        );

        if (existe) {
            toast.error("Ese atributo ya existe");
            return;
        }

        setAtributosConfigurados((actuales) => [
            ...actuales,
            { nombre, valores: [], nuevoValor: "" }
        ]);
        setNuevoNombreAtributo("");
    };

    const agregarOpcionPredeterminada = (index, valor) => {
        const atributo = atributosConfigurados[index];

        if (atributo.valores.some((actual) => actual.toLowerCase() === valor.toLowerCase())) {
            return;
        }

        setAtributosConfigurados((actuales) =>
            actuales.map((item, i) =>
                i === index
                    ? { ...item, valores: [...item.valores, valor] }
                    : item
            )
        );
    };

    const actualizarNuevoValor = (index, valor) => {
        setAtributosConfigurados((actuales) =>
            actuales.map((atributo, i) =>
                i === index ? { ...atributo, nuevoValor: valor } : atributo
            )
        );
    };

    const agregarOpcion = (index) => {
        const atributo = atributosConfigurados[index];
        const valor = atributo.nuevoValor.trim();

        if (!valor) {
            toast.error("Escribe una opción antes de agregarla");
            return;
        }

        if (atributo.valores.some((actual) => actual.toLowerCase() === valor.toLowerCase())) {
            toast.error("Esa opción ya existe en este atributo");
            return;
        }

        setAtributosConfigurados((actuales) =>
            actuales.map((item, i) =>
                i === index
                    ? { ...item, valores: [...item.valores, valor], nuevoValor: "" }
                    : item
            )
        );
    };

    const eliminarOpcion = (indexAtributo, valorEliminar) => {
        setAtributosConfigurados((actuales) =>
            actuales.map((atributo, i) =>
                i === indexAtributo
                    ? { ...atributo, valores: atributo.valores.filter((valor) => valor !== valorEliminar) }
                    : atributo
            )
        );
    };

    const eliminarAtributo = (indexEliminar) => {
        setAtributosConfigurados((actuales) =>
            actuales.filter((_, index) => index !== indexEliminar)
        );
    };

    const generarCombinaciones = () => {
        const atributosValidos = atributosConfigurados.filter(
            (atributo) => atributo.nombre.trim() && atributo.valores.length > 0
        );

        if (atributosValidos.length === 0) {
            toast.error("Agrega al menos un atributo con una opción");
            return;
        }

        // Evita combinaciones excesivas por errores de configuración.
        const cantidad = atributosValidos.reduce(
            (total, atributo) => total * atributo.valores.length,
            1
        );

        if (cantidad > 300) {
            toast.error("Se generarían más de 300 combinaciones. Reduce las opciones.");
            return;
        }

        const combinaciones = atributosValidos.reduce(
            (acumuladas, atributo) =>
                acumuladas.flatMap((combinacion) =>
                    atributo.valores.map((valor) => ({
                        ...combinacion,
                        [atributo.nombre]: valor
                    }))
                ),
            [{}]
        );

        // Conserva el stock ya escrito si se vuelve a generar la misma combinación.
        const variantesNuevas = combinaciones.map((atributos) => {
            const existente = variantes.find(
                (variante) =>
                    JSON.stringify(Object.entries(variante.atributos).sort()) ===
                    JSON.stringify(Object.entries(atributos).sort())
            );

            return {
                atributos,
                stock: existente ? existente.stock : ""
            };
        });

        setVariantes(variantesNuevas);
        toast.success(`${variantesNuevas.length} combinaciones generadas`);
    };

    const actualizarStock = (index, valor) => {
        setVariantes((actuales) =>
            actuales.map((variante, i) =>
                i === index ? { ...variante, stock: valor } : variante
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (guardando) return;

        if (
            !datosProducto.nombre.trim() ||
            !datosProducto.categoria.trim() ||
            !datosProducto.precio.trim() ||
            datosProducto.costoCompra === ""
        ) {
            toast.error("Completa el nombre, la categoría, el costo y el precio");
            return;
        }

        const costoCompra = Number(datosProducto.costoCompra);
        const precio = Number(datosProducto.precio);

        if (!Number.isFinite(precio) || precio <= 0) {
            toast.error("Ingresa un precio válido mayor que cero");
            return;
        }


        if (!Number.isFinite(costoCompra) || costoCompra < 0) {
            toast.error("Ingresa un costo de compra válido");
            return;
        }

        if (variantes.length === 0) {
            toast.error("Genera al menos una combinación de variantes");
            return;
        }

        const stockInvalido = variantes.some(
            (variante) =>
                variante.stock === "" ||
                !Number.isInteger(Number(variante.stock)) ||
                Number(variante.stock) < 0
        );

        if (stockInvalido) {
            toast.error("Ingresa un stock entero igual o mayor que cero en cada combinación");
            return;
        }

        setGuardando(true);

        try {
            const producto = {
                ...datosProducto,
                costoCompra,
                precio,
                variantes: variantes.map((variante) => ({
                    atributos: variante.atributos,
                    stock: Number(variante.stock)
                }))
            };

            const formData = new FormData();
            
            formData.append("producto", JSON.stringify(producto));
            if (imagenProducto) formData.append("imagen", imagenProducto);

            await agregarProductos(formData);
            await actualizarProductos();

            toast.success("¡Producto guardado correctamente!");

            setDatosProducto({ nombre: "", categoria: "", subcategoria: "", costoCompra: "", precio: "" });
            setAtributosConfigurados([]);
            setNuevoNombreAtributo("");
            setVariantes([]);
            setImagenProducto(null);
            setVistaPrevia("");
            cerrarModalProducto();
        } catch (error) {
            console.error("Error al crear el producto:", error);
            toast.error(
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                "No se pudo crear el producto"
            );
        } finally {
            setGuardando(false);
        }
    };

    const eliminarCombinacion = (indice) => {
        setVariantes((prev) =>
            prev.filter((_, index) => index !== indice)
        );
    };

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

                                        <select
                                            id="categoria"
                                            name="categoria"
                                            value={datosProducto.categoria}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >
                                            <option value="">Selecciona una categoría</option>

                                            {categorias.map((categoria) => (
                                                <option key={categoria} value={categoria}>
                                                    {categoria}
                                                </option>
                                            ))}
                                        </select>

                                        <label htmlFor="subcategoria" className="block text-sm font-medium mb-1">
                                            Subcategoría
                                        </label>

                                        <select
                                            id="subcategoria"
                                            name="subcategoria"
                                            value={datosProducto.subcategoria}
                                            onChange={handleChange}
                                            disabled={!datosProducto.categoria}
                                            className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
                                        >
                                            <option value="">Selecciona una subcategoría</option>

                                            {(subcategorias[datosProducto.categoria] || []).map((subcategoria) => (
                                                <option key={subcategoria} value={subcategoria}>
                                                    {subcategoria}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>

                                        <label
                                            htmlFor="costoCompra"
                                            className="mb-1.5 mt-4 block text-sm font-medium text-gray-700"
                                        >
                                            Costo de compra
                                        </label>

                                        <input
                                            id="costoCompra"
                                            type="number"
                                            name="costoCompra"
                                            min="0"
                                            step="any"
                                            placeholder="Ej. 30000"
                                            value={datosProducto.costoCompra}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition placeholder:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                        <p className="mt-1 text-xs text-gray-500">
                                            Ingresa cuánto te costó adquirir el producto.
                                        </p>
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

                            {/* Variantes configurables */}
                            <section className="space-y-5 border-t border-gray-100 pt-5">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800">
                                        Opciones e inventario
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Agrega atributos como color, talla, material o dimensiones. Después genera las combinaciones y asigna el stock de cada una.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                    <label htmlFor="tipoAtributoSeleccionado" className="mb-2 block text-sm font-medium text-gray-700">
                                        Característica
                                    </label>
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <select
                                            id="tipoAtributoSeleccionado"
                                            value={tipoAtributoSeleccionado}
                                            onChange={(e) => setTipoAtributoSeleccionado(e.target.value)}
                                            className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >
                                            <option value="Color">Color</option>
                                            <option value="Talla">Talla</option>
                                            <option value="Material">Material</option>
                                            <option value="Dimensiones">Dimensiones</option>
                                            <option value="Capacidad">Capacidad</option>
                                            <option value="__personalizado">Otra característica…</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (tipoAtributoSeleccionado === "__personalizado") {
                                                    agregarAtributoConfigurado();
                                                } else {
                                                    agregarAtributoConfigurado(tipoAtributoSeleccionado);
                                                }
                                            }}
                                            className="min-h-11 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            + Agregar característica
                                        </button>
                                    </div>

                                    {tipoAtributoSeleccionado === "__personalizado" && (
                                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                            <input
                                                type="text"
                                                value={nuevoNombreAtributo}
                                                onChange={(e) => setNuevoNombreAtributo(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        agregarAtributoConfigurado();
                                                    }
                                                }}
                                                placeholder="Escribe el nombre, por ejemplo: Estampado"
                                                className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                    )}
                                </div>

                                {atributosConfigurados.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-7 text-center">
                                        <div className="mb-2 text-3xl">🎨</div>
                                        <p className="text-sm font-medium text-gray-700">Todavía no hay características</p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Empieza agregando Color, Talla u otra característica del producto.
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {atributosConfigurados.map((atributo, index) => (
                                        <div key={atributo.nombre} className="rounded-xl border border-gray-200 bg-white p-4">
                                            <div className="mb-3 flex items-center justify-between gap-3">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{atributo.nombre}</h4>
                                                    <p className="text-xs text-gray-500">
                                                        {atributo.valores.length} opción(es)
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarAtributo(index)}
                                                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>

                                            {opcionesPredeterminadas[atributo.nombre] && opcionesPredeterminadas[atributo.nombre].length > 0 && (
                                                <div className="mb-3">
                                                    <p className="mb-2 text-xs font-medium text-gray-500">Opciones sugeridas · selecciona para agregarlas</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {opcionesPredeterminadas[atributo.nombre].map((valor) => {
                                                            const seleccionado = atributo.valores.some(
                                                                (actual) => actual.toLowerCase() === valor.toLowerCase()
                                                            );
                                                            return (
                                                                <button
                                                                    key={valor}
                                                                    type="button"
                                                                    disabled={seleccionado}
                                                                    onClick={() => agregarOpcionPredeterminada(index, valor)}
                                                                    className={`min-h-10 rounded-full border px-3 py-2 text-sm font-medium transition ${seleccionado
                                                                        ? "cursor-default border-blue-200 bg-blue-100 text-blue-400"
                                                                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                                                                        }`}
                                                                >
                                                                    {valor}{seleccionado ? " ✓" : ""}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mb-3 flex flex-wrap gap-2">
                                                {atributo.valores.map((valor) => (
                                                    <button
                                                        key={valor}
                                                        type="button"
                                                        onClick={() => eliminarOpcion(index, valor)}
                                                        title={`Quitar ${valor}`}
                                                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        {valor}
                                                        <span aria-hidden="true">×</span>
                                                    </button>
                                                ))}
                                                {atributo.valores.length === 0 && (
                                                    <p className="text-xs text-gray-400">Agrega una o más opciones abajo.</p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2 sm:flex-row">
                                                <input
                                                    type="text"
                                                    value={atributo.nuevoValor}
                                                    onChange={(e) => actualizarNuevoValor(index, e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            agregarOpcion(index);
                                                        }
                                                    }}
                                                    placeholder={`Nueva opción para ${atributo.nombre}`}
                                                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => agregarOpcion(index)}
                                                    className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                                >
                                                    + Agregar opción
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={generarCombinaciones}
                                    disabled={!atributosConfigurados.some((atributo) => atributo.valores.length > 0)}
                                    className="min-h-11 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
                                >
                                    Generar combinaciones
                                </button>

                                {variantes.length > 0 && (
                                    <div className="overflow-hidden rounded-xl border border-gray-200">
                                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                                            <h4 className="font-semibold text-gray-800">Stock por combinación</h4>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Se generaron {variantes.length} combinaciones. Escribe cuántas unidades tienes de cada una.
                                            </p>
                                        </div>


                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[360px] text-left text-sm">
                                                <thead className="bg-white text-xs uppercase tracking-wide text-gray-500">
                                                    <tr>
                                                        <th className="px-4 py-3">Características</th>
                                                        <th className="w-32 px-4 py-3">Stock</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {variantes.map((variante, index) => (
                                                        <tr key={`${JSON.stringify(variante.atributos)}-${index}`} className="bg-white">
                                                            <td className="px-4 py-3">
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {Object.entries(variante.atributos).map(([nombre, valor]) => (
                                                                        <span
                                                                            key={nombre}
                                                                            className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700"
                                                                        >
                                                                            <strong className="mr-1">{nombre}:</strong> {valor}
                                                                        </span>

                                                                    ))}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => eliminarCombinacion(index)}
                                                                        className="rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                                                                        title="Eliminar combinación"
                                                                        aria-label="Eliminar combinación"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    step="1"
                                                                    inputMode="numeric"
                                                                    aria-label={`Stock para ${Object.values(variante.atributos).join(" ")}`}
                                                                    value={variante.stock}
                                                                    onChange={(e) => actualizarStock(index, e.target.value)}
                                                                    placeholder="0"
                                                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                                />
                                                            </td>
                                                        </tr>

                                                    ))}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
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