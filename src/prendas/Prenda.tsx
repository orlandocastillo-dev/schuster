import type { ReactNode } from "react";
import type { Estampado } from "../datos";
import { FORMAS, type FotoBase, type Forma, type Vista, type Zona } from "./formas";

export type VistaFoto = "frente" | "espalda" | "detalle" | "colores";

function rgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function mezcla(hex: string, tono: number) {
  const base = tono < 0 ? 0 : 255;
  const t = Math.abs(tono);
  const [r, g, b] = rgb(hex).map((c) => Math.round(c + (base - c) * t));
  return `rgb(${r} ${g} ${b})`;
}

export function esOscuro(hex: string) {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.32;
}

export const tintaPara = (hex: string) => (esOscuro(hex) ? "#f4f4f1" : "#141414");

// Proporción alto/ancho de cada símbolo del logo
const ALTO = { leon: 93.99 / 80.78, palabra: 23.48 / 177.54, logo: 129.56 / 178.82 };

function Marca({ zona, tipo, tinta }: { zona: Zona; tipo: Estampado; tinta: string }) {
  if (tipo === "ninguno") return null;
  const simbolo = tipo === "leon-pequeno" ? "leon" : tipo;
  const w = tipo === "palabra" ? zona.w * 2.2 : tipo === "logo" ? zona.w * 1.25 : zona.w;
  const h = w * ALTO[simbolo];
  const giro = zona.rot ? `rotate(${zona.rot} ${zona.x} ${zona.y})` : undefined;
  return <use href={`#s-${simbolo}`} x={zona.x - w / 2} y={zona.y - h / 2} width={w} height={h} fill={tinta} opacity={0.94} transform={giro} />;
}

interface Capa {
  vista: Vista;
  forma: Forma;
  color: string;
  estampado: Estampado;
  conLogo: boolean;
  extra?: ReactNode;
}

function Dibujo({ vista, forma, color, estampado, conLogo, extra }: Capa) {
  const oscuro = esOscuro(color);
  const tinta = tintaPara(color);
  const pliegue = oscuro ? "rgb(255 255 255 / .05)" : "rgb(0 0 0 / .05)";
  const hilo = forma.hilo ?? (oscuro ? "rgb(255 255 255 / .24)" : "rgb(0 0 0 / .26)");
  const textura = forma.textura ?? "tejido";
  const atras = vista.partes?.filter((p) => p.atras) ?? [];
  const delante = vista.partes?.filter((p) => !p.atras) ?? [];
  const zona = estampado === "leon-pequeno" ? (vista.pecho ?? vista.logo) : vista.logo;

  return (
    <>
      {atras.map((p, i) => (
        <path key={i} d={p.d} fill={p.fijo ?? mezcla(color, p.tono)} fillRule="evenodd" />
      ))}
      <path d={vista.cuerpo} fill={color} fillRule="evenodd" />
      {textura !== "ninguna" && <path d={vista.cuerpo} fill={`url(#t-${textura})`} fillRule="evenodd" opacity={oscuro ? 0.9 : 0.6} />}
      {delante.map((p, i) => (
        <path key={i} d={p.d} fill={p.fijo ?? mezcla(color, p.tono)} fillRule="evenodd" />
      ))}
      <g fill="none" strokeLinecap="round">
        {vista.pliegues?.map((d, i) => (
          <g key={i}>
            <path d={d} stroke={pliegue} strokeWidth={16} />
            <path d={d} stroke={pliegue} strokeWidth={4} />
          </g>
        ))}
        {vista.costuras?.map((d, i) => (
          <path key={i} d={d} stroke={hilo} strokeWidth={1.3} strokeDasharray="3.5 3" />
        ))}
        {vista.ribetes?.map((d, i) => (
          <path key={i} d={d} stroke={tinta} strokeWidth={3} strokeLinejoin="round" opacity={0.9} />
        ))}
        {vista.cordones?.map((d, i) => (
          <g key={i}>
            <path d={d} stroke={mezcla(color, oscuro ? 0.5 : -0.25)} strokeWidth={5} />
            <path d={d} stroke="rgb(0 0 0 / .18)" strokeWidth={1} strokeDasharray="2 4" />
          </g>
        ))}
      </g>
      {vista.botones?.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={4.6} fill={mezcla(color, oscuro ? 0.18 : -0.12)} />
          <circle cx={x - 1.2} cy={y - 1.2} r={1.2} fill="rgb(255 255 255 / .5)" />
        </g>
      ))}
      {conLogo && zona && <Marca zona={zona} tipo={estampado} tinta={tinta} />}
      {extra}
      <path d={vista.cuerpo} fill="url(#g-volumen)" fillRule="evenodd" pointerEvents="none" />
      <path d={vista.cuerpo} fill="url(#g-luz)" fillRule="evenodd" pointerEvents="none" />
      {forma.textura === "ninguna" || textura === "nailon" ? <path d={vista.cuerpo} fill="url(#g-brillo)" fillRule="evenodd" opacity={0.7} pointerEvents="none" /> : null}
    </>
  );
}

const BASE = import.meta.env.BASE_URL;

/**
 * La prenda armada desde una foto real en blanco: el color se recorta con la silueta,
 * el logo va encima y las sombras y brillos de la tela pasan por encima de todo,
 * así el estampado sigue los pliegues.
 */
function DesdeFoto({ foto, color, estampado, espalda, extra }: { foto: FotoBase; color: string; estampado: Estampado; espalda: boolean; extra?: ReactNode }) {
  const ruta = `${BASE}prendas/${foto.archivo}`;
  const caja = { x: 0, y: foto.y, width: 400, height: foto.alto, preserveAspectRatio: "none" as const };
  const tipo: Estampado = espalda ? "palabra" : estampado;
  let zona = espalda ? foto.logoEspalda : estampado === "leon-pequeno" ? foto.pecho : foto.logo;
  // Sin foto de espalda: se voltea la foto, pero el estampado se pone derecho en el lugar reflejado
  const voltear = espalda && foto.espejoEspalda;
  if (voltear) zona = { ...zona, x: 400 - zona.x, rot: zona.rot ? -zona.rot : undefined };
  const giro = voltear ? "translate(400 0) scale(-1 1)" : undefined;
  const capa = (hijos: ReactNode) => (giro ? <g transform={giro}>{hijos}</g> : hijos);
  return (
    <>
      {capa(<rect x="0" y="0" width="400" height="500" fill={color} mask={`url(#m-${foto.archivo})`} />)}
      <Marca zona={zona} tipo={tipo} tinta={tintaPara(color)} />
      {extra}
      {capa(
        <>
          <image href={`${ruta}-sombra.webp`} {...caja} style={{ mixBlendMode: "multiply" }} pointerEvents="none" />
          <image href={`${ruta}-luz.webp`} {...caja} style={{ mixBlendMode: "screen" }} opacity={esOscuro(color) ? 0.24 : 0.1} pointerEvents="none" />
        </>,
      )}
    </>
  );
}

/** El dibujo de una prenda sin el lienzo, para meterlo dentro de otro SVG. */
export function CapaPrenda({
  forma: id,
  color,
  estampado = "leon",
  lado = "frente",
  extra,
  sombra = true,
}: {
  forma: string;
  color: string;
  estampado?: Estampado;
  lado?: "frente" | "espalda";
  extra?: ReactNode;
  sombra?: boolean;
}) {
  const forma = FORMAS[id] ?? FORMAS.camiseta;
  const bajar = forma.bajar ?? 0;
  const espalda = lado === "espalda";
  const vista = espalda ? (forma.espalda ?? forma.frente) : forma.frente;
  // Sin dibujo de espalda: se muestra el otro lado, en espejo
  const espejo = espalda && !forma.espalda;
  const estEspalda: Estampado = id === "jeans" ? "leon" : "palabra";
  const logoAtras = espalda && (forma.espalda ? vista.logo != null : !!forma.espejo);

  if (forma.foto) {
    return (
      <>
        {sombra && <ellipse cx="200" cy={forma.foto.suelo ?? 456} rx="140" ry="12" fill="url(#g-sombra)" />}
        <DesdeFoto foto={forma.foto} color={color} estampado={estampado} espalda={espalda} extra={extra} />
      </>
    );
  }

  return (
    <>
      {sombra && <ellipse cx="200" cy="476" rx="150" ry="13" fill="url(#g-sombra)" />}
      <g transform={`translate(0 ${bajar})`}>
        <g transform={espejo ? "translate(400 0) scale(-1 1)" : undefined}>
          <Dibujo
            vista={vista}
            forma={forma}
            color={color}
            estampado={espalda ? estEspalda : estampado}
            conLogo={!espalda || (!espejo && logoAtras)}
            extra={espejo ? undefined : extra}
          />
        </g>
        {espejo && logoAtras && vista.logo && <Marca zona={{ ...vista.logo, w: vista.logo.w * 0.6 }} tipo="palabra" tinta={tintaPara(color)} />}
        {espejo && extra}
      </g>
    </>
  );
}

interface Props {
  forma: string;
  color: string;
  colores?: string[];
  estampado?: Estampado;
  vista?: VistaFoto;
  className?: string;
  titulo?: string;
}

/** Foto de producto dibujada: se usa mientras llegan las fotos reales. */
export function Prenda({ forma: id, color, colores = [], estampado = "leon", vista = "frente", className, titulo }: Props) {
  const forma = FORMAS[id] ?? FORMAS.camiseta;
  const a11y = titulo ? { role: "img", "aria-label": titulo } : { "aria-hidden": true as const };

  if (vista === "colores" && colores.length > 1) {
    const n = colores.length;
    const cols = n <= 2 ? n : 2;
    const filas = Math.ceil(n / cols);
    const w = 400 / cols;
    const h = Math.min(500 / filas, w * 1.25);
    const arriba = (500 - h * filas) / 2;
    return (
      <svg viewBox="0 0 400 500" className={className} {...a11y}>
        {colores.map((c, i) => (
          <svg key={i} x={(i % cols) * w + (n % 2 && i === n - 1 ? w / 2 : 0)} y={arriba + Math.floor(i / cols) * h} width={w} height={h} viewBox="0 0 400 500">
            <CapaPrenda forma={id} color={c} estampado={estampado} />
          </svg>
        ))}
      </svg>
    );
  }

  let caja = "0 0 400 500";
  if (vista === "detalle") {
    const v = forma.foto ?? forma.frente;
    const z = (estampado === "leon-pequeno" ? v.pecho : v.logo) ?? v.pecho ?? v.logo ?? { x: 200, y: 220, w: 60 };
    const ancho = Math.max(z.w * (estampado === "palabra" ? 2.6 : 1.9), 110);
    const alto = ancho * 1.25;
    caja = `${z.x - ancho / 2} ${z.y + (forma.foto ? 0 : (forma.bajar ?? 0)) - alto / 2} ${ancho} ${alto}`;
  }

  return (
    <svg viewBox={caja} className={className} {...a11y}>
      <CapaPrenda forma={id} color={color} estampado={estampado} lado={vista === "espalda" ? "espalda" : "frente"} sombra={vista !== "detalle"} />
    </svg>
  );
}
