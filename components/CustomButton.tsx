import {View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {CustomInputProps} from "@/type";

const CustomButton = ({
                          onPress,
                          title = "Click Me!",
                          style,
                          TextStyle,
                          leftIcon,
                          isLoading = false
                      }: CustomInputProps) => {
    return (
        <TouchableOpacity className={cn}>
            <Text>CustomButton</Text>
        </TouchableOpacity>
    )
}
export default CustomButton
