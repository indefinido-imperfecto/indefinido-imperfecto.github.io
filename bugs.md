# Bug-Report: indefinido-imperfecto.github.io

Stand: 2026-09-26 · Basis: Commit `b24df7d` (main)

Geprüft wurden `app.js`, `verbs-data.js`, `index.html`, `firebase-config.js` (Code gelesen) sowie alle Verb- und Kontextdaten (automatisch per Node-Skript geprüft). `style.css` wurde nur stichprobenartig angesehen.

**Hinweis zu den Debug-Blöcken:** `app.js` kapselt alles in einem `DOMContentLoaded`-Closure. Interne Funktionen (`checkAnswer`, `detectSignalWord` …) sind in der Browser-Konsole daher **nicht** erreichbar. Von außen erreichbar sind nur `window.VERBS_DATABASE`, `window.CONTEXT_EXERCISES` und `localStorage`. Die Snippets arbeiten deshalb entweder damit oder bauen die betroffene Logik 1:1 nach.

Schweregrade: 🔴 hoch · 🟠 mittel · 🟡 niedrig · ✅ behoben (Bug 2: erst wirksam, wenn `firestore.rules` in Firebase veröffentlicht ist)

---

## Übersicht

| # | Schwere | Bereich | Kurzbeschreibung |
|---|---|---|---|
| 1 | ✅ 🔴 | Firebase / Sicherheit | Stored XSS über Benutzernamen in der Rangliste |
| 2 | ✅ 🔴 | Firebase / Sicherheit | XP/Rangliste frei manipulierbar (Client schreibt XP selbst) |
| 3 | ✅ 🔴 | Firebase / Sync | Stats „wandern“ zwischen Konten auf geteilten Geräten |
| 4 | ✅ 🔴 | Session | „Nochmal üben“ nach Schwachstellen-Training bricht ab |
| 5 | ✅ 🟠 | Daten | `preferir` hat keinen Tier und taucht nie in Übungen auf |
| 6 | ✅ 🟠 | Streak | Endlos-Modus / Abbruch zählt nie für die Lernserie |
| 7 | ✅ 🟠 | Streak | Streak wird bei Zeitumstellung (Herbst) fälschlich zurückgesetzt |
| 8 | ✅ 🟠 | Fehlersammler | Signalwort-Erkennung per Substring liefert falsche Treffer |
| 9 | ✅ 🟠 | Fehlersammler | Signalwort-Tabelle enthält deutsche Tippfehler / fehlende Einträge |
| 10 | ✅ 🟠 | Daten | Falsche Konjugationen bei `huir` (und veraltete Akzente bei `reír`/`freír`) |
| 11 | ✅ 🟠 | Daten | Inhaltliche Fehler in Kontextsätzen |
| 12 | ✅ 🟠 | Firebase | Benutzernamen mit Umlauten lassen sich nicht registrieren |
| 13 | ✅ 🟡 | Firebase | Status-Badge hängt auf „Verbinde…“, wenn Firebase nicht lädt |
| 14 | ✅ 🟡 | UI | Icon `fa-cloud-slash` existiert in Font Awesome Free nicht |
| 15 | ✅ 🟡 | Session | Theme-Klasse bleibt nach Abbruch aktiv |
| 16 | ✅ 🟡 | Session | Schwachstellen-Training ignoriert Zeitformen-/Tier-Einstellungen |
| 17 | ✅ 🟡 | Feedback | Erklärtext falsch bei -car/-gar/-zar-Verben und zeigt interne Keys |
| 18 | ✅ 🟡 | Einstellungen | Nur eine Zeitform gewählt → „Formen erkennen“/„Signalwörter“ trivial |
| 19 | ✅ 🟡 | Sicherheit | Self-XSS: Nutzereingabe wird per `innerHTML` ausgegeben |
| 20 | ✅ 🟡 | Firebase | Race Condition bei Registrierung (Username-Casing, Doc-Überschreiben) |
| 21 | ✅ 🟡 | Fehlersammler | Fehlerzähler sinken nie |
| 22 | ✅ 🟡 | XP | +50 XP pro Runde unabhängig von Leistung |
| 23 | ✅ 🟡 | Daten | Doppelter Kontextsatz, Tippfehler |

---

## 1. ✅ 🔴 Stored XSS über Benutzernamen in der Rangliste

**Ort:** [app.js:2525-2530](app.js:2525) (`fetchLeaderboard`), außerdem [app.js:2403](app.js:2403) und [app.js:2424](app.js:2424)

`username` kommt aus Firestore und wird ungefiltert per `innerHTML` eingesetzt. Die Validierung in `validateAuthInput` läuft nur im Client. Wer direkt über die Firestore-REST-API oder das SDK schreibt, kann beliebiges HTML in `users/{uid}.username` ablegen. Das Kommentar in `firebase-config.js` empfiehlt sogar den **Testmodus** für die Regeln. Der Code läuft dann bei **jedem**, der den Fortschritt-Tab öffnet.

```js
// DEBUG: Als eingeloggter Nutzer in der Konsole ausführen (nutzt das global exponierte SDK)
const { doc, setDoc } = window.firebaseAuthAPI;
// db ist nicht global – daher über ein neues getFirestore holen:
const { getFirestore } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js");
const { getApp } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js");
const db = getFirestore(getApp());
const { getAuth } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js");
await setDoc(doc(db, "users", getAuth(getApp()).currentUser.uid),
  { username: '<img src=x onerror="alert(\'XSS\')">' }, { merge: true });
// → Tab "Fortschritt" neu öffnen: alert erscheint
```

**Fix:**
```js
const userCol = document.createElement("span");
userCol.className = "user-col";
userCol.textContent = username;          // statt ${username} in innerHTML
```
Zusätzlich Firestore Security Rules: `username` per Regex validieren (`matches('^[A-Za-z0-9_]{3,15}$')`).

---

## 2. ✅ 🔴 XP/Rangliste frei manipulierbar

**Ort:** [app.js:436-456](app.js:436) (`saveStats`), [firebase-config.js:10-11](firebase-config.js:10)

Der Client schreibt `xp` und `streak` selbst in `users/{uid}`. Jeder Schüler kann sich über die Konsole beliebig viele XP geben. Mit Testmodus-Regeln kann man sogar **fremde** Dokumente überschreiben oder löschen.

```js
// DEBUG: localStorage manipulieren, dann einmal "Jetzt synchronisieren" klicken
const s = JSON.parse(localStorage.getItem("past_tenses_stats"));
s.xp = 9999999; localStorage.setItem("past_tenses_stats", JSON.stringify(s));
location.reload();  // → nach Login: Platz 1 in der Rangliste
```

**Fix (minimal):** Regeln, die nur den eigenen Doc erlauben und XP-Sprünge begrenzen:
```
match /users/{uid} {
  allow read: if true;
  allow write: if request.auth.uid == uid
    && request.resource.data.xp is int
    && request.resource.data.xp - resource.data.xp <= 1000;
}
match /usernames/{name} {
  allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
  allow update, delete: if false;
}
```
Eine wirklich manipulationssichere Lösung bräuchte serverseitige XP-Vergabe (Cloud Function).

---

## 3. ✅ 🔴 Stats „wandern“ zwischen Konten auf geteilten Geräten

**Ort:** [app.js:2428-2445](app.js:2428) (`onUserLoggedIn`), [app.js:2291-2298](app.js:2291) (`handleFirebaseRegister`), [app.js:2467-2468](app.js:2467) (`onUserLoggedOut`)

- Beim Login gilt: Ist `cloudData.xp > stats.xp`, übernimmt der lokale Speicher die Cloud-Daten. **Beim Logout werden sie nicht gelöscht.**
- Loggt sich danach Schüler B ein und hat **weniger** XP als A, gilt der lokale Stand als „neuer“ und wird per `saveStats()` in **B's** Cloud-Dokument geschrieben. B bekommt A's XP, Streak und Fehler.
- Registriert sich B neu, erbt das neue Konto ebenfalls A's lokale Stats ([app.js:2293](app.js:2293)).

Im Schulkontext (geteilte PCs/iPads) ist das sehr wahrscheinlich.

```text
DEBUG (manuell, zwei Accounts):
1. Account A (viel XP) einloggen → abmelden
2. localStorage prüfen:  JSON.parse(localStorage.past_tenses_stats).xp   // = A's XP
3. Account B (0 XP) einloggen
4. Rangliste: B hat jetzt A's XP
```

**Fix:** Beim Logout lokale Stats zurücksetzen und Cloud-Stats nicht mit lokalen Stats eines anderen Nutzers mischen. Dazu z. B. `localStorage` pro UID schlüsseln:
```js
function onUserLoggedOut() {
  localStorage.removeItem("past_tenses_stats");
  stats = { xp: 0, streak: 0, lastPracticed: "", verbErrors: {}, signalErrors: {} };
  ...
}
// und in onUserLoggedIn: lokale Stats nur übernehmen, wenn sie "anonym" sind
// (z. B. Flag stats.ownerUid === undefined) – sonst immer Cloud gewinnen lassen.
```
Außerdem: `stats = { ...stats, ...cloudData }` kopiert auch `username` in die lokalen Stats. Besser gezielt Felder übernehmen.

---

## 4. ✅ 🔴 „Nochmal üben“ nach Schwachstellen-Training bricht ab

**Ort:** [app.js:2007-2009](app.js:2007), [app.js:765](app.js:765), [app.js:898-1003](app.js:898)

`startTroublePracticeSession` setzt `session.mode = "mixed"`. Der Restart-Button ruft `startSession(session.mode)` auf, also `startSession("mixed")`. `generateQuestions()` kennt `"mixed"` nicht, deshalb ist `session.questions` leer. Es erscheint der Alert „Es wurden keine passenden Übungen … gefunden“, **und der Header bleibt versteckt** ([app.js:878](app.js:878) wird vor dem Abbruch ausgeführt).

```text
DEBUG:
1. Ein paar Fragen absichtlich falsch beantworten (damit Fehler existieren)
2. Tab "Fortschritt" → "Schwachstellen trainieren" → Runde beenden
3. "Nochmal üben" klicken → Alert, Header weg
```

**Fix:**
```js
btnRestartSession.addEventListener("click", () => {
  if (session.mode === "mixed") startTroublePracticeSession();
  else startSession(session.mode);
});
// und in startSession(): appHeader erst verstecken, NACHDEM geprüft wurde, dass Fragen existieren
```

---

## 5. ✅ 🟠 `preferir` hat keinen Tier

**Ort:** [verbs-data.js:338-345](verbs-data.js:338)

Bei `preferir` fehlt `tier`. Die Folgen:
- `config.tiers.includes(undefined)` ist immer `false`, das Verb wird also **nie** abgefragt ([app.js:907](app.js:907)).
- Im Lexikon steht „Unregelmäßig (Tier undefined)“ ([app.js:827](app.js:827)).

```js
// DEBUG (Konsole):
VERBS_DATABASE.filter(v => !v.regular && ![1,2,3,4].includes(v.tier)).map(v => v.infinitive)
// → ["preferir"]
```

**Fix:** `tier: 3,` ergänzen (Stammwechsel e→i wie `sentir`).

---

## 6. ✅ 🟠 Endlos-Modus / Abbruch zählt nie für die Lernserie

**Ort:** [app.js:1834-1835](app.js:1834), [app.js:1996-2004](app.js:1996), [app.js:900](app.js:900)

`recordPracticeSession()` (Streak-Update) und der 50-XP-Bonus laufen **nur** in `showSummary()`. Im Endlos-Modus (`limit = 99999`, ca. 2000 Formen-Fragen) erreicht man die Zusammenfassung praktisch nie. Beendet man die Runde über ✕, geht der Streak-Tag verloren, obwohl die einzelnen Antwort-XP gutgeschrieben wurden. Der Confirm-Text sagt dazu nur „Fortschritt geht verloren“.

```text
DEBUG:
1. localStorage.past_tenses_stats → lastPracticed notieren
2. Endlos-Modus, 30 Fragen beantworten, über ✕ abbrechen
3. JSON.parse(localStorage.past_tenses_stats).lastPracticed  → unverändert, Streak nicht erhöht
```

**Fix:** `recordPracticeSession()` bereits bei der ersten richtig beantworteten Frage aufrufen (in `checkAnswer`) oder beim Abbruch ab N beantworteten Fragen. Im Endlos-Modus zusätzlich einen „Beenden & auswerten“-Button anbieten, der `showSummary()` aufruft.

---

## 7. ✅ 🟠 Streak-Reset bei Zeitumstellung

**Ort:** [app.js:477-484](app.js:477)

```js
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
```
Zwischen dem Tag vor und dem Tag nach der Umstellung auf Winterzeit liegen 25 h, `Math.ceil(25/24)` ergibt `2`. Die Serie wird auf 0 gesetzt, obwohl gestern geübt wurde.

```js
// DEBUG (Konsole, Zeitzone Europe/Berlin):
const a = new Date("2026/10/25"), b = new Date("2026/10/26");
Math.ceil(Math.abs(b - a) / 864e5)   // → 2  (sollte 1 sein)
```

**Fix:** `Math.round(...)` statt `Math.ceil(...)` verwenden, oder mit UTC-Daten rechnen (`Date.UTC(y, m, d)`).

---

## 8. ✅ 🟠 Signalwort-Erkennung per Substring liefert falsche Treffer

**Ort:** [app.js:560-574](app.js:560) (`detectSignalWord`)

`lower.includes(sig)` prüft ohne Wortgrenzen und in fester Reihenfolge. Im Fehlersammler landen dadurch falsche Signalwörter:

| Satz (#) | erkannt | fordert laut App | tatsächliche Lösung |
|---|---|---|---|
| „…yo ___ (saber) **antes** de fin de año…“ (#39) | `antes` | Imperfecto | Indefinido (`supe`) |
| „**Mientras** la gente dormía, el volcán ___ …“ (#128) | `mientras` | Imperfecto | Indefinido (`entró`) |
| jeder Satz mit „por aquel **entonces**“ | `entonces` (steht vorher in der Liste) | Indefinido | Imperfecto |
| „restaur**antes**“, „estudi**antes**“ … | `antes` | Imperfecto | beliebig |

Beantwortet ein Schüler #39 falsch, zeigt die App „antes → fordert Imperfecto“ als Schwachstelle. Das ist didaktisch genau falsch herum.

```js
// DEBUG (Konsole) – Logik aus app.js nachgebaut:
const sigs = ["ayer","anteayer","anoche","el lunes pasado","la semana pasada","el mes pasado","el año pasado","hace dos días","hace un año","de repente","de pronto","un día","una vez","en 2018","por fin","por último","entonces","durante drei stunden","siempre","casi siempre","antes","normalmente","a menudo","todos los días","cada año","cada semana","mientras","frecuentemente","generalmente","muchas veces","a veces","de vez en cuando","en aquella época","en aquellos tiempos","los lunes","por aquel entonces"];
CONTEXT_EXERCISES.map((c,i)=>[i, sigs.find(s=>c.sentence.toLowerCase().includes(s)), c.correctTense, c.sentence])
  .filter(r=>r[1]);
// "por aquel entonces":
sigs.find(s => "por aquel entonces vivíamos".includes(s))   // → "entonces"
```

**Fix:**
```js
function detectSignalWord(sentence) {
  const lower = sentence.toLowerCase();
  // längste zuerst, damit "por aquel entonces" vor "entonces" und "casi siempre" vor "siempre" greift
  const sorted = [...allSignals].sort((a, b) => b.length - a.length);
  for (const sig of sorted) {
    const re = new RegExp(`(^|[^\\p{L}])${sig}($|[^\\p{L}])`, "u");
    if (re.test(lower)) return sig;
  }
  return null;
}
```
Besser wäre es noch, das Signalwort pro Übung explizit in den Daten zu hinterlegen (`signal: "ayer"`), statt es zu raten. Dann tauchen auch „Signalwörter“ wie *mientras* in Indefinido-Sätzen nicht mehr als Fehlerursache auf.

---

## 9. ✅ 🟠 Signalwort-Tabelle: deutsche Tippfehler & fehlende Einträge

**Ort:** [app.js:564](app.js:564), [app.js:630-644](app.js:630)

- In `detectSignalWord` steht `"durante drei stunden"` (deutsch) und kann nie matchen. In `signalTenseMap` heißt der Eintrag dagegen `"durante tres horas"`, und im Spickzettel steht `"durante tres años"`.
- In `signalTenseMap` stehen `"cada jahr"` und `"cada woche"` statt `"cada año"` und `"cada semana"`. Diese Fehler werden deshalb als „fordert unbekannt“ angezeigt.
- Fehler aus dem Modus **Signalwörter zuordnen** speichern `q.word` aus `SIGNALS_DB` (z. B. `de niño`, `cada día`, `aquel día`, `enseguida` …). Die meisten davon fehlen in `signalTenseMap` und erscheinen deshalb ebenfalls als „fordert unbekannt“.

```js
// DEBUG: Fehler simulieren und Fortschritt-Tab öffnen
const s = JSON.parse(localStorage.getItem("past_tenses_stats") || "{}");
s.signalErrors = { "cada año": 2, "de niño": 1, "enseguida": 1 };
localStorage.setItem("past_tenses_stats", JSON.stringify(s)); location.reload();
// → Fortschritt: alle drei "fordert unbekannt"
```

**Fix:** `signalTenseMap` löschen und stattdessen `SIGNALS_DB` als einzige Quelle nutzen (`SIGNALS_DB.find(s => s.word === sig)?.tense`). Fehlende Wörter (`casi siempre`, `hace un año`, `en 2018`, `por último`, `entonces`, `frecuentemente`, `en aquellos tiempos`, `los lunes`, `durante tres años`) in `SIGNALS_DB` ergänzen. Dann funktioniert auch die Erklärung im Spickzettel für diese Tags ([app.js:2081](app.js:2081)).

---

## 10. ✅ 🟠 Falsche Konjugationen in `verbs-data.js`

**Ort:** [verbs-data.js:800](verbs-data.js:800) (`huir`), [verbs-data.js:846](verbs-data.js:846) (`freír`), [verbs-data.js:869](verbs-data.js:869) (`reír`)

| Verb | aktuell | korrekt (RAE) |
|---|---|---|
| huir, Indef. tú | `huíste` | `huiste` |
| huir, Indef. nosotros | `huímos` | `huimos` |
| huir, Indef. vosotros | `huísteis` | `huisteis` |
| huir, Indef. yo | `huí` | `hui` (seit 2010; `huí` wird nur toleriert) |
| reír, Indef. él | `rió` | `rio` (seit 2010, einsilbig) |
| freír, Indef. él | `frió` | `frio` (seit 2010, einsilbig) |

Die ersten drei sind eindeutig falsch. Schreibt ein Schüler korrekt `huiste`, bewertet die App das als **„Akzent-Fehler!“**.
Bei `rio`/`frio` sollten beide Schreibweisen akzeptiert werden.

```js
// DEBUG (Konsole):
VERBS_DATABASE.find(v => v.infinitive === "huir").tenses.indefinido
```

**Fix:** Formen korrigieren. Für Varianten ein optionales `alternatives`-Array pro Frage einführen und in `checkAnswer` gegen alle Varianten vergleichen.

---

## 11. ✅ 🟠 Inhaltliche Fehler in Kontextsätzen

| Ort | Problem | Vorschlag |
|---|---|---|
| [verbs-data.js:1303](verbs-data.js:1303) | „La colonización española en América empezó **a mediados del siglo XV**“: historisch falsch (Kolumbus 1492 = Ende 15. Jh.) | „a finales del siglo XV“ |
| [verbs-data.js:1402](verbs-data.js:1402) | „Cuando en **1804**, Napoleón invadió España.“: Die Invasion war **1808**, außerdem ist der Satz ein Fragment | „En 1808 Napoleón ___ (invadir) España.“ |
| [verbs-data.js:2132](verbs-data.js:2132) | „Yo ___ a las diez … **(einschlafen)**“ → erwartet `dormí`. „Einschlafen“ heißt *dormirse* → `me dormí` | Satz zu „Yo me ___ a las diez …“ ändern |
| [verbs-data.js:1952](verbs-data.js:1952) | „**En ese momento**, yo estaba enfermo“ → Imperfecto. `SIGNALS_DB` lehrt aber „en ese momento → Indefinido“ ([app.js:53](app.js:53)). Das ist ein Widerspruch innerhalb der App | Satz umformulieren oder die Signalwort-Erklärung relativieren |
| [index.html:415](index.html:415) | Spickzettel: `entonces` steht unter **Indefinido**, Übersetzung aber „da / dann / **damals**“ („damals“ = Imperfecto-Kontext) | Übersetzung „dann / daraufhin“ |

---

## 12. ✅ 🟠 Benutzernamen mit Umlauten lassen sich nicht registrieren

**Ort:** [app.js:2230](app.js:2230), [app.js:2285](app.js:2285)

Die Validierung erlaubt `äöüß`, der Name wird dann aber zur E-Mail `müller@past-tenses.internal`. Firebase Auth lehnt Nicht-ASCII-Local-Parts mit `auth/invalid-email` ab. Der Nutzer sieht nur „Fehler bei der Registrierung“. Der Placeholder schlägt sogar `SpanischKönig` vor ([index.html:604](index.html:604)).

```text
DEBUG: Registrieren mit "SpanischKönig" / 123456 → Konsole: auth/invalid-email
```

**Fix:** Entweder Umlaute in der Regex verbieten (`/^[a-zA-Z0-9_]+$/`) und den Placeholder ändern, oder für die E-Mail kodieren (`encodeURIComponent` bzw. Punycode/Hex des Namens).

---

## 13. ✅ 🟡 Status-Badge hängt auf „Verbinde…“

**Ort:** [app.js:2172](app.js:2172), [app.js:2218-2221](app.js:2218), [app.js:2476-2484](app.js:2476)

Schlägt der dynamische `import()` fehl (offline, Schulfilter blockiert gstatic.com), ruft der Code `setupOfflineUI()` auf. Das setzt das Badge aber nicht zurück, der Spinner dreht also ewig.

```text
DEBUG: DevTools → Network → "gstatic.com" blockieren → Reload → Badge dreht endlos
```

**Fix:** In `setupOfflineUI()` das Badge wie in `onUserLoggedOut()` auf „Lokal“ setzen.

---

## 14. ✅ 🟡 Icon `fa-cloud-slash` existiert in Font Awesome Free 6.4 nicht

**Ort:** [index.html:24](index.html:24), [app.js:2459](app.js:2459), Leaderboard-Hinweis in `index.html`

`fa-cloud-slash` ist ein Pro-Icon. Im Badge „Lokal“ und im Leaderboard-Hinweis wird deshalb **kein** Icon angezeigt.

```js
// DEBUG (Konsole):
getComputedStyle(document.querySelector(".fa-cloud-slash"), "::before").content  // → "none"/leer
```

**Fix:** Ein Free-Icon verwenden, z. B. `fa-solid fa-plug-circle-xmark` oder `fa-solid fa-wifi` mit Durchstreichung per CSS.

---

## 15. ✅ 🟡 Theme-Klasse bleibt nach Abbruch aktiv

**Ort:** [app.js:1996-2004](app.js:1996)

Im Modus „Formen bilden“ setzt die App `theme-indefinido` bzw. `theme-imperfecto` auf `<body>`. Beim Abbruch über ✕ wird die Klasse nicht entfernt, das Menü behält den farbigen Mood.

**Fix:** Im Exit-Handler `document.body.classList.remove("theme-indefinido", "theme-imperfecto");` ergänzen.

---

## 16. ✅ 🟡 Schwachstellen-Training ignoriert Einstellungen

**Ort:** [app.js:708](app.js:708), [app.js:735](app.js:735), [app.js:1049-1054](app.js:1049)

- `tenses = ["indefinido", "imperfecto"]` ist hart kodiert. Wer nur Indefinido übt, bekommt trotzdem Imperfecto-Fragen.
- Die Auffüllfragen nehmen **alle** unregelmäßigen Verben, ohne Tier-Filter.
- Ist in den Einstellungen „Endlos“ gewählt, zeigt die 10-Fragen-Runde trotzdem „Frage X (Endlos)“ und einen vollen Fortschrittsbalken.

**Fix:** `config.tenses` und den Tier-Filter wie in `generateQuestions()` verwenden. In `updateProgressUI` statt `config.sessionLength === "infinite"` ein Flag `session.isInfinite` nutzen, das beim Start gesetzt wird.

---

## 17. ✅ 🟡 Erklärtext falsch bei -car/-gar/-zar und zeigt interne Keys

**Ort:** [app.js:1790-1793](app.js:1790)

- Spelling-Change-Verben haben `regular: true`. Für `busqué` erklärt die App deshalb: „‚buscar‘ ist ein **regelmäßiges** Verb … Seine Endung … ist regelmäßig.“ Gerade die Besonderheit (c→qu) wird nicht erwähnt.
- `"${q.person}"` gibt den internen Key aus (`"tu"`, `"el"`), nicht `tú` oder `él/ella/usted`.

**Fix:**
```js
const v = VERBS_DATABASE.find(v => v.infinitive === q.verb);
const personLabel = PRONOUN_LABELS[q.person].pronoun;
if (v?.spellingChange && q.tense === "indefinido" && q.person === "yo") {
  explanationText = `"${q.verb}" ändert in der yo-Form des Indefinido die Schreibung (c→qu / g→gu / z→c), um die Aussprache zu erhalten.`;
}
```

---

## 18. ✅ 🟡 Nur eine Zeitform gewählt → Multiple-Choice-Modi trivial

**Ort:** [app.js:1182-1185](app.js:1182), [app.js:938](app.js:938), [app.js:912-916](app.js:912)

Ist nur „Indefinido“ ausgewählt, lautet die richtige Antwort in „Formen erkennen“ und „Signalwörter zuordnen“ immer Indefinido. In „Zeitform wählen“ wird der Kontrast-Charakter ebenfalls ausgehebelt.

**Fix:** Diese drei Modi deaktivieren (inkl. Hinweis), wenn `config.tenses.length < 2`.

---

## 19. ✅ 🟡 Self-XSS: Nutzereingabe per `innerHTML`

**Ort:** [app.js:1733](app.js:1733) (`<em>${userAnswer}</em>`), [app.js:1893](app.js:1893) (`${err.userAnswer}`)

Die Eingabe `<img src=x onerror=alert(1)>` im Antwortfeld wird als HTML ausgeführt. Das ist nur Self-XSS, aber leicht zu beheben.

**Fix:** Eine Escape-Funktion verwenden:
```js
const esc = s => s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
```

---

## 20. ✅ 🟡 Race Condition bei der Registrierung

**Ort:** [app.js:2286-2298](app.js:2286), [app.js:2203-2211](app.js:2203)

`createUserWithEmailAndPassword` löst sofort `onAuthStateChanged` aus, also `onUserLoggedIn`. Das liest `users/{uid}`, bevor `setDoc` mit `username` geschrieben ist. Folgen:
- Das Badge zeigt den kleingeschriebenen Namen aus der E-Mail statt der Originalschreibweise.
- `saveStats()` legt parallel ein Doc **ohne** `username` an. Scheitert danach das `setDoc` aus der Registrierung, erscheint in der Rangliste die UID ([app.js:2510](app.js:2510)).
- Außerdem wird `usernames/{name}` erst **nach** dem Auth-Konto angelegt. Schlägt das fehl, bleibt ein verwaistes Auth-Konto zurück.

**Fix:** In `onUserLoggedIn` bei fehlendem `username` kurz warten bzw. den Namen aus einer lokalen Variable `pendingRegistrationName` nehmen. Die beiden `setDoc` in einem `writeBatch` zusammenfassen.

---

## 21. ✅ 🟡 Fehlerzähler sinken nie

**Ort:** [app.js:1750-1761](app.js:1750)

`verbErrors` und `signalErrors` werden nur erhöht. Wer ein Verb inzwischen beherrscht, sieht es trotzdem für immer in den „Baustellen“, und das Schwachstellen-Training zieht es weiter heran.

**Fix:** Bei richtiger Antwort den Zähler dekrementieren (`Math.max(0, n - 1)`).

---

## 22. ✅ 🟡 +50 XP pro Runde unabhängig von Leistung

**Ort:** [app.js:1834](app.js:1834)

Auch eine Runde mit 0 % oder nur leeren Antworten (Enter drücken) bringt 50 XP. Mit „Fehler wiederholen“ und einer einzigen Frage lassen sich so schnell XP farmen. Das verzerrt die Rangliste.

**Fix:** Den Bonus an die Genauigkeit koppeln (z. B. `Math.round(50 * accuracy / 100)`) und leere Eingaben nicht als Versuch werten.

---

## 23. ✅ 🟡 Daten-Kleinkram

| Ort | Problem |
|---|---|
| [verbs-data.js:2294](verbs-data.js:2294) / [verbs-data.js:2357](verbs-data.js:2357) | Kontextsatz „Siempre ___ sol en esa playa maravillosa.“ ist doppelt vorhanden |
| [verbs-data.js:1997](verbs-data.js:1997) | „pequeno“ → **pequeño** |
| [verbs-data.js:26](verbs-data.js:26) | Übersetzung „benutzten“ → **benutzen** |
| [app.js:612](app.js:612), [app.js:651](app.js:651) | `count === 1 ? 'Fehler' : 'Fehler'`: Ternary ohne Wirkung |
| [README.md](README.md) | Erwähnt `firebase-config.js` bei der Installation nicht, obwohl `index.html` die Datei lädt. Außerdem ist von „3 Übungsmodi“ die Rede, es gibt aber 5 |
| `index.html` Level-Karte | Initialtext „Level 1: Novize“ passt nicht zum Format aus `getLevelInfo()` („Principiante del Pasado (Level 1)“) |

```js
// DEBUG: Doppelte Kontextsätze finden
const seen = new Map();
CONTEXT_EXERCISES.forEach((c, i) => {
  const k = c.sentence + "|" + c.correctTense;
  if (seen.has(k)) console.log("Duplikat:", seen.get(k), i, c.sentence);
  seen.set(k, i);
});
```

---

## Anhang: Komplett-Check der Daten (Node)

Dieses Skript prüft Tiers, fehlende Formen, Kontext-Lösungen gegen die Konjugationsdaten, die Anzahl der Lücken und Duplikate. Aus dem Repo-Root ausführen:

```bash
node -e '
global.window={};const fs=require("fs");
eval(fs.readFileSync("verbs-data.js","utf8").replace(/console\.log\([^;]*;/,"")+";window.gen=generateConjugations;");
const DB=window.VERBS_DATABASE,CX=window.CONTEXT_EXERCISES,P=["yo","tu","el","nosotros","vosotros","ellos"];
DB.filter(v=>!v.regular).forEach(v=>{
  if(![1,2,3,4].includes(v.tier))console.log("KEIN TIER:",v.infinitive);
  ["indefinido","imperfecto"].forEach(t=>P.forEach(p=>{if(!v.tenses[t]?.[p])console.log("FEHLT:",v.infinitive,t,p)}));
});
const seen=new Set();
CX.forEach((c,i)=>{
  const gaps=c.sentence.split("___").length-1; if(gaps!==1)console.log("#"+i,"Lücken:",gaps);
  if(seen.has(c.sentence+c.correctTense))console.log("#"+i,"DUPLIKAT"); seen.add(c.sentence+c.correctTense);
  const main=c.verb.split(" ")[0]; let v=DB.find(x=>x.infinitive===main);
  if(!v)v={tenses:window.gen(main,main.slice(-2))};
  const exp=v.tenses[c.correctTense][c.person]+c.verb.slice(main.length);
  if(exp!==c.correctAnswer)console.log("#"+i,"erwartet",exp,"steht",c.correctAnswer);
});'
```

Aktuelles Ergebnis: `KEIN TIER: preferir` und `#129 DUPLIKAT`. Alle 130 Kontext-Lösungen passen zu den Konjugationsdaten. Die Konjugationsfehler aus Bug 10 findet das Skript nicht, weil sie in den Daten selbst stehen.
