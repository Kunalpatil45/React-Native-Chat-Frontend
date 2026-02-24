import Typo from '@/components/Typo';
import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

function SplashScreen() {
    const router = useRouter();

    return (
        <View style={styles.Container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={colors.neutral900}
            />
            <Animated.Image
                source={require('@/assets/images/icon.png')}
                style={styles.logo}
                entering={FadeInDown.duration(2000)}
                resizeMode="contain" />

            <Text style={styles.text}>Random Chat</Text>
            <Typo color={colors.white} fontWeight={'600'} style={styles.version}>Version 1.0.1</Typo>

            <Text style={styles.footer}>Develop by Kunal Patil</Text>

        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral900,

    },
    text: {
        color: colors.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    logo: {
        width: 200,
        height: 200,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        color: colors.white,
        fontSize: 14,
    },
    version: {
        color: colors.white,
        fontSize: 14,
        marginBottom: 20,
    }
});


export default SplashScreen;