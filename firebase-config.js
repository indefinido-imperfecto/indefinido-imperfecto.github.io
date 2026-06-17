/**
 * Spanisch Past Tenses Trainer - Firebase Konfiguration
 * 
 * Um die Cloud-Synchronisation und die globale Rangliste zu aktivieren,
 * erstelle ein kostenloses Firebase-Projekt (https://console.firebase.google.com/)
 * und trage hier deine Zugangsdaten ein.
 * 
 * Wichtig im Firebase-Projekt:
 * 1. Aktiviere in "Authentication" die Methode "E-Mail/Passwort".
 * 2. Erstelle eine "Cloud Firestore"-Datenbank und setze die Regeln im Testmodus
 *    oder erlaube Lese-/Schreibzugriffe für authentifizierte Benutzer.
 */

window.FIREBASE_CONFIG = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJECT_ID.firebaseapp.com",
  projectId: "DEIN_PROJECT_ID",
  storageBucket: "DEIN_PROJECT_ID.appspot.com",
  messagingSenderId: "DEINE_MESSAGING_SENDER_ID",
  appId: "DEINE_APP_ID"
};

// Überprüfung, ob die Konfiguration vom Nutzer ausgefüllt wurde
window.isFirebaseConfigured = function() {
  return window.FIREBASE_CONFIG && 
         window.FIREBASE_CONFIG.apiKey && 
         window.FIREBASE_CONFIG.apiKey !== "DEIN_API_KEY" && 
         window.FIREBASE_CONFIG.projectId && 
         window.FIREBASE_CONFIG.projectId !== "DEIN_PROJECT_ID";
};
