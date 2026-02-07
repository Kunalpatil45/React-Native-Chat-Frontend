import {colors} from "../constants/theme";
import { Text, View } from "react-native";
import { TypoProps } from "@/type";
import { verticalScale } from "@/utils/styling";

const typo = ({
    size =16,
    color = colors.text,
    fontWeight = "400",
    children,
    style,
    textProps = {},

}: TypoProps) =>{
    const textStyle = {
        fontSize: verticalScale(size),
        color,
        fontWeight
    };
    return(
       <Text style={[textStyle, style]} {...textProps}>
        {children}
       </Text>
       
    )
}


export default typo;