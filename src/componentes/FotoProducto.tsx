import { color as colorDe, type Producto } from "../datos";
import { foto } from "../fotos";
import { Prenda, type VistaFoto } from "../prendas/Prenda";

const VISTAS: VistaFoto[] = ["frente", "espalda", "detalle", "colores"];
export const NOMBRES_FOTO = ["Frente", "Espalda", "Detalle del estampado", "Todos los colores"];

interface Props {
  producto: Producto;
  color: string;
  /** 1 frente, 2 espalda, 3 detalle, 4 colores */
  n: number;
  className?: string;
  prioridad?: boolean;
  titulo?: string;
}

/** La foto real si ya está en /fotos; si no, el dibujo de la prenda. */
export function FotoProducto({ producto, color, n, className, prioridad, titulo }: Props) {
  const c = colorDe(color);
  const real = foto(producto.id, c.slug, n);
  const alt = titulo ?? "";
  if (real) {
    return (
      <img
        src={real}
        alt={alt}
        className={className}
        width={800}
        height={1000}
        loading={prioridad ? "eager" : "lazy"}
        decoding="async"
        // @ts-expect-error React aún no tipa fetchpriority en minúscula
        fetchpriority={prioridad ? "high" : undefined}
      />
    );
  }
  return (
    <Prenda
      forma={producto.forma}
      color={c.hex}
      colores={producto.colores.map((x) => colorDe(x).hex)}
      estampado={producto.estampado}
      vista={VISTAS[n - 1] ?? "frente"}
      className={className}
      titulo={alt || undefined}
    />
  );
}
