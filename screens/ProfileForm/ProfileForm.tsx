import { useNavigationState } from '@react-navigation/native'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet } from 'react-native'
import Button from '../../components/Button/Button'
import Header from '../../components/Header/Header'
import Label from '../../components/Label/Label'
import SafeAreaView from '../../components/SafeAreaView/SafeAreaView'
import Scroll from '../../components/Scroll/Scroll'
import Span from '../../components/Span/Span'
import Text from '../../components/Text/Text'
import TextInput from '../../components/TextInput/TextInput'
import Colors from '../../constants/Colors'
import User, { IUserUpdateProfileConfig } from '../../Models/User'
import { REACT_APP_SERVER } from '../../services/api'
import { RootStackParamList } from '../../types'
import { IProfile } from '../../types/Profile'
import { showToast } from '../../utils/toast'
import PictureButton from './components/PictureButton'
import SocialMediaInput from './components/SocialMediaInput'

export type ProfileFormEvent = Partial<IProfile>

function makeFormData(data: ProfileFormEvent, formData: FormData) {
  Object.entries(data).forEach(([key, value]) => {
    switch (key) {
      case 'picture':
        if (typeof value === 'string') {
          const isHosted = value.includes(REACT_APP_SERVER)
          if (isHosted) return

          let uriArray = value.split('.')
          let fileType = uriArray[uriArray.length - 1]

          const file: any = {
            uri: value,
            name: `${data.name}.${fileType}`,
            type: `image/${fileType}`,
          }
          formData.append(key, file)
          return
        }
        return
      default:
        formData.append(key, value as any)
        return
    }
  })
}

function ProfileForm() {
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const { profile } = useNavigationState(
    state =>
      state.routes.find(item => item.name === 'ProfileForm')
        ?.params as RootStackParamList['ProfileForm']
  )

  const { control, handleSubmit } = useForm<ProfileFormEvent>({
    defaultValues: profile,
  })

  async function onSubmit(data: ProfileFormEvent) {
    const formData = new FormData()
    makeFormData(data, formData)

    setLoadingSubmit(true)
    const config: IUserUpdateProfileConfig = {
      body: formData,
      id: profile.id,
    }
    try {
      await User.updateProfile(config)
    } catch (err) {
      showToast('Ocorreu um problema')
      console.log(err)
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <Scroll style={styles.Container}>
      <SafeAreaView>
        <Header>
          <Header.Title>Editar perfil</Header.Title>
        </Header>
        <Span style={styles.Row}>
          <PictureButton name='picture' profile={profile} />
        </Span>
        <Span>
          <Label>Nome</Label>
          <TextInput
            name='name'
            control={control}
            placeholder='Como outros irão te chamar'
          />
        </Span>
        <Label>Outras redes sociais</Label>
        <SocialMediaInput
          control={control}
          name='instagramAccount'
          icon='instagram'
          placeholder='Seu usuário do instagram'
        />
        <SocialMediaInput
          control={control}
          name='twitterAccount'
          icon='twitter'
          placeholder='Seu usuário do twitter'
        />
        <SocialMediaInput
          control={control}
          name='facebookAccount'
          icon='facebook'
          placeholder='Seu usuário do facebook'
        />
        <Button
          style={styles.SubmitButton}
          onPress={handleSubmit(onSubmit)}
          loading={loadingSubmit}
        >
          <Text style={styles.SubmitButtonText}>Salvar</Text>
        </Button>
      </SafeAreaView>
    </Scroll>
  )
}

export default ProfileForm

const styles = StyleSheet.create({
  Container: {
    height: '100%',
    flex: 1,
    backgroundColor: Colors.background,
  },
  Row: {
    position: 'relative',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 18,
  },

  SubmitButton: {
    marginTop: 15,
    marginLeft: 'auto',
    paddingHorizontal: 25,
  },
  SubmitButtonText: {
    color: Colors.altText,
    fontWeight: 'bold',
  },
})
