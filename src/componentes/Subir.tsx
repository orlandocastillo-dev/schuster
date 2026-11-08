import { useEffect, useState } from "react";
import { Icono } from "./Iconos";

/** Botón para volver arriba: aparece cuando ya se bajó más de una pantalla y media. */
export function Subir() {
  const [ver, setVer] = useState(false);
  useEffect(() => {
    const medir = () => setVer(window.scrollY > window.innerHeight * 1.5);
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, []);
  const subir = () => {
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: quieto ? "auto" : "smooth" });
  };
  return (
    <button type="button" className={`subir${ver ? " subir--visible" : ""}`} onClick={subir} aria-label="Volver arriba" tabIndex={ver ? 0 : -1} aria-hidden={!ver}>
      <Icono nombre="arriba" />
    </button>
  );
}
