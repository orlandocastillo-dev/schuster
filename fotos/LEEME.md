# Fotos de los productos

Mientras no haya fotos, la tienda muestra un dibujo de cada prenda. Para cambiarlo por la foto real:

1. Crea una carpeta con el `id` del producto, tal como está en `contenido/productos.json`.
2. Adentro, una carpeta por color, con el nombre en minúscula, sin tildes y con guiones: `negro`, `gris-jaspe`, `azul-oscuro`.
3. Pon ahí las cuatro fotos con estos nombres:
   - `1.jpg` frente
   - `2.jpg` espalda
   - `3.jpg` detalle del estampado
   - `4.jpg` la que quieran (puesta, otro ángulo, todos los colores)

```
fotos/
  camiseta-leon-clasica/
    negro/1.jpg 2.jpg 3.jpg 4.jpg
    blanco/1.jpg ...
```

Si una foto sirve para todos los colores, va directo en la carpeta del producto: `fotos/mug-ceramica/4.jpg`.

Sirven `.jpg`, `.png`, `.webp` y `.avif`. Lo ideal es que sean verticales (4:5, por ejemplo 1200 x 1500), con fondo claro parejo y de menos de 400 KB cada una. Las que falten se siguen dibujando.
