import React, { useEffect, useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/AntDesign';
import UserIcon from 'react-native-vector-icons/FontAwesome5';
import { height } from '../../lib/configs/Dimensions';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { useAppContexts } from '../../contexts/AppContext';
import { API_URL } from '../../apis/config';
import { DataTable } from 'react-native-paper';
import { useAuthContexts } from '../../contexts/AuthContext';
import LoaderAnimation from '../../comps/activityLoder/LoaderAnimation';
import firestore from '@react-native-firebase/firestore';
const ITEM_HEIGHT = height / 7;

interface NewStuInfoScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

interface StudentInfo {
    ref_uid: string,
    uid: string,
    stu_name_bn: string,
    stu_name_eng: string,
    stu_class: string,
    stu_gender: string,
    stu_religion: string,
    prev_school: string,
    posibility: number,
    father_name: string,
    mother_name: string,
    contact_1: string,
    contact_2: string,
    address: string,
    village: string,
    ref_person: string,
    sef_branch: string,
    add_point: number;
    is_admitted : boolean,
    add_date: string
}

const NewStuInfoScreen: React.FC<NewStuInfoScreenProps> = ({ navigation, route }) => {
  const { user } = useAuthContexts();
  const [netStatus, setNetStatus] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<StudentInfo[]>([]);
  const { loader, setLoader } = useAppContexts();

  const getData = async () => {
    setLoader(true);
    try {
        const currentYear = new Date().getFullYear(); // 2025

        const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);

        const snapshot = await firestore()
          .collection('newinfos')
          .where('add_date', '>=', startOfYear)
          .get();

        const newStuData: StudentInfo[] = snapshot.docs.map(doc => {
            const data = doc.data();
            const timestamp = data.add_date; // Firestore Timestamp
            const jsDate = timestamp.toDate().toString(); // JavaScript Date object

              return {
                ref_uid: data.ref_uid,
                uid: doc.id,
                stu_name_bn: data.stu_name_bn,
                stu_name_eng: data.stu_name_eng,
                stu_class: data.stu_class,
                stu_gender: data.stu_gender,
                stu_religion: data.stu_religion,
                prev_school: data.prev_school,
                posibility: data.posibility,
                father_name: data.father_name,
                mother_name: data.mother_name,
                contact_1: data.contact_1,
                contact_2: data.contact_2,
                address: data.address,
                village: data.village,
                ref_person: data.ref_person,
                sef_branch: data.sef_branch,
                is_admitted: data.is_admitted,
                add_date: jsDate,
                add_point: data.add_point
              };
          });

       setData(newStuData);
    } catch (err) {
      setNetStatus(true);
    } finally {
      setLoader(false);
      setNetStatus(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);



  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const searchWords = searchText.toLowerCase().trim().split(/\s+/);
    return data.filter((r) =>
      searchWords.every((word) =>
        Object.values(r).join(' ').toLowerCase().includes(word)
      )
    );
  }, [searchText, data]);

  const renderItem = ({ item }: { item: StudentInfo }) => (
    <Card className="h-30 justify-center items-center p-3 my-2 mx-2 relative">
      <TouchableOpacity
        activeOpacity={0.3}
        onPress={() =>
          user && (item.ref_person === user.nameBang || user.role === 'admin')
            ? navigation.navigate('NewStudentDataDetailScreen', { ...route.params, item })
            : null
        }
      >
        <View className="flex-row pt-3">
          <View className="w-1/4 flex-column items-center">
            <UserIcon name="user-alt" color="rgba(16, 36, 33, 0.4)" size={50} />
            <Text className="text-gray-600 font-HindSemiBold">{`${item.stu_class}`}</Text>
          </View>
          <View className="w-3/4">
            <Text className="text-gray-900 font-HindRegular text-sm">{`নাম: ${item.stu_name_bn}`}</Text>
            <Text className="text-gray-900 font-HindRegular text-sm">{`পিতার নাম: ${item.father_name}`}</Text>
            <Text className="text-gray-900 font-HindRegular text-sm">{`ঠিকানা: ${item.address+', '+ item.village}`}</Text>
          </View>
        </View>
        <View className="absolute right-0 top-0">
          {item.is_admitted ? (
            <Icon name="checkcircle" size={20} color="#000" />
          ) : (
            <Text className="text-gray-900 text-left pt-1 font-HindSemiBold">{`${item.posibility}%`}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <>
      {/* Search Area */}
      <View className="flex-row border border-gray-300 mx-4 my-2 rounded-full items-center px-3 bg-gray-300 justify-center">
        <View className="w-1/10">
          <Icons name="search" style={{ color: '#444', fontSize: 30 }} />
        </View>
        <View className="w-4/5">
          <TextInput
            value={searchText}
            placeholder="অনুসন্ধান করুন ..."
            onChangeText={setSearchText}
            placeholderTextColor="rgba(16, 36, 33, 0.6)"
            underlineColorAndroid="transparent"
            selectionColor="rgba(0, 0, 0, 0.5)"
            style={{ fontFamily: 'HindSiliguri-SemiBold', fontSize: 15, color: '#000' }}
          />
        </View>
        <View className="w-1/10">
          <Text className="text-gray-900 text-right text-base font-HindSemiBold">
            {filteredData?.length || ''}
          </Text>
        </View>
      </View>

      {loader && (
        <View style={{ position: 'absolute', top: '45%', left: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <LoaderAnimation />
        </View>
      )}

      {netStatus ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#444', fontFamily: 'HindSiliguri-SemiBold', fontSize: 20, paddingBottom: 20 }}>
            নেটওয়ার্ক কানেকশন সমস্যা!
          </Text>
          <Image
            source={require('../../assets/images/disconnect.png')}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </View>
      ) : (
        
        
        
        
       <NewInfoTable
          data={searchText === '' ? data : filteredData}
          navigation={navigation}
          route={route}
        />
        
        
        
        
        
        // <FlatList
        //   data={searchText === '' ? data : filteredData}
        //   initialNumToRender={50}
        //   maxToRenderPerBatch={50}
        //   windowSize={10}
        //   renderItem={renderItem}
        //   keyExtractor={(item) => item.uid.toString()}
        //   showsVerticalScrollIndicator={false}
        //   getItemLayout={(data, index) => ({
        //     length: ITEM_HEIGHT,
        //     offset: ITEM_HEIGHT * index,
        //     index,
        //   })}
        // />
      )}
    </>
  );
};

export default NewStuInfoScreen;

const NewInfoTable = ({
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
  const [numberOfItemsPerPageList] = React.useState([2,4,6,8,10]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, data.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <DataTable
      
    >
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
          <DataTable.Title style={{ flex: 1}}>সম্ভাবনা </DataTable.Title>
          <DataTable.Title style={{ flex: 1}}>ভর্তি</DataTable.Title>
        </DataTable.Header>

      {data.slice(from, to).map((item, index) => (
        <DataTable.Row 
        key={item.uid} 
          onPress={() =>
          user && (item.ref_person === user.nameBang || user.role === 'admin')
            ? navigation.navigate('NewStudentDataDetailScreen', { ...route.params, item })
            : null
        }
        
        >
          <DataTable.Cell style={{ flex: 0.5 }}>{index+1}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 3 }}>{item.stu_name_bn}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.stu_class}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.posibility+'%'}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.is_admitted?'Yes':'No'}</DataTable.Cell>
        </DataTable.Row>
      ))}


    </DataTable>
  );
};

