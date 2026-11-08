import { Link } from "react-router-dom";
import { Contacto } from "../componentes/Contacto";
import { Volver } from "../componentes/Volver";
import { useTitulo } from "../lib/util";

export default function ContactoPagina() {
  useTitulo("Contacto", "Escríbele a Schuster: cotizaciones, pedidos para empresas, colegios o equipos y preguntas.");
  return (
    <div className="pagina-texto">
      <div className="fila-volver">
        <Volver />
        <nav aria-label="Ruta" className="migas">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Contacto</span>
        </nav>
      </div>
      <h1 className="titular titular--seccion">Contacto</h1>
      <p className="seccion__frase">Déjanos tus datos y te escribimos. Cotizaciones, pedidos para empresas, colegios o equipos, o cualquier pregunta.</p>
      <Contacto titulo={false} />
    </div>
  );
}
