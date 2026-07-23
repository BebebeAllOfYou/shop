/**
 * App.jsx — корень приложения с React Router
 *
 * Маршруты:
 *   /            → Главная (Hero + навигационные карточки)
 *   /catalog     → Каталог товаров
 *   /gallery     → Интерьеры
 *   /about       → О компании
 *   /reviews     → Отзывы
 *   /contacts    → Контакты
 *   /partner     → Стать партнёром
 *   *            → 404
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider }  from './context/CartContext'
import Header            from './components/Header'
import Footer            from './components/Footer'
import HomePage          from './pages/HomePage'
import CatalogPage       from './pages/CatalogPage'
import GalleryPage       from './pages/GalleryPage'
import AboutPage         from './pages/AboutPage'
import ReviewsPage       from './pages/ReviewsPage'
import ContactsPage      from './pages/ContactsPage'
import PartnerPage       from './pages/PartnerPage'
import NotFoundPage      from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/"         element={<HomePage     />} />
          <Route path="/catalog"  element={<CatalogPage  />} />
          <Route path="/gallery"  element={<GalleryPage  />} />
          <Route path="/about"    element={<AboutPage    />} />
          <Route path="/reviews"  element={<ReviewsPage  />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/partner"  element={<PartnerPage  />} />
          <Route path="*"         element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  )
}
