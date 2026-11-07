import { CAJA_LEON, CAJA_LOGO, CAJA_PALABRA, LEON, LETRAS } from "./trazos";

const TEXTURAS = ["tejido", "denim", "malla", "lona", "rizo", "nailon"];

/** Se pone una sola vez en la página: el logo como símbolos y lo que comparten los dibujos de las prendas. */
export function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="s-leon" viewBox={CAJA_LEON}>
          <path d={LEON} />
        </symbol>
        <symbol id="s-palabra" viewBox={CAJA_PALABRA}>
          {LETRAS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </symbol>
        <symbol id="s-logo" viewBox={CAJA_LOGO}>
          <path d={LEON} />
          {LETRAS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </symbol>

        {/* Luz de estudio: arriba a la izquierda más clara, abajo a la derecha más oscura */}
        <linearGradient id="g-luz" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".26" />
          <stop offset=".42" stopColor="#fff" stopOpacity="0" />
          <stop offset=".62" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".28" />
        </linearGradient>
        <linearGradient id="g-volumen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity=".22" />
          <stop offset=".18" stopColor="#000" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".06" />
          <stop offset=".82" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".24" />
        </linearGradient>
        <linearGradient id="g-brillo" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".25" stopColor="#fff" stopOpacity=".38" />
          <stop offset=".34" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="g-sombra">
          <stop offset="0" stopColor="#000" stopOpacity=".26" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        {TEXTURAS.map((t) => (
          <pattern key={t} id={`t-${t}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <image href={`${import.meta.env.BASE_URL}texturas/${t}.png`} width="48" height="48" />
          </pattern>
        ))}
      </defs>
    </svg>
  );
}

interface Props {
  className?: string;
  titulo?: string;
}

const etiqueta = (titulo?: string) => (titulo ? { role: "img", "aria-label": titulo } : { "aria-hidden": true as const });

export function Logo({ className, titulo }: Props) {
  return (
    <svg className={className} viewBox={CAJA_LOGO} {...etiqueta(titulo)}>
      <use href="#s-logo" />
    </svg>
  );
}

export function Leon({ className, titulo }: Props) {
  return (
    <svg className={className} viewBox={CAJA_LEON} {...etiqueta(titulo)}>
      <use href="#s-leon" />
    </svg>
  );
}

export function Palabra({ className, titulo }: Props) {
  return (
    <svg className={className} viewBox={CAJA_PALABRA} {...etiqueta(titulo)}>
      <use href="#s-palabra" />
    </svg>
  );
}

/** La palabra con cada letra por separado, para animarlas una a una. */
export function PalabraPorLetras({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={CAJA_PALABRA} aria-hidden="true">
      {LETRAS.map((d, i) => (
        <path key={i} d={d} className="letra" style={{ ["--i" as string]: i }} />
      ))}
    </svg>
  );
}

export function LeonTrazo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={CAJA_LEON} aria-hidden="true">
      <path d={LEON} />
    </svg>
  );
}
