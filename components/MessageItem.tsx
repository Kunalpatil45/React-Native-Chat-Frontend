/* import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MessageProps } from '@/type'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import Avatar from './Avatar'
import Typo from './Typo'
import { Image } from 'expo-image'

const MessageItem = ({
    item,isDirect,
}:{item:MessageProps, isDirect:boolean}) => {

    //console.log("items",item);
    const {user:currentUser} = useAuth();
    const isMe = currentUser?.id == item.sender.id;

    const messageTime = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View
    style={[
        styles.messageContainer,
        isMe? styles.myMessage : styles.thierMessage
    ]}>
        {!isMe && !isDirect && (
                <Avatar uri={item?.sender?.avatar} size={30} style={styles.messageAvatar} />
        )}

        <View style={[
            styles.messageBubble,
            isMe ? styles.myBubble : styles.thierBubble
        ]}>
            {!isMe && !isDirect &&(
                 <Typo color={colors.neutral900} fontWeight={'600'} size={13}>
                 {item.sender.name}
             </Typo>
            )}

            {
                item.attachement && (
                    <Image source={item.attachement} style={styles.attachement} />
                )
            }

            {item.content && <Typo size={15}>{item.content}</Typo>}

            <Typo size={11} color={colors.neutral700} style={{alignSelf:"flex-end"}}>
                {messageTime}
            </Typo>
            
            

        </View>
      
    </View>
  )
}

export default MessageItem

const styles = StyleSheet.create({
    attachement:{
        width:verticalScale(180),
        height:verticalScale(180),
        borderRadius:radius._10,
    },
    messageAvatar:{
        alignSelf:"flex-end",
        
    },
    messageContainer:{
        flexDirection:"row",
        gap:spacingX._7,
        maxWidth:"80%",
        alignSelf:"flex-end",
    },
    myMessage:{
        alignSelf:"flex-end",
    },
    thierMessage:{
        alignSelf:"flex-start",
    },
    messageBubble:{
        padding:spacingX._10,
        borderRadius:radius._15,
        gap:spacingY._5,
    },
    thierBubble:{
        backgroundColor:colors.otherBubble,
    },
    myBubble:{
        backgroundColor:colors.myBubble,
        alignSelf:"flex-end",
    }
}) */

import { StyleSheet, View } from 'react-native'
import React from 'react'
import { MessageProps } from '@/type'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/contexts/authContext'
import Avatar from './Avatar'
import Typo from './Typo'
import { Image } from 'expo-image'
/* import { socket } from '../socket/socket' */

const MessageItem = ({
    item,
    isDirect,
}: { item: MessageProps, isDirect: boolean }) => {
    /* const [aiTyping, setAiTyping] = React.useState(false); */
    const { user: currentUser } = useAuth();

    const isMe = currentUser?.id == item.sender.id;
    const isAI = item.type === "ai";
    const isImage = item.type === "image";
    const isText = item.type === "text";

    const messageTime = new Date(item.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

  
    return (
        <View
            style={[
                styles.messageContainer,
                isMe ? styles.myMessage : styles.thierMessage
            ]}
        >

            {(!isMe && !isDirect) || isAI ? (
  <Avatar uri={item?.sender?.avatar} size={30} style={styles.messageAvatar} />
) : null}

            <View style={[
                styles.messageBubble,
                isAI
                    ? styles.aiBubble
                    : isMe
                        ? styles.myBubble
                        : styles.thierBubble
            ]}>

                {/* Name */}
                {!isMe && !isDirect && (
  <Typo color={colors.neutral900} fontWeight={'600'} size={13}>
    {item.sender.name}
  </Typo>
)}

                {/* AI Label */}
                {isAI && (
                    <Typo size={16} color={colors.neutral700} style={{ alignSelf: "flex-start" , fontWeight:"600"}}>
                        {item.sender.name || "AI"}
                    </Typo>
                )}

                {/* Image */}
                {isImage && item.attachement && (
                    <Image
                        source={{ uri: item.attachement }}
                        style={styles.attachement}
                        contentFit="cover"
                    />
                )}

                {/* Text / AI */}
                {(isText || isAI) && item.content && (
                    <Typo size={15}>
                        {item.content}
                    </Typo>
                )}

                {/* Time */}
                <Typo size={11} color={colors.neutral700} style={{ alignSelf: "flex-end" }}>
                    {messageTime}
                </Typo>

            </View>
        </View>
    )
}

export default MessageItem

const styles = StyleSheet.create({
    attachement: {
        width: verticalScale(180),
        height: verticalScale(180),
        borderRadius: radius._10,
    },
    messageAvatar: {
        alignSelf: "flex-start",
    },
    messageContainer: {
        flexDirection: "row",
        gap: spacingX._7,
        maxWidth: "80%",
        alignSelf: "flex-end",
    },
    myMessage: {
        alignSelf: "flex-end",
    },
    thierMessage: {
        alignSelf: "flex-start",
    },
    messageBubble: {
        padding: spacingX._10,
        borderRadius: radius._15,
        gap: spacingY._5,
    },
    thierBubble: {
        backgroundColor: colors.otherBubble,
    },
    myBubble: {
        backgroundColor: colors.myBubble,
        alignSelf: "flex-end",
    },
    aiBubble: {
        backgroundColor: "#e0f7fa",
        alignSelf: "flex-start",
    }
})