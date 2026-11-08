import { useState } from "react";
import { Link } from "react-router-dom";

const CLAVE = "schuster:cookies";

function visto() {
  try {
    return localStorage.getItem(CLAVE) === "1";
  } catch {
    return false;
  }
}

export function AvisoCookies() {
  const [abierto, setAbierto] = useState(() => !visto());
  if (!abierto) return null;
  const cerrar = () => {
    try {
      localStorage.setItem(CLAVE, "1");
    } catch {
      /* sin almacenamiento: se vuelve a mostrar en la próxima visita */
    }
    setAbierto(false);
  };
  return (
    <aside className="aviso-cookies" aria-label="Aviso de cookies">
      <p>
        Usamos el almacenamiento de tu navegador para guardar tu bolsa. No usamos cookies de publicidad. <Link to="/cookies">Más información</Link>
      </p>
      <button type="button" className="boton boton--claro" onClick={cerrar}>
        <span>Entendido</span>
      </button>
    </aside>
  );
}
