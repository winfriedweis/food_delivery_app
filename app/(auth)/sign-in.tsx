import {View, Text, Button, Alert} from 'react-native'
import {Link, router} from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import {useState} from "react";
import {signInWithEmail} from "@/lib/appwrite";
import * as Sentry from "@sentry/react-native";
import useAuthStore from "@/store/auth.store";

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({email: "", password: ""});
    const {fetchAuthenticatedUser} = useAuthStore();

    const submit = async () => {
        // Destructure Email and Password for not repeating myself

        const {email, password} = form;

        if (!email || !password) return Alert.alert("Error", "Please enter a valid email & password ");
        setIsSubmitting(true);
        try {
            // STEP 1: Anmelden
            await signInWithEmail({email, password});
            console.log("✅ Session created!");

            // STEP 2: State aktualisieren
            await fetchAuthenticatedUser();
            console.log("✅ User state updated!");

            // STEP 3: Navigieren (JETZT funktioniert es!)
            router.replace("/(tabs)");  // ← Das ist der Hauptroute!

        } catch (error: any) {
            console.error("❌ Sign in failed:", error);
            Sentry.captureEvent(error);
            Alert.alert("Error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <View className={"gap-10 bg-white rounded-lg p-5 mt-5 ml-4 mr-4"}>
            <CustomInput
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(text) => {
                    setForm((prev) => ({...prev, email: text}))
                }}
                label="Email"
                keyboardType="email-address"
            />
            <CustomInput
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(text) => {
                    setForm((prev) => ({...prev, password: text}))
                }}
                label="Password"
                secureTextEntry={true}
            />
            <CustomButton
                title={"Sign in"}
                isLoading={isSubmitting}
                onPress={submit}
            />
            <View className="flex justify-center items-center mt-5 gap-2">
                <Text className="base-regular text-gray-100">Don't have an account?</Text>
                <Link href={"/sign-up"} className="text-bold text-primary">
                    Sign Up
                </Link>
            </View>
        </View>
    )
}
export default SignIn
