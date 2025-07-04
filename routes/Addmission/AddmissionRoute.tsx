import { createStackNavigator } from '@react-navigation/stack';
import AdmissionHome from '../../screens/admission/AdmissionHome';
import ParentsAndContact from '../../screens/admission/ParentsAndContact';
import AdmissionContextProvider from '../../contexts/AdmissionContext';
import CheckAllDataAndSubmit from '../../screens/admission/CheckAllDataAndSubmit';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import CheckNewData from '../../screens/admission/CheckNewData';
const AddmissionNav = createStackNavigator();

const AddmissionStackData = [
  {id:1, name:'CheckNewData', component:CheckNewData, hasHeader:true, title: 'নতুন শিক্ষার্থীর তথ্য যাচাই', height:60, backgroundColor: '#0B2447', fontFamily:'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {id:2, name:'AdmissionHome', component:AdmissionHome, hasHeader:true, title: 'নতুন শিক্ষার্থীর তথ্য ফরম', height:60, backgroundColor: '#0B2447', fontFamily:'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {id:3, name:'ParentsAndContact', component:ParentsAndContact, hasHeader:true, title: 'নতুন শিক্ষার্থীর তথ্য ফরম', height:60, backgroundColor: '#0B2447', fontFamily:'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {id:4, name:'CheckAllDataAndSubmit', component:CheckAllDataAndSubmit, hasHeader:true, title: 'তথ্য যাচাই ও পাঠানো', height:60, backgroundColor: '#0B2447', fontFamily:'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  
];
interface AddmissionNavigatorProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}
const AddmissionNavigator:React.FC<AddmissionNavigatorProps> = ({ navigation, route }) => {
  
  return (
      <AdmissionContextProvider>
      <AddmissionNav.Navigator>
      {AddmissionStackData.map((item, index)=>{
        return(
          <AddmissionNav.Screen 
          name={item.name}
          component={item.component} // Passing data to BottomTabNavigator
          initialParams={route.params}
          key={index}
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
    </AddmissionNav.Navigator>
    </AdmissionContextProvider>
  );
}

export default AddmissionNavigator;

