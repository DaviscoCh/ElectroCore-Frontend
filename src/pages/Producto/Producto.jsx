import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProducto } from '../../services/producto.service'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import styles from './Producto.module.css'

export default function Producto() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const { agregar } = useCart()
    const { usuario } = useAuth()

    const [producto, setProducto] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [cantidad, setCantidad] = useState(1)
    const [agregando, setAgregando] = useState(false)
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        setCargando(true)
        getProducto(slug)
            .then(res => setProducto(res.data.data))
            .catch(() => navigate('/productos'))
            .finally(() => setCargando(false))
    }, [slug])

    const handleAgregar = async () => {
        if (!usuario) {
            navigate('/login')
            return
        }
        setAgregando(true)
        try {
            await agregar(producto.id_producto, cantidad)
            setMensaje('✅ Producto agregado al carrito')
            setTimeout(() => setMensaje(''), 3000)
        } catch (err) {
            setMensaje('❌ ' + (err.response?.data?.error || 'Error al agregar'))
            setTimeout(() => setMensaje(''), 3000)
        } finally {
            setAgregando(false)
        }
    }

    if (cargando) return (
        <div className={styles.cargando}>Cargando producto...</div>
    )

    if (!producto) return null

    return (
        <div className={styles.page}>
            <div className="container">

                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <span onClick={() => navigate('/productos')}
                        className={styles.breadLink}>
                        Productos
                    </span>
                    <span className={styles.breadSep}>/</span>
                    <span className={styles.breadLink}
                        onClick={() => navigate(`/productos?categoria=${producto.categoria_slug}`)}>
                        {producto.categoria}
                    </span>
                    <span className={styles.breadSep}>/</span>
                    <span className={styles.breadCurrent}>{producto.nombre}</span>
                </div>

                <div className={styles.grid}>

                    {/* Imagen */}
                    <div className={styles.imgSection}>
                        <div className={styles.imgMain}>
                            {producto.imagen_url
                                ? <img src={producto.imagen_url} alt={producto.nombre} />
                                : <span className={styles.imgPlaceholder}>🔌</span>
                            }
                        </div>
                    </div>

                    {/* Info */}
                    <div className={styles.infoSection}>
                        <div className={styles.tags}>
                            <span className={styles.tag}>{producto.categoria}</span>
                            {producto.marca && (
                                <span className={styles.tag}>{producto.marca}</span>
                            )}
                            {producto.destacado && (
                                <span className={styles.tagDestacado}>DESTACADO</span>
                            )}
                        </div>

                        <h1 className={styles.nombre}>{producto.nombre}</h1>

                        <p className={styles.sku}>
                            SKU: <span>{producto.sku}</span>
                        </p>

                        <div className={styles.precio}>
                            ${parseFloat(producto.precio).toFixed(2)}
                        </div>

                        <p className={styles.desc}>{producto.descripcion}</p>

                        {/* Stock */}
                        <div className={styles.stockRow}>
                            <span className={styles.stockDot}></span>
                            <span className={styles.stockText}>
                                {producto.stock > 0
                                    ? `En stock (${producto.stock} disponibles)`
                                    : 'Sin stock'}
                            </span>
                        </div>

                        {/* Cantidad */}
                        {producto.stock > 0 && (
                            <div className={styles.cantidadRow}>
                                <span className={styles.cantidadLabel}>Cantidad:</span>
                                <div className={styles.cantidadCtrl}>
                                    <button
                                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                        className={styles.cantidadBtn}>
                                        −
                                    </button>
                                    <span className={styles.cantidadNum}>{cantidad}</span>
                                    <button
                                        onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                                        className={styles.cantidadBtn}>
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Mensaje */}
                        {mensaje && (
                            <div className={mensaje.includes('✅')
                                ? styles.msgSuccess
                                : styles.msgError}>
                                {mensaje}
                            </div>
                        )}

                        {/* Botón */}
                        <button
                            className={styles.addBtn}
                            onClick={handleAgregar}
                            disabled={agregando || producto.stock === 0}>
                            {agregando ? 'Agregando...' :
                             producto.stock === 0 ? 'Sin stock' :
                             '🛒 Agregar al carrito'}
                        </button>

                        {/* Especificaciones */}
                        {producto.especificaciones?.length > 0 && (
                            <div className={styles.specs}>
                                <h3 className={styles.specsTitle}>
                                    Especificaciones técnicas
                                </h3>
                                <table className={styles.specsTable}>
                                    <tbody>
                                        {producto.especificaciones.map((spec, i) => (
                                            <tr key={i}>
                                                <td className={styles.specKey}>
                                                    {spec.clave}
                                                </td>
                                                <td className={styles.specVal}>
                                                    {spec.valor}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}