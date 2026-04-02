import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCategorias } from '../../services/producto.service'
import { getProductos } from '../../services/producto.service'
import styles from './Home.module.css'

export default function Home() {
    const [categorias, setCategorias] = useState([])
    const [destacados, setDestacados] = useState([])

    useEffect(() => {
        getCategorias().then(res => setCategorias(res.data.data))
        getProductos({ destacado: 'true', limite: 4 })
            .then(res => setDestacados(res.data.data.productos))
    }, [])

    return (
        <div className={styles.page}>

            {/* ── HERO ─────────────────────────────── */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroTag}>▶ TIENDA DE ELECTRÓNICA</div>
                    <h1 className={styles.heroTitle}>
                        Todo para<br />
                        <span className={styles.heroAccent}>construir</span><br />
                        tu proyecto
                    </h1>
                    <p className={styles.heroDesc}>
                        Microcontroladores, resistencias, LEDs, sensores y más.
                        Componentes de calidad para makers, ingenieros y estudiantes.
                    </p>
                    <div className={styles.heroActions}>
                        <Link to="/productos" className={styles.btnPrimary}>
                            Ver catálogo
                        </Link>
                        <Link to="/register" className={styles.btnOutline}>
                            Crear cuenta
                        </Link>
                    </div>
                    <div className={styles.heroStats}>
                        <div>
                            <div className={styles.statNum}>1200+</div>
                            <div className={styles.statLabel}>Productos</div>
                        </div>
                        <div>
                            <div className={styles.statNum}>48h</div>
                            <div className={styles.statLabel}>Entrega</div>
                        </div>
                        <div>
                            <div className={styles.statNum}>4.9★</div>
                            <div className={styles.statLabel}>Valoración</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CATEGORÍAS ───────────────────────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <p className={styles.sectionTag}>// Explora por área</p>
                        <h2 className={styles.sectionTitle}>Categorías</h2>
                    </div>
                    <div className={styles.catGrid}>
                        {categorias.map(cat => (
                            <Link
                                key={cat.id_categoria}
                                to={`/productos?categoria=${cat.slug}`}
                                className={styles.catCard}>
                                <span className={styles.catIcon}>
                                    {iconMap[cat.slug] || '⚡'}
                                </span>
                                <div className={styles.catName}>{cat.nombre}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRODUCTOS DESTACADOS ─────────────── */}
            {destacados.length > 0 && (
                <section className={`${styles.section} ${styles.sectionDark}`}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <p className={styles.sectionTag}>// Más vendidos</p>
                            <h2 className={styles.sectionTitle}>Productos Destacados</h2>
                        </div>
                        <div className={styles.prodGrid}>
                            {destacados.map(prod => (
                                <Link
                                    key={prod.id_producto}
                                    to={`/productos/${prod.slug}`}
                                    className={styles.prodCard}>
                                    <div className={styles.prodImg}>
                                        {prod.imagen_url
                                            ? <img src={prod.imagen_url} alt={prod.nombre} />
                                            : <span>🔌</span>
                                        }
                                    </div>
                                    <div className={styles.prodInfo}>
                                        <div className={styles.prodCategoria}>
                                            {prod.categoria}
                                        </div>
                                        <div className={styles.prodNombre}>
                                            {prod.nombre}
                                        </div>
                                        <div className={styles.prodPrecio}>
                                            ${parseFloat(prod.precio).toFixed(2)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className={styles.verTodos}>
                            <Link to="/productos" className={styles.btnOutline}>
                                Ver todos los productos →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── FEATURES ─────────────────────────── */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.featuresGrid}>
                        {features.map((f, i) => (
                            <div key={i} className={styles.feature}>
                                <div className={styles.featureIcon}>{f.icon}</div>
                                <h3 className={styles.featureTitle}>{f.title}</h3>
                                <p className={styles.featureDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    )
}

// Mapa de iconos por slug de categoría
const iconMap = {
    'microcontroladores': '🤖',
    'resistencias':       '⚡',
    'leds':               '💡',
    'sensores':           '📡',
    'modulos-shields':    '📟',
    'pantallas':          '🖥️',
    'fuentes-baterias':   '🔋',
    'herramientas':       '🔧',
}

const features = [
    { icon: '🚚', title: 'Envío Rápido',        desc: 'Despacho en 24h hábiles con rastreo en tiempo real.' },
    { icon: '✅', title: 'Calidad Garantizada', desc: 'Componentes originales probados antes de enviar.' },
    { icon: '💬', title: 'Soporte Técnico',     desc: 'Ingenieros disponibles para ayudarte con tus proyectos.' },
    { icon: '🔁', title: 'Devoluciones',        desc: '30 días para cambios sin complicaciones.' },
]