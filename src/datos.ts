import tiendaJson from "../contenido/tienda.json";
import productosJson from "../contenido/productos.json";
import tallasJson from "../contenido/tallas.json";
import personalizaJson from "../contenido/personaliza.json";

export type Seccion = "hombre" | "dama" | "infantil" | "accesorios";
export type Estampado = "leon" | "leon-pequeno" | "palabra" | "logo" | "ninguno";

export interface Color {
  nombre: string;
  hex: string;
  slug: string;
}

export interface Producto {
  id: string;
  nombre: string;
  seccion: Seccion;
  tipo: string;
  forma: string;
  tallas: string;
  precio: number;
  colores: string[];
  estampado: Estampado;
  nuevo: boolean;
  llegada: string;
  descripcion: string;
}

export interface GrupoTallas {
  nombre: string;
  tallas: string[];
  medidas?: { columnas: string[]; filas: Record<string, (string | number)[]> };
}

export const tienda = tiendaJson;
export const productos = productosJson.productos as Producto[];
export const grupos = tallasJson as Record<string, GrupoTallas>;
export const personaliza = personalizaJson;

export const SECCIONES: { id: Seccion; nombre: string; frase: string }[] = [
  { id: "hombre", nombre: "Hombre", frase: "Camisetas, polos, camisas, buzos y pantalones para todos los días." },
  { id: "dama", nombre: "Dama", frase: "Cortes entallados, blusas, tops y conjuntos cómodos." },
  { id: "infantil", nombre: "Infantil", frase: "Para el colegio, el parque y el equipo, desde la talla 2T." },
  { id: "accesorios", nombre: "Accesorios", frase: "Gorras, bolsos, mugs y todo lo que lleva tu marca." },
];

export const slug = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function color(nombre: string): Color {
  const hex = (productosJson.colores as Record<string, string>)[nombre] ?? "#888888";
  return { nombre, hex, slug: slug(nombre) };
}

export const tallasDe = (p: { tallas: string }) => grupos[p.tallas]?.tallas ?? ["Única"];
export const producto = (id: string) => productos.find((p) => p.id === id);
export const deSeccion = (s: Seccion) => productos.filter((p) => p.seccion === s);

const formato = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
export const precio = (n: number) => formato.format(n).replace(/\s/g, "");

/** Lo más reciente primero, según la fecha de llegada. */
export const porNovedad = (a: Producto, b: Producto) => b.llegada.localeCompare(a.llegada);

/** Número de la tienda sin espacios ni signos, como lo pide wa.me. */
export const numeroWhatsApp = () => tienda.whatsapp.replace(/\D/g, "");
export const enlaceWhatsApp = (texto: string) => {
  const n = numeroWhatsApp();
  return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
};

/** Abre el correo de quien visita con el mensaje listo para la tienda. */
export const enlaceCorreo = (asunto: string, cuerpo: string) =>
  `mailto:${tienda.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
