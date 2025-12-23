import {View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {Redirect, Slot} from "expo-router";
import {images} from "@/constants";
import {ImageBackground} from "@/components/ExpoImageBackground";
import {Image} from "@/components/ExpoImage";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import useAuthStore from "@/store/auth.store";

// Keyboard Avoiding View for keeping the keyboard below the text field
export default function AuthLayout() {

    const {isAuthenticated, isLoading} = useAuthStore();

    if (isLoading) {
        return null;  // todo oder eine Loading-UI
    }

    if (isAuthenticated) return < Redirect href="/(tabs)"/>

    return (
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'height' : 'padding'}
                              keyboardVerticalOffset={4}
        >
            <ScrollView className="bg-white h-full" keyboardShouldPersistTaps={"handled"}>
                <View className="w-full relative" style={{height: Dimensions.get("screen").height / 2.25}}>
                    <ImageBackground source={images.loginGraphic} className="size-full rounded-b-lg"
                                     contentFit="cover"/>
                    <Image source={images.logo} className="self-center size-48 absolute -bottom-16 z-10"/>
                </View>
                <Slot/>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
