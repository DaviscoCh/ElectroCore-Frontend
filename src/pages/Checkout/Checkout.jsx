import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { crearPedido } from '../../services/pedido.service'
import { verificarCobertura, getSucursales } from '../../services/zona.service'
import styles from './Checkout.module.css'

export default function Checkout() {
    const { carrito, cargarCarrito } = useCart()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        tipo_entrega: 'domicilio',
        direccion_envio: '',
        ciudad_envio: '',
        provincia_envio: '',
        metodo_pago: 'efectivo',
        comentario: '',
        id_zona: '',
        id_sucursal: ''
    })

    const [cobertura, setCobertura] = useState(null)
    const [sucursales, setSucursales] = useState([])
    const [verificando, setVerificando] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState('')

    const { items, resumen } = carrito
    const IVA = 0.15
    const costoEnvio = cobertura?.zona?.costo_envio
        ? parseFloat(cobertura.zona.costo_envio) : 0
    const subtotal = resumen.total
    const iva = subtotal * IVA
    const total = subtotal + iva + (form.tipo_entrega === 'domicilio' ? costoEnvio : 0)

    useEffect(() => {
        getSucursales().then(res => setSucursales(res.data.data))
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        if (e.target.name === 'ciudad_envio') setCobertura(null)
    }

    const handleVerificarCiudad = async () => {
        if (!form.ciudad_envio) return
        setVerificando(true)
        try {
            const res = await verificarCobertura(form.ciudad_envio)
            setCobertura(res.data.data)
            if (res.data.data.zona) {
                setForm(f => ({ ...f, id_zona: res.data.data.zona.id_zona }))
            }
        } catch {
            setCobertura({ tiene_cobertura: false })
        } finally {
            setVerificando(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (items.length === 0) return

        if (form.tipo_entrega === 'domicilio' && !form.ciudad_envio) {
            setError('Ingresa tu ciudad de envío')
            return
        }

        setEnviando(true)
        setError('')
        try {
            const res = await crearPedido(form)
            await cargarCarrito()
            navigate('/pedidos', {
                state: { nuevo: res.data.data.pedido.numero_pedido }
            })
        } catch (err) {
            setError(err.response?.data?.error || 'Error al procesar el pedido')
        } finally {
            setEnviando(false)
        }
    }

    if (items.length === 0) {
        navigate('/carrito')
        return null
    }

    return (
        <div className={styles.page}>
            <div className="container">
                <h1 className={styles.titulo}>Checkout</h1>

                <form onSubmit={handleSubmit} className={styles.grid}>

                    {/* ── FORMULARIO ──────────────── */}
                    <div className={styles.form}>

                        {/* Tipo de entrega */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                Tipo de entrega
                            </h2>
                            <div className={styles.tipoGrid}>
                                <button
                                    type="button"
                                    className={form.tipo_entrega === 'domicilio'
                                        ? styles.tipoActive : styles.tipoBtn}
                                    onClick={() => setForm(f => ({
                                        ...f, tipo_entrega: 'domicilio'
                                    }))}>
                                    🚚 Envío a domicilio
                                </button>
                                <button
                                    type="button"
                                    className={form.tipo_entrega === 'retiro'
                                        ? styles.tipoActive : styles.tipoBtn}
                                    onClick={() => setForm(f => ({
                                        ...f, tipo_entrega: 'retiro'
                                    }))}>
                                    🏪 Retiro en tienda
                                </button>
                            </div>
                        </div>

                        {/* Domicilio */}
                        {form.tipo_entrega === 'domicilio' && (
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>
                                    Dirección de envío
                                </h2>

                                <div className={styles.fieldRow}>
                                    <div className={styles.field}>
                                        <label className={styles.label}>
                                            Provincia
                                        </label>
                                        <input
                                            type="text"
                                            name="provincia_envio"
                                            value={form.provincia_envio}
                                            onChange={handleChange}
                                            className={styles.input}
                                            placeholder="El Oro"
                                            required
                                        />
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.label}>
                                            Ciudad
                                        </label>
                                        <div className={styles.ciudadRow}>
                                            <input
                                                type="text"
                                                name="ciudad_envio"
                                                value={form.ciudad_envio}
                                                onChange={handleChange}
                                                className={styles.input}
                                                placeholder="Pasaje"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className={styles.verificarBtn}
                                                onClick={handleVerificarCiudad}
                                                disabled={verificando}>
                                                {verificando ? '...' : 'Verificar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Resultado cobertura */}
                                {cobertura && (
                                    <div className={cobertura.tiene_cobertura
                                        ? styles.coberturaOk
                                        : styles.coberturaNo}>
                                        {cobertura.tiene_cobertura
                                            ? `✅ Tenemos cobertura en ${form.ciudad_envio} — Costo de envío: $${parseFloat(cobertura.zona.costo_envio).toFixed(2)}`
                                            : `❌ Sin cobertura en ${form.ciudad_envio}. Solo retiro en tienda disponible.`
                                        }
                                    </div>
                                )}

                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        Dirección completa
                                    </label>
                                    <input
                                        type="text"
                                        name="direccion_envio"
                                        value={form.direccion_envio}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="Av. Bolívar 123 y Calle 10"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Retiro en tienda */}
                        {form.tipo_entrega === 'retiro' && (
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>
                                    Selecciona una sucursal
                                </h2>
                                {sucursales.length === 0 ? (
                                    <p className={styles.muted}>
                                        No hay sucursales disponibles
                                    </p>
                                ) : (
                                    sucursales.map(s => (
                                        <div
                                            key={s.id_sucursal}
                                            className={form.id_sucursal === s.id_sucursal
                                                ? styles.sucursalActive
                                                : styles.sucursal}
                                            onClick={() => setForm(f => ({
                                                ...f,
                                                id_sucursal: s.id_sucursal
                                            }))}>
                                            <strong>{s.nombre}</strong>
                                            <p>{s.direccion}, {s.ciudad}</p>
                                            {s.horario && (
                                                <p className={styles.muted}>
                                                    {s.horario}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Método de pago */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                Método de pago
                            </h2>
                            <div className={styles.pagoGrid}>
                                {['efectivo', 'transferencia', 'tarjeta'].map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        className={form.metodo_pago === m
                                            ? styles.tipoActive : styles.tipoBtn}
                                        onClick={() => setForm(f => ({
                                            ...f, metodo_pago: m
                                        }))}>
                                        {m === 'efectivo' && '💵 Efectivo'}
                                        {m === 'transferencia' && '🏦 Transferencia'}
                                        {m === 'tarjeta' && '💳 Tarjeta'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comentario */}
                        <div className={styles.section}>
                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Comentario (opcional)
                                </label>
                                <textarea
                                    name="comentario"
                                    value={form.comentario}
                                    onChange={handleChange}
                                    className={styles.textarea}
                                    placeholder="Instrucciones especiales..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className={styles.error}>{error}</div>
                        )}
                    </div>

                    {/* ── RESUMEN ─────────────────── */}
                    <div className={styles.resumen}>
                        <h2 className={styles.resumenTitulo}>
                            Resumen del pedido
                        </h2>

                        {items.map(item => (
                            <div key={item.id_carrito}
                                className={styles.resumenItem}>
                                <span className={styles.resumenItemNombre}>
                                    {item.nombre} × {item.cantidad}
                                </span>
                                <span>
                                    ${parseFloat(item.subtotal).toFixed(2)}
                                </span>
                            </div>
                        ))}

                        <div className={styles.divider} />

                        <div className={styles.resumenRow}>
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className={styles.resumenRow}>
                            <span>IVA (15%)</span>
                            <span>${iva.toFixed(2)}</span>
                        </div>
                        {form.tipo_entrega === 'domicilio' && (
                            <div className={styles.resumenRow}>
                                <span>Envío</span>
                                <span>
                                    {cobertura?.tiene_cobertura
                                        ? `$${costoEnvio.toFixed(2)}`
                                        : '—'}
                                </span>
                            </div>
                        )}

                        <div className={styles.resumenTotal}>
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={enviando}>
                            {enviando
                                ? 'Procesando...'
                                : '✅ Confirmar pedido'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}