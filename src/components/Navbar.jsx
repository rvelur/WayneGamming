export default function Navbar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalItems,
  onOpenCart,
}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-warning sticky-top py-2">
      <div className="container-fluid px-3 px-md-4">
        {/* Logo / Marca */}
        <a className="navbar-brand fw-bold d-flex align-items-center text-warning" href="#inicio">
          <i className="bi bi-shield-shaded fs-3 me-2 text-warning"></i>
          <span>WAYNE<span className="text-white">GAMING</span></span>
        </a>

        {/* Botón hamburguesa mobile */}
        <button
          className="navbar-toggler border-secondary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarWayne"
          aria-controls="navbarWayne"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Enlaces y controles */}
        <div className="collapse navbar-collapse" id="navbarWayne">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active text-light" href="#catalogo">Catálogo</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="#contacto">Contacto</a>
            </li>
            {/* Filtro por Categoría en Navbar */}
            <li className="nav-item dropdown">
              <button
                className="btn nav-link dropdown-toggle text-warning"
                id="categoriaDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categoría: {selectedCategory}
              </button>
              <ul className="dropdown-menu dropdown-menu-dark border-secondary">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      className={`dropdown-item ${selectedCategory === cat ? 'active bg-warning text-dark fw-bold' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>

          {/* Buscador reactivo */}
          <div className="d-flex align-items-center gap-2">
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Buscar en archivos de Gotham..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
            </div>

            {/* Botón Carrito */}
            <button
              type="button"
              className="btn btn-warning btn-sm d-flex align-items-center fw-bold position-relative text-nowrap ms-2"
              onClick={onOpenCart}
            >
              <i className="bi bi-cart-fill me-1"></i> Bat-Carrito
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}