import type { Diseno } from "../estado/bolsa";

/** El texto o el logo del cliente encima de la prenda, en las coordenadas del dibujo. */
export function CapaDiseno({ diseno }: { diseno?: Diseno }) {
  if (!diseno) return null;
  if (diseno.tipo === "logo") {
    if (!diseno.imagen) return null;
    const w = diseno.tamano;
    return <image href={diseno.imagen} x={diseno.x - w / 2} y={diseno.y - w / 2} width={w} height={w} preserveAspectRatio="xMidYMid meet" />;
  }
  if (!diseno.texto?.trim()) return null;
  return (
    <text
      x={diseno.x}
      y={diseno.y}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily={diseno.fuente}
      fontSize={diseno.tamano}
      fill={diseno.tinta}
      style={{ fontStyle: diseno.fuente?.includes("Archivo") ? "italic" : undefined, fontWeight: 800, fontStretch: diseno.fuente?.includes("Archivo") ? "125%" : undefined }}
    >
      {diseno.texto}
    </text>
  );
}
