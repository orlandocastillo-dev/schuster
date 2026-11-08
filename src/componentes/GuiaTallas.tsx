import { useState } from "react";
import { grupos } from "../datos";

const ORDEN = ["adulto", "dama", "infantil", "nino", "pantaloneta", "pijama", "chaqueta"];

/** Tabla de tallas con pestañas por tipo de prenda. */
export function GuiaTallas({ inicial = "adulto" }: { inicial?: string }) {
  const [grupo, setGrupo] = useState(ORDEN.includes(inicial) ? inicial : "adulto");
  const g = grupos[grupo];

  return (
    <div className="guia">
      <div className="pestanas" role="tablist" aria-label="Tipo de prenda">
        {ORDEN.map((id) => (
          <button key={id} type="button" role="tab" id={`pestana-${id}`} aria-selected={id === grupo} aria-controls="tabla-tallas" onClick={() => setGrupo(id)}>
            {grupos[id].nombre}
          </button>
        ))}
      </div>
      <div id="tabla-tallas" role="tabpanel" aria-labelledby={`pestana-${grupo}`} key={grupo} className="guia__panel">
        <p className="guia__tallas">
          Tallas: <strong>{g.tallas.join(", ")}</strong>
        </p>
        {g.medidas && (
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Talla</th>
                  {g.medidas.columnas.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(g.medidas.filas).map(([t, vals]) => (
                  <tr key={t}>
                    <th scope="row">{t}</th>
                    {vals.map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="guia__como">
        <svg viewBox="0 0 200 180" aria-hidden="true" className="guia__dibujo">
          <defs>
            <marker id="punta" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10Z" fill="var(--rojo)" />
            </marker>
          </defs>
          <path d="M74 24L55 30L25 52L38 86L56 78L56 166Q100 172 144 166L144 78L162 86L175 52L145 30L126 24C118 38 82 38 74 24Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M56 92H144" stroke="var(--rojo)" strokeWidth="2" markerStart="url(#punta)" markerEnd="url(#punta)" />
          <path d="M100 30V166" stroke="var(--rojo)" strokeWidth="2" strokeDasharray="4 4" />
          <text x="100" y="86" textAnchor="middle" fontSize="11" fill="currentColor">Pecho</text>
          <text x="108" y="130" fontSize="11" fill="currentColor">Largo</text>
        </svg>
        <ul>
          <li>
            <strong>Pecho:</strong> mide de axila a axila con la prenda estirada sobre una mesa y multiplica por dos.
          </li>
          <li>
            <strong>Largo:</strong> desde el punto más alto del hombro hasta el borde de abajo.
          </li>
          <li>Si estás entre dos tallas, escoge la más grande o escríbenos y te ayudamos.</li>
        </ul>
      </div>
    </div>
  );
}
