import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, createMemoryRouter, RouterProvider } from "react-router-dom";
import { Marco } from "./componentes/Marco";
import Inicio from "./paginas/Inicio";
import Seccion from "./paginas/Seccion";
import NoEncontrada from "./paginas/NoEncontrada";
import Pronto from "./paginas/Pronto";
import { tiene } from "./avance";
import "./estilos.css";

// Las páginas más pesadas se cargan solo cuando alguien entra a ellas
const Producto = lazy(() => import("./paginas/Producto"));
const Personaliza = lazy(() => import("./paginas/Personaliza"));
const GuiaTallasPagina = lazy(() => import("./paginas/GuiaTallasPagina"));
const Legal = lazy(() => import("./paginas/Legal"));
const ContactoPagina = lazy(() => import("./paginas/ContactoPagina"));

const esperar = (el: React.ReactNode) => <Suspense fallback={<div className="cargando" aria-label="Cargando" />}>{el}</Suspense>;

const rutas = [
  {
    element: <Marco />,
    children: [
      { path: "/", element: <Inicio /> },
      { path: "/tienda", element: <Seccion key="todo" /> },
      { path: "/hombre", element: <Seccion key="hombre" seccion="hombre" /> },
      { path: "/dama", element: <Seccion key="dama" seccion="dama" /> },
      { path: "/infantil", element: <Seccion key="infantil" seccion="infantil" /> },
      { path: "/accesorios", element: <Seccion key="accesorios" seccion="accesorios" /> },
      { path: "/producto/:id", element: esperar(<Producto />) },
      { path: "/personaliza", element: tiene("personaliza") ? esperar(<Personaliza />) : <Pronto titulo="Personaliza" /> },
      { path: "/guia-de-tallas", element: tiene("guia") ? esperar(<GuiaTallasPagina />) : <Pronto titulo="Guía de tallas" /> },
      { path: "/contacto", element: tiene("contacto") ? esperar(<ContactoPagina />) : <Pronto titulo="Contacto" /> },
      { path: "/terminos", element: tiene("legales") ? esperar(<Legal />) : <Pronto titulo="Información legal" /> },
      { path: "/privacidad", element: tiene("legales") ? esperar(<Legal />) : <Pronto titulo="Información legal" /> },
      { path: "/cookies", element: tiene("legales") ? esperar(<Legal />) : <Pronto titulo="Información legal" /> },
      { path: "/cambios-y-devoluciones", element: tiene("legales") ? esperar(<Legal />) : <Pronto titulo="Información legal" /> },
      { path: "/compra-segura", element: tiene("legales") ? esperar(<Legal />) : <Pronto titulo="Información legal" /> },
      { path: "*", element: <NoEncontrada /> },
    ],
  },
];

// En la vista previa de Claude la página vive dentro de un marco y no puede usar la barra de direcciones
const router = import.meta.env.VITE_ARTEFACTO ? createMemoryRouter(rutas) : createBrowserRouter(rutas);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
