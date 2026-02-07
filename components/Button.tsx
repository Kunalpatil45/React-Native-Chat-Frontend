import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ButtonProps } from '@/type';
import { colors, radius } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import Loading from '@/components/Loading';

const  Button= ( 
 {
    style,
    onPress,
    children,
    loading=false,
}: ButtonProps)=>{
    if(loading){
        return(
            <View style={[styles.button , style,{backgroundColor:"transparent"}]}>
            <Loading/>
        </View>
        )
          
    }

    return(
        <TouchableOpacity onPress={onPress} style={[styles.button , style]}>
            {children}
        </TouchableOpacity>
    );
};

export default Button;


const styles = StyleSheet.create({
    button:{
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        borderCurve: 'continuous',
        height: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center',
    }
});