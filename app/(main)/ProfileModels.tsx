import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from "@/utils/styling"
import ScreenWrapper from "@/components/ScreenWrapper"
import Header from "@/components/Header"
import BackButton from "@/components/BackButton"
import Avatar from "@/components/Avatar"
import * as Icons from 'phosphor-react-native'
import Input from "@/components/Input"
import { useAuth } from "@/contexts/authContext"
import { useEffect, useState } from "react"
import { UserDataProps } from "@/type"
import Button from "@/components/Button"
import { router } from "expo-router"
import { UpdateProfile } from "@/socket/socketEvents"
import * as ImagePicker from "expo-image-picker" 
import { uploadFileToCloudnary } from "@/Services/ImageService"

const ProfileModels = () => {

    const { user , signOut,updateToken} = useAuth();
    const [loading, setLoading] = useState(false);

    const [userData, setUserData] = useState<UserDataProps>({
        name: "",
        email: "",
        avatar: null,
    })

    useEffect(() => {
        setUserData({
            name: user?.name || "",
            email: user?.email || "",
            avatar: user?.avatar || null,

        })
    }, [user])

    useEffect(() => {
        UpdateProfile(processUpdateProfile);

        return ()=>{
            UpdateProfile(processUpdateProfile,true )
        }
    }, [])

    const onPickImage = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:["images"],
            aspect:[4,3],
            quality:0.5,
        })

        console.log(result);

        if(!result.canceled)
        {
            setUserData({...userData , avatar: result.assets[0]})
        }
    }

    const processUpdateProfile = (res:any)=>{
        console.log('got res ',res);
        setLoading(false);

        if(res.success)
        {
            updateToken(res.data.token);
            router.back()
        }
        else{
            Alert.alert('user',res.msg);
        }
    }

    const handleLogout = async () =>{
        router.back();
        await signOut();
    }

    const showAlert = () =>{
        Alert.alert("Cancel" ,"Are you Sure Want To Logout?",[
            {
                text:"cancel",
                onPress:()=>{console.log('cancel logout')},
                style:"cancel"
            },
            {
                text:"Logout",
                onPress:()=> handleLogout(),
                style:"destructive"
            }
        ])
    }

    const submitHandler = async()=>{
        let {name,avatar}  = userData;
        if(!name.trim())
        {
            Alert.alert("user, please enter your name");
            return;
        }

        let data = {
            name,
            avatar
        }

        //console.log("data", data);

        if(avatar && avatar?.uri)
        {
            setLoading(true);
            const res =  await uploadFileToCloudnary(avatar,"profiles");
            if(res.success )
            {
                data.avatar = res.data;
            }
            else {
                Alert.alert("user", res.msg);
                setLoading(false);
                return;
            }

        }


        UpdateProfile(data);
    }

    return (
        <ScreenWrapper isModal={true}>
            <View style={styles.container}>
                <Header title={"Update Profile"} leftIcon={
                    Platform.OS == "android" && <BackButton color={colors.black} />
                } />

                <ScrollView contentContainerStyle={styles.form}>
                    <View style={styles.avatarContainer}>
                        <Avatar uri={userData.avatar} size={170} />
                        <TouchableOpacity style={styles.editIcon} onPress={onPickImage}>
                            <Icons.Pencil
                                size={verticalScale(20)}
                                color={colors.neutral800} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ gap: spacingY._15 }}>
                        <View style={styles.container} >
                            <Typo style={{ paddingLeft: spacingX._10 }}>Email</Typo>
                            <Input
                                value={userData.email}
                                containerStyle={{
                                    borderColor: colors.neutral350,
                                    paddingLeft: spacingX._20,
                                    backgroundColor: colors.neutral300
                                }}
                                onChangeText={(value) => {
                                    setUserData({...userData, email: value })
                                }}
                                editable={false}
                            />
                        </View>
                        <View style={styles.container} >
                            <Typo style={{ paddingLeft: spacingX._10 }}>Name</Typo>
                            <Input
                                value={userData.name}
                                containerStyle={{
                                    borderColor: colors.neutral350,
                                    paddingLeft: spacingX._20,
                                    //backgroundColor: colors.neutral300
                                }}
                                onChangeText={(value) => {
                                    setUserData({ ...userData, name: value })
                                }}
                            //editable={false}
                            />
                        </View>
                    </View>


                </ScrollView>
            </View>
            <View style={styles.footer}>

                {
                    !loading && 
                    (
                        <Button
                    style={{
                        backgroundColor: colors.rose,
                        height: verticalScale(56),
                        width: verticalScale(56)
                    }}
                    onPress={showAlert}
                >
                    <Icons.SignOut
                        size={verticalScale(30)}
                        color={colors.white}
                        weight="bold"
                    />
                    
                </Button>
                    )
                }
                        
                
                <Button style={{flex:1}} onPress={submitHandler} loading={loading}>
                    <Typo color={colors.black} fontWeight={900}>Update Profile</Typo>

                </Button>
            </View>
        </ScreenWrapper>
    )
}

export default ProfileModels;

const styles = StyleSheet.create({


    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacingY._20,
        //paddingVertical:spacingT._30,
    },

    footer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral300,
        marginBottom: spacingY._10,
        borderTopWidth: 1,
    },

    form: {
        gap: spacingY._30,
        marginTop: spacingY._15,
    },

    avatarContainer: {
        position: "relative",
        alignSelf: "center",
    },

    avatar: {
        alignSelf: "center",
        backgroundColor: colors.neutral300,
        width: verticalScale(135),
        height: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500,
        //overflow: "hidden",
        //position:"relative"
    },
    editIcon: {
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7,
    },

    inputContainer: {
        gap: spacingY._7,
    }
})