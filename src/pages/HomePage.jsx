/**
 * HomePage — главная страница
 * Показывает Hero-экран и предпросмотр галереи интерьеров.
 */

import Hero from '../components/Hero'
import InteriorGallery from '../components/InteriorGallery'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <InteriorGallery limit={8} />
    </main>
  )
}
