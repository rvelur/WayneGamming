export default function ProductCard({ product, isInCart, onAddToCart }) {
  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4">
      <div className="card h-100 bg-dark text-light border-secondary shadow-sm product-card">
        {/* Imagen del videojuego */}
        <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
          <img
            src={product.imagen}
            className="card-img-top w-100 h-100 object-fit-cover"
            alt={product.titulo}
            loading="lazy"
          />
          {product.badge && (
            <span className="position-absolute top-0 end-0 m-2 badge bg-danger text-uppercase fw-semibold">
              {product.badge}
            </span>
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <div className="card-body d-flex flex-column">
          <small className="text-warning text-uppercase fw-bold mb-1">
            {product.categoria}
          </small>
          <h5 className="card-title fw-bold text-white mb-2">{product.titulo}</h5>
          <p className="card-text text-secondary small flex-grow-1">
            {product.descripcion}
          </p>

          <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary mt-auto">
            <span className="fs-5 fw-bold text-warning">
              ${product.precio.toLocaleString('es-CL')}
            </span>

            {/* Renderizado condicional del botón */}
            <button
              type="button"
              className={`btn btn-sm fw-bold ${
                isInCart ? 'btn-outline-success' : 'btn-warning'
              }`}
              onClick={() => onAddToCart(product)}
            >
              {isInCart ? (
                <>
                  <i className="bi bi-check-lg me-1"></i> En el carrito (+1)
                </>
              ) : (
                <>
                  <i className="bi bi-cart-plus me-1"></i> Añadir
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}