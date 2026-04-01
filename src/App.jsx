import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import Home from './pages/Home/Home'
import Productos from './pages/Productos/Productos'
import Producto from './pages/Producto/Producto'
import Carrito from './pages/Carrito/Carrito'
import Checkout from './pages/Checkout/Checkout'
import Pedidos from './pages/Pedidos/Pedidos'
import Perfil from './pages/Perfil/Perfil'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import NotFound from './pages/NotFound/NotFound'

// Layout
import Layout from './components/layout/Layout'
import RutaProtegida from './components/ui/RutaProtegida'

function App() {
  const { cargando } = useAuth()

  if (cargando) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Cargando...</p>
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:slug" element={<Producto />} />
        <Route path="carrito" element={<Carrito />} />

        {/* Rutas protegidas */}
        <Route element={<RutaProtegida />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Route>

      {/* Auth — sin layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App