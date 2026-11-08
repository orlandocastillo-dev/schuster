import { useRef } from "react";
import { Link } from "react-router-dom";
import { numeroWhatsApp, precio } from "../datos";
import { bolsa, enlacePedido, total, unidades, useBolsa, useBolsaAbierta, type Linea } from "../estado/bolsa";
import { useAtraparFoco, useBloquearScroll } from "../lib/util";
import { Leon } from "../marca/Logo";
import { CapaDiseno } from "../prendas/CapaDiseno";
import { CapaPrenda } from "../prendas/Prenda";
import { Cantidad } from "./Cantidad";
import { Icono, IconoWhatsApp } from "./Iconos";

function Miniatura({ l }: { l: Linea }) {
  const d = l.diseno;
  const lado = !d?.frente && d?.espalda ? "espalda" : "frente";
  return (
    <svg viewBox="0 0 400 500" aria-hidden="true">
      <CapaPrenda forma={l.forma} color={l.color.hex} estampado={d ? "ninguno" : l.estampado} lado={lado} extra={d ? <CapaDiseno diseno={d[lado]} /> : undefined} sombra={false} />
    </svg>
  );
}

function Fila({ l, i }: { l: Linea; i: number }) {
  const enlace = l.id.startsWith("personalizado") ? "/personaliza" : `/producto/${l.id}`;
  return (
    <li className="linea" style={{ ["--i" as string]: i }}>
      <Link to={enlace} className="linea__foto" onClick={() => bolsa.cerrar()} tabIndex={-1}>
        <Miniatura l={l} />
      </Link>
      <div className="linea__info">
        <Link to={enlace} className="linea__nombre" onClick={() => bolsa.cerrar()}>
          {l.nombre}
        </Link>
        <p className="linea__detalle">
          {l.color.nombre}
          {l.talla !== "Única" && <> / Talla {l.talla}</>}
        </p>
        {l.diseno?.frente && <p className="linea__detalle">Frente: {l.diseno.frente.tipo === "logo" ? "tu logo" : `“${l.diseno.frente.texto}”`}</p>}
        {l.diseno?.espalda && <p className="linea__detalle">Espalda: {l.diseno.espalda.tipo === "logo" ? "tu logo" : `“${l.diseno.espalda.texto}”`}</p>}
        <div className="linea__abajo">
          <Cantidad chica minimo={0} etiqueta={`Cantidad de ${l.nombre}`} valor={l.cantidad} cambiar={(n) => bolsa.cantidad(l.clave, n)} />
          <p className="linea__precio">{precio(l.precio * l.cantidad)}</p>
        </div>
      </div>
      <button type="button" className="linea__quitar" onClick={() => bolsa.quitar(l.clave)} aria-label={`Quitar ${l.nombre} de la bolsa`}>
        <Icono nombre="cerrar" />
      </button>
    </li>
  );
}

export function CajonBolsa() {
  const abierta = useBolsaAbierta();
  const lineas = useBolsa();
  const caja = useRef<HTMLDivElement>(null);
  useBloquearScroll(abierta);
  useAtraparFoco(caja, abierta, bolsa.cerrar);
  const n = unidades(lineas);

  return (
    <div className={`cajon-fondo${abierta ? " cajon-fondo--abierto" : ""}`} onClick={bolsa.cerrar} inert={!abierta} aria-hidden={!abierta}>
      <aside className="cajon" ref={caja} role="dialog" aria-modal="true" aria-labelledby="titulo-bolsa" onClick={(e) => e.stopPropagation()}>
        <header className="cajon__cabeza">
          <h2 id="titulo-bolsa">
            Tu bolsa <span>({n})</span>
          </h2>
          <button type="button" className="boton-icono" onClick={bolsa.cerrar} aria-label="Cerrar la bolsa" data-foco-inicial>
            <Icono nombre="cerrar" />
          </button>
        </header>

        {lineas.length === 0 ? (
          <div className="cajon__vacio">
            <Leon className="cajon__leon" />
            <p>Tu bolsa está vacía.</p>
            <Link to="/tienda" className="boton" onClick={bolsa.cerrar}>
              <span>Ver la tienda</span>
            </Link>
          </div>
        ) : (
          <>
            <ul className="cajon__lista">
              {lineas.map((l, i) => (
                <Fila key={l.clave} l={l} i={i} />
              ))}
            </ul>
            <footer className="cajon__pie">
              <p className="cajon__total">
                <span>Total</span>
                <strong>{precio(total(lineas))}</strong>
              </p>
              <p className="cajon__nota">
                Coordinamos el pago y la entrega por WhatsApp.
              </p>
              <a className="boton boton--wa boton--ancho" href={enlacePedido(lineas)} target="_blank" rel="noreferrer">
                <IconoWhatsApp className="icono" />
                <span>Pedir por WhatsApp</span>
              </a>
              {!numeroWhatsApp() && <p className="cajon__nota">Todavía falta el número de la tienda: WhatsApp te deja escoger a quién enviarlo.</p>}
              <button type="button" className="enlace-sutil" onClick={bolsa.cerrar}>
                Seguir comprando
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
