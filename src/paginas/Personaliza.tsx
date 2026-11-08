import { useEffect, useRef, useState, type PointerEvent as EventoPuntero } from "react";
import { Link } from "react-router-dom";
import { color as colorDe, enlaceCorreo, enlaceWhatsApp, grupos, personaliza, precio, tienda } from "../datos";
import { bolsa, type Diseno } from "../estado/bolsa";
import { avisar } from "../estado/aviso";
import { GuiaTallas } from "../componentes/GuiaTallas";
import { Cantidad } from "../componentes/Cantidad";
import { Icono, IconoWhatsApp } from "../componentes/Iconos";
import { Volver } from "../componentes/Volver";
import { Modal } from "../componentes/Modal";
import { useTitulo, volarABolsa } from "../lib/util";
import { CapaDiseno } from "../prendas/CapaDiseno";
import { CapaPrenda, esOscuro } from "../prendas/Prenda";
import { FORMAS } from "../prendas/formas";

const FUENTES = [
  { nombre: "Bloque", familia: "'Archivo', sans-serif" },
  { nombre: "Universitaria", familia: "'Graduate', serif" },
  { nombre: "Elegante", familia: "'Playfair Display', serif" },
  { nombre: "Manuscrita", familia: "'Caveat', cursive" },
];

type Lado = "frente" | "espalda";
const AREA = { x: 130, y: 120, w: 140, h: 200 };

/** Reduce el logo a 600 px como máximo, para que quepa en la bolsa sin pesar. */
function leerLogo(archivo: File): Promise<string> {
  return new Promise((ok, mal) => {
    const lector = new FileReader();
    lector.onerror = () => mal(new Error("lectura"));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => mal(new Error("imagen"));
      img.onload = () => {
        const escala = Math.min(1, 600 / Math.max(img.width, img.height));
        const lienzo = document.createElement("canvas");
        lienzo.width = Math.max(1, Math.round(img.width * escala));
        lienzo.height = Math.max(1, Math.round(img.height * escala));
        lienzo.getContext("2d")!.drawImage(img, 0, 0, lienzo.width, lienzo.height);
        ok(lienzo.toDataURL("image/png"));
      };
      img.src = lector.result as string;
    };
    lector.readAsDataURL(archivo);
  });
}

export default function Personaliza() {
  useTitulo("Personaliza tu prenda", "Diseña tu camiseta, buzo, gorra, totebag o mug con tu texto o tu logo y pídela por WhatsApp desde una unidad.");
  const [prendaId, setPrendaId] = useState(personaliza.prendas[0].id);
  const prenda = personaliza.prendas.find((x) => x.id === prendaId)!;
  const forma = FORMAS[prenda.forma];
  const [colorNombre, setColorNombre] = useState(prenda.colores[0]);
  const c = colorDe(colorNombre);
  const [lado, setLado] = useState<Lado>("frente");
  const [disenos, setDisenos] = useState<Partial<Record<Lado, Diseno>>>({});
  const [talla, setTalla] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");
  const [guia, setGuia] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  // Distancia entre el dedo y el centro del diseño, para que no salte al agarrarlo
  const desfase = useRef({ x: 0, y: 0 });
  const agarre = useRef<SVGGElement>(null);
  const lienzo = useRef<SVGSVGElement>(null);
  const vista = useRef<HTMLDivElement>(null);

  const area = (lado === "espalda" ? forma.areaEspalda : forma.area) ?? AREA;
  const bajar = forma.bajar ?? 0;
  const actual = disenos[lado];
  const modo = actual?.tipo ?? "nada";
  const unica = prenda.tallas === "unica";
  const ladosUsados = (Object.keys(disenos) as Lado[]).filter((l) => disenos[l]);
  const valor = prenda.precio + personaliza.precioPorLado * ladosUsados.length;

  const mensajePropio = `Hola, Schuster. Ya tengo mi diseño y quiero cotizarlo.\n\nPrenda: ${prenda.nombre}\nColor: ${c.nombre}\nCantidad: ${cantidad}${talla ? `\nTalla: ${talla}` : ""}\n\nTe adjunto el archivo.`;

  const mensajeAyuda = `Hola, Schuster. Quiero una prenda personalizada pero necesito ayuda con el diseño.\n\nPrenda: ${prenda.nombre}\nColor: ${c.nombre}\nCantidad: ${cantidad}\n\nMi idea es: `;

  const centro = () => ({ x: area.x + area.w / 2, y: area.y + bajar + area.h * 0.36 });

  function cambiar(cambios: Partial<Diseno>) {
    setDisenos((d) => ({ ...d, [lado]: { ...(d[lado] as Diseno), ...cambios } }));
    setError("");
  }

  function escogerModo(m: "texto" | "logo" | "nada") {
    if (m === "nada") {
      setDisenos((d) => ({ ...d, [lado]: undefined }));
      return;
    }
    if (m === actual?.tipo) return;
    const base = { ...centro() };
    setDisenos((d) => ({
      ...d,
      [lado]:
        m === "texto"
          ? { tipo: "texto", texto: "", fuente: FUENTES[0].familia, fuenteNombre: FUENTES[0].nombre, tinta: esOscuro(c.hex) ? "#ffffff" : "#111111", tintaNombre: esOscuro(c.hex) ? "Blanco" : "Negro", tamano: 28, ...base }
          : { tipo: "logo", tamano: Math.round(area.w * 0.6), ...base },
    }));
  }

  function cambiarPrenda(id: string) {
    const nueva = personaliza.prendas.find((x) => x.id === id)!;
    setPrendaId(id);
    setColorNombre(nueva.colores.includes(colorNombre) ? colorNombre : nueva.colores[0]);
    setTalla(nueva.tallas === prenda.tallas ? talla : null);
    setLado("frente");
    // El diseño se recoloca en el centro del área de la nueva prenda
    const f = FORMAS[nueva.forma];
    setDisenos((d) => {
      const r: Partial<Record<Lado, Diseno>> = {};
      for (const l of ["frente", "espalda"] as Lado[]) {
        if (!d[l] || !nueva.lados.includes(l)) continue;
        const a = (l === "espalda" ? f.areaEspalda : f.area) ?? AREA;
        r[l] = { ...d[l]!, x: a.x + a.w / 2, y: a.y + (f.bajar ?? 0) + a.h * 0.36, tamano: d[l]!.tipo === "logo" ? Math.min(d[l]!.tamano, a.w) : d[l]!.tamano };
      }
      return r;
    });
  }

  async function subir(archivo?: File) {
    if (!archivo) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(archivo.type)) return setError("Sube tu logo en PNG, JPG, WEBP o SVG.");
    if (archivo.size > 8 * 1024 * 1024) return setError("El archivo pesa más de 8 MB. Prueba con uno más liviano.");
    try {
      cambiar({ imagen: await leerLogo(archivo) });
    } catch {
      setError("No pudimos leer esa imagen. Prueba con otro archivo.");
    }
  }

  // Convierte la posición del dedo o el mouse a coordenadas del dibujo
  function aLienzo(e: EventoPuntero) {
    const svg = lienzo.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }

  const limitar = (x: number, y: number) => ({
    x: Math.round(Math.max(area.x, Math.min(area.x + area.w, x))),
    y: Math.round(Math.max(area.y + bajar, Math.min(area.y + bajar + area.h, y))),
  });

  function mover(e: EventoPuntero<SVGElement>) {
    if (!arrastrando || !actual) return;
    const p = aLienzo(e);
    cambiar(limitar(p.x + desfase.current.x, p.y + desfase.current.y));
  }

  function agarrar(e: EventoPuntero<SVGElement>, saltar: boolean) {
    if (!actual) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = aLienzo(e);
    desfase.current = saltar ? { x: 0, y: 0 } : { x: actual.x - p.x, y: actual.y - p.y };
    setArrastrando(true);
    if (saltar) cambiar(limitar(p.x, p.y));
  }

  // En iPhone, tocar el diseño no debe mover la página mientras se arrastra
  useEffect(() => {
    const el = agarre.current;
    if (!el) return;
    const quieto = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchstart", quieto, { passive: false });
    return () => el.removeEventListener("touchstart", quieto);
  });

  const caja = actual
    ? actual.tipo === "logo"
      ? { w: actual.tamano + 16, h: actual.tamano + 16 }
      : { w: Math.max(40, (actual.texto?.length ?? 1) * actual.tamano * 0.66) + 16, h: actual.tamano * 1.4 }
    : { w: 0, h: 0 };

  function tecla(e: React.KeyboardEvent) {
    if (!actual) return;
    const paso = e.shiftKey ? 10 : 2;
    const d = { ArrowLeft: [-paso, 0], ArrowRight: [paso, 0], ArrowUp: [0, -paso], ArrowDown: [0, paso] }[e.key];
    if (!d) return;
    e.preventDefault();
    cambiar(limitar(actual.x + d[0], actual.y + d[1]));
  }

  function agregar() {
    if (!ladosUsados.length) return setError("Agrega un texto o tu logo antes de pedir.");
    const vacio = ladosUsados.find((l) => (disenos[l]!.tipo === "texto" ? !disenos[l]!.texto?.trim() : !disenos[l]!.imagen));
    if (vacio) {
      setLado(vacio);
      return setError(`Falta el ${disenos[vacio]!.tipo === "texto" ? "texto" : "logo"} ${vacio === "frente" ? "del frente" : "de la espalda"}.`);
    }
    if (!unica && !talla) return setError("Escoge una talla.");
    const limpio: Partial<Record<Lado, Diseno>> = {};
    ladosUsados.forEach((l) => (limpio[l] = disenos[l]));
    bolsa.agregar({
      id: `personalizado-${prenda.id}`,
      nombre: `${prenda.nombre} personalizada`,
      forma: prenda.forma,
      estampado: "ninguno",
      color: { nombre: c.nombre, hex: c.hex },
      talla: talla ?? "Única",
      cantidad,
      precio: valor,
      diseno: limpio,
    });
    volarABolsa(vista.current);
    avisar(`Tu ${prenda.nombre.toLowerCase()} personalizada quedó en la bolsa`);
  }

  return (
    <div className="personaliza">
      <header className="personaliza__cabeza">
        <div className="fila-volver">
          <Volver />
          <nav aria-label="Ruta" className="migas">
            <Link to="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Personaliza</span>
          </nav>
        </div>
        <p className="sobretitulo">Desde una sola unidad</p>
        <h1 className="titular titular--seccion">Personaliza</h1>
        <p className="seccion__frase">Escoge la prenda, ponle tu texto o tu logo y mira cómo queda. Nosotros la estampamos.</p>
      </header>

      <div className="personaliza__cuerpo">
        <div className="personaliza__vista">
          <div className="personaliza__lienzo" ref={vista}>
            <div className="personaliza__giro" key={lado + prendaId}>
              <svg ref={lienzo} viewBox="0 0 400 500" role="img" aria-label={`Vista previa: ${prenda.nombre} ${c.nombre.toLowerCase()}, ${lado}`}>
                <CapaPrenda
                  forma={prenda.forma}
                  color={c.hex}
                  estampado="ninguno"
                  lado={lado}
                  extra={
                    <>
                      <CapaDiseno diseno={actual} />
                      {actual && (
                        <rect
                          x={area.x}
                          y={area.y + bajar}
                          width={area.w}
                          height={area.h}
                          className={`personaliza__area${arrastrando ? " personaliza__area--activa" : ""}`}
                          onPointerDown={(e) => e.pointerType === "mouse" && agarrar(e, true)}
                          onPointerMove={mover}
                          onPointerUp={() => setArrastrando(false)}
                          onPointerCancel={() => setArrastrando(false)}
                        />
                      )}
                      {actual && (
                        <g
                          ref={agarre}
                          className="personaliza__agarre"
                          onPointerDown={(e) => agarrar(e, false)}
                          onPointerMove={mover}
                          onPointerUp={() => setArrastrando(false)}
                          onPointerCancel={() => setArrastrando(false)}
                        >
                          <rect x={actual.x - caja.w / 2} y={actual.y - caja.h / 2} width={caja.w} height={caja.h} />
                        </g>
                      )}
                    </>
                  }
                />
              </svg>
            </div>
          </div>
          {prenda.lados.length > 1 && (
            <div className="lados" role="group" aria-label="Lado de la prenda">
              {(prenda.lados as Lado[]).map((l) => (
                <button key={l} type="button" aria-pressed={l === lado} onClick={() => setLado(l)}>
                  <Icono nombre="girar" /> {l === "frente" ? "Frente" : "Espalda"}
                  {disenos[l] && <span className="punto" aria-label="con diseño" />}
                </button>
              ))}
            </div>
          )}
          {actual && (
            <p className="personaliza__ayuda">
              Toca y arrastra el diseño para moverlo. Con el teclado, usa el botón "Mover con flechas".
            </p>
          )}
        </div>

        <div className="personaliza__panel">
          <section className="propio" aria-labelledby="titulo-propio">
            <h2 id="titulo-propio">¿Ya tienes tu diseño?</h2>
            <p>Envíanoslo con la prenda, el color y la cantidad que necesitas, y te cotizamos. Sirve el archivo que tengas: PNG, PDF, JPG o el de tu diseñador.</p>
            <div className="propio__botones">
              <a className="boton boton--wa" href={enlaceWhatsApp(mensajePropio)} target="_blank" rel="noreferrer">
                <IconoWhatsApp className="icono" />
                <span>Por WhatsApp</span>
              </a>
              <a className="boton boton--borde" href={enlaceCorreo("Ya tengo mi diseño", mensajePropio)}>
                <Icono nombre="correo" />
                <span>Por correo</span>
              </a>
            </div>
            {tienda.correo && <p className="propio__correo">Nuestro correo: {tienda.correo}</p>}
          </section>

          <section className="propio propio--ayuda" aria-labelledby="titulo-ayuda">
            <h2 id="titulo-ayuda">¿No sabes qué diseño quieres?</h2>
            <p>No te preocupes, te ayudamos. Cuéntanos tu idea, para qué es la prenda y los colores que te gustan, y nuestro equipo de diseño la crea a tu gusto.</p>
            <div className="propio__botones">
              <a className="boton boton--wa" href={enlaceWhatsApp(mensajeAyuda)} target="_blank" rel="noreferrer">
                <IconoWhatsApp className="icono" />
                <span>Por WhatsApp</span>
              </a>
              <a className="boton boton--borde" href={enlaceCorreo("Quiero que me ayuden con el diseño", mensajeAyuda)}>
                <Icono nombre="correo" />
                <span>Por correo</span>
              </a>
            </div>
          </section>

          <section className="paso">
            <h2 className="paso__titulo">
              <span>1</span> Prenda
            </h2>
            <div className="prendas-opcion" role="radiogroup" aria-label="Prenda">
              {personaliza.prendas.map((x) => (
                <button key={x.id} type="button" role="radio" aria-checked={x.id === prendaId} onClick={() => cambiarPrenda(x.id)} className="prenda-opcion">
                  <svg viewBox="0 0 400 500" aria-hidden="true">
                    <CapaPrenda forma={x.forma} color={colorDe(x.colores[0]).hex} estampado="ninguno" sombra={false} />
                  </svg>
                  <span>{x.nombre}</span>
                  <small>Desde {precio(x.precio)}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="paso">
            <h2 className="paso__titulo">
              <span>2</span> Color: <strong>{c.nombre}</strong>
            </h2>
            <div className="colores" role="radiogroup" aria-label="Color de la prenda">
              {prenda.colores.map((n) => (
                <button key={n} type="button" role="radio" aria-checked={n === colorNombre} aria-label={n} className="muestra-color muestra-color--grande" style={{ ["--c" as string]: colorDe(n).hex }} onClick={() => setColorNombre(n)} />
              ))}
            </div>
          </section>

          <section className="paso">
            <h2 className="paso__titulo">
              <span>3</span> Diseño {prenda.lados.length > 1 && <small>({lado === "frente" ? "frente" : "espalda"})</small>}
            </h2>
            <div className="pestanas" role="tablist" aria-label="Tipo de diseño">
              {(["texto", "logo", "nada"] as const).map((m) => (
                <button key={m} type="button" role="tab" aria-selected={modo === m} onClick={() => escogerModo(m)}>
                  {m === "texto" ? "Texto" : m === "logo" ? "Tu logo" : "Sin diseño"}
                </button>
              ))}
            </div>

            {actual?.tipo === "texto" && (
              <div className="paso__cuerpo" key={"t" + lado}>
                <label className="campo">
                  <span>Tu texto</span>
                  <input type="text" maxLength={22} value={actual.texto ?? ""} placeholder="Tu nombre, tu frase o tu número" onChange={(e) => cambiar({ texto: e.target.value })} onKeyDown={(e) => e.stopPropagation()} autoFocus />
                </label>
                <div className="campo">
                  <span id="titulo-letra">Letra</span>
                  <div className="fuentes" role="radiogroup" aria-labelledby="titulo-letra">
                    {FUENTES.map((f) => (
                      <button key={f.nombre} type="button" role="radio" aria-checked={actual.fuente === f.familia} onClick={() => cambiar({ fuente: f.familia, fuenteNombre: f.nombre })} style={{ fontFamily: f.familia }} className={f.nombre === "Bloque" ? "fuente--bloque" : undefined}>
                        {f.nombre}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="campo">
                  <span id="titulo-tinta">
                    Tinta: <strong>{actual.tintaNombre}</strong>
                  </span>
                  <div className="colores" role="radiogroup" aria-labelledby="titulo-tinta">
                    {personaliza.tintas.map((t) => (
                      <button key={t.nombre} type="button" role="radio" aria-checked={actual.tinta === t.hex} aria-label={t.nombre} className="muestra-color" style={{ ["--c" as string]: t.hex }} onClick={() => cambiar({ tinta: t.hex, tintaNombre: t.nombre })} />
                    ))}
                  </div>
                </div>
                <label className="campo">
                  <span>Tamaño</span>
                  <input type="range" min={12} max={64} value={actual.tamano} onChange={(e) => cambiar({ tamano: Number(e.target.value) })} />
                </label>
              </div>
            )}

            {actual?.tipo === "logo" && (
              <div className="paso__cuerpo" key={"l" + lado}>
                <label className="subir">
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={(e) => subir(e.target.files?.[0])} />
                  <Icono nombre="subir" />
                  <span>{actual.imagen ? "Cambiar el logo" : "Sube tu logo"}</span>
                  <small>PNG con fondo transparente queda mejor. Máximo 8 MB.</small>
                </label>
                {actual.imagen && (
                  <label className="campo">
                    <span>Tamaño</span>
                    <input type="range" min={30} max={Math.round(area.w)} value={actual.tamano} onChange={(e) => cambiar({ tamano: Number(e.target.value) })} />
                  </label>
                )}
              </div>
            )}

            {actual && (
              <div className="posicion">
                <button
                  type="button"
                  className="posicion__mover"
                  onKeyDown={tecla}
                  aria-label={`Mover el diseño. Posición horizontal ${Math.round(actual.x)}, vertical ${Math.round(actual.y)}. Usa las flechas.`}
                >
                  <Icono nombre="centrar" /> Mover con flechas
                </button>
                <button type="button" className="enlace-sutil" onClick={() => cambiar(centro())}>
                  Centrar
                </button>
              </div>
            )}
          </section>

          <section className="paso">
            <h2 className="paso__titulo">
              <span>4</span> {unica ? "Cantidad" : "Talla y cantidad"}
            </h2>
            {!unica && (
              <>
                <div className="opcion__fila">
                  <span>{talla ? <>Talla: <strong>{talla}</strong></> : "Escoge tu talla"}</span>
                  <button type="button" className="enlace-sutil" onClick={() => setGuia(true)}>
                    <Icono nombre="regla" /> Guía de tallas
                  </button>
                </div>
                <div className="tallas" role="radiogroup" aria-label="Talla">
                  {grupos[prenda.tallas].tallas.map((t) => (
                    <button key={t} type="button" role="radio" aria-checked={t === talla} className="talla" onClick={() => setTalla(t)}>
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            <Cantidad valor={cantidad} cambiar={setCantidad} />
          </section>

          <div className="resumen">
            <dl>
              <div>
                <dt>{prenda.nombre}</dt>
                <dd>{precio(prenda.precio)}</dd>
              </div>
              <div>
                <dt>Estampado ({ladosUsados.length} {ladosUsados.length === 1 ? "lado" : "lados"})</dt>
                <dd>{precio(personaliza.precioPorLado * ladosUsados.length)}</dd>
              </div>
              <div className="resumen__total">
                <dt>Total{cantidad > 1 ? ` (${cantidad} unidades)` : ""}</dt>
                <dd>{precio(valor * cantidad)}</dd>
              </div>
            </dl>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button type="button" className="boton boton--ancho" onClick={agregar}>
              <Icono nombre="bolsa" />
              <span>Agregar a la bolsa</span>
            </button>
            <p className="nota-muestra">
              Si subes un logo, te pedimos el archivo original por WhatsApp para estamparlo con la mejor calidad. <Link to="/guia-de-tallas">Ver guía de tallas</Link>.
            </p>
          </div>
        </div>
      </div>

      <Modal abierto={guia} cerrar={() => setGuia(false)} titulo="Guía de tallas" ancho>
        <GuiaTallas inicial={prenda.tallas} />
      </Modal>
    </div>
  );
}
