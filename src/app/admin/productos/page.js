'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [tallesEditando, setTallesEditando] = useState([]);
  const [tipoTalleEditando, setTipoTalleEditando] = useState('sin_talle');

  const tallesRopa = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const tallesCalzado = ['22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

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

  const iniciarEdicion = (producto) => {
    setEditando(producto.id);
    setTallesEditando(producto.talles || []);
    setTipoTalleEditando(producto.tipo_talle || 'sin_talle');
  };

  const toggleTalleEdicion = (talle) => {
    if (tallesEditando.includes(talle)) {
      setTallesEditando(tallesEditando.filter(t => t !== talle));
    } else {
      setTallesEditando([...tallesEditando, talle]);
    }
  };

  const cambiarTipoTalleEdicion = (tipo) => {
    setTipoTalleEditando(tipo);
    setTallesEditando([]);
  };

  const obtenerTallesDisponibles = () => {
    if (tipoTalleEditando === 'calzado') {
      return tallesCalzado;
    } else if (tipoTalleEditando === 'ropa') {
      return tallesRopa;
    }
    return [];
  };

  const eliminarProducto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProductos(productos.filter(p => p.id !== id));
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

      const nuevosProductos = productos.map(p => 
        p.id === id ? { ...p, ...cambios } : p
      );
      setProductos(nuevosProductos);
      setEditando(null);
      alert('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar producto');
    }
  };

  const subirImagenesEdicion = async (e, productoId) => {
    const archivos = Array.from(e.target.files);
    if (archivos.length === 0) return;

    setSubiendoImagen(true);

    try {
      const producto = productos.find(p => p.id === productoId);
      const imagenesActuales = producto.imagenes || [];
      const urlsSubidas = [];

      for (const archivo of archivos) {
        const extension = archivo.name.split('.').pop();
        const nombreArchivo = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

        const { data, error } = await supabase.storage
          .from('productos-imagenes')
          .upload(nombreArchivo, archivo);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('productos-imagenes')
          .getPublicUrl(nombreArchivo);

        urlsSubidas.push(urlData.publicUrl);
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
      const producto = productos.find(p => p.id === productoId);
      const nuevasImagenes = producto.imagenes.filter((_, i) => i !== indexImagen);
      
      await actualizarProducto(productoId, { imagenes: nuevasImagenes });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar imagen');
    }
  };

  if (cargando) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Cargando productos...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#333' }}>Mis Productos</h1>
        <a
          href="/admin/productos/nuevo"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          + Agregar Producto
        </a>
      </div>

      {productos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#666'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            No hay productos todavía
          </p>
          <p>¡Agrega tu primer producto para empezar!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {productos.map((producto) => (
            <div
              key={producto.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {/* Imágenes */}
              <div style={{ 
                height: '200px', 
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
                position: 'relative'
              }}>
                {producto.imagenes && producto.imagenes.length > 0 ? (
                  <>
                    <img
                      src={producto.imagenes[0]}
                      alt={producto.nombre}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {producto.imagenes.length > 1 && (
                      <span style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        📷 {producto.imagenes.length}
                      </span>
                    )}
                  </>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                  }}>
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
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={producto.precio}
                      id={`precio-${producto.id}`}
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                    <input
                      type="text"
                      defaultValue={producto.categoria}
                      id={`categoria-${producto.id}`}
                      placeholder="Categoría"
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                    <textarea
                      defaultValue={producto.descripcion || ''}
                      id={`desc-${producto.id}`}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontFamily: 'inherit'
                      }}
                    />

                    {/* Editor de talles */}
                    <div style={{
                      marginBottom: '10px',
                      padding: '10px',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '4px'
                    }}>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: '#666'
                      }}>
                        Tipo de producto:
                      </p>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '5px',
                        marginBottom: '10px'
                      }}>
                        <button
                          type="button"
                          onClick={() => cambiarTipoTalleEdicion('ropa')}
                          style={{
                            padding: '6px',
                            border: `2px solid ${tipoTalleEditando === 'ropa' ? '#4CAF50' : '#ddd'}`,
                            backgroundColor: tipoTalleEditando === 'ropa' ? '#4CAF50' : 'white',
                            color: tipoTalleEditando === 'ropa' ? 'white' : '#333',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          👕 Ropa
                        </button>
                        <button
                          type="button"
                          onClick={() => cambiarTipoTalleEdicion('calzado')}
                          style={{
                            padding: '6px',
                            border: `2px solid ${tipoTalleEditando === 'calzado' ? '#4CAF50' : '#ddd'}`,
                            backgroundColor: tipoTalleEditando === 'calzado' ? '#4CAF50' : 'white',
                            color: tipoTalleEditando === 'calzado' ? 'white' : '#333',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          👟 Calzado
                        </button>
                        <button
                          type="button"
                          onClick={() => cambiarTipoTalleEdicion('sin_talle')}
                          style={{
                            padding: '6px',
                            border: `2px solid ${tipoTalleEditando === 'sin_talle' ? '#4CAF50' : '#ddd'}`,
                            backgroundColor: tipoTalleEditando === 'sin_talle' ? '#4CAF50' : 'white',
                            color: tipoTalleEditando === 'sin_talle' ? 'white' : '#333',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          📦 Sin talles
                        </button>
                      </div>

                      {tipoTalleEditando !== 'sin_talle' && (
                        <>
                          <p style={{
                            fontSize: '11px',
                            color: '#666',
                            marginBottom: '8px'
                          }}>
                            {tipoTalleEditando === 'calzado' ? 'Números:' : 'Talles:'}
                          </p>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(6, 1fr)',
                            gap: '4px'
                          }}>
                            {obtenerTallesDisponibles().map((talle) => {
                              const estaSeleccionado = tallesEditando.includes(talle);
                              return (
                                <button
                                  key={talle}
                                  type="button"
                                  onClick={() => toggleTalleEdicion(talle)}
                                  style={{
                                    padding: '6px',
                                    border: `2px solid ${estaSeleccionado ? '#4CAF50' : '#ddd'}`,
                                    backgroundColor: estaSeleccionado ? '#4CAF50' : 'white',
                                    color: estaSeleccionado ? 'white' : '#333',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {talle}
                                </button>
                              );
                            })}
                          </div>
                          {tallesEditando.length > 0 && (
                            <p style={{
                              fontSize: '10px',
                              color: '#4CAF50',
                              marginTop: '6px'
                            }}>
                              ✓ {tallesEditando.length} seleccionados
                            </p>
                          )}
                        </>
                      )}

                      {tipoTalleEditando === 'sin_talle' && (
                        <p style={{
                          fontSize: '11px',
                          color: '#2e7d32',
                          textAlign: 'center',
                          padding: '8px',
                          backgroundColor: '#e8f5e9',
                          borderRadius: '4px'
                        }}>
                          Sin talles
                        </p>
                      )}
                    </div>

                    {/* Gestión de imágenes */}
                    <div style={{ 
                      marginBottom: '10px',
                      padding: '10px',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '4px'
                    }}>
                      <p style={{ 
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: '#666'
                      }}>
                        Imágenes actuales:
                      </p>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '5px',
                        marginBottom: '10px'
                      }}>
                        {producto.imagenes?.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative' }}>
                            <img
                              src={img}
                              alt={`Img ${idx + 1}`}
                              style={{
                                width: '100%',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                            <button
                              onClick={() => eliminarImagenDeProducto(producto.id, idx)}
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
                                padding: 0
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <label style={{
                        display: 'block',
                        padding: '8px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        textAlign: 'center',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                        + Agregar imágenes
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => subirImagenesEdicion(e, producto.id)}
                          disabled={subiendoImagen}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => {
                          actualizarProducto(producto.id, {
                            nombre: document.getElementById(`nombre-${producto.id}`).value,
                            precio: parseFloat(document.getElementById(`precio-${producto.id}`).value),
                            categoria: document.getElementById(`categoria-${producto.id}`).value,
                            descripcion: document.getElementById(`desc-${producto.id}`).value,
                            talles: tallesEditando,
                            tipo_talle: tipoTalleEditando
                          });
                        }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
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
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo vista
                  <div>
                    <h3 style={{ 
                      margin: '0 0 10px 0', 
                      fontSize: '18px',
                      color: '#333'
                    }}>
                      {producto.nombre}
                    </h3>
                    <p style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#4CAF50',
                      margin: '0 0 10px 0'
                    }}>
                      ${parseFloat(producto.precio).toFixed(2)}
                    </p>
                    {producto.categoria && (
                      <p style={{
                        fontSize: '12px',
                        color: '#666',
                        margin: '0 0 10px 0',
                        backgroundColor: '#f0f0f0',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {producto.categoria}
                      </p>
                    )}
                    {producto.descripcion && (
                      <p style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '10px 0',
                        lineHeight: '1.4'
                      }}>
                        {producto.descripcion}
                      </p>
                    )}
                    {producto.talles?.length > 0 && (
                      <p style={{
                        fontSize: '12px',
                        color: '#666',
                        margin: '10px 0'
                      }}>
                        {producto.tipo_talle === 'calzado' ? 'Números' : 'Talles'}: {producto.talles.join(', ')}
                      </p>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px',
                      marginTop: '15px'
                    }}>
                      <button
                        onClick={() => iniciarEdicion(producto)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
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
                          fontSize: '14px'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}