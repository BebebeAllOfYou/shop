/**
 * HomePage — главная страница
 * Собирает все секции в нужном порядке
 */

import Hero            from '../components/Hero'
import ProductGrid     from '../components/ProductGrid'
import InteriorGallery from '../components/InteriorGallery'
import Reviews         from '../components/Reviews'
import Partner         from '../components/Partner'
import Contacts        from '../components/Contacts'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ProductGrid />
      <InteriorGallery />
      <Reviews />
      <Partner />
      <Contacts />
    </main>
  )
}
