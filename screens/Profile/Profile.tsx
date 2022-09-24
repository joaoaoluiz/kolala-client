import React, { useEffect, useRef, useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import Header from '../../components/Header/Header'
import SafeAreaView from '../../components/SafeAreaView/SafeAreaView'
import { useAppSelector } from '../../store/hooks'
import { selectUser } from '../../store/userSlice'
import blankProfile from '../../assets/images/blank-profile.png'
import Span from '../../components/Span/Span'
import Text from '../../components/Text/Text'
import { IProfile } from '../../types/Profile'
import { getProfile } from './api'
import { RootStackScreenProps, RootTabParamList } from '../../types'
import LogoutButton from '../../components/LogoutButton/LogoutButton'
import useLogout from '../../hooks/useLogout'

interface IProps {
  profileUserId: number
}

function Profile({ route, navigation }: RootStackScreenProps<'Profile'>) {
  const { profileUserId } = route?.params
  const user = useAppSelector(selectUser)
  const logout = useLogout()

  const isOwnProfile = useRef(profileUserId === user.profile?.id).current
  const [profileUser, setProfileUser] = useState<IProfile | null>(null)

  useEffect(() => {
    if (isOwnProfile) {
      setProfileUser(user.profile)
      return
    }

    getProfileUser(profileUserId)

    async function getProfileUser(id: number) {
      try {
        const response = await getProfile(id)
        const profile = response.data.data

        if (profile) setProfileUser(profile)
      } catch (err) {
        console.error(err)
      }
    }
  }, [])

  return (
    <SafeAreaView>
      <Header>Perfil</Header>
      <Span style={styles.topContainer}>
        <Span style={styles.row}>
          <Span style={styles.pictureWrapper}>
            <Image
              style={styles.picture}
              source={
                profileUser?.picture
                  ? { uri: profileUser.picture }
                  : blankProfile
              }
            />
          </Span>
          <Span style={styles.logoutWrapper}>
            <Span style={styles.logout}>
              <LogoutButton onPress={logout} />
            </Span>
          </Span>
        </Span>
        <Text style={styles.title}>{profileUser?.name}</Text>
        {!!(isOwnProfile && user.account?.email) && (
          <Text>{user.account?.email}</Text>
        )}
      </Span>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  row: {
    position: 'relative',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  topContainer: {
    alignItems: 'center',
  },
  picture: {
    aspectRatio: 1,
    resizeMode: 'contain',
    width: 150,
    height: 150,
  },
  pictureWrapper: {
    borderRadius: 99999,
    overflow: 'hidden',
    marginLeft: 'auto',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  logoutWrapper: {
    marginLeft: 'auto',
    height: 53,
  },
  logout: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
})

export default Profile