import { CartProvider } from './context/CartContext'
import Header    from './components/Header'
import Footer    from './components/Footer'
import HomePage  from './pages/HomePage'
import CartPanel from './components/CartPanel'

export default function App() {
  return (
    <CartProvider>
      <Header />
      <HomePage />
      <Footer />
      {/* Выдвижная панель корзины — глобальная, поверх всего */}
      <CartPanel />
    </CartProvider>
  )
}
