import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { color as colorDe, precio, tallasDe, type Producto } from "../datos";
import { bolsa } from "../estado/bolsa";
import { avisar } from "../estado/aviso";
import { volarABolsa } from "../lib/util";
import { FotoProducto } from "./FotoProducto";
import { tiene } from "../avance";
import { Icono } from "./Iconos";

export function TarjetaProducto({ producto: p, retraso = 0, prioridad }: { producto: Producto; retraso?: number; prioridad?: boolean }) {
  const [color, setColor] = useState(p.colores[0]);
  const [tallas, setTallas] = useState(false);
  const foto = useRef<HTMLDivElement>(null);
  const c = colorDe(color);
  const unica = p.tallas === "unica";
  const enlace = `/producto/${p.id}${color !== p.colores[0] ? `?color=${c.slug}` : ""}`;

  function agregar(talla: string) {
    bolsa.agregar({
      id: p.id,
      nombre: p.nombre,
      forma: p.forma,
      estampado: p.estampado,
      color: { nombre: c.nombre, hex: c.hex },
      talla,
      cantidad: 1,
      precio: p.precio,
    });
    volarABolsa(foto.current);
    avisar(`${p.nombre} (${c.nombre.toLowerCase()}${unica ? "" : `, talla ${talla}`}) quedó en tu bolsa`);
    setTallas(false);
  }

  return (
    <article className="tarjeta" data-revelar style={{ ["--retraso" as string]: `${retraso}ms` }} onMouseLeave={() => setTallas(false)}>
      <div className="tarjeta__marco">
        <Link to={enlace} className="tarjeta__foto" viewTransition aria-label={`${p.nombre}, ${precio(p.precio)}`}>
          <div ref={foto} className="tarjeta__capa tarjeta__capa--1">
            <FotoProducto producto={p} color={color} n={1} prioridad={prioridad} />
          </div>
          <div className="tarjeta__capa tarjeta__capa--2" aria-hidden="true">
            <FotoProducto producto={p} color={color} n={2} />
          </div>
        </Link>
        {p.nuevo && <span className="etiqueta">Nuevo</span>}
        {tiene("bolsa") && (
          <div className={`tarjeta__rapido${tallas ? " tarjeta__rapido--abierto" : ""}`}>
            {tallas ? (
              <div className="tarjeta__tallas" role="group" aria-label={`Escoge la talla de ${p.nombre}`}>
                {tallasDe(p).map((t) => (
                  <button key={t} type="button" onClick={() => agregar(t)}>
                    {t}
                  </button>
                ))}
              </div>
            ) : (
              <button type="button" className="tarjeta__agregar" onClick={() => (unica ? agregar("Única") : setTallas(true))}>
                <Icono nombre="mas" /> Agregar rápido
              </button>
            )}
          </div>
        )}
      </div>
      <div className="tarjeta__info">
        <h3 className="tarjeta__nombre">
          <Link to={enlace} viewTransition tabIndex={-1}>
            {p.nombre}
          </Link>
        </h3>
        <p className="tarjeta__precio">{precio(p.precio)}</p>
        <div className="tarjeta__colores" role="group" aria-label="Colores">
          {p.colores.slice(0, 5).map((n) => {
            const x = colorDe(n);
            return (
              <button
                key={n}
                type="button"
                className="muestra-color"
                style={{ ["--c" as string]: x.hex }}
                aria-label={n}
                aria-pressed={n === color}
                onClick={() => setColor(n)}
                onMouseEnter={() => setColor(n)}
              />
            );
          })}
          {p.colores.length > 5 && <span className="tarjeta__mas">+{p.colores.length - 5}</span>}
        </div>
      </div>
    </article>
  );
}
