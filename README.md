# Scrum Board – React-projekt

Det här projektet är en Scrum board utvecklad med React och bundlad med Parcel. Användaren kan skapa teammedlemmar, uppgifter och tilldela roller (UX, frontend, backend). Projektet använder Firebase för inloggning och Firestore för datalagring. 

## Teknologier
React används för UI, Parcel som bundler, Firebase för autentisering och datalagring.

## Installation och start
1. Klona repot: `git clone https://github.com/ditt-användarnamn/scrum-board.git` och gå in i mappen: `cd scrum-board`.
2. Installera beroenden: `npm install`.
3. Skapa en fil `src/firebaseConfig.js` och lägg in din Firebase-konfiguration enligt exempel nedan.
4. Starta dev-server: `npm start`.
5. Parcel öppnar appen på `http://localhost:1234`.
6. För produktion: `npm run build`.

## Firebase-konfiguration
Skapa `src/firebaseConfig.js` med detta format:

```js
export const firebaseConfig = {
  apiKey: "DIN_API_KEY",
  authDomain: "DITT_PROJEKT.firebaseapp.com",
  projectId: "DITT_PROJEKT_ID",
  storageBucket: "DITT_PROJEKT.appspot.com",
  messagingSenderId: "DIN_MESSAGING_ID",
  appId: "DIN_APP_ID"
};
