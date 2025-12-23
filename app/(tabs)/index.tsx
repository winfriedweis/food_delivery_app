import {Button, FlatList, Pressable, Text, TouchableOpacity, View} from "react-native";
import "../globals.css"
import {SafeAreaView} from "react-native-safe-area-context";
import {images, offers} from "@/constants";
import * as Sentry from "@sentry/react-native";

// Fragment ist ein unsichtbarer Container ohne DOM Node für return da View und Text
// nicht nebeneinander stehen dürfen
import {Fragment} from "react";

// Eigener Import von Image aus Komponente zur Nutzung von Nativewind mit Expo-Image statt react-native
// Dependency Inversion - Mein Wrapper für den Import
// cssInterop sorgt für Umwandlung von className zu style
// Adapter Pattern
import {Image} from "@/components/ExpoImage";

// Utility für das bedingte zusammenstellen von Klassen sonst offer-card zb. doppelt
import cn from 'clsx';
import CartButton from "@/components/CartButton";
import useAuthStore from "@/store/auth.store";

// export default ist der Hauptexport dieser Datei und automatisch Route app/index.tsx = /
// Komponenten sind Funktionen die JSX zurückgeben - Javascript + XML also kein gültiges JS

// <SafeAreaView className="flex-1 bg-white"> nicht gültig -> Transpiler wie Babel wandelt um
/*
React.createElement(
    SafeAreaView,
    { className: "flex-1 bg-white" },
    // Kinder...
)
Das eigentliche Objekt das React versteht
*/

export default function Index() {

    // Console log check for current user - todo remove
    /*---------------------------------------------------*/
    const {user} = useAuthStore();
    console.log("User: ", JSON.stringify(user, null, 2));
    /*---------------------------------------------------*/
    return (
        <SafeAreaView className="flex-1 bg-white">
            {/*
            SafeAreaView ist der Wurzel-Container die Kinder sind darin
            <View className="flex-between flex-row w-full my-5 px-5">
                <View className="flex-start">
                    <Text className="small-bold text-primary">DELIVER TO</Text>
                    <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                        <Text className="paragraph-bold text-dark-100">Germany</Text>
                        <Image source={images.arrowDown} className="size-3" contentFit="contain"/>
                    </TouchableOpacity>
                    <Text>Cart</Text>
                </View>
            </View>
            */}
            <FlatList
                data={offers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item, index}) => {
                    const isEven: boolean = index % 2 == 0;
                    return (
                        <Pressable
                            className={cn("offer-card", isEven ? 'flex-row-reverse' : 'flex-row')}
                            style={{backgroundColor: item.color}}
                            android_ripple={{color: "#fffff22"}}
                        >
                            {({pressed}) => (
                                <Fragment>
                                    <View className={"h-full w-1/2"} style={{overflow: 'hidden'}}>
                                        <Image
                                            source={item.image}
                                            className="size-full"
                                            contentFit="contain"
                                        />
                                    </View>

                                    <View className={cn("offer-card__info", isEven ? 'pl-10' : 'pr-10')}>
                                        <Text className="h1-bold text-white leading-tight">
                                            {item.title}
                                        </Text>
                                        <Image
                                            source={images.arrowRight}
                                            className="size-10"
                                            contentFit="contain"
                                            tintColor="#ffffff"
                                        />
                                    </View>
                                </Fragment>
                            )}
                        </Pressable>
                    )
                }}
                contentContainerClassName="pb-28 px-5"

                // Auskommentierter Code aus 16-25 kommt hierhin.
                // Vermeidet so VirtualizedLists Error wegen ScrollView Verwendung und Listen.
                // Also wenn z.B. FlatList dann keine ScrollView darum, sondern alles mit in die Liste.
                // Kein Padding px- nötig da FlatList es Default added.
                ListHeaderComponent={({item}) => (
                    <View
                        className="flex-between flex-row w-full my-5">
                        <View className="flex-start">
                            <Text className="small-bold text-primary">DELIVER TO</Text>
                            <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                                <Text className="paragraph-bold text-dark-100">Germany</Text>
                                <Image source={images.arrowDown} className="size-3" contentFit="contain"/>
                            </TouchableOpacity>
                        </View>
                        <CartButton/>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
