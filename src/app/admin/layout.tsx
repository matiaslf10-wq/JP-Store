'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [verificando, setVerificando] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/admin/login') {
      setVerificando(false);
      return;
    }

    const estaAutenticado =
      localStorage.getItem('admin_authenticated') === 'true';
    const emailGuardado = localStorage.getItem('admin_email');

    if (!estaAutenticado) {
      router.replace('/admin/login');
      return;
    }

    setAdminEmail(emailGuardado);
    setVerificando(false);
  }, [pathname, router]);

  const cerrarSesion = () => {
    if (confirm('¿Cerrar sesión?')) {
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_email');
      router.replace('/admin/login');
    }
  };

  if (verificando) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #4CAF50',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px',
            }}
          />
          <p style={{ color: '#666' }}>Verificando acceso...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <nav style={{ backgroundColor: '#333', color: 'white', padding: '15px 0', borderBottom: '3px solid #4CAF50' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
            🔧 Admin Panel
          </a>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {adminEmail && <span style={{ color: '#aaa', fontSize: '14px' }}>{adminEmail}</span>}

            <a href="/admin/productos" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
              Productos
            </a>
            <a href="/" target="_blank" style={{ padding: '6px 14px', backgroundColor: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}>
              Ver Tienda
            </a>
            <button onClick={cerrarSesion} style={{ padding: '6px 14px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
