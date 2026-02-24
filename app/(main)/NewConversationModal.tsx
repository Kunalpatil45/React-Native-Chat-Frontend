import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Container } from 'lucide-react-native';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import ScreenWrapper from '@/components/ScreenWrapper';
import Header from '@/components/Header';
import * as ImagePicker from "expo-image-picker"
import BackButton from '@/components/BackButton';
import Avatar from '@/components/Avatar';
import Input from '@/components/Input';
import Typo from '@/components/Typo';
import { useAuth } from '@/contexts/authContext';
import Button from '@/components/Button';
import { verticalScale } from '@/utils/styling';
import { getContacts, newConversation } from '@/socket/socketEvents';
import { G } from 'react-native-svg';
import { updateLoggerConfig } from 'react-native-reanimated/lib/typescript/common';
import { uploadFileToCloudnary } from '@/Services/ImageService';

const NewConversationModal = () => {
  const [GroupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null)
  const [GroupName, setGroupName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [loading, setloading] = useState(false);

  const { user: currentUser } = useAuth();
  const { isGroup } = useLocalSearchParams();
  console.log("isGroup", isGroup);

  const isGroupMode = isGroup == "1";
  const router = useRouter();


  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0.5,
    })

    console.log(result);

    if (!result.canceled) {
      setGroupAvatar(result.assets[0])
    }
  }

  const toggleParticipant = (user: any) => {
    setSelectedParticipants((prev: any) => {
      if (prev.includes(user.id)) {
        return prev.filter((id: string) => id != user.id);

      }
      return [...prev, user.id];
    })
  }

  const onSelectUser = (user: any) => {
    if (!currentUser) {
      Alert.alert("Authentication", "Please Login To StartConversation ");
      return;
    }

    if (isGroupMode) {
      toggleParticipant(user);
    }
    else {
      newConversation({
        type: "direct",
        participants: [currentUser.id, user.id]
      });
    }
  }

  const createGroup = async () => {
    console.log("geoup btn clicked");
    if (!GroupName.trim() || !currentUser || selectedParticipants.length < 2) return;

    setloading(true);
    try {
      let avatar = null;
      if (GroupAvatar) {
        const uploadRes = await uploadFileToCloudnary(GroupAvatar, "groupAvatar");
        if (uploadRes.success) {
          avatar = uploadRes.data;
        }

        newConversation({
          type: 'group',
          participants: [currentUser.id, ...selectedParticipants],
          name: GroupName,
          avatar
        })

      }
    } catch (err) {
      Alert.alert("Error", "Somthing Went Wrong ");
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    getContacts(processGetContacts);
    newConversation(processNewConversation)
    getContacts(null)

    return () => {
      getContacts(processGetContacts, true)
      newConversation(processNewConversation, true)
    }

  }, [])

  const processGetContacts = (res: any) => {

    if (res.success) {
      setContacts(res.data);
    }
  }

  const processNewConversation = (res: any) => {
    if (res.success) {
      router.back()
      router.push({
        pathname: "/(main)/Conversation",
        params: {
          id: res.data._id,
          name: res.data.name,
          avatar: res.data.avatar,
          type: res.data.type,
          participants: JSON.stringify(res.data.participants),

        }
      })

    }
    else {

      Alert.alert(res.msg);
    }
  }

  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.Container}>
        <Header
          title={isGroupMode ? "newGroup" : "Selected User"}
          leftIcon={<BackButton color={colors.black} />}
        />

        {
          isGroupMode && (
            <View style={styles.groupInfoConatiner}>
              <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={onPickImage}>
                  <Avatar
                    uri={GroupAvatar?.uri || null}
                    size={100}
                    isGroup={true} />
                </TouchableOpacity>
              </View>
              <View style={styles.groupNameConatiner}>
                <Input
                  placeholder='Group Name'
                  value={GroupName}
                  onChangeText={setGroupName}
                />
              </View>
            </View>
          )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contactList}

        >
          {

            contacts.map((user: any, index) => {
              const isSelected = selectedParticipants.includes(user.id);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.contactRow, isSelected && styles.selectedContact]}
                  onPress={() => onSelectUser(user)}
                >
                  <Avatar size={45} uri={user.avatar} />
                  <Typo fontWeight={"500"}>{user.name}</Typo>

                  {
                    isGroupMode && (
                      <View style={styles.selectionIndicator}>
                        <View style={[styles.checkBox, isSelected && styles.checked]} />
                      </View>
                    )
                  }

                </TouchableOpacity>
              )
            })
          }

        </ScrollView>
        {
          isGroupMode && selectedParticipants.length >= 2 && (
            <View style={styles.createGroupButton}>
              <Button
                onPress={createGroup}
                disabled={!GroupName.trim()}
                loading={loading}>
                <Typo fontWeight={"bold"} size={17}>Create Group</Typo>
              </Button>
            </View>
          )
        }
      </View>
    </ScreenWrapper>
  )
}

export default NewConversationModal

const styles = StyleSheet.create({
  Container: {
    marginHorizontal: spacingX._15,
    flex: 1,
  },
  groupInfoConatiner: {
    alignItems: "center",
    marginTop: spacingY._10,
  },
  groupNameConatiner: {
    width: "100%",
  },

  avatarContainer: {
    marginBottom: spacingY._10,
  },
  groupNameContainer: {
    width: "100%",

  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._5,
  },
  selectedContact: {
    backgroundColor: colors.neutral100,
    borderRadius: radius._15,
  },
  contactList: {
    gap: spacingY._12,
    marginTop: spacingY._10,
    paddingTop: spacingY._10,
    paddingBottom: verticalScale(150),
  },
  selectionIndicator: {
    marginLeft: "auto",
    marginRight: spacingX._10,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  checked: {
    backgroundColor: colors.primary,
  },
  createGroupButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingX._15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,

  }


})