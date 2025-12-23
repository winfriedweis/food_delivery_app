// Shared Parrent Layout of all Screens in (tabs)

import {Redirect, Slot, Tabs} from "expo-router";
import useAuthStore from "@/store/auth.store";
import {TabBarIconProps} from "@/type";
import {Text, View} from "react-native";
import {Image} from "@/components/ExpoImage";
import {images} from "@/constants";
import cn from "clsx";

const TabBarIcon = ({
                        focused,
                        icon,
                        title
                    }: TabBarIconProps) => (
    // Round braces as alternative to curly braces, so I don't have to use return inside {}
    <View className="tab-icon">
        <Image
            source={icon}
            className="size-8 mb-6"
            contentFit="contain"
            tintColor={focused ? '#FE8C00' : '#5D5F6D'}/>
        {/*<Text className={cn("text-sm font-bold", focused ? 'text-primary' : 'text-gray-100')}>
            {title}
        </Text>*/}
    </View>
);

// Slot ist ein Platzhalter für die aktive Child Route.
// Er rendert im Layout den Screen zu dem gerade navigiert wurde.
// Praktisch, um ein gemeinsames Layout (Header/Footer/Wrapper/Provider)
// um alle Screens in einem Ordner herum zu bauen, ohne jeden Screen einzeln zu wrappen.
// Slot ist kein Navigator-UI wie Stack/Tabs, sondern nur die Einfüge-Stelle für das aktuelle Child-Element.

// Rename function to TabLayout to follow React Guidelines and to accept Hooks

export default function TabLayout() {
    //Calls the Global State Auth Store Hook to check if there is a user session
    const {isAuthenticated, isLoading} = useAuthStore();
    // Guard - Redirect if not authenticated
    if (!isAuthenticated && !isLoading) return <Redirect href="/(auth)/sign-in"/>
    if (isLoading) {
        return null; // Loading UI
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    marginHorizontal: 20,
                    height: 60,
                    position: 'absolute',
                    bottom: 40,
                    backgroundColor: "white",
                    shadowColor: "#1a1a1a",
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 5
                }
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({focused}) =>
                        <TabBarIcon
                            title={"Home"}
                            focused={focused}
                            icon={images.home}
                        />
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({focused}) =>
                        <TabBarIcon
                            title={"Search"}
                            focused={focused}
                            icon={images.search}
                        />
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({focused}) =>
                        <TabBarIcon
                            title={"Cart"}
                            focused={focused}
                            icon={images.bag}
                        />
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({focused}) =>
                        <TabBarIcon
                            title={"Profile"}
                            focused={focused}
                            icon={images.person}
                        />
                }}
            />
        </Tabs>
    );
}
