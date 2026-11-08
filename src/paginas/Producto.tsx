import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Volver } from "../componentes/Volver";
import { color as colorDe, enlaceWhatsApp, grupos, precio, producto as buscar, productos, SECCIONES, tallasDe, tienda } from "../datos";
import { bolsa } from "../estado/bolsa";
import { avisar } from "../estado/aviso";
import { Galeria } from "../componentes/Galeria";
import { GuiaTallas } from "../componentes/GuiaTallas";
import { Cantidad } from "../componentes/Cantidad";
import { Icono, IconoWhatsApp } from "../componentes/Iconos";
import { Modal } from "../componentes/Modal";
import { TarjetaProducto } from "../componentes/TarjetaProducto";
import { useTitulo, volarABolsa } from "../lib/util";
import NoEncontrada from "./NoEncontrada";

export default function Producto() {
  const { id = "" } = useParams();
  const p = buscar(id);
  if (!p) return <NoEncontrada />;
  return <Ficha key={p.id} id={p.id} />;
}

function Ficha({ id }: { id: string }) {
  const p = buscar(id)!;
  const [params, setParams] = useSearchParams();
  const color = p.colores.find((c) => colorDe(c).slug === params.get("color")) ?? p.colores[0];
  const c = colorDe(color);
  const unica = p.tallas === "unica";
  const [talla, setTalla] = useState<string | null>(unica ? "Única" : null);
  const [falta, setFalta] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [guia, setGuia] = useState(false);
  const [barra, setBarra] = useState(false);
  const foto = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const seccion = SECCIONES.find((s) => s.id === p.seccion)!;

  useTitulo(p.nombre, `${p.nombre} de Schuster. ${p.descripcion}`);

  // La barra de abajo aparece en el celular cuando el botón principal ya no se ve
  useEffect(() => {
    const el = boton.current;
    if (!el) return;
    const ver = () => setBarra(el.getBoundingClientRect().bottom < 0);
    ver();
    addEventListener("scroll", ver, { passive: true });
    return () => removeEventListener("scroll", ver);
  }, []);

  function escogerColor(n: string) {
    const x = new URLSearchParams(params);
    if (n === p.colores[0]) x.delete("color");
    else x.set("color", colorDe(n).slug);
    setParams(x, { replace: true, preventScrollReset: true });
  }

  function agregar() {
    if (!talla) {
      setFalta((n) => n + 1);
      document.getElementById("tallas")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    bolsa.agregar({ id: p.id, nombre: p.nombre, forma: p.forma, estampado: p.estampado, color: { nombre: c.nombre, hex: c.hex }, talla, cantidad, precio: p.precio });
    volarABolsa(foto.current);
    avisar(`${p.nombre} quedó en tu bolsa`);
  }

  const mensaje = `Hola, Schuster. Quiero este producto:\n\n${p.nombre}\nColor: ${c.nombre}${unica ? "" : `, talla ${talla ?? "por definir"}`}, cantidad ${cantidad}\n${precio(p.precio * cantidad)}\n\n${location.href}`;

  const relacionados = productos
    .filter((x) => x.id !== p.id && (x.tipo === p.tipo || x.seccion === p.seccion))
    .sort((a, b) => Number(b.tipo === p.tipo) - Number(a.tipo === p.tipo))
    .slice(0, 4);

  return (
    <div className="producto">
      <div className="fila-volver">
        <Volver />
        <nav aria-label="Ruta" className="migas">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/${p.seccion}`}>{seccion.nombre}</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/${p.seccion}?tipo=${encodeURIComponent(p.tipo)}`}>{p.tipo}</Link>
        </nav>
      </div>

      <div className="producto__cuerpo">
        <Galeria producto={p} color={color} fotoRef={foto} />

        <div className="producto__info">
          <div className="producto__fijo">
            {p.nuevo && <span className="etiqueta etiqueta--suelta">Nuevo</span>}
            <h1 className="producto__nombre">{p.nombre}</h1>
            <p className="producto__precio">{precio(p.precio)}</p>
            {tienda.muestraDeDiseno && <p className="nota-muestra">Muestra de diseño: precio de ejemplo.</p>}

            <fieldset className="opcion">
              <legend>
                Color: <strong>{color}</strong>
              </legend>
              <div className="colores">
                {p.colores.map((n) => (
                  <label key={n} className="color-opcion" title={n}>
                    <input type="radio" name="color" value={n} checked={n === color} onChange={() => escogerColor(n)} className="sr-only" />
                    <span className="muestra-color muestra-color--grande" style={{ ["--c" as string]: colorDe(n).hex }} />
                    <span className="sr-only">{n}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {!unica && (
              <fieldset className="opcion" id="tallas">
                <legend className="opcion__fila">
                  <span>
                    Talla{talla && <>: <strong>{talla}</strong></>}
                  </span>
                  <button type="button" className="enlace-sutil" onClick={() => setGuia(true)}>
                    <Icono nombre="regla" /> Guía de tallas
                  </button>
                </legend>
                <div className={`tallas${falta ? " tallas--falta" : ""}`} key={falta}>
                  {tallasDe(p).map((t) => (
                    <label key={t} className="talla">
                      <input type="radio" name="talla" value={t} checked={t === talla} onChange={() => setTalla(t)} className="sr-only" />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
                {falta > 0 && !talla && (
                  <p className="error" role="alert">
                    Escoge una talla para agregarla a la bolsa.
                  </p>
                )}
              </fieldset>
            )}

            <div className="producto__comprar">
              <Cantidad valor={cantidad} cambiar={setCantidad} />
              <button ref={boton} type="button" className="boton boton--ancho" onClick={agregar}>
                <Icono nombre="bolsa" />
                <span>Agregar a la bolsa</span>
              </button>
            </div>
            <a className="boton boton--wa-borde boton--ancho" href={enlaceWhatsApp(mensaje)} target="_blank" rel="noreferrer">
              <IconoWhatsApp className="icono" />
              <span>Pedir ya por WhatsApp</span>
            </a>

            <div className="acordeon">
              <details open>
                <summary>
                  Descripción <Icono nombre="abajo" />
                </summary>
                <p>{p.descripcion}</p>
                <p>Tallas disponibles: {tallasDe(p).join(", ")}.</p>
              </details>
              <details>
                <summary>
                  Hazla tuya <Icono nombre="abajo" />
                </summary>
                <p>
                  Le ponemos tu nombre, tu número o el logo de tu empresa, desde una sola unidad. <Link to="/personaliza">Diseñala en Personaliza</Link> o escríbenos.
                </p>
              </details>
              <details>
                <summary>
                  Pedido y entrega <Icono nombre="abajo" />
                </summary>
                <p>
                  Agrega lo que quieras a la bolsa y envía el pedido por WhatsApp. Allá acordamos el pago y la entrega, o puedes recogerlo en la tienda: {tienda.direccion}, {tienda.ciudad}.
                </p>
              </details>
              <details>
                <summary>
                  Cuidado de la prenda <Icono nombre="abajo" />
                </summary>
                <p>Lávala al revés en agua fría, no uses blanqueador y plancha por el revés sin pasar sobre el estampado.</p>
              </details>
            </div>
          </div>
        </div>
      </div>

      <section className="bloque" aria-labelledby="titulo-relacionados">
        <div className="bloque__cabeza" data-revelar>
          <h2 id="titulo-relacionados" className="titular">
            También te puede gustar
          </h2>
        </div>
        <div className="cuadricula">
          {relacionados.map((x, i) => (
            <TarjetaProducto key={x.id} producto={x} retraso={i * 70} />
          ))}
        </div>
      </section>

      <div className={`barra-compra${barra ? " barra-compra--visible" : ""}`} aria-hidden={!barra} inert={!barra}>
        <div>
          <p className="barra-compra__nombre">{p.nombre}</p>
          <p className="barra-compra__precio">
            {precio(p.precio)}
            {talla && !unica ? ` / Talla ${talla}` : ""}
          </p>
        </div>
        <button type="button" className="boton" onClick={agregar}>
          <span>Agregar</span>
        </button>
      </div>

      <Modal abierto={guia} cerrar={() => setGuia(false)} titulo="Guía de tallas" ancho>
        <GuiaTallas inicial={grupos[p.tallas] ? p.tallas : "adulto"} />
      </Modal>
    </div>
  );
}
