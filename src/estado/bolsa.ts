import { useSyncExternalStore } from "react";
import { enlaceWhatsApp, precio } from "../datos";

export interface Diseno {
  tipo: "texto" | "logo";
  texto?: string;
  fuente?: string;
  fuenteNombre?: string;
  tinta?: string;
  tintaNombre?: string;
  /** Imagen del logo reducida, para la vista previa en la bolsa. */
  imagen?: string;
  /** Centro dentro del lienzo de 400 x 500. */
  x: number;
  y: number;
  /** Ancho del logo o tamaño de la letra, en unidades del lienzo. */
  tamano: number;
}

export interface Linea {
  clave: string;
  id: string;
  nombre: string;
  forma: string;
  estampado: "leon" | "leon-pequeno" | "palabra" | "logo" | "ninguno";
  color: { nombre: string; hex: string };
  talla: string;
  cantidad: number;
  precio: number;
  diseno?: { frente?: Diseno; espalda?: Diseno };
}

const CLAVE = "schuster:bolsa";

function leer(): Linea[] {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

let lineas = leer();
let abierta = false;
const oyentes = new Set<() => void>();

function avisar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lineas));
  } catch {
    // Sin espacio (un logo muy pesado): la bolsa sigue funcionando mientras la página esté abierta
  }
  oyentes.forEach((o) => o());
}

const suscribir = (o: () => void) => {
  oyentes.add(o);
  return () => oyentes.delete(o);
};

// Si la bolsa cambia en otra pestaña, esta también se entera
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === CLAVE) {
      lineas = leer();
      oyentes.forEach((o) => o());
    }
  });
}

export const bolsa = {
  agregar(nueva: Omit<Linea, "clave">) {
    const clave = [nueva.id, nueva.color.nombre, nueva.talla, nueva.diseno ? JSON.stringify(nueva.diseno) : ""].join("|");
    const existe = lineas.find((l) => l.clave === clave);
    lineas = existe
      ? lineas.map((l) => (l.clave === clave ? { ...l, cantidad: Math.min(99, l.cantidad + nueva.cantidad) } : l))
      : [...lineas, { ...nueva, clave }];
    avisar();
  },
  cantidad(clave: string, cantidad: number) {
    lineas = cantidad < 1 ? lineas.filter((l) => l.clave !== clave) : lineas.map((l) => (l.clave === clave ? { ...l, cantidad: Math.min(99, cantidad) } : l));
    avisar();
  },
  quitar(clave: string) {
    lineas = lineas.filter((l) => l.clave !== clave);
    avisar();
  },
  vaciar() {
    lineas = [];
    avisar();
  },
  abrir() {
    abierta = true;
    oyentes.forEach((o) => o());
  },
  cerrar() {
    abierta = false;
    oyentes.forEach((o) => o());
  },
};

export const useBolsa = () => useSyncExternalStore(suscribir, () => lineas);
export const useBolsaAbierta = () => useSyncExternalStore(suscribir, () => abierta);

export const unidades = (ls: Linea[]) => ls.reduce((n, l) => n + l.cantidad, 0);
export const total = (ls: Linea[]) => ls.reduce((n, l) => n + l.cantidad * l.precio, 0);

function describir(d: Diseno, lado: string) {
  if (d.tipo === "logo") return `   Estampado ${lado}: mi logo (te lo envío por este chat)`;
  return `   Estampado ${lado}: "${d.texto}" en letra ${d.fuenteNombre}, tinta ${d.tintaNombre?.toLowerCase()}`;
}

export function mensajePedido(ls: Linea[]) {
  const partes = ls.map((l, i) => {
    const filas = [
      `${i + 1}. ${l.nombre}`,
      `   Color: ${l.color.nombre}${l.talla === "Única" ? "" : `, talla ${l.talla}`}, cantidad ${l.cantidad}`,
    ];
    if (l.diseno?.frente) filas.push(describir(l.diseno.frente, "al frente"));
    if (l.diseno?.espalda) filas.push(describir(l.diseno.espalda, "en la espalda"));
    filas.push(`   ${precio(l.precio * l.cantidad)}`);
    return filas.join("\n");
  });
  return [
    "Hola, Schuster. Quiero hacer este pedido:",
    "",
    partes.join("\n\n"),
    "",
    `Total: ${precio(total(ls))}`,
    "",
    "Mi nombre:",
    "Barrio o dirección de entrega:",
  ].join("\n");
}

export const enlacePedido = (ls: Linea[]) => enlaceWhatsApp(mensajePedido(ls));
