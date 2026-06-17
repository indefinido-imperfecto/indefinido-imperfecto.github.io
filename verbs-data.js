/**
 * Spanisch Past Tenses Trainer - Verben & Übungsdaten
 * Modular aufgebaut: Weitere Zeiten können einfach in die Generierungslogik
 * und in die unregelmäßigen Verben integriert werden.
 */

// REGULÄRE VERBEN (Konjugationen werden beim Laden automatisch generiert)
const REGULAR_VERBS = [
  // -ar Verben
  { infinitive: "hablar", translation: "sprechen" },
  { infinitive: "cantar", translation: "singen" },
  { infinitive: "bailar", translation: "tanzen" },
  { infinitive: "estudiar", translation: "studieren / lernen" },
  { infinitive: "comprar", translation: "kaufen" },
  { infinitive: "trabajar", translation: "arbeiten" },
  { infinitive: "escuchar", translation: "hören / zuhören" },
  { infinitive: "viajar", translation: "reisen" },
  { infinitive: "cocinar", translation: "kochen" },
  { infinitive: "caminar", translation: "gehen / wandern" },
  { infinitive: "tomar", translation: "nehmen / trinken" },
  { infinitive: "mirar", translation: "schauen / anschauen" },
  { infinitive: "entrar", translation: "eintreten / hineingehen" },
  { infinitive: "llamar", translation: "rufen / anrufen" },
  { infinitive: "mandar", translation: "schicken / senden" },
  { infinitive: "llevar", translation: "tragen / bringen" },
  { infinitive: "usar", translation: "benutzten / gebrauchen" },
  { infinitive: "preparar", translation: "vorbereiten" },
  { infinitive: "esperar", translation: "warten / hoffen" },
  { infinitive: "necesitar", translation: "brauchen / benötigen" },
  { infinitive: "terminar", translation: "beenden" },
  { infinitive: "ganar", translation: "gewinnen / verdienen" },
  { infinitive: "pasar", translation: "verbringen / passieren" },
  { infinitive: "limpiar", translation: "putzen / reinigen" },
  { infinitive: "preguntar", translation: "fragen" },
  { infinitive: "contestar", translation: "antworten" },
  { infinitive: "desear", translation: "wünschen" },
  { infinitive: "llorar", translation: "weinen" },
  { infinitive: "celebrar", translation: "feiern" },
  { infinitive: "cambiar", translation: "ändern / wechseln" },
  { infinitive: "ayudar", translation: "helfen" },
  { infinitive: "visitar", translation: "besuchen" },
  { infinitive: "lavar", translation: "waschen" },
  { infinitive: "dibujar", translation: "zeichnen" },
  { infinitive: "enseñar", translation: "unterrichten / zeigen" },
  { infinitive: "invitar", translation: "einladen" },
  { infinitive: "regresar", translation: "zurückkehren" },
  { infinitive: "cortar", translation: "schneiden" },
  { infinitive: "cenar", translation: "zu Abend essen" },
  { infinitive: "desayunar", translation: "frühstücken" },
  { infinitive: "contar", translation: "zählen / erzählen" },
  { infinitive: "mostrar", translation: "zeigen" },
  { infinitive: "pensar", translation: "denken" },
  { infinitive: "volar", translation: "fliegen" },

  // -er Verben
  { infinitive: "comer", translation: "essen" },
  { infinitive: "beber", translation: "trinken" },
  { infinitive: "aprender", translation: "lernen" },
  { infinitive: "correr", translation: "rennen / laufen" },
  { infinitive: "vender", translation: "verkaufen" },
  { infinitive: "comprender", translation: "verstehen" },
  { infinitive: "deber", translation: "müssen / schulden" },
  { infinitive: "meter", translation: "stecken / hineintun" },
  { infinitive: "romper", translation: "zerbrechen / kaputt machen" },
  { infinitive: "prometer", translation: "versprechen" },
  { infinitive: "responder", translation: "antworten" },
  { infinitive: "coser", translation: "nähen" },
  { infinitive: "barrer", translation: "fegen" },
  { infinitive: "temer", translation: "fürchten" },
  { infinitive: "esconder", translation: "verstecken" },
  { infinitive: "volver", translation: "zurückkehren" },
  { infinitive: "conocer", translation: "kennen / kennenlernen" },
  { infinitive: "parecer", translation: "scheinen / aussehen" },
  { infinitive: "coger", translation: "nehmen / greifen" },

  // -ir Verben
  { infinitive: "vivir", translation: "leben / wohnen" },
  { infinitive: "escribir", translation: "schreiben" },
  { infinitive: "abrir", translation: "öffnen" },
  { infinitive: "recibir", translation: "erhalten / empfangen" },
  { infinitive: "decidir", translation: "entscheiden" },
  { infinitive: "subir", translation: "hinaufgehen / einsteigen" },
  { infinitive: "discutir", translation: "diskutieren / streiten" },
  { infinitive: "partir", translation: "teilen / abfahren" },
  { infinitive: "permitir", translation: "erlauben" },
  { infinitive: "descubrir", translation: "entdecken" },
  { infinitive: "insistir", translation: "insistieren / darauf bestehen" },
  { infinitive: "admitir", translation: "zugeben / zulassen" },
  { infinitive: "ocurrir", translation: "geschehen / einfallen" },
  { infinitive: "unir", translation: "vereinigen / verbinden" },
  { infinitive: "sufrir", translation: "leiden" },
  { infinitive: "imprimir", translation: "drucken" },
  { infinitive: "compartir", translation: "teilen" },
  { infinitive: "existir", translation: "existieren" },
  { infinitive: "asistir", translation: "anwesend sein / besuchen" },
  { infinitive: "definir", translation: "definieren" },
  { infinitive: "salir", translation: "hinausgehen / abfahren" },
  { infinitive: "distinguir", translation: "unterscheiden" }
];

// SPEZIELLE ORTHOGRAPHISCHE VERBEN (-car, -gar, -zar haben kleine Änderungen im Indefinido Yo)
const ORTHOGRAPHIC_VERBS = [
  { infinitive: "buscar", translation: "suchen" },
  { infinitive: "tocar", translation: "berühren / spielen (Instrument)" },
  { infinitive: "practicar", translation: "üben / praktizieren" },
  { infinitive: "explicar", translation: "erklären" },
  { infinitive: "sacar", translation: "herausnehmen" },
  { infinitive: "pagar", translation: "bezahlen" },
  { infinitive: "llegar", translation: "ankommen" },
  { infinitive: "jugar", translation: "spielen" },
  { infinitive: "apagar", translation: "ausschalten" },
  { infinitive: "entregar", translation: "übergeben / abgeben" },
  { infinitive: "empezar", translation: "anfangen / beginnen" },
  { infinitive: "comenzar", translation: "beginnen" },
  { infinitive: "cruzar", translation: "überqueren" },
  { infinitive: "organizar", translation: "organisieren" },
  { infinitive: "almorzar", translation: "zu Mittag essen" }
];

// UNREGELMÄSSIGE VERBEN (Inklusive starker Vergangenheiten wie saber, andar, poner)
const IRREGULAR_VERBS = [
  {
    infinitive: "ser",
    tier: 1,
    translation: "sein",
    tenses: {
      indefinido: { yo: "fui", tu: "fuiste", el: "fue", nosotros: "fuimos", vosotros: "fuisteis", ellos: "fueron" },
      imperfecto: { yo: "era", tu: "eras", el: "era", nosotros: "éramos", vosotros: "erais", ellos: "eran" }
    }
  },
  {
    infinitive: "ir",
    tier: 1,
    translation: "gehen / fahren",
    tenses: {
      indefinido: { yo: "fui", tu: "fuiste", el: "fue", nosotros: "fuimos", vosotros: "fuisteis", ellos: "fueron" },
      imperfecto: { yo: "iba", tu: "ibas", el: "iba", nosotros: "íbamos", vosotros: "ibais", ellos: "iban" }
    }
  },
  {
    infinitive: "ver",
    tier: 2,
    translation: "sehen",
    tenses: {
      indefinido: { yo: "vi", tu: "viste", el: "vio", nosotros: "vimos", vosotros: "visteis", ellos: "vieron" },
      imperfecto: { yo: "veía", tu: "veías", el: "veía", nosotros: "veíamos", vosotros: "veíais", ellos: "veían" }
    }
  },
  {
    infinitive: "dar",
    tier: 2,
    translation: "geben",
    tenses: {
      indefinido: { yo: "di", tu: "diste", el: "dio", nosotros: "dimos", vosotros: "disteis", ellos: "dieron" },
      imperfecto: { yo: "daba", tu: "dabas", el: "daba", nosotros: "dábamos", vosotros: "dabais", ellos: "daban" }
    }
  },
  {
    infinitive: "estar",
    tier: 1,
    translation: "sein / sich befinden",
    tenses: {
      indefinido: { yo: "estuve", tu: "estuviste", el: "estuvo", nosotros: "estuvimos", vosotros: "estuvisteis", ellos: "estuvieron" },
      imperfecto: { yo: "estaba", tu: "estabas", el: "estaba", nosotros: "estábamos", vosotros: "estabais", ellos: "estaban" }
    }
  },
  {
    infinitive: "tener",
    tier: 1,
    translation: "haben",
    tenses: {
      indefinido: { yo: "tuve", tu: "tuviste", el: "tuvo", nosotros: "tuvimos", vosotros: "tuvisteis", ellos: "tuvieron" },
      imperfecto: { yo: "tenía", tu: "tenías", el: "tenía", nosotros: "teníamos", vosotros: "teníais", ellos: "tenían" }
    }
  },
  {
    infinitive: "hacer",
    tier: 1,
    translation: "machen / tun",
    tenses: {
      indefinido: { yo: "hice", tu: "hiciste", el: "hizo", nosotros: "hicimos", vosotros: "hicisteis", ellos: "hicieron" },
      imperfecto: { yo: "hacía", tu: "hacías", el: "hacía", nosotros: "hacíamos", vosotros: "hacíais", ellos: "hacían" }
    }
  },
  {
    infinitive: "satisfacer",
    tier: 4,
    translation: "befriedigen / zufriedenstellen",
    tenses: {
      indefinido: { yo: "satisfice", tu: "satisficiste", el: "satisfizo", nosotros: "satisficimos", vosotros: "satisficisteis", ellos: "satisficieron" },
      imperfecto: { yo: "satisfacía", tu: "satisfacías", el: "satisfacía", nosotros: "satisfacíamos", vosotros: "satisfacíais", ellos: "satisfacían" }
    }
  },
  {
    infinitive: "poder",
    tier: 1,
    translation: "können / dürfen",
    tenses: {
      indefinido: { yo: "pude", tu: "pudiste", el: "pudo", nosotros: "pudimos", vosotros: "pudisteis", ellos: "pudieron" },
      imperfecto: { yo: "podía", tu: "podías", el: "podía", nosotros: "podíamos", vosotros: "podíais", ellos: "podían" }
    }
  },
  {
    infinitive: "poner",
    tier: 1,
    translation: "legen / stellen / setzen",
    tenses: {
      indefinido: { yo: "puse", tu: "pusiste", el: "puso", nosotros: "pusimos", vosotros: "pusisteis", ellos: "pusieron" },
      imperfecto: { yo: "ponía", tu: "ponías", el: "ponía", nosotros: "poníamos", vosotros: "poníais", ellos: "ponían" }
    }
  },
  {
    infinitive: "querer",
    tier: 1,
    translation: "wollen / lieben",
    tenses: {
      indefinido: { yo: "quise", tu: "quisiste", el: "quiso", nosotros: "quisimos", vosotros: "quisisteis", ellos: "quisieron" },
      imperfecto: { yo: "quería", tu: "querías", el: "quería", nosotros: "queríamos", vosotros: "queríais", ellos: "querían" }
    }
  },
  {
    infinitive: "saber",
    tier: 2,
    translation: "wissen / erfahren",
    tenses: {
      indefinido: { yo: "supe", tu: "supiste", el: "supo", nosotros: "supimos", vosotros: "supisteis", ellos: "supieron" },
      imperfecto: { yo: "sabía", tu: "sabías", el: "sabía", nosotros: "sabíamos", vosotros: "sabíais", ellos: "sabían" }
    }
  },
  {
    infinitive: "venir",
    tier: 1,
    translation: "kommen",
    tenses: {
      indefinido: { yo: "vine", tu: "viniste", el: "vino", nosotros: "vinimos", vosotros: "vinisteis", ellos: "vinieron" },
      imperfecto: { yo: "venía", tu: "venías", el: "venía", nosotros: "veníamos", vosotros: "veníais", ellos: "venían" }
    }
  },
  {
    infinitive: "decir",
    tier: 1,
    translation: "sagen",
    tenses: {
      indefinido: { yo: "dije", tu: "dijiste", el: "dijo", nosotros: "dijimos", vosotros: "dijisteis", ellos: "dijeron" },
      imperfecto: { yo: "decía", tu: "decías", el: "decía", nosotros: "decíamos", vosotros: "decíais", ellos: "decían" }
    }
  },
  {
    infinitive: "traer",
    tier: 2,
    translation: "bringen / herbringen",
    tenses: {
      indefinido: { yo: "traje", tu: "trajiste", el: "trajo", nosotros: "trajimos", vosotros: "trajisteis", ellos: "trajeron" },
      imperfecto: { yo: "traía", tu: "traías", el: "traía", nosotros: "traíamos", vosotros: "traíais", ellos: "traían" }
    }
  },
  {
    infinitive: "andar",
    tier: 2,
    translation: "gehen / laufen",
    tenses: {
      indefinido: { yo: "anduve", tu: "anduviste", el: "anduvo", nosotros: "anduvimos", vosotros: "anduvisteis", ellos: "anduvieron" },
      imperfecto: { yo: "andaba", tu: "andabas", el: "andaba", nosotros: "andábamos", vosotros: "andabais", ellos: "andaban" }
    }
  },
  {
    infinitive: "caber",
    tier: 2,
    translation: "hineinpassen",
    tenses: {
      indefinido: { yo: "cupe", tu: "cupiste", el: "cupo", nosotros: "cupimos", vosotros: "cupisteis", ellos: "cupieron" },
      imperfecto: { yo: "cabía", tu: "cabías", el: "cabía", nosotros: "cabíamos", vosotros: "cabíais", ellos: "cabían" }
    }
  },
  {
    infinitive: "conducir",
    tier: 2,
    translation: "fahren / leiten",
    tenses: {
      indefinido: { yo: "conduje", tu: "condujiste", el: "condujo", nosotros: "condujimos", vosotros: "condujisteis", ellos: "condujeron" },
      imperfecto: { yo: "conducía", tu: "conducías", el: "conducía", nosotros: "conducíamos", vosotros: "conducíais", ellos: "conducían" }
    }
  },
  {
    infinitive: "traducir",
    tier: 4,
    translation: "übersetzen",
    tenses: {
      indefinido: { yo: "traduje", tu: "tradujiste", el: "tradujo", nosotros: "tradujimos", vosotros: "tradujisteis", ellos: "tradujeron" },
      imperfecto: { yo: "traducía", tu: "traducías", el: "traducía", nosotros: "traducíamos", vosotros: "traducíais", ellos: "traducían" }
    }
  },
  {
    infinitive: "producir",
    tier: 4,
    translation: "produzieren",
    tenses: {
      indefinido: { yo: "produje", tu: "produjiste", el: "produjo", nosotros: "produjimos", vosotros: "produjisteis", ellos: "produjeron" },
      imperfecto: { yo: "producía", tu: "producías", el: "producía", nosotros: "producíamos", vosotros: "producíais", ellos: "producían" }
    }
  },
  {
    infinitive: "pedir",
    tier: 3,
    translation: "bitten / bestellen",
    tenses: {
      indefinido: { yo: "pedí", tu: "pediste", el: "pidió", nosotros: "pedimos", vosotros: "pedisteis", ellos: "pidieron" },
      imperfecto: { yo: "pedía", tu: "pedías", el: "pedía", nosotros: "pedíamos", vosotros: "pedíais", ellos: "pedían" }
    }
  },
  {
    infinitive: "dormir",
    tier: 3,
    translation: "schlafen",
    tenses: {
      indefinido: { yo: "dormí", tu: "dormiste", el: "durmió", nosotros: "dormimos", vosotros: "dormisteis", ellos: "durmieron" },
      imperfecto: { yo: "dormía", tu: "dormías", el: "dormía", nosotros: "dormíamos", vosotros: "dormíais", ellos: "dormían" }
    }
  },
  {
    infinitive: "morir",
    tier: 3,
    translation: "sterben",
    tenses: {
      indefinido: { yo: "morí", tu: "moriste", el: "murió", nosotros: "morimos", vosotros: "moristeis", ellos: "murieron" },
      imperfecto: { yo: "moría", tu: "morías", el: "moría", nosotros: "moríamos", vosotros: "moríais", ellos: "morían" }
    }
  },
  {
    infinitive: "sentir",
    tier: 3,
    translation: "fühlen / bedauern",
    tenses: {
      indefinido: { yo: "sentí", tu: "sentiste", el: "sintió", nosotros: "sentimos", vosotros: "sentisteis", ellos: "sintieron" },
      imperfecto: { yo: "sentía", tu: "sentías", el: "sentía", nosotros: "sentíamos", vosotros: "sentíais", ellos: "sentían" }
    }
  },
  {
    infinitive: "preferir",
    translation: "bevorzugen",
    tenses: {
      indefinido: { yo: "preferí", tu: "preferiste", el: "prefirió", nosotros: "preferimos", vosotros: "preferisteis", ellos: "prefirieron" },
      imperfecto: { yo: "prefería", tu: "preferías", el: "prefería", nosotros: "preferíamos", vosotros: "preferíais", ellos: "preferían" }
    }
  },
  {
    infinitive: "sugerir",
    tier: 3,
    translation: "vorschlagen",
    tenses: {
      indefinido: { yo: "sugerí", tu: "sugeriste", el: "sugirió", nosotros: "sugerimos", vosotros: "sugeristeis", ellos: "sugirieron" },
      imperfecto: { yo: "sugería", tu: "sugerías", el: "sugería", nosotros: "sugeríamos", vosotros: "sugeríais", ellos: "sugerían" }
    }
  },
  {
    infinitive: "servir",
    tier: 3,
    translation: "dienen / nützen",
    tenses: {
      indefinido: { yo: "serví", tu: "serviste", el: "sirvió", nosotros: "servimos", vosotros: "servisteis", ellos: "sirvieron" },
      imperfecto: { yo: "servía", tu: "servías", el: "servía", nosotros: "servíamos", vosotros: "servíais", ellos: "servían" }
    }
  },
  {
    infinitive: "vestir",
    tier: 3,
    translation: "anziehen / kleiden",
    tenses: {
      indefinido: { yo: "vestí", tu: "vestiste", el: "vistió", nosotros: "vestimos", vosotros: "vestisteis", ellos: "vistieron" },
      imperfecto: { yo: "vestía", tu: "vestías", el: "vestía", nosotros: "vestíamos", vosotros: "vestíais", ellos: "vestían" }
    }
  },
  {
    infinitive: "repetir",
    tier: 3,
    translation: "wiederholen",
    tenses: {
      indefinido: { yo: "repetí", tu: "repetiste", el: "repitió", nosotros: "repetimos", vosotros: "repetisteis", ellos: "repitieron" },
      imperfecto: { yo: "repetía", tu: "repetías", el: "repetía", nosotros: "repetíamos", vosotros: "repetíais", ellos: "repetían" }
    }
  },
  {
    infinitive: "seguir",
    tier: 3,
    translation: "folgen / weitermachen",
    tenses: {
      indefinido: { yo: "seguí", tu: "seguiste", el: "siguió", nosotros: "seguimos", vosotros: "seguisteis", ellos: "siguieron" },
      imperfecto: { yo: "seguía", tu: "seguías", el: "seguía", nosotros: "seguíamos", vosotros: "seguíais", ellos: "seguían" }
    }
  },
  {
    infinitive: "leer",
    tier: 3,
    translation: "lesen",
    tenses: {
      indefinido: { yo: "leí", tu: "leíste", el: "leyó", nosotros: "leímos", vosotros: "leísteis", ellos: "leyeron" },
      imperfecto: { yo: "leía", tu: "leías", el: "leía", nosotros: "leíamos", vosotros: "leíais", ellos: "leían" }
    }
  },
  {
    infinitive: "creer",
    tier: 3,
    translation: "glauben",
    tenses: {
      indefinido: { yo: "creí", tu: "creíste", el: "creyó", nosotros: "creímos", vosotros: "creísteis", ellos: "creyeron" },
      imperfecto: { yo: "creía", tu: "creías", el: "creía", nosotros: "creíamos", vosotros: "creíais", ellos: "creían" }
    }
  },
  {
    infinitive: "caer",
    tier: 3,
    translation: "fallen",
    tenses: {
      indefinido: { yo: "caí", tu: "caíste", el: "cayó", nosotros: "caímos", vosotros: "caísteis", ellos: "cayeron" },
      imperfecto: { yo: "caía", tu: "caías", el: "caía", nosotros: "caíamos", vosotros: "caíais", ellos: "caían" }
    }
  },
  {
    infinitive: "oír",
    tier: 3,
    translation: "hören",
    tenses: {
      indefinido: { yo: "oí", tu: "oíste", el: "oyó", nosotros: "oímos", vosotros: "oísteis", ellos: "oyeron" },
      imperfecto: { yo: "oía", tu: "oías", el: "oía", nosotros: "oíamos", vosotros: "oíais", ellos: "oían" }
    }
  },
  {
    infinitive: "destruir",
    tier: 3,
    translation: "zerstören",
    tenses: {
      indefinido: { yo: "destruí", tu: "destruiste", el: "destruyó", nosotros: "destruimos", vosotros: "destruisteis", ellos: "destruyeron" },
      imperfecto: { yo: "destruía", tu: "destruías", el: "destruía", nosotros: "destruíamos", vosotros: "destruíais", ellos: "destruían" }
    }
  },
  {
    infinitive: "construir",
    tier: 3,
    translation: "bauen / konstruieren",
    tenses: {
      indefinido: { yo: "construí", tu: "construiste", el: "construyó", nosotros: "construimos", vosotros: "construisteis", ellos: "construyeron" },
      imperfecto: { yo: "construía", tu: "construías", el: "construía", nosotros: "construíamos", vosotros: "construíais", ellos: "construían" }
    }
  },
  {
    infinitive: "haber",
    tier: 2,
    translation: "haben / geben (Hilfsverb)",
    tenses: {
      indefinido: { yo: "hube", tu: "hubiste", el: "hubo", nosotros: "hubimos", vosotros: "hubisteis", ellos: "hubieron" },
      imperfecto: { yo: "había", tu: "habías", el: "había", nosotros: "habíamos", vosotros: "habíais", ellos: "habían" }
    }
  },
  {
    infinitive: "mantener",
    tier: 4,
    translation: "aufrechterhalten",
    tenses: {
          "indefinido": {
                "yo": "mantuve",
                "tu": "mantuviste",
                "el": "mantuvo",
                "nosotros": "mantuvimos",
                "vosotros": "mantuvisteis",
                "ellos": "mantuvieron"
          },
          "imperfecto": {
                "yo": "mantenía",
                "tu": "mantenías",
                "el": "mantenía",
                "nosotros": "manteníamos",
                "vosotros": "manteníais",
                "ellos": "mantenían"
          }
    }
  },
  {
    infinitive: "contener",
    tier: 4,
    translation: "enthalten",
    tenses: {
          "indefinido": {
                "yo": "contuve",
                "tu": "contuviste",
                "el": "contuvo",
                "nosotros": "contuvimos",
                "vosotros": "contuvisteis",
                "ellos": "contuvieron"
          },
          "imperfecto": {
                "yo": "contenía",
                "tu": "contenías",
                "el": "contenía",
                "nosotros": "conteníamos",
                "vosotros": "conteníais",
                "ellos": "contenían"
          }
    }
  },
  {
    infinitive: "obtener",
    tier: 4,
    translation: "erhalten / erlangen",
    tenses: {
          "indefinido": {
                "yo": "obtuve",
                "tu": "obtuviste",
                "el": "obtuvo",
                "nosotros": "obtuvimos",
                "vosotros": "obtuvisteis",
                "ellos": "obtuvieron"
          },
          "imperfecto": {
                "yo": "obtenía",
                "tu": "obtenías",
                "el": "obtenía",
                "nosotros": "obteníamos",
                "vosotros": "obteníais",
                "ellos": "obtenían"
          }
    }
  },
  {
    infinitive: "detener",
    tier: 4,
    translation: "anhalten / festnehmen",
    tenses: {
          "indefinido": {
                "yo": "detuve",
                "tu": "detuviste",
                "el": "detuvo",
                "nosotros": "detuvimos",
                "vosotros": "detuvisteis",
                "ellos": "detuvieron"
          },
          "imperfecto": {
                "yo": "detenía",
                "tu": "detenías",
                "el": "detenía",
                "nosotros": "deteníamos",
                "vosotros": "deteníais",
                "ellos": "detenían"
          }
    }
  },
  {
    infinitive: "proponer",
    tier: 4,
    translation: "vorschlagen",
    tenses: {
          "indefinido": {
                "yo": "propuse",
                "tu": "propusiste",
                "el": "propuso",
                "nosotros": "propusimos",
                "vosotros": "propusisteis",
                "ellos": "propusieron"
          },
          "imperfecto": {
                "yo": "proponía",
                "tu": "proponías",
                "el": "proponía",
                "nosotros": "proponíamos",
                "vosotros": "proponíais",
                "ellos": "proponían"
          }
    }
  },
  {
    infinitive: "suponer",
    tier: 4,
    translation: "vermuten",
    tenses: {
          "indefinido": {
                "yo": "supuse",
                "tu": "supusiste",
                "el": "supuso",
                "nosotros": "supusimos",
                "vosotros": "supusisteis",
                "ellos": "supusieron"
          },
          "imperfecto": {
                "yo": "suponía",
                "tu": "suponías",
                "el": "suponía",
                "nosotros": "suponíamos",
                "vosotros": "suponíais",
                "ellos": "suponían"
          }
    }
  },
  {
    infinitive: "componer",
    tier: 4,
    translation: "komponieren / zusammensetzen",
    tenses: {
          "indefinido": {
                "yo": "compuse",
                "tu": "compusiste",
                "el": "compuso",
                "nosotros": "compusimos",
                "vosotros": "compusisteis",
                "ellos": "compusieron"
          },
          "imperfecto": {
                "yo": "componía",
                "tu": "componías",
                "el": "componía",
                "nosotros": "componíamos",
                "vosotros": "componíais",
                "ellos": "componían"
          }
    }
  },
  {
    infinitive: "deshacer",
    tier: 4,
    translation: "rückgängig machen / zerstören",
    tenses: {
          "indefinido": {
                "yo": "deshice",
                "tu": "deshiciste",
                "el": "deshizo",
                "nosotros": "deshicimos",
                "vosotros": "deshicisteis",
                "ellos": "deshicieron"
          },
          "imperfecto": {
                "yo": "deshacía",
                "tu": "deshacías",
                "el": "deshacía",
                "nosotros": "deshacíamos",
                "vosotros": "deshacíais",
                "ellos": "deshacían"
          }
    }
  },
  {
    infinitive: "rehacer",
    tier: 4,
    translation: "wiederholen / neu machen",
    tenses: {
          "indefinido": {
                "yo": "rehice",
                "tu": "rehiciste",
                "el": "rehizo",
                "nosotros": "rehicimos",
                "vosotros": "rehicisteis",
                "ellos": "rehicieron"
          },
          "imperfecto": {
                "yo": "rehacía",
                "tu": "rehacías",
                "el": "rehacía",
                "nosotros": "rehacíamos",
                "vosotros": "rehacíais",
                "ellos": "rehacían"
          }
    }
  },
  {
    infinitive: "convenir",
    tier: 4,
    translation: "übereinkommen / sich eignen",
    tenses: {
          "indefinido": {
                "yo": "convine",
                "tu": "conviniste",
                "el": "convino",
                "nosotros": "convinimos",
                "vosotros": "convinisteis",
                "ellos": "convinieron"
          },
          "imperfecto": {
                "yo": "convenía",
                "tu": "convenías",
                "el": "convenía",
                "nosotros": "conveníamos",
                "vosotros": "conveníais",
                "ellos": "convenían"
          }
    }
  },
  {
    infinitive: "prevenir",
    tier: 4,
    translation: "vorbeugen / warnen",
    tenses: {
          "indefinido": {
                "yo": "previne",
                "tu": "previniste",
                "el": "previno",
                "nosotros": "previnimos",
                "vosotros": "previnisteis",
                "ellos": "previnieron"
          },
          "imperfecto": {
                "yo": "prevenía",
                "tu": "prevenías",
                "el": "prevenía",
                "nosotros": "preveníamos",
                "vosotros": "preveníais",
                "ellos": "prevenían"
          }
    }
  },
  {
    infinitive: "intervenir",
    tier: 4,
    translation: "eingreifen / intervenieren",
    tenses: {
          "indefinido": {
                "yo": "intervine",
                "tu": "interviniste",
                "el": "intervino",
                "nosotros": "intervinimos",
                "vosotros": "intervinisteis",
                "ellos": "intervinieron"
          },
          "imperfecto": {
                "yo": "intervenía",
                "tu": "intervenías",
                "el": "intervenía",
                "nosotros": "interveníamos",
                "vosotros": "interveníais",
                "ellos": "intervenían"
          }
    }
  },
  {
    infinitive: "deducir",
    tier: 4,
    translation: "ableiten / schlussfolgern",
    tenses: {
          "indefinido": {
                "yo": "deduje",
                "tu": "dedujiste",
                "el": "dedujo",
                "nosotros": "dedujimos",
                "vosotros": "dedujisteis",
                "ellos": "dedujeron"
          },
          "imperfecto": {
                "yo": "deducía",
                "tu": "deducías",
                "el": "deducía",
                "nosotros": "deducíamos",
                "vosotros": "deducíais",
                "ellos": "deducían"
          }
    }
  },
  {
    infinitive: "reducir",
    tier: 4,
    translation: "reduzieren",
    tenses: {
          "indefinido": {
                "yo": "reduje",
                "tu": "redujiste",
                "el": "redujo",
                "nosotros": "redujimos",
                "vosotros": "redujisteis",
                "ellos": "redujeron"
          },
          "imperfecto": {
                "yo": "reducía",
                "tu": "reducías",
                "el": "reducía",
                "nosotros": "reducíamos",
                "vosotros": "reducíais",
                "ellos": "reducían"
          }
    }
  },
  {
    infinitive: "introducir",
    tier: 4,
    translation: "einführen",
    tenses: {
          "indefinido": {
                "yo": "introduje",
                "tu": "introdujiste",
                "el": "introdujo",
                "nosotros": "introdujimos",
                "vosotros": "introdujisteis",
                "ellos": "introdujeron"
          },
          "imperfecto": {
                "yo": "introducía",
                "tu": "introducías",
                "el": "introducía",
                "nosotros": "introducíamos",
                "vosotros": "introducíais",
                "ellos": "introducían"
          }
    }
  },
  {
    infinitive: "huir",
    tier: 3,
    translation: "fliehen",
    tenses: {
          "indefinido": {
                "yo": "huí",
                "tu": "huíste",
                "el": "huyó",
                "nosotros": "huímos",
                "vosotros": "huísteis",
                "ellos": "huyeron"
          },
          "imperfecto": {
                "yo": "huía",
                "tu": "huías",
                "el": "huía",
                "nosotros": "huíamos",
                "vosotros": "huíais",
                "ellos": "huían"
          }
    }
  },
  {
    infinitive: "sonreír",
    tier: 3,
    translation: "lächeln",
    tenses: {
          "indefinido": {
                "yo": "sonreí",
                "tu": "sonreíste",
                "el": "sonrió",
                "nosotros": "sonreímos",
                "vosotros": "sonreísteis",
                "ellos": "sonrieron"
          },
          "imperfecto": {
                "yo": "sonreía",
                "tu": "sonreías",
                "el": "sonreía",
                "nosotros": "sonreíamos",
                "vosotros": "sonreíais",
                "ellos": "sonreían"
          }
    }
  },
  {
    infinitive: "freír",
    tier: 3,
    translation: "braten / frittieren",
    tenses: {
          "indefinido": {
                "yo": "freí",
                "tu": "freíste",
                "el": "frió",
                "nosotros": "freímos",
                "vosotros": "freísteis",
                "ellos": "frieron"
          },
          "imperfecto": {
                "yo": "freía",
                "tu": "freías",
                "el": "freía",
                "nosotros": "freíamos",
                "vosotros": "freíais",
                "ellos": "freían"
          }
    }
  },
  {
    infinitive: "reír",
    tier: 3,
    translation: "lachen",
    tenses: {
          "indefinido": {
                "yo": "reí",
                "tu": "reíste",
                "el": "rió",
                "nosotros": "reímos",
                "vosotros": "reísteis",
                "ellos": "rieron"
          },
          "imperfecto": {
                "yo": "reía",
                "tu": "reías",
                "el": "reía",
                "nosotros": "reíamos",
                "vosotros": "reíais",
                "ellos": "reían"
          }
    }
  },
  {
    infinitive: "elegir",
    tier: 3,
    translation: "auswählen / wählen",
    tenses: {
          "indefinido": {
                "yo": "elegí",
                "tu": "elegiste",
                "el": "eligió",
                "nosotros": "elegimos",
                "vosotros": "elegisteis",
                "ellos": "eligieron"
          },
          "imperfecto": {
                "yo": "elegía",
                "tu": "elegías",
                "el": "elegía",
                "nosotros": "elegíamos",
                "vosotros": "elegíais",
                "ellos": "elegían"
          }
    }
  },
  {
    infinitive: "corregir",
    tier: 3,
    translation: "korrigieren",
    tenses: {
          "indefinido": {
                "yo": "corregí",
                "tu": "corregiste",
                "el": "corrigió",
                "nosotros": "corregimos",
                "vosotros": "corregisteis",
                "ellos": "corrigieron"
          },
          "imperfecto": {
                "yo": "corregía",
                "tu": "corregías",
                "el": "corregía",
                "nosotros": "corregíamos",
                "vosotros": "corregíais",
                "ellos": "corregían"
          }
    }
  },
  {
    infinitive: "conseguir",
    tier: 3,
    translation: "erreichen / bekommen",
    tenses: {
          "indefinido": {
                "yo": "conseguí",
                "tu": "conseguiste",
                "el": "consiguió",
                "nosotros": "conseguimos",
                "vosotros": "conseguisteis",
                "ellos": "consiguieron"
          },
          "imperfecto": {
                "yo": "conseguía",
                "tu": "conseguías",
                "el": "conseguía",
                "nosotros": "conseguíamos",
                "vosotros": "conseguíais",
                "ellos": "conseguían"
          }
    }
  },
  {
    infinitive: "perseguir",
    tier: 3,
    translation: "verfolgen",
    tenses: {
          "indefinido": {
                "yo": "perseguí",
                "tu": "perseguiste",
                "el": "persiguió",
                "nosotros": "perseguimos",
                "vosotros": "perseguisteis",
                "ellos": "persiguieron"
          },
          "imperfecto": {
                "yo": "perseguía",
                "tu": "perseguías",
                "el": "perseguía",
                "nosotros": "perseguíamos",
                "vosotros": "perseguíais",
                "ellos": "perseguían"
          }
    }
  },
  {
    infinitive: "divertir",
    tier: 3,
    translation: "unterhalten / Spaß machen",
    tenses: {
          "indefinido": {
                "yo": "divertí",
                "tu": "divertiste",
                "el": "divirtió",
                "nosotros": "divertimos",
                "vosotros": "divertisteis",
                "ellos": "divirtieron"
          },
          "imperfecto": {
                "yo": "divertía",
                "tu": "divertías",
                "el": "divertía",
                "nosotros": "divertíamos",
                "vosotros": "divertíais",
                "ellos": "divertían"
          }
    }
  },
  {
    infinitive: "convertir",
    tier: 3,
    translation: "verwandeln / konvertieren",
    tenses: {
          "indefinido": {
                "yo": "convertí",
                "tu": "convertiste",
                "el": "convirtió",
                "nosotros": "convertimos",
                "vosotros": "convertisteis",
                "ellos": "convirtieron"
          },
          "imperfecto": {
                "yo": "convertía",
                "tu": "convertías",
                "el": "convertía",
                "nosotros": "convertíamos",
                "vosotros": "convertíais",
                "ellos": "convertían"
          }
    }
  },
  {
    infinitive: "advertir",
    tier: 3,
    translation: "warnen / bemerken",
    tenses: {
          "indefinido": {
                "yo": "advertí",
                "tu": "advertiste",
                "el": "advirtió",
                "nosotros": "advertimos",
                "vosotros": "advertisteis",
                "ellos": "advirtieron"
          },
          "imperfecto": {
                "yo": "advertía",
                "tu": "advertías",
                "el": "advertía",
                "nosotros": "advertíamos",
                "vosotros": "advertíais",
                "ellos": "advertían"
          }
    }
  },
  {
    infinitive: "mentir",
    tier: 3,
    translation: "lügen",
    tenses: {
          "indefinido": {
                "yo": "mentí",
                "tu": "mentiste",
                "el": "mintió",
                "nosotros": "mentimos",
                "vosotros": "mentisteis",
                "ellos": "mintieron"
          },
          "imperfecto": {
                "yo": "mentía",
                "tu": "mentías",
                "el": "mentía",
                "nosotros": "mentíamos",
                "vosotros": "mentíais",
                "ellos": "mentían"
          }
    }
  },
  {
    infinitive: "herir",
    tier: 3,
    translation: "verletzen",
    tenses: {
          "indefinido": {
                "yo": "herí",
                "tu": "heriste",
                "el": "hirió",
                "nosotros": "herimos",
                "vosotros": "heristeis",
                "ellos": "hirieron"
          },
          "imperfecto": {
                "yo": "hería",
                "tu": "herías",
                "el": "hería",
                "nosotros": "heríamos",
                "vosotros": "heríais",
                "ellos": "herían"
          }
    }
  },
  {
    infinitive: "hervir",
    tier: 3,
    translation: "kochen / sieden",
    tenses: {
          "indefinido": {
                "yo": "herví",
                "tu": "herviste",
                "el": "hirvió",
                "nosotros": "hervimos",
                "vosotros": "hervisteis",
                "ellos": "hirvieron"
          },
          "imperfecto": {
                "yo": "hervía",
                "tu": "hervías",
                "el": "hervía",
                "nosotros": "hervíamos",
                "vosotros": "hervíais",
                "ellos": "hervían"
          }
    }
  },
  {
    infinitive: "medir",
    tier: 3,
    translation: "messen",
    tenses: {
          "indefinido": {
                "yo": "medí",
                "tu": "mediste",
                "el": "midió",
                "nosotros": "medimos",
                "vosotros": "medisteis",
                "ellos": "midieron"
          },
          "imperfecto": {
                "yo": "medía",
                "tu": "medías",
                "el": "medía",
                "nosotros": "medíamos",
                "vosotros": "medíais",
                "ellos": "medían"
          }
    }
  },
  {
    infinitive: "despedir",
    tier: 3,
    translation: "verabschieden / entlassen",
    tenses: {
          "indefinido": {
                "yo": "despedí",
                "tu": "despediste",
                "el": "despidió",
                "nosotros": "despedimos",
                "vosotros": "despedisteis",
                "ellos": "despidieron"
          },
          "imperfecto": {
                "yo": "despedía",
                "tu": "despedías",
                "el": "despedía",
                "nosotros": "despedíamos",
                "vosotros": "despedíais",
                "ellos": "despedían"
          }
    }
  },
  {
    infinitive: "impedir",
    tier: 3,
    translation: "verhindern",
    tenses: {
          "indefinido": {
                "yo": "impedí",
                "tu": "impediste",
                "el": "impidió",
                "nosotros": "impedimos",
                "vosotros": "impedisteis",
                "ellos": "impidieron"
          },
          "imperfecto": {
                "yo": "impedía",
                "tu": "impedías",
                "el": "impedía",
                "nosotros": "impedíamos",
                "vosotros": "impedíais",
                "ellos": "impedían"
          }
    }
  }
];

// KONTEXT-ÜBUNGEN (Lückentexte mit Signalwörtern, didaktischen Erklärungen und Übersetzungen)
const CONTEXT_EXERCISES = [
  {
    "sentence": "Marta me ___ (llamar) a las seis, hora española.",
    "verb": "llamar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "llamó",
    "translation": "Marta rief mich um sechs Uhr spanischer Zeit an.",
    "explanation": "Eine punktuelle Angabe der Uhrzeit ('a las seis') fordert das Indefinido -> llamó."
  },
  {
    "sentence": "Marta me llamó solo para hablar; solo se ___ (sentir) sola. (ihre damalige Gemütslage)",
    "verb": "sentir",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "sentía",
    "translation": "Marta rief mich nur an, um zu reden; sie fühlte sich einfach einsam.",
    "explanation": "Beschreibung von Gefühlen oder mentalen Zuständen in der Vergangenheit -> Imperfecto."
  },
  {
    "sentence": "Porque Sebas se ___ (marchar) de vuelta a Buenos Aires.",
    "verb": "marchar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "marchó",
    "translation": "Weil Sebas wieder zurück nach Buenos Aires weggegangen ist.",
    "explanation": "Eine abgeschlossene, einmalige Handlung in der Vergangenheit -> Indefinido."
  },
  {
    "sentence": "El dinero se ___ (acabar), ya no hay sitio para nadie.",
    "verb": "acabar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "acabó",
    "translation": "Das Geld ging zu Ende, es gibt keinen Platz mehr für niemanden.",
    "explanation": "Ein abgeschlossener Vorgang, das Ende einer Ressource in der Vergangenheit -> Indefinido."
  },
  {
    "sentence": "Son mis amigos; en la calle ___ (pasar) las horas.",
    "verb": "pasar",
    "person": "nosotros",
    "correctTense": "imperfecto",
    "correctAnswer": "pasábamos",
    "translation": "Es sind meine Freunde, auf der Straße verbrachten wir die Stunden.",
    "explanation": "Gewohnheiten oder wiederholte Handlungen in der Vergangenheit ('pasábamos las horas') -> Imperfecto."
  },
  {
    "sentence": "Carlos me ___ (contar) que a su hermana la echaron del trabajo.",
    "verb": "contar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "contó",
    "translation": "Carlos erzählte mir, dass seine Schwester gefeuert wurde.",
    "explanation": "Das Berichten einer abgeschlossenen Handlung oder Mitteilung in der Vergangenheit -> Indefinido."
  },
  {
    "sentence": "A su hermana la ___ (echar) del trabajo sin saber por qué.",
    "verb": "echar",
    "person": "ellos",
    "correctTense": "indefinido",
    "correctAnswer": "echaron",
    "translation": "Seine Schwester wurde gefeuert (entlassen), ohne zu wissen warum.",
    "explanation": "Eine punktuelle, abgeschlossene Handlung in der Vergangenheit -> Indefinido."
  },
  {
    "sentence": "No le ___ (dar) ni las gracias porque estaba sin contrato.",
    "verb": "dar",
    "person": "ellos",
    "correctTense": "indefinido",
    "correctAnswer": "dieron",
    "translation": "Sie sagten ihr nicht einmal danke, weil sie keinen Vertrag hatte.",
    "explanation": "Eine abgeschlossene Aktion (oder das Fehlen davon) -> Indefinido."
  },
  {
    "sentence": "No le dieron ni las gracias porque ___ (estar) sin contrato. (die Umstände der Entlassung)",
    "verb": "estar",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "estaba",
    "translation": "Sie sagten ihr nicht einmal danke, weil sie ohne Vertrag war.",
    "explanation": "Die Beschreibung der Hintergrundumstände (keinen Vertrag zu haben) -> Imperfecto."
  },
  {
    "sentence": "Aquella misma tarde nosotros ___ (ir) a celebrarlo.",
    "verb": "ir",
    "person": "nosotros",
    "correctTense": "indefinido",
    "correctAnswer": "fuimos",
    "translation": "Genau an diesem Nachmittag gingen wir, um es zu feiern.",
    "explanation": "Ein konkreter Zeitpunkt ('aquella misma tarde') verlangt das Indefinido -> fuimos."
  },
  {
    "sentence": "Alicia ___ (ir) a vivir a Barcelona y hoy ha venido a mi memoria.",
    "verb": "ir",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "fue",
    "translation": "Alicia zog nach Barcelona (ging dorthin um zu leben) und heute kam sie mir in den Sinn.",
    "explanation": "Eine abgeschlossene, punktuelle Veränderung in der Vergangenheit -> Indefinido."
  },
  {
    "sentence": "Claudia ___ (tener) un hijo y de Guille no sé nada.",
    "verb": "tener",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "tuvo",
    "translation": "Claudia bekam ein Kind und von Guille weiß ich nichts.",
    "explanation": "Ein punktuelles Lebensereignis (ein Kind bekommen/gebären) -> Indefinido."
  },
  {
    "sentence": "La colonización española en América ___ (empezar) a mediados del siglo XV.",
    "verb": "empezar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "empezó",
    "translation": "Die spanische Kolonisation in Amerika begann Mitte des 15. Jahrhunderts.",
    "explanation": "Der Startpunkt eines historischen Prozesses ist ein abgeschlossenes Ereignis -> Indefinido."
  },
  {
    "sentence": "Cuando los turcos ___ (cortar) las rutas de comercio en el Mar Mediterráneo.",
    "verb": "cortar",
    "person": "ellos",
    "correctTense": "indefinido",
    "correctAnswer": "cortaron",
    "translation": "Als die Türken die Handelsrouten im Mittelmeer abschnitten.",
    "explanation": "Eine punktuelle, den Fluss der Geschichte verändernde Aktion -> Indefinido."
  },
  {
    "sentence": "En ese momento ___ (ser) necesario buscar otras rutas de comercio.",
    "verb": "ser",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "fue",
    "translation": "In diesem Moment wurde es notwendig, andere Routen zu suchen.",
    "explanation": "Der Eintritt einer Notwendigkeit in einem konkreten historischen Moment -> Indefinido."
  },
  {
    "sentence": "Después de 1492, la Corona Española ___ (someter) a los pueblos indígenas.",
    "verb": "someter",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "sometió",
    "translation": "Nach 1492 unterwarf die spanische Krone die indigenen Völker.",
    "explanation": "Historische, abgeschlossene Ereignisse in der Vergangenheit -> Indefinido."
  },
  {
    "sentence": "La Corona Española los ___ (evangelizar) y tomó parte de sus riquezas.",
    "verb": "evangelizar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "evangelizó",
    "translation": "Die spanische Krone missionierte (evangelisierte) sie und nahm einen Teil ihres Reichtums.",
    "explanation": "Historisch abgeschlossener Vorgang -> Indefinido."
  },
  {
    "sentence": "La Corona ___ (tomar) parte de las riquezas de los pueblos indígenas.",
    "verb": "tomar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "tomó",
    "translation": "Die Krone nahm einen Teil der Reichtümer der indigenen Völker.",
    "explanation": "Abgeschlossene Handlung der Geschichte -> Indefinido."
  },
  {
    "sentence": "El idioma español ___ (ser) muy importante para unir a la sociedad colonial. (Bedeutung der Sprache in der Geschichte)",
    "verb": "ser",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "fue",
    "translation": "Die spanische Sprache war sehr wichtig, um die Kolonialgesellschaft zu vereinen.",
    "explanation": "Rückblickende Bewertung einer abgeschlossenen historischen Epoche -> Indefinido."
  },
  {
    "sentence": "El idioma español ___ (ser) muy importante para unir a la sociedad colonial. (Sprache und Kolonialgesellschaft)",
    "verb": "ser",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "era",
    "translation": "Die spanische Sprache war [fortlaufend] sehr wichtig, um die Kolonialgesellschaft zu vereinen.",
    "explanation": "Beschreibung einer dauerhaften, aktiven Funktion während der Kolonialzeit -> Imperfecto."
  },
  {
    "sentence": "El español se ___ (convertir) en el idioma oficial del Imperio.",
    "verb": "convertir",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "convirtió",
    "translation": "Spanisch wurde (verwandelte sich in) zur offiziellen Sprache des Imperiums.",
    "explanation": "Ein historischer Wandlungsprozess, der zu einem bestimmten Zeitpunkt stattfand -> Indefinido."
  },
  {
    "sentence": "También ___ (haber) mucha influencia en la arquitectura y en la gastronomía.",
    "verb": "haber",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "hubo",
    "translation": "Es gab auch viel Einfluss in der Architektur und der Gastronomie.",
    "explanation": "Das Eintreten/Vorhandensein von Einflüssen in einer abgeschlossenen historischen Periode -> Indefinido."
  },
  {
    "sentence": "El español también ___ (tomar) palabras de los idiomas precolombinos.",
    "verb": "tomar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "tomó",
    "translation": "Das Spanische übernahm auch Wörter aus den präkolumbischen Sprachen.",
    "explanation": "Abgeschlossener historischer Prozess -> Indefinido."
  },
  {
    "sentence": "Cuando en 1804, Napoleón ___ (invadir) España.",
    "verb": "invadir",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "invadió",
    "translation": "Als Napoleon 1804 in Spanien einfiel.",
    "explanation": "Eine konkrete Jahreszahl grenzt die historische Invasion ein -> Indefinido."
  },
  {
    "sentence": "La fuerza española en las colonias se ___ (debilitar).",
    "verb": "debilitar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "debilitó",
    "translation": "Die spanische Macht in den Kolonien schwächte sich ab.",
    "explanation": "Ein historisches Ereignis, das eintrat -> Indefinido."
  },
  {
    "sentence": "En Sudamérica ___ (aparecer) juntas de criollos que querían la independencia.",
    "verb": "aparecer",
    "person": "ellos",
    "correctTense": "indefinido",
    "correctAnswer": "aparecieron",
    "translation": "In Südamerika entstanden (erschienen) Räte von Kreolen, die die Unabhängigkeit wollten.",
    "explanation": "Das historische Auftauchen einer neuen Bewegung -> Indefinido."
  },
  {
    "sentence": "La primera reunión con éxito ___ (tener lugar) en 1810 en Buenos Aires.",
    "verb": "tener lugar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "tuvo lugar",
    "translation": "Das erste erfolgreiche Treffen fand 1810 in Buenos Aires statt.",
    "explanation": "Historisches Ereignis mit konkretem Datum -> Indefinido."
  },
  {
    "sentence": "En ese momento ___ (comenzar) el proceso de independencia.",
    "verb": "comenzar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "comenzó",
    "translation": "In diesem Moment begann der Unabhängigkeitsprozess.",
    "explanation": "Der Startpunkt eines Prozesses zu einem bestimmten Zeitpunkt -> Indefinido."
  },
  {
    "sentence": "El proceso de independencia ___ (terminar) en 1824.",
    "verb": "terminar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "terminó",
    "translation": "Der Unabhängigkeitsprozess endete im Jahr 1824.",
    "explanation": "Der Endpunkt eines historischen Ereignisses -> Indefinido."
  },
  {
    "sentence": "Los primeros países independientes ___ (ser) Argentina, Chile y otros.",
    "verb": "ser",
    "person": "ellos",
    "correctTense": "indefinido",
    "correctAnswer": "fueron",
    "translation": "Die ersten unabhängigen Länder waren Argentinien, Chile und andere.",
    "explanation": "Abgeschlossenes historisches Faktum -> Indefinido."
  },
  {
    "sentence": "Las últimas colonias se ___ (perder) en 1898.",
    "verb": "perder",
    "person": "ellos",
    "correctTense": "indefinido",
    "correctAnswer": "perdieron",
    "translation": "Die letzten Kolonien gingen 1898 verloren.",
    "explanation": "Ein abgeschlossener Verlust in einem konkreten Jahr -> Indefinido."
  },
  {
    "sentence": "El Gobierno español las ___ (vender) a Estados Unidos.",
    "verb": "vender",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "vendió",
    "translation": "Die spanische Regierung verkaufte sie an die Vereinigten Staaten.",
    "explanation": "Abgeschlossener historischer Verkauf -> Indefinido."
  },
  {
    "sentence": "La guerra ___ (ser) lejana y presente al mismo tiempo.",
    "verb": "ser",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "era",
    "translation": "Der Krieg war fern und gegenwärtig zugleich.",
    "explanation": "Beschreibung einer Atmosphäre oder eines Zustands in der Vergangenheit -> Imperfecto."
  },
  {
    "sentence": "Desde la Península ___ (llegar) noticias por la radio. (Kriegsalltag)",
    "verb": "llegar",
    "person": "ellos",
    "correctTense": "imperfecto",
    "correctAnswer": "llegaban",
    "translation": "Vom Festland trafen fortlaufend Nachrichten über das Radio ein.",
    "explanation": "Wiederkehrende, andauernde Hintergrundvorgänge in der Vergangenheit -> Imperfecto."
  },
  {
    "sentence": "La gente, en sus casas, ___ (marcar) el recorrido del ejército en los mapas. (Reaktion der Bevölkerung)",
    "verb": "marcar",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "marcaba",
    "translation": "Die Menschen markierten in ihren Häusern den Weg der Armee auf den Karten.",
    "explanation": "Gewohnheitsmäßige oder andauernde Handlungen in der Vergangenheit -> Imperfecto."
  },
  {
    "sentence": "Yo, sola en casa, me ___ (informar) sobre lo que pasaba. (ihre Tagesroutine)",
    "verb": "informar",
    "person": "yo",
    "correctTense": "imperfecto",
    "correctAnswer": "informaba",
    "translation": "Ich informierte mich alleine zu Hause über das, was geschah.",
    "explanation": "Ein andauernder Zustand oder regelmäßiger Prozess in der Vergangenheit -> Imperfecto."
  },
  {
    "sentence": "Yo me informaba sobre lo que ___ (pasar) en mi país. (die allgemeine Lage)",
    "verb": "pasar",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "pasaba",
    "translation": "Ich informierte mich über das, was in meinem Land geschah.",
    "explanation": "Hintergrundgeschehen in der Vergangenheit (Zustand) -> Imperfecto."
  },
  {
    "sentence": "Solo ___ (comprar) una cosa en esos meses: una radio nueva.",
    "verb": "comprar",
    "person": "yo",
    "correctTense": "indefinido",
    "correctAnswer": "compré",
    "translation": "Ich kaufte nur eine einzige Sache in diesen Monaten: ein neues Radio.",
    "explanation": "Ein konkreter, einmaliger Kaufakt in der Vergangenheit -> Indefinido."
  },
  {
    "sentence": "Esa compra ___ (ser) una radio nueva.",
    "verb": "ser",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "fue",
    "translation": "Dieser Kauf war ein neues Radio.",
    "explanation": "Bezieht sich auf die einmalige Kaufhandlung -> Indefinido."
  },
  {
    "sentence": "Gracias a la radio, yo ___ (saber) antes de fin de año que el gobierno estaba en Valencia.",
    "verb": "saber",
    "person": "yo",
    "correctTense": "indefinido",
    "correctAnswer": "supe",
    "translation": "Dank des Radios erfuhr (wusste plötzlich) ich vor Jahresende, dass die Regierung in Valencia war.",
    "explanation": "Achtung: 'saber' im Sinne von 'etwas erfahren' (Erkenntnismoment) steht im Indefinido -> supe."
  },
  {
    "sentence": "El gobierno de la República ___ (estar) en Valencia.",
    "verb": "estar",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "estaba",
    "translation": "Die Regierung der Republik befand sich in Valencia.",
    "explanation": "Zustandsbeschreibung eines Aufenthaltsortes in der Vergangenheit -> Imperfecto."
  },
  {
    "sentence": "La gente ___ (tener) que defender Madrid.",
    "verb": "tener",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "tenía",
    "translation": "Die Menschen mussten (hatten die Pflicht) Madrid verteidigen.",
    "explanation": "Beschreibung einer anhaltenden Pflicht oder Notwendigkeit (Hintergrund) -> Imperfecto."
  },
  {
    "sentence": "___ (llegar) las Brigadas Internacionales a ayudar a los republicanos.",
    "verb": "llegar",
    "person": "ellos",
    "correctTense": "indefinido",
    "correctAnswer": "llegaron",
    "translation": "Die Internationalen Brigaden trafen ein, um den Republikanern zu helfen.",
    "explanation": "Ein neu einsetzendes, abgeschlossenes historisches Ereignis -> Indefinido."
  },
  {
    "sentence": "Hitler y Mussolini ___ (reconocer) la legitimidad de Franco.",
    "verb": "reconocer",
    "person": "ellos",
    "correctTense": "indefinido",
    "correctAnswer": "reconocieron",
    "translation": "Hitler und Mussolini erkannten die Legitimität Francos an.",
    "explanation": "Ein offizieller, einmaliger Anerkennungsakt in der Vergangenheit -> Indefinido."
  },
  {
    "sentence": "___ (matar) a José Antonio Primo de Rivera en la cárcel.",
    "verb": "matar",
    "person": "ellos",
    "correctTense": "indefinido",
    "correctAnswer": "mataron",
    "translation": "Sie töteten José Antonio Primo de Rivera im Gefängnis.",
    "explanation": "Ein punktuelles, abgeschlossenes Ereignis (Hinrichtung) -> Indefinido."
  },
  {
    "sentence": "Y yo ___ (ahorrar) ciento ochenta libras.",
    "verb": "ahorrar",
    "person": "yo",
    "correctTense": "indefinido",
    "correctAnswer": "ahorré",
    "translation": "Und ich sparte einhundertachtzig Pfund an.",
    "explanation": "Ein abgeschlossener Sparprozess (das Resultat steht fest) -> Indefinido."
  },
  {
    "sentence": "Yo ___ (pasar) aquella primera Nochebuena africana en la pensión.",
    "verb": "pasar",
    "person": "yo",
    "correctTense": "indefinido",
    "correctAnswer": "pasé",
    "translation": "Ich verbrachte jenen ersten afrikanischen Heiligabend in der Pension.",
    "explanation": "Ein konkreter, zeitlich begrenzter Zeitraum (jener Heiligabend) -> Indefinido."
  },
  {
    "sentence": "Yo ___ (querer) rechazar la invitación, pero la dueña me convenció.",
    "verb": "querer",
    "person": "yo",
    "correctTense": "imperfecto",
    "correctAnswer": "quería",
    "translation": "Ich wollte die Einladung eigentlich ablehnen, aber die Besitzerin überredete mich.",
    "explanation": "Ein anhaltendes Wollen oder Zögern (Gefühlszustand im Hintergrund) -> Imperfecto."
  },
  {
    "sentence": "La dueña de la pensión me ___ (convencer) una vez más.",
    "verb": "convencer",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "convenció",
    "translation": "Die Pensionsbesitzerin überredete (überzeugte) mich noch einmal.",
    "explanation": "Ein punktuelles, erfolgreiches Ereignis in der Vergangenheit -> Indefinido."
  },
  {
    "sentence": "Malinalli ___ (lavar) ropa en un río, en las afueras de Cholula.",
    "verb": "lavar",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "lavaba",
    "translation": "Malinalli wusch Wäsche in einem Fluss, außerhalb von Cholula.",
    "explanation": "Beschreibung einer im Hintergrund andauernden Handlung (Szenenbeschreibung) -> Imperfecto."
  },
  {
    "sentence": "Ella ___ (estar) molesta. (Malinellis Stimmung)",
    "verb": "estar",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "estaba",
    "translation": "Sie war verärgert.",
    "explanation": "Beschreibung eines andauernden mentalen Zustands in der Vergangenheit -> Imperfecto."
  },
  {
    "sentence": "Ella ___ (estar) molesta. (ihre Reaktion)",
    "verb": "estar",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "estuvo",
    "translation": "Sie war (kurz) verärgert (und hatte sich danach wieder beruhigt).",
    "explanation": "'Estuvo molesta' bedeutet, dass der Ärger ein klar abgeschlossenes Ende hatte -> Indefinido."
  },
  {
    "sentence": "En el río ___ (haber) mucho ruido. Demasiado.",
    "verb": "haber",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "había",
    "translation": "Am Fluss gab es viel Lärm. Zu viel.",
    "explanation": "Beschreibung der Atmosphäre/Umgebung in der Vergangenheit -> Imperfecto."
  },
  {
    "sentence": "No solo el ruido que ___ (hacer) sus manos al frotar la ropa.",
    "verb": "hacer",
    "person": "ellos",
    "correctTense": "imperfecto",
    "correctAnswer": "hacían",
    "translation": "Nicht nur das Geräusch, das ihre Hände beim Reiben der Wäsche machten.",
    "explanation": "Andauerndes Hintergrundgeräusch -> Imperfecto."
  },
  {
    "sentence": "Sino el ruido que ___ (haber) dentro de su cabeza.",
    "verb": "haber",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "había",
    "translation": "Sondern der Lärm, der in ihrem Kopf herrschte.",
    "explanation": "Beschreibung eines andauernden Zustands im Kopf -> Imperfecto."
  },
  {
    "sentence": "El río donde lavaba la ropa ___ (tener) mucha fuerza.",
    "verb": "tener",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "tenía",
    "translation": "Der Fluss, in dem sie wusch, hatte viel Strömung (Kraft).",
    "explanation": "Beschreibung einer Eigenschaft des Flusses -> Imperfecto."
  },
  {
    "sentence": "Las aguas del río ___ (chocar) contra las piedras.",
    "verb": "chocar",
    "person": "ellos",
    "correctTense": "imperfecto",
    "correctAnswer": "chocaban",
    "translation": "Das Wasser des Flusses schlug gegen die Steine.",
    "explanation": "Beschreibung eines kontinuierlichen, wiederkehrenden Naturvorgangs -> Imperfecto."
  },
  {
    "sentence": "A este sonido ___ (haber) que agregarle el de los pájaros.",
    "verb": "haber",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "había",
    "translation": "Zu diesem Geräusch musste man das der Vögel hinzufügen.",
    "explanation": "Beschreibung einer andauernden Notwendigkeit -> Imperfecto."
  },
  {
    "sentence": "Los españoles ___ (ser) escandalosos. (Charakter der Spanier)",
    "verb": "ser",
    "person": "ellos",
    "correctTense": "imperfecto",
    "correctAnswer": "eran",
    "translation": "Die Spanier waren [generell] laut (skandalös).",
    "explanation": "Beschreibung einer dauerhaften Charaktereigenschaft einer Gruppe in der Vergangenheit -> Imperfecto."
  },
  {
    "sentence": "Los españoles ___ (ser) escandalosos. (ihr Auftreten)",
    "verb": "ser",
    "person": "ellos",
    "correctTense": "indefinido",
    "correctAnswer": "fueron",
    "translation": "Die Spanier waren [bei dieser Begegnung] laut (skandalös).",
    "explanation": "Eine konkrete Beobachtung ihres Auftretens in diesem Moment, nicht eine allgemeine Eigenschaft -> Indefinido."
  },
  {
    "sentence": "Ellos ___ (hacer) mucho ruido con sus armaduras y cañones.",
    "verb": "hacer",
    "person": "ellos",
    "correctTense": "imperfecto",
    "correctAnswer": "hacían",
    "translation": "Sie machten viel Lärm mit ihren Rüstungen und Kanonen.",
    "explanation": "Beschreibung eines andauernden Zustands/Handelns -> Imperfecto."
  },
  {
    "sentence": "Malinalli ___ (necesitar) silencio y calma.",
    "verb": "necesitar",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "necesitaba",
    "translation": "Malinalli brauchte (benötigte dauerhaft) Stille und Ruhe.",
    "explanation": "Beschreibung eines anhaltenden Bedürfnisses -> Imperfecto."
  },
  {
    "sentence": "El Popol Vuh ___ (decir) que la creación surgió del silencio.",
    "verb": "decir",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "decía",
    "translation": "Das Popol Vuh besagte (erzählte), dass die Schöpfung aus der Stille entstand.",
    "explanation": "Beschreibung des Inhalts eines Buches/Mythos in der Vergangenheit -> Imperfecto."
  },
  {
    "sentence": "Cuando todo ___ (estar) en silencio, surgió la creación.",
    "verb": "estar",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "estaba",
    "translation": "Als alles in Stille verharrte, entstand die Schöpfung.",
    "explanation": "Beschreibung des Hintergrundzustands (Stille) -> Imperfecto."
  },
  {
    "sentence": "En ese momento ___ (surgir) la creación.",
    "verb": "surgir",
    "person": "el",
    "correctTense": "indefinido",
    "correctAnswer": "surgió",
    "translation": "In diesem Moment entstand (brach hervor) die Schöpfung.",
    "explanation": "Ein plötzliches, neu eintretendes Ereignis (die Entstehung) -> Indefinido."
  },
  {
    "sentence": "Malinalli ___ (necesitar) ese silencio para crear nuevas palabras.",
    "verb": "necesitar",
    "person": "el",
    "correctTense": "imperfecto",
    "correctAnswer": "necesitaba",
    "translation": "Malinalli brauchte diese Stille, um neue Worte zu schaffen.",
    "explanation": "Beschreibung eines anhaltenden Bedürfnisses -> Imperfecto."
  },

  {
    sentence: "Antes yo no ___ (saber) que tenías un hermano.",
    verb: "saber",
    person: "yo",
    correctTense: "imperfecto",
    correctAnswer: "sabía",
    translation: "Früher wusste ich nicht, dass du einen Bruder hast.",
    explanation: "Achtung Bedeutungsunterschied: 'saber' im Imperfecto bedeutet 'wusste' (Zustand des Wissens), während es im Indefinido 'erfuhr' (Erkenntnis) bedeutet."
  },
  {
    sentence: "En la fiesta de ayer yo ___ (conocer) a tu novio.",
    verb: "conocer",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "conocí",
    translation: "Auf der gestrigen Party lernte ich deinen Freund kennen.",
    explanation: "Achtung Bedeutungsunterschied: 'conocer' im Indefinido bedeutet 'kennenlernen' (einmaliger Vorgang), während es im Imperfecto 'kennen' (Zustand) bedeutet."
  },
  {
    sentence: "En aquella época yo ya ___ (conocer) a tu hermano.",
    verb: "conocer",
    person: "yo",
    correctTense: "imperfecto",
    correctAnswer: "conocía",
    translation: "Damals kannte ich deinen Bruder bereits.",
    explanation: "Achtung Bedeutungsunterschied: 'conocer' im Imperfecto bedeutet 'kannte' (Zustand des Kennens), während es im Indefinido 'kennenlernen' bedeutet."
  },
  {
    sentence: "Ayer mi hermano ___ (tener) un accidente de coche.",
    verb: "tener",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "tuvo",
    translation: "Gestern hatte mein Bruder einen Autounfall.",
    explanation: "Achtung Bedeutungsunterschied: 'tener' für einmalige Erlebnisse (wie Unfälle) steht im Indefinido, da das Ereignis punktuell eintritt."
  },
  {
    sentence: "En mi infancia, yo ___ (tener) muchos juguetes.",
    verb: "tener",
    person: "yo",
    correctTense: "imperfecto",
    correctAnswer: "tenía",
    translation: "In meiner Kindheit hatte ich viele Spielzeuge.",
    explanation: "Achtung Bedeutungsunterschied: 'tener' für dauerhaften Besitz und Eigenschaften in der Vergangenheit steht im Imperfecto -> tenía."
  },
  {
    sentence: "El ladrón ___ (querer) abrir la puerta, pero no pudo.",
    verb: "querer",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "quiso",
    translation: "Der Dieb wollte/versuchte die Tür zu öffnen, aber er konnte nicht.",
    explanation: "Achtung Bedeutungsunterschied: 'querer' im Indefinido drückt den Willen aus, der zu einem tatsächlichen Handlungsversuch führt ('quiso' = wollte/versuchte)."
  },
  {
    sentence: "De niño, yo ___ (querer) ser piloto.",
    verb: "querer",
    person: "yo",
    correctTense: "imperfecto",
    correctAnswer: "quería",
    translation: "Als Kind wollte ich Pilot werden.",
    explanation: "Achtung Bedeutungsunterschied: 'querer' im Imperfecto beschreibt einen dauerhaften Wunsch oder Zustand des Wollens in der Vergangenheit -> quería."
  },
  {
    sentence: "El restaurante ___ (der Restaurantbesuch) muy bueno.",
    verb: "ser",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "fue",
    translation: "Das Restaurant [der Restaurantbesuch] war sehr gut.",
    explanation: "Da sich der Satz auf ein konkretes, abgeschlossenes Ereignis bezieht (den Restaurantbesuch, angedeutet durch den Hinweis), steht 'ser' im Indefinido -> fue."
  },
  {
    sentence: "El restaurante ___ (die Qualität des Restaurants) muy bueno.",
    verb: "ser",
    person: "el",
    correctTense: "imperfecto",
    correctAnswer: "era",
    translation: "Das Restaurant [die Qualität des Restaurants] war sehr gut.",
    explanation: "Da hier eine allgemeine Beschreibung einer Eigenschaft des Lokals in der Vergangenheit vorliegt (die Qualität des Lokals, angedeutet durch den Hinweis), steht 'ser' im Imperfecto -> era."
  },
  {
    sentence: "Ayer yo ___ al cine con mis amigos.",
    verb: "ir",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "fui",
    translation: "Gestern ging ich mit meinen Freunden ins Kino.",
    explanation: "Das Signalwort 'Ayer' (gestern) drückt eine einmalige, punktuelle und abgeschlossene Handlung in der Vergangenheit aus. Daher verwenden wir das Indefinido."
  },
  {
    sentence: "Cuando era niño, siempre ___ fútbol por las tardes.",
    verb: "jugar",
    person: "yo",
    correctTense: "imperfecto",
    correctAnswer: "jugaba",
    translation: "Als ich ein Kind war, spielte ich nachmittags immer Fußball.",
    explanation: "Die Wörter 'Cuando era niño' (Als ich ein Kind war) und 'siempre' (immer) weisen auf eine Gewohnheit oder wiederholte Handlung in der Vergangenheit hin -> Imperfecto."
  },
  {
    sentence: "De repente, ___ a llover muy fuerte.",
    verb: "empezar",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "empezó",
    translation: "Plötzlich begann es sehr stark zu regnen.",
    explanation: "Das Signalwort 'De repente' (plötzlich) zeigt eine plötzliche, neu einsetzende Handlung an, die den Hintergrund unterbricht -> Indefinido."
  },
  {
    sentence: "Mientras mi madre cocinaba, mi padre ___ el periódico.",
    verb: "leer",
    person: "el",
    correctTense: "imperfecto",
    correctAnswer: "leía",
    translation: "Während meine Mutter kochte, las mein Vater die Zeitung.",
    explanation: "'Mientras' (während) beschreibt zwei Handlungen, die gleichzeitig in der Vergangenheit ablaufen. Keine der Handlungen unterbricht die andere -> Imperfecto für beide."
  },
  {
    sentence: "El año pasado nosotros ___ a España de vacaciones.",
    verb: "ir",
    person: "nosotros",
    correctTense: "indefinido",
    correctAnswer: "fuimos",
    translation: "Letztes Jahr sind wir nach Spanien in den Urlaub gefahren.",
    explanation: "'El año pasado' (letztes Jahr) grenzt die Handlung auf einen bestimmten, abgeschlossenen Zeitraum ein -> Indefinido."
  },
  {
    sentence: "La casa de mis abuelos ___ grande y bonita.",
    verb: "ser",
    person: "el",
    correctTense: "imperfecto",
    correctAnswer: "era",
    translation: "Das Haus meiner Großeltern war groß und schön.",
    explanation: "Beschreibungen von Personen, Gegenständen oder Zuständen in der Vergangenheit stehen im Imperfecto."
  },
  {
    sentence: "A las ocho de la tarde, yo ___ a mi casa.",
    verb: "llegar",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "llegué",
    translation: "Um acht Uhr abends kam ich zu Hause an.",
    explanation: "Eine genaue Uhrzeit ('A las ocho') grenzt den Zeitpunkt der Handlung exakt ein -> Indefinido."
  },
  {
    sentence: "En aquella época, la gente no ___ teléfonos móviles.",
    verb: "tener",
    person: "ellos",
    correctTense: "imperfecto",
    correctAnswer: "tenían",
    translation: "Damals hatten die Menschen keine Mobiltelefone.",
    explanation: "'En aquella época' (in jener Zeit/damals) beschreibt einen langanhaltenden Zustand oder die allgemeinen Umstände der Vergangenheit -> Imperfecto."
  },
  {
    sentence: "Un día yo ___ con el presidente en Madrid.",
    verb: "hablar",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "hablé",
    translation: "Eines Tages sprach ich mit dem Präsidenten in Madrid.",
    explanation: "'Un día' (eines Tages) markiert ein einmaliges, abgeschlossenes Ereignis -> Indefinido."
  },
  {
    sentence: "En ese momento, yo ___ enfermo y cansado.",
    verb: "estar",
    person: "yo",
    correctTense: "imperfecto",
    correctAnswer: "estaba",
    translation: "In diesem Moment war ich krank und müde.",
    explanation: "Hier wird ein körperlicher und mentaler Zustand in der Vergangenheit beschrieben -> Imperfecto."
  },
  {
    sentence: "El sábado yo ___ mis tareas y luego salí.",
    verb: "hacer",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "hice",
    translation: "Am Samstag machte ich meine Hausaufgaben und ging danach aus.",
    explanation: "Eine Kette von aufeinanderfolgenden, abgeschlossenen Handlungen in der Vergangenheit ('y luego...') erfordert das Indefinido."
  },
  {
    sentence: "A menudo nosotros ___ paella los domingos.",
    verb: "comer",
    person: "nosotros",
    correctTense: "imperfecto",
    correctAnswer: "comíamos",
    translation: "Oft aßen wir sonntags Paella.",
    explanation: "'A menudo' (oft) signalisiert eine regelmäßige Gewohnheit in der Vergangenheit -> Imperfecto."
  },
  {
    sentence: "Yo caminaba por la calle cuando de repente ___ un accidente.",
    verb: "ver",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "vi",
    translation: "Ich ging die Straße entlang, als ich plötzlich einen Unfall sah.",
    explanation: "Die laufende Handlung im Hintergrund ('caminaba') wird durch ein neu eintretendes, plötzliches Ereignis unterbrochen -> Indefinido."
  },
  {
    sentence: "Anoche Juan ___ las llaves en su habitación.",
    verb: "buscar",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "buscó",
    translation: "Gestern Abend suchte Juan die Schlüssel in seinem Zimmer.",
    explanation: "'Anoche' (gestern Abend) bezeichnet einen abgeschlossenen Zeitpunkt in der Vergangenheit -> Indefinido."
  },
  {
    sentence: "Antes nosotros ___ en un pueblo muy pequeno.",
    verb: "vivir",
    person: "nosotros",
    correctTense: "imperfecto",
    correctAnswer: "vivíamos",
    translation: "Früher lebten wir in einem sehr kleinen Dorf.",
    explanation: "'Antes' (früher) leitet eine Beschreibung von Lebensumständen in der Vergangenheit ein -> Imperfecto."
  },
  {
    sentence: "Ayer yo ___ (saber) que no tenemos clase hoy.",
    verb: "saber",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "supe",
    translation: "Gestern erfuhr ich, dass wir heute keinen Unterricht haben.",
    explanation: "Achtung Bedeutungsunterschied: 'saber' im Indefinido bedeutet 'erfahren' (eine plötzliche Erkenntnis zu einem Zeitpunkt), während 'sabía' (Imperfecto) 'wusste' bedeutet (Zustand des Wissens)."
  },
  {
    sentence: "El ladrón ___ la ventana y entró en la casa.",
    verb: "abrir",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "abrió",
    translation: "Der Dieb öffnete das Fenster und ging ins Haus.",
    explanation: "Zwei aufeinanderfolgende Aktionen in einer Erzählung -> Indefinido."
  },
  {
    sentence: "Todos los días yo ___ a las siete de la mañana.",
    verb: "desayunar",
    person: "yo",
    correctTense: "imperfecto",
    correctAnswer: "desayunaba",
    translation: "Jeden Tag frühstückte ich um sieben Uhr morgens.",
    explanation: "'Todos los días' (jeden Tag) drückt eine tägliche Routine aus -> Imperfecto."
  },
  {
    sentence: "Anteayer María ___ un libro muy interesante.",
    verb: "comprar",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "compró",
    translation: "Vorgestern kaufte María ein sehr interessantes Buch.",
    explanation: "'Anteayer' (vorgestern) bezeichnet eine einmalige, punktuelle Handlung -> Indefinido."
  },
  {
    sentence: "En 2018 ellos ___ una casa nueva.",
    verb: "construir",
    person: "ellos",
    correctTense: "indefinido",
    correctAnswer: "construyeron",
    translation: "Im Jahr 2018 bauten sie ein neues Haus.",
    explanation: "Eine konkrete Jahreszahl grenzt das Ereignis zeitlich ein -> Indefinido."
  },
  {
    sentence: "Cuando yo ___ diez años, vivía en Barcelona.",
    verb: "tener",
    person: "yo",
    correctTense: "imperfecto",
    correctAnswer: "tenía",
    translation: "Als ich zehn Jahre alt war, lebte ich in Barcelona.",
    explanation: "Altersangaben in der Vergangenheit werden im Spanischen immer mit dem Imperfecto gebildet."
  },
  {
    sentence: "El examen de matemáticas ___ (das Niveau/die Schwierigkeit der Prüfung) muy difícil.",
    verb: "ser",
    person: "el",
    correctTense: "imperfecto",
    correctAnswer: "era",
    translation: "Die Mathearbeit war [vom Niveau her] sehr schwer.",
    explanation: "Da es sich um eine Beschreibung des Schwierigkeitsgrades handelt (eine Eigenschaft in der Vergangenheit), steht 'ser' im Imperfecto -> era."
  },
  {
    sentence: "Ayer yo ___ la mesa en la sala.",
    verb: "poner",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "puse",
    translation: "Gestern deckte ich den Tisch im Wohnzimmer.",
    explanation: "'Ayer' (gestern) gibt einen klaren Zeitrahmen an, die Handlung ist abgeschlossen -> Indefinido."
  },
  {
    sentence: "Mientras la profesora explicaba, los alumnos ___ la lección.",
    verb: "escribir",
    person: "ellos",
    correctTense: "imperfecto",
    correctAnswer: "escribían",
    translation: "Während die Lehrerin erklärte, schrieben die Schüler die Lektion auf.",
    explanation: "Zwei gleichzeitige Handlungen, die parallel ablaufen (während / mientras) -> beide im Imperfecto."
  },
  {
    sentence: "De niña, tú ___ muy tímida.",
    verb: "ser",
    person: "tu",
    correctTense: "imperfecto",
    correctAnswer: "eras",
    translation: "Als kleines Mädchen warst du sehr schüchtern.",
    explanation: "Charaktereigenschaft in der Kindheit (Zustandsbeschreibung) -> Imperfecto."
  },
  {
    sentence: "El año pasado yo ___ en París por tres meses.",
    verb: "vivir",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "viví",
    translation: "Letztes Jahr wohnte ich drei Monate lang in Paris.",
    explanation: "Obwohl Wohnen ein Zustand ist, begrenzt die Zeitangabe 'por tres meses' (drei Monate lang) die Dauer fest. Daher verwenden wir das Indefinido!"
  },
  {
    sentence: "El domingo pasado mi hermano ___ un pastel delicioso.",
    verb: "cocinar",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "cocinó",
    translation: "Letzten Sonntag kochte mein Bruder einen köstlichen Kuchen.",
    explanation: "'El domingo pasado' (letzten Sonntag) drückt eine abgeschlossene Aktion aus -> Indefinido."
  },
  {
    sentence: "En mi juventud, yo ___ cartas a mis amigos cada semana.",
    verb: "escribir",
    person: "yo",
    correctTense: "imperfecto",
    correctAnswer: "escribía",
    translation: "In meiner Jugend schrieb ich meinen Freunden jede Woche Briefe.",
    explanation: "Wiederholte Gewohnheit in einem Lebensabschnitt ('cada semana') -> Imperfecto."
  },
  {
    sentence: "Un día nosotros ___ a un perro abandonado en la calle.",
    verb: "ver",
    person: "nosotros",
    correctTense: "indefinido",
    correctAnswer: "vimos",
    translation: "Eines Tages sahen wir einen verlassenen Hund auf der Straße.",
    explanation: "'Un día' (eines Tages) zeigt ein plötzliches Ereignis in der Vergangenheit -> Indefinido."
  },
  {
    sentence: "Yo ___ a las diez ayer porque estaba muy cansado.",
    verb: "dormir",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "dormí",
    translation: "Ich schlief gestern um zehn Uhr ein, weil ich sehr müde war.",
    explanation: "Gestern ('ayer') um eine bestimmte Uhrzeit schlafen gegangen -> Indefinido."
  },
  {
    sentence: "Normalmente mi familia ___ las vacaciones en Italia.",
    verb: "pasar",
    person: "el",
    correctTense: "imperfecto",
    correctAnswer: "pasaba",
    translation: "Normalerweise verbrachte meine Familie die Ferien in Italien.",
    explanation: "'Normalmente' (normalerweise) verweist auf eine regelmäßige Gewohnheit -> Imperfecto."
  },
  {
    sentence: "Ayer yo ___ al parque y corrí un poco.",
    verb: "ir",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "fui",
    translation: "Gestern ging ich in den Park und rannte ein wenig.",
    explanation: "Zwei aufeinanderfolgende Aktionen am gestrigen Tag -> Indefinido."
  },
  {
    sentence: "Cuando el profesor entró en el aula, los alumnos ___.",
    verb: "hablar",
    person: "ellos",
    correctTense: "imperfecto",
    correctAnswer: "hablaban",
    translation: "Als der Lehrer das Klassenzimmer betrat, sprachen die Schüler.",
    explanation: "Die Schüler sprachen bereits im Hintergrund (fortlaufende Handlung), als der Lehrer plötzlich eintrat. Der Einstieg steht im Indefinido, der Hintergrund im Imperfecto."
  },
  {
    sentence: "Anoche nosotros ___ paella en un restaurante.",
    verb: "comer",
    person: "nosotros",
    correctTense: "indefinido",
    correctAnswer: "comimos",
    translation: "Gestern Abend aßen wir Paella in einem Restaurant.",
    explanation: "'Anoche' (gestern Abend) drückt ein abgeschlossenes Ereignis aus -> Indefinido."
  },
  {
    sentence: "En la escuela primaria, yo ___ muy malas notas en matemáticas.",
    verb: "sacar",
    person: "yo",
    correctTense: "imperfecto",
    correctAnswer: "sacaba",
    translation: "In der Grundschule bekam ich sehr schlechte Noten in Mathe.",
    explanation: "Ein sich wiederholender Zustand über einen längeren Zeitraum (Grundschulzeit) -> Imperfecto."
  },
  {
    sentence: "De repente, ella ___ que había perdido su cartera.",
    verb: "comprender",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "comprendió",
    translation: "Plötzlich verstand sie, dass sie ihr Portemonnaie verloren hatte.",
    explanation: "Plötzliche Erkenntnis ('De repente') -> Indefinido."
  },
  {
    sentence: "Cuando vivíamos en México, siempre ___ agua embotellada.",
    verb: "beber",
    person: "nosotros",
    correctTense: "imperfecto",
    correctAnswer: "bebíamos",
    translation: "Als wir in Mexiko lebten, tranken wir immer Flaschenwasser.",
    explanation: "Gewohnheit in der Vergangenheit ('siempre') -> Imperfecto."
  },
  {
    sentence: "El lunes pasado Juan ___ en el jardín.",
    verb: "trabajar",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "trabajó",
    translation: "Letzten Montag arbeitete Juan im Garten.",
    explanation: "'El lunes pasado' ist ein punktueller, abgeschlossener Tag -> Indefinido."
  },
  {
    sentence: "Mi primer perro ___ negro y muy inteligente.",
    verb: "ser",
    person: "el",
    correctTense: "imperfecto",
    correctAnswer: "era",
    translation: "Mein erster Hund war schwarz und sehr intelligent.",
    explanation: "Beschreibung von Eigenschaften in der Vergangenheit -> Imperfecto."
  },
  {
    sentence: "Ayer yo le ___ un correo electrónico a mi profesor.",
    verb: "escribir",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "escribí",
    translation: "Gestern schrieb ich meinem Lehrer eine E-Mail.",
    explanation: "Einmalige, abgeschlossene Handlung gestern -> Indefinido."
  },
  {
    sentence: "En aquella época, nosotros no ___ ordenadores.",
    verb: "tener",
    person: "nosotros",
    correctTense: "imperfecto",
    correctAnswer: "teníamos",
    translation: "Damals hatten wir keine Computer.",
    explanation: "Beschreibung von Lebensumständen in einer vergangenen Epoche -> Imperfecto."
  },
  {
    sentence: "El año pasado María ___ a tocar el piano.",
    verb: "aprender",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "aprendió",
    translation: "Letztes Jahr lernte María, Klavier zu spielen.",
    explanation: "Abgeschlossenes Jahr -> Indefinido."
  },
  {
    sentence: "Durante las vacaciones, nosotros ___ tarde todos los días.",
    verb: "desayunar",
    person: "nosotros",
    correctTense: "imperfecto",
    correctAnswer: "desayunábamos",
    translation: "Während der Ferien frühstückten wir jeden Tag spät.",
    explanation: "Regelmäßige Gewohnheit in den Ferien ('todos los días') -> Imperfecto."
  },
  {
    sentence: "Ayer nosotros ___ en el bosque por tres horas.",
    verb: "caminar",
    person: "nosotros",
    correctTense: "indefinido",
    correctAnswer: "caminamos",
    translation: "Gestern wanderten wir drei Stunden lang im Wald.",
    explanation: "Obwohl Gehen eine Dauer hat, schränkt 'por tres horas' (drei Stunden lang) die Dauer fest ein -> Indefinido."
  },
  {
    sentence: "Cuando yo ___ en la cama, sonó el teléfono.",
    verb: "estar",
    person: "yo",
    correctTense: "imperfecto",
    correctAnswer: "estaba",
    translation: "Als ich im Bett lag, klingelte das Telefon.",
    explanation: "Der Zustand im Bett zu liegen war die laufende Hintergrundhandlung, als das Telefon plötzlich klingelte (Indefinido: sonó) -> Imperfecto für den Hintergrund."
  },
  {
    sentence: "Ayer tú me ___ una promesa.",
    verb: "hacer",
    person: "tu",
    correctTense: "indefinido",
    correctAnswer: "hiciste",
    translation: "Gestern hast du mir ein Versprechen gegeben.",
    explanation: "'Ayer' (gestern) verweist auf eine abgeschlossene Aktion -> Indefinido."
  },
  {
    sentence: "En el siglo XIX, los viajes ___ muy largos.",
    verb: "ser",
    person: "ellos",
    correctTense: "imperfecto",
    correctAnswer: "eran",
    translation: "Im 19. Jahrhundert waren Reisen sehr lang.",
    explanation: "Beschreibung von Verhältnissen in einer vergangenen Epoche -> Imperfecto."
  },
  {
    sentence: "Siempre ___ sol en esa playa maravillosa.",
    verb: "hacer",
    person: "el",
    correctTense: "imperfecto",
    correctAnswer: "hacía",
    translation: "Es war immer sonnig an diesem wunderbaren Strand.",
    explanation: "'Siempre' (immer) sowie eine Wetterbeschreibung in der Vergangenheit verlangen das Imperfecto."
  },
  {
    sentence: "Desde la Península ___ (llegar) noticias por la radio. (eine Sondermeldung)",
    verb: "llegar",
    person: "ellos",
    correctTense: "indefinido",
    correctAnswer: "llegaron",
    translation: "Vom Festland trafen [einmalig/punktuell] Nachrichten über das Radio ein.",
    explanation: "Ein einmaliges, abgeschlossenens Eintreffen von Nachrichten zu einem konkreten Zeitpunkt -> Indefinido."
  },
  {
    sentence: "Yo me informaba sobre lo que ___ (pasar) en mi país. (ein bestimmter Vorfall)",
    verb: "pasar",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "pasó",
    translation: "Ich informierte mich über das, was [einmalig/konkret] in meinem Land passierte.",
    explanation: "Ein konkretes, punktuelles Ereignis (ein bestimmter Vorfall) in der Vergangenheit -> Indefinido."
  },
  {
    sentence: "Marta me llamó solo para hablar; solo se ___ (sentir) sola. (der Auslöser des Anrufs)",
    verb: "sentir",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "sintió",
    translation: "Marta rief mich nur an, um zu reden; sie fühlte sich in diesem Moment plötzlich einsam.",
    explanation: "Ein plötzliches Gefühl, das in einem bestimmten Moment einsetzte (Erlebnis) -> Indefinido."
  },
  {
    sentence: "No le dieron ni las gracias porque ___ (estar) sin contrato. (die gesamte Arbeitszeit)",
    verb: "estar",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "estuvo",
    translation: "Sie sagten ihr nicht einmal danke, weil sie [während der gesamten Beschäftigung] ohne Vertrag war.",
    explanation: "Wenn ein Zustand in der Vergangenheit als über einen begrenzten, abgeschlossenen Zeitraum andauernd betrachtet wird -> Indefinido."
  },
  {
    sentence: "Anteayer yo ___ a mi abuela en el hospital.",
    verb: "visitar",
    person: "yo",
    correctTense: "indefinido",
    correctAnswer: "visité",
    translation: "Vorgestern besuchte ich meine Oma im Krankenhaus.",
    explanation: "'Anteayer' (vorgestern) bezeichnet eine abgeschlossene, einmalige Handlung -> Indefinido."
  },
  {
    sentence: "Mientras la gente dormía, el volcán ___ en erupción.",
    verb: "entrar",
    person: "el",
    correctTense: "indefinido",
    correctAnswer: "entró",
    translation: "Während die Menschen schliefen, brach der Vulkan aus.",
    explanation: "Der Ausbruch des Vulkans unterbricht die schlafende Bevölkerung im Hintergrund -> Indefinido."
  },
  {
    sentence: "Siempre ___ sol en esa playa maravillosa.",
    verb: "hacer",
    person: "el",
    correctTense: "imperfecto",
    correctAnswer: "hacía",
    translation: "Es war immer sonnig an diesem wunderbaren Strand.",
    explanation: "'Siempre' (immer) sowie eine Wetterbeschreibung in der Vergangenheit verlangen das Imperfecto."
  }
];

// SPEZIELLE RECHTSCHREIB-KONJUGATOR FÜR -car, -gar, -zar
function getSpellingChange(stem, endingType, person, tense, infinitive) {
  if (tense === "indefinido" && person === "yo") {
    if (infinitive.endsWith("car")) return stem.slice(0, -1) + "qu" + "é";
    if (infinitive.endsWith("gar")) return stem.slice(0, -1) + "gu" + "é";
    if (infinitive.endsWith("zar")) return stem.slice(0, -1) + "c" + "é";
  }
  return null;
}

// DYNAMISCHER KONJUGATION-GENERATOR FÜR REGULÄRE VERBEN
function generateConjugations(infinitive, endingType) {
  const stem = infinitive.slice(0, -2);
  
  const rules = {
    imperfecto: {
      ar: {
        yo: stem + "aba",
        tu: stem + "abas",
        el: stem + "aba",
        nosotros: stem + "ábamos",
        vosotros: stem + "abais",
        ellos: stem + "aban"
      },
      er: {
        yo: stem + "ía",
        tu: stem + "ías",
        el: stem + "ía",
        nosotros: stem + "íamos",
        vosotros: stem + "íais",
        ellos: stem + "ían"
      },
      ir: {
        yo: stem + "ía",
        tu: stem + "ías",
        el: stem + "ía",
        nosotros: stem + "íamos",
        vosotros: stem + "íais",
        ellos: stem + "ían"
      }
    },
    indefinido: {
      ar: {
        yo: stem + "é",
        tu: stem + "aste",
        el: stem + "ó",
        nosotros: stem + "amos",
        vosotros: stem + "asteis",
        ellos: stem + "aron"
      },
      er: {
        yo: stem + "í",
        tu: stem + "iste",
        el: stem + "ió",
        nosotros: stem + "imos",
        vosotros: stem + "isteis",
        ellos: stem + "ieron"
      },
      ir: {
        yo: stem + "í",
        tu: stem + "iste",
        el: stem + "ió",
        nosotros: stem + "imos",
        vosotros: stem + "isteis",
        ellos: stem + "ieron"
      }
    }
  };

  const conjugations = {
    imperfecto: { ...rules.imperfecto[endingType] },
    indefinido: { ...rules.indefinido[endingType] }
  };

  // Rechtschreibänderungen einpflegen für -car, -gar, -zar im Indefinido Yo
  const spellingChangeYo = getSpellingChange(stem, endingType, "yo", "indefinido", infinitive);
  if (spellingChangeYo) {
    conjugations.indefinido.yo = spellingChangeYo;
  }

  return conjugations;
}

// BAUT DIE GESAMT-VERBDATENBANK DYNAMISCH ZUSAMMEN
function getVerbsDatabase() {
  const db = [];

  // 1. Reguläre Verben hinzufügen
  REGULAR_VERBS.forEach(v => {
    const endingType = v.infinitive.slice(-2); // "ar", "er" oder "ir"
    db.push({
      infinitive: v.infinitive,
      translation: v.translation,
      regular: true,
      spellingChange: false,
      tenses: generateConjugations(v.infinitive, endingType)
    });
  });

  // 2. Orthographische Verben hinzufügen
  ORTHOGRAPHIC_VERBS.forEach(v => {
    const endingType = v.infinitive.slice(-2);
    db.push({
      infinitive: v.infinitive,
      translation: v.translation,
      regular: true, // Strukturell regulär mit Yo-Anpassung
      spellingChange: true,
      tenses: generateConjugations(v.infinitive, endingType)
    });
  });

  // 3. Unreguläre Verben hinzufügen
  IRREGULAR_VERBS.forEach(v => {
    db.push({
      infinitive: v.infinitive,
      translation: v.translation,
      regular: false,
      spellingChange: false,
      tier: v.tier,
      tenses: v.tenses
    });
  });

  return db;
}

// Globale Bereitstellung (Browser-kompatibel über globale Variablen)
window.VERBS_DATABASE = getVerbsDatabase();
window.CONTEXT_EXERCISES = CONTEXT_EXERCISES;
console.log(`[Verbs Database] Loaded ${window.VERBS_DATABASE.length} verbs and ${window.CONTEXT_EXERCISES.length} context sentences.`);
