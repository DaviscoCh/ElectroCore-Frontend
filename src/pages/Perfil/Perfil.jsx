import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './Perfil.module.css'

export default function Perfil() {
    const { usuario, logout } = useAuth()
    const navigate = useNavigate()
    const [confirmando, setConfirmando] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    if (!usuario) return null

    return (
        <div className={styles.page}>
            <div className="container">
                <h1 className={styles.titulo}>Mi Perfil</h1>

                <div className={styles.grid}>

                    {/* ── TARJETA USUARIO ──────────── */}
                    <div className={styles.card}>
                        <div className={styles.avatar}>
                            {usuario.nombres?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className={styles.nombre}>
                            {usuario.nombres} {usuario.apellidos}
                        </h2>
                        <p className={styles.correo}>{usuario.correo}</p>
                        <span className={styles.rol}>{usuario.rol}</span>
                    </div>

                    {/* ── INFO ─────────────────────── */}
                    <div className={styles.info}>
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                Información personal
                            </h3>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Nombres</span>
                                    <span className={styles.infoValue}>
                                        {usuario.nombres}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Apellidos</span>
                                    <span className={styles.infoValue}>
                                        {usuario.apellidos}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Correo</span>
                                    <span className={styles.infoValue}>
                                        {usuario.correo}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Teléfono</span>
                                    <span className={styles.infoValue}>
                                        {usuario.telefono || '—'}
                                    </span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Dirección</span>
                                    <span className={styles.infoValue}>
                                        {usuario.direccion || '—'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Cuenta</h3>
                            <div className={styles.acciones}>
                                <button
                                    className={styles.btnOutline}
                                    onClick={() => navigate('/pedidos')}>
                                    📦 Ver mis pedidos
                                </button>
                                {!confirmando ? (
                                    <button
                                        className={styles.btnDanger}
                                        onClick={() => setConfirmando(true)}>
                                        🚪 Cerrar sesión
                                    </button>
                                ) : (
                                    <div className={styles.confirmar}>
                                        <p>¿Seguro que deseas cerrar sesión?</p>
                                        <div className={styles.confirmarBtns}>
                                            <button
                                                className={styles.btnDanger}
                                                onClick={handleLogout}>
                                                Sí, salir
                                            </button>
                                            <button
                                                className={styles.btnOutline}
                                                onClick={() => setConfirmando(false)}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}