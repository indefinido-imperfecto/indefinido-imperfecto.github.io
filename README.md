# Spanisch Past Tenses Trainer

Eine interaktive, responsive Single-Page-Application (SPA) für Schülerinnen und Schüler, um den Unterschied zwischen **Pretérito Indefinido** und **Pretérito Imperfecto** im Spanischen zu üben.

Die App ist als rein statische Webseite konzipiert und kann ohne Server oder Datenbank gehostet werden (z. B. auf GitHub Pages, Netlify, Vercel oder lokal durch direktes Öffnen der `index.html`).

---

## Features

1. **Drei Übungsmodi:**
   - **Formen bilden:** Aktives Einüben der Konjugation (z. B. *hablar + yo + Indefinido* = *hablé*).
   - **Formen erkennen:** Bestimmen der Zeitform für eine vorgegebene konjugierte Form.
   - **Kontextübungen (Lückentext):** Üben der richtigen Anwendung anhand von Signalwörtern (z. B. *ayer*, *mientras*, *de repente*) und Kontextregeln, inklusive didaktischer Erklärungen bei Fehlern.
2. **Umfangreiches Verblexikon:**
   - Über 150 Verben geladen (regelmäßige Verben, Rechtschreibbesonderheiten auf *-car, -gar, -zar* sowie zahlreiche unregelmäßige Verben).
   - Didaktische Klassifizierung unregelmäßiger Verben in 4 Schwierigkeitsstufen (Tiers) von essenziellen Alltagsverben bis hin zu abgeleiteten Formen.
   - Interaktive Live-Suche und Filterung nach Regelmäßigkeit.
3. **Didaktische Hilfen:**
   - **Akzent-Fehlertoleranz:** Die App erkennt, wenn eine Antwort buchstabengetreu richtig, aber der Akzent falsch ist (z. B. *hable* statt *hablé*) und gibt eine spezifische Warnung aus.
   - **Fehler-Wiederholung:** Schüler können am Ende einer Einheit gezielt nur die Fragen wiederholen, bei denen sie Fehler gemacht haben.
   - **Virtuelle Akzent-Tastatur:** Ermöglicht die einfache Eingabe von Sonderzeichen (*á, é, í, ó, ú, ñ*) direkt am PC.
   - **Grammatik-Spickzettel:** Integrierter Spickzettel mit Signalwörtern und Konjugationstabellen.
4. **Schülerfreundliches Design:**
   - Modernes, dunkles *Glassmorphism*-Design mit weichen Helligkeitsverläufen und flüssigen Mikroanimationen.
   - 100% mobilfreundlich für Smartphones, Tablets und Laptops.

---

## Code-Architektur & Modularität

Die Anwendung ist so programmiert, dass sie jederzeit um weitere Zeitformen (z. B. *Pretérito Perfecto* oder *Presente*) erweitert werden kann:

### 1. Datenstruktur (`verbs-data.js`)
Die Verben werden dynamisch erzeugt. Reguläre Verben sind platzsparend in `REGULAR_VERBS` definiert, und unregelmäßige Verben in `IRREGULAR_VERBS`.
Um eine neue Zeitform (z. B. `perfecto`) zu ergänzen:
- Fügen Sie in `verbs-data.js` in der Funktion `generateConjugations(infinitive, endingType)` die regulären Bildungsregeln für die neue Zeit hinzu.
- Ergänzen Sie in `IRREGULAR_VERBS` bei den unregelmäßigen Verben das Feld `tenses.perfecto` mit den entsprechenden Konjugationsformen.
- Fügen Sie in `CONTEXT_EXERCISES` Übungssätze mit `correctTense: "perfecto"` hinzu.

### 2. Anwendungslogik (`app.js`)
Die UI passt sich dynamisch an. Wenn Sie eine neue Zeit in die `app.js` unter `config.tenses` einbinden, werden automatisch:
- Kontrollkästchen in den Einstellungen dafür angezeigt.
- Multiple-Choice-Optionen im Modus "Formen erkennen" erweitert.
- Konjugationstabellen im Verblexikon gerendert.

---

## Installation & Start

1. Lade alle Projektdateien in einen Ordner herunter:
   - `index.html`
   - `style.css`
   - `app.js`
   - `verbs-data.js`
2. Klicke doppelt auf die `index.html`, um die App direkt im Webbrowser zu starten. Alternativ kannst du den Ordner auf einem Webspace oder GitHub Pages hochladen, um ihn deinen Schülern per Link zur Verfügung zu stellen.
