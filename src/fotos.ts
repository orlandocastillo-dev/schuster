// Las fotos reales van en /fotos/<id-del-producto>/<color>/1.jpg … 4.jpg
// (1 frente, 2 espalda, 3 detalle, 4 libre). Si una foto sirve para todos los colores,
// puede ir directo en /fotos/<id-del-producto>/1.jpg. Lo que falte se dibuja.

const archivos = import.meta.glob("/fotos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const indice = new Map<string, string>();
for (const [ruta, url] of Object.entries(archivos)) {
  // "/fotos/camiseta/negro/1.jpg" -> "camiseta/negro/1"
  const clave = ruta.replace(/^\/fotos\//, "").replace(/\.[a-z]+$/i, "").toLowerCase();
  indice.set(clave, url);
}

export function foto(producto: string, color: string, n: number): string | undefined {
  return indice.get(`${producto}/${color}/${n}`) ?? indice.get(`${producto}/${n}`);
}
