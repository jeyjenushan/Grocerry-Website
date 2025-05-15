/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { View } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './Screens/AppNavigatorScreen';




function App(): React.JSX.Element {


  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}



export default App;
