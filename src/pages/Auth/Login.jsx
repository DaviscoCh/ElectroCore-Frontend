import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginService } from '../../services/auth.service'
import { useAuth } from '../../context/AuthContext'
import styles from './Auth.module.css'

export default function Login() {
    const [form, setForm] = useState({ correo: '', password: '' })
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
            const res = await loginService(form)
            const { token, usuario } = res.data.data
            login(token, usuario)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión')
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.logo}>Electro<span>Core</span></h1>
                    <p className={styles.subtitle}>Inicia sesión en tu cuenta</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
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
                        <label className={styles.label}>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.btnPrimary}
                        disabled={cargando}>
                        {cargando ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <p className={styles.footer}>
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className={styles.footerLink}>
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    )
}