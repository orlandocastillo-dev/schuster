import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { enlaceCorreo, enlaceWhatsApp, tienda } from "../datos";
import { Icono, IconoWhatsApp } from "./Iconos";

const TEMAS = ["Comprar ropa", "Prendas personalizadas", "Pedido para empresa, colegio o equipo", "Ya tengo mi diseño", "Otro"];

type Estado = "llenando" | "enviando" | "enviado" | "correo" | "error";

/** Formulario para dejar los datos. Si hay un servicio de formularios configurado lo envía directo; si no, arma el correo. */
export function Contacto({ titulo = true }: { titulo?: boolean }) {
  const [datos, setDatos] = useState({ nombre: "", correo: "", celular: "", tema: TEMAS[0], mensaje: "", acepto: false });
  const [estado, setEstado] = useState<Estado>("llenando");
  const [falta, setFalta] = useState("");
  const campo = (k: keyof typeof datos) => (e: { target: { value: string } }) => setDatos((d) => ({ ...d, [k]: e.target.value }));

  const texto = [
    `Nombre: ${datos.nombre}`,
    `Correo: ${datos.correo}`,
    datos.celular && `Celular: ${datos.celular}`,
    `Tema: ${datos.tema}`,
    "",
    datos.mensaje,
  ]
    .filter((x) => x !== "")
    .join("\n");

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!datos.nombre.trim() || !datos.correo.trim() || !datos.mensaje.trim()) return setFalta("Completa tu nombre, tu correo y el mensaje.");
    if (!/^\S+@\S+\.\S+$/.test(datos.correo)) return setFalta("Revisa tu correo, parece que le falta algo.");
    if (!datos.acepto) return setFalta("Para escribirte necesitamos que aceptes la política de tratamiento de datos.");
    setFalta("");
    if (tienda.formulario) {
      setEstado("enviando");
      try {
        const r = await fetch(tienda.formulario, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...datos, _subject: `Contacto desde la web: ${datos.tema}` }),
        });
        setEstado(r.ok ? "enviado" : "error");
      } catch {
        setEstado("error");
      }
      return;
    }
    // Sin servicio de formularios: se abre el correo de quien escribe con todo listo
    window.location.href = enlaceCorreo(`Contacto desde la web: ${datos.tema}`, texto);
    setEstado("correo");
  }

  if (estado === "enviado") {
    return (
      <div className="contacto contacto--listo" role="status">
        <Icono nombre="check" className="contacto__check" />
        <h3>¡Gracias, {datos.nombre.split(" ")[0]}!</h3>
        <p>Recibimos tus datos. Te escribimos pronto a {datos.correo}.</p>
      </div>
    );
  }

  return (
    <form className="contacto" onSubmit={enviar} noValidate>
      {titulo && (
        <div className="contacto__cabeza">
          <p className="sobretitulo">Contacto</p>
          <h2 className="titular">¿Quieres saber más?</h2>
          <p>Déjanos tus datos y te escribimos. Cotizaciones, pedidos para empresas, colegios o equipos, o cualquier pregunta.</p>
        </div>
      )}
      <div className="contacto__campos">
        <label className="campo">
          <span>Nombre</span>
          <input type="text" autoComplete="name" required value={datos.nombre} onChange={campo("nombre")} />
        </label>
        <label className="campo">
          <span>Correo electrónico</span>
          <input type="email" autoComplete="email" required value={datos.correo} onChange={campo("correo")} />
        </label>
        <label className="campo">
          <span>
            Celular <small>(opcional)</small>
          </span>
          <input type="tel" autoComplete="tel" inputMode="tel" value={datos.celular} onChange={campo("celular")} />
        </label>
        <label className="campo">
          <span>¿Qué te interesa?</span>
          <select value={datos.tema} onChange={campo("tema")}>
            {TEMAS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="campo campo--ancho">
          <span>Mensaje</span>
          <textarea rows={4} required value={datos.mensaje} onChange={campo("mensaje")} placeholder="Cuéntanos qué necesitas: prenda, cantidad, colores, para cuándo…" />
        </label>
        <label className="casilla campo--ancho">
          <input type="checkbox" checked={datos.acepto} onChange={(e) => setDatos((d) => ({ ...d, acepto: e.target.checked }))} />
          <span>
            Acepto la <Link to="/privacidad">política de tratamiento de datos personales</Link>.
          </span>
        </label>
      </div>
      {falta && (
        <p className="error" role="alert">
          {falta}
        </p>
      )}
      {estado === "error" && (
        <p className="error" role="alert">
          No pudimos enviar el formulario. Inténtalo otra vez o escríbenos por WhatsApp.
        </p>
      )}
      {estado === "correo" && (
        <p className="contacto__nota" role="status">
          Se abrió tu correo con el mensaje listo: solo dale enviar.{tienda.correo ? ` Si no se abrió, escríbenos a ${tienda.correo}.` : ""}
        </p>
      )}
      <div className="contacto__botones">
        <button type="submit" className="boton" disabled={estado === "enviando"}>
          <span>{estado === "enviando" ? "Enviando…" : "Enviar"}</span>
        </button>
        <a className="boton boton--wa-borde" href={enlaceWhatsApp(`Hola, Schuster.\n\n${texto}`)} target="_blank" rel="noreferrer">
          <IconoWhatsApp className="icono" />
          <span>Mejor por WhatsApp</span>
        </a>
      </div>
      {tienda.correo && <p className="contacto__nota">También nos encuentras en {tienda.correo}</p>}
    </form>
  );
}
