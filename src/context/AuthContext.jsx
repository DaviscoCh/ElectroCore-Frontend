import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getMe()
                .then(res => setUsuario(res.data.data))
                .catch(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                })
                .finally(() => setCargando(false));
        } else {
            setCargando(false);
        }
    }, []);

    const login = (token, datosUsuario) => {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(datosUsuario));
        setUsuario(datosUsuario);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);