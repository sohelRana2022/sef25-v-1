import React, { useEffect, useState, useMemo } from 'react';
import { Linking, View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import CustomActivityIndicator from '../../comps/activityLoder/CustomActivityIndicator';
import Icon from 'react-native-vector-icons/AntDesign';
import UserIcon from 'react-native-vector-icons/FontAwesome5';
import { width, height, HEIGHT } from '../../lib/configs/Dimensions';
import { THEME } from '../../lib/configs/Theme';
import {STDB_API} from '../../apis/config';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { useAppContexts } from '../../contexts/AppContext';
import { useAuthContexts } from '../../contexts/AuthContext';
import LoaderAnimation from '../../comps/activityLoder/LoaderAnimation';

const ITEM_HEIGHT = 125;

interface SearchScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

interface StudentInfo {
examName: string, 
father_name_bn: string, 
mother_name_bn: string,
roll: number, 
section: string,
stu_religion: string,
stu_class: string,
stu_gender: string,
stu_id: string,
stu_name_bn: string,
sub_4?: string,
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  const [netStatus, setNetStatus] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<StudentInfo[]>([]);
  const { loader, setLoader } = useAppContexts();
  const {user} = useAuthContexts();

  const getData = async () => {
    setLoader(true);
    try {
      const reqBody = {
                      "userRole": user?.role,
                      "userClass": user?.relatedClass,
                      "operation": "get",
                      "payload": { }
                    };
      const res = await axios.post(`${STDB_API}`, reqBody, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(res.data.data)
      if (res.data) {
        setData(res.data.data);
      }
    } catch (err) {
      setNetStatus(true)
    } finally {
      setLoader(false); // Ensure the loader is always stopped
    }
  };
  

  useEffect(() => {
    getData();
  }, []);


  const filteredData = useMemo(() => {
    const searchWords = searchText.toLowerCase().trim().split(/\s+/);
    return data.filter((r) =>
          searchWords.every((word) =>
            Object.values(r)
              .join(' ')
              .toLowerCase()
              .includes(word)
          )
        );
  }, [searchText, data]);

  const renderItem = ({ item }: { item: StudentInfo }) => (
    <Card style={styles.NewSearchDataCard}>
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
          <UserIcon name={'user-alt'} color={'rgba(16, 36, 33, 0.6)'} size={50} />
        </View>
        <View style={{ width: '80%', alignItems: 'flex-start', justifyContent: 'center', padding: 10 }}>
          <Text style={styles.cardText}>{`${item.roll}. ${item.stu_name_bn}`}</Text>
          <Text style={styles.cardText}>{`${item.stu_class} | ${item.section}`}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopColor: '#000', borderTopWidth: 2 }}>
        <TouchableOpacity style={styles.callBtn} activeOpacity={0.5} onPress={() => Linking.openURL(`tel:0${1740096832}`)}>
          <Icon name={'phone'} color={'rgba(16, 36, 33, 1)'} size={30} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.callBtn} activeOpacity={0.5} onPress={() => console.log('')}>
          <Icon name={'message1'} color={'rgba(16, 36, 33, 1)'} size={30} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreTxt} activeOpacity={0.5} onPress={() => navigation.navigate('StudentDetails', {...route.params, item})}>
          <Icons name={'information-circle-outline'} size={35} color={'rgba(16, 36, 33, 1)'} />
        </TouchableOpacity>
      </View>
    </Card>
  );
  
  return (
    
    <View style={styles.container}>     
      <View style={{ height: 70, alignItems: 'center' }}>
        <View style={styles.searchContainer}>
          <View style={{ width: '10%' }}>
            <Icons name={'search'} style={styles.searchIcon} />
          </View>
          <View style={{ width: '70%', height: HEIGHT.InputHeightSecondary }}>
            <TextInput
              value={searchText}
              placeholder={'অনুসন্ধান করুন ...'}
              onChangeText={(val)=>setSearchText(val)}
              placeholderTextColor={'rgba(16, 36, 33, 0.6)'}
              underlineColorAndroid="transparent"
              selectionColor={'rgba(0, 0, 0, 0.5)'}
              style={[styles.searchInput, { color: 'rgba(16, 36, 33, 1)' }]}
            />
          </View>
          <View style={styles.searchCountContainer}>
            <Text style={styles.searchCountText}>{filteredData?.length ? filteredData.length : ''}</Text>
          </View>
        </View>
      </View>

      
        {
          netStatus ? 
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
           <Text style={{color:'#444', fontFamily:'HindSiliguri-SemiBold',fontSize:20, paddingBottom:20}}>নেটওয়ার্ক কানেকশন সমস্যা!</Text>
            <Image
              source={require('../../assets/images/disconnect.png')}
              style={{width:200, height:200, }}
              resizeMode='contain'
            />
            

          </View> : 
          


          <FlatList
            data={searchText=== '' ? data : filteredData}
            initialNumToRender={50}
            maxToRenderPerBatch={50}
            windowSize={10}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
          />
        }
        {loader && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text className='text-base text-[#666] pt-5'>Wait! data loading .....</Text>
              </View>
            )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
    position: 'relative',
  },
  NewSearchDataCard: {
    height: ITEM_HEIGHT,
    borderRadius: 10,
    margin: 5,
    width: (width * 3.4) / 4,
    padding: 5,
    display: 'flex',
    position: 'relative',
  },
  cardText: {
    color: 'rgba(16, 36, 33, 1)',
    fontFamily: 'HindSiliguri-SemiBold',
  },
  searchContainer: {
    width: (width * 3.4) / 4,
    height: HEIGHT.InputHeightSecondary,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 30,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  searchIcon: {
    fontSize: 32,
    color: 'rgba(16, 36, 33, 1)',
  },
  searchInput: {
    fontSize: 18,
    color: THEME.TEXTCOLORPRIMARY,
    fontFamily: 'HindSiliguri-Regular',
  },
  searchCountContainer: {
    justifyContent: 'center',
    width: '20%',
    borderRadius: 100,
    height: HEIGHT.InputHeightSecondary,
  },
  searchCountText: {
    fontSize: 20,
    color: 'rgba(16, 36, 33, 1)',
    textAlign: 'right',
  },
  callBtn: {
    width: 50,
    padding: 5,
  },
  moreTxt: {
    padding: 5,
  },
  noResultsText: {
    marginTop: 20,
    fontSize: 18,
    color: THEME.TEXTCOLORPRIMARY,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.5)',
  },
});
