export default function CartOffcanvas({
  isOpen,
  onClose,
  cartItems,
  onAddToCart,
  onDecreaseItem,
  onRemoveItem,
  onClearCart,
  totalPagar,
}) {
  return (
    <>
      <div
        className={`offcanvas offcanvas-end bg-dark text-light ${isOpen ? 'show' : ''}`}
        style={{
          visibility: isOpen ? 'visible' : 'hidden',
          display: isOpen ? 'block' : 'none',
          zIndex: 1055,
        }}
        tabIndex="-1"
      >
        <div className="offcanvas-header border-bottom border-secondary">
          <h5 className="offcanvas-title fw-bold text-warning">
            <i className="bi bi-shield-shaded me-2"></i> Resumen de Compra
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          {cartItems.length === 0 ? (
            <div className="text-center my-auto">
              <i className="bi bi-cart-x text-secondary display-4"></i>
              <p className="text-secondary mt-2">Tu Bat-Carrito está vacío.</p>
            </div>
          ) : (
            <div className="flex-grow-1 overflow-auto pe-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="cart-item d-flex justify-content-between align-items-center mb-3 p-2 rounded bg-black border border-secondary"
                >
                  <div>
                    <h6 className="mb-1 text-white small fw-bold">{item.titulo}</h6>
                    <span className="text-secondary small">
                      ${item.precio.toLocaleString('es-CL')} c/u
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning py-0 px-2 fw-bold"
                      onClick={() => onDecreaseItem(item.id)}
                      title="Restar una unidad"
                    >
                      -
                    </button>

                    <span className="badge bg-secondary">{item.cantidad}</span>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning py-0 px-2 fw-bold"
                      onClick={() => onAddToCart(item)}
                      title="Sumar una unidad"
                    >
                      +
                    </button>

                    <span className="fw-bold text-warning small ms-2">
                      ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                    </span>

                    <button
                      type="button"
                      className="btn btn-sm btn-danger ms-2 py-1 px-2"
                      onClick={() => onRemoveItem(item.id)}
                      title="Eliminar del carrito"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-top border-secondary pt-3 mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-semibold">Total a pagar:</span>
              <span className="fw-bold text-warning fs-4">
                ${totalPagar.toLocaleString('es-CL')}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-warning w-100 fw-bold text-uppercase py-2"
              disabled={cartItems.length === 0}
              onClick={() => {
                alert('🦇 ¡Transacción autorizada por Wayne Enterprises!');
                onClearCart();
                onClose();
              }}
            >
              Confirmar Transacción
            </button>

            {cartItems.length > 0 && (
              <button
                type="button"
                className="btn btn-outline-danger w-100 btn-sm mt-2 fw-bold"
                onClick={onClearCart}
              >
                <i className="bi bi-trash3 me-1"></i> Vaciar Carrito
              </button>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1050 }}
          onClick={onClose}
        ></div>
      )}
    </>
  );
}