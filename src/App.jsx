import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  // GESTIÓN DE ESTADOS (useState)
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // EFECTO SECUNDARIO (useEffect)
  useEffect(() => {
    fetch('./data/productos.json')
      .then((res) => {
        if (!res.ok) throw new Error('Error al conectar con los servidores de WayneTech');
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setProductosFiltrados(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  // Agregar al carrito
  const handleAddToCart = (producto) => {
    setCarrito((prevCart) => {
      const existe = prevCart.find((item) => item.id === producto.id);
      if (existe) {
        return prevCart.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevCart, { ...producto, cantidad: 1 }];
    });
  };

  // Quitar un item del carrito
  const handleDecreaseItem = (id) => {
    setCarrito((prevCart) => {
      const existe = prevCart.find((item) => item.id === id);
      if (!existe) return prevCart;
      if (existe.cantidad === 1) {
        return prevCart.filter((item) => item.id !== id);
      }
      return prevCart.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
      );
    });
  };

  // Eliminar el producto completamente del carrito
  const handleRemoveItem = (id) => {
    setCarrito((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Vaciar carrito
  const handleClearCart = () => setCarrito([]);

  // Filtro por categorías
  const handleFilterCategory = (cat) => {
    if (cat === 'Todas') {
      setProductosFiltrados(productos);
    } else {
      setProductosFiltrados(productos.filter((p) => p.categoria.toLowerCase() === cat.toLowerCase()));
    }
  };

  // Búsqueda interactiva (submit)
  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.buscar.value.trim().toLowerCase();
    const filtrados = productos.filter((p) =>
      p.titulo.toLowerCase().includes(query) || p.categoria.toLowerCase().includes(query)
    );
    setProductosFiltrados(filtrados);
  };

  const totalCartCount = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPagar = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* NAVEGACIÓN BOOTSTRAP 5 */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-warning sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold text-uppercase" href="#!">
            Wayne<span className="text-warning">Gaming</span> 🦇
          </a>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContenido">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContenido">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button className="nav-link btn btn-link text-start text-warning" onClick={() => handleFilterCategory('Todas')}>
                  Baticueva
                </button>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#!" role="button" data-bs-toggle="dropdown">
                  Categorías
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li><button className="dropdown-item" onClick={() => handleFilterCategory('Acción')}>Acción / Combate</button></li>
                  <li><button className="dropdown-item" onClick={() => handleFilterCategory('Aventura')}>Aventura / Sigilo</button></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={() => handleFilterCategory('Todas')}>Ver Todas</button></li>
                </ul>
              </li>
            </ul>

            <form className="d-flex me-3 my-2 my-lg-0" onSubmit={handleSearch}>
              <input name="buscar" className="form-control me-2 bg-dark text-light border-secondary" type="search" placeholder="Buscar juego..." />
              <button className="btn btn-outline-warning" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>

            <button className="btn btn-warning position-relative fw-bold" onClick={() => setIsCartOpen(true)}>
              <i className="bi bi-cart-fill"></i> Bat-Carrito
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero-batman py-5 text-center position-relative">
        <div className="container py-4">
          <h1 className="display-4 fw-bold text-uppercase text-white">Sé la Noche. Sé la Venganza.</h1>
          <p className="lead text-secondary mx-auto">
            Plataforma interactiva Wayne Enterprises optimizada con React 18, Hooks y Bootstrap 5.
          </p>
        </div>
      </header>

      {/* CATÁLOGO DINÁMICO */}
      <main className="container my-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4 border-start border-4 border-warning ps-3">
          <h2 className="h3 mb-0 text-uppercase fw-bold">Expedientes de Gotham</h2>
          <span className="text-secondary small">{productosFiltrados.length} juegos disponibles</span>
        </div>

        {/* RENDERIZADO CONDICIONAL DE CARGA Y ERROR[cite: 27, 28, 32] */}
        {cargando && (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="mt-3 text-secondary">Cargando base de datos...</p>
          </div>
        )}

        {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}

        {!cargando && !error && (
          <div className="row g-4">
            {productosFiltrados.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="bi bi-search text-secondary display-3"></i>
                <p className="text-secondary mt-3 fs-5">No se encontraron expedientes con ese criterio.</p>
              </div>
            ) : (
              productosFiltrados.map((p) => {
                const isInCart = carrito.some((item) => item.id === p.id);
                return (
                  <div key={p.id} className="col-12 col-md-6 col-lg-4 d-flex">
                    <article className="card card-batman w-100 d-flex flex-column text-light">
                      <div className="position-relative">
                        <img src={p.imagen} className="card-img-top" alt={p.titulo} />
                        <span className="badge bg-danger position-absolute top-0 end-0 m-2">{p.badge}</span>
                      </div>
                      <div className="card-body d-flex flex-column">
                        <span className="text-warning text-uppercase small fw-bold">{p.categoria}</span>
                        <h3 className="h5 card-title fw-bold mt-1 text-white">{p.titulo}</h3>
                        <p className="card-text text-secondary small flex-grow-1">{p.descripcion}</p>
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                          <span className="fs-5 fw-bold text-warning">${p.precio.toLocaleString('es-CL')}</span>
                          
                          {/* RENDERIZADO CONDICIONAL EN EL BOTÓN[cite: 27, 31, 32] */}
                          {isInCart ? (
                            <button className="btn btn-outline-success btn-sm fw-bold" onClick={() => handleAddToCart(p)}>
                              <i className="bi bi-check2"></i> En el carrito (+1)
                            </button>
                          ) : (
                            <button className="btn btn-warning btn-sm fw-bold" onClick={() => handleAddToCart(p)}>
                              <i className="bi bi-cart-plus"></i> Añadir
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* OFFCANVAS CARRITO (RENDERIZADO CONDICIONAL)*/}
      <div 
        className={`offcanvas offcanvas-end bg-dark text-light ${isCartOpen ? 'show' : ''}`} 
        style={{ visibility: isCartOpen ? 'visible' : 'hidden', display: isCartOpen ? 'block' : 'none', zIndex: 1055 }}
        tabIndex="-1"
      >
        <div className="offcanvas-header border-bottom border-secondary">
          <h5 className="offcanvas-title fw-bold text-warning">
            <i className="bi bi-shield-shaded me-2"></i> Resumen de Compra
          </h5>
          <button type="button" className="btn-close btn-close-white" onClick={() => setIsCartOpen(false)}></button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          {carrito.length === 0 ? (
            <div className="text-center my-auto">
              <i className="bi bi-cart-x text-secondary display-4"></i>
              <p className="text-secondary mt-2">Tu Bat-Carrito está vacío.</p>
            </div>
          ) : (
            <div className="flex-grow-1 overflow-auto pe-1">
              {carrito.map((item) => (
                <div key={item.id} className="cart-item d-flex justify-content-between align-items-center mb-3 p-2 rounded bg-black border border-secondary">
                  <div>
                    <h6 className="mb-1 text-white small fw-bold">{item.titulo}</h6>
                    <span className="text-secondary small">
                      ${item.precio.toLocaleString('es-CL')} c/u
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {/* Botón para restar de a 1 unidad */}
                    <button 
                      type="button"
                      className="btn btn-sm btn-outline-warning py-0 px-2 fw-bold" 
                      onClick={() => handleDecreaseItem(item.id)}
                      title="Restar una unidad"
                    >
                      -
                    </button>

                    <span className="badge bg-secondary">{item.cantidad}</span>

                    {/* Botón para sumar de a 1 unidad */}
                    <button 
                      type="button"
                      className="btn btn-sm btn-outline-warning py-0 px-2 fw-bold" 
                      onClick={() => handleAddToCart(item)}
                      title="Sumar una unidad"
                    >
                      +
                    </button>

                    {/* Total acumulado por juego */}
                    <span className="fw-bold text-warning small ms-2">
                      ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                    </span>

                    {/* Botón eliminar directo */}
                    <button 
                      type="button"
                      className="btn btn-sm btn-danger ms-2 py-1 px-2" 
                      onClick={() => handleRemoveItem(item.id)}
                      title="Eliminar del carrito"
                    >
                      <i className="bi bi-trash-fill pointer-events-none"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-top border-secondary pt-3 mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-semibold">Total a pagar:</span>
              <span className="fw-bold text-warning fs-4">${totalPagar.toLocaleString('es-CL')}</span>
            </div>
            
            <button 
              type="button"
              className="btn btn-warning w-100 fw-bold text-uppercase py-2" 
              disabled={carrito.length === 0}
              onClick={() => {
                alert('🦇 ¡Transacción autorizada por Wayne Enterprises!');
                handleClearCart();
                setIsCartOpen(false);
              }}
            >
              Confirmar Transacción
            </button>

            {carrito.length > 0 && (
              <button 
                type="button"
                className="btn btn-outline-danger w-100 btn-sm mt-2 fw-bold" 
                onClick={handleClearCart}
              >
                <i className="bi bi-trash3 me-1"></i> Vaciar Carrito
              </button>
            )}
          </div>
        </div>
      </div>
      {isCartOpen && <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={() => setIsCartOpen(false)}></div>}

      <footer className="bg-black border-top border-secondary py-4 mt-5 text-center text-secondary small">
        &copy; 2026 Wayne Gaming Store - Evaluación Sumativa Semana 8 (React).
      </footer>
    </div>
  );
}