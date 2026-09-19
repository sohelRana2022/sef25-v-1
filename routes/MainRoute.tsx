import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainAppStack from '../routes/MainAppHome/MainAppStack';
import AuthenticationRoute from './Authentication/AuthenticationRoute';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useAuthContexts} from '../contexts/AuthContext';
import AppLauncher from '../comps/activityLoder/AppLauncher';
import {View} from 'react-native';

const Main: React.FC = () => {
  const [initializing, setInitializing] = useState(true);
  const {user, setUser} = useAuthContexts();

  const stateChanged = async (currentUser: FirebaseAuthTypes.User | null) => {
    try {
      // User is logged in
      if (currentUser) {
        const userDoc = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .get();

        if (userDoc.exists) {
          const data = userDoc.data();

          if (data) {
            const userData = {
              uid: currentUser.uid,
              nameBang: data.nameBang ?? '',
              nameEng: data.nameEng ?? '',
              contact: String(data.contact ?? ''),
              title: data.title ?? '',
              role: data.role ?? '',
              branch: data.branch ?? '',
              isApproved: data.isApproved ?? false,
              imageId: data.imageId ?? '',
              relatedClass: data.relatedClass ?? '',
              email: data.email ?? currentUser.email ?? '',
              password: String(data.password ?? ''),
            };

            setUser(userData);
          } else {
            setUser(null);
          }
        } else {
          // Firebase Auth user exists,
          // but Firestore user document doesn't exist.
          setUser(null);
        }
      } else {
        // User is logged out
        setUser(null);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(stateChanged);

    return subscriber;
  }, []);

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <AppLauncher />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainAppStack /> : <AuthenticationRoute />}
    </NavigationContainer>
  );
};

export default Main;
