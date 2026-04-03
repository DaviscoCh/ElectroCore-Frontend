import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getMisPedidos, getDetallePedido } from '../../services/pedido.service'
import styles from './Pedidos.module.css'

const estadoColor = {
    pendiente:   { color: '#ffd600', label: 'Pendiente' },
    confirmado:  { color: '#00ffe0', label: 'Confirmado' },
    preparando:  { color: '#a78bfa', label: 'Preparando' },
    enviado:     { color: '#60a5fa', label: 'Enviado' },
    entregado:   { color: '#2ecc71', label: 'Entregado' },
    cancelado:   { color: '#ff4f5e', label: 'Cancelado' },
}

export default function Pedidos() {
    const [pedidos, setPedidos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [seleccionado, setSeleccionado] = useState(null)
    const [detalle, setDetalle] = useState(null)
    const location = useLocation()
    const nuevoPedido = location.state?.nuevo

    useEffect(() => {
        getMisPedidos()
            .then(res => setPedidos(res.data.data))
            .finally(() => setCargando(false))
    }, [])

    const verDetalle = async (id_pedido) => {
        if (seleccionado === id_pedido) {
            setSeleccionado(null)
            setDetalle(null)
            return
        }
        setSeleccionado(id_pedido)
        const res = await getDetallePedido(id_pedido)
        setDetalle(res.data.data)
    }

    if (cargando) return (
        <div className={styles.cargando}>Cargando pedidos...</div>
    )

    return (
        <div className={styles.page}>
            <div className="container">
                <h1 className={styles.titulo}>Mis Pedidos</h1>

                {/* Mensaje de pedido nuevo */}
                {nuevoPedido && (
                    <div className={styles.nuevoPedido}>
                        ✅ ¡Pedido <strong>{nuevoPedido}</strong> creado exitosamente!
                        Recibirás un email de confirmación.
                    </div>
                )}

                {pedidos.length === 0 ? (
                    <div className={styles.vacio}>
                        <div className={styles.vacioIcon}>📦</div>
                        <h2>No tienes pedidos aún</h2>
                        <p>Cuando realices una compra aparecerá aquí</p>
                    </div>
                ) : (
                    <div className={styles.lista}>
                        {pedidos.map(pedido => {
                            const estado = estadoColor[pedido.estado] || estadoColor.pendiente
                            const isOpen = seleccionado === pedido.id_pedido

                            return (
                                <div key={pedido.id_pedido} className={styles.pedidoCard}>

                                    {/* Header del pedido */}
                                    <div
                                        className={styles.pedidoHeader}
                                        onClick={() => verDetalle(pedido.id_pedido)}>

                                        <div className={styles.pedidoInfo}>
                                            <span className={styles.numeroPedido}>
                                                {pedido.numero_pedido}
                                            </span>
                                            <span className={styles.fechaPedido}>
                                                {new Date(pedido.fecha_pedido)
                                                    .toLocaleDateString('es-EC', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                            </span>
                                        </div>

                                        <div className={styles.pedidoMeta}>
                                            <span
                                                className={styles.estadoBadge}
                                                style={{ color: estado.color,
                                                    borderColor: estado.color,
                                                    background: `${estado.color}15`}}>
                                                {estado.label}
                                            </span>
                                            <span className={styles.pedidoTotal}>
                                                ${parseFloat(pedido.total).toFixed(2)}
                                            </span>
                                            <span className={styles.pedidoItems}>
                                                {pedido.cantidad_items} ítem(s)
                                            </span>
                                            <span className={styles.chevron}>
                                                {isOpen ? '▲' : '▼'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Detalle expandible */}
                                    {isOpen && detalle && (
                                        <div className={styles.pedidoDetalle}>
                                            <div className={styles.detalleGrid}>

                                                {/* Items */}
                                                <div>
                                                    <h3 className={styles.detalleTitle}>
                                                        Productos
                                                    </h3>
                                                    {detalle.items?.map((item, i) => (
                                                        <div key={i} className={styles.detalleItem}>
                                                            <span className={styles.detalleNombre}>
                                                                {item.nombre}
                                                            </span>
                                                            <span className={styles.detalleCantidad}>
                                                                × {item.cantidad}
                                                            </span>
                                                            <span className={styles.detalleSubtotal}>
                                                                ${parseFloat(item.subtotal).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Info de entrega */}
                                                <div>
                                                    <h3 className={styles.detalleTitle}>
                                                        Entrega
                                                    </h3>
                                                    <div className={styles.detalleInfo}>
                                                        <span className={styles.detalleLabel}>
                                                            Tipo
                                                        </span>
                                                        <span>
                                                            {detalle.tipo_entrega === 'domicilio'
                                                                ? '🚚 Domicilio'
                                                                : '🏪 Retiro'}
                                                        </span>
                                                    </div>
                                                    {detalle.direccion_envio && (
                                                        <div className={styles.detalleInfo}>
                                                            <span className={styles.detalleLabel}>
                                                                Dirección
                                                            </span>
                                                            <span>
                                                                {detalle.direccion_envio},
                                                                {detalle.ciudad_envio}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className={styles.detalleInfo}>
                                                        <span className={styles.detalleLabel}>
                                                            Pago
                                                        </span>
                                                        <span>{detalle.metodo_pago}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Totales */}
                                            <div className={styles.detalleTotales}>
                                                <div className={styles.detalleInfo}>
                                                    <span>Subtotal</span>
                                                    <span>
                                                        ${parseFloat(detalle.subtotal).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className={styles.detalleInfo}>
                                                    <span>IVA</span>
                                                    <span>
                                                        ${parseFloat(detalle.iva).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className={styles.detalleInfo}>
                                                    <span>Envío</span>
                                                    <span>
                                                        ${parseFloat(detalle.costo_envio).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className={`${styles.detalleInfo} ${styles.detalleTotal}`}>
                                                    <span>Total</span>
                                                    <span>
                                                        ${parseFloat(detalle.total).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}