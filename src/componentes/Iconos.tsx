const TRAZOS = {
  bolsa: "M5 8h14l-1.2 12H6.2L5 8zM9 8V6.5a3 3 0 016 0V8",
  menu: "M3 7h18M3 12h18M3 17h12",
  cerrar: "M6 6l12 12M18 6L6 18",
  flecha: "M4 12h15M13 6l6 6-6 6",
  atras: "M20 12H5M11 6l-6 6 6 6",
  izquierda: "M15 5l-7 7 7 7",
  derecha: "M9 5l7 7-7 7",
  abajo: "M5 9l7 7 7-7",
  mas: "M12 5v14M5 12h14",
  menos: "M5 12h14",
  filtro: "M4 6h16M7 12h10M10 18h4",
  regla: "M3 16l13-13 5 5-13 13zM7 12l2 2M10 9l2 2M13 6l2 2",
  pin: "M12 21s7-6.2 7-11.5a7 7 0 10-14 0C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  lupa: "M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4",
  arriba: "M12 19V5M6 11l6-6 6 6",
  subir: "M12 16V4M7 9l5-5 5 5M4 20h16",
  basura: "M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13",
  check: "M5 12l4.5 4.5L19 7",
  centrar: "M12 3v4M12 17v4M3 12h4M17 12h4M12 9a3 3 0 100 6 3 3 0 000-6z",
  correo: "M3 6h18v12H3zM3 7l9 6 9-6",
  girar: "M4 12a8 8 0 0114-5.3M20 4v5h-5M20 12a8 8 0 01-14 5.3M4 20v-5h5",
};

export type NombreIcono = keyof typeof TRAZOS;

export function Icono({ nombre, className }: { nombre: NombreIcono; className?: string }) {
  return (
    <svg className={`icono ${className ?? ""}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={TRAZOS[nombre]} />
    </svg>
  );
}

export function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.6c-2 0-4-.6-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1116 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 01-4.3-3.8c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5.1 2.1.9 3 1 4 .8.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4z"
      />
    </svg>
  );
}

export function IconoInstagram({ className }: { className?: string }) {
  return (
    <svg className={`icono ${className ?? ""}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
    </svg>
  );
}
