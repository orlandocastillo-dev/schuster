import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { deSeccion, porNovedad, SECCIONES, tienda, type Seccion } from "../datos";
import { bolsa, unidades, useBolsa } from "../estado/bolsa";
import { useAtraparFoco, useBloquearScroll } from "../lib/util";
import { Logo } from "../marca/Logo";
import { FotoProducto } from "./FotoProducto";
import { Icono, IconoInstagram, IconoWhatsApp } from "./Iconos";
import { enlaceWhatsApp } from "../datos";

function Anuncios() {
  const [i, setI] = useState(0);
  const [pausa, setPausa] = useState(false);
  const lista = tienda.anuncios;
  useEffect(() => {
    if (pausa || lista.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % lista.length), 4200);
    return () => clearInterval(t);
  }, [pausa, lista.length]);
  return (
    <div className="anuncios" role="region" aria-label="Anuncios" onMouseEnter={() => setPausa(true)} onMouseLeave={() => setPausa(false)}>
      <p key={i} className="anuncios__texto">
        {lista[i]}
      </p>
    </div>
  );
}

const tiposDe = (s: Seccion) => [...new Set(deSeccion(s).map((p) => p.tipo))];

function Panel({ seccion, cerrar }: { seccion: Seccion; cerrar: () => void }) {
  const info = SECCIONES.find((s) => s.id === seccion)!;
  const destacado = [...deSeccion(seccion)].sort(porNovedad).slice(0, 2);
  return (
    <div className="panel-menu" id={`panel-${seccion}`}>
      <div className="panel-menu__dentro">
        <div className="panel-menu__col">
          <p className="sobretitulo">{info.nombre}</p>
          <ul className="panel-menu__tipos">
            {tiposDe(seccion).map((t, i) => (
              <li key={t} style={{ ["--i" as string]: i }}>
                <Link to={`/${seccion}?tipo=${encodeURIComponent(t)}`} onClick={cerrar}>
                  {t}
                </Link>
              </li>
            ))}
          </ul>
          <Link className="enlace-flecha" to={`/${seccion}`} onClick={cerrar}>
            Ver todo {info.nombre.toLowerCase()} <Icono nombre="flecha" />
          </Link>
        </div>
        {destacado.map((p) => (
          <Link key={p.id} to={`/producto/${p.id}`} className="panel-menu__destacado" onClick={cerrar}>
            <div className="panel-menu__foto">
              <FotoProducto producto={p} color={p.colores[0]} n={1} />
            </div>
            <span>{p.nombre}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MenuMovil({ abierto, cerrar }: { abierto: boolean; cerrar: () => void }) {
  const caja = useRef<HTMLDivElement>(null);
  useBloquearScroll(abierto);
  useAtraparFoco(caja, abierto, cerrar);
  return (
    <div className={`menu-movil${abierto ? " menu-movil--abierto" : ""}`} ref={caja} id="menu-movil" role="dialog" aria-modal="true" aria-label="Menú" inert={!abierto} aria-hidden={!abierto}>
      <div className="menu-movil__cabeza">
        <Logo className="menu-movil__logo" />
        <button type="button" className="boton-icono" onClick={cerrar} aria-label="Cerrar el menú" data-foco-inicial>
          <Icono nombre="cerrar" />
        </button>
      </div>
      <nav aria-label="Secciones">
        <ul className="menu-movil__lista">
          {SECCIONES.map((s, i) => (
            <li key={s.id} style={{ ["--i" as string]: i }}>
              <NavLink to={`/${s.id}`} onClick={cerrar}>
                {s.nombre}
              </NavLink>
            </li>
          ))}
          <li style={{ ["--i" as string]: 4 }}>
            <NavLink to="/personaliza" onClick={cerrar} className="rojo">
              Personaliza
            </NavLink>
          </li>
        </ul>
        <ul className="menu-movil__otros" style={{ ["--i" as string]: 5 }}>
          <li>
            <Link to="/tienda" onClick={cerrar}>
              Toda la tienda
            </Link>
          </li>
          <li>
            <Link to="/guia-de-tallas" onClick={cerrar}>
              Guía de tallas
            </Link>
          </li>
          <li>
            <Link to="/#visitanos" onClick={cerrar}>
              Tienda física
            </Link>
          </li>
        </ul>
      </nav>
      <div className="menu-movil__pie" style={{ ["--i" as string]: 6 }}>
        <a href={`https://instagram.com/${tienda.instagram}`} target="_blank" rel="noreferrer">
          <IconoInstagram /> @{tienda.instagram}
        </a>
        <a href={enlaceWhatsApp("Hola, Schuster.")} target="_blank" rel="noreferrer">
          <IconoWhatsApp className="icono" /> WhatsApp
        </a>
      </div>
    </div>
  );
}

export function Encabezado() {
  const { pathname } = useLocation();
  const lineas = useBolsa();
  const n = unidades(lineas);
  const [arriba, setArriba] = useState(true);
  const [panel, setPanel] = useState<Seccion | null>(null);
  const [menu, setMenu] = useState(false);
  const enInicio = pathname === "/";

  useEffect(() => {
    const ver = () => setArriba(window.scrollY < 24);
    ver();
    addEventListener("scroll", ver, { passive: true });
    return () => removeEventListener("scroll", ver);
  }, []);

  useEffect(() => {
    setPanel(null);
    setMenu(false);
  }, [pathname]);

  const transparente = enInicio && arriba && !panel;

  return (
    <>
      <Anuncios />
      <header className="encabezado" data-transparente={transparente || undefined} data-compacto={!arriba || undefined} onMouseLeave={() => setPanel(null)}>
        <div className="encabezado__fila">
          <div className="encabezado__izq">
            <button type="button" className="boton-icono encabezado__menu" aria-label="Abrir el menú" aria-expanded={menu} aria-controls="menu-movil" onClick={() => setMenu(true)}>
              <Icono nombre="menu" />
            </button>
            <nav className="nav" aria-label="Principal">
              <ul>
                {SECCIONES.map((s) => (
                  <li key={s.id} onMouseEnter={() => setPanel(s.id)}>
                    <NavLink to={`/${s.id}`} className="nav__enlace" viewTransition>
                      {s.nombre}
                    </NavLink>
                    <button
                      type="button"
                      className="nav__abrir"
                      aria-label={`Ver tipos de prenda de ${s.nombre}`}
                      aria-expanded={panel === s.id}
                      aria-controls={`panel-${s.id}`}
                      onClick={() => setPanel(panel === s.id ? null : s.id)}
                    >
                      <Icono nombre="abajo" />
                    </button>
                  </li>
                ))}
                <li onMouseEnter={() => setPanel(null)}>
                  <NavLink to="/personaliza" className="nav__enlace nav__enlace--rojo" viewTransition>
                    Personaliza
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          <Link to="/" className="encabezado__logo" aria-label={`${tienda.nombre}, ir al inicio`} viewTransition>
            <Logo />
          </Link>

          <div className="encabezado__der">
            {tienda.muestraDeDiseno && (
              <span className="muestra-diseno">
                Muestra<span className="muestra-diseno__mas"> de diseño</span>
              </span>
            )}
            <a className="boton-icono solo-escritorio" href={`https://instagram.com/${tienda.instagram}`} target="_blank" rel="noreferrer" aria-label="Instagram de Schuster">
              <IconoInstagram />
            </a>
            <button type="button" id="boton-bolsa" className="boton-icono bolsa-boton" onClick={() => bolsa.abrir()} aria-label={`Abrir la bolsa, ${n} ${n === 1 ? "producto" : "productos"}`}>
              <Icono nombre="bolsa" />
              {n > 0 && (
                <span key={n} className="bolsa-boton__n" aria-hidden="true">
                  {n}
                </span>
              )}
            </button>
          </div>
        </div>
        {panel && <Panel seccion={panel} cerrar={() => setPanel(null)} />}
      </header>
      <MenuMovil abierto={menu} cerrar={() => setMenu(false)} />
    </>
  );
}
