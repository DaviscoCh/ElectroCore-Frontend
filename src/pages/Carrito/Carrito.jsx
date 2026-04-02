import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import styles from './Carrito.module.css'

export default function Carrito() {
    const { carrito, actualizar, eliminar, vaciar, cargando } = useCart()
    const { usuario } = useAuth()
    const navigate = useNavigate()

    const { items, resumen } = carrito

    if (cargando) return (
        <div className={styles.cargando}>Cargando carrito...</div>
    )

    if (!usuario) return (
        <div className={styles.vacio}>
            <div className={styles.vacioIcon}>🛒</div>
            <h2>Inicia sesión para ver tu carrito</h2>
            <Link to="/login" className={styles.btnPrimary}>
                Iniciar sesión
            </Link>
        </div>
    )

    if (items.length === 0) return (
        <div className={styles.vacio}>
            <div className={styles.vacioIcon}>🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos para comenzar</p>
            <Link to="/productos" className={styles.btnPrimary}>
                Ver productos
            </Link>
        </div>
    )

    return (
        <div className={styles.page}>
            <div className="container">
                <h1 className={styles.titulo}>Mi Carrito</h1>

                <div className={styles.grid}>

                    {/* ── ITEMS ──────────────────── */}
                    <div className={styles.items}>
                        <div className={styles.itemsHeader}>
                            <span>{items.length} producto{items.length !== 1 ? 's' : ''}</span>
                            <button
                                className={styles.vaciarBtn}
                                onClick={vaciar}>
                                Vaciar carrito
                            </button>
                        </div>

                        {items.map(item => (
                            <div key={item.id_carrito} className={styles.item}>
                                <div className={styles.itemImg}>
                                    {item.imagen_url
                                        ? <img src={item.imagen_url} alt={item.nombre} />
                                        : <span>🔌</span>
                                    }
                                </div>

                                <div className={styles.itemInfo}>
                                    <Link
                                        to={`/productos/${item.slug}`}
                                        className={styles.itemNombre}>
                                        {item.nombre}
                                    </Link>
                                    <p className={styles.itemPrecioUnit}>
                                        ${parseFloat(item.precio).toFixed(2)} c/u
                                    </p>
                                </div>

                                <div className={styles.itemCtrl}>
                                    <button
                                        className={styles.ctrlBtn}
                                        onClick={() => actualizar(
                                            item.id_carrito,
                                            item.cantidad - 1
                                        )}>
                                        −
                                    </button>
                                    <span className={styles.ctrlNum}>
                                        {item.cantidad}
                                    </span>
                                    <button
                                        className={styles.ctrlBtn}
                                        onClick={() => actualizar(
                                            item.id_carrito,
                                            item.cantidad + 1
                                        )}
                                        disabled={item.cantidad >= item.stock}>
                                        +
                                    </button>
                                </div>

                                <div className={styles.itemSubtotal}>
                                    ${parseFloat(item.subtotal).toFixed(2)}
                                </div>

                                <button
                                    className={styles.eliminarBtn}
                                    onClick={() => eliminar(item.id_carrito)}
                                    title="Eliminar">
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* ── RESUMEN ─────────────────── */}
                    <div className={styles.resumen}>
                        <h2 className={styles.resumenTitulo}>Resumen</h2>

                        <div className={styles.resumenRow}>
                            <span>Subtotal</span>
                            <span>${resumen.total.toFixed(2)}</span>
                        </div>
                        <div className={styles.resumenRow}>
                            <span>IVA (15%)</span>
                            <span>${(resumen.total * 0.15).toFixed(2)}</span>
                        </div>
                        <div className={styles.resumenRow}>
                            <span className={styles.resumenMuted}>
                                Envío
                            </span>
                            <span className={styles.resumenMuted}>
                                Se calcula en checkout
                            </span>
                        </div>

                        <div className={styles.resumenTotal}>
                            <span>Total estimado</span>
                            <span>${(resumen.total * 1.15).toFixed(2)}</span>
                        </div>

                        <button
                            className={styles.checkoutBtn}
                            onClick={() => navigate('/checkout')}>
                            Proceder al pago →
                        </button>

                        <Link to="/productos" className={styles.seguirBtn}>
                            ← Seguir comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}