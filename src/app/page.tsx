'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

// Tipo fuerte para los productos
type Producto = {
  id: string | number;
  nombre: string;
  descripcion?: string | null;
  precio: number | string;
  imagenes?: string[];
  tipo_talle?: string; // 'ropa' | 'calzado' | 'deportes' | 'sin_talle' | otro
  categoria?: string | null;
  subcategoria?: string | null;
  talles?: string[];
  created_at?: string;
};

type CategoriasConfig = Record<
  string,
  {
    nombre: string;
    subcategorias: string[];
  }
>;

export default function TiendaPublica() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [imagenActual, setImagenActual] = useState(0);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [categoriaExpandida, setCategoriaExpandida] = useState<string | null>(
    null
  );
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroSubcategoria, setFiltroSubcategoria] = useState<string | null>(
    null
  );

  const categorias: CategoriasConfig = {
    ropa: {
      nombre: '👕 Ropa',
      subcategorias: ['Hombre', 'Mujer', 'Niños'],
    },
    calzado: {
      nombre: '👟 Calzado',
      subcategorias: ['Hombre', 'Mujer', 'Niños'],
    },
    deportes: {
      nombre: '⚽ Deportes',
      subcategorias: ['Indumentaria', 'Calzado'],
    },
    accesorios: {
      nombre: '🎒 Accesorios',
      subcategorias: [],
    },
  };

  const WHATSAPP_NUMBER = '5491130039615';
  const crearLinkWhatsApp = (mensaje: string) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async (): Promise<void> => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProductos((data ?? []) as Producto[]);
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setCargando(false);
    }
  };

  const abrirModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setImagenActual(0);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const cerrarModal = () => {
    setProductoSeleccionado(null);
    setImagenActual(0);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  };

  const siguienteImagen = () => {
    if (
      !productoSeleccionado ||
      !productoSeleccionado.imagenes ||
      productoSeleccionado.imagenes.length === 0
    ) {
      return;
    }

    const total = productoSeleccionado.imagenes.length;

    setImagenActual((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const anteriorImagen = () => {
    if (
      !productoSeleccionado ||
      !productoSeleccionado.imagenes ||
      productoSeleccionado.imagenes.length === 0
    ) {
      return;
    }

    const total = productoSeleccionado.imagenes.length;

    setImagenActual((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const toggleCategoria = (categoria: string) => {
    if (categoriaExpandida === categoria) {
      setCategoriaExpandida(null);
    } else {
      setCategoriaExpandida(categoria);
    }
  };

  const aplicarFiltro = (
    categoria: string,
    subcategoria: string | null = null
  ) => {
    setFiltroCategoria(categoria);
    setFiltroSubcategoria(subcategoria);
    setSidebarAbierto(false);
  };

  const limpiarFiltros = () => {
    setFiltroCategoria(null);
    setFiltroSubcategoria(null);
    setBusqueda('');
  };

  // 👉 Helper para mostrar precio SIN decimales
  const formatearPrecioSinCentavos = (precio: number | string) => {
    const valorNumerico = Number(precio);
    if (Number.isNaN(valorNumerico)) return '-';
    return Math.trunc(valorNumerico).toLocaleString('es-AR');
  };

  const productosFiltrados = productos.filter((producto: Producto) => {
    const nombre = (producto.nombre || '').toLowerCase();
    const textoBusqueda = busqueda.toLowerCase();

    const cumpleBusqueda = nombre.includes(textoBusqueda);

    const cumpleCategoria =
      !filtroCategoria ||
      (filtroCategoria === 'ropa' && producto.tipo_talle === 'ropa') ||
      (filtroCategoria === 'calzado' && producto.tipo_talle === 'calzado') ||
      (filtroCategoria === 'deportes' && producto.tipo_talle === 'deportes') ||
      (filtroCategoria === 'accesorios' &&
        producto.tipo_talle === 'sin_talle');

    const cumpleSubcategoria =
      !filtroSubcategoria || producto.subcategoria === filtroSubcategoria;

    return cumpleBusqueda && cumpleCategoria && cumpleSubcategoria;
  });

  if (cargando) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#666',
        }}
      >
        Cargando productos...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #ddd',
          padding: '20px 0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Botón menú hamburguesa */}
          <button
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ☰ <span style={{ fontSize: '14px' }}>Categorías</span>
          </button>

          {/* Logo + Nombre tienda */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/JPStore-logo.png"
              alt="JP Store"
              style={{ height: '50px', width: 'auto' }}
            />
            <h1
              style={{
                fontSize: '26px',
                color: '#333',
                margin: 0,
                fontWeight: 'bold',
              }}
            >
              JP Store
            </h1>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        onClick={() => setSidebarAbierto(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          display: sidebarAbierto ? 'block' : 'none',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: 0,
            left: sidebarAbierto ? 0 : '-300px',
            bottom: 0,
            width: '300px',
            backgroundColor: 'white',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            transition: 'left 0.3s ease',
            overflowY: 'auto',
            zIndex: 201,
          }}
        >
          {/* Header del sidebar */}
          <div
            style={{
              padding: '20px',
              borderBottom: '2px solid #4CAF50',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>
              Categorías
            </h2>
            <button
              onClick={() => setSidebarAbierto(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              ×
            </button>
          </div>

          {/* Botón ver todos */}
          <div
            style={{ padding: '15px 20px', borderBottom: '1px solid #eee' }}
          >
            <button
              onClick={limpiarFiltros}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: !filtroCategoria ? '#4CAF50' : '#f0f0f0',
                color: !filtroCategoria ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              🏠 Todos los productos
            </button>
          </div>

          {/* Lista de categorías */}
          <div style={{ padding: '10px 0' }}>
            {Object.entries(categorias).map(([key, cat]) => (
              <div key={key} style={{ borderBottom: '1px solid #eee' }}>
                {/* Categoría principal */}
                <button
                  onClick={() => {
                    if (cat.subcategorias.length > 0) {
                      toggleCategoria(key);
                    } else {
                      aplicarFiltro(key);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    backgroundColor:
                      filtroCategoria === key && !filtroSubcategoria
                        ? '#e8f5e9'
                        : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#333',
                  }}
                >
                  <span>{cat.nombre}</span>
                  {cat.subcategorias.length > 0 && (
                    <span style={{ fontSize: '12px' }}>
                      {categoriaExpandida === key ? '▼' : '▶'}
                    </span>
                  )}
                </button>

                {/* Subcategorías */}
                {cat.subcategorias.length > 0 &&
                  categoriaExpandida === key && (
                    <div style={{ backgroundColor: '#f9f9f9' }}>
                      {cat.subcategorias.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => aplicarFiltro(key, sub)}
                          style={{
                            width: '100%',
                            padding: '12px 20px 12px 40px',
                            backgroundColor:
                              filtroCategoria === key &&
                              filtroSubcategoria === sub
                                ? '#4CAF50'
                                : 'transparent',
                            color:
                              filtroCategoria === key &&
                              filtroSubcategoria === sub
                                ? 'white'
                                : '#666',
                            border: 'none',
                            textAlign: 'left',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Botones extra: Contáctenos / Quiénes somos */}
          <div
            style={{
              padding: '15px 20px',
              borderTop: '1px solid #eee',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <a
              href="/como-comprar"
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                textAlign: 'center',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              📞 Contáctenos
            </a>
            <a
              href="/quienes-somos"
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#f0f0f0',
                color: '#333',
                textAlign: 'center',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              ℹ️ Quiénes somos
            </a>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
        }}
      >
        {/* Filtros activos */}
        {(filtroCategoria || busqueda) && (
          <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#666', fontSize: '14px' }}>
              Filtrando por:
            </span>
            {filtroCategoria && (
              <span
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {categorias[filtroCategoria]?.nombre}
                {filtroSubcategoria && ` - ${filtroSubcategoria}`}
                <button
                  onClick={limpiarFiltros}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Barra de búsqueda + botón Cómo comprar */}
        <div
          style={{
            marginBottom: '30px',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              flex: '1 1 260px',
              maxWidth: '500px',
              padding: '12px 20px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              outline: 'none',
            }}
          />
          <a
            href="/como-comprar"
            style={{
              padding: '12px 18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            ❓ Cómo comprar
          </a>
        </div>

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              color: '#666',
            }}
          >
            <p style={{ fontSize: '18px' }}>No se encontraron productos</p>
            {(filtroCategoria || busqueda) && (
              <button
                onClick={limpiarFiltros}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Ver todos los productos
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '25px',
            }}
          >
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                onClick={() => abrirModal(producto)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div
                  style={{
                    height: '250px',
                    overflow: 'hidden',
                    backgroundColor: '#f0f0f0',
                    position: 'relative',
                  }}
                >
                  <img
                    src={producto.imagenes?.[0] || '/placeholder.jpg'}
                    alt={producto.nombre}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {(producto.imagenes?.length ?? 0) > 1 && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}
                    >
                      📷 {producto.imagenes?.length ?? 0}
                    </span>
                  )}

                  {producto.subcategoria && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                      }}
                    >
                      {producto.subcategoria}
                    </span>
                  )}
                </div>

                <div style={{ padding: '20px' }}>
                  <h3
                    style={{
                      fontSize: '18px',
                      color: '#333',
                      margin: '0 0 10px 0',
                      fontWeight: '600',
                    }}
                  >
                    {producto.nombre}
                  </h3>

                  {producto.descripcion && (
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '0 0 15px 0',
                        lineHeight: '1.5',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {producto.descripcion}
                    </p>
                  )}

                  <span
                    style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#4CAF50',
                      display: 'block',
                    }}
                  >
                    ${formatearPrecioSinCentavos(producto.precio)}
                  </span>

                  {/* Botón WhatsApp por producto */}
                  <div style={{ marginTop: '10px' }}>
                    <a
                      href={crearLinkWhatsApp(
                        `Hola vengo de la pagina JP Store y me interesa el producto "${producto.nombre}".`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        backgroundColor: '#25D366',
                        color: 'white',
                        borderRadius: '999px',
                        fontSize: '14px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <img
                        src="/whatsappicon.png"
                        alt="WhatsApp"
                        style={{ width: '22px', height: '22px' }}
                      />
                      <span>Consultar por WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de producto */}
      {productoSeleccionado && (
        <div
          onClick={cerrarModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
            }}
          >
            <button
              onClick={cerrarModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              ×
            </button>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                padding: '30px',
              }}
            >
              {/* Columna izquierda: imágenes */}
              <div>
                <div style={{ position: 'relative', marginBottom: '15px' }}>
                  <img
                    src={
                      productoSeleccionado.imagenes?.[imagenActual] ||
                      '/placeholder.jpg'
                    }
                    alt={productoSeleccionado.nombre}
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                    }}
                  />

                  {(productoSeleccionado.imagenes?.length ?? 0) > 1 && (
                    <>
                      <button
                        onClick={anteriorImagen}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          fontSize: '20px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                      >
                        ‹
                      </button>

                      <button
                        onClick={siguienteImagen}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          fontSize: '20px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                      >
                        ›
                      </button>

                      <div
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      >
                        {imagenActual + 1} /{' '}
                        {productoSeleccionado.imagenes?.length ?? 0}
                      </div>
                    </>
                  )}
                </div>

                {(productoSeleccionado.imagenes?.length ?? 0) > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      overflowX: 'auto',
                    }}
                  >
                    {productoSeleccionado.imagenes!.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Vista ${idx + 1}`}
                        onClick={() => setImagenActual(idx)}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border:
                            imagenActual === idx
                              ? '3px solid #4CAF50'
                              : '2px solid #ddd',
                          opacity: imagenActual === idx ? 1 : 0.6,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Columna derecha: info + botón WhatsApp */}
              <div>
                <h2
                  style={{
                    fontSize: '28px',
                    margin: '0 0 15px 0',
                    color: '#333',
                  }}
                >
                  {productoSeleccionado.nombre}
                </h2>

                <p
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#4CAF50',
                    margin: '0 0 20px 0',
                  }}
                >
                  ${formatearPrecioSinCentavos(productoSeleccionado.precio)}
                </p>

                {productoSeleccionado.categoria && (
                  <div style={{ marginBottom: '20px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#666',
                        marginRight: '8px',
                      }}
                    >
                      📂 {productoSeleccionado.categoria}
                    </span>
                    {productoSeleccionado.subcategoria && (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          backgroundColor: '#4CAF50',
                          borderRadius: '6px',
                          fontSize: '14px',
                          color: 'white',
                        }}
                      >
                        {productoSeleccionado.subcategoria}
                      </span>
                    )}
                  </div>
                )}

                {productoSeleccionado.descripcion && (
                  <p
                    style={{
                      fontSize: '16px',
                      color: '#666',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                    }}
                  >
                    {productoSeleccionado.descripcion}
                  </p>
                )}

                {productoSeleccionado.tipo_talle !== 'sin_talle' &&
                  (productoSeleccionado.talles?.length ?? 0) > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          marginBottom: '10px',
                          color: '#333',
                        }}
                      >
                        {productoSeleccionado.tipo_talle === 'calzado'
                          ? 'Números disponibles:'
                          : 'Talles disponibles:'}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {(productoSeleccionado.talles ?? [])
                          .slice()
                          .sort((a, b) => {
                            if (productoSeleccionado.tipo_talle === 'calzado') {
                              return parseInt(a) - parseInt(b);
                            }
                            return 0;
                          })
                          .map((talle) => (
                            <span
                              key={talle}
                              style={{
                                padding: '8px 16px',
                                border: '2px solid #4CAF50',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#4CAF50',
                              }}
                            >
                              {talle}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Botón WhatsApp dentro del modal */}
                <div style={{ marginTop: '10px' }}>
                  <a
                    href={crearLinkWhatsApp(
                      `Hola vengo de la pagina JP Store y me interesa el producto "${productoSeleccionado.nombre}".`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#25D366',
                      color: 'white',
                      borderRadius: '999px',
                      fontSize: '15px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src="/whatsappicon.png"
                      alt="WhatsApp"
                      style={{ width: '24px', height: '24px' }}
                    />
                    <span>Consultar por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante WhatsApp general */}
      <a
        href={crearLinkWhatsApp('Hola vengo de la pagina JP Store')}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 999,
        }}
      >
        <img
          src="/whatsappicon.png"
          alt="WhatsApp"
          style={{ width: '35px', height: '35px' }}
        />
      </a>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#333',
          color: 'white',
          textAlign: 'center',
          padding: '30px 20px',
          marginTop: '60px',
        }}
      >
        <p style={{ margin: 0, fontSize: '14px' }}>
          © 2025 JPStore - Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}
