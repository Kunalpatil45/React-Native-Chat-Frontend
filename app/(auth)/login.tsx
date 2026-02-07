import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useRef } from 'react'
import Typo from '@/components/typo'
import ScreenWrapper from '@/components/ScreenWrapper'
import { spacingX, spacingY } from '@/constants/theme'
import { colors, radius } from '@/constants/theme'
import * as Icons from 'phosphor-react-native'
import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import { verticalScale } from '@/utils/styling'
import Button from '@/components/Button'
import { router } from 'expo-router'


const Login = () => {

    
    const emailRef = useRef("");
    const passwordRef = useRef("");

    const [loading, setLoading] = React.useState(false);

    const submitHandler = () => {
        
        if(!emailRef.current || !passwordRef.current){
           ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
            return;
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScreenWrapper showPattern={true}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <BackButton />
                        <Typo size={17} color={colors.white}>
                            Forget Password?
                        </Typo>
                    </View>
                    <View style={styles.content}>
                        <ScrollView
                        contentContainerStyle={styles.form}
                        showsVerticalScrollIndicator={false}>
                            <View
                                style={{ gap:spacingX._10 , marginBottom: spacingY._15 }}> 
                                <Typo size={28}  fontWeight='600'>
                                   Welcome Back
                                </Typo>
                                <Typo 
                                color={colors.neutral600}>
                                    Hurry up and Login to your account
                                </Typo>

                            </View>
                            
                            <Input 
                            onChangeText={(value:string)=> emailRef.current = value}
                            placeholder='Enter Email Here'
                            icon={<Icons.At size={verticalScale(20)} color={colors.neutral600}/>}
                            />
                            <Input 
                            secureTextEntry={true}
                            placeholder='Enter Password Here'
                            onChangeText={(value:string)=> passwordRef.current = value}
                            icon={<Icons.Lock size={verticalScale(20)} color={colors.neutral600}/>}
                            />

                            <View
                            style={{marginTop: spacingY._25, marginBottom: spacingY._15}}>
                                <Button
                                loading={loading}
                                onPress={submitHandler}>
                                    <Typo
                                    color={colors.black}
                                    fontWeight='600'>
                                        Login
                                    </Typo>
                                </Button>
                            </View>

                            <View
                            style={{flexDirection: 'row', justifyContent: 'center', gap: spacingX._5}}>
                                <Typo>Don't Have an Account </Typo>
                                <Pressable onPress={()=>router.push("/(auth)/Register")}> <Typo fontWeight={"bold"} color= {colors.primaryDark}>Create Account</Typo> </Pressable>
                            </View>
                        </ScrollView>
                    </View>
                </View>

            </ScreenWrapper>
        </KeyboardAvoidingView>

    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        paddingHorizontal: spacingX._20,
        paddingTop: spacingX._10,
        marginBottom: spacingX._25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._20,
        paddingTop: spacingX._30,
    },
    form:{
            paddingBottom: spacingY._20,
            gap: spacingY._15,
    }
})