import { useNavigation } from '@react-navigation/native'
import React, { ReactNode, useState } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Colors from '../../constants/Colors'
import Event, { IEvent } from '../../Models/Event'
import { hasPast } from '../../screens/EventForm/utils'
import { useAppSelector } from '../../store/hooks'
import { selectUser } from '../../store/userSlice'
import Button from '../Button/Button'
import Text from '../Text/Text'

interface IButtonComponentProps {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  onPress(): void
}

function ButtonComponent({ children, onPress, style }: IButtonComponentProps) {
  return (
    <Button
      style={[styles.PrimaryButton, styles.PrimaryButton, style]}
      onPress={onPress}
    >
      <Text style={[styles.PrimaryButtonText]}>{children}</Text>
    </Button>
  )
}

interface IEventDetailsButtonProps {
  event: IEvent.Details | null
  loading: boolean
  reloadDetails(): void
}

function EventDetailsButton({
  event,
  loading,
  reloadDetails,
}: IEventDetailsButtonProps) {
  const { user } = useAppSelector(selectUser)
  const isAuthor = event?.authorId === user?.id
  const isParticipating = event?.Atendee.find(user => user.id === user.id)
  const navigation = useNavigation()
  const [loadingButton, setLoadingButton] = useState(false)

  function navigateToEdit(event: IEvent.Details) {
    navigation.navigate('EventForm', {
      event: event,
    })
  }

  async function toggleAttendEvent(eventId: number) {
    setLoadingButton(true)
    try {
      await Event.toggleAttendEvent(eventId)
      reloadDetails()
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingButton(false)
    }
  }

  // 🎈🎈 TODO skeleton buttton
  if (loading || !event) {
    return (
      <Button style={[styles.Button, styles.PrimaryButton]}>
        <Text style={styles.SkeletonText}>Participando</Text>
      </Button>
    )
  }

  if (hasPast(event.datetime)) return null

  if (isAuthor) {
    return (
      <ButtonComponent
        style={[styles.Button, styles.PrimaryButton]}
        onPress={() => navigateToEdit(event)}
      >
        Editar
      </ButtonComponent>
    )
  }

  if (isParticipating)
    return (
      <Button
        style={[styles.Button, styles.PrimaryButton]}
        onPress={() => toggleAttendEvent(event.id)}
        disabled={loadingButton}
      >
        <Text style={[styles.PrimaryButtonText]}>Participando</Text>
      </Button>
    )

  return (
    <Button
      style={[styles.Button, styles.SecondaryButton]}
      onPress={() => toggleAttendEvent(event.id)}
      disabled={loadingButton}
    >
      <Text style={[styles.SecondaryButtonText]}>Participar</Text>
    </Button>
  )
}

export default EventDetailsButton

const styles = StyleSheet.create({
  SkeletonText: {
    opacity: 0,
  },
  Button: {
    marginLeft: 'auto',
    height: 34,
    paddingVertical: 0,
  },
  PrimaryButton: {
    backgroundColor: Colors.primaryColor,
  },
  PrimaryButtonText: {
    color: Colors.background,
  },
  SecondaryButton: {
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  SecondaryButtonText: {
    color: Colors.primaryColor,
  },
})
