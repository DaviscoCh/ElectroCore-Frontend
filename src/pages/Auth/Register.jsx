import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerService } from '../../services/auth.service'
import { useAuth } from '../../context/AuthContext'
import styles from './Auth.module.css'

export default function Register() {
    const [form, setForm] = useState({
        nombres: '', apellidos: '', correo: '',
        password: '', telefono: ''
    })
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)
        try {
            const res = await registerService(form)
            const { token, usuario } = res.data.data
            login(token, usuario)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrarse')
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.logo}>Electro<span>Core</span></h1>
                    <p className={styles.subtitle}>Crea tu cuenta</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Nombres</label>
                            <input
                                type="text"
                                name="nombres"
                                value={form.nombres}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Juan"
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Apellidos</label>
                            <input
                                type="text"
                                name="apellidos"
                                value={form.apellidos}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Pérez"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Correo electrónico</label>
                        <input
                            type="email"
                            name="correo"
                            value={form.correo}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="tu@correo.com"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Teléfono (opcional)</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="0991234567"
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.btnPrimary}
                        disabled={cargando}>
                        {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className={styles.footer}>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className={styles.footerLink}>
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    )
}