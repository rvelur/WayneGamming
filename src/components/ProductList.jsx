import ProductCard from './ProductCard';

export default function ProductList({
  products,
  cartItems,
  onAddToCart,
  selectedCategory,
  setSelectedCategory,
  categories,
}) {
  return (
    <section id="catalogo" className="py-5">
      <div className="container">
        {/* Encabezado del catálogo y filtros rápidos */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold text-white mb-0 border-start border-4 border-warning ps-3">
              EXPEDIENTES DE GOTHAM
            </h2>
            <small className="text-secondary ps-3">
              {products.length} videojuego(s) disponible(s)
            </small>
          </div>

          {/* Botones de categoría tipo tabs */}
          <div className="btn-group btn-group-sm flex-wrap" role="group">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn ${
                  selectedCategory === cat ? 'btn-warning fw-bold' : 'btn-outline-secondary text-light'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de productos en Grid */}
        {products.length === 0 ? (
          <div className="text-center py-5 border border-secondary rounded bg-dark">
            <i className="bi bi-search text-warning display-4"></i>
            <h4 className="mt-3 text-white">No se encontraron expedientes</h4>
            <p className="text-secondary mb-3">Intenta cambiar el término de búsqueda o categoría.</p>
            <button
              className="btn btn-warning btn-sm fw-bold"
              onClick={() => setSelectedCategory('Todos')}
            >
              Ver todos los títulos
            </button>
          </div>
        ) : (
          <div className="row">
            {products.map((product) => {
              const inCart = cartItems.some((item) => item.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInCart={inCart}
                  onAddToCart={onAddToCart}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}