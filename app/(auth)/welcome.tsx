import ScreenWrapper from "@/components/ScreenWrapper";
import { View, Text , StyleSheet} from "react-native";  
import Typo from "@/components/typo";
import { spacingX } from "@/constants/theme";
import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

import Animated ,{ FadeIn } from "react-native-reanimated";
import Button from "@/components/Button";
import { useRouter } from "expo-router";

function welcome() {
    const router = useRouter();
    return (
        <ScreenWrapper showPattern={true}>
            <View style={style.container}>
                <View style={{alignItems: 'center'}}>
                    <Typo size={24} color={colors.white} fontWeight={"700"}>
                        Welcome to Chatter!
                    </Typo>
                </View>
                <Animated.Image
                entering={FadeIn.duration(700).springify()}
                source={require('@/assets/images/welcome.png')}
                style={style.welcomeImage}
                resizeMode="contain"
                />

                <View>
                    <Typo  color={colors.white} size={33} fontWeight={"800"}>
                       Stay Connected
                    </Typo>
                    <Typo  color={colors.white} size={33} fontWeight={"800"}>
                       With Friends
                    </Typo>
                    <Typo  color={colors.white} size={33} fontWeight={"800"}>
                      And Family
                    </Typo>
                </View>
                <Button style={{backgroundColor: colors.white}} onPress={()=>{
                    router.push("/(auth)/Register");
                }} >
                    <Typo size={23}  fontWeight={"bold"}>
                        Get Started
                    </Typo>
                </Button>
                
            </View>
        </ScreenWrapper>
    );
}

export default welcome;

const style = StyleSheet.create({
    container: 
    {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: spacingX._20,
        marginVertical: spacingX._10,
    },
    background:
    {
        flex: 1,
        backgroundColor: colors.neutral900,
    },
    welcomeImage:
    {
        height: verticalScale(300),
        aspectRatio: 1,
        alignSelf: 'center',
    }
});