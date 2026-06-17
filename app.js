/**
 * Spanisch Past Tenses Trainer - Anwendungslogik (State-Management & UI)
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // STATE & SPEICHERUNG (Lokaler Zustand)
  // ==========================================================================
  
  // Standardeinstellungen
  let config = {
    tenses: ["indefinido", "imperfecto"],
    verbTypes: ["regular", "spelling", "irregular"],
    tiers: [1, 2, 3, 4],
    sessionLength: 10, // '10', '20' oder 'infinite'
    hideTranslations: false
  };

  // Aktiver Sitzungszustand
  let session = {
    isActive: false,
    mode: null, // 'conjugate' | 'recognize' | 'context'
    questions: [], // Array mit aktuellen Fragen
    currentIndex: 0,
    score: 0,
    attempts: 0,
    wrongAnswers: [], // Gesammelte Fehler
    isAnswered: false
  };

  // Fortschritts-Statistiken (Persistent in localStorage)
  let stats = {
    xp: 0,
    streak: 0,
    lastPracticed: "", // YYYY-MM-DD
    verbErrors: {},    // { verbInfinitive: count }
    signalErrors: {}   // { signalWord: count }
  };

  // Signalwörter-Datenbank für den Zuordnungs-Modus
  const SIGNALS_DB = [
    { word: "ayer", translation: "gestern", tense: "indefinido", explanation: "Ein konkreter Zeitpunkt in der Vergangenheit." },
    { word: "anteayer", translation: "vorgestern", tense: "indefinido", explanation: "Ein konkreter Zeitpunkt in der Vergangenheit." },
    { word: "anoche", translation: "gestern Abend", tense: "indefinido", explanation: "Ein konkreter Zeitpunkt in der Vergangenheit." },
    { word: "el año pasado", translation: "letztes Jahr", tense: "indefinido", explanation: "Ein abgeschlossener Zeitraum." },
    { word: "la semana pasada", translation: "letzte Woche", tense: "indefinido", explanation: "Ein abgeschlossener Zeitraum." },
    { word: "de repente", translation: "plötzlich", tense: "indefinido", explanation: "Ein plötzliches Ereignis, das eine andauernde Handlung unterbricht." },
    { word: "de pronto", translation: "plötzlich/auf einmal", tense: "indefinido", explanation: "Ein plötzliches Ereignis." },
    { word: "un día", translation: "eines Tages", tense: "indefinido", explanation: "Ein einmaliges, punktuelles Ereignis." },
    { word: "una vez", translation: "einmal", tense: "indefinido", explanation: "Ein einmaliges Ereignis." },
    { word: "hace dos días", translation: "vor zwei Tagen", tense: "indefinido", explanation: "Ein zeitlich genau bestimmter Zeitpunkt." },
    { word: "el otro día", translation: "neulich", tense: "indefinido", explanation: "Ein konkreter Zeitpunkt in der Vergangenheit." },
    { word: "en ese momento", translation: "in diesem Moment", tense: "indefinido", explanation: "Ein punktuelles Ereignis in der Vergangenheit." },
    { word: "en aquel momento", translation: "in jenem Moment", tense: "indefinido", explanation: "Ein punktuelles Ereignis in der Vergangenheit." },
    { word: "inmediatamente", translation: "sofort", tense: "indefinido", explanation: "Ein unmittelbar eintretendes Ereignis." },
    { word: "de inmediato", translation: "sofort", tense: "indefinido", explanation: "Ein unmittelbar eintretendes Ereignis." },
    { word: "enseguida", translation: "sofort", tense: "indefinido", explanation: "Ein unmittelbar eintretendes Ereignis." },
    { word: "al final", translation: "am Ende", tense: "indefinido", explanation: "Der Abschluss einer Kette von Ereignissen." },
    { word: "al instante", translation: "sofort", tense: "indefinido", explanation: "Ein augenblicklich eintretendes Ereignis." },
    { word: "por fin", translation: "endlich", tense: "indefinido", explanation: "Drückt den ersehnten Abschluss eines Ereignisses aus." },
    { word: "finalmente", translation: "schließlich", tense: "indefinido", explanation: "Schließt eine Reihe von Handlungen ab." },
    { word: "hace un rato", translation: "vor kurzem", tense: "indefinido", explanation: "Ein abgeschlossener Zeitpunkt in naher Vergangenheit." },
    { word: "el lunes pasado", translation: "letzten Montag", tense: "indefinido", explanation: "Ein konkreter Wochentag in der Vergangenheit." },
    { word: "el mes pasado", translation: "letzten Monat", tense: "indefinido", explanation: "Ein abgeschlossener Zeitraum." },
    { word: "el verano pasado", translation: "letzten Sommer", tense: "indefinido", explanation: "Ein abgeschlossener Zeitraum." },
    { word: "aquel día", translation: "jener Tag", tense: "indefinido", explanation: "Ein bestimmter Tag in der Vergangenheit." },
    { word: "aquella tarde", translation: "jener Nachmittag", tense: "indefinido", explanation: "Ein bestimmter Nachmittag in der Vergangenheit." },
    { word: "esa mañana", translation: "dieser Morgen", tense: "indefinido", explanation: "Ein bestimmter Morgen in der Vergangenheit." },
    { word: "siempre", translation: "immer", tense: "imperfecto", explanation: "Eine dauerhafte Gewohnheit oder wiederholte Handlung." },
    { word: "antes", translation: "früher", tense: "imperfecto", explanation: "Beschreibt Lebensumstände oder Zustände in der Vergangenheit." },
    { word: "normalmente", translation: "normalerweise", tense: "imperfecto", explanation: "Eine Gewohnheit oder regelmäßige Handlung." },
    { word: "generalmente", translation: "meistens/allgemein", tense: "imperfecto", explanation: "Eine gewohnheitsmäßige, allgemeine Handlung." },
    { word: "habitualmente", translation: "gewöhnlich/normalerweise", tense: "imperfecto", explanation: "Eine regelmäßige Gewohnheit." },
    { word: "mientras", translation: "während", tense: "imperfecto", explanation: "Gleichzeitige, andauernde Handlungen in der Vergangenheit." },
    { word: "todos los días", translation: "jeden Tag", tense: "imperfecto", explanation: "Eine sich wiederholende Gewohnheit." },
    { word: "todos los lunes", translation: "jeden Montag", tense: "imperfecto", explanation: "Eine regelmäßige Gewohnheit an bestimmten Wochentagen." },
    { word: "cada día", translation: "jeden Tag", tense: "imperfecto", explanation: "Eine regelmäßige, sich wiederholende Handlung." },
    { word: "cada semana", translation: "jede Woche", tense: "imperfecto", explanation: "Eine regelmäßige, sich wiederholende Handlung." },
    { word: "cada año", translation: "jedes Jahr", tense: "imperfecto", explanation: "Eine sich wiederholende Gewohnheit." },
    { word: "cada vez que", translation: "jedes Mal wenn", tense: "imperfecto", explanation: "Drückt eine wiederholte Koinzidenz aus." },
    { word: "a menudo", translation: "oft", tense: "imperfecto", explanation: "Eine sich wiederholende Gewohnheit." },
    { word: "con frecuencia", translation: "häufig", tense: "imperfecto", explanation: "Eine wiederkehrende Handlung." },
    { word: "muchas veces", translation: "oft/viele Male", tense: "imperfecto", explanation: "Eine wiederkehrende Handlung." },
    { word: "cuando era niño", translation: "als ich ein Kind war", tense: "imperfecto", explanation: "Beschreibt einen Zustand oder Lebensabschnitt." },
    { word: "de niño", translation: "als Kind", tense: "imperfecto", explanation: "Beschreibt einen vergangenen Lebensabschnitt." },
    { word: "en aquella época", translation: "zu jener Zeit/damals", tense: "imperfecto", explanation: "Beschreibt Lebensumstände in einer vergangenen Epoche." },
    { word: "en aquel entonces", translation: "damals", tense: "imperfecto", explanation: "Beschreibt Lebensumstände in der Vergangenheit." },
    { word: "en esos tiempos", translation: "in jenen Zeiten", tense: "imperfecto", explanation: "Beschreibt Lebensumstände in der Vergangenheit." },
    { word: "antiguamente", translation: "früher/ehemals", tense: "imperfecto", explanation: "Beschreibt frühere Zustände oder Gewohnheiten." },
    { word: "por aquel entonces", translation: "damals", tense: "imperfecto", explanation: "Beschreibt die Lebensumstände in der Vergangenheit." },
    { word: "de vez en cuando", translation: "von Zeit zu Zeit", tense: "imperfecto", explanation: "Wiederkehrende Handlungen." },
    { word: "a veces", translation: "manchmal", tense: "imperfecto", explanation: "Wiederkehrende Handlungen." }
  ];

  // Pronomen-Mapping für Anzeige (strukturiert für flexiblen Ein- und Ausblendungs-Modus)
  const PRONOUN_LABELS = {
    yo: { pronoun: "yo", translation: "ich", grammar: "1. Person Singular", number: 1 },
    tu: { pronoun: "tú", translation: "du", grammar: "2. Person Singular", number: 2 },
    el: { pronoun: "él/ella/usted", translation: "er/sie/Sie", grammar: "3. Person Singular", number: 3 },
    nosotros: { pronoun: "nosotros/-as", translation: "wir", grammar: "1. Person Plural", number: 4 },
    vosotros: { pronoun: "vosotros/-as", translation: "ihr", grammar: "2. Person Plural", number: 5 },
    ellos: { pronoun: "ellos/ellas/ustedes", translation: "sie/Sie", grammar: "3. Person Plural", number: 6 }
  };

  // Hilfsfunktion zur Normalisierung von Personenschlüsseln (Behebt Abstürze bei abweichenden Schreibweisen in Lückentexten)
  function getCanonicalPersonKey(person) {
    if (!person) return "el";
    const p = person.toLowerCase().trim();
    if (p === "yo") return "yo";
    if (p === "tu" || p === "tú") return "tu";
    if (p === "el" || p === "él" || p === "ella" || p === "usted") return "el";
    if (p === "nosotros" || p === "nosotras") return "nosotros";
    if (p === "vosotros" || p === "vosotras") return "vosotros";
    if (p === "ellos" || p === "ellas" || p === "ustedes") return "ellos";
    return "el";
  }

  // Hilfsfunktion zur Ermittlung der konjugierten Verbform auf Basis der Datenbank oder regulärer Regeln
  function getVerbForm(verb, tense, person) {
    const mainVerb = verb.split(" ")[0];
    const rest = verb.substring(mainVerb.length);
    const canonicalPerson = getCanonicalPersonKey(person);
    
    let verbObj = window.VERBS_DATABASE.find(v => v.infinitive === mainVerb);
    
    // Falls das Verb nicht in der Liste steht, generieren wir die Konjugation als reguläres Verb
    if (!verbObj) {
      const endingType = mainVerb.slice(-2);
      if (endingType === "ar" || endingType === "er" || endingType === "ir") {
        try {
          const tenses = generateConjugations(mainVerb, endingType);
          verbObj = { infinitive: mainVerb, tenses: tenses };
        } catch (e) {
          console.error("Failed to generate conjugations on the fly:", e);
        }
      }
    }
    
    if (!verbObj || !verbObj.tenses || !verbObj.tenses[tense]) return null;
    const form = verbObj.tenses[tense][canonicalPerson];
    return form ? (form + rest) : null;
  }

  // Zeitformen-Labels
  const TENSE_LABELS = {
    indefinido: "Pretérito Indefinido",
    imperfecto: "Pretérito Imperfecto"
  };

  // ==========================================================================
  // DOM-ELEMENTE
  // ==========================================================================
  
  // Navigation & Tabs
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const appHeader = document.querySelector(".app-header");

  // Übungs-Menü & Session
  const practiceMenu = document.getElementById("practice-menu");
  const practiceSession = document.getElementById("practice-session");
  const sessionSummary = document.getElementById("session-summary");
  const modeCards = document.querySelectorAll(".submode-btn");
  
  // UI-Zustand-Vorschau auf Menü
  const activeTensesPreview = document.getElementById("active-tenses-preview");
  const activeVerbsPreview = document.getElementById("active-verbs-preview");

  // Session-Steuerung
  const btnExitSession = document.getElementById("btn-exit-session");
  const sessionProgress = document.getElementById("session-progress");
  const sessionProgressText = document.getElementById("session-progress-text");
  const sessionScoreText = document.getElementById("session-score-text");
  const questionCard = document.getElementById("question-card");
  
  // Feedback
  const feedbackWidget = document.getElementById("feedback-widget");
  const feedbackIcon = document.getElementById("feedback-icon");
  const feedbackHeadline = document.getElementById("feedback-headline");
  const feedbackMessage = document.getElementById("feedback-message");
  const feedbackExplanationBox = document.getElementById("feedback-explanation-box");
  const feedbackExplanation = document.getElementById("feedback-explanation");
  const feedbackTranslation = document.getElementById("feedback-translation");
  const btnNextQuestion = document.getElementById("btn-next-question");

  // Zusammenfassung
  const summaryPercentage = document.getElementById("summary-percentage");
  const summaryChartFill = document.getElementById("summary-chart-fill");
  const summaryHeadline = document.getElementById("summary-headline");
  const summarySubtext = document.getElementById("summary-subtext");
  const statCorrect = document.getElementById("stat-correct");
  const statWrong = document.getElementById("stat-wrong");
  const statAccuracy = document.getElementById("stat-accuracy");
  const wrongAnswersListContainer = document.getElementById("wrong-answers-list-container");
  const wrongAnswersList = document.getElementById("wrong-answers-list");
  
  const btnRestartSession = document.getElementById("btn-restart-session");
  const btnReviewErrors = document.getElementById("btn-review-errors");
  const btnToMenu = document.getElementById("btn-to-menu");

  // Einstellungen Formular
  const settingsForm = document.getElementById("settings-form");
  const settingsSaveSuccess = document.getElementById("settings-save-success");

  // Lexikon / Verbsuche
  const verbSearchInput = document.getElementById("verb-search-input");
  const filterBadges = document.querySelectorAll(".filter-badge");
  const verbSearchResults = document.getElementById("verb-search-results");

  // Fortschritt Tab
  const progressStreak = document.getElementById("progress-streak");
  const progressLevel = document.getElementById("progress-level");
  const progressXpText = document.getElementById("progress-xp-text");
  const progressXpFill = document.getElementById("progress-xp-fill");
  const progressXpNext = document.getElementById("progress-xp-next");
  const troubleVerbsList = document.getElementById("trouble-verbs-list");
  const troubleSignalsList = document.getElementById("trouble-signals-list");
  const btnPracticeTrouble = document.getElementById("btn-practice-trouble");

  // ==========================================================================
  // INITIALISIERUNG
  // ==========================================================================
  
  function init() {
    loadConfig();
    loadStats();
    updateMenuPreviews();
    setupEventListeners();
    renderVerbLibrary();
    initFirebase(); // Firebase-Verbindung herstellen (falls konfiguriert)
  }

  // ==========================================================================
  // CONFIG & SETTINGS LOGIK
  // ==========================================================================
  
  function loadConfig() {
    const savedConfig = localStorage.getItem("past_tenses_config");
    if (savedConfig) {
      try {
        config = JSON.parse(savedConfig);
        // Fallback für Tiers falls nicht im geladenen Zustand
        if (!config.tiers) {
          config.tiers = [1, 2, 3, 4];
        }
        applyConfigToInputs();
      } catch (e) {
        console.error("Config konnte nicht geladen werden:", e);
      }
    }
  }

  function applyConfigToInputs() {
    // Checkboxen Zeiten
    const tenseInputs = settingsForm.querySelectorAll('input[name="tense"]');
    tenseInputs.forEach(input => {
      input.checked = config.tenses.includes(input.value);
    });

    // Checkboxen Verb-Typen
    const typeInputs = settingsForm.querySelectorAll('input[name="verbType"]');
    typeInputs.forEach(input => {
      input.checked = config.verbTypes.includes(input.value);
    });

    // Checkboxen Tiers
    const tierInputs = settingsForm.querySelectorAll('input[name="verbTier"]');
    tierInputs.forEach(input => {
      input.checked = config.tiers.includes(parseInt(input.value, 10));
    });

    // Eingerückte Tier-Boxen steuern
    const irregularCheckbox = document.getElementById("checkbox-irregular");
    const tiersContainer = document.getElementById("tier-checkboxes-container");
    if (irregularCheckbox && tiersContainer) {
      if (irregularCheckbox.checked) {
        tiersContainer.classList.remove("disabled");
      } else {
        tiersContainer.classList.add("disabled");
      }
    }

    // Rundenlänge
    const lengthInput = settingsForm.querySelector(`input[name="sessionLength"][value="${config.sessionLength}"]`);
    if (lengthInput) {
      lengthInput.checked = true;
    }

    // Übersetzungen ausblenden
    const hideTransInput = settingsForm.querySelector('input[name="hideTranslations"]');
    if (hideTransInput) {
      hideTransInput.checked = config.hideTranslations || false;
    }

    // Initiale Validierung und Modi-Status setzen
    saveConfig(null, false);
  }

  function setModeCardsDisabled(disabled) {
    const cards = document.querySelectorAll(".submode-btn");
    cards.forEach(card => {
      if (disabled) {
        card.classList.add("disabled");
        card.setAttribute("disabled", "true");
      } else {
        card.classList.remove("disabled");
        card.removeAttribute("disabled");
      }
    });
  }

  function saveConfig(e, showToast = false) {
    if (e && e.preventDefault) e.preventDefault();
    
    const warningBanner = document.getElementById("settings-validation-warning");
    const warningMessage = document.getElementById("settings-validation-message");
    
    if (!settingsForm) return;

    // Gewählte Zeiten holen
    const checkedTenses = Array.from(settingsForm.querySelectorAll('input[name="tense"]:checked')).map(el => el.value);
    // Gewählte Verb-Typen holen
    const checkedTypes = Array.from(settingsForm.querySelectorAll('input[name="verbType"]:checked')).map(el => el.value);
    // Gewählte Tiers holen
    const checkedTiers = Array.from(settingsForm.querySelectorAll('input[name="verbTier"]:checked')).map(el => parseInt(el.value, 10));
    // Rundenlänge holen
    const lengthEl = settingsForm.querySelector('input[name="sessionLength"]:checked');
    const selectedLength = lengthEl ? lengthEl.value : "10";
    // Übersetzungen ausblenden holen
    const hideTransEl = settingsForm.querySelector('input[name="hideTranslations"]');
    const hideTranslations = hideTransEl ? hideTransEl.checked : false;

    // Validierung: Mindestens eine Zeitform muss ausgewählt sein
    let warning = null;
    if (checkedTenses.length === 0) {
      warning = "Bitte wähle mindestens eine Zeitform zum Üben aus!";
    }
    // Validierung: Mindestens eine Verb-Kategorie
    else if (checkedTypes.length === 0) {
      warning = "Bitte wähle mindestens eine Verb-Kategorie aus!";
    }
    // Validierung: Mindestens ein Tier, falls "irregular" gewählt
    else if (checkedTypes.includes("irregular") && checkedTiers.length === 0) {
      warning = "Bitte wähle mindestens eine Schwierigkeitsstufe (Tier) für unregelmäßige Verben aus!";
    }

    if (warning) {
      if (warningBanner && warningMessage) {
        warningMessage.textContent = warning;
        warningBanner.classList.remove("hidden");
      }
      setModeCardsDisabled(true);
      return;
    }

    // Wenn valide, Warnung ausblenden und Modi freischalten
    if (warningBanner) {
      warningBanner.classList.add("hidden");
    }
    setModeCardsDisabled(false);

    config.tenses = checkedTenses;
    config.verbTypes = checkedTypes;
    config.tiers = checkedTiers;
    config.sessionLength = selectedLength === "infinite" ? "infinite" : parseInt(selectedLength, 10);
    config.hideTranslations = hideTranslations;

    localStorage.setItem("past_tenses_config", JSON.stringify(config));
    
    updateMenuPreviews();

    // Erfolgs-Toast anzeigen
    if (showToast && settingsSaveSuccess) {
      settingsSaveSuccess.classList.remove("hidden");
      setTimeout(() => {
        settingsSaveSuccess.classList.add("hidden");
      }, 1500);
    }
  }

  function updateMenuPreviews() {
    // Zeiten Vorschau
    if (config.tenses.length === 2) {
      activeTensesPreview.textContent = "Indefinido & Imperfecto";
    } else {
      activeTensesPreview.textContent = TENSE_LABELS[config.tenses[0]];
    }

    // Verben Vorschau
    const typesText = [];
    if (config.verbTypes.includes("regular")) typesText.push("Regelmäßige");
    if (config.verbTypes.includes("spelling")) typesText.push("Endungs-Tricks");
    if (config.verbTypes.includes("irregular")) typesText.push("Unregelmäßige");
    
    if (config.verbTypes.length === 3) {
      activeVerbsPreview.textContent = "Alle Verben";
    } else if (typesText.length > 0) {
      activeVerbsPreview.textContent = typesText.join(" / ");
    } else {
      activeVerbsPreview.textContent = "Keine Auswahl";
    }
  }

  // ==========================================================================
  // FORTSCHRITT & MOTIVATIONS LOGIK (Tägliche Serie, XP, Fehlersammler)
  // ==========================================================================

  function loadStats() {
    const savedStats = localStorage.getItem("past_tenses_stats");
    if (savedStats) {
      try {
        stats = { ...stats, ...JSON.parse(savedStats) };
      } catch (e) {
        console.error("Fehler beim Laden der Statistiken:", e);
      }
    }
    updateStreak();
  }

  async function saveStats() {
    localStorage.setItem("past_tenses_stats", JSON.stringify(stats));
    
    // Cloud-Sync falls angemeldet und Firebase aktiv
    if (firebaseActive && currentUser && window.firebaseAuthAPI) {
      try {
        const { doc, setDoc } = window.firebaseAuthAPI;
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, {
          xp: stats.xp,
          streak: stats.streak,
          lastPracticed: stats.lastPracticed,
          verbErrors: stats.verbErrors || {},
          signalErrors: stats.signalErrors || {}
        }, { merge: true });
        console.log("[Firebase] Statistiken erfolgreich in der Cloud gesichert!");
      } catch (err) {
        console.error("[Firebase] Fehler beim Sichern der Statistiken in der Cloud:", err);
      }
    }
  }

  function getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function getYesterdayDateString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function updateStreak() {
    if (!stats.lastPracticed) return;
    const today = getTodayDateString();
    const last = stats.lastPracticed;
    
    if (today === last) return; // Heute bereits geübt
    
    // Berechne Abstand in Tagen
    const lastDate = new Date(last.replace(/-/g, "/"));
    const todayDate = new Date(today.replace(/-/g, "/"));
    const diffTime = Math.abs(todayDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      stats.streak = 0; // Serie gerissen
      saveStats();
    }
  }

  function recordPracticeSession() {
    const today = getTodayDateString();
    const last = stats.lastPracticed;
    
    if (last !== today) {
      if (last === getYesterdayDateString()) {
        stats.streak++;
      } else {
        stats.streak = 1; // Neue Serie starten
      }
      stats.lastPracticed = today;
    }
    saveStats();
  }

  function getLevelInfo() {
    const LevelThreshold = 100; // 100 XP pro Level
    const currentLevel = Math.floor(stats.xp / LevelThreshold) + 1;
    const xpInCurrentLevel = stats.xp % LevelThreshold;
    const xpNeededForNext = LevelThreshold - xpInCurrentLevel;
    const fillPercent = (xpInCurrentLevel / LevelThreshold) * 100;
    
    const LEVEL_TITLES = [
      "Principiante del Pasado (Level 1)",
      "Estudiante Aventurero (Level 2)",
      "Explorador de Tiempos (Level 3)",
      "Cazador de Verbos (Level 4)",
      "Señor del Pasado (Level 5)",
      "Gran Maestro del Tiempo (Level 6+)"
    ];
    
    const title = LEVEL_TITLES[Math.min(currentLevel - 1, LEVEL_TITLES.length - 1)];
    
    return {
      level: currentLevel,
      title: title,
      xpInLevel: xpInCurrentLevel,
      xpNeeded: xpNeededForNext,
      percent: fillPercent
    };
  }

  function detectSignalWord(sentence) {
    const allSignals = [
      "ayer", "anteayer", "anoche", "el lunes pasado", "la semana pasada", "el mes pasado", "el año pasado", 
      "hace dos días", "hace un año", "de repente", "de pronto", "un día", "una vez", "en 2018", "por fin", 
      "por último", "entonces", "durante drei stunden", "siempre", "casi siempre", "antes", "normalmente", 
      "a menudo", "todos los días", "cada año", "cada semana", "mientras", "frecuentemente", "generalmente", 
      "muchas veces", "a veces", "de vez en cuando", "en aquella época", "en aquellos tiempos", "los lunes", 
      "por aquel entonces"
    ];
    const lower = sentence.toLowerCase();
    for (const sig of allSignals) {
      if (lower.includes(sig)) return sig;
    }
    return null;
  }

  function renderProgressTab() {
    // 1. Serie rendern
    progressStreak.textContent = stats.streak === 1 ? "1 Tag" : `${stats.streak} Tage`;
    
    const streakSubText = document.getElementById("progress-streak-sub");
    if (stats.lastPracticed === getTodayDateString()) {
      streakSubText.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> Du hast heute bereits gelernt! Bleib morgen dran.`;
    } else {
      streakSubText.textContent = "Lerne heute, um deine Serie auszubauen!";
    }

    // 2. Level und XP rendern
    const lvlInfo = getLevelInfo();
    progressLevel.textContent = lvlInfo.title;
    progressXpText.textContent = `${stats.xp} XP Gesamt`;
    progressXpFill.style.width = `${lvlInfo.percent}%`;
    progressXpNext.textContent = `Noch ${lvlInfo.xpNeeded} XP bis Level ${lvlInfo.level + 1}`;

    // 3. Problemverben rendern
    troubleVerbsList.innerHTML = "";
    
    // Sortieren nach Fehlern (descending)
    const sortedVerbs = Object.entries(stats.verbErrors || {})
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (sortedVerbs.length === 0) {
      troubleVerbsList.innerHTML = `<li class="muted-note-item">Noch keine Fehler aufgezeichnet! Super Arbeit!</li>`;
    } else {
      sortedVerbs.forEach(([verbInfinitive, count]) => {
        const verbData = window.VERBS_DATABASE.find(v => v.infinitive === verbInfinitive);
        const trans = verbData ? ` (${verbData.translation})` : "";
        const li = document.createElement("li");
        li.innerHTML = `
          <span><span class="item-name">${verbInfinitive}</span><span style="color: var(--text-muted); font-size:0.85rem">${trans}</span></span>
          <span class="error-count">${count} ${count === 1 ? 'Fehler' : 'Fehler'}</span>
        `;
        troubleVerbsList.appendChild(li);
      });
    }

    // 4. Signalschwierigkeiten rendern
    troubleSignalsList.innerHTML = "";
    
    const sortedSignals = Object.entries(stats.signalErrors || {})
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (sortedSignals.length === 0) {
      troubleSignalsList.innerHTML = `<li class="muted-note-item">Noch keine Fehler aufgezeichnet! Super Arbeit!</li>`;
    } else {
      // Erkennen, zu welchem Tense das Signal gehört
      const signalTenseMap = {
        // Indefinido
        "ayer": "Indefinido", "anteayer": "Indefinido", "anoche": "Indefinido", "el lunes pasado": "Indefinido", 
        "la semana pasada": "Indefinido", "el mes pasado": "Indefinido", "el año pasado": "Indefinido",
        "hace dos días": "Indefinido", "hace un año": "Indefinido", "de repente": "Indefinido", 
        "de pronto": "Indefinido", "un día": "Indefinido", "una vez": "Indefinido", "en 2018": "Indefinido", 
        "por fin": "Indefinido", "por último": "Indefinido", "entonces": "Indefinido", "durante tres horas": "Indefinido",
        // Imperfecto
        "siempre": "Imperfecto", "casi siempre": "Imperfecto", "antes": "Imperfecto", "normalmente": "Imperfecto", 
        "a menudo": "Imperfecto", "todos los días": "Imperfecto", "cada jahr": "Imperfecto", "cada woche": "Imperfecto", 
        "mientras": "Imperfecto", "frecuentemente": "Imperfecto", "generalmente": "Imperfecto", 
        "muchas veces": "Imperfecto", "a veces": "Imperfecto", "de vez en cuando": "Imperfecto", 
        "en aquella época": "Imperfecto", "en aquellos tiempos": "Imperfecto", "los lunes": "Imperfecto", 
        "por aquel entonces": "Imperfecto"
      };

      sortedSignals.forEach(([sig, count]) => {
        const tense = signalTenseMap[sig] || "unbekannt";
        const li = document.createElement("li");
        li.innerHTML = `
          <span><span class="item-name">${sig}</span> <span style="font-size:0.8rem; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px; color:var(--text-muted)">fordert ${tense}</span></span>
          <span class="error-count">${count} ${count === 1 ? 'Fehler' : 'Fehler'}</span>
        `;
        troubleSignalsList.appendChild(li);
      });
    }

    // 5. Übungs-Knopf aktivieren falls Fehler da sind
    const totalErrors = sortedVerbs.length + sortedSignals.length;
    if (totalErrors > 0) {
      btnPracticeTrouble.removeAttribute("disabled");
    } else {
      btnPracticeTrouble.setAttribute("disabled", "true");
    }
  }

  function startTroublePracticeSession() {
    // Top-Problem-Verben holen
    const problemVerbsList = Object.entries(stats.verbErrors)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    // Top-Problem-Signalwörter
    const problemSignalsList = Object.entries(stats.signalErrors)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    if (problemVerbsList.length === 0 && problemSignalsList.length === 0) {
      alert("Du hast noch keine Schwachstellen aufgezeichnet! Lerne erst im normalen Modus.");
      return;
    }

    // Fragen-Generator
    const targetQuestions = [];
    const limit = 10;

    // 1. Versuchen Kontext-Übungen zu finden, die diese Signalwörter oder diese Verben nutzen
    const matchedContext = window.CONTEXT_EXERCISES.filter(ex => {
      const dbVerb = window.VERBS_DATABASE.find(v => v.infinitive === ex.verb);
      const detectedSig = detectSignalWord(ex.sentence);
      
      const verbMatches = problemVerbsList.includes(ex.verb);
      const signalMatches = detectedSig && problemSignalsList.includes(detectedSig);
      
      return verbMatches || signalMatches;
    });

    shuffleArray(matchedContext);

    // Als Fragen einspeisen
    matchedContext.slice(0, 5).forEach(ex => {
      targetQuestions.push(ex);
    });

    // 2. Formen-Bilden-Fragen generieren für die schwachen Verben
    const pronouns = ["yo", "tu", "el", "nosotros", "vosotros", "ellos"];
    const tenses = ["indefinido", "imperfecto"];

    problemVerbsList.forEach(verbInf => {
      const verbData = window.VERBS_DATABASE.find(v => v.infinitive === verbInf);
      if (verbData) {
        // Generiere 1-2 Formen für dieses Verb
        const randPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
        const randTense = tenses[Math.floor(Math.random() * tenses.length)];
        
        targetQuestions.push({
          type: "conjugate",
          verb: verbData.infinitive,
          translation: verbData.translation,
          person: randPronoun,
          tense: randTense,
          correctAnswer: verbData.tenses[randTense][randPronoun]
        });
      }
    });

    shuffleArray(targetQuestions);

    const finalQuestions = targetQuestions.slice(0, limit);

    // Falls wir weniger als 10 Fragen zusammenhaben, mit zufälligen unregelmäßigen Verben auffüllen
    if (finalQuestions.length < limit) {
      const needed = limit - finalQuestions.length;
      const irregularVerbs = window.VERBS_DATABASE.filter(v => !v.regular);
      
      for (let i = 0; i < needed; i++) {
        const verbData = irregularVerbs[Math.floor(Math.random() * irregularVerbs.length)];
        const randPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
        const randTense = tenses[Math.floor(Math.random() * tenses.length)];
        
        finalQuestions.push({
          type: "conjugate",
          verb: verbData.infinitive,
          translation: verbData.translation,
          person: randPronoun,
          tense: randTense,
          correctAnswer: verbData.tenses[randTense][randPronoun]
        });
      }
    }

    shuffleArray(finalQuestions);

    // Sitzung konfigurieren und starten
    session.isActive = true;
    session.currentIndex = 0;
    session.score = 0;
    session.attempts = 0;
    session.wrongAnswers = [];
    session.questions = finalQuestions;
    session.isAnswered = false;

    // Mixed-Mode Rendering-Vorkehrung: session.mode anpassen, falls nötig
    session.mode = "mixed"; 

    // UI-Wechsel
    practiceMenu.classList.add("hidden");
    sessionSummary.classList.add("hidden");
    document.getElementById("tab-progress").classList.remove("active");
    document.getElementById("tab-practice").classList.add("active");
    
    // Tab-Buttons updaten
    tabBtns.forEach(b => b.classList.remove("active"));
    document.querySelector('.tab-btn[data-tab="practice"]').classList.add("active");

    practiceSession.classList.remove("hidden");
    if (appHeader) appHeader.classList.add("hidden");
    showQuestion();
  }

  // ==========================================================================
  // INTERAKTIVES LEXIKON (BIBLIOTHEK)
  // ==========================================================================
  
  let currentLibraryFilter = "all";

  function renderVerbLibrary(searchQuery = "") {
    verbSearchResults.innerHTML = "";
    
    const query = searchQuery.toLowerCase().trim();
    
    // Verben aus DB filtern
    const filteredVerbs = window.VERBS_DATABASE.filter(verb => {
      // 1. Filter nach Suchbegriff (Infinitive oder Übersetzung)
      const matchesSearch = verb.infinitive.toLowerCase().includes(query) || 
                            verb.translation.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      // 2. Filter nach Typen (Regulär vs. Irregulär)
      if (currentLibraryFilter === "regular") {
        return verb.regular === true;
      } else if (currentLibraryFilter === "irregular") {
        return verb.regular === false;
      }
      
      return true;
    });

    if (filteredVerbs.length === 0) {
      verbSearchResults.innerHTML = `
        <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-face-frown" style="font-size: 2rem; margin-bottom: 12px; display: block;"></i>
          Keine Verben gefunden, die deiner Suche entsprechen.
        </div>
      `;
      return;
    }

    filteredVerbs.forEach(verb => {
      const card = document.createElement("div");
      card.className = "verb-result-card fade-in";
      
      const typeLabel = verb.regular 
        ? (verb.spellingChange ? "Spelling Change" : "Regulär") 
        : `Unregelmäßig (Tier ${verb.tier})`;
      const typeClass = verb.regular && !verb.spellingChange ? "regular" : "irregular";

      card.innerHTML = `
        <div class="verb-card-header">
          <h4>${verb.infinitive} <span>(${verb.translation})</span></h4>
          <span class="verb-type-badge ${typeClass}">${typeLabel}</span>
        </div>
        <div class="verb-card-bodies">
          <div class="verb-tense-col indefinido">
            <h5>Indefinido</h5>
            <div class="verb-forms-list">
              <span>yo <strong>${verb.tenses.indefinido.yo}</strong></span>
              <span>tú <strong>${verb.tenses.indefinido.tu}</strong></span>
              <span>él/ella <strong>${verb.tenses.indefinido.el}</strong></span>
              <span>nos. <strong>${verb.tenses.indefinido.nosotros}</strong></span>
              <span>vos. <strong>${verb.tenses.indefinido.vosotros}</strong></span>
              <span>ellos <strong>${verb.tenses.indefinido.ellos}</strong></span>
            </div>
          </div>
          <div class="verb-tense-col imperfecto">
            <h5>Imperfecto</h5>
            <div class="verb-forms-list">
              <span>yo <strong>${verb.tenses.imperfecto.yo}</strong></span>
              <span>tú <strong>${verb.tenses.imperfecto.tu}</strong></span>
              <span>él/ella <strong>${verb.tenses.imperfecto.el}</strong></span>
              <span>nos. <strong>${verb.tenses.imperfecto.nosotros}</strong></span>
              <span>vos. <strong>${verb.tenses.imperfecto.vosotros}</strong></span>
              <span>ellos <strong>${verb.tenses.imperfecto.ellos}</strong></span>
            </div>
          </div>
        </div>
      `;
      
      verbSearchResults.appendChild(card);
    });
  }

  // ==========================================================================
  // FRAGEN-GENERATOR (Sitzung-Logik)
  // ==========================================================================
  
  function startSession(mode) {
    session.isActive = true;
    session.mode = mode;
    session.currentIndex = 0;
    session.score = 0;
    session.attempts = 0;
    session.wrongAnswers = [];
    session.isAnswered = false;
    
    if (appHeader) appHeader.classList.add("hidden");
    
    // Fragen generieren
    generateQuestions();

    if (session.questions.length === 0) {
      alert("Es wurden keine passenden Übungen für deine Einstellungen gefunden. Bitte passe deine Filter an.");
      session.isActive = false;
      return;
    }

    // UI-Wechsel
    practiceMenu.classList.add("hidden");
    sessionSummary.classList.add("hidden");
    practiceSession.classList.remove("hidden");
    
    showQuestion();
  }

  function generateQuestions() {
    session.questions = [];
    const limit = config.sessionLength === "infinite" ? 99999 : config.sessionLength;

    // Verben holen, die dem eingestellten Typ entsprechen
    const availableVerbs = window.VERBS_DATABASE.filter(verb => {
      if (verb.regular && !verb.spellingChange) return config.verbTypes.includes("regular");
      if (verb.regular && verb.spellingChange) return config.verbTypes.includes("spelling");
      if (!verb.regular) {
        return config.verbTypes.includes("irregular") && config.tiers.includes(verb.tier);
      }
      return false;
    });

    if (session.mode === "context" || session.mode === "select-tense") {
      // Kontextfragen filtern
      let filteredContext = window.CONTEXT_EXERCISES.filter(ex => {
        // Muss in den ausgewählten Zeiten enthalten sein
        if (!config.tenses.includes(ex.correctTense)) return false;
        
        // Muss dem Verbtyp entsprechen
        const dbVerb = window.VERBS_DATABASE.find(v => v.infinitive === ex.verb);
        if (dbVerb) {
          if (dbVerb.regular && !dbVerb.spellingChange) return config.verbTypes.includes("regular");
          if (dbVerb.regular && dbVerb.spellingChange) return config.verbTypes.includes("spelling");
          if (!dbVerb.regular) {
            return config.verbTypes.includes("irregular") && config.tiers.includes(dbVerb.tier);
          }
        }
        return true;
      });

      // Mischen
      shuffleArray(filteredContext);
      
      // Limitieren
      session.questions = filteredContext.slice(0, Math.min(limit, filteredContext.length));
    } 
    else if (session.mode === "signals") {
      // Signalwörter filtern (muss in ausgewählten Zeiten sein)
      const filteredSignals = SIGNALS_DB.filter(sig => config.tenses.includes(sig.tense));
      
      // Mischen
      shuffleArray(filteredSignals);
      
      session.questions = filteredSignals.slice(0, Math.min(limit, filteredSignals.length)).map(sig => ({
        type: "signal",
        word: sig.word,
        translation: sig.translation,
        tense: sig.tense,
        correctTense: sig.tense,
        correctAnswer: sig.tense,
        explanation: sig.explanation
      }));
    } 
    else if (session.mode === "conjugate" || session.mode === "recognize") {
      if (availableVerbs.length === 0) return;

      // Wir erstellen eine Liste möglicher Fragen (Kombinationen aus Verb, Person, Zeitform)
      const possibleQuestions = [];
      const pronouns = ["yo", "tu", "el", "nosotros", "vosotros", "ellos"];

      availableVerbs.forEach(verb => {
        config.tenses.forEach(tense => {
          pronouns.forEach(pronoun => {
            possibleQuestions.push({
              verb: verb,
              tense: tense,
              pronoun: pronoun,
              correctAnswer: verb.tenses[tense][pronoun]
            });
          });
        });
      });

      // Mischen
      shuffleArray(possibleQuestions);
      
      // Begrenzen
      const selectedQuestions = possibleQuestions.slice(0, Math.min(limit, possibleQuestions.length));
      
      session.questions = selectedQuestions.map(q => {
        if (session.mode === "conjugate") {
          return {
            type: "conjugate",
            verb: q.verb.infinitive,
            translation: q.verb.translation,
            person: q.pronoun,
            tense: q.tense,
            correctAnswer: q.correctAnswer
          };
        } else {
          // recognize
          return {
            type: "recognize",
            conjugatedForm: q.correctAnswer,
            verb: q.verb.infinitive,
            translation: q.verb.translation,
            person: q.pronoun,
            tense: q.tense,
            correctAnswer: q.tense // Die korrekte Antwort ist die Zeitform selbst
          };
        }
      });
    }
  }

  function showQuestion() {
    session.isAnswered = false;
    feedbackWidget.classList.add("hidden");
    btnNextQuestion.classList.add("hidden");
    
    // Fortschritt & Score aktualisieren
    updateProgressUI();

    const q = session.questions[session.currentIndex];
    if (q && q.person) {
      q.person = getCanonicalPersonKey(q.person);
    }
    questionCard.innerHTML = "";

    // Dynamische Bestimmung des Rendermodus (für Mixed-Modus bei Schwachstellen)
    let renderMode = session.mode;
    if (renderMode === "mixed") {
      renderMode = q.type || (q.sentence ? "context" : "conjugate");
    }

    // Body-Themen zurücksetzen für farblichen Gesamt-Mood
    document.body.classList.remove("theme-indefinido", "theme-imperfecto");

    // Wir setzen das Theme nur, wenn die Zeitform fest vorgegeben ist (Formen bilden)
    if (renderMode === "conjugate" && q.tense) {
      document.body.classList.add(`theme-${q.tense}`);
    }

    if (renderMode === "conjugate") {
      renderConjugateQuestion(q);
    } else if (renderMode === "recognize") {
      renderRecognizeQuestion(q);
    } else if (renderMode === "context") {
      renderContextQuestion(q);
    } else if (renderMode === "select-tense") {
      renderSelectTenseQuestion(q);
    } else if (renderMode === "signals") {
      renderSignalQuestion(q);
    }
  }

  function updateProgressUI() {
    const total = session.questions.length;
    const current = session.currentIndex + 1;
    const progressPercent = config.sessionLength === "infinite" ? 100 : (session.currentIndex / total) * 100;

    sessionProgress.style.width = `${progressPercent}%`;
    sessionProgressText.textContent = config.sessionLength === "infinite" 
      ? `Frage ${current} (Endlos)`
      : `Frage ${current} von ${total}`;
    
    sessionScoreText.textContent = `${session.score} / ${session.attempts}`;
  }

  // ==========================================================================
  // FRAGEN-RENDERING IM DETAIL
  // ==========================================================================
  
  // Modus 1: Formen bilden
  function renderConjugateQuestion(q) {
    const container = document.createElement("div");
    container.className = "conjugate-question-view fade-in";
    
    // Tense banner
    const tenseBanner = `
      <div class="tense-header-banner ${q.tense}">
        <i class="${q.tense === 'indefinido' ? 'fa-solid fa-bolt' : 'fa-solid fa-clock'}"></i>
        <span>${TENSE_LABELS[q.tense]}</span>
      </div>
    `;

    const verbTrans = config.hideTranslations ? "" : q.translation;
    const personLabel = PRONOUN_LABELS[q.person].pronoun;

    container.innerHTML = `
      ${tenseBanner}
      
      <div class="prompt-grid-boxes">
        <div class="prompt-box-element verb-box">
          <span class="box-label">Verb (Infinitiv)</span>
          <span class="box-value">${q.verb}</span>
          <span class="box-translation" id="verb-translation-value"><span class="hidden-hint">?</span></span>
        </div>
        <div class="prompt-box-element person-box">
          <span class="box-label">Person</span>
          <span class="box-value"><span class="person-number-badge">${PRONOUN_LABELS[q.person].number}</span>${personLabel}</span>
          <span class="box-translation" id="person-translation-value">${PRONOUN_LABELS[q.person].grammar}</span>
        </div>
      </div>
      
      <div class="hint-btn-wrapper" style="text-align: center; margin-bottom: 20px;">
        <button type="button" id="btn-toggle-context-hint" class="btn-hint-toggle">
          <i class="fa-solid fa-lightbulb"></i> <span>Hilfe / Übersetzung anzeigen</span>
        </button>
      </div>

      <div class="input-area">
        <div class="text-input-wrapper">
          <input type="text" id="user-answer-input" class="answer-input" autocomplete="off" placeholder="Schreibe die konjugierte Form..." autofocus>
        </div>
        <div class="accent-keyboard">
          <button class="accent-btn" data-char="á">á</button>
          <button class="accent-btn" data-char="é">é</button>
          <button class="accent-btn" data-char="í">í</button>
          <button class="accent-btn" data-char="ó">ó</button>
          <button class="accent-btn" data-char="ú">ú</button>
          <button class="accent-btn" data-char="ñ">ñ</button>
        </div>
        <button id="btn-submit-answer" class="btn-primary" style="width: 100%; margin-top: 10px;">Antwort prüfen</button>
      </div>
    `;

    questionCard.appendChild(container);

    const btnToggleHint = container.querySelector("#btn-toggle-context-hint");
    const verbTranslationValue = container.querySelector("#verb-translation-value");
    const personTranslationValue = container.querySelector("#person-translation-value");

    let hintVisible = false;

    function revealHint() {
      hintVisible = true;
      btnToggleHint.innerHTML = `<i class="fa-regular fa-lightbulb"></i> <span>Hilfe ausblenden</span>`;
      btnToggleHint.classList.add("active-hint");
      
      verbTranslationValue.innerHTML = verbTrans;
      personTranslationValue.innerHTML = config.hideTranslations 
        ? PRONOUN_LABELS[q.person].grammar 
        : `(${PRONOUN_LABELS[q.person].translation}) • ${PRONOUN_LABELS[q.person].grammar}`;
    }

    function hideHint() {
      hintVisible = false;
      btnToggleHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <span>Hilfe / Übersetzung anzeigen</span>`;
      btnToggleHint.classList.remove("active-hint");
      
      verbTranslationValue.innerHTML = `<span class="hidden-hint">?</span>`;
      personTranslationValue.innerHTML = PRONOUN_LABELS[q.person].grammar;
    }

    btnToggleHint.addEventListener("click", () => {
      if (hintVisible) {
        hideHint();
      } else {
        revealHint();
      }
    });

    hideHint();
    
    setupInputHandling();
  }

  // Modus 2: Formen erkennen
  function renderRecognizeQuestion(q) {
    const container = document.createElement("div");
    container.className = "recognize-question-view fade-in";

    container.innerHTML = `
      <div class="tense-header-banner recognize-mode">
        <i class="fa-solid fa-magnifying-glass"></i>
        <span>Welche Zeitform ist das?</span>
      </div>

      <div class="recognize-word-display">${q.conjugatedForm}</div>

      <div class="recognize-meta-details">
        <span id="recognize-verb-meta">Verb: <strong>${q.verb}</strong> <span class="hidden-hint">(?)</span></span>
        <span id="recognize-person-meta">Person: <span class="person-number-badge">${PRONOUN_LABELS[q.person].number}</span> <strong>${PRONOUN_LABELS[q.person].pronoun}</strong> (${PRONOUN_LABELS[q.person].grammar})</span>
      </div>

      <div class="hint-btn-wrapper" style="text-align: center; margin-bottom: 20px;">
        <button type="button" id="btn-toggle-context-hint" class="btn-hint-toggle">
          <i class="fa-solid fa-lightbulb"></i> <span>Hilfe / Übersetzung anzeigen</span>
        </button>
      </div>

      <div class="choices-grid">
        <button class="choice-btn" data-value="indefinido">${TENSE_LABELS.indefinido}</button>
        <button class="choice-btn" data-value="imperfecto">${TENSE_LABELS.imperfecto}</button>
      </div>
    `;

    questionCard.appendChild(container);

    const btnToggleHint = container.querySelector("#btn-toggle-context-hint");
    const verbMetaSpan = container.querySelector("#recognize-verb-meta");
    const personMetaSpan = container.querySelector("#recognize-person-meta");

    let hintVisible = false;

    function revealHint() {
      hintVisible = true;
      btnToggleHint.innerHTML = `<i class="fa-regular fa-lightbulb"></i> <span>Hilfe ausblenden</span>`;
      btnToggleHint.classList.add("active-hint");
      
      const verbMeta = config.hideTranslations 
        ? `Verb: <strong>${q.verb}</strong>`
        : `Verb: <strong>${q.verb}</strong> (${q.translation})`;
      const personMeta = `Person: <span class="person-number-badge">${PRONOUN_LABELS[q.person].number}</span> <strong>${PRONOUN_LABELS[q.person].pronoun}</strong> (${PRONOUN_LABELS[q.person].grammar}) (${PRONOUN_LABELS[q.person].translation})`;
      
      verbMetaSpan.innerHTML = verbMeta;
      personMetaSpan.innerHTML = personMeta;
    }

    function hideHint() {
      hintVisible = false;
      btnToggleHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <span>Hilfe / Übersetzung anzeigen</span>`;
      btnToggleHint.classList.remove("active-hint");
      
      const verbMeta = `Verb: <strong>${q.verb}</strong> <span class="hidden-hint">(?)</span>`;
      const personMeta = `Person: <span class="person-number-badge">${PRONOUN_LABELS[q.person].number}</span> <strong>${PRONOUN_LABELS[q.person].pronoun}</strong> (${PRONOUN_LABELS[q.person].grammar})`;
      
      verbMetaSpan.innerHTML = verbMeta;
      personMetaSpan.innerHTML = personMeta;
    }

    btnToggleHint.addEventListener("click", () => {
      if (hintVisible) {
        hideHint();
      } else {
        revealHint();
      }
    });

    hideHint();

    // Klick-Handler für Multiple Choice
    const choiceBtns = container.querySelectorAll(".choice-btn");
    choiceBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (session.isAnswered) return;
        
        choiceBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        
        checkAnswer(btn.getAttribute("data-value"));
      });
    });
  }

  // Modus 3: Anwendung im Kontext (Lückentext)
  function renderContextQuestion(q) {
    const container = document.createElement("div");
    container.className = "context-question-view fade-in";

    // Textlücke visuell aufbereiten
    const displaySentence = q.sentence.replace("___", `<span class="cloze-gap active" id="cloze-gap-view">___</span>`);

    // Übersetzung des Verbs (Infinitiv) nachschlagen, falls Übersetzungen nicht ausgeblendet sind
    const verbObj = window.VERBS_DATABASE.find(v => v.infinitive === q.verb);
    const verbTrans = (verbObj && !config.hideTranslations) ? verbObj.translation : "";

    container.innerHTML = `
      <div class="tense-header-banner context-mode">
        <i class="fa-solid fa-paragraph"></i>
        <span>Anwendung im Kontext</span>
      </div>

      <div class="prompt-grid-boxes">
        <div class="prompt-box-element verb-box">
          <span class="box-label">Verb (Infinitiv)</span>
          <span class="box-value">${q.verb}</span>
          <span class="box-translation" id="context-verb-translation"><span class="hidden-hint">?</span></span>
        </div>
        <div class="prompt-box-element person-box">
          <span class="box-label">Person</span>
          <span class="box-value" id="context-person-value">
            <span class="person-placeholder"><i class="fa-solid fa-eye-slash"></i> ?</span>
          </span>
          <span class="box-translation" id="context-person-subtext">
            <span class="person-placeholder" style="font-size:0.8rem;">Im Satz bestimmen / 'Hilfe' klicken</span>
          </span>
        </div>
      </div>

      <div class="context-sentence-card">
        <p class="context-sentence">${displaySentence}</p>
      </div>

      <div id="context-hint-container" class="context-hint-area hidden">
        <div class="context-translation-hint">
          <i class="fa-solid fa-language"></i>
          <span><strong>Übersetzung:</strong> "${q.translation}"</span>
        </div>
      </div>

      <div class="hint-btn-wrapper" style="text-align: center; margin-bottom: 20px;">
        <button type="button" id="btn-toggle-context-hint" class="btn-hint-toggle">
          <i class="fa-solid fa-lightbulb"></i> <span>Hilfe / Übersetzung anzeigen</span>
        </button>
      </div>

      <div class="input-area">
        <div class="text-input-wrapper">
          <input type="text" id="user-answer-input" class="answer-input" autocomplete="off" placeholder="Setze die richtige konjugierte Form ein..." autofocus>
        </div>
        <div class="accent-keyboard">
          <button class="accent-btn" data-char="á">á</button>
          <button class="accent-btn" data-char="é">é</button>
          <button class="accent-btn" data-char="í">í</button>
          <button class="accent-btn" data-char="ó">ó</button>
          <button class="accent-btn" data-char="ú">ú</button>
          <button class="accent-btn" data-char="ñ">ñ</button>
        </div>
        <button id="btn-submit-answer" class="btn-primary" style="width: 100%; margin-top: 10px;">Antwort prüfen</button>
      </div>
    `;

    questionCard.appendChild(container);

    // Hilfsfunktion zur Steuerung der Lösungs-Hinweise
    const btnToggleHint = container.querySelector("#btn-toggle-context-hint");
    const hintContainer = container.querySelector("#context-hint-container");
    const personValue = container.querySelector("#context-person-value");
    const personSubtext = container.querySelector("#context-person-subtext");
    const verbTranslationEl = container.querySelector("#context-verb-translation");

    let hintVisible = false;

    function revealHint() {
      hintVisible = true;
      hintContainer.classList.remove("hidden");
      btnToggleHint.innerHTML = `<i class="fa-regular fa-lightbulb"></i> <span>Hilfe ausblenden</span>`;
      btnToggleHint.classList.add("active-hint");
      
      const personLabel = PRONOUN_LABELS[q.person].pronoun;
      const personTrans = config.hideTranslations 
        ? PRONOUN_LABELS[q.person].grammar 
        : `(${PRONOUN_LABELS[q.person].translation}) • ${PRONOUN_LABELS[q.person].grammar}`;
      
      personValue.innerHTML = `<span class="person-number-badge">${PRONOUN_LABELS[q.person].number}</span>${personLabel}`;
      personSubtext.innerHTML = personTrans;
      
      if (verbTranslationEl) {
        verbTranslationEl.innerHTML = verbTrans;
      }
    }

    function hideHint() {
      hintVisible = false;
      hintContainer.classList.add("hidden");
      btnToggleHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <span>Hilfe / Übersetzung anzeigen</span>`;
      btnToggleHint.classList.remove("active-hint");
      
      personValue.innerHTML = `<span class="person-placeholder"><i class="fa-solid fa-eye-slash"></i> ?</span>`;
      personSubtext.innerHTML = `<span class="person-placeholder" style="font-size:0.8rem;">Im Satz bestimmen / 'Hilfe' klicken</span>`;
      
      if (verbTranslationEl) {
        verbTranslationEl.innerHTML = `<span class="hidden-hint">?</span>`;
      }
    }

    btnToggleHint.addEventListener("click", () => {
      if (hintVisible) {
        hideHint();
      } else {
        revealHint();
      }
    });

    setupInputHandling();
  }

  // Modus 4: Zeiten wählen (Indefinido vs. Imperfecto)
  function renderSelectTenseQuestion(q) {
    const container = document.createElement("div");
    container.className = "select-tense-question-view fade-in";

    // Textlücke visuell aufbereiten
    const displaySentence = q.sentence.replace("___", `<span class="cloze-gap active" id="cloze-gap-view">___</span>`);

    // Infinitiv-Übersetzung nachschlagen
    const verbObj = window.VERBS_DATABASE.find(v => v.infinitive === q.verb);
    const verbTrans = (verbObj && !config.hideTranslations) ? verbObj.translation : "";

    // Beide Konjugationsformen generieren
    let formImperfecto = "";
    let formIndefinido = "";
    
    if (q.correctTense === "imperfecto") {
      formImperfecto = q.correctAnswer;
      formIndefinido = getVerbForm(q.verb, "indefinido", q.person) || "";
    } else {
      formIndefinido = q.correctAnswer;
      formImperfecto = getVerbForm(q.verb, "imperfecto", q.person) || "";
    }

    container.innerHTML = `
      <div class="tense-header-banner context-mode">
        <i class="fa-solid fa-toggle-on"></i>
        <span>Zeiten wählen (Indefinido oder Imperfecto)</span>
      </div>

      <div class="prompt-grid-boxes">
        <div class="prompt-box-element verb-box">
          <span class="box-label">Verb (Infinitiv)</span>
          <span class="box-value">${q.verb}</span>
          <span class="box-translation" id="context-verb-translation"><span class="hidden-hint">?</span></span>
        </div>
        <div class="prompt-box-element person-box">
          <span class="box-label">Person</span>
          <span class="box-value" id="context-person-value">
            <span class="person-placeholder"><i class="fa-solid fa-eye-slash"></i> ?</span>
          </span>
          <span class="box-translation" id="context-person-subtext">
            <span class="person-placeholder" style="font-size:0.8rem;">Im Satz bestimmen / 'Hilfe' klicken</span>
          </span>
        </div>
      </div>

      <div class="context-sentence-card">
        <p class="context-sentence">${displaySentence}</p>
      </div>

      <div id="context-hint-container" class="context-hint-area hidden">
        <div class="context-translation-hint">
          <i class="fa-solid fa-language"></i>
          <span><strong>Übersetzung:</strong> "${q.translation}"</span>
        </div>
      </div>

      <div class="hint-btn-wrapper" style="text-align: center; margin-bottom: 20px;">
        <button type="button" id="btn-toggle-context-hint" class="btn-hint-toggle">
          <i class="fa-solid fa-lightbulb"></i> <span>Hilfe / Übersetzung anzeigen</span>
        </button>
      </div>

      <div class="choices-grid" style="margin-top: 20px;">
        <button class="choice-btn" data-value="${formIndefinido}">${formIndefinido} <span style="font-size:0.85rem;font-weight:normal;opacity:0.7;display:block;">(Pretérito Indefinido)</span></button>
        <button class="choice-btn" data-value="${formImperfecto}">${formImperfecto} <span style="font-size:0.85rem;font-weight:normal;opacity:0.7;display:block;">(Pretérito Imperfecto)</span></button>
      </div>
    `;

    questionCard.appendChild(container);

    // Hilfsfunktion zur Steuerung der Lösungs-Hinweise (analog zum normalen Kontext-Modus)
    const btnToggleHint = container.querySelector("#btn-toggle-context-hint");
    const hintContainer = container.querySelector("#context-hint-container");
    const personValue = container.querySelector("#context-person-value");
    const personSubtext = container.querySelector("#context-person-subtext");
    const verbTranslationEl = container.querySelector("#context-verb-translation");

    let hintVisible = false;

    function revealHint() {
      hintVisible = true;
      hintContainer.classList.remove("hidden");
      btnToggleHint.innerHTML = `<i class="fa-regular fa-lightbulb"></i> <span>Hilfe ausblenden</span>`;
      btnToggleHint.classList.add("active-hint");
      
      const personLabel = PRONOUN_LABELS[q.person].pronoun;
      const personTrans = config.hideTranslations 
        ? PRONOUN_LABELS[q.person].grammar 
        : `(${PRONOUN_LABELS[q.person].translation}) • ${PRONOUN_LABELS[q.person].grammar}`;
      
      personValue.innerHTML = `<span class="person-number-badge">${PRONOUN_LABELS[q.person].number}</span>${personLabel}`;
      personSubtext.innerHTML = personTrans;

      if (verbTranslationEl) {
        verbTranslationEl.innerHTML = verbTrans;
      }
    }

    function hideHint() {
      hintVisible = false;
      hintContainer.classList.add("hidden");
      btnToggleHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <span>Hilfe / Übersetzung anzeigen</span>`;
      btnToggleHint.classList.remove("active-hint");
      
      personValue.innerHTML = `<span class="person-placeholder"><i class="fa-solid fa-eye-slash"></i> ?</span>`;
      personSubtext.innerHTML = `<span class="person-placeholder" style="font-size:0.8rem;">Im Satz bestimmen / 'Hilfe' klicken</span>`;

      if (verbTranslationEl) {
        verbTranslationEl.innerHTML = `<span class="hidden-hint">?</span>`;
      }
    }

    btnToggleHint.addEventListener("click", () => {
      if (hintVisible) {
        hideHint();
      } else {
        revealHint();
      }
    });

    // Klick-Handler für Multiple Choice
    const choiceBtns = container.querySelectorAll(".choice-btn");
    const clozeGap = document.getElementById("cloze-gap-view");

    choiceBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (session.isAnswered) return;
        
        const val = btn.getAttribute("data-value");
        choiceBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        
        // Die Lücke mit dem ausgewählten Verb füllen
        if (clozeGap) {
          clozeGap.textContent = val;
          clozeGap.classList.remove("active");
        }
        
        checkAnswer(val);

        // Feedback-Highlight auf den Knöpfen
        choiceBtns.forEach(b => {
          const bVal = b.getAttribute("data-value");
          if (bVal.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
            b.classList.add("correct");
          } else if (b === btn) {
            b.classList.add("incorrect");
          }
        });
      });
    });

    // Zufällige Reihenfolge der Knöpfe (damit nicht immer Indefinido oben steht)
    if (Math.random() > 0.5) {
      const grid = container.querySelector(".choices-grid");
      grid.appendChild(choiceBtns[0]); // verschiebt den ersten nach hinten
    }
  }

  // Modus 5: Signalwörter zuordnen
  function renderSignalQuestion(q) {
    const container = document.createElement("div");
    container.className = "signal-question-view fade-in";

    container.innerHTML = `
      <div class="tense-header-banner context-mode">
        <i class="fa-solid fa-hourglass-half"></i>
        <span>Signalwörter zuordnen</span>
      </div>

      <p style="text-align: center; margin-bottom: 12px; font-weight: 600; color: var(--text-muted);">
        Welcher Zeitform gehört dieses Signalwort an?
      </p>

      <div class="signal-word-display">${q.word}</div>
      <div class="signal-translation-display" id="signal-translation-container"><span class="hidden-hint">(Bedeutung: ?)</span></div>

      <div class="hint-btn-wrapper" style="text-align: center; margin-bottom: 20px;">
        <button type="button" id="btn-toggle-context-hint" class="btn-hint-toggle">
          <i class="fa-solid fa-lightbulb"></i> <span>Hilfe / Übersetzung anzeigen</span>
        </button>
      </div>

      <div class="choices-grid">
        <button class="choice-btn" data-value="indefinido">${TENSE_LABELS.indefinido}</button>
        <button class="choice-btn" data-value="imperfecto">${TENSE_LABELS.imperfecto}</button>
      </div>
    `;

    questionCard.appendChild(container);

    const btnToggleHint = container.querySelector("#btn-toggle-context-hint");
    const translationContainer = container.querySelector("#signal-translation-container");

    let hintVisible = false;

    function revealHint() {
      hintVisible = true;
      btnToggleHint.innerHTML = `<i class="fa-regular fa-lightbulb"></i> <span>Hilfe ausblenden</span>`;
      btnToggleHint.classList.add("active-hint");
      translationContainer.innerHTML = `(Bedeutung: "${q.translation}")`;
    }

    function hideHint() {
      hintVisible = false;
      btnToggleHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <span>Hilfe / Übersetzung anzeigen</span>`;
      btnToggleHint.classList.remove("active-hint");
      translationContainer.innerHTML = `<span class="hidden-hint">(Bedeutung: ?)</span>`;
    }

    btnToggleHint.addEventListener("click", () => {
      if (hintVisible) {
        hideHint();
      } else {
        revealHint();
      }
    });

    hideHint();

    const choiceBtns = container.querySelectorAll(".choice-btn");
    choiceBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (session.isAnswered) return;
        
        const val = btn.getAttribute("data-value");
        choiceBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        
        checkAnswer(val);

        // Feedback-Highlight auf den Knöpfen
        choiceBtns.forEach(b => {
          const bVal = b.getAttribute("data-value");
          if (bVal === q.correctAnswer) {
            b.classList.add("correct");
          } else if (b === btn) {
            b.classList.add("incorrect");
          }
        });
      });
    });
  }

  // Hilfsfunktion zur Einrichtung der Akzent-Buttons und Enter-Logik
  function setupInputHandling() {
    const input = document.getElementById("user-answer-input");
    const accentBtns = document.querySelectorAll(".accent-btn");
    const submitBtn = document.getElementById("btn-submit-answer");
    const clozeGap = document.getElementById("cloze-gap-view");

    if (!input) return;

    // Fokus halten
    input.focus();

    // Eingabespiegelung im Lückentext falls vorhanden
    if (clozeGap) {
      input.addEventListener("input", () => {
        clozeGap.textContent = input.value.trim() === "" ? "___" : input.value;
      });
    }

    // Akzent-Klicks
    accentBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (session.isAnswered) return;
        
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;
        const char = btn.getAttribute("data-char");
        
        input.value = text.substring(0, start) + char + text.substring(end);
        input.selectionStart = input.selectionEnd = start + 1;
        input.focus();
        
        if (clozeGap) {
          clozeGap.textContent = input.value;
        }
      });
    });

    // Enter-Taste fängt ab
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !session.isAnswered) {
        checkAnswer(input.value);
      }
    });

    // Klick auf Senden
    submitBtn.addEventListener("click", () => {
      if (!session.isAnswered) {
        checkAnswer(input.value);
      }
    });
  }

  // ==========================================================================
  // ANTWORT-VALIDIERUNG & AKZENT-TOLERANZ
  // ==========================================================================
  
  function stripAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function checkAnswer(userAnswer) {
    session.isAnswered = true;
    session.attempts++;

    const q = session.questions[session.currentIndex];

    // Bei Antwortprüfung automatisch alle Kontext-Hinweise/Übersetzungen aufdecken
    const btnToggleHint = document.getElementById("btn-toggle-context-hint");
    if (btnToggleHint && !btnToggleHint.classList.contains("active-hint")) {
      btnToggleHint.click();
    }

    // Akzent-Keyboard und Submit-Button ausblenden, um Platz zu sparen
    const keyboard = document.querySelector(".accent-keyboard");
    const submitBtn = document.getElementById("btn-submit-answer");
    if (keyboard) keyboard.classList.add("hidden");
    if (submitBtn) submitBtn.classList.add("hidden");
    
    // Normalisierte Antworten
    const cleanUser = userAnswer.toLowerCase().trim();
    const cleanCorrect = q.correctAnswer.toLowerCase().trim();

    const isMatch = cleanUser === cleanCorrect;
    const isCloseMatch = stripAccents(cleanUser) === stripAccents(cleanCorrect);

    let isCorrect = false;
    let feedbackMsg = "";
    let isAccentError = false;

    // Deaktiviere Eingaben
    const input = document.getElementById("user-answer-input");
    if (input) {
      input.disabled = true;
      if (isMatch) {
        input.style.color = "var(--success)";
      } else {
        input.style.color = "var(--danger)";
        // Shake-Effekt
        input.classList.add("shake");
      }
    }

    if (isMatch) {
      // Exakte Übereinstimmung
      isCorrect = true;
      session.score++;
      feedbackMsg = "Genial! Das ist vollkommen richtig.";
      
      // XP gutschreiben
      stats.xp += 10;
      saveStats();
    } 
    else if (isCloseMatch) {
      // Akzentfehler (Ignorierter Akzent)
      isAccentError = true;
      feedbackMsg = `Achtung auf Akzente! Richtig ist: <strong>${q.correctAnswer}</strong> (nicht <em>${userAnswer}</em>). Im Spanischen verändern Akzente oft die Zeitform oder Bedeutung!`;
    } 
    else {
      // Komplett falsch
      feedbackMsg = `Falsch. Die richtige Form lautet: <strong>${q.correctAnswer}</strong>.`;
    }

    // Fehler tracken für die Zusammenfassung und Baustellen (Fehlersammler)
    if (!isCorrect) {
      session.wrongAnswers.push({
        question: q,
        userAnswer: userAnswer || "[Keine Antwort]",
        correctAnswer: q.correctAnswer,
        tense: q.tense
      });

      // Baustellen-Tracker
      if (q.verb) {
        stats.verbErrors[q.verb] = (stats.verbErrors[q.verb] || 0) + 1;
      }
      if (q.sentence) {
        const sig = detectSignalWord(q.sentence);
        if (sig) {
          stats.signalErrors[sig] = (stats.signalErrors[sig] || 0) + 1;
        }
      }
      if (q.type === "signal") {
        stats.signalErrors[q.word] = (stats.signalErrors[q.word] || 0) + 1;
      }
      saveStats();
    }

    // Feedback-Widget konfigurieren und anzeigen
    feedbackWidget.classList.remove("hidden");
    
    if (isCorrect) {
      feedbackWidget.className = "feedback-widget correct";
      feedbackIcon.className = "fa-solid fa-check";
      feedbackHeadline.textContent = "Richtig!";
      feedbackMessage.innerHTML = feedbackMsg;
    } else {
      feedbackWidget.className = "feedback-widget incorrect";
      feedbackIcon.className = "fa-solid fa-xmark";
      feedbackHeadline.textContent = isAccentError ? "Akzent-Fehler!" : "Falsch!";
      feedbackMessage.innerHTML = feedbackMsg;
    }

    // Erklärung anzeigen für Kontext oder detailliertes Feedback
    if ((session.mode === "context" || session.mode === "signals" || q.sentence) && q.explanation) {
      feedbackExplanationBox.classList.remove("hidden");
      feedbackExplanation.innerHTML = q.explanation;
      feedbackTranslation.textContent = q.type === "signal" 
        ? `Signalwort: "${q.word}" = "${q.translation}"`
        : q.translation;
    } else if (session.mode === "conjugate" || q.type === "conjugate") {
      // Erklärung für Bildung einblenden
      feedbackExplanationBox.classList.remove("hidden");
      const regularInfo = window.VERBS_DATABASE.find(v => v.infinitive === q.verb)?.regular;
      const explanationText = regularInfo 
        ? `"${q.verb}" ist ein <strong>regelmäßiges</strong> Verb auf -${q.verb.slice(-2)}. Seine Endung im ${TENSE_LABELS[q.tense]} für "${q.person}" ist regelmäßig.`
        : `"${q.verb}" ist ein <strong>unregelmäßiges</strong> Verb im ${TENSE_LABELS[q.tense]}. Diese Formen müssen gelernt werden.`;
      feedbackExplanation.innerHTML = explanationText;
      feedbackTranslation.textContent = `Übersetzung des Verbs: "${q.verb}" = "${q.translation}"`;
    } else {
      feedbackExplanationBox.classList.add("hidden");
    }

    // Weiter-Button einblenden (sitzt jetzt über dem Feedback)
    btnNextQuestion.classList.remove("hidden");
    btnNextQuestion.focus();
  }

  // Nächste Frage oder Ergebnis
  btnNextQuestion.addEventListener("click", () => {
    session.currentIndex++;
    if (session.currentIndex < session.questions.length) {
      showQuestion();
    } else {
      showSummary();
    }
  });

  // ==========================================================================
  // ZUSAMMENFASSUNG (STATISTIKEN)
  // ==========================================================================
  
  function showSummary() {
    // Body-Themen zurücksetzen
    document.body.classList.remove("theme-indefinido", "theme-imperfecto");

    practiceSession.classList.add("hidden");
    sessionSummary.classList.remove("hidden");
    if (appHeader) appHeader.classList.remove("hidden");

    const total = session.attempts;
    const correct = session.score;
    const wrong = total - correct;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // XP gutschreiben für den Rundenabschluss (Fehlersammler / Streak-Trigger)
    stats.xp += 50;
    recordPracticeSession();
    saveStats();

    // Score Ring animieren
    animateCircularChart(accuracy);

    // Text-Feedback basierend auf dem Score
    if (accuracy === 100) {
      summaryHeadline.textContent = "Excelente! Unschlagbar!";
      summarySubtext.textContent = "Du hast alle Fragen fehlerfrei beantwortet. ¡Felicidades!";
    } else if (accuracy >= 80) {
      summaryHeadline.textContent = "¡Muy bien!";
      summarySubtext.textContent = "Eine tolle Leistung. Fast fehlerfrei!";
    } else if (accuracy >= 50) {
      summaryHeadline.textContent = "¡Buen intento!";
      summarySubtext.textContent = "Gute Arbeit, aber da ist noch Raum für Verbesserung.";
    } else {
      summaryHeadline.textContent = "¡Sigue practicando!";
      summarySubtext.textContent = "Übung macht den Meister. Schau dir die Grammatikregeln an!";
    }

    // Statistik-Zahlen
    statCorrect.textContent = correct;
    statWrong.textContent = wrong;
    statAccuracy.textContent = `${accuracy}%`;

    // Fehlerliste rendern
    if (session.wrongAnswers.length > 0) {
      wrongAnswersListContainer.classList.remove("hidden");
      wrongAnswersList.innerHTML = "";

      session.wrongAnswers.forEach(err => {
        const item = document.createElement("div");
        item.className = "wrong-answer-item";
        
        let label = "";
        const qType = err.question.type || (err.question.sentence ? "context" : "conjugate");
        if (qType === "conjugate") {
          label = `<strong>${err.question.verb}</strong> (${PRONOUN_LABELS[err.question.person].pronoun})`;
        } else if (qType === "recognize") {
          label = `Bestimme <strong>${err.question.conjugatedForm}</strong>`;
        } else {
          label = `Satz: <em>"... ${err.question.verb} ..."</em>`;
        }

        item.innerHTML = `
          <div>
            <span class="verb-info">${label}</span>
            <span class="tense-name">${TENSE_LABELS[err.tense]}</span>
          </div>
          <div class="answer-compare">
            Deine Antwort: <span class="user-wrong">${err.userAnswer}</span>
            Korrekt: <span class="correct-right">${err.correctAnswer}</span>
          </div>
        `;
        wrongAnswersList.appendChild(item);
      });

      // Fehler-Wiederholbutton zeigen
      btnReviewErrors.classList.remove("hidden");
    } else {
      wrongAnswersListContainer.classList.add("hidden");
      btnReviewErrors.classList.add("hidden");
    }
  }

  function animateCircularChart(percent) {
    summaryPercentage.textContent = `${percent}%`;
    summaryChartFill.setAttribute("stroke-dasharray", `${percent}, 100`);

    // Farbklasse wechseln
    summaryChartFill.className.baseVal = "circle"; // Reset
    if (percent >= 80) {
      summaryChartFill.classList.add("circle-success");
    } else if (percent >= 50) {
      summaryChartFill.classList.add("circle-warning");
    } else {
      summaryChartFill.classList.add("circle-danger");
    }
  }

  // Modus nur mit Fehlern neu starten
  function startErrorReviewSession() {
    if (session.wrongAnswers.length === 0) return;

    // Aus falschen Antworten neue Fragen-Liste bauen
    const recoveryQuestions = session.wrongAnswers.map(err => {
      // Kopiere die Frage
      return { ...err.question };
    });

    // Mischen
    shuffleArray(recoveryQuestions);

    session.isActive = true;
    session.currentIndex = 0;
    session.score = 0;
    session.attempts = 0;
    session.wrongAnswers = [];
    session.questions = recoveryQuestions;
    session.isAnswered = false;

    sessionSummary.classList.add("hidden");
    practiceSession.classList.remove("hidden");
    if (appHeader) appHeader.classList.add("hidden");

    showQuestion();
  }

  // ==========================================================================
  // EVENT LISTENERS SETUP
  // ==========================================================================
  
  function setupEventListeners() {
    // 1. Tab-Wechsel
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        
        tabBtns.forEach(b => b.classList.remove("active"));
        tabPanes.forEach(p => p.classList.remove("active"));
        
        btn.classList.add("active");
        const activePane = document.getElementById(`tab-${targetTab}`);
        if (activePane) {
          activePane.classList.add("active");
        }

        // Wenn wir in Fortschritt wechseln, Daten rendern
        if (targetTab === "progress") {
          renderProgressTab();
          fetchLeaderboard();
        }

        // Wenn wir ins Üben zurückgehen, sicherstellen, dass das Menü zu sehen ist
        if (targetTab === "practice" && !session.isActive) {
          practiceMenu.classList.remove("hidden");
          sessionSummary.classList.add("hidden");
          practiceSession.classList.add("hidden");
          if (appHeader) appHeader.classList.remove("hidden");
        }
      });
    });

    // 2. Modus-Auswahl im Practice Tab
    modeCards.forEach(card => {
      card.addEventListener("click", () => {
        const mode = card.getAttribute("data-mode");
        startSession(mode);
      });
    });

    // 3. Exit Session Knopf
    btnExitSession.addEventListener("click", () => {
      if (confirm("Möchtest du diese Übungseinheit wirklich abbrechen? Dein Fortschritt geht verloren.")) {
        session.isActive = false;
        practiceSession.classList.add("hidden");
        practiceMenu.classList.remove("hidden");
        if (appHeader) appHeader.classList.remove("hidden");
      }
    });

    // 4. Neustart Buttons am Ende
    btnRestartSession.addEventListener("click", () => {
      startSession(session.mode);
    });

    btnReviewErrors.addEventListener("click", () => {
      startErrorReviewSession();
    });

    btnToMenu.addEventListener("click", () => {
      session.isActive = false;
      sessionSummary.classList.add("hidden");
      practiceMenu.classList.remove("hidden");
    });

    // 5. Übung anpassen - Ausklapp-Interaktion & Auto-Save
    const toggleSettingsBtn = document.getElementById("btn-toggle-practice-settings");
    const settingsContent = document.getElementById("practice-settings-content");
    if (toggleSettingsBtn && settingsContent) {
      toggleSettingsBtn.addEventListener("click", () => {
        const isHidden = settingsContent.classList.toggle("hidden");
        toggleSettingsBtn.classList.toggle("active", !isHidden);
      });
    }

    if (settingsForm) {
      settingsForm.addEventListener("change", () => {
        saveConfig(null, false);
      });
      settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveConfig(null, false);
      });
    }

    // 6. Lexikon Suchfunktion & Filter
    verbSearchInput.addEventListener("input", (e) => {
      renderVerbLibrary(e.target.value);
    });

    filterBadges.forEach(badge => {
      badge.addEventListener("click", () => {
        filterBadges.forEach(b => b.classList.remove("active"));
        badge.classList.add("active");
        
        currentLibraryFilter = badge.getAttribute("data-filter");
        renderVerbLibrary(verbSearchInput.value);
      });
    });

    // 7. Klick-Handler für Signalwörter im Spickzettel
    const signalTags = document.querySelectorAll(".signal-tag");
    signalTags.forEach(tag => {
      tag.addEventListener("click", () => {
        const isIndefinido = tag.closest(".indefinido-col") !== null;
        const boxId = isIndefinido ? "indefinido-translation-box" : "imperfecto-translation-box";
        const translationBox = document.getElementById(boxId);
        const colTags = tag.closest(".signal-tags").querySelectorAll(".signal-tag");
        
        if (tag.classList.contains("revealed")) {
          // Deaktivieren
          tag.classList.remove("revealed");
          if (translationBox) {
            translationBox.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>Klicke auf ein Signalwort für Übersetzung & Erklärung...</span>`;
            translationBox.classList.remove("active");
          }
        } else {
          // Alle anderen Tags in dieser Spalte deaktivieren
          colTags.forEach(t => t.classList.remove("revealed"));
          tag.classList.add("revealed");
          
          const spanish = tag.getAttribute("data-spanish");
          const german = tag.getAttribute("data-german");
          
          // Erklärung aus SIGNALS_DB heraussuchen
          const dbMatch = SIGNALS_DB.find(s => s.word.toLowerCase() === spanish.toLowerCase());
          const explanation = dbMatch ? dbMatch.explanation : "";
          
          if (translationBox) {
            translationBox.innerHTML = `
              <div class="translation-detail-header">
                <strong>${spanish}</strong> = <span class="translation-highlight">${german}</span>
              </div>
              ${explanation ? `<div class="translation-detail-explanation">${explanation}</div>` : ""}
            `;
            translationBox.classList.add("active");
          }
        }
      });
    });

    // 7b. Klick-Handler für den Zeitformen-Switch (Spickzettel-Tabelle auf Mobilgeräten)
    const segmentedBtns = document.querySelectorAll(".table-segmented-control .segmented-btn");
    const tableContainer = document.querySelector(".table-container");
    segmentedBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        segmentedBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const tense = btn.getAttribute("data-tense");
        if (tableContainer) {
          tableContainer.setAttribute("data-active-tense", tense);
        }
      });
    });

    // 8. Klick auf Schwachstellen-Übung im Fortschritts-Tab
    btnPracticeTrouble.addEventListener("click", () => {
      startTroublePracticeSession();
    });

    // 9. Interaktive Steuerung der Tier-Checkboxen in den Einstellungen
    const irregularCheckbox = document.getElementById("checkbox-irregular");
    const tiersContainer = document.getElementById("tier-checkboxes-container");
    if (irregularCheckbox && tiersContainer) {
      irregularCheckbox.addEventListener("change", () => {
        if (irregularCheckbox.checked) {
          tiersContainer.classList.remove("disabled");
        } else {
          tiersContainer.classList.add("disabled");
        }
      });
    }
    // ==========================================================================
    // FIREBASE AUTH EVENT LISTENERS
    // ==========================================================================
    const btnLogin = document.getElementById("btn-login");
    const btnRegister = document.getElementById("btn-register");
    const btnLogout = document.getElementById("btn-logout");
    const btnSyncNow = document.getElementById("btn-sync-now");

    if (btnLogin) btnLogin.addEventListener("click", handleFirebaseLogin);
    if (btnRegister) btnRegister.addEventListener("click", handleFirebaseRegister);
    if (btnLogout) btnLogout.addEventListener("click", handleFirebaseLogout);
    if (btnSyncNow) btnSyncNow.addEventListener("click", handleFirebaseSync);
  }

  // ==========================================================================
  // UTILITY HELPER FUNCTIONS
  // ==========================================================================
  
  // Array mischen (Fisher-Yates Shuffle)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // ==========================================================================
  // FIREBASE SYSTEM & AUTH LOGIK
  // ==========================================================================
  
  let db = null;
  let auth = null;
  let currentUser = null;
  let firebaseActive = false;

  async function initFirebase() {
    if (!window.isFirebaseConfigured()) {
      console.log("[Firebase] Nicht konfiguriert. Verwende Offline-Modus.");
      setupOfflineUI();
      return;
    }

    try {
      setupConnectingUI();
      
      // ESM CDN Module dynamisch importieren
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js");
      const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js");
      const { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js");

      const app = initializeApp(window.FIREBASE_CONFIG);
      db = getFirestore(app);
      auth = getAuth(app);
      firebaseActive = true;

      console.log("[Firebase] Erfolgreich initialisiert!");

      // Module global für Login-Handler bereitstellen
      window.firebaseAuthAPI = {
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        signOut,
        onAuthStateChanged,
        doc,
        setDoc,
        getDoc,
        collection,
        query,
        orderBy,
        limit,
        getDocs
      };

      // Auf Auth-Status hören
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          currentUser = user;
          await onUserLoggedIn(user);
        } else {
          currentUser = null;
          onUserLoggedOut();
        }
      });

      // UI umschalten auf Konfiguriert
      document.getElementById("firebase-unconfigured-note").classList.add("hidden");
      document.getElementById("leaderboard-unconfigured-note").classList.add("hidden");
      document.getElementById("leaderboard-container").classList.remove("hidden");

    } catch (err) {
      console.error("[Firebase] Initialisierungsfehler:", err);
      setupOfflineUI();
    }
  }

  // Helper: Validierung Benutzername & PIN
  function validateAuthInput(username, pin) {
    const cleanUser = username.trim();
    if (cleanUser.length < 3 || cleanUser.length > 15) {
      return "Der Benutzername muss zwischen 3 und 15 Zeichen lang sein.";
    }
    if (!/^[a-zA-Z0-9_äöüÄÖÜß]+$/.test(cleanUser)) {
      return "Der Benutzername darf nur Buchstaben, Zahlen und Unterstriche enthalten.";
    }
    if (!/^\d{6}$/.test(pin)) {
      return "Die PIN muss aus genau 6 Ziffern bestehen.";
    }
    return null;
  }

  function showAuthError(msg) {
    const errBox = document.getElementById("auth-error-message");
    if (errBox) {
      errBox.textContent = msg;
      errBox.classList.remove("hidden");
    }
  }

  function hideAuthError() {
    const errBox = document.getElementById("auth-error-message");
    if (errBox) {
      errBox.classList.add("hidden");
    }
  }

  async function handleFirebaseRegister() {
    hideAuthError();
    const userField = document.getElementById("auth-username");
    const pinField = document.getElementById("auth-pin");
    const username = userField.value;
    const pin = pinField.value;

    const validationError = validateAuthInput(username, pin);
    if (validationError) {
      showAuthError(validationError);
      return;
    }

    if (!firebaseActive || !window.firebaseAuthAPI) return;

    try {
      setAuthLoading(true);
      const { doc, getDoc, setDoc, createUserWithEmailAndPassword } = window.firebaseAuthAPI;
      
      // 1. Prüfen, ob Benutzername bereits vergeben ist (in Firestore)
      const usernameLower = username.toLowerCase();
      const usernameDocRef = doc(db, "usernames", usernameLower);
      const usernameDocSnap = await getDoc(usernameDocRef);

      if (usernameDocSnap.exists()) {
        showAuthError("Dieser Benutzername ist leider bereits vergeben.");
        setAuthLoading(false);
        return;
      }

      // 2. Registrieren bei Firebase Auth
      const email = `${usernameLower}@past-tenses.internal`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, pin);
      const uid = userCredential.user.uid;

      // 3. Benutzernamen reservieren und Profil anlegen
      await setDoc(usernameDocRef, { uid: uid });
      await setDoc(doc(db, "users", uid), {
        username: username,
        xp: stats.xp,
        streak: stats.streak,
        lastPracticed: stats.lastPracticed,
        verbErrors: stats.verbErrors || {},
        signalErrors: stats.signalErrors || {}
      });

      console.log(`[Firebase] Account für ${username} erfolgreich erstellt!`);
      userField.value = "";
      pinField.value = "";
      
    } catch (err) {
      console.error("[Firebase] Registrierungsfehler:", err);
      let friendlyMsg = "Fehler bei der Registrierung. Bitte versuche es erneut.";
      if (err.code === "auth/email-already-in-use") {
        friendlyMsg = "Dieser Benutzername ist bereits vergeben.";
      }
      showAuthError(friendlyMsg);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleFirebaseLogin() {
    hideAuthError();
    const userField = document.getElementById("auth-username");
    const pinField = document.getElementById("auth-pin");
    const username = userField.value.trim();
    const pin = pinField.value;

    if (!username || !pin) {
      showAuthError("Bitte Benutzername und PIN eingeben.");
      return;
    }

    if (!firebaseActive || !window.firebaseAuthAPI) return;

    try {
      setAuthLoading(true);
      const { signInWithEmailAndPassword } = window.firebaseAuthAPI;
      const email = `${username.toLowerCase()}@past-tenses.internal`;
      
      await signInWithEmailAndPassword(auth, email, pin);
      userField.value = "";
      pinField.value = "";
      
    } catch (err) {
      console.error("[Firebase] Loginfehler:", err);
      let friendlyMsg = "Ungültiger Benutzername oder falsche PIN.";
      if (err.code === "auth/user-not-found") {
        friendlyMsg = "Benutzername existiert nicht.";
      } else if (err.code === "auth/wrong-password") {
        friendlyMsg = "Falsche PIN.";
      }
      showAuthError(friendlyMsg);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleFirebaseLogout() {
    if (!firebaseActive || !window.firebaseAuthAPI) return;
    try {
      const { signOut } = window.firebaseAuthAPI;
      await signOut(auth);
    } catch (err) {
      console.error("[Firebase] Fehler beim Abmelden:", err);
    }
  }

  async function handleFirebaseSync() {
    if (!firebaseActive || !currentUser || !window.firebaseAuthAPI) return;
    try {
      const syncBtn = document.getElementById("btn-sync-now");
      syncBtn.disabled = true;
      syncBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Synchronisiere...`;

      await saveStats();
      await fetchLeaderboard();

      const toast = document.getElementById("sync-success-toast");
      if (toast) {
        toast.classList.remove("hidden");
        setTimeout(() => toast.classList.add("hidden"), 2500);
      }
    } catch (err) {
      console.error("[Firebase] Fehler bei manueller Synchronisation:", err);
    } finally {
      const syncBtn = document.getElementById("btn-sync-now");
      syncBtn.disabled = false;
      syncBtn.innerHTML = `<i class="fa-solid fa-rotate"></i> Jetzt synchronisieren`;
    }
  }

  function setAuthLoading(loading) {
    const btnL = document.getElementById("btn-login");
    const btnR = document.getElementById("btn-register");
    if (btnL && btnR) {
      btnL.disabled = loading;
      btnR.disabled = loading;
    }
  }

  async function onUserLoggedIn(user) {
    const username = user.email.split("@")[0];
    
    // UI Statusbadge aktualisieren
    const statusBadge = document.getElementById("cloud-status-badge");
    if (statusBadge) {
      statusBadge.className = "cloud-status-badge online";
      statusBadge.innerHTML = `<i class="fa-solid fa-cloud"></i> <span class="status-text">${username}</span>`;
      statusBadge.title = `Angemeldet als ${username}`;
    }

    // Auth-Boxen umschalten
    document.getElementById("firebase-logged-out-box").classList.add("hidden");
    const loggedInBox = document.getElementById("firebase-logged-in-box");
    loggedInBox.classList.remove("hidden");
    document.getElementById("logged-in-username").textContent = username;

    // Cloud-Daten abrufen und zusammenführen
    try {
      const { doc, getDoc } = window.firebaseAuthAPI;
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        
        // Casing aus Datenbank holen falls vorhanden
        if (cloudData.username) {
          document.getElementById("logged-in-username").textContent = cloudData.username;
          if (statusBadge) {
            statusBadge.innerHTML = `<i class="fa-solid fa-cloud"></i> <span class="status-text">${cloudData.username}</span>`;
          }
        }

        // Lokalen Stand mit Cloud abgleichen (XP-Gewinn hat Priorität)
        if (cloudData.xp > stats.xp) {
          stats = { ...stats, ...cloudData };
          localStorage.setItem("past_tenses_stats", JSON.stringify(stats));
          console.log("[Firebase] Lokale Statistiken durch neuere Cloud-Daten aktualisiert.");
          
          // XP & Streak im UI updaten
          if (document.getElementById("tab-progress").classList.contains("active")) {
            renderProgressTab();
          }
        } else {
          // Lokaler Stand ist neuer oder gleich -> Cloud aktualisieren
          await saveStats();
        }
      } else {
        // Noch kein User-Dokument -> Anlegen mit aktuellen lokalen Stats
        await saveStats();
      }
    } catch (err) {
      console.error("[Firebase] Fehler beim Synchronisieren der Userdaten:", err);
    }

    // Rangliste aktualisieren
    await fetchLeaderboard();
  }

  function onUserLoggedOut() {
    // UI Statusbadge zurücksetzen
    const statusBadge = document.getElementById("cloud-status-badge");
    if (statusBadge) {
      statusBadge.className = "cloud-status-badge offline";
      statusBadge.innerHTML = `<i class="fa-solid fa-cloud-slash"></i> <span class="status-text">Lokal</span>`;
      statusBadge.title = "Offline-Modus (Lokal)";
    }

    // Auth-Boxen umschalten
    document.getElementById("firebase-logged-in-box").classList.add("hidden");
    document.getElementById("firebase-logged-out-box").classList.remove("hidden");

    // Lade lokale Statistiken neu
    loadStats();
    
    // XP & Streak im UI updaten
    if (document.getElementById("tab-progress").classList.contains("active")) {
      renderProgressTab();
    }
  }

  function setupOfflineUI() {
    firebaseActive = false;
    document.getElementById("firebase-unconfigured-note").classList.remove("hidden");
    document.getElementById("firebase-logged-out-box").classList.add("hidden");
    document.getElementById("firebase-logged-in-box").classList.add("hidden");
    
    document.getElementById("leaderboard-unconfigured-note").classList.remove("hidden");
    document.getElementById("leaderboard-container").classList.add("hidden");
  }

  function setupConnectingUI() {
    const statusBadge = document.getElementById("cloud-status-badge");
    if (statusBadge) {
      statusBadge.className = "cloud-status-badge connecting";
      statusBadge.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span class="status-text">Verbinde...</span>`;
    }
  }

  async function fetchLeaderboard() {
    if (!firebaseActive || !window.firebaseAuthAPI) return;

    const listElement = document.getElementById("leaderboard-list");
    if (!listElement) return;

    try {
      const { collection, query, orderBy, limit, getDocs } = window.firebaseAuthAPI;
      const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(10));
      const querySnapshot = await getDocs(q);

      listElement.innerHTML = "";
      
      let rank = 1;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const username = userData.username || doc.id;
        const xp = userData.xp || 0;
        const streak = userData.streak || 0;
        const isCurrent = currentUser && doc.id === currentUser.uid;

        const row = document.createElement("div");
        row.className = `leaderboard-row ${isCurrent ? 'current-user' : ''}`;

        let medal = "";
        if (rank === 1) medal = "🥇";
        else if (rank === 2) medal = "🥈";
        else if (rank === 3) medal = "🥉";

        const rankDisplay = medal ? `<span class="rank-medal">${medal}</span>` : `${rank}`;

        row.innerHTML = `
          <span class="rank-col">${rankDisplay}</span>
          <span class="user-col">${username}</span>
          <span class="streak-col"><i class="fa-solid fa-fire"></i> ${streak}</span>
          <span class="xp-col">${xp} XP</span>
        `;
        listElement.appendChild(row);
        rank++;
      });

      if (rank === 1) {
        listElement.innerHTML = `<div class="loading-spinner">Noch keine Spieler auf der Rangliste. Sei der Erste!</div>`;
      }

    } catch (err) {
      console.error("[Firebase] Fehler beim Laden der Rangliste:", err);
      listElement.innerHTML = `<div class="loading-spinner text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Rangliste konnte nicht geladen werden.</div>`;
    }
  }

  // App starten
  init();
});
