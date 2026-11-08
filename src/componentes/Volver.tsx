import { useLocation, useNavigate } from "react-router-dom";
import { Icono } from "./Iconos";

/** Vuelve a la página anterior; si se entró directo por un enlace, lleva al inicio. */
export function Volver() {
  const ir = useNavigate();
  const { key } = useLocation();
  return (
    <button type="button" className="volver" onClick={() => (key === "default" ? ir("/") : ir(-1))}>
      <Icono nombre="atras" /> Volver
    </button>
  );
}
