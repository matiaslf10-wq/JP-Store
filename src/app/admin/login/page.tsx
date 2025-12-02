'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Aseguramos que las env vars sean string
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  const iniciarSesion = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const { data, error } = await supabase
        .from('usuarios_admin')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        setMensaje('Credenciales incorrectas');
        setCargando(false);
        return;
      }

      // Guardar flags en localStorage para el layout admin
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_authenticated', 'true'); // 👈 MISMO NOMBRE QUE EN EL LAYOUT
        localStorage.setItem('admin_email', email);          // 👈 Así podés mostrar el mail arriba
      }

      router.push('/admin');
    } catch (err) {
      console.error(err);
      setMensaje('Ocurrió un error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <form
        onSubmit={iniciarSesion}
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          minWidth: '320px',
        }}
      >
        <h1
          style={{
            marginBottom: '20px',
            fontSize: '22px',
            textAlign: 'center',
          }}
        >
          Login Admin
        </h1>

        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="email"
            style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor="password"
            style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          />
        </div>

        {mensaje && (
          <p
            style={{
              color: 'red',
              fontSize: '13px',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            {mensaje}
          </p>
        )}

        <button
          type="submit"
          disabled={cargando}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
