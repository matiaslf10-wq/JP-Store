'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const iniciarSesion = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      // Iniciar sesión con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Verificar si el usuario es admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('No tienes permisos de administrador');
      }

      // Guardar sesión en localStorage
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', email);

      setMensaje('¡Inicio de sesión exitoso! Redirigiendo...');
      
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);

    } catch (error) {
      setMensaje(`Error: ${error.message}`);
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#333', margin: '0 0 10px 0' }}>
            🔐 Admin Panel
          </h1>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
            Chengueshop
          </p>
        </div>

        <form onSubmit={iniciarSesion}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '14px'
            }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none'
              }}
              placeholder="tu@email.com"
              onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '14px'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none'
              }}
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {mensaje && (
            <div style={{
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '6px',
              backgroundColor: mensaje.includes('Error') ? '#ffebee' : '#e8f5e9',
              color: mensaje.includes('Error') ? '#c62828' : '#2e7d32',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: cargando ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: cargando ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!cargando) e.currentTarget.style.backgroundColor = '#45a049';
            }}
            onMouseLeave={(e) => {
              if (!cargando) e.currentTarget.style.backgroundColor = '#4CAF50';
            }}
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          textAlign: 'center'
        }}>
          <Link
            href="/"
            style={{
              color: '#666',
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}