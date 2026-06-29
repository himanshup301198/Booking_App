import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen    from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import SuccessScreen from '../screens/SuccessScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="Home"    component={HomeScreen}    />
    <Stack.Screen name="Booking" component={BookingScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="Success" component={SuccessScreen} options={{ gestureEnabled: false }} />
  </Stack.Navigator>
);

export default AppNavigator;