import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
  Text
} from 'react-native';
import UserHomeHeader from '../../comps/headers/UserHomeHeader';
import MenuList from '../../comps/homeScreen/MenuList';
import { theme } from '../../lib/themes/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAuthContexts } from '../../contexts/AuthContext';
import Carousel from 'react-native-reanimated-carousel';
import axios from 'axios';
import { IMG_API, SLIDERS_API } from '../../apis/config';
import { useAppContexts } from '../../contexts/AppContext';

export interface MenuItemType {
  id: number;
  menuTitle: string;
  icon: string;
  route: string;
  routeStatus: boolean;
}

export interface MenuBlockType {
  id: number,
  title: string;
  data: MenuItemType[];
}

import {
  newStuDataManagement,
  resultManagementHigh,
  resultManagementPrimary,
  studentManagement,
  UserManagement
} from '../../lib/jsonValue/MenuData';

interface slidersType {
  id: string;
  sliderName: string;
  sliderId: string;
}

type UserHomeScreenRouteProp = RouteProp<{
  UserHomeScreen: {
    userData: {
      branch: string;
      contact: number;
      email: string;
      id: string;
      imageId: string;
      role: string;
      teaClass: string;
      userName: string;
    };
  };
}, 'UserHomeScreen'>;

interface UserHomeScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: UserHomeScreenRouteProp;
}
const { width } = Dimensions.get('window');



const UserHomeScreen: React.FC<UserHomeScreenProps> = ({ navigation, route }) => {
  const {loader,  setLoader } = useAppContexts();
  const { user } = useAuthContexts();
  const [sliders, setSliders] = useState<slidersType[]>([]);
  const [imageLoadingMap, setImageLoadingMap] = useState<Record<string, boolean>>({});
  const handleImageLoadStart = (id: string) => {
    setImageLoadingMap(prev => ({ ...prev, [id]: true }));
  };

  const handleImageLoadEnd = (id: string) => {
    setImageLoadingMap(prev => ({ ...prev, [id]: false }));
  };



 const renderItem = ({ item }: { item: slidersType }) => {
    const isLoading = imageLoadingMap[item.id];

    return (
      <View style={styles.carouselItem}>
        <Image
          source={{ uri: `${IMG_API}${item.sliderId}` }}
          resizeMode="cover"
          style={styles.carouselImage}
          onLoadStart={() => handleImageLoadStart(item.id)}
          onLoadEnd={() => handleImageLoadEnd(item.id)}
        />
        {isLoading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
    );
  };




  const isPrimary = user?.relatedClass
    ? ['Play', 'Nursery', 'One', 'Two', 'Three', 'Four', 'Five'].includes(user.relatedClass)
    : false;

  const isHigh = user?.relatedClass
    ? ['Six', 'Seven', 'Eight', 'Nine', 'Ten'].includes(user.relatedClass)
    : false;

  const getSliders = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${SLIDERS_API}`);
      if (res.data) {
        setSliders(res.data.response);
      }
    } catch (err) {
      // Handle error
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getSliders();
  }, []);

//UserManagement
  const menuBlocks: MenuBlockType[] = user?.isApproved
    ? [
        {id:1, title: 'আমার শিক্ষার্থী', data: studentManagement },
      ...(user.role == 'admin' ? [{id:2, title: 'ব্যবহারকারী নিয়ন্ত্রণ', data: UserManagement }] : []),
      ...(user.role !== 'admin' ? [{id:3, title: 'নতুন শিক্ষার্থী', data: newStuDataManagement }]:[]),
      ...((isPrimary || user.role == 'admin') ? [{id:4, title: 'ডাউনলোড', data:  resultManagementPrimary}] : []),
      ...((isHigh || user.role == 'admin') ? [{id:5, title: 'ফলাফল', data: resultManagementHigh }] : []),
      ]
    : [];


 
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.statusBarColor}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      
      <UserHomeHeader navigation={navigation} route={route} />
                        
      <View style={styles.carouselContainer}>
        <Carousel
          autoPlay
          autoPlayInterval={2000}
          data={sliders}
          loop
          pagingEnabled
          snapEnabled
          width={width}
          height={200}
          style={{ width }}
          mode='parallax'
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          renderItem={renderItem}
        />
      </View>

      <FlatList
       data={menuBlocks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: MenuBlockType }) => (
          <MenuList
            menuTitle={item.title}
            menuData={item.data}
            navigation={navigation}
            route={route}
          />

        )}
        ListFooterComponent={
          !user?.isApproved ? (
            <View style={{justifyContent:'center', alignItems:'center'}}>
              <Text className='text-gray-500 font-HindSemiBold text-base text-justify px-10 py-10'>আপনার একাউন্টটি এপ্রোভ করার জন্য কর্তৃপক্ষের সাথে যোগাযোগ করুন!</Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

export default UserHomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  carouselContainer: {
    width: '100%',
    height: 200,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.8)',
    zIndex:100
  }
});
