import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../../screens/authScreens/SignUp';
import { authStackInfo } from '../../lib/dTypes/routeDataType';
import LoginScreen from '../../screens/authScreens/LoginScreen';
const AuthStack = createStackNavigator();

const authStackScreensInfo: authStackInfo[] = [
    { name: 'LoginScreen', component: LoginScreen, hasHeader: false, title: 'লগিন পেইজ', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
    { name: 'SignUpScreen', component: SignUpScreen, hasHeader: false, title: 'সাইন আপ পেইজ', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff',}
  ];

interface AuthenticationRouteProps {}

const AuthenticationRoute = (props: AuthenticationRouteProps) => {
  return (
    <AuthStack.Navigator>
      {authStackScreensInfo.map((item, index) => (
        <AuthStack.Screen
          name={item.name}
          component={item.component} 
          key={index}
          options={{
            title: item.title,
            headerShown: item.hasHeader,
            headerStyle: {
              backgroundColor: item.backgroundColor,
              height: item.height,
            },
            headerTintColor: item.headerTintColor,
            headerTitleStyle: {
              fontFamily: item.fontFamily,
            },
          }}
        />
      ))}
    </AuthStack.Navigator>
  );
};

export default AuthenticationRoute;

