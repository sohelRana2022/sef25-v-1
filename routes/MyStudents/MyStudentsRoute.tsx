import { createStackNavigator } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { THEME } from '../../lib/configs/Theme';
import { RouteProp } from '@react-navigation/native';
import AppContextProvider from '../../contexts/AppContext';
import SearchScreen from '../../screens/userScreens/SearchScreen';
const MyStudentsStack = createStackNavigator();

interface MyStudentsRouteDataProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const MyStudentsRouteData = [
    {id:1, name:'SearchScreen', component: SearchScreen, hasHeader:true, title: 'আপনার শিক্ষার্থী', height:60, backgroundColor: THEME.PageBackgroundColorPrimary, fontFamily:'HindSiliguri-SemiBold', headerTintColor: '#fff'}
];

const MyStudentsRoute:React.FC<MyStudentsRouteDataProps> = ({ navigation, route }) => {
  
  return (
    <AppContextProvider>
      <MyStudentsStack.Navigator>
      {MyStudentsRouteData.map((item, index)=>{
        return(
          <MyStudentsStack.Screen 
          name={item.name}
          component={item.component} 
          key={item.id}
          options={{
            title: item.title,
            headerShown:item.hasHeader,
            headerStyle: {
              backgroundColor: item.backgroundColor,
              height:item.height,
            },
            headerTintColor: item.headerTintColor,
            headerTitleStyle: {
              fontFamily:item.fontFamily
            },
          }}

        /> 
        )
      })}
    </MyStudentsStack.Navigator>
    </AppContextProvider>
  );
}

export default MyStudentsRoute;

