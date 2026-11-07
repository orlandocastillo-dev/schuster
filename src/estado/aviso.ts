import { useSyncExternalStore } from "react";

// Un mensaje corto abajo de la pantalla ("Agregado a la bolsa"), que también leen los lectores de pantalla
let actual: { texto: string; n: number } | null = null;
let reloj: ReturnType<typeof setTimeout> | undefined;
const oyentes = new Set<() => void>();

export function avisar(texto: string) {
  actual = { texto, n: (actual?.n ?? 0) + 1 };
  oyentes.forEach((o) => o());
  clearTimeout(reloj);
  reloj = setTimeout(() => {
    actual = null;
    oyentes.forEach((o) => o());
  }, 3200);
}

export const useAviso = () =>
  useSyncExternalStore(
    (o) => {
      oyentes.add(o);
      return () => oyentes.delete(o);
    },
    () => actual,
  );
