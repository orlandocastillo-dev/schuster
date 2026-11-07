import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useAtraparFoco, useBloquearScroll } from "../lib/util";
import { Icono } from "./Iconos";

export function Modal({ abierto, cerrar, titulo, children, ancho }: { abierto: boolean; cerrar: () => void; titulo: string; children: ReactNode; ancho?: boolean }) {
  const caja = useRef<HTMLDivElement>(null);
  useBloquearScroll(abierto);
  useAtraparFoco(caja, abierto, cerrar);
  if (!abierto) return null;
  return createPortal(
    <div className="modal-fondo" onClick={cerrar}>
      <div className={`modal${ancho ? " modal--ancho" : ""}`} ref={caja} role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}>
        <header className="modal__cabeza">
          <h2>{titulo}</h2>
          <button type="button" className="boton-icono" onClick={cerrar} aria-label="Cerrar" data-foco-inicial>
            <Icono nombre="cerrar" />
          </button>
        </header>
        <div className="modal__cuerpo">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
