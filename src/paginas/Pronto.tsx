import { Link } from "react-router-dom";
import { Volver } from "../componentes/Volver";
import { useTitulo } from "../lib/util";
import { Leon } from "../marca/Logo";

/** Lo que todavía se está construyendo. */
export default function Pronto({ titulo }: { titulo: string }) {
  useTitulo(titulo);
  return (
    <section className="no-encontrada">
      <div className="fila-volver">
        <Volver />
      </div>
      <Leon className="no-encontrada__leon" />
      <p className="sobretitulo">Próximamente</p>
      <h1 className="titular titular--seccion">{titulo}</h1>
      <p>Estamos terminando esta parte de la tienda. Muy pronto vas a poder usarla.</p>
      <div className="no-encontrada__botones">
        <Link to="/tienda" className="boton">
          <span>Ver la tienda</span>
        </Link>
      </div>
    </section>
  );
}
