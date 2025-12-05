'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

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
          <Link
            href="/"
            style={{
              color: '#4CAF50',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            ← Volver a la tienda
          </Link>
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
          <p style={{ fontSize: '16px', color: '#666', whiteSpace: 'pre-line' }}>
            {`Jp Store es un emprendimiento joven que arrancó en 2024. 
Nos dedicamos a la venta de ropa, zapatillas, artículos de fútbol, electrónica y mucho más, haciendo hincapié en brindar la mejor calidad al mejor precio. Ponemos toda nuestra energía en la atención al cliente para que tu experiencia de compra sea sencilla y placentera.

Contamos con nuestro local en Altos de Podestá, Manzana 5, Casa 23 desde principios de 2025, donde además de ser punto de entrega, tenemos showroom para que vengas a ver y probar nuestros productos.

¡Te invitamos a visitarnos y conocernos!`}
          </p>
        </div>



        {/* Mapa de Google para la sección "Quiénes Somos" */}
        <section
          style={{
            width: '100%',
            maxWidth: '800px',
            margin: '20px auto',
          }}
        >
          <h3
            style={{
              textAlign: 'center',
              marginBottom: '15px',
            }}
          >
            Nuestra ubicación
          </h3>
          <p
            style={{
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <strong>Altos de Podestá, Manzana 5, Casa 23</strong>
            <br />
            Buenos Aires, Argentina
          </p>

          {/* iframe de Google Maps */}
          <div
            style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.9876543210!2d-58.5123456!3d-34.6543210!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM5JzE1LjYiUyA1OMKwMzAnNDQuNCJX!5e0!3m2!1ses!2sar!4v1234567890"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Botón para abrir en Google Maps */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '15px',
            }}
          >
            <a
              href="https://www.google.com/maps/search/?api=1&query=Altos+de+Podestá+Manzana+5+Casa+23+Buenos+Aires+Argentina"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#4285f4',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                transition: 'background-color 0.3s',
              }}
            >
              Ver en Google Maps
            </a>
          </div>
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
          <Link
            href="https://www.instagram.com/reel/DR2uysVgZAt/?igsh=OW5zcWExdmx1ajgy"
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
          </Link>
        </section>
      </div>
    </main>
  );
}
