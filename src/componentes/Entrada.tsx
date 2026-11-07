import { useEffect, useState } from "react";
import { tienda } from "../datos";
import { LeonTrazo, PalabraPorLetras } from "../marca/Logo";
import { sinMovimiento } from "../lib/util";

const VISTA = "schuster:entrada";

function yaSeVio() {
  try {
    return sessionStorage.getItem(VISTA) === "1";
  } catch {
    return false;
  }
}

/**
 * La entrada que le gustó a la cliente: negro, el león sube, se escribe SCHUSTER,
 * aparece el lema en rojo y el telón sube. Sale una vez por visita.
 */
export function Entrada() {
  const [fase, setFase] = useState<"no" | "muestra" | "telon">(() => (yaSeVio() ? "no" : "muestra"));
  const suave = sinMovimiento();

  useEffect(() => {
    if (fase === "no") {
      delete document.documentElement.dataset.entrada;
      return;
    }
    document.documentElement.dataset.entrada = fase;
    if (fase === "muestra") {
      const t = setTimeout(() => setFase("telon"), suave ? 900 : 3100);
      const saltar = (e: KeyboardEvent) => {
        if (["Escape", "Enter", " "].includes(e.key)) {
          e.preventDefault();
          setFase("telon");
        }
      };
      addEventListener("keydown", saltar);
      return () => {
        clearTimeout(t);
        removeEventListener("keydown", saltar);
      };
    }
    try {
      sessionStorage.setItem(VISTA, "1");
    } catch {
      /* modo privado */
    }
    // La portada empieza a animarse mientras el telón sube
    const listo = setTimeout(() => delete document.documentElement.dataset.entrada, 250);
    const fin = setTimeout(() => setFase("no"), suave ? 500 : 1100);
    return () => {
      clearTimeout(listo);
      clearTimeout(fin);
    };
  }, [fase, suave]);

  if (fase === "no") return null;

  const lema = [...tienda.lema];
  return (
    <div className={`entrada entrada--${fase}${suave ? " entrada--suave" : ""}`} onClick={() => setFase("telon")}>
      <div className="entrada__centro" aria-hidden="true">
        <div className="entrada__leon">
          <LeonTrazo />
        </div>
        <PalabraPorLetras className="entrada__palabra" />
        <span className="entrada__raya" />
        <p className="entrada__lema">
          {lema.map((c, i) => (
            <span key={i} style={{ ["--i" as string]: i }}>
              {c}
            </span>
          ))}
        </p>
      </div>
      <button
        type="button"
        className="entrada__saltar"
        onClick={(e) => {
          e.stopPropagation();
          setFase("telon");
        }}
      >
        Saltar
      </button>
      <p className="sr-only" role="status">
        Bienvenido a {tienda.nombre}. {tienda.lema}.
      </p>
    </div>
  );
}
