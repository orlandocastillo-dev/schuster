import { Link } from "react-router-dom";
import { GuiaTallas } from "../componentes/GuiaTallas";
import { useTitulo } from "../lib/util";

export default function GuiaTallasPagina() {
  useTitulo("Guía de tallas", "Tallas de Schuster para adulto, dama, niños, pantalonetas, pijamas, sudaderas y chaquetas.");
  return (
    <div className="pagina-texto">
      <nav aria-label="Ruta" className="migas">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Guía de tallas</span>
      </nav>
      <h1 className="titular titular--seccion">Guía de tallas</h1>
      <p className="seccion__frase">Cada tipo de prenda tiene su propia tabla. Si tienes dudas, escríbenos por WhatsApp y te ayudamos a escoger.</p>
      <GuiaTallas />
    </div>
  );
}
