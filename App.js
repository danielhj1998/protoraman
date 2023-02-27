import React from 'react';
import {View, StyleSheet} from 'react-native';
import Router from '@app/screens/Router';
import { MenuProvider } from 'react-native-popup-menu';

const App = () => {
  return (
    <MenuProvider>
      <Router />
    </MenuProvider>
  );
};

export default App;
