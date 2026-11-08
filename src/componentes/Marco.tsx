import { Outlet, ScrollRestoration } from "react-router-dom";
import { enlaceWhatsApp } from "../datos";
import { useAviso } from "../estado/aviso";
import { useRevelar } from "../lib/util";
import { Sprite } from "../marca/Logo";
import { AvisoCookies } from "./AvisoCookies";
import { CajonBolsa } from "./CajonBolsa";
import { Encabezado } from "./Encabezado";
import { Entrada } from "./Entrada";
import { IconoWhatsApp } from "./Iconos";
import { tiene } from "../avance";
import { Pie } from "./Pie";

function Aviso() {
  const aviso = useAviso();
  return (
    <div className="aviso-zona" role="status" aria-live="polite">
      {aviso && (
        <p key={aviso.n} className="aviso">
          {aviso.texto}
        </p>
      )}
    </div>
  );
}

export function Marco() {
  useRevelar();
  return (
    <>
      <Sprite />
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>
      <Entrada />
      <Encabezado />
      <main id="contenido" tabIndex={-1}>
        <Outlet />
      </main>
      <Pie />
      {tiene("bolsa") && <CajonBolsa />}
      <aside aria-label="Contacto rápido">
        <a
          className="wa-flotante"
          href={enlaceWhatsApp("Hola, Schuster. Quiero más información.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Escríbenos por WhatsApp"
        >
          <IconoWhatsApp />
          <span className="wa-flotante__texto">Escríbenos</span>
        </a>
      </aside>
      <Aviso />
      {tiene("cookies") && <AvisoCookies />}
      <ScrollRestoration />
    </>
  );
}
