import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <span className={styles.logo}>
                        Electro<span>Core</span>
                    </span>
                    <p>Componentes electrónicos de calidad para makers e ingenieros.</p>
                </div>
                <div className={styles.col}>
                    <h4>Tienda</h4>
                    <Link to="/productos">Catálogo</Link>
                </div>
                <div className={styles.col}>
                    <h4>Cuenta</h4>
                    <Link to="/login">Ingresar</Link>
                    <Link to="/register">Registrarse</Link>
                    <Link to="/pedidos">Mis pedidos</Link>
                </div>
            </div>
            <div className={styles.bottom}>
                © 2026 ElectroCore — Todos los derechos reservados
            </div>
        </footer>
    )
}