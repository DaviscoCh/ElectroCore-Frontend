import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.code}>404</div>
                <h1 className={styles.titulo}>Página no encontrada</h1>
                <p className={styles.desc}>
                    La página que buscas no existe o fue movida.
                </p>
                <Link to="/" className={styles.btnHome}>
                    ← Volver al inicio
                </Link>
            </div>
        </div>
    )
}