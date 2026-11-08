// Cada prenda dibujada en un lienzo de 400 x 500, centrada en x = 200.
// cuerpo: la silueta. partes: piezas con otro tono (cuello, puños, bolsillos).
// tono negativo oscurece el color de la prenda, positivo lo aclara.

export interface Parte {
  d: string;
  tono: number;
  /** Se dibuja detrás del cuerpo, como la capota o las tiras de una mochila. */
  atras?: boolean;
  /** Color fijo que no depende de la prenda (metal, cordones). */
  fijo?: string;
}

export interface Zona {
  x: number;
  y: number;
  w: number;
  rot?: number;
}

export interface Vista {
  cuerpo: string;
  partes?: Parte[];
  costuras?: string[];
  pliegues?: string[];
  /** Líneas en el color de la tinta, como el ribete de la pijama. */
  ribetes?: string[];
  /** Cordones y tiras: trazos gruesos del color de la prenda un poco más claro. */
  cordones?: string[];
  botones?: [number, number][];
  logo?: Zona | null;
  /** Zona pequeña a un lado del pecho, para el león bordado. */
  pecho?: Zona;
}

/** Prenda armada desde una foto real en blanco: /prendas/<archivo>-mascara, -sombra y -luz. */
export interface FotoBase {
  archivo: string;
  /** Dónde cae la foto dentro del lienzo de 400 x 500. */
  y: number;
  alto: number;
  logo: Zona;
  pecho: Zona;
  logoEspalda: Zona;
  /** La espalda es la misma foto al revés (mug, toalla...): el estampado se pone sin voltear. */
  espejoEspalda?: boolean;
  /** Altura de la sombra en el piso, si la pieza no llega hasta abajo. */
  suelo?: number;
}

export interface Forma {
  foto?: FotoBase;
  frente: Vista;
  espalda?: Vista;
  textura?: "tejido" | "denim" | "malla" | "lona" | "rizo" | "nailon" | "ninguna";
  /** Corre el dibujo hacia abajo cuando la prenda es baja, para que quede centrada. */
  bajar?: number;
  hilo?: string;
  /** En la espalda se muestra el mismo dibujo al revés (mug). */
  espejo?: boolean;
  /** Área donde se puede estampar en el personalizador. */
  area?: { x: number; y: number; w: number; h: number };
  areaEspalda?: { x: number; y: number; w: number; h: number };
}

const CAMISETA = "M148 72L110 84L50 128L76 196L112 180L113 438Q200 450 287 438L288 180L324 196L350 128L290 84L252 72";
const CAMISETA_COSTURAS = [
  "M110 86C118 120 117 150 112 180",
  "M290 86C282 120 283 150 288 180",
  "M115 426Q200 438 285 426",
  "M71 183L107 168",
  "M329 183L293 168",
];
const CAMISETA_PLIEGUES = ["M120 202Q140 234 132 274", "M280 202Q260 234 268 274", "M150 424Q170 392 162 354", "M262 330Q250 372 258 414", "M64 142Q82 152 94 172"];

const MANGA_LARGA_I = "L84 110L48 400L84 408L118 196";
const MANGA_LARGA_D = "L282 196L316 408L352 400L316 110";
const PUNOS: Parte[] = [
  { d: "M49 396L85 404L81 436L45 428Z", tono: -0.14 },
  { d: "M351 396L315 404L319 436L355 428Z", tono: -0.14 },
];

const CAMISA_CUELLO: Parte[] = [
  { d: "M152 66C170 56 230 56 248 66L240 76C224 68 176 68 160 76Z", tono: -0.3 },
  { d: "M152 68L200 98L180 128L138 88Z", tono: -0.04 },
  { d: "M248 68L200 98L220 128L262 88Z", tono: -0.04 },
];
const CAMISA_BOTONES: [number, number][] = [[200, 122], [200, 172], [200, 222], [200, 272], [200, 322], [200, 372], [200, 420]];
const CAMISA_BAJO = "L114 432Q118 452 160 450Q200 444 240 450Q282 452 286 432";

export const FORMAS: Record<string, Forma> = {
  camiseta: {
    textura: "tejido",
    foto: {
      archivo: "camiseta",
      y: 2,
      alto: 496,
      logo: { x: 200, y: 168, w: 78 },
      pecho: { x: 252, y: 138, w: 30 },
      logoEspalda: { x: 200, y: 150, w: 80 },
    },
    frente: {
      cuerpo: `${CAMISETA}C236 100 164 100 148 72Z`,
      partes: [
        { d: "M158 70C172 84 228 84 242 70C228 80 172 80 158 70Z", tono: -0.4 },
        { d: "M148 72C164 100 236 100 252 72L242 70C228 90 172 90 158 70Z", tono: -0.1 },
      ],
      costuras: [...CAMISETA_COSTURAS, "M152 78C168 104 232 104 248 78"],
      pliegues: CAMISETA_PLIEGUES,
      logo: { x: 200, y: 178, w: 82 },
      pecho: { x: 250, y: 150, w: 34 },
    },
    espalda: {
      cuerpo: `${CAMISETA}C236 82 164 82 148 72Z`,
      partes: [{ d: "M148 72C164 82 236 82 252 72L246 68C230 76 170 76 154 68Z", tono: -0.1 }],
      costuras: CAMISETA_COSTURAS,
      pliegues: CAMISETA_PLIEGUES,
      logo: { x: 200, y: 150, w: 84 },
    },
    area: { x: 128, y: 112, w: 144, h: 200 },
    areaEspalda: { x: 128, y: 100, w: 144, h: 230 },
  },

  "camiseta-dama": {
    foto: {
      archivo: "camiseta-dama",
      y: 0,
      alto: 500,
      logo: { x: 200, y: 165, w: 68 },
      pecho: { x: 250, y: 138, w: 28 },
      logoEspalda: { x: 200, y: 140, w: 72 },
    },
    textura: "tejido",
    frente: {
      cuerpo:
        "M158 78L124 88L84 116L102 166L128 156C124 220 136 262 130 300C126 360 124 410 122 440Q200 452 278 440C276 410 274 360 270 300C264 262 276 220 272 156L298 166L316 116L276 88L242 78C230 114 170 114 158 78Z",
      partes: [
        { d: "M166 76C180 88 220 88 234 76C220 84 180 84 166 76Z", tono: -0.4 },
        { d: "M158 78C170 114 230 114 242 78L234 76C224 104 176 104 166 76Z", tono: -0.1 },
      ],
      costuras: ["M124 90C130 120 131 140 128 156", "M276 90C270 120 269 140 272 156", "M124 428Q200 440 276 428", "M99 156L125 146", "M301 156L275 146"],
      pliegues: ["M134 300Q150 280 148 250", "M266 300Q250 280 252 250", "M160 432Q170 402 166 372", "M240 420Q232 392 238 362"],
      logo: { x: 200, y: 192, w: 68 },
      pecho: { x: 244, y: 160, w: 30 },
    },
    espalda: {
      cuerpo:
        "M158 78L124 88L84 116L102 166L128 156C124 220 136 262 130 300C126 360 124 410 122 440Q200 452 278 440C276 410 274 360 270 300C264 262 276 220 272 156L298 166L316 116L276 88L242 78C230 90 170 90 158 78Z",
      partes: [{ d: "M158 78C170 90 230 90 242 78L236 74C224 84 176 84 164 74Z", tono: -0.1 }],
      costuras: ["M124 90C130 120 131 140 128 156", "M276 90C270 120 269 140 272 156", "M124 428Q200 440 276 428"],
      logo: { x: 200, y: 160, w: 70 },
    },
    area: { x: 140, y: 120, w: 120, h: 180 },
    areaEspalda: { x: 140, y: 100, w: 120, h: 220 },
  },

  polo: {
    textura: "tejido",
    foto: {
      archivo: "polo",
      y: 2,
      alto: 496,
      logo: { x: 200, y: 235, w: 76 },
      pecho: { x: 268, y: 180, w: 30 },
      logoEspalda: { x: 200, y: 150, w: 80 },
    },
    frente: {
      cuerpo: `${CAMISETA}L200 106Z`,
      partes: [
        { d: "M71 183L76 196L112 180L107 168Z", tono: -0.1 },
        { d: "M329 183L324 196L288 180L293 168Z", tono: -0.1 },
        { d: "M190 104L210 104L210 180L190 180Z", tono: -0.05 },
        { d: "M152 64C170 54 230 54 248 64L240 74C224 64 176 64 160 74Z", tono: -0.32 },
        { d: "M152 66L200 104L184 126L132 86Z", tono: -0.03 },
        { d: "M248 66L200 104L216 126L268 86Z", tono: -0.03 },
      ],
      costuras: [...CAMISETA_COSTURAS, "M190 106L190 180L210 180L210 106"],
      pliegues: CAMISETA_PLIEGUES,
      botones: [[200, 130], [200, 158]],
      logo: { x: 200, y: 200, w: 70 },
      pecho: { x: 252, y: 162, w: 34 },
    },
    espalda: {
      cuerpo: `${CAMISETA}C236 80 164 80 148 72Z`,
      partes: [{ d: "M148 72C166 58 234 58 252 72L250 82C234 70 166 70 150 82Z", tono: -0.06 }],
      costuras: CAMISETA_COSTURAS,
      pliegues: CAMISETA_PLIEGUES,
      logo: { x: 200, y: 160, w: 84 },
    },
    area: { x: 128, y: 190, w: 144, h: 130 },
    areaEspalda: { x: 128, y: 100, w: 144, h: 230 },
  },

  uniforme: {
    textura: "malla",
    foto: {
      archivo: "uniforme",
      y: 2,
      alto: 496,
      logo: { x: 200, y: 195, w: 78 },
      pecho: { x: 262, y: 165, w: 30 },
      logoEspalda: { x: 200, y: 150, w: 80 },
    },
    frente: {
      cuerpo: `${CAMISETA}L200 124Z`,
      partes: [
        { d: "M148 72L110 84L50 128L76 196L112 180L118 150C128 120 140 96 160 80Z", tono: -0.34 },
        { d: "M252 72L290 84L350 128L324 196L288 180L282 150C272 120 260 96 240 80Z", tono: -0.34 },
        { d: "M148 72L200 124L252 72L242 72L200 112L158 72Z", tono: -0.34 },
        { d: "M113 300L124 300L126 442L113 438Z", tono: -0.34 },
        { d: "M287 300L276 300L274 442L287 438Z", tono: -0.34 },
      ],
      costuras: ["M115 426Q200 438 285 426", "M71 183L107 168", "M329 183L293 168"],
      pliegues: CAMISETA_PLIEGUES,
      logo: { x: 200, y: 196, w: 70 },
      pecho: { x: 252, y: 162, w: 34 },
    },
    espalda: {
      cuerpo: `${CAMISETA}C236 82 164 82 148 72Z`,
      partes: [
        { d: "M148 72L110 84L50 128L76 196L112 180L118 150C128 120 140 96 160 80Z", tono: -0.34 },
        { d: "M252 72L290 84L350 128L324 196L288 180L282 150C272 120 260 96 240 80Z", tono: -0.34 },
        { d: "M148 72C164 82 236 82 252 72L246 68C230 76 170 76 154 68Z", tono: -0.34 },
      ],
      costuras: ["M115 426Q200 438 285 426"],
      pliegues: CAMISETA_PLIEGUES,
      logo: { x: 200, y: 150, w: 84 },
    },
  },

  "camisa-corta": {
    textura: "lona",
    foto: {
      archivo: "camisa-corta",
      y: 2,
      alto: 496,
      logo: { x: 266, y: 196, w: 30 },
      pecho: { x: 266, y: 196, w: 30 },
      logoEspalda: { x: 200, y: 120, w: 60 },
    },
    frente: {
      cuerpo: `M152 70L112 84L54 124L78 192L114 178${CAMISA_BAJO}L286 178L322 192L346 124L288 84L248 70L200 98Z`,
      partes: [
        { d: "M193 98L207 98L207 448L193 448Z", tono: -0.04 },
        { d: "M222 168L262 168L262 214L242 222L222 214Z", tono: -0.05 },
        ...CAMISA_CUELLO,
      ],
      costuras: ["M112 86C120 120 119 150 114 178", "M288 86C280 120 281 150 286 178", "M73 179L109 165", "M327 179L291 165", "M222 176L262 176", "M193 100L193 446", "M207 100L207 446"],
      pliegues: ["M124 210Q144 250 136 300", "M276 210Q256 250 264 300", "M150 430Q166 400 160 360", "M250 420Q238 390 246 356"],
      botones: CAMISA_BOTONES,
      pecho: { x: 242, y: 150, w: 26 },
      logo: { x: 242, y: 150, w: 26 },
    },
    espalda: {
      cuerpo: `M152 70L112 84L54 124L78 192L114 178${CAMISA_BAJO}L286 178L322 192L346 124L288 84L248 70C232 78 168 78 152 70Z`,
      partes: [{ d: "M152 66C170 56 230 56 248 66L248 74C232 80 168 80 152 74Z", tono: -0.06 }],
      costuras: ["M118 122Q200 134 282 122", "M112 86C120 120 119 150 114 178", "M288 86C280 120 281 150 286 178"],
      pliegues: ["M200 140L200 200", "M150 430Q166 400 160 360"],
      logo: { x: 200, y: 110, w: 60 },
    },
  },

  "camisa-larga": {
    foto: {
      archivo: "camisa-larga",
      y: 0,
      alto: 500,
      logo: { x: 262, y: 150, w: 26 },
      pecho: { x: 262, y: 150, w: 26 },
      logoEspalda: { x: 200, y: 110, w: 60 },
    },
    textura: "lona",
    frente: {
      cuerpo: `M152 70L112 84${MANGA_LARGA_I}${CAMISA_BAJO}${MANGA_LARGA_D}L288 84L248 70L200 98Z`,
      partes: [
        { d: "M193 98L207 98L207 448L193 448Z", tono: -0.04 },
        { d: "M222 168L262 168L262 214L242 222L222 214Z", tono: -0.05 },
        ...PUNOS,
        ...CAMISA_CUELLO,
      ],
      costuras: ["M112 86C122 130 122 160 118 196", "M288 86C278 130 278 160 282 196", "M222 176L262 176", "M193 100L193 446", "M207 100L207 446"],
      pliegues: ["M74 200Q84 260 72 320", "M326 200Q316 260 328 320", "M64 360Q74 372 86 368", "M336 360Q326 372 314 368", "M150 430Q166 400 160 360"],
      botones: [...CAMISA_BOTONES, [63, 420], [337, 420]],
      pecho: { x: 242, y: 150, w: 26 },
      logo: { x: 242, y: 150, w: 26 },
    },
    espalda: {
      cuerpo: `M152 70L112 84${MANGA_LARGA_I}${CAMISA_BAJO}${MANGA_LARGA_D}L288 84L248 70C232 78 168 78 152 70Z`,
      partes: [...PUNOS, { d: "M152 66C170 56 230 56 248 66L248 74C232 80 168 80 152 74Z", tono: -0.06 }],
      costuras: ["M118 122Q200 134 282 122"],
      pliegues: ["M200 140L200 200", "M74 200Q84 260 72 320", "M326 200Q316 260 328 320"],
      logo: { x: 200, y: 110, w: 60 },
    },
  },

  pijama: {
    textura: "tejido",
    frente: {
      cuerpo: `M152 70L112 84L54 124L78 192L114 178${CAMISA_BAJO}L286 178L322 192L346 124L288 84L248 70L200 98Z`,
      partes: [
        { d: "M193 98L207 98L207 448L193 448Z", tono: -0.04 },
        { d: "M222 168L262 168L262 214L242 222L222 214Z", tono: -0.05 },
        { d: "M152 66C170 56 230 56 248 66L240 76C224 68 176 68 160 76Z", tono: -0.3 },
        { d: "M152 68L200 98L196 150L168 112L138 88Z", tono: -0.04 },
        { d: "M248 68L200 98L204 150L232 112L262 88Z", tono: -0.04 },
      ],
      ribetes: ["M193 150L193 448", "M152 68L200 98L196 150L168 112L138 88", "M248 68L200 98L204 150L232 112L262 88", "M222 168L262 168", "M73 179L109 165", "M327 179L291 165"],
      costuras: ["M112 86C120 120 119 150 114 178", "M288 86C280 120 281 150 286 178"],
      pliegues: ["M124 210Q144 250 136 300", "M276 210Q256 250 264 300", "M150 430Q166 400 160 360"],
      botones: [[200, 172], [200, 222], [200, 272], [200, 322], [200, 372], [200, 420]],
      pecho: { x: 242, y: 196, w: 22 },
      logo: { x: 242, y: 196, w: 22 },
    },
    espalda: {
      cuerpo: `M152 70L112 84L54 124L78 192L114 178${CAMISA_BAJO}L286 178L322 192L346 124L288 84L248 70C232 78 168 78 152 70Z`,
      partes: [{ d: "M152 66C170 56 230 56 248 66L248 74C232 80 168 80 152 74Z", tono: -0.06 }],
      ribetes: ["M73 179L109 165", "M327 179L291 165"],
      pliegues: ["M150 430Q166 400 160 360", "M200 140L200 200"],
      logo: null,
    },
  },

  blusa: {
    textura: "nailon",
    frente: {
      cuerpo:
        "M160 80L125 90L92 120L108 168L128 160C120 230 138 280 130 320C124 380 120 420 118 440Q200 452 282 440C280 420 276 380 270 320C262 280 280 230 272 160L292 168L308 120L275 90L240 80L200 156Z",
      partes: [
        { d: "M160 80L200 156L240 80L232 78L200 140L168 78Z", tono: -0.08 },
        { d: "M168 78C186 88 214 88 232 78L200 140Z", tono: -0.4 },
      ],
      costuras: ["M125 92C132 124 132 144 128 160", "M275 92C268 124 268 144 272 160", "M104 160L126 152", "M296 160L274 152", "M122 428Q200 440 278 428"],
      pliegues: ["M150 180Q160 240 150 300", "M250 180Q240 240 250 300", "M170 330Q180 390 168 436", "M232 330Q222 390 234 436"],
      pecho: { x: 246, y: 180, w: 26 },
      logo: { x: 246, y: 180, w: 26 },
    },
    espalda: {
      cuerpo:
        "M160 80L125 90L92 120L108 168L128 160C120 230 138 280 130 320C124 380 120 420 118 440Q200 452 282 440C280 420 276 380 270 320C262 280 280 230 272 160L292 168L308 120L275 90L240 80C226 92 174 92 160 80Z",
      costuras: ["M122 428Q200 440 278 428", "M200 92L200 440"],
      pliegues: ["M150 180Q160 240 150 300", "M250 180Q240 240 250 300"],
      logo: null,
    },
  },

  chaqueta: {
    textura: "nailon",
    frente: {
      cuerpo: "M156 66L114 84L86 108L52 404L88 412L120 196L118 440L282 440L280 196L312 412L348 404L314 108L286 84L244 66Z",
      partes: [
        { d: "M162 42Q200 36 238 42Q200 52 162 42Z", tono: -0.45 },
        { d: "M156 66L156 40Q200 32 244 40L244 66Q200 72 156 66Z", tono: -0.04 },
        { d: "M52 404L88 412L86 438L50 430Z", tono: -0.16 },
        { d: "M348 404L312 412L314 438L350 430Z", tono: -0.16 },
        { d: "M118 440L282 440L282 462L118 462Z", tono: -0.16 },
        { d: "M197 38L203 38L203 462L197 462Z", tono: -0.5 },
        { d: "M194 72L206 72L206 94L194 94Z", tono: 0, fijo: "#b9bcc0" },
      ],
      costuras: ["M114 86C122 130 124 160 120 196", "M286 86C278 130 276 160 280 196", "M192 40L192 440", "M208 40L208 440", "M136 330L160 274", "M264 330L240 274"],
      pliegues: ["M74 200Q84 260 70 330", "M326 200Q316 260 330 330", "M140 410Q160 380 150 340", "M260 410Q240 380 250 340", "M62 372Q76 384 88 378", "M338 372Q324 384 312 378"],
      pecho: { x: 250, y: 140, w: 32 },
      logo: { x: 250, y: 140, w: 32 },
    },
    espalda: {
      cuerpo: "M156 66L114 84L86 108L52 404L88 412L120 196L118 440L282 440L280 196L312 412L348 404L314 108L286 84L244 66Q200 72 156 66Z",
      partes: [
        { d: "M156 66L156 40Q200 32 244 40L244 66Q200 72 156 66Z", tono: -0.04 },
        { d: "M52 404L88 412L86 438L50 430Z", tono: -0.16 },
        { d: "M348 404L312 412L314 438L350 430Z", tono: -0.16 },
        { d: "M118 440L282 440L282 462L118 462Z", tono: -0.16 },
      ],
      costuras: ["M120 130Q200 142 280 130"],
      pliegues: ["M74 200Q84 260 70 330", "M326 200Q316 260 330 330", "M200 300Q190 360 200 420"],
      logo: { x: 200, y: 170, w: 72 },
    },
  },

  chaleco: {
    textura: "nailon",
    frente: {
      cuerpo: "M156 66L118 80C110 120 136 160 124 196L120 440L280 440L276 196C264 160 290 120 282 80L244 66Z",
      partes: [
        { d: "M162 42Q200 36 238 42Q200 52 162 42Z", tono: -0.45 },
        { d: "M156 66L156 40Q200 32 244 40L244 66Q200 72 156 66Z", tono: -0.04 },
        { d: "M118 80C110 120 136 160 124 196L134 196C146 160 120 120 128 80Z", tono: -0.22 },
        { d: "M282 80C290 120 264 160 276 196L266 196C254 160 280 120 272 80Z", tono: -0.22 },
        { d: "M120 440L280 440L280 458L120 458Z", tono: -0.16 },
        { d: "M197 38L203 38L203 458L197 458Z", tono: -0.5 },
        { d: "M194 72L206 72L206 94L194 94Z", tono: 0, fijo: "#b9bcc0" },
      ],
      costuras: [130, 180, 230, 280, 330, 380].flatMap((y) => [`M${y < 200 ? 136 : 126} ${y}Q160 ${y + 6} 192 ${y}`, `M208 ${y}Q240 ${y + 6} ${y < 200 ? 264 : 274} ${y}`]),
      pliegues: [130, 180, 230, 280, 330, 380].map((y) => `M130 ${y + 22}Q200 ${y + 32} 270 ${y + 22}`),
      pecho: { x: 246, y: 108, w: 28 },
      logo: { x: 246, y: 108, w: 28 },
    },
    espalda: {
      cuerpo: "M156 66L118 80C110 120 136 160 124 196L120 440L280 440L276 196C264 160 290 120 282 80L244 66Q200 72 156 66Z",
      partes: [
        { d: "M156 66L156 40Q200 32 244 40L244 66Q200 72 156 66Z", tono: -0.04 },
        { d: "M120 440L280 440L280 458L120 458Z", tono: -0.16 },
      ],
      costuras: [130, 180, 230, 280, 330, 380].map((y) => `M${y < 200 ? 136 : 126} ${y}Q200 ${y + 8} ${y < 200 ? 264 : 274} ${y}`),
      pliegues: [130, 180, 230, 280, 330, 380].map((y) => `M130 ${y + 22}Q200 ${y + 32} 270 ${y + 22}`),
      logo: { x: 200, y: 160, w: 64 },
    },
  },

  buzo: {
    foto: {
      archivo: "buzo",
      y: 0,
      alto: 500,
      logo: { x: 200, y: 238, w: 62 },
      pecho: { x: 256, y: 188, w: 28 },
      logoEspalda: { x: 200, y: 215, w: 75 },
    },
    textura: "tejido",
    frente: {
      cuerpo: "M160 80L116 92L86 116L52 404L88 412L120 200L118 430L282 430L280 200L312 412L348 404L314 116L284 92L240 80C226 98 174 98 160 80Z",
      partes: [
        { d: "M160 80C154 52 174 36 200 34C226 36 246 52 240 80Z", tono: -0.14, atras: true },
        { d: "M168 84C164 62 180 48 200 48C220 48 236 62 232 84C220 102 180 102 168 84Z", tono: -0.5 },
        { d: "M160 80C154 54 174 40 200 40C226 40 246 54 240 80C232 70 222 50 200 50C178 50 168 70 160 80Z", tono: -0.06 },
        { d: "M140 300L260 300L280 392L120 392Z", tono: -0.05 },
        { d: "M52 404L88 412L86 438L50 430Z", tono: -0.14 },
        { d: "M348 404L312 412L314 438L350 430Z", tono: -0.14 },
        { d: "M118 430L282 430L282 458L118 458Z", tono: -0.14 },
      ],
      cordones: ["M186 100L182 176", "M214 100L218 176"],
      costuras: ["M116 94C124 140 124 170 120 200", "M284 94C276 140 276 170 280 200", "M141 304L259 304L278 390L122 390", "M140 300L120 392", "M260 300L280 392"],
      pliegues: ["M74 210Q84 270 70 340", "M326 210Q316 270 330 340", "M62 372Q76 384 88 378", "M338 372Q324 384 312 378", "M150 420Q170 400 160 400"],
      logo: { x: 200, y: 230, w: 72 },
      pecho: { x: 248, y: 160, w: 30 },
    },
    espalda: {
      cuerpo: "M160 80L116 92L86 116L52 404L88 412L120 200L118 430L282 430L280 200L312 412L348 404L314 116L284 92L240 80Z",
      partes: [
        { d: "M146 88C140 62 166 44 200 44C234 44 260 62 254 88C244 120 156 120 146 88Z", tono: -0.04 },
        { d: "M52 404L88 412L86 438L50 430Z", tono: -0.14 },
        { d: "M348 404L312 412L314 438L350 430Z", tono: -0.14 },
        { d: "M118 430L282 430L282 458L118 458Z", tono: -0.14 },
      ],
      costuras: ["M200 46L200 112"],
      pliegues: ["M74 210Q84 270 70 340", "M326 210Q316 270 330 340", "M160 100Q200 120 240 100"],
      logo: { x: 200, y: 236, w: 70 },
    },
    area: { x: 136, y: 150, w: 128, h: 140 },
    areaEspalda: { x: 128, y: 140, w: 144, h: 220 },
  },

  top: {
    foto: {
      archivo: "top",
      y: 0,
      alto: 500,
      logo: { x: 200, y: 165, w: 60 },
      pecho: { x: 245, y: 140, w: 26 },
      logoEspalda: { x: 200, y: 170, w: 70 },
    },
    textura: "tejido",
    bajar: 60,
    frente: {
      cuerpo: "M150 100C158 150 242 150 250 100L272 102C274 170 300 210 300 270L300 320Q200 332 100 320L100 270C100 210 126 170 128 102Z",
      partes: [
        { d: "M128 102L138 40L156 40L150 100Z", tono: -0.06 },
        { d: "M272 102L262 40L244 40L250 100Z", tono: -0.06 },
        { d: "M150 100C158 150 242 150 250 100L242 100C234 140 166 140 158 100Z", tono: -0.1 },
        { d: "M100 296Q200 308 300 296L300 320Q200 332 100 320Z", tono: -0.16 },
      ],
      costuras: ["M150 150Q160 220 160 296", "M250 150Q240 220 240 296", "M102 300Q200 312 298 300"],
      pliegues: ["M120 200Q130 240 122 280", "M280 200Q270 240 278 280"],
      logo: { x: 200, y: 200, w: 48 },
      pecho: { x: 200, y: 200, w: 40 },
    },
    espalda: {
      cuerpo: "M130 140L156 40L176 40L200 150L224 40L244 40L270 140C290 190 300 220 300 270L300 320Q200 332 100 320L100 270C100 220 110 190 130 140Z",
      partes: [{ d: "M100 296Q200 308 300 296L300 320Q200 332 100 320Z", tono: -0.16 }],
      costuras: ["M102 300Q200 312 298 300"],
      logo: { x: 200, y: 308, w: 60 },
    },
  },

  peto: {
    foto: {
      archivo: "peto",
      y: 0,
      alto: 500,
      logo: { x: 200, y: 195, w: 66 },
      pecho: { x: 200, y: 150, w: 40 },
      logoEspalda: { x: 200, y: 175, w: 66 },
    },
    textura: "malla",
    frente: {
      cuerpo: "M150 70L120 76C116 130 140 170 122 210L116 440Q200 452 284 440L278 210C260 170 284 130 280 76L250 70C236 120 164 120 150 70Z",
      partes: [
        { d: "M150 70C164 120 236 120 250 70L244 68C232 110 168 110 156 68Z", tono: -0.22 },
        { d: "M120 76C116 130 140 170 122 210L130 210C148 170 124 130 128 76Z", tono: -0.22 },
        { d: "M280 76C284 130 260 170 278 210L270 210C252 170 276 130 272 76Z", tono: -0.22 },
      ],
      costuras: ["M118 430Q200 442 282 430"],
      pliegues: ["M150 240Q160 300 150 380", "M250 240Q240 300 250 380"],
      logo: { x: 200, y: 230, w: 66 },
      pecho: { x: 200, y: 180, w: 40 },
    },
    espalda: {
      cuerpo: "M150 70L120 76C116 130 140 170 122 210L116 440Q200 452 284 440L278 210C260 170 284 130 280 76L250 70C236 84 164 84 150 70Z",
      partes: [{ d: "M150 70C164 84 236 84 250 70L246 66C232 78 168 78 154 66Z", tono: -0.22 }],
      costuras: ["M118 430Q200 442 282 430"],
      logo: { x: 200, y: 170, w: 66 },
    },
  },

  pantaloneta: {
    foto: {
      archivo: "pantaloneta",
      suelo: 398,
      y: 0,
      alto: 500,
      logo: { x: 300, y: 300, w: 34 },
      pecho: { x: 300, y: 300, w: 34 },
      logoEspalda: { x: 200, y: 128, w: 38 },
    },
    textura: "nailon",
    bajar: 40,
    frente: {
      cuerpo: "M110 120L290 120L300 330L214 344L200 220L186 344L100 330Z",
      partes: [
        { d: "M110 120L290 120L292 148L108 148Z", tono: -0.14 },
        { d: "M104 160L112 160L106 330L100 330Z", tono: 0.4 },
        { d: "M296 160L288 160L294 330L300 330Z", tono: 0.4 },
      ],
      cordones: ["M194 140L188 194", "M206 140L212 194"],
      costuras: ["M104 316L184 330", "M296 316L216 330", "M200 148L200 220"],
      pliegues: ["M150 200Q170 260 160 320", "M250 200Q230 260 240 320", "M196 222Q200 260 192 300"],
      logo: { x: 252, y: 290, w: 30 },
      pecho: { x: 252, y: 290, w: 30 },
    },
    espalda: {
      cuerpo: "M110 120L290 120L300 330L214 344L200 230L186 344L100 330Z",
      partes: [
        { d: "M110 120L290 120L292 148L108 148Z", tono: -0.14 },
        { d: "M104 160L112 160L106 330L100 330Z", tono: 0.4 },
        { d: "M296 160L288 160L294 330L300 330Z", tono: 0.4 },
      ],
      costuras: ["M104 316L184 330", "M296 316L216 330", "M200 148L200 230", "M130 170L180 168"],
      pliegues: ["M150 200Q170 260 160 320", "M250 200Q230 260 240 320"],
      logo: { x: 200, y: 134, w: 50 },
    },
  },

  jeans: {
    foto: {
      archivo: "jeans",
      y: 0,
      alto: 500,
      logo: { x: 262, y: 80, w: 18 },
      pecho: { x: 262, y: 80, w: 18 },
      logoEspalda: { x: 200, y: 25, w: 28 },
    },
    textura: "denim",
    hilo: "#c98a3c",
    frente: {
      cuerpo: "M120 40L280 40L296 470L216 472L200 140L184 472L104 470Z",
      partes: [
        { d: "M120 40L280 40L281 64L119 64Z", tono: -0.04 },
        { d: "M137 36h9v32h-9Z", tono: -0.04 },
        { d: "M254 36h9v32h-9Z", tono: -0.04 },
        { d: "M195 52a5 5 0 1 0 10 0a5 5 0 1 0-10 0Z", tono: 0, fijo: "#a7a08f" },
      ],
      costuras: ["M121 60L279 60", "M206 64Q210 128 196 140", "M122 68Q150 72 160 112", "M278 68Q250 72 240 112", "M244 74L264 72L264 94L245 96", "M106 456L184 458", "M294 456L216 458", "M110 300L106 456", "M290 300L294 456"],
      pliegues: ["M138 300Q160 312 182 300", "M218 300Q240 312 262 300", "M190 150Q170 170 160 160", "M210 150Q230 170 240 160", "M130 440Q150 430 176 444", "M224 444Q250 430 270 440"],
      logo: null,
      pecho: { x: 254, y: 84, w: 14 },
    },
    espalda: {
      cuerpo: "M120 40L280 40L296 470L216 472L200 150L184 472L104 470Z",
      partes: [
        { d: "M120 40L280 40L281 64L119 64Z", tono: -0.04 },
        { d: "M137 36h9v32h-9Z", tono: -0.04 },
        { d: "M196 36h9v32h-9Z", tono: -0.04 },
        { d: "M254 36h9v32h-9Z", tono: -0.04 },
        { d: "M128 110L184 106L186 170L158 184L130 172Z", tono: -0.05 },
        { d: "M272 110L216 106L214 170L242 184L270 172Z", tono: -0.05 },
        { d: "M210 44h40v18h-40Z", tono: 0, fijo: "#8a5a32" },
      ],
      costuras: ["M121 60L279 60", "M126 94Q200 70 274 94", "M200 64L200 150", "M131 116L183 112", "M269 116L217 112", "M106 456L184 458", "M294 456L216 458"],
      pliegues: ["M138 300Q160 312 182 300", "M218 300Q240 312 262 300"],
      logo: { x: 157, y: 146, w: 30 },
    },
  },

  sudadera: {
    foto: {
      archivo: "jogger",
      y: 0,
      alto: 500,
      logo: { x: 150, y: 165, w: 26 },
      pecho: { x: 150, y: 165, w: 26 },
      logoEspalda: { x: 200, y: 24, w: 34 },
    },
    textura: "tejido",
    frente: {
      cuerpo: "M118 40L282 40L292 430L222 434L200 150L178 434L108 430Z",
      partes: [
        { d: "M118 40L282 40L283 74L117 74Z", tono: -0.14 },
        { d: "M108 430L178 434L176 462L110 458Z", tono: -0.14 },
        { d: "M292 430L222 434L224 462L290 458Z", tono: -0.14 },
      ],
      cordones: ["M194 66L188 126", "M206 66L212 126"],
      costuras: ["M124 84Q140 140 128 184", "M276 84Q260 140 272 184", "M200 74L200 150"],
      pliegues: ["M140 250Q160 290 150 340", "M260 250Q240 290 250 340", "M120 400Q140 412 170 404", "M230 404Q260 412 280 400", "M190 160Q176 180 164 176"],
      logo: { x: 150, y: 120, w: 30 },
      pecho: { x: 150, y: 120, w: 30 },
    },
    espalda: {
      cuerpo: "M118 40L282 40L292 430L222 434L200 160L178 434L108 430Z",
      partes: [
        { d: "M118 40L282 40L283 74L117 74Z", tono: -0.14 },
        { d: "M108 430L178 434L176 462L110 458Z", tono: -0.14 },
        { d: "M292 430L222 434L224 462L290 458Z", tono: -0.14 },
      ],
      costuras: ["M200 74L200 160"],
      pliegues: ["M140 250Q160 290 150 340", "M260 250Q240 290 250 340"],
      logo: { x: 200, y: 100, w: 60 },
    },
  },

  jogger: {
    foto: {
      archivo: "jogger",
      y: 0,
      alto: 500,
      logo: { x: 150, y: 165, w: 26 },
      pecho: { x: 150, y: 165, w: 26 },
      logoEspalda: { x: 200, y: 24, w: 34 },
    },
    textura: "tejido",
    frente: {
      cuerpo: "M120 40L280 40L284 200L262 440L218 442L200 150L182 442L138 440L116 200Z",
      partes: [
        { d: "M120 40L280 40L281 72L119 72Z", tono: -0.14 },
        { d: "M138 440L182 442L180 466L140 464Z", tono: -0.14 },
        { d: "M262 440L218 442L220 466L260 464Z", tono: -0.14 },
        { d: "M262 220L286 218L282 296L260 298Z", tono: -0.06 },
      ],
      cordones: ["M194 64L190 120", "M206 64L210 120"],
      costuras: ["M126 82Q140 130 124 172", "M274 82Q260 130 276 172", "M262 230L284 228", "M200 72L200 150"],
      pliegues: ["M150 400Q165 412 178 400", "M222 400Q236 412 250 400", "M146 360Q162 372 176 362", "M224 362Q238 372 254 360", "M150 240Q160 280 152 320"],
      logo: { x: 150, y: 118, w: 28 },
      pecho: { x: 150, y: 118, w: 28 },
    },
    espalda: {
      cuerpo: "M120 40L280 40L284 200L262 440L218 442L200 160L182 442L138 440L116 200Z",
      partes: [
        { d: "M120 40L280 40L281 72L119 72Z", tono: -0.14 },
        { d: "M138 440L182 442L180 466L140 464Z", tono: -0.14 },
        { d: "M262 440L218 442L220 466L260 464Z", tono: -0.14 },
      ],
      costuras: ["M200 72L200 160"],
      pliegues: ["M150 400Q165 412 178 400", "M222 400Q236 412 250 400"],
      logo: { x: 200, y: 100, w: 56 },
    },
  },

  totebag: {
    foto: {
      archivo: "totebag",
      y: 0,
      alto: 500,
      logo: { x: 200, y: 345, w: 110 },
      pecho: { x: 200, y: 340, w: 64 },
      logoEspalda: { x: 200, y: 345, w: 80 },
    },
    textura: "lona",
    frente: {
      cuerpo: "M110 170L290 170L296 450L104 450Z",
      partes: [{ d: "M150 172C150 70 250 70 250 172L234 172C234 92 166 92 166 172Z", tono: -0.04 }],
      costuras: ["M111 186L289 186", "M150 172L150 196L166 196L166 172", "M234 172L234 196L250 196L250 172", "M106 436L294 436"],
      pliegues: ["M150 220Q160 320 146 430", "M250 220Q240 320 256 430"],
      logo: { x: 200, y: 312, w: 100 },
      pecho: { x: 200, y: 312, w: 60 },
    },
    espalda: {
      cuerpo: "M110 170L290 170L296 450L104 450Z",
      partes: [{ d: "M150 172C150 70 250 70 250 172L234 172C234 92 166 92 166 172Z", tono: -0.04 }],
      costuras: ["M111 186L289 186", "M106 436L294 436"],
      pliegues: ["M150 220Q160 320 146 430", "M250 220Q240 320 256 430"],
      logo: null,
    },
    area: { x: 92, y: 240, w: 216, h: 210 },
    areaEspalda: { x: 92, y: 240, w: 216, h: 210 },
  },

  tula: {
    foto: {
      archivo: "tula",
      suelo: 428,
      y: 0,
      alto: 500,
      logo: { x: 200, y: 250, w: 100 },
      pecho: { x: 200, y: 240, w: 60 },
      logoEspalda: { x: 200, y: 250, w: 80 },
    },
    textura: "nailon",
    frente: {
      cuerpo: "M120 100Q200 118 280 100L288 440L112 440Z",
      partes: [
        { d: "M120 100Q200 118 280 100L281 126Q200 140 119 126Z", tono: -0.12 },
        { d: "M112 412L144 440L112 440Z", tono: -0.3 },
        { d: "M288 412L256 440L288 440Z", tono: -0.3 },
      ],
      cordones: ["M150 114C112 200 100 380 116 436", "M250 114C288 200 300 380 284 436", "M150 114Q200 60 250 114"],
      pliegues: ["M140 130Q160 140 150 170", "M260 130Q240 140 250 170", "M200 128Q205 150 198 176"],
      logo: { x: 200, y: 282, w: 96 },
      pecho: { x: 200, y: 282, w: 60 },
    },
  },

  mochila: {
    textura: "nailon",
    frente: {
      cuerpo: "M130 120Q130 80 200 78Q270 80 270 120L282 440Q200 456 118 440Z",
      partes: [
        { d: "M118 140C96 200 100 360 112 430L122 430C112 360 108 200 128 140Z", tono: -0.34, atras: true },
        { d: "M282 140C304 200 300 360 288 430L278 430C288 360 292 200 272 140Z", tono: -0.34, atras: true },
        { d: "M184 80Q200 48 216 80L208 80Q200 64 192 80Z", tono: -0.24 },
        { d: "M150 300L250 300Q262 300 262 312L264 420Q200 432 136 420L138 312Q138 300 150 300Z", tono: -0.06 },
        { d: "M252 136l10-4l4 16l-10 4Z", tono: 0, fijo: "#b9bcc0" },
        { d: "M240 312l10-2l3 16l-10 2Z", tono: 0, fijo: "#b9bcc0" },
      ],
      costuras: ["M136 140Q200 110 264 140", "M142 318L258 318", "M120 430Q200 446 280 430"],
      pliegues: ["M150 170Q160 230 150 290", "M250 170Q240 230 250 290"],
      logo: { x: 200, y: 206, w: 64 },
      pecho: { x: 200, y: 206, w: 50 },
    },
    espalda: {
      cuerpo: "M130 120Q130 80 200 78Q270 80 270 120L282 440Q200 456 118 440Z",
      partes: [
        { d: "M150 140Q200 128 250 140L256 400Q200 412 144 400Z", tono: -0.18 },
        { d: "M160 110C150 200 156 320 168 420L184 420C172 320 168 200 178 110Z", tono: -0.32 },
        { d: "M240 110C250 200 244 320 232 420L216 420C228 320 232 200 222 110Z", tono: -0.32 },
      ],
      costuras: ["M150 200L250 200", "M150 260L250 260", "M150 320L250 320"],
      logo: null,
    },
  },

  gorra: {
    foto: {
      archivo: "gorra",
      y: 0,
      alto: 500,
      logo: { x: 200, y: 190, w: 62 },
      pecho: { x: 200, y: 190, w: 50 },
      logoEspalda: { x: 200, y: 200, w: 40 },
    },
    textura: "tejido",
    bajar: 40,
    frente: {
      cuerpo: "M84 300C80 176 140 112 200 112C260 112 320 176 316 300C270 290 130 290 84 300Z",
      partes: [
        { d: "M104 298C150 290 250 290 296 298C318 304 318 332 296 342C250 362 150 362 104 342C82 332 82 304 104 298Z", tono: -0.12 },
        { d: "M104 298C150 290 250 290 296 298C250 296 150 296 104 304Z", tono: -0.4 },
        { d: "M190 114a10 6 0 1 0 20 0a10 6 0 1 0-20 0Z", tono: -0.16 },
      ],
      costuras: ["M200 118L200 294", "M200 118C160 150 140 220 138 294", "M200 118C240 150 260 220 262 294", "M100 318C150 334 250 334 300 318", "M96 330C150 348 250 348 304 330"],
      pliegues: ["M110 200Q120 240 110 280", "M290 200Q280 240 290 280"],
      logo: { x: 200, y: 224, w: 62 },
      pecho: { x: 200, y: 224, w: 50 },
    },
    espalda: {
      cuerpo: "M80 300C80 170 140 110 200 110C260 110 320 170 320 300Z",
      partes: [
        { d: "M160 300Q200 238 240 300Z", tono: -0.45 },
        { d: "M146 284L254 284L254 296L146 296Z", tono: -0.2 },
        { d: "M240 282h14v16h-14Z", tono: 0, fijo: "#b9bcc0" },
        { d: "M190 112a10 6 0 1 0 20 0a10 6 0 1 0-20 0Z", tono: -0.16 },
      ],
      costuras: ["M200 116L200 246", "M200 116C160 150 140 220 138 300", "M200 116C240 150 260 220 262 300"],
      logo: { x: 200, y: 200, w: 40 },
    },
    area: { x: 132, y: 140, w: 136, h: 110 },
  },

  visera: {
    foto: {
      archivo: "visera",
      suelo: 345,
      y: 0,
      alto: 500,
      logo: { x: 200, y: 200, w: 46 },
      pecho: { x: 200, y: 200, w: 38 },
      logoEspalda: { x: 200, y: 200, w: 40 },
    },
    textura: "tejido",
    bajar: 40,
    frente: {
      cuerpo: "M90 250L90 180C150 160 250 160 310 180L310 250C250 232 150 232 90 250Z",
      partes: [{ d: "M90 248C130 262 270 262 310 248C340 262 350 300 320 318C260 346 140 346 80 318C50 300 60 262 90 248Z", tono: -0.12 }],
      costuras: ["M94 186C150 168 250 168 306 186", "M94 244C150 228 250 228 306 244", "M90 276C140 296 260 296 310 276"],
      logo: { x: 200, y: 206, w: 40 },
      pecho: { x: 200, y: 206, w: 34 },
    },
  },

  toalla: {
    foto: {
      archivo: "toalla",
      suelo: 340,
      y: 0,
      alto: 500,
      logo: { x: 200, y: 228, w: 62 },
      pecho: { x: 200, y: 228, w: 62 },
      logoEspalda: { x: 200, y: 228, w: 52 },
    },
    textura: "rizo",
    frente: {
      cuerpo: "M70 180L330 180Q340 180 340 190L340 390Q340 402 328 402L72 402Q60 402 60 390L60 190Q60 180 70 180Z",
      partes: [{ d: "M60 340L340 340L340 362L60 362Z", tono: -0.1 }],
      costuras: ["M60 250Q200 260 340 250", "M60 300Q200 310 340 300", "M60 344L340 344", "M60 358L340 358"],
      pliegues: ["M70 210Q200 226 330 210", "M70 270Q200 284 330 270"],
      logo: { x: 200, y: 351, w: 40 },
      pecho: { x: 200, y: 351, w: 40 },
    },
  },

  manga: {
    textura: "tejido",
    frente: {
      cuerpo: "M170 40C160 40 150 46 150 60L162 440Q164 456 180 456L220 456Q236 456 238 440L250 60C250 46 240 40 230 40Z",
      partes: [
        { d: "M150 52Q200 62 250 52L250 78Q200 88 150 78Z", tono: -0.16 },
        { d: "M162 428L238 428L238 456L162 456Z", tono: -0.16 },
      ],
      pliegues: ["M170 200Q180 260 172 320", "M230 200Q220 260 228 320"],
      logo: { x: 200, y: 190, w: 54 },
      pecho: { x: 200, y: 190, w: 44 },
    },
  },

  delantal: {
    foto: {
      archivo: "delantal",
      y: 0,
      alto: 500,
      logo: { x: 197, y: 215, w: 70 },
      pecho: { x: 197, y: 165, w: 40 },
      logoEspalda: { x: 197, y: 250, w: 60 },
    },
    textura: "lona",
    frente: {
      cuerpo: "M150 70L250 70L254 170C270 190 300 200 310 200L300 460L100 460L90 200C100 200 130 190 146 170Z",
      partes: [
        { d: "M150 72C150 10 250 10 250 72L240 72C240 24 160 24 160 72Z", tono: -0.04 },
        { d: "M130 320L270 320L272 400L128 400Z", tono: -0.06 },
      ],
      cordones: ["M92 206C60 220 50 260 70 300", "M308 206C340 220 350 260 330 300"],
      costuras: ["M154 76L246 76", "M130 326L270 326", "M200 320L200 400", "M104 446L296 446"],
      pliegues: ["M140 220Q150 300 140 440", "M260 220Q250 300 260 440"],
      logo: { x: 200, y: 236, w: 82 },
      pecho: { x: 200, y: 140, w: 40 },
    },
  },

  capa: {
    foto: {
      archivo: "capa",
      suelo: 418,
      y: 0,
      alto: 500,
      logo: { x: 202, y: 230, w: 96 },
      pecho: { x: 202, y: 170, w: 50 },
      logoEspalda: { x: 202, y: 230, w: 80 },
    },
    textura: "nailon",
    frente: {
      cuerpo: "M160 80Q200 92 240 80L380 430Q200 470 20 430Z",
      partes: [
        { d: "M160 80Q200 92 240 80L242 98Q200 112 158 98Z", tono: -0.18 },
        { d: "M226 88a6 6 0 1 0 12 0a6 6 0 1 0-12 0Z", tono: 0, fijo: "#b9bcc0" },
      ],
      costuras: ["M26 420Q200 458 374 420"],
      pliegues: ["M150 120Q120 280 90 420", "M250 120Q280 280 310 420", "M200 112Q206 290 200 446", "M120 300Q110 360 70 420", "M280 300Q290 360 330 420"],
      logo: { x: 200, y: 250, w: 100 },
      pecho: { x: 200, y: 180, w: 50 },
    },
  },

  bandera: {
    textura: "nailon",
    frente: {
      cuerpo: "M70 70C150 50 230 100 340 70L340 290C230 320 150 270 70 290Z",
      partes: [
        { d: "M58 40L70 40L70 470L58 470Z", tono: 0, fijo: "#9a9da1", atras: true },
        { d: "M56 36a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z", tono: 0, fijo: "#c9a227" },
      ],
      pliegues: ["M150 60Q160 180 150 280", "M250 90Q240 200 250 300", "M300 76Q300 180 306 296"],
      logo: { x: 205, y: 180, w: 104 },
      pecho: { x: 205, y: 180, w: 60 },
    },
  },

  "gorro-cocina": {
    foto: {
      archivo: "gorro-cocina",
      suelo: 414,
      y: 0,
      alto: 500,
      logo: { x: 200, y: 345, w: 70 },
      pecho: { x: 200, y: 345, w: 70 },
      logoEspalda: { x: 200, y: 345, w: 60 },
    },
    textura: "lona",
    frente: {
      cuerpo: "M120 300C80 300 70 240 100 210C80 160 130 120 170 140C180 100 230 96 248 132C290 112 330 160 304 210C334 240 320 300 280 300Z",
      partes: [{ d: "M118 286L282 286L284 380Q200 392 116 380Z", tono: -0.04 }],
      costuras: ["M118 292L282 292", "M118 372Q200 384 282 372"],
      pliegues: ["M140 286Q150 230 140 190", "M200 286Q205 210 200 150", "M260 286Q250 230 262 190", "M110 230Q130 250 120 280", "M290 230Q270 250 280 280"],
      logo: { x: 200, y: 334, w: 44 },
      pecho: { x: 200, y: 334, w: 40 },
    },
  },

  mug: {
    foto: {
      archivo: "mug",
      suelo: 412,
      y: 0,
      alto: 500,
      logo: { x: 148, y: 230, w: 90 },
      pecho: { x: 148, y: 230, w: 60 },
      logoEspalda: { x: 148, y: 230, w: 56 },
      espejoEspalda: true,
    },
    textura: "ninguna",
    espejo: true,
    frente: {
      cuerpo: "M120 150L280 150L280 400Q280 420 260 420L140 420Q120 420 120 400Z",
      partes: [
        { d: "M280 200C350 200 350 350 280 350L280 326C322 326 322 224 280 224Z", tono: -0.04 },
        { d: "M120 150C120 132 280 132 280 150C280 168 120 168 120 150Z", tono: 0.08 },
        { d: "M128 150C128 138 272 138 272 150C272 160 128 160 128 150Z", tono: -0.4 },
        { d: "M138 168L150 168L150 404L138 404Z", tono: 0.5 },
      ],
      logo: { x: 200, y: 288, w: 92 },
      pecho: { x: 200, y: 288, w: 60 },
    },
    area: { x: 58, y: 110, w: 180, h: 240 },
  },

  panoleta: {
    textura: "tejido",
    frente: {
      cuerpo: "M200 60Q284 140 360 240Q284 336 200 420Q116 336 40 240Q116 140 200 60Z",
      ribetes: ["M200 86L334 240L200 394L66 240Z", "M200 104L316 240L200 376L84 240Z"],
      pliegues: ["M120 200Q160 240 120 280", "M280 200Q240 240 280 280"],
      logo: { x: 200, y: 240, w: 76 },
      pecho: { x: 200, y: 240, w: 60 },
    },
  },

  cartuchera: {
    foto: {
      archivo: "cartuchera",
      suelo: 350,
      y: 0,
      alto: 500,
      logo: { x: 245, y: 250, w: 50, rot: -8 },
      pecho: { x: 245, y: 250, w: 50, rot: -8 },
      logoEspalda: { x: 245, y: 250, w: 50, rot: -8 },
      espejoEspalda: true,
    },
    textura: "lona",
    frente: {
      cuerpo: "M70 220Q70 190 100 190L300 190Q330 190 330 220L330 330Q330 360 300 360L100 360Q70 360 70 330Z",
      partes: [
        { d: "M86 204L314 204L314 214L86 214Z", tono: -0.4 },
        { d: "M296 200L318 194L326 214L304 220Z", tono: 0, fijo: "#b9bcc0" },
      ],
      costuras: ["M80 220L320 220", "M80 200L320 200", "M78 344L322 344"],
      pliegues: ["M120 240Q130 290 120 340", "M280 240Q270 290 280 340"],
      logo: { x: 200, y: 284, w: 60 },
      pecho: { x: 200, y: 284, w: 50 },
    },
  },

  cinta: {
    textura: "tejido",
    frente: {
      cuerpo: "M200 40C300 40 300 330 214 380L186 380C100 330 100 40 200 40ZM200 62C276 62 276 320 206 360L194 360C124 320 124 62 200 62Z",
      partes: [
        { d: "M190 378L210 378L212 420Q200 440 188 420Z", tono: 0, fijo: "#b9bcc0" },
        { d: "M192 440a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z", tono: 0, fijo: "#9a9da1" },
      ],
      logo: { x: 136, y: 210, w: 30, rot: -82 },
      pecho: { x: 136, y: 210, w: 30, rot: -82 },
    },
  },

  manilla: {
    textura: "ninguna",
    bajar: 20,
    frente: {
      cuerpo: "M200 170C300 170 340 210 340 250C340 300 280 330 200 330C120 330 60 300 60 250C60 210 100 170 200 170ZM200 198C280 198 312 226 312 250C312 282 266 300 200 300C134 300 88 282 88 250C88 226 120 198 200 198Z",
      partes: [{ d: "M88 250C88 226 120 198 200 198C280 198 312 226 312 250C304 232 270 214 200 214C130 214 96 232 88 250Z", tono: -0.3 }],
      logo: { x: 200, y: 316, w: 30 },
      pecho: { x: 200, y: 316, w: 30 },
    },
  },
};
