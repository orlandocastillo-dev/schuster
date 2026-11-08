import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { color, deSeccion, enlaceWhatsApp, porNovedad, productos, SECCIONES, tienda, type Seccion } from "../datos";
import { Icono, IconoInstagram, IconoWhatsApp } from "../componentes/Iconos";
import { Contacto } from "../componentes/Contacto";
import { TarjetaProducto } from "../componentes/TarjetaProducto";
import { useTitulo, conTransicion } from "../lib/util";
import { Leon, Palabra } from "../marca/Logo";
import { CapaDiseno } from "../prendas/CapaDiseno";
import { tiene } from "../avance";
import { CapaPrenda } from "../prendas/Prenda";

function Portada() {
  const leon = useRef<HTMLDivElement>(null);
  // El león de fondo se mueve un poco más lento que la página
  useEffect(() => {
    const el = leon.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let pendiente = false;
    const mover = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        el.style.transform = `translate3d(0, ${window.scrollY * 0.18}px, 0)`;
        pendiente = false;
      });
    };
    addEventListener("scroll", mover, { passive: true });
    return () => removeEventListener("scroll", mover);
  }, []);

  return (
    <section className="portada" aria-labelledby="titulo-portada">
      <div className="portada__fondo" aria-hidden="true">
        <div className="portada__cinta">
          <Palabra />
          <Palabra />
          <Palabra />
          <Palabra />
        </div>
        <div className="portada__cinta portada__cinta--al-reves">
          <Palabra />
          <Palabra />
          <Palabra />
          <Palabra />
        </div>
      </div>
      <div className="portada__leon" ref={leon} aria-hidden="true">
        <Leon />
      </div>

      <div className="portada__prendas" aria-hidden="true">
        <svg className="flota flota--1" viewBox="0 0 400 500">
          <CapaPrenda forma="camiseta" color={color("Rojo").hex} estampado="leon" sombra={false} />
        </svg>
        <svg className="flota flota--2" viewBox="0 0 400 500">
          <CapaPrenda forma="buzo" color={color("Arena").hex} estampado="leon" sombra={false} />
        </svg>
        <svg className="flota flota--3" viewBox="0 0 400 500">
          <CapaPrenda forma="gorra" color={color("Blanco").hex} estampado="leon" sombra={false} />
        </svg>
      </div>

      <div className="portada__texto">
        <p className="sobretitulo portada__sobre" data-entra style={{ ["--i" as string]: 0 }}>
          Barranquilla, Colombia
        </p>
        <h1 id="titulo-portada" className="portada__titulo">
          <span className="linea-mascara">
            <span data-entra style={{ ["--i" as string]: 1 }}>
              Diseñamos
            </span>
          </span>
          <span className="linea-mascara">
            <span data-entra style={{ ["--i" as string]: 2 }}>
              tu <em>estilo</em>
            </span>
          </span>
        </h1>
        <p className="portada__bajada" data-entra style={{ ["--i" as string]: 3 }}>
          Ropa para hombre, dama y niños, accesorios y prendas con tu nombre o tu logo desde una sola unidad.
        </p>
        <div className="portada__botones" data-entra style={{ ["--i" as string]: 4 }}>
          <Link to="/tienda" className="boton boton--claro" viewTransition={conTransicion}>
            <span>Ver la tienda</span>
          </Link>
          <Link to="/personaliza" className="boton boton--borde-claro" viewTransition={conTransicion}>
            <span>Personaliza la tuya</span>
          </Link>
        </div>
      </div>

      <a href="#secciones" className="portada__bajar" aria-label="Bajar a las secciones">
        <span />
      </a>
    </section>
  );
}

const MOSAICO: Record<Seccion, { fondo: string; forma: string; color: string; estampado: "leon" | "logo" | "palabra" }> = {
  hombre: { fondo: "#1a1a1a", forma: "camiseta", color: "Rojo", estampado: "leon" },
  dama: { fondo: "#e9c9c3", forma: "camiseta-dama", color: "Negro", estampado: "leon" },
  infantil: { fondo: "#f1c232", forma: "buzo", color: "Rojo", estampado: "leon" },
  accesorios: { fondo: "#d9c9a8", forma: "gorra", color: "Negro", estampado: "leon" },
};

function Secciones() {
  return (
    <section className="bloque" id="secciones" aria-labelledby="titulo-secciones">
      <div className="bloque__cabeza" data-revelar>
        <h2 id="titulo-secciones" className="titular">
          Compra por sección
        </h2>
      </div>
      <div className="mosaico">
        {SECCIONES.map((s, i) => {
          const m = MOSAICO[s.id];
          return (
            <Link
              key={s.id}
              to={`/${s.id}`}
              className={`mosaico__item${s.id === "hombre" ? " mosaico__item--oscuro" : ""}`}
              style={{ ["--fondo" as string]: m.fondo, ["--retraso" as string]: `${i * 90}ms` }}
              data-revelar
              viewTransition={conTransicion}
            >
              <svg className="mosaico__prenda" viewBox="0 0 400 500" aria-hidden="true">
                <CapaPrenda forma={m.forma} color={color(m.color).hex} estampado={m.estampado} />
              </svg>
              <span className="mosaico__nombre">{s.nombre}</span>
              <span className="mosaico__ver">
                Ver todo <Icono nombre="flecha" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Carril({ titulo, enlace, lista, id }: { titulo: string; enlace: string; lista: typeof productos; id: string }) {
  const pista = useRef<HTMLDivElement>(null);
  const mover = (dir: number) => {
    const el = pista.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <section className="bloque" aria-labelledby={id}>
      <div className="bloque__cabeza" data-revelar>
        <h2 id={id} className="titular">
          {titulo}
        </h2>
        <div className="bloque__acciones">
          <Link to={enlace} className="enlace-flecha">
            Ver todo <Icono nombre="flecha" />
          </Link>
          <button type="button" className="boton-icono boton-icono--borde solo-escritorio" onClick={() => mover(-1)} aria-label="Anteriores">
            <Icono nombre="izquierda" />
          </button>
          <button type="button" className="boton-icono boton-icono--borde solo-escritorio" onClick={() => mover(1)} aria-label="Siguientes">
            <Icono nombre="derecha" />
          </button>
        </div>
      </div>
      <div className="carril" ref={pista}>
        {lista.map((p, i) => (
          <TarjetaProducto key={p.id} producto={p} retraso={Math.min(i, 5) * 70} />
        ))}
      </div>
    </section>
  );
}

function Banda() {
  const frases = ["Desde una unidad", "Estampado y bordado", "Pedidos por WhatsApp", "Hombre, dama y niños", "Barranquilla"];
  const fila = (
    <div className="banda__fila">
      {frases.map((f) => (
        <span key={f}>
          {f}
          <Leon className="banda__leon" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="banda" aria-label={frases.join(". ")} role="img">
      {fila}
      {fila}
    </div>
  );
}

const DEMOS = [
  { texto: "TU NOMBRE", fuente: "'Archivo', sans-serif", tinta: "#ffffff" },
  { texto: "Valentina", fuente: "'Caveat', cursive", tinta: "#c9a227" },
  { texto: "EQUIPO 10", fuente: "'Graduate', serif", tinta: "#ffffff" },
  { texto: "Tu marca", fuente: "'Playfair Display', serif", tinta: "#c4c8cc" },
];

function FranjaPersonaliza() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % DEMOS.length), 2400);
    return () => clearInterval(t);
  }, []);
  const d = DEMOS[i];
  return (
    <section className="franja" aria-labelledby="titulo-franja">
      <div className="franja__texto" data-revelar>
        <p className="sobretitulo">Personaliza</p>
        <h2 id="titulo-franja" className="titular titular--grande">
          Tu nombre.
          <br />
          Tu logo.
          <br />
          Tu equipo.
        </h2>
        <p>Escoge la prenda y el color, escribe tu texto o sube tu logo y mira cómo queda antes de pedirla. Lo hacemos desde una sola unidad.</p>
        <Link to="/personaliza" className="boton boton--claro" viewTransition={conTransicion}>
          <span>Empezar a diseñar</span>
        </Link>
      </div>
      <div className="franja__demo" data-revelar aria-hidden="true">
        <svg viewBox="0 0 400 500">
          <CapaPrenda
            forma="camiseta"
            color={color("Negro").hex}
            estampado="ninguno"
            extra={
              <g key={i} className="franja__diseno">
                <CapaDiseno
                  diseno={{ tipo: "texto", texto: d.texto, fuente: d.fuente, tinta: d.tinta, x: 200, y: 190, tamano: d.texto.length > 9 ? 22 : 28 }}
                />
              </g>
            }
          />
        </svg>
      </div>
    </section>
  );
}

function PorSeccion() {
  const [s, setS] = useState<Seccion>("hombre");
  const lista = [...deSeccion(s)].sort(porNovedad).slice(0, 8);
  return (
    <section className="bloque" aria-labelledby="titulo-por-seccion">
      <div className="bloque__cabeza" data-revelar>
        <h2 id="titulo-por-seccion" className="titular">
          Para cada estilo
        </h2>
        <div className="pestanas pestanas--grandes" role="tablist" aria-label="Sección">
          {SECCIONES.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={x.id === s} aria-controls="lista-por-seccion" onClick={() => setS(x.id)}>
              {x.nombre}
            </button>
          ))}
        </div>
      </div>
      <div className="cuadricula cuadricula--cambio" id="lista-por-seccion" role="tabpanel" key={s}>
        {lista.map((p, i) => (
          <TarjetaProducto key={p.id} producto={p} retraso={i * 60} />
        ))}
      </div>
      <div className="bloque__pie">
        <Link to={`/${s}`} className="boton boton--borde" viewTransition={conTransicion}>
          <span>Ver todo {SECCIONES.find((x) => x.id === s)!.nombre.toLowerCase()}</span>
        </Link>
      </div>
    </section>
  );
}

function ComoPedir() {
  const pasos = [
    ["Escoge", "Busca por sección, mira las cuatro fotos y escoge color y talla. Si quieres algo único, diséñalo en Personaliza."],
    ["Revisa tu bolsa", "Ajusta cantidades y mira el total. La bolsa se queda guardada aunque cierres la página."],
    ["Pide por WhatsApp", "Con un toque se arma el mensaje con todo tu pedido. Allá acordamos el pago y la entrega."],
  ];
  return (
    <section className="bloque como" id="como-pedir" aria-labelledby="titulo-como">
      <div className="bloque__cabeza" data-revelar>
        <h2 id="titulo-como" className="titular">
          Así de fácil
        </h2>
      </div>
      <ol className="como__pasos">
        {pasos.map(([t, d], i) => (
          <li key={t} data-revelar style={{ ["--retraso" as string]: `${i * 120}ms` }}>
            <span className="como__n">0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TiendaFisica() {
  const direccion = `${tienda.direccion}, ${tienda.ciudad}, Colombia`;
  const q = encodeURIComponent(direccion);
  return (
    <section className="visita" id="visitanos" aria-labelledby="titulo-visita">
      <div className="visita__mapa" data-revelar>
        {import.meta.env.VITE_ARTEFACTO ? (
          <a className="visita__sin-mapa" href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noreferrer">
            <Icono nombre="pin" />
            <span>Ver en Google Maps</span>
          </a>
        ) : (
          <iframe
            title={`Mapa: ${direccion}`}
            src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
      <div className="visita__info" data-revelar>
        <p className="sobretitulo">Tienda física</p>
        <h2 id="titulo-visita" className="titular titular--grande">
          Visítanos
        </h2>
        <address>
          {tienda.direccion}
          <br />
          {tienda.ciudad}, Colombia
        </address>
        <p>Ven a medirte las prendas, mira las telas y cuéntanos qué quieres estampar.</p>
        <div className="visita__botones">
          <a className="boton boton--claro" href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noreferrer">
            <Icono nombre="pin" />
            <span>Cómo llegar</span>
          </a>
          <a className="boton boton--borde-claro" href={`https://instagram.com/${tienda.instagram}`} target="_blank" rel="noreferrer">
            <IconoInstagram />
            <span>@{tienda.instagram}</span>
          </a>
          <a className="boton boton--wa" href={enlaceWhatsApp("Hola, Schuster. Quiero visitar la tienda.")} target="_blank" rel="noreferrer">
            <IconoWhatsApp className="icono" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Inicio() {
  useTitulo("", "Schuster: ropa para hombre, dama y niños, accesorios y prendas personalizadas desde una unidad. Tienda en Barranquilla. Pide por WhatsApp.");
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);
  const nuevos = productos.filter((p) => p.nuevo).sort(porNovedad);
  return (
    <>
      <Portada />
      <Secciones />
      <Carril titulo="Lo nuevo" enlace="/tienda?orden=nuevo" lista={nuevos} id="titulo-nuevo" />
      <Banda />
      {tiene("personaliza") && <FranjaPersonaliza />}
      <PorSeccion />
      {tiene("comoPedir") && <ComoPedir />}
      {tiene("contacto") && (
        <section className="bloque bloque--contacto" id="contacto" aria-label="Contacto">
          <Contacto />
        </section>
      )}
      <TiendaFisica />
    </>
  );
}
