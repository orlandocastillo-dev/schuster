import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Volver } from "../componentes/Volver";
import { color as colorDe, porNovedad, productos, SECCIONES, tallasDe, type Producto, type Seccion as Id } from "../datos";
import { Icono } from "../componentes/Iconos";
import { TarjetaProducto } from "../componentes/TarjetaProducto";
import { useAtraparFoco, useBloquearScroll, useTitulo } from "../lib/util";

const PRECIOS = [
  { id: "hasta-50", nombre: "Hasta $50.000", ok: (n: number) => n <= 50000 },
  { id: "50-100", nombre: "$50.000 a $100.000", ok: (n: number) => n > 50000 && n <= 100000 },
  { id: "mas-100", nombre: "Más de $100.000", ok: (n: number) => n > 100000 },
];

const ORDENES = [
  { id: "nuevo", nombre: "Lo más nuevo" },
  { id: "menor", nombre: "Menor precio" },
  { id: "mayor", nombre: "Mayor precio" },
];

// El orden en que se muestran las tallas en el filtro
const ORDEN_TALLAS = ["2T", "3T", "4T", "5T", "2", "4", "6", "8", "10", "12", "14", "16", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "Única"];

const lista = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

function Grupo({ titulo, children, abierto = true }: { titulo: string; children: React.ReactNode; abierto?: boolean }) {
  return (
    <details className="filtro" open={abierto}>
      <summary>
        {titulo}
        <Icono nombre="abajo" />
      </summary>
      <div className="filtro__cuerpo">{children}</div>
    </details>
  );
}

export default function Seccion({ seccion }: { seccion?: Id }) {
  const info = SECCIONES.find((s) => s.id === seccion);
  const titulo = info?.nombre ?? "Toda la tienda";
  useTitulo(titulo, info ? `${info.nombre} en Schuster: ${info.frase}` : "Toda la ropa y los accesorios de Schuster, con pedido por WhatsApp.");

  const [params, setParams] = useSearchParams();
  const [cajon, setCajon] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  useBloquearScroll(cajon);
  useAtraparFoco(caja, cajon, () => setCajon(false));

  const base = useMemo(() => (seccion ? productos.filter((p) => p.seccion === seccion) : productos), [seccion]);
  const tipos = [...new Set(base.map((p) => p.tipo))];
  const tallas = ORDEN_TALLAS.filter((t) => base.some((p) => tallasDe(p).includes(t)));
  const colores = [...new Set(base.flatMap((p) => p.colores))];

  const sel = {
    tipo: lista(params.get("tipo")),
    talla: lista(params.get("talla")),
    color: lista(params.get("color")),
    precio: params.get("precio") ?? "",
    orden: params.get("orden") ?? "nuevo",
  };

  function cambiar(clave: string, valor: string, multiple = true) {
    const p = new URLSearchParams(params);
    if (multiple) {
      const actual = lista(p.get(clave));
      const nuevo = actual.includes(valor) ? actual.filter((x) => x !== valor) : [...actual, valor];
      if (nuevo.length) p.set(clave, nuevo.join(","));
      else p.delete(clave);
    } else if (!valor || p.get(clave) === valor) p.delete(clave);
    else p.set(clave, valor);
    setParams(p, { replace: true, preventScrollReset: true });
  }

  const limpiar = () => setParams(sel.orden !== "nuevo" ? { orden: sel.orden } : {}, { replace: true, preventScrollReset: true });

  const filtrados = base
    .filter((p: Producto) => !sel.tipo.length || sel.tipo.includes(p.tipo))
    .filter((p) => !sel.talla.length || tallasDe(p).some((t) => sel.talla.includes(t)))
    .filter((p) => !sel.color.length || p.colores.some((c) => sel.color.includes(c)))
    .filter((p) => !sel.precio || PRECIOS.find((x) => x.id === sel.precio)?.ok(p.precio))
    .sort(sel.orden === "menor" ? (a, b) => a.precio - b.precio : sel.orden === "mayor" ? (a, b) => b.precio - a.precio : porNovedad);

  const activos = [
    ...sel.tipo.map((v) => ({ clave: "tipo", v, nombre: v })),
    ...sel.talla.map((v) => ({ clave: "talla", v, nombre: `Talla ${v}` })),
    ...sel.color.map((v) => ({ clave: "color", v, nombre: v })),
    ...(sel.precio ? [{ clave: "precio", v: sel.precio, nombre: PRECIOS.find((x) => x.id === sel.precio)?.nombre ?? "" }] : []),
  ];

  const filtros = (
    <>
      <Grupo titulo="Tipo de prenda">
        <ul className="opciones">
          {tipos.map((t) => (
            <li key={t}>
              <label className="casilla">
                <input type="checkbox" checked={sel.tipo.includes(t)} onChange={() => cambiar("tipo", t)} />
                <span>{t}</span>
                <small>{base.filter((p) => p.tipo === t).length}</small>
              </label>
            </li>
          ))}
        </ul>
      </Grupo>
      <Grupo titulo="Talla">
        <div className="tallas tallas--chicas" role="group" aria-label="Tallas">
          {tallas.map((t) => (
            <button key={t} type="button" className="talla" aria-pressed={sel.talla.includes(t)} onClick={() => cambiar("talla", t)}>
              {t}
            </button>
          ))}
        </div>
      </Grupo>
      <Grupo titulo="Color">
        <div className="colores-filtro" role="group" aria-label="Colores">
          {colores.map((c) => (
            <button key={c} type="button" className="color-filtro" aria-pressed={sel.color.includes(c)} onClick={() => cambiar("color", c)}>
              <span className="muestra-color" style={{ ["--c" as string]: colorDe(c).hex }} aria-hidden="true" />
              {c}
            </button>
          ))}
        </div>
      </Grupo>
      <Grupo titulo="Precio">
        <ul className="opciones">
          {PRECIOS.map((x) => (
            <li key={x.id}>
              <label className="casilla casilla--radio">
                <input type="radio" name="precio" checked={sel.precio === x.id} onChange={() => cambiar("precio", x.id, false)} onClick={() => sel.precio === x.id && cambiar("precio", "", false)} />
                <span>{x.nombre}</span>
              </label>
            </li>
          ))}
        </ul>
      </Grupo>
    </>
  );

  return (
    <div className="seccion">
      <header className="seccion__cabeza">
        <div className="fila-volver">
          <Volver />
          <nav aria-label="Ruta" className="migas">
            <Link to="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{titulo}</span>
          </nav>
        </div>
        <h1 className="titular titular--seccion" key={titulo}>
          {titulo}
        </h1>
        {info && <p className="seccion__frase">{info.frase}</p>}
        <div className="chips" aria-label="Tipos de prenda">
          <button type="button" className="chip" aria-pressed={!sel.tipo.length} onClick={() => cambiar("tipo", "", false)}>
            Todo
          </button>
          {tipos.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={sel.tipo.length === 1 && sel.tipo[0] === t} onClick={() => cambiar("tipo", t, false)}>
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="seccion__barra">
        <button type="button" className="boton-filtros" onClick={() => setCajon(true)} aria-expanded={cajon} aria-controls="cajon-filtros">
          <Icono nombre="filtro" /> Filtrar {activos.length > 0 && <span className="contador">{activos.length}</span>}
        </button>
        <p className="seccion__cuenta" aria-live="polite">
          {filtrados.length} {filtrados.length === 1 ? "producto" : "productos"}
        </p>
        <label className="orden">
          <span className="sr-only">Ordenar por</span>
          <select value={sel.orden} onChange={(e) => cambiar("orden", e.target.value === "nuevo" ? "" : e.target.value, false)}>
            {ORDENES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nombre}
              </option>
            ))}
          </select>
          <Icono nombre="abajo" />
        </label>
      </div>

      {activos.length > 0 && (
        <div className="activos">
          {activos.map((a) => (
            <button key={a.clave + a.v} type="button" className="activo" onClick={() => cambiar(a.clave, a.v, a.clave !== "precio")} aria-label={`Quitar filtro ${a.nombre}`}>
              {a.nombre} <Icono nombre="cerrar" />
            </button>
          ))}
          <button type="button" className="enlace-sutil" onClick={limpiar}>
            Borrar todo
          </button>
        </div>
      )}

      <div className="seccion__cuerpo">
        <aside className="seccion__filtros" aria-label="Filtros">
          {filtros}
        </aside>

        <div className="seccion__lista">
          <h2 className="sr-only">Productos</h2>
          {filtrados.length ? (
            <div className="cuadricula cuadricula--cambio" key={JSON.stringify(sel)}>
              {filtrados.map((p, i) => (
                <TarjetaProducto key={p.id} producto={p} retraso={Math.min(i, 8) * 50} prioridad={i < 4} />
              ))}
            </div>
          ) : (
            <div className="vacio">
              <p>No hay productos con esos filtros.</p>
              <button type="button" className="boton boton--borde" onClick={limpiar}>
                <span>Borrar los filtros</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`cajon-fondo cajon-fondo--izq${cajon ? " cajon-fondo--abierto" : ""}`} onClick={() => setCajon(false)} inert={!cajon} aria-hidden={!cajon}>
        <div className="cajon cajon--izq" id="cajon-filtros" ref={caja} role="dialog" aria-modal="true" aria-label="Filtros" onClick={(e) => e.stopPropagation()}>
          <header className="cajon__cabeza">
            <h2>Filtrar</h2>
            <button type="button" className="boton-icono" onClick={() => setCajon(false)} aria-label="Cerrar los filtros" data-foco-inicial>
              <Icono nombre="cerrar" />
            </button>
          </header>
          <div className="cajon__filtros">{filtros}</div>
          <footer className="cajon__pie cajon__pie--fila">
            <button type="button" className="boton boton--borde" onClick={limpiar}>
              <span>Borrar</span>
            </button>
            <button type="button" className="boton" onClick={() => setCajon(false)}>
              <span>Ver {filtrados.length}</span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
