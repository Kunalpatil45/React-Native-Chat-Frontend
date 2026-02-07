import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BackButtonProps } from '@/type'
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme'; 
import { ArrowLeft } from 'lucide-react-native';

 
const BackButton = ({
    style,
    color= colors.white,
    iconSize =26,
     
}:BackButtonProps) => {
    const router = useRouter();
  return (
    
    <TouchableOpacity 
        onPress={()=>{ router.back()}}
        style={[styles.button, style]}>
        <ArrowLeft 
            size={iconSize} 
            color={color} 
        />
    </TouchableOpacity>
  )
}

export default BackButton;

const styles = StyleSheet.create({
    button:{
        justifyContent: 'center',
        alignItems: 'center',

    }
})