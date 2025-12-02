'use client';

import { useEffect, useRef } from 'react';

export default function QuienesSomosPage() {
  const instagramRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!instagramRef.current) return;

    // Insertamos el bloque de Instagram en el div
    instagramRef.current.innerHTML = `
      <blockquote
        class="instagram-media"
        data-instgrm-permalink="https://www.instagram.com/reel/DG_c4YwyAx8/"
        data-instgrm-captioned
        style="margin: 0 auto; max-width: 540px; width: 100%;"
      ></blockquote>
    `;

    // Cargamos el script de Instagram para que convierta el bloque en el embed
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // No limpiamos el script porque puede reutilizarse si se vuelve a montar
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px 20px 50px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {/* Botón volver a la tienda */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <a
            href="/"
            style={{
              color: '#4CAF50',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            ← Volver a la tienda
          </a>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img
          src="/JPStore-logo.png"
          alt="JP Store"
          style={{
            width: '200px',
            maxWidth: '70%',
            height: 'auto',
            margin: '0 auto 30px',
            display: 'block',
          }}
        />
          <h1
            style={{
              fontSize: '32px',
              marginBottom: '5px',
              color: '#333',
            }}
          >
            Quiénes somos
          </h1>
          <p style={{ fontSize: '16px', color: '#666' }}>
            Un espacio para contar la historia y la personalidad de JP Store.
          </p>
        </div>

        {/* Texto descriptivo (ejemplo) */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            Nuestra historia
          </h2>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6 }}>
            Acá podés escribir quiénes son, cómo nació JP Store, qué tipo de
            productos venden, en qué se diferencian, etc. Es solo texto de
            ejemplo para que tengas la estructura armada.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            Nuestro objetivo
          </h2>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6 }}>
            Podés usar esta sección para hablar de la calidad, la atención al
            cliente, la forma de trabajo y los valores de JP Store.
          </p>
        </section>

        {/* Lugar para fotos */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            Fotos del equipo y del showroom
          </h2>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6 }}>
            Más adelante podés insertar acá imágenes (por ejemplo con etiquetas
            &lt;img /&gt; o componentes de Next) mostrando el equipo, el local,
            ferias, etc.
          </p>
        </section>

        {/* Reel de Instagram embebido */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            Video destacado
          </h2>
          <p style={{ fontSize: '15px', color: '#555', marginBottom: '15px' }}>
            Mirá uno de nuestros reels en Instagram:
          </p>

          <div
            ref={instagramRef}
            style={{ margin: '0 auto', maxWidth: 540 }}
          />
        </section>

        {/* Botón al perfil de Instagram */}
        <section style={{ marginTop: '10px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>
            Mirá más contenido
          </h2>
          <a
            href="https://www.instagram.com/jpstore/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 22px',
              backgroundColor: '#E1306C',
              color: 'white',
              borderRadius: '999px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '15px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            Ver Instagram de JP Store
          </a>
        </section>
      </div>
    </main>
  );
}
