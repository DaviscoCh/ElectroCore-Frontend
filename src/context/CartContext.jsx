import { createContext, useContext, useState, useEffect } from 'react';
import { getCarrito, agregarAlCarrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } from '../services/carrito.service';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { usuario } = useAuth();
    const [carrito, setCarrito] = useState({ items: [], resumen: { cantidad_items: 0, total: 0 } });
    const [cargando, setCargando] = useState(false);

    // Cargar carrito cuando el usuario inicia sesión
    useEffect(() => {
        if (usuario) cargarCarrito();
        else setCarrito({ items: [], resumen: { cantidad_items: 0, total: 0 } });
    }, [usuario]);

    const cargarCarrito = async () => {
        try {
            setCargando(true);
            const res = await getCarrito();
            setCarrito(res.data.data);
        } catch (err) {
            console.error('Error cargando carrito:', err);
        } finally {
            setCargando(false);
        }
    };

    const agregar = async (id_producto, cantidad = 1) => {
        await agregarAlCarrito({ id_producto, cantidad });
        await cargarCarrito();
    };

    const actualizar = async (id_carrito, cantidad) => {
        await actualizarCantidad(id_carrito, cantidad);
        await cargarCarrito();
    };

    const eliminar = async (id_carrito) => {
        await eliminarDelCarrito(id_carrito);
        await cargarCarrito();
    };

    const vaciar = async () => {
        await vaciarCarrito();
        await cargarCarrito();
    };

    return (
        <CartContext.Provider value={{
            carrito, cargando,
            agregar, actualizar, eliminar, vaciar, cargarCarrito
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);