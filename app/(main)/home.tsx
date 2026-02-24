import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/authContext'
import { verticalScale } from '@/utils/styling'
import * as Icons from 'phosphor-react-native'
import { useRouter } from 'expo-router'
import ConversationItem from '@/components/ConversationItem'
import Loading from '@/components/Loading'
import { getConversation, newConversation, newMesaage } from '@/socket/socketEvents'
import { ConversationProps, ResponseProps } from '@/type'
import LottieView from 'lottie-react-native';

const Home = () => {

  const { user: currentUser } = useAuth();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversation] = useState<ConversationProps[]>([]);

  // ---------- SORT HELPER ----------
  const sortByLastMessage = (list: ConversationProps[]) => {
    return [...list].sort((a, b) => {
      const aDate = a?.lastMessage?.createdAt || a.createdAt;
      const bDate = b?.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  };

  // ---------- FILTERED LISTS ----------
  const directConversation = sortByLastMessage(
    conversations.filter(c => c.type === "direct")
  );

  const groupConversation = sortByLastMessage(
    conversations.filter(c => c.type === "group")
  );

  // ---------- HANDLERS ----------
  const processConversation = (res: ResponseProps) => {
    if (!res.success) return;
    setConversation(sortByLastMessage(res.data));
  };

  const newConversationHandler = (res: ResponseProps) => {
    if (!res.success) return;

    setConversation(prev =>
      sortByLastMessage([res.data, ...prev])
    );
  };

  const newMessageHandler = (res: ResponseProps) => {
    if (!res.success) return;

    const conversationId = res.data.conversationId;

    setConversation(prev => {

      // update last message immutably
      const updated = prev.map(item =>
        item._id === conversationId
          ? { ...item, lastMessage: res.data }
          : item
      );

      // move updated chat to top
      return sortByLastMessage(updated);
    });
  };

  // ---------- SOCKET EFFECT ----------
  useEffect(() => {

    // fetch conversations once
    getConversation(processConversation);
    getConversation(null); // emit

    // listen realtime
    newConversation(newConversationHandler);
    newMesaage(newMessageHandler);

    return () => {
      getConversation(processConversation, true);
      newConversation(newConversationHandler, true);
      newMesaage(newMessageHandler, true);
    };

  }, []);

  return (
    <ScreenWrapper showPattern bgOpacity={0.4}>

      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo color={colors.white} size={19} textProps={{ numberOfLines: 1 }}>
              welcome back{" "}
              <Typo size={20} color={colors.white} fontWeight={"800"}>
                {currentUser?.name}
              </Typo>{" "}
              😊
            </Typo>
          </View>

          <TouchableOpacity
            style={styles.settingIcon}
            onPress={() => router.push("/(main)/ProfileModels")}
          >
            <Icons.Gear color={colors.white} weight='fill' size={verticalScale(20)} />
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacingY._20 }}
          >

            {/* TABS */}
            <View style={styles.navBar}>
              <View style={styles.tabs}>

                <TouchableOpacity
                  onPress={() => setSelectedTab(0)}
                  style={[styles.tabStyle, selectedTab === 0 && styles.activeTabStyle]}
                >
                  <Typo>Direct Message</Typo>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedTab(1)}
                  style={[styles.tabStyle, selectedTab === 1 && styles.activeTabStyle]}
                >
                  <Typo>Group Message</Typo>
                </TouchableOpacity>

              </View>
            </View>

            {/* LIST */}
            <View style={styles.conversationList}>

              {selectedTab === 0 && directConversation.map((item, index) => (
                <ConversationItem
                  key={item._id}
                  item={item}
                  router={router}
                  showDivider={directConversation.length !== index + 1}
                />
              ))}

              {selectedTab === 1 && groupConversation.map((item, index) => (
                <ConversationItem
                  key={item._id}
                  item={item}
                  router={router}
                  showDivider={groupConversation.length !== index + 1}
                />
              ))}

            </View>

            {!loading && selectedTab === 0 && directConversation.length === 0 && (
              //<Typo style={{ textAlign: "center" }}>You Don't Have Any Messages</Typo>
              <View style={{ alignItems: "center", marginTop: 40 }}>
                <LottieView
                  source={require("@/assets/lottie/email.json")}
                  autoPlay
                  loop
                  style={{ width: 220, height: 220 }}
                />
                <Typo style={{ textAlign: "center", marginTop: 10 }}>
                  No conversations yet
                </Typo>
              </View>
            )}

            {!loading && selectedTab === 1 && groupConversation.length === 0 && (
              <Typo style={{ textAlign: "center" }}>
                You Haven't Joined Any Group Yet
              </Typo>
            )}

            {loading && <Loading />}

          </ScrollView>

        </View>
      </View>

      {/* FLOAT BUTTON */}
      <Button
        style={styles.floatingButton}
        onPress={() =>
          router.push({
            pathname: "/(main)/NewConversationModal",
            params: { isGroup: selectedTab }
          })
        }
      >
        <Icons.Plus color={colors.black} weight='bold' size={verticalScale(24)} />
      </Button>

    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacingY._20,
    gap: spacingY._15,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._20,
  },

  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingX._10,
  },

  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral800,
    borderRadius: radius.full,
  },

  navBar: {
    flexDirection: "row",
    gap: spacingX._10,
    alignItems: "center",
    paddingHorizontal: spacingX._10,
  },

  tabs: {
    flexDirection: "row",
    gap: spacingX._10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  tabStyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  },

  activeTabStyle: {
    backgroundColor: colors.primaryLight,
  },

  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },

  conversationList: {
    paddingVertical: spacingY._20,
  },
})