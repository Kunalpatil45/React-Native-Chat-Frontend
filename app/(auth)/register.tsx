import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef } from "react";

const Register = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [loading, setLoading] = React.useState(false);

  const { signUp } = useAuth();

  const submitHandler = async () => {
    if (!nameRef.current || !emailRef.current || !passwordRef.current) {
      Alert.alert("Please fill all the fields");
      return;
    }

    if (passwordRef.current.length < 6) {
      Alert.alert("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      await signUp(
        emailRef.current,
        passwordRef.current,
        nameRef.current,
        "")

    } catch (err) {
      Alert.alert("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const showForget = () => {
    Alert.alert("Need Some Help?", "Please contact support at @kunalpatil.45 on Instagram for assistance .");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScreenWrapper showPattern>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <BackButton />
            <Pressable onPress={showForget}>
              <Typo size={17} color={colors.white}>
                Need Some Help?
              </Typo>
            </Pressable>

          </View>

          {/* Content */}
          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <View style={styles.titleBox}>
                <Typo size={28} fontWeight="600">
                  Getting Start
                </Typo>

                <Typo
                  color={colors.neutral600}
                  style={{ marginTop: spacingY._5 }}
                >
                  Create an Account to Continue
                </Typo>
              </View>

              {/* Inputs */}
              <Input
                onChangeText={(v: string) => (nameRef.current = v)}
                placeholder="Enter Full Name Here"
                icon={
                  <Icons.User
                    size={verticalScale(20)}
                    color={colors.neutral600}
                  />
                }
              />

              <Input
                onChangeText={(v: string) => (emailRef.current = v)}
                placeholder="Enter Email Here"
                icon={
                  <Icons.At
                    size={verticalScale(20)}
                    color={colors.neutral600}
                  />
                }
              />

              <Input
                secureTextEntry
                placeholder="Enter Password Here"
                onChangeText={(v: string) => (passwordRef.current = v)}
                icon={
                  <Icons.Lock
                    size={verticalScale(20)}
                    color={colors.neutral600}
                  />
                }
              />

              {/* Button */}
              <View style={styles.buttonBox}>
                <Button loading={loading} onPress={submitHandler}>
                  <Typo color={colors.black} fontWeight="600">
                    Create Account
                  </Typo>
                </Button>
              </View>

              {/* Footer */}
              <View style={styles.footerRow}>
                <Typo style={{ marginRight: spacingX._5 }}>
                  Already have an account?
                </Typo>

                <Pressable onPress={() => router.push("/(auth)/login")}>
                  <Typo fontWeight="bold" color={colors.primaryDark}>
                    Login
                  </Typo>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  header: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingX._10,
    marginBottom: spacingX._25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },

  titleBox: {
    marginBottom: spacingY._15,
  },

  buttonBox: {
    marginTop: spacingY._25,
    marginBottom: spacingY._15,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
