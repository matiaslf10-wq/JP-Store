export default function ComoComprarPage() {
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
          textAlign: 'center',
        }}
      >

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

        {/* Logo grande arriba, centrado */}
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
            marginBottom: '10px',
            color: '#333',
          }}
        >
          Cómo comprar en JP Store
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '30px',
          }}
        >
          Comprar en JP Store es rápido y sencillo. 
          Acá vas a encontrar paso a paso cómo hacer tu compra.
        </p>

        {/* Secciones para que luego agregues fotos / texto */}
        <section style={{ textAlign: 'left', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            1. Elegí el producto
          </h2>
          <p style={{ fontSize: '15px', color: '#555' }}>
            Navegá por la tienda, filtrá por categoría y seleccioná lo
            que te interese. En cada tarjeta tenés un botón para consultarnos por
            WhatsApp.
          </p>
        </section>

        <section style={{ textAlign: 'left', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            2. Contáctanos por WhatsApp
          </h2>
          <p style={{ fontSize: '15px', color: '#555' }}>
            Hacé clic en el botón de WhatsApp del producto o en el botón verde
            flotante. Se va a abrir el chat con el mensaje prearmado
            &quot;Hola vengo de la página JP Store&quot;. Donde te podras 
            comunicar con nuestros asesores quienes te guiaran en la compra
          </p>
        </section>

        <section style={{ textAlign: 'left', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
            3. Coordinamos pago y envío
          </h2>
          <p style={{ fontSize: '15px', color: '#555' }}>
            Por WhatsApp coordinamos forma de pago, talle, color, punto de
            encuentro o envío.
          </p>
        </section>

      </div>
    </main>
  );
}
