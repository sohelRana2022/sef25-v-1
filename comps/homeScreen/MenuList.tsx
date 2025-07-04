import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import { useAuthContexts } from '../../contexts/AuthContext';

type MenuItem = {
  id: number;
  menuTitle: string;
  icon: string;
  route: string;
  routeStatus: boolean;
};

type  MenuListProps = {
  menuTitle: string,
  menuData: MenuItem[];
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;  
  options?:{},
  back?:()=> void,
}


const MenuList = (props: MenuListProps) => {
  const { user } = useAuthContexts();
  const {navigation, menuData, menuTitle}=props;

  return (
    <View style={styles.MenuContainer}>
      <Text style={styles.menuTitle}>{menuTitle}</Text>
      <FlatList 
        data={menuData}
        numColumns={4}
        renderItem={({item, index})=>{
          return (
          <TouchableOpacity 
              onPress={()=> item.routeStatus && (user?.role === "editor" || user?.role === "admin") ? navigation.navigate(item.route,{ref_uid:user.uid}) : null} 
              key={item.id} 
              style={styles.menuButton}
          >
              <View style={styles.menu}>
                <Icons style={styles.menuIcon} name={item.icon} color={'#FFF'} />
                <Text style={styles.menuName}>{item.menuTitle}</Text>
              </View>
          </TouchableOpacity>
          )
        }}
      />
    </View>
  );
};

export default MenuList;

const styles = StyleSheet.create({
  MenuContainer:{
    paddingTop: 15,
    paddingHorizontal:50,
    flexDirection:'column',
    width:'100%',
    backgroundColor:'#FFF'
  },
  menuTitle:{
    color:'#666', 
    fontSize:14,
    fontFamily:'HindSiliguri-SemiBold',
    borderBottomWidth:1.5,
    textAlign:'left',
    borderBottomColor:'#ddd',
    paddingBottom: 5,
    marginBottom:10,

  },
  menuButton: {
    width:70,
    height:70,
    marginLeft:-10,
    marginRight:10
  },
  menu:{
    display:'flex',
    alignItems: 'center',
    paddingVertical:5
  },
  menuIcon:{
    fontSize:30, 
    color:'#999'
  },
  menuName:{
    textAlign:'center', 
    fontSize:12, 
    paddingTop:5,
    fontFamily:'HindSiliguri-SemiBold', 
    color:'#999'
  }
});
