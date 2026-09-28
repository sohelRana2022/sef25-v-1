import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {useAuthContexts} from '../../contexts/AuthContext';

type MenuItem = {
  id: number;
  menuTitle: string;
  icon: string;
  route: string;
  screen?: string;
  routeStatus: boolean;
  adminOnly?: boolean;
};

type MenuListProps = {
  menuTitle: string;
  menuData: MenuItem[];
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
  options?: {};
  back?: () => void;
};

const MenuList = ({navigation, menuData, menuTitle}: MenuListProps) => {
  const {user} = useAuthContexts();

  const filteredMenuData = menuData.filter(item => {
    if (!item.routeStatus) {
      return false;
    }

    if (item.adminOnly) {
      return user?.role === 'admin';
    }

    return true;
  });

  const handleMenuPress = (item: MenuItem) => {
    if (item.screen) {
      navigation.navigate(item.route, {
        screen: item.screen,
        params: {
          ref_uid: user?.uid,
        },
      });

      return;
    }

    navigation.navigate(item.route, {
      ref_uid: user?.uid,
    });
  };

  return (
    <View style={styles.MenuContainer}>
      <Text style={styles.menuTitle}>{menuTitle}</Text>

      <FlatList
        data={filteredMenuData}
        numColumns={4}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleMenuPress(item)}
            style={styles.menuButton}>
            <View style={styles.menu}>
              <Icons style={styles.menuIcon} name={item.icon} color="#FFF" />

              <Text style={styles.menuName}>{item.menuTitle}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MenuList;

const styles = StyleSheet.create({
  MenuContainer: {
    paddingTop: 15,
    paddingHorizontal: 50,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: '#FFF',
  },

  menuTitle: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'HindSiliguri-SemiBold',
    borderBottomWidth: 1.5,
    textAlign: 'left',
    borderBottomColor: '#ddd',
    paddingBottom: 5,
    marginBottom: 10,
  },

  menuButton: {
    width: 70,
    height: 70,
    marginLeft: -10,
    marginRight: 10,
  },

  menu: {
    alignItems: 'center',
    paddingVertical: 5,
  },

  menuIcon: {
    fontSize: 30,
    color: '#999',
  },

  menuName: {
    textAlign: 'center',
    fontSize: 12,
    paddingTop: 5,
    fontFamily: 'HindSiliguri-SemiBold',
    color: '#999',
  },
});
