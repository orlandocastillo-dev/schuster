// Para mostrarle a la cliente la tienda por partes. Se compila con VITE_AVANCE=1, 2 o 3;
// sin ese valor sale todo. Cada función aparece desde el avance que dice aquí.
const DESDE = {
  bolsa: 2,
  filtros: 2,
  guia: 2,
  comoPedir: 2,
  personaliza: 3,
  contacto: 3,
  legales: 4,
  cookies: 4,
};

export const AVANCE = Number(import.meta.env.VITE_AVANCE) || 4;
export const tiene = (funcion: keyof typeof DESDE) => AVANCE >= DESDE[funcion];
