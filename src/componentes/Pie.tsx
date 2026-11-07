import { Link } from "react-router-dom";
import { enlaceWhatsApp, SECCIONES, tienda } from "../datos";
import { Logo, Palabra } from "../marca/Logo";
import { IconoInstagram, IconoWhatsApp } from "./Iconos";

export function Pie() {
  const anio = new Date().getFullYear();
  return (
    <footer className="pie">
      <div className="pie__arriba">
        <div className="pie__marca">
          <Logo className="pie__logo" titulo={tienda.nombre} />
          <p className="pie__lema">{tienda.lema}.</p>
          <p className="pie__texto">Ropa para hombre, dama y niños, accesorios y prendas personalizadas desde una sola unidad. Tienda en Barranquilla.</p>
        </div>
        <nav className="pie__col" aria-label="Comprar">
          <h2>Comprar</h2>
          <ul>
            {SECCIONES.map((s) => (
              <li key={s.id}>
                <Link to={`/${s.id}`}>{s.nombre}</Link>
              </li>
            ))}
            <li>
              <Link to="/personaliza">Personaliza</Link>
            </li>
            <li>
              <Link to="/tienda">Toda la tienda</Link>
            </li>
          </ul>
        </nav>
        <nav className="pie__col" aria-label="Ayuda">
          <h2>Ayuda</h2>
          <ul>
            <li>
              <Link to="/guia-de-tallas">Guía de tallas</Link>
            </li>
            <li>
              <Link to="/#como-pedir">Cómo pedir</Link>
            </li>
            <li>
              <a href={enlaceWhatsApp("Hola, Schuster. Tengo una pregunta.")} target="_blank" rel="noreferrer">
                Escríbenos por WhatsApp
              </a>
            </li>
          </ul>
        </nav>
        <div className="pie__col">
          <h2>Tienda física</h2>
          <address>
            {tienda.direccion}
            <br />
            {tienda.ciudad}, Colombia
          </address>
          <div className="pie__redes">
            <a href={`https://instagram.com/${tienda.instagram}`} target="_blank" rel="noreferrer" aria-label="Instagram">
              <IconoInstagram />
            </a>
            <a href={enlaceWhatsApp("Hola, Schuster.")} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <IconoWhatsApp className="icono" />
            </a>
          </div>
        </div>
      </div>
      <Palabra className="pie__gigante" />
      <div className="pie__abajo">
        <p>
          © {anio} {tienda.nombre}. Una marca de REG Marketing.
        </p>
        {tienda.muestraDeDiseno && <p>Muestra de diseño: precios y fotos de ejemplo.</p>}
      </div>
    </footer>
  );
}
