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
  apiKey: "AIzaSyAgSGwPwLE23hoawe_ZgBJExpdftEmTZCk",
  authDomain: "indefinido-imperfecto.firebaseapp.com",
  projectId: "indefinido-imperfecto",
  storageBucket: "indefinido-imperfecto.firebasestorage.app",
  messagingSenderId: "401386397693",
  appId: "1:401386397693:web:1755ea045db08af0818394",
  measurementId: "G-KZ54Q1QEQE"
};

// Überprüfung, ob die Konfiguration vom Nutzer ausgefüllt wurde
window.isFirebaseConfigured = function() {
  return window.FIREBASE_CONFIG && 
         window.FIREBASE_CONFIG.apiKey && 
         window.FIREBASE_CONFIG.apiKey !== "DEIN_API_KEY" && 
         window.FIREBASE_CONFIG.projectId && 
         window.FIREBASE_CONFIG.projectId !== "DEIN_PROJECT_ID";
};
