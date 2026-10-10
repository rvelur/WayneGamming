import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ContactForm from './components/ContactForm';
import CartOffcanvas from './components/CartOffCanvas';
import './App.css';

export default function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Carga asíncrona desde JSON usando BASE_URL de Vite
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/productos.json')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar datos');
        return res.json();
      })
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error cargando productos:', err));
  }, []);

  // Agregar producto o incrementar cantidad
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

  // Disminuir cantidad o eliminar si llega a 0
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

  // Eliminar producto completamente
  const handleRemoveItem = (id) => {
    setCarrito((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Vaciar carrito
  const handleClearCart = () => {
    setCarrito([]);
  };

  // Categorías únicas
  const categories = ['Todos', ...new Set(productos.map((p) => p.categoria))];

  // Filtrado reactivo por término y categoría
  const productosFiltrados = productos.filter((p) => {
    const coincideTexto = p.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideCategoria = selectedCategory === 'Todos' || p.categoria === selectedCategory;
    return coincideTexto && coincideCategoria;
  });

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPagar = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="bg-dark text-light min-vh-100 d-flex flex-column" id="inicio">
      {/* 1. Barra de Navegación */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        totalItems={totalItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. Catálogo Modular en Componentes */}
      <main className="flex-grow-1">
        <ProductList
          products={productosFiltrados}
          cartItems={carrito}
          onAddToCart={handleAddToCart}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {/* 3. Formulario de Contacto Validado */}
        <ContactForm />
      </main>

      {/* 4. Carrito Offcanvas */}
      <CartOffcanvas
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={carrito}
        onAddToCart={handleAddToCart}
        onDecreaseItem={handleDecreaseItem}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        totalPagar={totalPagar}
      />

      {/* Footer */}
      <footer className="py-4 bg-black text-center text-secondary border-top border-secondary">
        <div className="container">
          <p className="mb-1 text-light fw-semibold">Wayne Gaming © 2026 - Wayne Enterprises</p>
          <small>Desarrollado con React 18, Vite y Bootstrap 5 para Frontend I</small>
        </div>
      </footer>
    </div>
  );
}