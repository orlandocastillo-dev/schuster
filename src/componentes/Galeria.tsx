import { useEffect, useRef, useState, type PointerEvent as EventoPuntero } from "react";
import { createPortal } from "react-dom";
import type { Producto } from "../datos";
import { useAtraparFoco, useBloquearScroll } from "../lib/util";
import { FotoProducto, NOMBRES_FOTO } from "./FotoProducto";
import { Icono } from "./Iconos";

const FOTOS = [1, 2, 3, 4];

/** Deslizar con el dedo: devuelve los manejadores y cuánto se ha corrido la foto. */
function useDeslizar(alSoltar: (dir: number) => void) {
  const inicio = useRef<{ x: number; y: number; id: number } | null>(null);
  const [dx, setDx] = useState(0);
  return {
    dx,
    abajo: (e: EventoPuntero) => {
      if (e.pointerType === "mouse") return;
      inicio.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    },
    mover: (e: EventoPuntero) => {
      const i = inicio.current;
      if (!i || i.id !== e.pointerId) return;
      const x = e.clientX - i.x;
      if (Math.abs(x) > Math.abs(e.clientY - i.y)) setDx(x);
    },
    arriba: (e: EventoPuntero) => {
      const i = inicio.current;
      inicio.current = null;
      if (!i) return;
      const x = e.clientX - i.x;
      setDx(0);
      if (Math.abs(x) > 50) alSoltar(x < 0 ? 1 : -1);
    },
  };
}

function Pantalla({ producto, color, inicial, cerrar }: { producto: Producto; color: string; inicial: number; cerrar: () => void }) {
  const [i, setI] = useState(inicial);
  const [zoom, setZoom] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  useBloquearScroll(true);
  useAtraparFoco(caja, true, cerrar);
  const ir = (d: number) => {
    setZoom(false);
    setI((n) => (n + d + 4) % 4);
  };
  const desliz = useDeslizar(ir);
  const [origen, setOrigen] = useState("50% 50%");

  return createPortal(
    <div
      className="pantalla-completa"
      ref={caja}
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${producto.nombre}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") ir(1);
        if (e.key === "ArrowLeft") ir(-1);
      }}
    >
      <button type="button" className="boton-icono pantalla-completa__cerrar" onClick={cerrar} aria-label="Cerrar" data-foco-inicial>
        <Icono nombre="cerrar" />
      </button>
      <div
        className={`pantalla-completa__foto${zoom ? " pantalla-completa__foto--zoom" : ""}`}
        style={{ transformOrigin: origen, translate: `${desliz.dx}px 0` }}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setOrigen(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
          setZoom(!zoom);
        }}
        onPointerDown={desliz.abajo}
        onPointerMove={desliz.mover}
        onPointerUp={desliz.arriba}
        onPointerCancel={desliz.arriba}
      >
        <FotoProducto key={i} producto={producto} color={color} n={i + 1} titulo={`${producto.nombre}: ${NOMBRES_FOTO[i]}`} />
      </div>
      <button type="button" className="boton-icono pantalla-completa__ir pantalla-completa__ir--izq" onClick={() => ir(-1)} aria-label="Foto anterior">
        <Icono nombre="izquierda" />
      </button>
      <button type="button" className="boton-icono pantalla-completa__ir pantalla-completa__ir--der" onClick={() => ir(1)} aria-label="Foto siguiente">
        <Icono nombre="derecha" />
      </button>
      <p className="pantalla-completa__n" aria-live="polite">
        {NOMBRES_FOTO[i]} ({i + 1} de 4)
      </p>
    </div>,
    document.body,
  );
}

export function Galeria({ producto, color, fotoRef }: { producto: Producto; color: string; fotoRef?: React.RefObject<HTMLDivElement | null> }) {
  const [i, setI] = useState(0);
  const [grande, setGrande] = useState(false);
  const [lupa, setLupa] = useState<string | null>(null);
  const ir = (d: number) => setI((n) => Math.max(0, Math.min(3, n + d)));
  const desliz = useDeslizar(ir);

  useEffect(() => setI(0), [producto.id]);

  return (
    <div className="galeria">
      <div className="galeria__miniaturas" role="group" aria-label="Fotos">
        {FOTOS.map((n, k) => (
          <button key={n} type="button" className="galeria__mini" aria-label={NOMBRES_FOTO[k]} aria-current={k === i} onClick={() => setI(k)}>
            <FotoProducto producto={producto} color={color} n={n} />
          </button>
        ))}
      </div>

      <div
        className="galeria__principal"
        tabIndex={0}
        role="region"
        aria-roledescription="carrusel"
        aria-label={`Fotos de ${producto.nombre}. Usa las flechas para cambiar de foto y Enter para ampliar.`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") ir(1);
          if (e.key === "ArrowLeft") ir(-1);
          if (e.key === "Enter") setGrande(true);
        }}
      >
        <div
          className="galeria__pista"
          style={{ transform: `translateX(calc(${-i * 100}% + ${desliz.dx}px))`, transition: desliz.dx ? "none" : undefined }}
          onPointerDown={desliz.abajo}
          onPointerMove={desliz.mover}
          onPointerUp={desliz.arriba}
          onPointerCancel={desliz.arriba}
        >
          {FOTOS.map((n, k) => (
            <div
              key={n}
              ref={k === 0 ? fotoRef : undefined}
              className={`galeria__foto${lupa && k === i ? " galeria__foto--lupa" : ""}`}
              aria-hidden={k !== i}
              onMouseMove={(e) => {
                if (matchMedia("(hover: none)").matches) return;
                const r = e.currentTarget.getBoundingClientRect();
                setLupa(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
              }}
              onMouseLeave={() => setLupa(null)}
              onClick={() => setGrande(true)}
              style={lupa && k === i ? { ["--origen" as string]: lupa } : undefined}
            >
              <div className="galeria__cambio" key={color}>
                <FotoProducto producto={producto} color={color} n={n} prioridad={n === 1} titulo={`${producto.nombre} en ${color.toLowerCase()}: ${NOMBRES_FOTO[k]}`} />
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="boton-icono galeria__ir galeria__ir--izq" onClick={() => ir(-1)} disabled={i === 0} aria-label="Foto anterior" tabIndex={-1}>
          <Icono nombre="izquierda" />
        </button>
        <button type="button" className="boton-icono galeria__ir galeria__ir--der" onClick={() => ir(1)} disabled={i === 3} aria-label="Foto siguiente" tabIndex={-1}>
          <Icono nombre="derecha" />
        </button>
        <div className="galeria__puntos" aria-hidden="true">
          {FOTOS.map((n, k) => (
            <span key={n} className={k === i ? "galeria__punto--activo" : ""} />
          ))}
        </div>
        <span className="galeria__ampliar" aria-hidden="true">
          <Icono nombre="lupa" />
        </span>
      </div>
      {grande && <Pantalla producto={producto} color={color} inicial={i} cerrar={() => setGrande(false)} />}
    </div>
  );
}
