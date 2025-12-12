'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Pequeña protección por si faltan las envs
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Faltan las variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      console.log('Productos cargados:', data?.length || 0);
      setProductos(data || []);
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos. Verifica la consola.');
      setCargando(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProductos((prev) => prev.filter((p) => p.id !== id));
      alert('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar producto');
    }
  };

  const actualizarProducto = async (id, cambios) => {
    try {
      const { error } = await supabase
        .from('productos')
        .update(cambios)
        .eq('id', id);

      if (error) throw error;

      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...cambios } : p))
      );
      setEditando(null);
      alert('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar producto');
    }
  };

  const subirImagenesEdicion = async (e, productoId) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const archivos = Array.from(files);
    setSubiendoImagen(true);

    try {
      const producto = productos.find((p) => p.id === productoId);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      const imagenesActuales = producto.imagenes || [];
      const urlsSubidas = [];

      for (const archivo of archivos) {
        const extension = archivo.name.split('.').pop();
        const nombreArchivo = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from('productos-imagenes')
          .upload(nombreArchivo, archivo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('productos-imagenes')
          .getPublicUrl(nombreArchivo);

        if (urlData?.publicUrl) {
          urlsSubidas.push(urlData.publicUrl);
        }
      }

      const nuevasImagenes = [...imagenesActuales, ...urlsSubidas];

      await actualizarProducto(productoId, { imagenes: nuevasImagenes });

      setSubiendoImagen(false);
      e.target.value = '';
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      alert('Error al subir imágenes');
      setSubiendoImagen(false);
    }
  };

  const eliminarImagenDeProducto = async (productoId, indexImagen) => {
    if (!confirm('¿Eliminar esta imagen?')) return;

    try {
      const producto = productos.find((p) => p.id === productoId);
      if (!producto || !producto.imagenes) return;

      const nuevasImagenes = producto.imagenes.filter(
        (_, i) => i !== indexImagen
      );

      await actualizarProducto(productoId, { imagenes: nuevasImagenes });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar imagen');
    }
  };

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
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <h1 style={{ color: '#333' }}>Mis Productos</h1>
        <a
          href="/admin/productos/nuevo"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
          }}
        >
          + Agregar Producto
        </a>
      </div>

      {productos.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            color: '#666',
          }}
        >
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            No hay productos todavía
          </p>
          <p>¡Agrega tu primer producto para empezar!</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {productos.map((producto) => {
            const precioRedondeado = Math.round(
              Number(producto.precio) || 0
            );

            return (
              <div
                key={producto.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {/* Imágenes */}
                <div
                  style={{
                    height: '200px',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                    position: 'relative',
                  }}
                >
                  {producto.imagenes && producto.imagenes.length > 0 ? (
                    <>
                      <img
                        src={producto.imagenes[0]}
                        alt={producto.nombre}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {producto.imagenes.length > 1 && (
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
                          📷 {producto.imagenes.length}
                        </span>
                      )}
                    </>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                      }}
                    >
                      Sin imágenes
                    </div>
                  )}
                </div>

                {/* Información */}
                <div style={{ padding: '15px' }}>
                  {editando === producto.id ? (
                    // Modo edición
                    <div>
                      <input
                        type="text"
                        defaultValue={producto.nombre}
                        id={`nombre-${producto.id}`}
                        style={{
                          width: '100%',
                          padding: '8px',
                          marginBottom: '10px',
                          border: '1px solid '#ddd',
                          borderRadius: '4px',
                        }}
                      />
                      <input
                        type="number"
                        step="1"
                        defaultValue={precioRedondeado}
                        id={`precio-${producto.id}`}
                        style={{
                          width: '100%',
                          padding: '8px',
                          marginBottom: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                        }}
                      />
                      <input
                        type="text"
                        defaultValue={producto.categoria || ''}
                        id={`categoria-${producto.id}`}
                        placeholder="Categoría"
                        style={{
                          width: '100%',
                          padding: '8px',
                          marginBottom: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                        }}
                      />
                      <textarea
                        defaultValue={producto.descripcion || ''}
                        id={`desc-${producto.id}`}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '8px',
                          marginBottom: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontFamily: 'inherit',
                        }}
                      />

                      {/* Gestión de imágenes */}
                      <div
                        style={{
                          marginBottom: '10px',
                          padding: '10px',
                          backgroundColor: '#f9f9f9',
                          borderRadius: '4px',
                        }}
                      >
                        <p
                          style={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            color: '#666',
                          }}
                        >
                          Imágenes actuales:
                        </p>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '5px',
                            marginBottom: '10px',
                          }}
                        >
                          {producto.imagenes?.map((img, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                              <img
                                src={img}
                                alt={`Img ${idx + 1}`}
                                style={{
                                  width: '100%',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                }}
                              />
                              <button
                                onClick={() =>
                                  eliminarImagenDeProducto(producto.id, idx)
                                }
                                style={{
                                  position: 'absolute',
                                  top: '-5px',
                                  right: '-5px',
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '50%',
                                  backgroundColor: '#f44336',
                                  color: 'white',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  padding: 0,
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <label
                          style={{
                            display: 'block',
                            padding: '8px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            textAlign: 'center',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          + Agregar imágenes
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                              subirImagenesEdicion(e, producto.id)
                            }
                            disabled={subiendoImagen}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => {
                            const nombreInput = document.getElementById(
                              `nombre-${producto.id}`
                            );
                            const precioInput = document.getElementById(
                              `precio-${producto.id}`
                            );
                            const categoriaInput = document.getElementById(
                              `categoria-${producto.id}`
                            );
                            const descTextarea = document.getElementById(
                              `desc-${producto.id}`
                            );

                            if (
                              !nombreInput ||
                              !precioInput ||
                              !categoriaInput ||
                              !descTextarea
                            ) {
                              alert('Faltan campos por completar');
                              return;
                            }

                            const precioNum = parseInt(
                              precioInput.value,
                              10
                            );

                            if (Number.isNaN(precioNum)) {
                              alert('El precio no es válido');
                              return;
                            }

                            actualizarProducto(producto.id, {
                              nombre: nombreInput.value,
                              precio: precioNum,
                              categoria: categoriaInput.value,
                              descripcion: descTextarea.value,
                            });
                          }}
                          style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditando(null)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: '#999',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo vista
                    <div>
                      <h3
                        style={{
                          margin: '0 0 10px 0',
                          fontSize: '18px',
                          color: '#333',
                        }}
                      >
                        {producto.nombre}
                      </h3>
                      <p
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#4CAF50',
                          margin: '0 0 10px 0',
                        }}
                      >
                        ${precioRedondeado}
                      </p>
                      {producto.categoria && (
                        <p
                          style={{
                            fontSize: '12px',
                            color: '#666',
                            margin: '0 0 10px 0',
                            backgroundColor: '#f0f0f0',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            display: 'inline-block',
                          }}
                        >
                          {producto.categoria}
                        </p>
                      )}
                      {producto.descripcion && (
                        <p
                          style={{
                            fontSize: '14px',
                            color: '#666',
                            margin: '10px 0',
                            lineHeight: '1.4',
                          }}
                        >
                          {producto.descripcion}
                        </p>
                      )}
                      {producto.talles?.length ? (
                        <p
                          style={{
                            fontSize: '12px',
                            color: '#666',
                            margin: '10px 0',
                          }}
                        >
                          Talles: {producto.talles.join(', ')}
                        </p>
                      ) : null}

                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          marginTop: '15px',
                        }}
                      >
                        <button
                          onClick={() => setEditando(producto.id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => eliminarProducto(producto.id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
