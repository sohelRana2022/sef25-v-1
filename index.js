

import React from 'react';
import { AppRegistry } from 'react-native';
import {MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import App from './App';
import { theme as baseTheme } from './lib/themes/theme';
export default function Main() {
const theme = {
  ...baseTheme,
  customProperties: {
    ...baseTheme.customProperties
  },
};

  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);