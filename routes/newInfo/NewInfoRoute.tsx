import { createStackNavigator } from '@react-navigation/stack';
import NewStuInfoScreen from '../../screens/newInfoScreens/NewStuInfoScreen';
import NewStudentDataDetailScreen from '../../screens/newInfoScreens/NewStudentDataDetailScreen';
import AddNewStudent from '../../screens/newInfoScreens/AddNewStudent';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { THEME } from '../../lib/configs/Theme';
import { RouteProp } from '@react-navigation/native';
const NewInfoNav = createStackNavigator();

interface NewInfoNavigatorProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const NewInfoNavStackData = [
    {id:1, name:'NewStuInfoScreen', component:NewStuInfoScreen, hasHeader:true, title: 'নতুন তথ্য অনুসন্ধান', height:60, backgroundColor: THEME.PageBackgroundColorPrimary, fontFamily:'HindSiliguri-SemiBold', headerTintColor: '#fff'},
    {id:2, name:'NewStudentDataDetailScreen', component:NewStudentDataDetailScreen, hasHeader:true, title: 'নতুন শিক্ষার্থী', height:60, backgroundColor: '#0B2447', fontFamily:'HindSiliguri-SemiBold', headerTintColor: '#fff'},
    
];

const NewInfoNavigator:React.FC<NewInfoNavigatorProps> = ({ navigation, route }) => {
  
  return (
    
      <NewInfoNav.Navigator>
      {NewInfoNavStackData.map((item, index)=>{
        return(
          <NewInfoNav.Screen 
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
    </NewInfoNav.Navigator>
  );
}

export default NewInfoNavigator;

