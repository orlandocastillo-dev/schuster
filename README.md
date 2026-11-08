# Schuster

Tienda web de Schuster, marca de ropa de REG Marketing en Barranquilla. Ropa para hombre, dama y niños, accesorios y prendas personalizadas desde una unidad. No tiene pasarela de pago: la bolsa arma el pedido y lo manda por WhatsApp a la tienda.

## Lo que se cambia sin tocar código

Todo está en la carpeta `contenido/`:

- **`tienda.json`**: número de WhatsApp, correo, Instagram, dirección, razón social y NIT (salen en las páginas legales), los mensajes de la cinta de arriba y `muestraDeDiseno` (mientras esté en `true` se ve la etiqueta "Muestra de diseño" y la nota de precios de ejemplo).
- **`productos.json`**: cada producto con su nombre, sección (`hombre`, `dama`, `infantil`, `accesorios`), tipo, precio, colores, grupo de tallas, si es nuevo y la fecha de llegada (con esa se ordena "Lo más nuevo"). Arriba está la lista de colores con su código, para que todos los productos usen el mismo tono.
- **`tallas.json`**: las tallas de cada grupo y las medidas de la guía.
- **`personaliza.json`**: las prendas del personalizador, sus precios, el valor del estampado por lado y las tintas.

El número de WhatsApp va con indicativo y sin espacios, por ejemplo `"573001234567"`. Mientras esté vacío, el botón abre WhatsApp para que la persona escoja a quién enviarlo.

**Formulario de contacto.** La página no tiene servidor, así que el formulario abre el correo de quien escribe con el mensaje listo para la tienda. Si quieren que llegue solo, sin que la persona tenga que darle enviar, creen un formulario gratis en un servicio como Formspree y pongan la dirección que les da en `formulario` dentro de `tienda.json`.

**Páginas legales.** Términos, datos personales, cookies, cambios y devoluciones y compra segura están en `src/paginas/Legal.tsx`. Explican cómo funciona la tienda y citan la ley colombiana que aplica. El NIT, el correo y el WhatsApp salen solos cuando se ponen en `tienda.json`.

Las fotos van en `fotos/`, las instrucciones están en [`fotos/LEEME.md`](fotos/LEEME.md).

Después de cualquier cambio se sube a GitHub y Vercel publica solo.

## Cómo está hecha

Vite, React y TypeScript, con React Router. Es un sitio estático: no necesita servidor ni base de datos. La bolsa se guarda en el navegador.

- `src/paginas`: inicio, secciones con filtros, producto, personaliza, guía de tallas y 404.
- `src/componentes`: encabezado, bolsa, galería, tarjeta de producto, entrada animada y demás piezas.
- `src/marca`: el logo en vectores, sacado del PDF original de la marca.
- `src/prendas`: los dibujos de las prendas que se usan mientras llegan las fotos.

Las animaciones son de CSS y respetan la opción de reducir el movimiento del sistema.

```bash
npm install
npm run dev
npm run build
```

## Pendiente de la cliente

- Número de WhatsApp y correo de la tienda.
- NIT.
- Fotos reales de los productos.
- Precios reales (los de ahora son de ejemplo) y medidas reales de la guía de tallas.
