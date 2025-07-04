import { createStackNavigator } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import AdminHome from '../../screens/Admin/AdminHome';
const AdminNav = createStackNavigator();

const AdminStackData = [
  {id:1, name:'AdminHome', component:AdminHome, hasHeader:true, title: 'এডমিন হোম পেইজ', height:60, backgroundColor: '#0B2447', fontFamily:'HindSiliguri-SemiBold', headerTintColor: '#fff'}, 
];
interface AdminNavigatorProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}
const AdminNavigator:React.FC<AdminNavigatorProps> = ({ navigation, route }) => {
  
  return (
    
      <AdminNav.Navigator>
        {AdminStackData.map((item, index)=>{
            return(
            <AdminNav.Screen 
                name={item.name}
                component={item.component} 
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
    </AdminNav.Navigator>
  );
}

export default AdminNavigator;

