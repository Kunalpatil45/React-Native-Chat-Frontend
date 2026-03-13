import { Alert, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useEffect } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/contexts/authContext'
import * as Icons from 'phosphor-react-native'
import { scale, verticalScale } from '@/utils/styling'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import Avatar from '@/components/Avatar'
import MessageItem from '@/components/MessageItem'
import Input from '@/components/Input'
import * as ImagePicker from 'expo-image-picker'

import { uploadFileToCloudnary } from '@/Services/ImageService'
import { getMessage, newMesaage } from '@/socket/socketEvents'
import { MessageProps } from '@/type'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const Conversation = () => {
  const {
    id: conversationId,
    name,
    avatar,
    participants: stringifiedparticipants,
    type,
  } = useLocalSearchParams();
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<{ uri: string } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { user: currenUser } = useAuth();

  const participants = JSON.parse(stringifiedparticipants as string);

  let conversationAvatar = avatar;
  let isDirect = type == "direct";
  let otherParticipants = isDirect ? participants.find((p: any) => p._id != currenUser?.id) : null;

  if (isDirect && otherParticipants) conversationAvatar = otherParticipants?.avatar;

  let conversationName = isDirect ? otherParticipants?.name : name;

  const onPickFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0.5,
    })

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  }

  const onSend = async () => {
    if (message.trim() === "" && !selectedFile) return;
    if (!currenUser) return;

    setLoading(true);

    if(message == "hi" || message == "Hello" || message == "Hi")
    {
      
    }

    try {
      let attachement = null;

      if (selectedFile) {
        const uploadResult = await uploadFileToCloudnary(
          selectedFile,
          "message-attachments"
        );

        if (uploadResult.success) {
          attachement = uploadResult.data;
        }
        else {
          Alert.alert("Upload failed");
          setLoading(false);
          return;
        }

      }

      newMesaage({
        conversationId,
        sender: {
          id: currenUser.id,
          name: currenUser.name,
          avatar: currenUser.avatar,
        },
        content: message.trim(),
        attachement,
      });

      setMessage('');
      setSelectedFile(null);

    } catch (err) {
      Alert.alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const messageHandler = (res: any) => {
    if (res.success) {
      setMessages(res.data);
    }
  }

  const newMessageHandler = (res: any) => {

    if (!res?.success || !res?.data) return;

    // force both to string to avoid ObjectId mismatch
    if (String(res.data.conversationId) !== String(conversationId)) return;

    setMessages(prev => {

      // prevent duplicates if server re-emits
      if (prev.some(m => m.id === res.data.id)) return prev;

      return [...prev, res.data];
    });
  };


  useEffect(() => {

    // register listeners
    newMesaage(newMessageHandler);
    getMessage(messageHandler);

    // fetch messages for this conversation
    getMessage({ conversationId });

    return () => {
      // cleanup old listeners when conversation changes
      newMesaage(newMessageHandler, true);
      getMessage(messageHandler, true);
    };



  }, [conversationId]);



  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5} >
      <Header
        style={styles.header}
        leftIcon={
          <View style={styles.headerLeft}>
            <BackButton />
            <Avatar uri={conversationAvatar as string} size={35} isGroup={type == "group"} />
            <Typo color={colors.white} size={20}>{conversationName}</Typo>
          </View>

        }
        rightIcon={
          <TouchableOpacity style={{ marginBottom: verticalScale(7) }}>
            <Icons.DotsThreeVerticalIcon weight='bold' color={colors.white} size={28} />
          </TouchableOpacity>

        }
      />
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        style={styles.container}>
        <View style={styles.content}>
          <FlatList
            data={messages}
            inverted={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messageContent}
            renderItem={({ item }) => (
              <MessageItem item={item} isDirect={isDirect} />
            )}
            keyExtractor={(item) => item.id}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          />

          <View style={styles.footer}>
            <Input
              value={message}
              onChangeText={setMessage}
              placeholder='Type a message'
              containerStyle={{
                paddingLeft: spacingX._10,
                paddingRight: scale(67),
                borderWidth: 0,
              }}
              icon={
                <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                  <Icons.Plus weight='bold' color={colors.black} size={verticalScale(22)} 
                  />
                  {
                    selectedFile && selectedFile.uri && (
                      <Image
                        source={{ uri: selectedFile.uri }}
                        style={styles.selectedFile}
                      />
                    )
                  }
                </TouchableOpacity>
              }

            />
            <View style={styles.inputRightIcon}>
              <TouchableOpacity style={styles.inputIcon} onPress={onSend}>

                <Icons.PaperPlaneTilt weight='fill' color={colors.black} size={verticalScale(22)} />
              </TouchableOpacity>
            </View>
          </View>
        </View>


      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default Conversation

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  plusIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
  messageContent: {
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._12,
  },
  messageContainer: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingY._10,
    paddingBottom: verticalScale(5),
  },
  content: {
    flex: 1,
    height: "100%",
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._10,
  },
  inputIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8,
  },
  selectedFile: {
    position: "absolute",
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: radius.full,
    alignSelf: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
  },
  inputRightIcon: {
    position: "absolute",
    right: scale(10),
    top: verticalScale(15),
    paddingLeft: spacingX._12,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.neutral300,
  },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
  },

})





