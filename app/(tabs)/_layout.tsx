// Shared Parrent Layout of all Screens in (tabs)

import {Redirect, Slot} from "expo-router";
import useAuthStore from "@/store/auth.store";


// Slot ist ein Platzhalter für die aktive Child Route.
// Er rendert im Layout den Screen zu dem gerade navigiert wurde.
// Praktisch, um ein gemeinsames Layout (Header/Footer/Wrapper/Provider)
// um alle Screens in einem Ordner herum zu bauen, ohne jeden Screen einzeln zu wrappen.
// Slot ist kein Navigator-UI wie Stack/Tabs, sondern nur die Einfüge-Stelle für das aktuelle Child-Element.

// Rename function to TabLayout to follow React Guidelines and to accept Hooks

export default function TabLayout() {
    //Calls the Global State Auth Store Hook to check if there is a user session
    const {isAuthenticated} = useAuthStore();

    if (!isAuthenticated) return <Redirect href="/sign-in"/>
    return <Slot/>
}
