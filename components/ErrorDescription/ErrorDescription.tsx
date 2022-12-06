import React, { ReactNode } from 'react'
import { FieldError } from 'react-hook-form'
import Span from '../Span/Span'
import Text from '../Text/Text'
import { StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

function ErrorDescription({ error }: { error: FieldError | undefined }) {
  return (
    <Span style={styles.Container}>
      <Text style={styles.Text}>{error?.message}</Text>
    </Span>
  )
}

export default ErrorDescription

const styles = StyleSheet.create({
  Text: {
    color: Colors.red,
    fontStyle: 'italic',
    fontSize: 16,
    fontWeight: '300',
  },
  Container: {
    paddingTop: 2,
    paddingBottom: 6,
  },
})
