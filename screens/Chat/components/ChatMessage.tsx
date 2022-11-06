import { useActionSheet } from '@expo/react-native-action-sheet'
import dayjs from 'dayjs'
import React, { useCallback } from 'react'
import { memo } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Avatar from '../../../components/Avatar/Avatar'
import Span from '../../../components/Span/Span'
import Text from '../../../components/Text/Text'
import Colors from '../../../constants/Colors'
import { IMessage } from '../../../Models/Message'
import ws from '../../../services/socket'
import { useAppSelector } from '../../../store/hooks'
import { selectUser } from '../../../store/userSlice'
import { _userLevel } from '../../../types/User'
import { getChatMessageContentOptions } from '../utils'

interface IProps {
  message: IMessage
  isFollowingMessage: boolean
  hasFollwingMessage: boolean
}

function ChatMessage({
  message,
  isFollowingMessage,
  hasFollwingMessage,
}: IProps) {
  const { user } = useAppSelector(selectUser)

  const isFirstMessage = !isFollowingMessage
  const isAuthor = message.authorId === user?.id

  const { showActionSheetWithOptions } = useActionSheet()

  const openMenu = useCallback((isAuthor: boolean, level: _userLevel) => {
    const options = getChatMessageContentOptions({ isAuthor, level })
    const destructiveButtonIndex =
      options.indexOf('Deletar mensagem') === -1
        ? undefined
        : options.indexOf('Deletar mensagem')

    const cancelButtonIndex = options.indexOf('Cancelar')

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        tintColor: Colors.text,
        containerStyle: {
          backgroundColor: Colors.lightBackground,
        },
      },
      (selectedIndex?: number) => {
        if (typeof selectedIndex === 'undefined') return

        const selectedOption = options[selectedIndex]
        switch (selectedOption) {
          case 'Deletar mensagem':
            ws.deleteMessage({ id: message.id })
            return
          case 'Responder':
            return
          case 'Denunciar usuário':
            return
        }
      }
    )
  }, [])

  return (
    <Span
      style={[
        styles.Message,
        ...(isAuthor ? [styles.AlignedRight, styles.UserMessage] : []),
      ]}
    >
      {isFirstMessage && (
        <Span
          style={[
            styles.ContentWrapper,
            ...(isAuthor ? [styles.UserContentWrapper] : []),
          ]}
        >
          <Avatar
            style={[styles.Avatar]}
            source={
              message.author.picture
                ? { uri: message.author.picture }
                : undefined
            }
          />
          <Text numberOfLines={1} style={styles.Name}>
            {message.author.name}
          </Text>
        </Span>
      )}
      <TouchableOpacity
        onPress={() => user?.level && openMenu(isAuthor, user?.level)}
      >
        <MessageContent
          message={message}
          isFollowingMessage={isFollowingMessage}
          hasFollwingMessage={hasFollwingMessage}
          isAuthor={isAuthor}
        />
      </TouchableOpacity>
    </Span>
  )
}

export default memo(ChatMessage)

interface IMessageContent {
  message: IMessage
  isFollowingMessage: boolean
  hasFollwingMessage: boolean
  isAuthor: boolean
}

function MessageContent({
  message,
  isFollowingMessage,
  hasFollwingMessage,
  isAuthor,
}: IMessageContent) {
  return (
    <Span
      style={[
        styles.Content,
        ...(hasFollwingMessage ? [styles.HasFollowingMessage] : []),
        ...(isAuthor ? [styles.UserContent] : []),
      ]}
    >
      <Text style={styles.Datetime}>
        {dayjs(message.createdAt).format('HH:mm')}
      </Text>
      <Text style={styles.Text}>{message.content}</Text>
    </Span>
  )
}

const styles = StyleSheet.create({
  Message: {
    alignSelf: 'flex-start',
  },
  UserMessage: {},
  Avatar: {
    width: 30,
    height: 30,
  },
  HasFollowingMessage: {
    marginBottom: 8,
  },
  AlignedRight: {
    alignSelf: 'flex-end',
  },
  Name: {
    marginBottom: 6,
    fontSize: 14,
  },
  ContentWrapper: {},
  UserContentWrapper: {
    alignItems: 'flex-end',
  },
  Content: {
    backgroundColor: Colors.xLightBackground,
    marginBottom: 16,
    borderRadius: 15,
    borderTopLeftRadius: 7,
    padding: 14,
    paddingTop: 10,
    overflow: 'hidden',
    maxWidth: 250,
    minWidth: '45%',
    paddingBottom: 24,
    position: 'relative',
  },
  UserContent: {
    backgroundColor: Colors.chatTextbox,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 7,
  },
  Text: {
    fontSize: 18,
  },
  Datetime: {
    position: 'absolute',
    fontSize: 12,
    color: Colors.gray,
    right: 12,
    bottom: 4,
  },
})
