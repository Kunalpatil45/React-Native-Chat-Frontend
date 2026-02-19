import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

function SplashScreen() {
    const router = useRouter();
    
   


    return(
        <View style={styles.Container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={colors.neutral900}
            />
            <Animated.Image
                source={require('@/assets/images/splashImage.png')}
                style={styles.logo}
                entering={FadeInDown.duration(2000)}
                resizeMode="contain"/>

            <Text style={styles.text}>Splash Screen</Text>
            
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
    logo:{
        width: 200,
        height: 200,
    }
});


export default SplashScreen;