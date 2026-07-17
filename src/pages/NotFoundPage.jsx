/** NotFoundPage — страница 404 */
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="pt-16 min-h-[80vh] flex items-center justify-center bg-stone-50">
      <div className="text-center space-y-6 px-4">
        <p className="font-display text-8xl text-stone-200 leading-none">404</p>
        <h1 className="font-display text-2xl text-stone-900">Страница не найдена</h1>
        <p className="text-stone-500 max-w-sm mx-auto">
          Страница, которую вы ищете, не существует или была перемещена.
        </p>
        <div className="flex gap-4 justify-center pt-2">
          <Link to="/"        className="btn-primary">На главную</Link>
          <Link to="/catalog" className="btn-outline">Каталог</Link>
        </div>
      </div>
    </main>
  )
}
