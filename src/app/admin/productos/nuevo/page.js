'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function AgregarProducto() {
  const [montado, setMontado] = useState(false);
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: '',
    subcategoria: '',
    imagenes: [],
    talles: [],
    tipo_talle: 'sin_talle',
  });
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const tallesRopa = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const tallesCalzado = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

  const subcategoriasPorTipo = {
    ropa: ['Hombre', 'Mujer', 'Niños'],
    calzado: ['Hombre', 'Mujer', 'Niños'],
    sin_talle: [],
  };

  useEffect(() => {
    setMontado(true);
  }, []);

  if (!montado) return null;

  const obtenerTallesDisponibles = () => {
    if (producto.tipo_talle === 'calzado') return tallesCalzado;
    if (producto.tipo_talle === 'ropa') return tallesRopa;
    return [];
  };

  const toggleTalle = (talle) => {
    const tallesActuales = producto.talles || [];
    if (tallesActuales.includes(talle)) {
      setProducto({
        ...producto,
        talles: tallesActuales.filter((t) => t !== talle),
      });
    } else {
      setProducto({
        ...producto,
        talles: [...tallesActuales, talle],
      });
    }
  };

  const cambiarTipoTalle = (tipo) => {
    let categoria = '';
    if (tipo === 'ropa') categoria = 'Ropa';
    else if (tipo === 'calzado') categoria = 'Calzado';
    else categoria = 'Accesorios'; // lo podés cambiar si querés

    setProducto((prev) => ({
      ...prev,
      tipo_talle: tipo,
      categoria,
      talles: [],
      subcategoria: '',
    }));
  };

  const subirImagenes = async (e) => {
    const archivos = Array.from(e.target.files);
    if (archivos.length === 0) return;

    setSubiendoImagen(true);
    setMensaje(`Subiendo ${archivos.length} imagen(es)...`);

    try {
      const urlsSubidas = [];

      for (const archivo of archivos) {
        const extension = archivo.name.split('.').pop();
        const nombreArchivo = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${extension}`;

        const { error } = await supabase.storage
          .from('productos-imagenes')
          .upload(nombreArchivo, archivo, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('productos-imagenes')
          .getPublicUrl(nombreArchivo);

        urlsSubidas.push(urlData.publicUrl);
      }

      setProducto((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, ...urlsSubidas],
      }));

      setMensaje(`¡${archivos.length} imagen(es) subida(s) exitosamente!`);
      setSubiendoImagen(false);
      e.target.value = '';
    } catch (error) {
      setMensaje(`Error al subir imágenes: ${error.message}`);
      setSubiendoImagen(false);
    }
  };

  const eliminarImagen = (index) => {
    const nuevasImagenes = producto.imagenes.filter((_, i) => i !== index);
    setProducto({ ...producto, imagenes: nuevasImagenes });
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    if (producto.imagenes.length === 0) {
      setMensaje('Por favor sube al menos una imagen');
      return;
    }

    if (
      (producto.tipo_talle === 'ropa' || producto.tipo_talle === 'calzado') &&
      !producto.subcategoria
    ) {
      setMensaje('Por favor selecciona una subcategoría');
      return;
    }

    setCargando(true);
    setMensaje('Guardando producto...');

    try {
      const { error } = await supabase.from('productos').insert([
        {
          nombre: producto.nombre,
          precio: parseFloat(producto.precio || '0'),
          descripcion: producto.descripcion,
          categoria: producto.categoria,
          subcategoria: producto.subcategoria || null,
          imagenes: producto.imagenes,
          talles: producto.talles,
          tipo_talle: producto.tipo_talle,
        },
      ]);

      if (error) throw error;

      setMensaje('¡Producto guardado exitosamente!');
      setProducto({
        nombre: '',
        precio: '',
        descripcion: '',
        categoria: '',
        subcategoria: '',
        imagenes: [],
        talles: [],
        tipo_talle: 'sin_talle',
      });

      setCargando(false);

      setTimeout(() => {
        window.location.href = '/admin/productos';
      }, 2000);
    } catch (error) {
      setMensaje(`Error al guardar: ${error?.message || 'Error desconocido'}`);
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <a
          href="/admin/productos"
          style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}
        >
          ← Volver a productos
        </a>
      </div>

      <h1 style={{ marginBottom: '30px', color: '#333' }}>Agregar Nuevo Producto</h1>

      <form onSubmit={guardarProducto}>
        {/* Nombre */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
          >
            Nombre del Producto *
          </label>
          <input
            type="text"
            required
            value={producto.nombre}
            onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
            placeholder="Ej: Camiseta deportiva"
          />
        </div>

        {/* Precio */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
          >
            Precio *
          </label>
          <input
            type="number"
            required
            step="0.01"
            value={producto.precio}
            onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
            placeholder="Ej: 59.99"
          />
        </div>

        {/* Tipo de producto + subcategoría */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
          >
            Tipo de Producto
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
            }}
          >
            <button
              type="button"
              onClick={() => cambiarTipoTalle('ropa')}
              style={{
                padding: '10px',
                border: `2px solid ${
                  producto.tipo_talle === 'ropa' ? '#4CAF50' : '#ddd'
                }`,
                backgroundColor:
                  producto.tipo_talle === 'ropa' ? '#4CAF50' : 'white',
                color: producto.tipo_talle === 'ropa' ? 'white' : '#333',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              👕 Ropa
            </button>
            <button
              type="button"
              onClick={() => cambiarTipoTalle('calzado')}
              style={{
                padding: '10px',
                border: `2px solid ${
                  producto.tipo_talle === 'calzado' ? '#4CAF50' : '#ddd'
                }`,
                backgroundColor:
                  producto.tipo_talle === 'calzado' ? '#4CAF50' : 'white',
                color: producto.tipo_talle === 'calzado' ? 'white' : '#333',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              👟 Calzado
            </button>
            <button
              type="button"
              onClick={() => cambiarTipoTalle('sin_talle')}
              style={{
                padding: '10px',
                border: `2px solid ${
                  producto.tipo_talle === 'sin_talle' ? '#4CAF50' : '#ddd'
                }`,
                backgroundColor:
                  producto.tipo_talle === 'sin_talle' ? '#4CAF50' : 'white',
                color: producto.tipo_talle === 'sin_talle' ? 'white' : '#333',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📦 Sin talles
            </button>
          </div>

          {(producto.tipo_talle === 'ropa' || producto.tipo_talle === 'calzado') && (
            <div style={{ marginBottom: '15px' }}>
              <label
                style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
              >
                Subcategoría *
              </label>
              <select
                required
                value={producto.subcategoria}
                onChange={(e) =>
                  setProducto({ ...producto, subcategoria: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
              >
                <option value="">Selecciona una subcategoría</option>
                {subcategoriasPorTipo[producto.tipo_talle].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                💡 Para ropa y calzado es obligatorio elegir si es para Hombre, Mujer
                o Niños.
              </p>
            </div>
          )}

          {producto.tipo_talle === 'sin_talle' && (
            <p
              style={{
                padding: '15px',
                backgroundColor: '#e8f5e9',
                borderRadius: '6px',
                color: '#2e7d32',
                fontSize: '14px',
                textAlign: 'center',
                margin: '10px 0 0 0',
              }}
            >
              ✓ Este producto no requiere selección de talles ni subcategoría.
            </p>
          )}
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
          >
            Descripción
          </label>
          <textarea
            value={producto.descripcion}
            onChange={(e) =>
              setProducto({ ...producto, descripcion: e.target.value })
            }
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
            placeholder="Describe el producto..."
          />
        </div>

        {/* Talles */}
        <div style={{ marginBottom: '20px' }}>
          {producto.tipo_talle !== 'sin_talle' && (
            <>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#666',
                }}
              >
                {producto.tipo_talle === 'calzado'
                  ? 'Números Disponibles'
                  : 'Talles Disponibles'}
              </label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '8px',
                }}
              >
                {obtenerTallesDisponibles().map((talle) => {
                  const estaSeleccionado = producto.talles?.includes(talle);
                  return (
                    <button
                      key={talle}
                      type="button"
                      onClick={() => toggleTalle(talle)}
                      style={{
                        padding: '10px',
                        border: `2px solid ${
                          estaSeleccionado ? '#4CAF50' : '#ddd'
                        }`,
                        backgroundColor: estaSeleccionado ? '#4CAF50' : 'white',
                        color: estaSeleccionado ? 'white' : '#333',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {talle} {estaSeleccionado && '✓'}
                    </button>
                  );
                })}
              </div>

              {producto.talles?.length > 0 && (
                <p
                  style={{
                    marginTop: '10px',
                    fontSize: '14px',
                    color: '#4CAF50',
                    fontWeight: '500',
                  }}
                >
                  ✓ {producto.talles.length}{' '}
                  {producto.tipo_talle === 'calzado' ? 'números' : 'talles'} seleccionados:{' '}
                  {producto.talles
                    .slice()
                    .sort((a, b) => {
                      if (producto.tipo_talle === 'calzado') {
                        return parseInt(a) - parseInt(b);
                      }
                      return 0;
                    })
                    .join(', ')}
                </p>
              )}
            </>
          )}
        </div>

        {/* Imágenes */}
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
          >
            Imágenes del Producto * (Puedes subir múltiples)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={subirImagenes}
            disabled={subiendoImagen || cargando}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />

          {producto.imagenes.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <p
                style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '10px',
                }}
              >
                {producto.imagenes.length} imagen(es) agregada(s)
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '10px',
                }}
              >
                {producto.imagenes.map((url, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={url}
                      alt={`Imagen ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #4CAF50',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => eliminarImagen(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        lineHeight: '24px',
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '5px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '12px',
                      }}
                    >
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div
            style={{
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '4px',
              backgroundColor: mensaje.includes('Error') ? '#ffebee' : '#e8f5e9',
              color: mensaje.includes('Error') ? '#c62828' : '#2e7d32',
              border: `1px solid ${
                mensaje.includes('Error') ? '#ef5350' : '#4CAF50'
              }`,
            }}
          >
            {mensaje}
          </div>
        )}

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={cargando || subiendoImagen}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: cargando || subiendoImagen ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: cargando || subiendoImagen ? 'not-allowed' : 'pointer',
          }}
        >
          {cargando
            ? 'Guardando...'
            : subiendoImagen
            ? 'Subiendo imágenes...'
            : 'Guardar Producto'}
        </button>
      </form>
    </div>
  );
}
