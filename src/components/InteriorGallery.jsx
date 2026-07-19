/**
 * InteriorGallery — галерея готовых интерьеров
 * Макет: одна большая карточка слева + 2 маленьких справа
 * TODO: добавить лайтбокс при клике на фото
 */

const GALLERY_ITEMS = [
  { id: 1, title: 'Панель монолит "УЗОР"',     style: 'Эко-модерн',                  size: 'large',  image: '/images/gallery/interior-01.jpg' },
  { id: 2, title: 'Косая рейка (МДФ 6 мм)',    style: 'Световой минимализм',         size: 'small',  image: '/images/gallery/interior-02.jpg' },
  { id: 3, title: 'Кирпич (МДФ 6 мм)',         style: 'Мягкий лофт',                 size: 'small',  image: '/images/gallery/interior-03.jpg' },
  { id: 4, title: 'Косая рейка (МДФ 6 мм)',    style: 'Геометрический минимализм',   size: 'medium', image: '/images/gallery/interior-04.jpg' },
  { id: 5, title: 'Косая рейка (МДФ 6 мм)',    style: 'Современный ар-деко',         size: 'medium', image: '/images/gallery/interior-05.jpg' },
]

function GalleryCard({ item, className = '' }) {
  return (
    <div className={`group relative bg-stone-100 overflow-hidden cursor-pointer ${className}`}>
      {/* Изображение интерьера */}
      {item.image ? (
        <img 
          src={item.image} 
          alt={item.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-xs">
          [Фото интерьера]
        </div>
      )}

      {/* Оверлей с подписью */}
      <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/50 transition-colors duration-400" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-xs text-primary-300 tracking-wide uppercase">{item.style}</p>
        <p className="text-white font-display mt-0.5">{item.title}</p>
      </div>
    </div>
  )
}

export default function InteriorGallery() {
  return (
    <section id="gallery" className="py-20 bg-stone-50">
      <div className="container-site">

        {/* Заголовок */}
        <div className="mb-10 max-w-xl">
          <p className="section-label mb-2">Интерьеры</p>
          <h2 className="section-title">Готовые проекты наших клиентов</h2>
          <p className="text-stone-500 mt-3 leading-relaxed">
            Стеновые панели и вешалки для любого интерьера. Вдохновляйтесь готовыми решениями
            и выбирайте сочетания, которые идеально подойдут вашему пространству.
          </p>
        </div>

        {/* Сетка — ассиметричный layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[520px]">
          {/* Большая карточка */}
          <GalleryCard item={GALLERY_ITEMS[0]} className="row-span-2 col-span-1 md:col-span-1" />

          {/* Малые */}
          <GalleryCard item={GALLERY_ITEMS[1]} />
          <GalleryCard item={GALLERY_ITEMS[2]} />
          <GalleryCard item={GALLERY_ITEMS[3]} />
          <GalleryCard item={GALLERY_ITEMS[4]} />
        </div>

        {/* Ссылка на все проекты */}
        <div className="mt-8 text-center">
          <a href="/gallery" className="btn-outline">Все проекты</a>
        </div>

      </div>
    </section>
  )
}
