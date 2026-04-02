import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProductos, getCategorias, getMarcas } from '../../services/producto.service'
import { useCart } from '../../context/CartContext'
import styles from './Productos.module.css'

export default function Productos() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [productos, setProductos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [marcas, setMarcas] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const [cargando, setCargando] = useState(true)
    const { agregar } = useCart()
    const [agregando, setAgregando] = useState(null)

    const filtros = {
        categoria: searchParams.get('categoria') || '',
        marca:     searchParams.get('marca') || '',
        busqueda:  searchParams.get('busqueda') || '',
        orden:     searchParams.get('orden') || 'reciente',
        pagina:    searchParams.get('pagina') || '1',
        limite:    '12'
    }

    useEffect(() => {
        setCargando(true)
        getProductos(filtros)
            .then(res => {
                const d = res.data.data
                setProductos(d.productos)
                setTotal(d.total)
                setTotalPaginas(d.totalPaginas)
            })
            .finally(() => setCargando(false))
    }, [searchParams])

    useEffect(() => {
        getCategorias().then(res => setCategorias(res.data.data))
        getMarcas().then(res => setMarcas(res.data.data))
    }, [])

    const setFiltro = (key, value) => {
        const params = Object.fromEntries(searchParams)
        if (value) params[key] = value
        else delete params[key]
        params.pagina = '1'
        setSearchParams(params)
    }

    const handleAgregar = async (e, id_producto) => {
        e.preventDefault()
        e.stopPropagation()
        setAgregando(id_producto)
        try {
            await agregar(id_producto, 1)
        } catch (err) {
            console.error(err)
        } finally {
            setAgregando(null)
        }
    }

    return (
        <div className={styles.page}>

            {/* ── SIDEBAR FILTROS ───────────── */}
            <aside className={styles.sidebar}>
                <div className={styles.filterGroup}>
                    <h3 className={styles.filterTitle}>Buscar</h3>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar producto..."
                        defaultValue={filtros.busqueda}
                        onKeyDown={e => {
                            if (e.key === 'Enter')
                                setFiltro('busqueda', e.target.value)
                        }}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <h3 className={styles.filterTitle}>Categorías</h3>
                    <ul className={styles.filterList}>
                        <li>
                            <button
                                className={!filtros.categoria ? styles.filterItemActive : styles.filterItem}
                                onClick={() => setFiltro('categoria', '')}>
                                Todas
                            </button>
                        </li>
                        {categorias.map(cat => (
                            <li key={cat.id_categoria}>
                                <button
                                    className={filtros.categoria === cat.slug
                                        ? styles.filterItemActive
                                        : styles.filterItem}
                                    onClick={() => setFiltro('categoria', cat.slug)}>
                                    {cat.nombre}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {marcas.length > 0 && (
                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Marcas</h3>
                        <ul className={styles.filterList}>
                            <li>
                                <button
                                    className={!filtros.marca ? styles.filterItemActive : styles.filterItem}
                                    onClick={() => setFiltro('marca', '')}>
                                    Todas
                                </button>
                            </li>
                            {marcas.map(m => (
                                <li key={m.id_marca}>
                                    <button
                                        className={filtros.marca === m.nombre
                                            ? styles.filterItemActive
                                            : styles.filterItem}
                                        onClick={() => setFiltro('marca', m.nombre)}>
                                        {m.nombre}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </aside>

            {/* ── CONTENIDO PRINCIPAL ───────── */}
            <main className={styles.main}>

                {/* Header */}
                <div className={styles.mainHeader}>
                    <p className={styles.resultados}>
                        {cargando ? 'Cargando...' : `${total} productos encontrados`}
                    </p>
                    <select
                        className={styles.ordenSelect}
                        value={filtros.orden}
                        onChange={e => setFiltro('orden', e.target.value)}>
                        <option value="reciente">Más recientes</option>
                        <option value="precio_asc">Precio: menor a mayor</option>
                        <option value="precio_desc">Precio: mayor a menor</option>
                        <option value="nombre_asc">Nombre A-Z</option>
                    </select>
                </div>

                {/* Grid de productos */}
                {cargando ? (
                    <div className={styles.cargando}>Cargando productos...</div>
                ) : productos.length === 0 ? (
                    <div className={styles.vacio}>
                        <p>No se encontraron productos</p>
                        <button
                            className={styles.limpiarBtn}
                            onClick={() => setSearchParams({})}>
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {productos.map(prod => (
                            <Link
                                key={prod.id_producto}
                                to={`/productos/${prod.slug}`}
                                className={styles.card}>

                                <div className={styles.cardImg}>
                                    {prod.imagen_url
                                        ? <img src={prod.imagen_url} alt={prod.nombre} />
                                        : <span>🔌</span>
                                    }
                                    {prod.destacado && (
                                        <span className={styles.badge}>DESTACADO</span>
                                    )}
                                </div>

                                <div className={styles.cardBody}>
                                    <p className={styles.cardCategoria}>{prod.categoria}</p>
                                    <p className={styles.cardNombre}>{prod.nombre}</p>
                                    <p className={styles.cardSku}>{prod.sku}</p>

                                    <div className={styles.cardFooter}>
                                        <span className={styles.cardPrecio}>
                                            ${parseFloat(prod.precio).toFixed(2)}
                                        </span>
                                        <button
                                            className={styles.addBtn}
                                            onClick={e => handleAgregar(e, prod.id_producto)}
                                            disabled={agregando === prod.id_producto}>
                                            {agregando === prod.id_producto ? '...' : '+ Añadir'}
                                        </button>
                                    </div>

                                    <p className={styles.cardStock}>
                                        <span className={styles.stockDot}></span>
                                        Stock: {prod.stock}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Paginación */}
                {totalPaginas > 1 && (
                    <div className={styles.paginacion}>
                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                className={parseInt(filtros.pagina) === p
                                    ? styles.pageActive
                                    : styles.pageBtn}
                                onClick={() => setFiltro('pagina', String(p))}>
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}