import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
    const { usuario, logout } = useAuth()
    const { carrito } = useCart()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>

                {/* Logo */}
                <Link to="/" className={styles.logo}>
                    Electro<span>Core</span>
                </Link>

                {/* Links principales */}
                <ul className={styles.links}>
                    <li>
                        <NavLink to="/productos"
                            className={({ isActive }) =>
                                isActive ? styles.linkActive : styles.link
                            }>
                            Productos
                        </NavLink>
                    </li>
                </ul>

                {/* Acciones */}
                <div className={styles.actions}>

                    {/* Carrito */}
                    <Link to="/carrito" className={styles.cartBtn}>
                        🛒
                        {carrito.resumen.cantidad_items > 0 && (
                            <span className={styles.badge}>
                                {carrito.resumen.cantidad_items}
                            </span>
                        )}
                    </Link>

                    {/* Auth */}
                    {usuario ? (
                        <div className={styles.userMenu}>
                            <span className={styles.userName}>
                                {usuario.nombres}
                            </span>
                            <Link to="/pedidos" className={styles.link}>
                                Mis pedidos
                            </Link>
                            <Link to="/perfil" className={styles.link}>
                                Perfil
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={styles.logoutBtn}>
                                Salir
                            </button>
                        </div>
                    ) : (
                        <div className={styles.authBtns}>
                            <Link to="/login" className={styles.link}>
                                Ingresar
                            </Link>
                            <Link to="/register" className={styles.btnPrimary}>
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}