import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider }  from './src/context/AppContext';
import AppNavigator     from './src/navigation/AppNavigator';

const App = () => (
  <AppProvider>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  </AppProvider>
);

export default App;