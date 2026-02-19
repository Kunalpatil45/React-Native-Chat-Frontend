import { AuthProvider } from '@/contexts/authContext'
import { Stack } from 'expo-router'
import React from 'react'

const StackLayout = () => {
  return <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name='(main)/profileModels' options={{presentation:"modal"}} />
  </Stack>

}

const RootLayout = ()=> {
    return(
        <AuthProvider>
            <StackLayout/>
        </AuthProvider>
    )
}
export default RootLayout;