import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewStuInfoScreen from '../../screens/newInfoScreens/NewStuInfoScreen';
import NewStudentDataDetailScreen from '../../screens/newInfoScreens/NewStudentDataDetailScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { THEME } from '../../lib/configs/Theme';

// Step 1: Define the param list
export type NewInfoStackParamList = {
  NewStuInfoScreen: undefined;
  NewStudentDataDetailScreen: { ref_uid: string };
};

// Step 2: Use the param list with the navigator
const NewInfoNav = createStackNavigator<NewInfoStackParamList>();

interface NewInfoNavigatorProps {
  navigation: NativeStackNavigationProp<NewInfoStackParamList>;
  route: RouteProp<NewInfoStackParamList, keyof NewInfoStackParamList>;
}

// Step 3: Define the route data
const NewInfoNavStackData = [
  {
    id: 1,
    name: 'NewStuInfoScreen',
    component: NewStuInfoScreen,
    hasHeader: true,
    title: 'নতুন তথ্য অনুসন্ধান',
    height: 60,
    backgroundColor: THEME.PageBackgroundColorPrimary,
    fontFamily: 'HindSiliguri-SemiBold',
    headerTintColor: '#fff',
  },
  {
    id: 2,
    name: 'NewStudentDataDetailScreen',
    component: NewStudentDataDetailScreen,
    hasHeader: true,
    title: 'নতুন শিক্ষার্থী',
    height: 60,
    backgroundColor: '#0B2447',
    fontFamily: 'HindSiliguri-SemiBold',
    headerTintColor: '#fff',
  },
];

// Step 4: Render the navigator
const NewInfoNavigator: React.FC<NewInfoNavigatorProps> = () => {
  return (
    <NewInfoNav.Navigator>
      {NewInfoNavStackData.map((item) => (
        <NewInfoNav.Screen
          name={item.name as keyof NewInfoStackParamList}
          component={item.component}
          key={item.id}
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
    </NewInfoNav.Navigator>
  );
};

export default NewInfoNavigator;
