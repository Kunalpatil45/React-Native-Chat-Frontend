import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { InputProps } from '@/type'
import { colors, spacingX } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';

const Input = (props:InputProps) => {
    const [isFocuesd, setIsFocused] = useState(false);
  return (
    <View
    style={[
        styles.container,
        props.containerStyle && props.containerStyle,
        isFocuesd && styles.primaryBorder,
    ]}
    >
      
      {props.icon && props.icon}

        <TextInput
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={colors.neutral600}
        ref={props.inputRef && props.inputRef}
        onFocus={()=> setIsFocused(true)}
        onBlur={()=>{ setIsFocused(false)}}
        
        {...props}
       />

    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        height: verticalScale(56),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: 50,
        borderCurve: 'continuous',
        
        paddingHorizontal: spacingX._15,
        backgroundColor: colors.neutral100,
    },
    primaryBorder:{
        borderColor: colors.primary,
    },
    input:{
        
        flex: 1,
        color:colors.text,
        fontSize: verticalScale(16),
        fontWeight: '500',
    }
})