import { Link } from "react-router-dom";
import { useTitulo } from "../lib/util";
import { Leon } from "../marca/Logo";

export default function NoEncontrada() {
  useTitulo("Página no encontrada");
  return (
    <section className="no-encontrada">
      <Leon className="no-encontrada__leon" />
      <p className="sobretitulo">Error 404</p>
      <h1 className="titular titular--seccion">Se nos perdió esta página</h1>
      <p>Puede que el enlace esté mal escrito o que el producto ya no esté. Mira lo que sí tenemos.</p>
      <div className="no-encontrada__botones">
        <Link to="/tienda" className="boton">
          <span>Ver la tienda</span>
        </Link>
        <Link to="/" className="boton boton--borde">
          <span>Ir al inicio</span>
        </Link>
      </div>
    </section>
  );
}
