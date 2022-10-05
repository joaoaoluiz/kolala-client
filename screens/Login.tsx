import React, { useEffect } from 'react'
import { Image, StyleSheet } from 'react-native'
import Text from '../components/Text/Text'
import View from '../components/View/View'
import logo from '../assets/images/logo.png'
import Colors from '../constants/Colors'
import GoogleAuthButton from '../components/AuthButton/GoogleAuthButton'
import FacebookAuthButton from '../components/AuthButton/FacebookAuthButton'
import Span from '../components/Span/Span'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectToken } from '../store/tokenSlice'
import { loginWithToken } from '../components/AuthButton/api'
import { setUser } from '../store/userSlice'
import { useSecureStore } from '../store/useSecureStore'
import { useCookies } from 'react-cookie'

function Login() {
  const TokenSecureStore = useSecureStore()
  const { token } = useAppSelector(selectToken)
  const dispatch = useAppDispatch()
  const [_, setCookie] = useCookies(['bearear-token'])

  useEffect(() => {
    async function tryStoredToken() {
      const token = await TokenSecureStore.get()

      if (token) {
        setCookie('bearear-token', token)

        const response = await loginWithToken()
        const { user } = response.data?.data || {}
        if (user) {
          const { profile, ...account } = user
          dispatch(
            setUser({
              account,
              profile,
            })
          )
        }
      }
    }

    // if (!token || 1) tryStoredToken()
  }, [token])

  return (
    <View style={style.View}>
      <Image style={style.marginBottom} source={logo} />
      <Text style={style.Title}>kolala</Text>
      <Text style={style.Description}>seu minimapa da vida real</Text>
      <Span style={style.Button}>
        <GoogleAuthButton />
      </Span>
      <FacebookAuthButton />
    </View>
  )
}

const style = StyleSheet.create({
  View: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingBottom: '20%',
  },
  Title: {
    color: Colors.secondaryColor,
    fontWeight: '600',
    fontSize: 30,
  },
  Description: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  marginBottom: {
    marginBottom: 10,
  },
  Button: {
    width: '100%',
    marginBottom: 22,
  },
})

export default Login
