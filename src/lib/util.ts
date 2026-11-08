import { useEffect, useRef, type RefObject } from "react";
import { tienda } from "../datos";

export const sinMovimiento = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Título y descripción de cada página, para el navegador y para Google. */
export function useTitulo(titulo: string, descripcion?: string) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | ${tienda.nombre}` : `${tienda.nombre} | ${tienda.lema}`;
    if (descripcion) document.querySelector('meta[name="description"]')?.setAttribute("content", descripcion);
  }, [titulo, descripcion]);
}

let bloqueos = 0;
export function useBloquearScroll(activo: boolean) {
  useEffect(() => {
    if (!activo) return;
    bloqueos++;
    const ancho = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--barra", `${ancho}px`);
    document.documentElement.classList.add("sin-scroll");
    return () => {
      bloqueos--;
      if (!bloqueos) document.documentElement.classList.remove("sin-scroll");
    };
  }, [activo]);
}

const ENFOCABLES = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

/** Mantiene el foco dentro de un cajón o ventana mientras está abierto, y lo devuelve al cerrar. */
export function useAtraparFoco(ref: RefObject<HTMLElement | null>, activo: boolean, alCerrar: () => void) {
  const cerrar = useRef(alCerrar);
  cerrar.current = alCerrar;
  useEffect(() => {
    if (!activo || !ref.current) return;
    const antes = document.activeElement as HTMLElement | null;
    const caja = ref.current;
    const primero = caja.querySelector<HTMLElement>("[data-foco-inicial]") ?? caja.querySelector<HTMLElement>(ENFOCABLES);
    requestAnimationFrame(() => primero?.focus({ preventScroll: true }));
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        cerrar.current();
      }
      if (e.key !== "Tab") return;
      const lista = [...caja.querySelectorAll<HTMLElement>(ENFOCABLES)].filter((el) => el.offsetParent !== null);
      if (!lista.length) return;
      const [a, z] = [lista[0], lista[lista.length - 1]];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    caja.addEventListener("keydown", tecla);
    return () => {
      caja.removeEventListener("keydown", tecla);
      antes?.focus?.({ preventScroll: true });
    };
  }, [activo, ref]);
}

/** Todo lo que tenga data-revelar aparece cuando entra en pantalla. */
export function useRevelar() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.visible = "";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const vigilar = (raiz: ParentNode) => raiz.querySelectorAll<HTMLElement>("[data-revelar]:not([data-visible])").forEach((el) => io.observe(el));
    vigilar(document);
    const mo = new MutationObserver(() => vigilar(document));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

/** Una copia de la foto vuela en curva hasta el botón de la bolsa. */
export function volarABolsa(origen: Element | null) {
  const destino = document.getElementById("boton-bolsa");
  if (!origen || !destino || sinMovimiento()) return;
  const a = origen.getBoundingClientRect();
  const b = destino.getBoundingClientRect();
  const copia = origen.cloneNode(true) as HTMLElement;
  Object.assign(copia.style, {
    position: "fixed",
    left: `${a.left}px`,
    top: `${a.top}px`,
    width: `${a.width}px`,
    height: `${a.height}px`,
    margin: "0",
    zIndex: "90",
    pointerEvents: "none",
    borderRadius: "4px",
    overflow: "hidden",
  });
  copia.setAttribute("aria-hidden", "true");
  document.body.appendChild(copia);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const escala = Math.max(0.06, 28 / a.width);
  copia
    .animate(
      [
        { transform: "translate(0,0) scale(1) rotate(0)", opacity: 1 },
        { transform: `translate(${dx * 0.45}px, ${dy * 0.2 - 90}px) scale(${0.5}) rotate(-8deg)`, opacity: 1, offset: 0.45 },
        { transform: `translate(${dx}px, ${dy}px) scale(${escala}) rotate(6deg)`, opacity: 0.2 },
      ],
      { duration: 820, easing: "cubic-bezier(.55,0,.2,1)" },
    )
    .finished.then(() => {
      copia.remove();
      destino.animate([{ transform: "scale(1)" }, { transform: "scale(1.28)" }, { transform: "scale(1)" }], { duration: 380, easing: "ease-out" });
    });
}

/**
 * La animación entre páginas solo en computador y con la página abierta directamente.
 * En celulares y dentro de un marco (la vista previa de Claude) algunos navegadores se quedan pegados en ella.
 */
export const conTransicion =
  typeof window !== "undefined" && window.self === window.top && matchMedia("(hover: hover) and (pointer: fine)").matches && !sinMovimiento();
