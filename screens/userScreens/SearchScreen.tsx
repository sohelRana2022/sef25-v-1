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
import { Card, DataTable } from 'react-native-paper';
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
          


          <StuInfoTable 
            data={searchText=== '' ? data : filteredData}
            navigation={navigation}
            route={route}         
          />

        }

        {loader && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text className='text-base text-[#FFF] pt-5'>Wait! loading .....</Text>
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



const StuInfoTable = ({
  data,
  navigation,
  route,
}: {
  data: StudentInfo[];
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}) => {
  const { user } = useAuthContexts();
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([8,10,12]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, data.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <DataTable>
        <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
          <View style={{ width: 320 }}>
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(data.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${data.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
          </View>
        </View>
        <DataTable.Header>
          <DataTable.Title style={{ flex: 0.5 }}>ক্রম</DataTable.Title>
          <DataTable.Title style={{ flex: 3 }}>শিক্ষার্থীর নাম </DataTable.Title>
          <DataTable.Title style={{ flex: 1 }}>শ্রেণী </DataTable.Title>
          <DataTable.Title style={{ flex: 1}}>শাখা </DataTable.Title>
        </DataTable.Header>

      {data.slice(from, to).map((item, index) => (
        <DataTable.Row 
        key={index.toString()} 
        onPress={() => navigation.navigate('StudentDetails', { ...route.params, item })
          
        }
        
        >
          <DataTable.Cell style={{ flex: 0.5 }}>{item.roll}</DataTable.Cell>  
          <DataTable.Cell style={{ flex: 3 }}>
          <View>
            <Text className='text-black font-HindSemiBold'>{item.stu_name_bn}</Text>
            <Text className='text-[#666] text-xs font-HindSemiBold'>{item.father_name_bn}</Text>
          </View>
          </DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.stu_class}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.section}</DataTable.Cell>
        </DataTable.Row>
      ))}


    </DataTable>
  );
};
