import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from 'react-native'
import React, { useRef, useState } from 'react'
import Typo from '@/components/Typo'
import ScreenWrapper from '@/components/ScreenWrapper'
import { spacingX, spacingY, colors, radius } from '@/constants/theme'
import * as Icons from 'phosphor-react-native'
import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import { verticalScale } from '@/utils/styling'
import Button from '@/components/Button'
import { router } from 'expo-router'
import { useAuth } from '@/contexts/authContext'

const ForgotPassword = () => {

    const emailRef = useRef("");
    const otpRef = useRef("");
    const passwordRef = useRef("");
    const { forgotPassword, verifyOtp, resetPassword } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 🔥 key improvement

    const submitHandler = async () => {
        
            try {
                setLoading(true);

                if (step === 1) {
                    if (!emailRef.current) {
                        Alert.alert("Enter email");
                        return;
                    }

                    await forgotPassword(emailRef.current);
                    Alert.alert("OTP Sent", "Please check your email for the OTP");
                    setStep(2);
                }

                else if (step === 2) {
                    if (!otpRef.current) {
                        Alert.alert("Enter OTP");
                        return;
                    }

                    await verifyOtp(emailRef.current, otpRef.current);
                    setStep(3);
                }

                else if (step === 3) {
                    if (!passwordRef.current) {
                        Alert.alert("Enter new password");
                        return;
                    }
                    console.log(emailRef,otpRef,passwordRef);
                    await resetPassword(
                        emailRef.current,
                        passwordRef.current,
                        otpRef.current
                    );

                    Alert.alert("Success", "Password reset successful");
                    router.back();
                }

            } catch (error: any) {
                Alert.alert(
                    "Error",
                    error?.message || "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>

            <ScreenWrapper showPattern>
                <View style={styles.container}>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <BackButton />
                        <Typo size={16} fontWeight="600">
                            Step {step}/3
                        </Typo>
                    </View>

                    {/* CONTENT */}
                    <View style={styles.content}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            {/* TITLE */}
                            <View style={styles.titleBox}>
                                <Typo size={28} fontWeight="700">
                                    {step === 1 && "Forgot Password"}
                                    {step === 2 && "Verify OTP"}
                                    {step === 3 && "Reset Password"}
                                </Typo>

                                <Typo color={colors.neutral600}>
                                    {step === 1 && "Enter your email to receive OTP"}
                                    {step === 2 && "Enter OTP sent to your email"}
                                    {step === 3 && "Set your new password"}
                                </Typo>
                            </View>

                            {/* STEP 1 */}
                            {step === 1 && (
                                <Input
                                    placeholder='Enter Email'
                                    onChangeText={(v) => emailRef.current = v}
                                    icon={<Icons.At size={20} color={colors.neutral600} />}
                                />
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <Input
                                    placeholder='Enter OTP'
                                    onChangeText={(v) => otpRef.current = v}
                                    icon={<Icons.ShieldCheck size={20} color={colors.neutral600} />}
                                />
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <Input
                                    placeholder='New Password'
                                    secureTextEntry
                                    onChangeText={(v) => passwordRef.current = v}
                                    icon={<Icons.Lock size={20} color={colors.neutral600} />}
                                />
                            )}

                            {/* BUTTON */}
                            <View style={styles.buttonBox}>
                                <Button loading={loading} onPress={submitHandler}>
                                    <Typo fontWeight="600">
                                        {step === 1 && "Send OTP"}
                                        {step === 2 && "Verify OTP"}
                                        {step === 3 && "Reset Password"}
                                    </Typo>
                                </Button>
                            </View>

                        </ScrollView>
                    </View>
                </View>
            </ScreenWrapper>
        </KeyboardAvoidingView>
    )
}

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacingX._20,
        paddingTop: spacingX._10,
        marginBottom: spacingX._25,
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        paddingHorizontal: spacingX._20,
        paddingTop: spacingX._30,
    },
    form: {
        paddingBottom: spacingY._20,
        marginBottom: spacingY._15,
    },
    titleBox: {
        marginBottom: spacingY._25,
        gap: 6,
    },

    buttonBox: {
        marginTop: spacingY._30,
    },
});