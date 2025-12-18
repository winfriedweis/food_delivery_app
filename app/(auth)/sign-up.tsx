import {View, Text, Button, Alert} from 'react-native'
import {Link, router} from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import {useState} from "react";

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({name: "", email: "", password: ""});

    const submit = async () => {
        if (!form.name || !form.email || !form.password) return Alert.alert("Error", "Please enter a valid email & password ");
        setIsSubmitting(true);
        try {
            // Integrate Appwrite or other provider for authentication
            Alert.alert("Success!", "The user is logged in.");
            router.replace("/");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <View className={"gap-8 bg-white rounded-lg p-5 mt-5 ml-4 mr-4"}>
            <CustomInput
                placeholder="Enter your name"
                value={form.name}
                onChangeText={(text) => {
                    setForm((prev) => ({...prev, name: text}))
                }}
                label="Full Name"
            />
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
                title={"Sign Up"}
                isLoading={isSubmitting}
                onPress={submit}
            />
            <View className="flex justify-center items-center gap-2 mt-2">
                <Text className="base-regular text-gray-100">Already have an account?</Text>
                <Link href={"/sign-in"} className="text-bold text-primary">
                    Sign In
                </Link>
            </View>
        </View>
    )
}
export default SignIn
