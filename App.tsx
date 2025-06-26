import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import AuthContextProvider from './contexts/AuthContext';
import Main from './routes/MainRoute';
import BootSplash from "react-native-bootsplash";
type hide = (config?: { fade?: boolean }) => Promise<void>;
const App = () => {

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, []);

  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <AuthContextProvider>
      <Main />
    </AuthContextProvider>
  </GestureHandlerRootView>
  );
};

export default App;