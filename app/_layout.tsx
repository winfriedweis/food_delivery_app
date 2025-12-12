//_layout.tsx definiert den Rahmen (bzw. globale Layout) in dem alle Screens laufen.
//Wie sehen Screens aus? Welche Navigation gilt grundsätzlich für alle Screens etc.
//Welche globalen Optionen gelten Header, Fonts, Themes ...
//Ähnlich zu _app.tsx in Next.js.
//Hier wird Initialisierungcode eingefügt wie Contextprovider etc. was früher in der App.tsx war

//Imports laden/laufen zuerst

import {SplashScreen, Stack} from "expo-router";
import './globals.css';
import { useFonts } from "expo-font";
import { useEffect } from "react";

// Einstiegspunkt für alles im /app Ordner.
//Sämtliche Routen werden unter dieser Funktion gerendert
//RootLayout wird gerendert und startet useFonts

export default function RootLayout() {

  // useFonts ist ein Hook von Expo der Fonts zur Laufzeit lädt.
  // gibt boolean oder Error zurück → App rendert erst wenn fontsLoaded == true

  const [fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "Quicksand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "Quicksand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "Quicksand-Semibold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "Quicksand-Light": require('../assets/fonts/Quicksand-Light.ttf')
  });

  // Für das Laden der Fonts, wenn nicht geladen -> SplashScreen
  // Wenn Error dann Error
  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  // Zum Verbergen des Index-Headers oben am Bildschirm.
  // return<Stack/> ist ein React Function Component → der Render Output
  // Muss React Element oder null zurückgeben sonst gibt es nichts zu rendern.
  // Allgemeines return Prinzip → Beendet Funktion und gibt Wert zurück.

  // Gleichbedeutend mit:
  // const opts = { headerShown: false };
  // <Stack screenOptions={opts} />

  // Die äußeren Klammern bedeuten, dass ein JSX/TSX Ausdruck kommt
  // Die inneren Klammern sind für das Objektliteral bzw. Object initializier
  // Die Syntax mit der man direkt ein Objekt in JS erzeugt const test = {key: value, name: "Mila"}
  // „inline“ Konfigurationsobjekt zum Weitergeben als Prop an <Stack />
  // (statt vorher const opts = ... zu schreiben).

  return <Stack screenOptions={{ headerShown: false }} />;
}
