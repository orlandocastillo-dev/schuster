import { Link, useLocation } from "react-router-dom";
import { numeroWhatsApp, tienda } from "../datos";
import { Volver } from "../componentes/Volver";
import { useTitulo } from "../lib/util";

// Lo que la tienda todavía no ha enviado se muestra entre corchetes para que se note
const o = (valor: string, falta: string) => valor || `[${falta}]`;

const empresa = o(tienda.razonSocial, "razón social");
const nit = o(tienda.nit, "NIT por confirmar");
const correo = o(tienda.correo, "correo por confirmar");
const whatsapp = numeroWhatsApp() ? `+${numeroWhatsApp()}` : "[WhatsApp por confirmar]";
const direccion = `${tienda.direccion}, ${tienda.ciudad}, Colombia`;

interface Documento {
  titulo: string;
  intro: string;
  secciones: { t: string; p: string[] }[];
}

export const DOCUMENTOS: Record<string, Documento> = {
  terminos: {
    titulo: "Términos y condiciones",
    intro: `Estas son las reglas para usar la página de ${tienda.nombre} y hacer pedidos. Al usar la página aceptas estos términos.`,
    secciones: [
      {
        t: "Quiénes somos",
        p: [`${tienda.nombre} es una marca de ${empresa}, NIT ${nit}, con tienda en ${direccion}. Puedes escribirnos al correo ${correo} o al WhatsApp ${whatsapp}.`],
      },
      {
        t: "Cómo funciona un pedido",
        p: [
          "La página es un catálogo. Escoges los productos, los agregas a la bolsa y envías el pedido por WhatsApp. En la página no se hacen pagos.",
          "El pedido queda confirmado cuando te respondemos por WhatsApp con la disponibilidad, el valor total, la forma de pago y la entrega, y tú aceptas. Antes de esa confirmación no hay una compra cerrada.",
        ],
      },
      {
        t: "Precios y productos",
        p: [
          "Los precios están en pesos colombianos e incluyen los impuestos que apliquen. Pueden cambiar sin aviso; el valor que vale es el que te confirmamos por WhatsApp.",
          "Las fotos son de referencia. Los colores pueden verse un poco distintos según la pantalla de cada dispositivo.",
        ],
      },
      {
        t: "Pagos",
        p: ["La forma de pago se acuerda en el chat de WhatsApp o en la tienda. Nunca te pediremos datos de tarjetas ni claves por la página ni por chat."],
      },
      {
        t: "Entregas",
        p: ["El tiempo y el costo del envío se acuerdan en cada pedido según la ciudad o el barrio. También puedes recoger tu pedido en la tienda."],
      },
      {
        t: "Prendas personalizadas",
        p: [
          "Antes de producir te mostramos cómo va a quedar el diseño y solo lo hacemos cuando lo apruebas.",
          "Si nos envías un logo, una imagen o un texto, nos confirmas que tienes derecho a usarlo. No estampamos contenido que viole derechos de otras personas o marcas, ni contenido ofensivo.",
        ],
      },
      {
        t: "Cambios, devoluciones y garantía",
        p: ["Están explicados en la página de cambios y devoluciones."],
      },
      {
        t: "Propiedad intelectual",
        p: [`La marca ${tienda.nombre}, el logo del león y los diseños de esta página pertenecen a ${empresa}. No se pueden usar sin autorización.`],
      },
      {
        t: "Ley aplicable",
        p: ["Estos términos se rigen por las leyes de Colombia, en especial la Ley 1480 de 2011 (Estatuto del Consumidor) y la Ley 527 de 1999 (comercio electrónico)."],
      },
    ],
  },
  privacidad: {
    titulo: "Tratamiento de datos personales",
    intro: "Así cuidamos los datos que nos compartes, según la Ley 1581 de 2012 y el Decreto 1377 de 2013 (hoy en el Decreto 1074 de 2015).",
    secciones: [
      {
        t: "Responsable",
        p: [`${empresa}, NIT ${nit}, ${direccion}. Correo: ${correo}. WhatsApp: ${whatsapp}.`],
      },
      {
        t: "Qué datos recogemos",
        p: ["Tu nombre, correo, celular, dirección de entrega, lo que nos escribes y los diseños o logos que nos envías para personalizar una prenda."],
      },
      {
        t: "Para qué los usamos",
        p: [
          "Para responder tus preguntas, hacerte cotizaciones, gestionar tus pedidos y entregas, y atender cambios o garantías.",
          "Solo te enviaremos novedades o promociones si nos das tu permiso, y puedes pedir que dejemos de hacerlo cuando quieras.",
        ],
      },
      {
        t: "Con quién los compartimos",
        p: ["No vendemos ni alquilamos tus datos. Solo los compartimos con la empresa de envíos cuando hace falta para entregarte un pedido."],
      },
      {
        t: "Tus derechos",
        p: [
          "Puedes conocer, actualizar y corregir tus datos; pedir prueba de la autorización que nos diste; saber cómo los usamos; revocar la autorización o pedir que los borremos cuando no haya una obligación legal de conservarlos; acceder a ellos gratis; y presentar quejas ante la Superintendencia de Industria y Comercio.",
        ],
      },
      {
        t: "Cómo ejercerlos",
        p: [`Escríbenos a ${correo} o al WhatsApp ${whatsapp}. Respondemos las consultas en máximo 10 días hábiles y los reclamos en máximo 15 días hábiles, como dice la ley.`],
      },
      {
        t: "La página",
        p: ["La página no guarda tus datos en un servidor: lo que escribes en el formulario o en el pedido nos llega por correo o por WhatsApp. Tu bolsa se guarda solo en tu navegador."],
      },
      {
        t: "Vigencia",
        p: ["Esta política aplica desde su publicación. Si la cambiamos, publicaremos aquí la versión nueva."],
      },
    ],
  },
  cookies: {
    titulo: "Política de cookies",
    intro: "Las cookies y el almacenamiento del navegador son pequeños archivos que una página guarda en tu dispositivo. Esto es lo que usamos y para qué.",
    secciones: [
      {
        t: "Lo que usamos nosotros",
        p: [
          "Usamos el almacenamiento de tu navegador solo para que la página funcione: guardar los productos de tu bolsa, recordar que ya viste el aviso de cookies y no repetirte la animación de entrada en la misma visita.",
          "No usamos cookies de publicidad ni de seguimiento.",
        ],
      },
      {
        t: "Servicios de terceros",
        p: ["El mapa de la tienda es de Google Maps, que puede usar sus propias cookies según la política de Google. Las tipografías se cargan desde Google Fonts."],
      },
      {
        t: "Cómo borrarlas",
        p: ["Puedes borrar las cookies y los datos de esta página desde la configuración de tu navegador. Si lo haces, se vacía tu bolsa."],
      },
    ],
  },
  "cambios-y-devoluciones": {
    titulo: "Cambios, devoluciones y garantía",
    intro: "Queremos que quedes feliz con tu compra. Esto es lo que puedes hacer si algo no salió como esperabas.",
    secciones: [
      {
        t: "Cambios por talla o color",
        p: ["Puedes cambiar una prenda por otra talla o color dentro de los [número de días por definir] días siguientes a la entrega, con la prenda sin usar, sin lavar y con sus etiquetas. El envío del cambio [condiciones por definir]."],
      },
      {
        t: "Derecho de retracto",
        p: [
          "Como el pedido se hace a distancia, tienes derecho a retractarte de la compra dentro de los 5 días hábiles siguientes a la entrega (artículo 47 de la Ley 1480 de 2011). Devuelves el producto en el mismo estado en que lo recibiste y el costo de transporte de la devolución corre por tu cuenta. Te devolvemos el dinero en máximo 30 días calendario.",
          "El retracto no aplica a las prendas hechas o personalizadas según tus especificaciones, como las que llevan tu nombre, tu número o tu logo.",
        ],
      },
      {
        t: "Garantía",
        p: [
          "Todos los productos tienen la garantía legal de calidad que exige la ley. Si una prenda tiene un defecto de fabricación o de estampado, la reparamos, la cambiamos o te devolvemos el dinero.",
          "Las prendas personalizadas también tienen garantía por defectos de fabricación o de estampado, pero no tienen cambio por talla o por gusto una vez aprobaste el diseño.",
        ],
      },
      {
        t: "Cómo pedir un cambio o una garantía",
        p: [`Escríbenos al WhatsApp ${whatsapp} o al correo ${correo} con tu nombre, qué compraste, cuándo lo recibiste y fotos de la prenda. También puedes acercarte a la tienda: ${direccion}.`],
      },
    ],
  },
  "compra-segura": {
    titulo: "Compra segura",
    intro: "Comprar por WhatsApp es fácil, y queremos que también sea seguro.",
    secciones: [
      {
        t: "Nunca te pedimos datos de tarjetas",
        p: ["En la página no se hacen pagos y nunca te pediremos números de tarjeta, claves ni códigos por chat."],
      },
      {
        t: "Nuestros canales oficiales",
        p: [`WhatsApp ${whatsapp}, Instagram @${tienda.instagram}, correo ${correo} y la tienda en ${direccion}. Si alguien te escribe desde otro número diciendo que es ${tienda.nombre}, desconfía y escríbenos por un canal oficial.`],
      },
      {
        t: "Antes de pagar",
        p: ["Confirma en el chat oficial el valor total, la forma de pago y la entrega, y pide siempre tu comprobante."],
      },
      {
        t: "Tus datos",
        p: ["La página usa conexión segura (HTTPS). Lo que nos compartes lo tratamos según nuestra política de datos personales."],
      },
    ],
  },
};

export default function Legal() {
  const id = useLocation().pathname.slice(1);
  const doc = DOCUMENTOS[id] ?? DOCUMENTOS.terminos;
  useTitulo(doc.titulo, `${doc.titulo} de ${tienda.nombre}.`);
  return (
    <article className="pagina-texto legal">
      <div className="fila-volver">
        <Volver />
        <nav aria-label="Ruta" className="migas">
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{doc.titulo}</span>
        </nav>
      </div>
      <h1 className="titular titular--legal">{doc.titulo}</h1>
      {tienda.muestraDeDiseno && <p className="legal__borrador">Borrador: este texto es una base y debe revisarlo un abogado antes de publicar la tienda. Lo que está entre corchetes lo completa la tienda.</p>}
      <p className="seccion__frase">{doc.intro}</p>
      {doc.secciones.map((s) => (
        <section key={s.t}>
          <h2>{s.t}</h2>
          {s.p.map((x, i) => (
            <p key={i}>{x}</p>
          ))}
        </section>
      ))}
      <nav className="legal__otros" aria-label="Otras políticas">
        {Object.entries(DOCUMENTOS)
          .filter(([k]) => k !== id)
          .map(([k, d]) => (
            <Link key={k} to={`/${k}`}>
              {d.titulo}
            </Link>
          ))}
      </nav>
    </article>
  );
}
