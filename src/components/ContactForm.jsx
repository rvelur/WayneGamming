import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });

  const [errors, setErrors] = useState({});
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpia el error al empezar a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido (ej: bruce@wayne.com).';
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje no puede estar vacío.';
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setEnviado(false);
      return;
    }

    // Si pasa la validación
    setErrors({});
    setEnviado(true);
    setFormData({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <section id="contacto" className="py-5 bg-black border-top border-secondary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card bg-dark border-secondary shadow-lg">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <i className="bi bi-envelope-paper-heart-fill text-warning display-5"></i>
                  <h3 className="fw-bold text-white mt-2">Canal Seguro WayneTech</h3>
                  <p className="text-secondary small">
                    Envía un mensaje cifrado al comisionado o a soporte técnico de la tienda.
                  </p>
                </div>

                {enviado && (
                  <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                    <div>
                      <strong>¡Transmisión enviada!</strong> Tu mensaje ha sido recibido por Wayne Enterprises.
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Campo Nombre */}
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label text-light fw-semibold">
                      Nombre Completo <span className="text-warning">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control bg-black text-light border-secondary ${
                        errors.nombre ? 'is-invalid' : ''
                      }`}
                      id="nombre"
                      name="nombre"
                      placeholder="Ej: Bruce Wayne"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback fw-semibold">{errors.nombre}</div>
                    )}
                  </div>

                  {/* Campo Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-light fw-semibold">
                      Correo Electrónico <span className="text-warning">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control bg-black text-light border-secondary ${
                        errors.email ? 'is-invalid' : ''
                      }`}
                      id="email"
                      name="email"
                      placeholder="Ej: bruce@wayne.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback fw-semibold">{errors.email}</div>
                    )}
                  </div>

                  {/* Campo Mensaje */}
                  <div className="mb-4">
                    <label htmlFor="mensaje" className="form-label text-light fw-semibold">
                      Mensaje <span className="text-warning">*</span>
                    </label>
                    <textarea
                      className={`form-control bg-black text-light border-secondary ${
                        errors.mensaje ? 'is-invalid' : ''
                      }`}
                      id="mensaje"
                      name="mensaje"
                      rows="4"
                      placeholder="Escribe tu consulta o reporte aquí (mínimo 10 caracteres)..."
                      value={formData.mensaje}
                      onChange={handleChange}
                    ></textarea>
                    {errors.mensaje && (
                      <div className="invalid-feedback fw-semibold">{errors.mensaje}</div>
                    )}
                  </div>

                  {/* Botón de Enviar */}
                  <button type="submit" className="btn btn-warning w-100 fw-bold py-2 text-uppercase">
                    <i className="bi bi-send-fill me-2"></i> Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}