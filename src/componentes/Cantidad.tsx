import { useEffect, useState } from "react";
import { Icono } from "./Iconos";

interface Props {
  valor: number;
  cambiar: (n: number) => void;
  etiqueta?: string;
  chica?: boolean;
  /** En la bolsa, bajar de 1 quita el producto. */
  minimo?: number;
}

export const MAXIMO = 9999;

/** Botones de más y menos, y en el medio se puede escribir el número directo (pedidos grandes). */
export function Cantidad({ valor, cambiar, etiqueta = "Cantidad", chica, minimo = 1 }: Props) {
  const [texto, setTexto] = useState(String(valor));
  useEffect(() => setTexto(String(valor)), [valor]);

  function confirmar() {
    const n = parseInt(texto, 10);
    if (Number.isNaN(n) || n < 1) setTexto(String(valor));
    else cambiar(Math.min(MAXIMO, n));
  }

  return (
    <div className={`cantidad${chica ? " cantidad--chica" : ""}`} role="group" aria-label={etiqueta}>
      <button type="button" onClick={() => cambiar(Math.max(minimo - 1, valor - 1))} aria-label="Quitar una unidad" disabled={valor <= minimo}>
        <Icono nombre="menos" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={etiqueta}
        value={texto}
        size={Math.max(2, texto.length)}
        onChange={(e) => setTexto(e.target.value.replace(/\D/g, "").slice(0, 4))}
        onBlur={confirmar}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        onFocus={(e) => e.target.select()}
      />
      <button type="button" onClick={() => cambiar(Math.min(MAXIMO, valor + 1))} aria-label="Agregar una unidad" disabled={valor >= MAXIMO}>
        <Icono nombre="mas" />
      </button>
    </div>
  );
}
