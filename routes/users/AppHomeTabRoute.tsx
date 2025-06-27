import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import UserHomeScreen from '../../screens/userScreens/UserHomeScreen';
import Icons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import Message from '../../screens/userScreens/NewStuInfoByTeacher';
import AppContextProvider from '../../contexts/AppContext';

const Tab = createBottomTabNavigator();

interface TabInfo {
  route: string;
  label: string;
  title?: string;
  component: React.ComponentType<any>;
  activeIcon: string;
  inactiveIcon: string;
  hasHeader: boolean;
}

const tabInfo: TabInfo[] = [
  { route: 'UserHomeScreen', 
    label: 'Home', 
    component: UserHomeScreen, 
    activeIcon: 'home', 
    inactiveIcon: 'home-outline', 
    hasHeader: false 
  },
  { route: 'Notices', 
    label: 'Notices', 
    title: 'নোটিস বোর্ড', 
    component: Message, 
    activeIcon: 'chatbox', 
    inactiveIcon: 'chatbox-outline', 
    hasHeader: true 
  }
];

const TabBarButton: React.FC<BottomTabBarButtonProps & { item: TabInfo }> = ({ item, onPress, accessibilityState }) => {
  const focused = accessibilityState?.selected ?? false;
  const animatedIconViewRef = useRef<Animatable.View & View>(null);

  useEffect(() => {
    if (focused) {
      animatedIconViewRef.current?.animate({
        0: { scale: 0.8, rotate: '0deg' },
        1: { scale: 1.5, rotate: '360deg' }
      });
    } else {
      animatedIconViewRef.current?.animate({
        0: { scale: 1.5, rotate: '360deg' },
        1: { scale: 0.8, rotate: '0deg' }
      });
    }
  }, [focused]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Animatable.View
        ref={animatedIconViewRef}
        duration={200}
        style={styles.iconContainer}
      >
        <Icons name={item.activeIcon} color={focused ? '#ddd' : 'rgba(54, 80, 76, 0.85)'} size={35} />
      </Animatable.View>
    </TouchableOpacity>
  );
};

const AppHomeTabRoute: React.FC = () => {

  return (
    <AppContextProvider>
    <Tab.Navigator
      //initialRouteName="Notices"
      screenOptions={{
        tabBarActiveTintColor: '#ddd',
        tabBarStyle: {
          height: 70,
          backgroundColor: '#0B2447',
        },
        headerStyle: {
          backgroundColor: '#0B2447'
        },
        headerTitleStyle: {
          fontFamily: 'HindSiliguri-SemiBold',
        }
      }}
    >
      {tabInfo.map((item, index) => (
        <Tab.Screen
          name={item.route}
          component={item.component}
          //initialParams={{ userData }} // Pass userData here
          key={index}
          options={{
            headerTitleAlign: 'center',
            tabBarLabel: item.label,
            tabBarShowLabel: false,
            headerShown: item.hasHeader,
            headerTitle: item.title,
            headerTintColor: '#FFF',
            tabBarIcon: ({ focused, color, size }) => (
              <Icons name={focused ? item.activeIcon : item.inactiveIcon} color={color} size={30} />
            ),
            tabBarButton: (props) => <TabBarButton {...props} item={item} />
          }}
        />
      ))}
    </Tab.Navigator>
    </AppContextProvider>
  );
};

export default AppHomeTabRoute;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});
