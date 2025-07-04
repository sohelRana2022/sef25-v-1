import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { INFO_API_URL } from '../../apis/config';
import { insertData, readAllData, deleteData } from '../../lib/crudFuncs/crud';
import { Card, DataTable } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useAppContexts } from '../../contexts/AppContext';
import { useAuthContexts } from '../../contexts/AuthContext';
import LoaderAnimation from '../../comps/activityLoder/LoaderAnimation';
import { countByPropWithRank } from '../../lib/helpers/helpers';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { studentDataType } from '../../lib/dTypes/StudentDataType';
const uData = {"contact": "01740096872", "email": "sof@gmail.com", "id": "5K5CM5vrnBdoHIYGgANJ", "imageId": "FsjkwjvzkzigammKzv", "role": "Director", "sefBranch": "তারাকান্দি", "userName": "রবিন রানা"}
interface StatisticsScreenProps{
    navigation: NativeStackNavigationProp<any, any>;
    route: RouteProp<any, any>;
    StudentInfo: studentDataType;
}



type Summary = {
  ref_uid: string;
  ref_person: string;
  total: number;
  admitted: number;
  posibility100: number;
  total_add: number;
  total_com: number
};

const summarizeByRefPerson = (data: studentDataType[]): Summary[] => {
  const grouped = data.reduce<Record<string, Summary>>((acc, curr) => {
    const person = curr.ref_person || 'Unknown';
    const ref_uid = curr.ref_uid || 'Unknown';
    if (!acc[ref_uid]) {
      acc[ref_uid] = {
        ref_person: person,
        ref_uid: ref_uid,
        total: 0,
        admitted: 0,
        posibility100: 0,
        total_add: 0,
        total_com: 0
      };
    }

    acc[ref_uid].total += 1;
    if (curr.is_admitted) acc[ref_uid].admitted += 1;
    if (Number(curr.posibility) === 100) acc[ref_uid].posibility100 += 1;
    acc[ref_uid].total_add += Number(curr.add_point || 0); // add_point যোগ
    acc[ref_uid].total_com += Number(curr.commission || 0); // commission যোগ
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => b.admitted - a.admitted);
};

const StatisticsScreen = (props: StatisticsScreenProps) => {
  const [allData, setAllData] = useState<studentDataType[]>([]);
  const [summeryData, setSummeryData] = useState<Summary[]>([]);
  const {navigation, route}= props;
  const { loader, setLoader } = useAppContexts();
  const {user} = useAuthContexts();
  const listHeader=()=>{
    return(
      <Card className='flex-1 px-1 py-1 mx-2 my-0.5 justify-center items-center'>
        <View
          className='flex-row'
        > 
          <Text className='w-[15%] text-gray-900 font-HindRegular text-center text-base' >{`ক্রমিক`}</Text>
          <Text className='w-[40%] text-gray-900 font-HindRegular text-left text-base' >{`শিক্ষকের নাম`}</Text>
          <Text className='w-[15%] text-gray-900 font-HindRegular text-center text-base' >{`সংগ্রহ`}</Text>
          <Text className='w-[15%] text-gray-900 font-HindRegular text-center text-base' >{`১০০%`}</Text>
          <Text className='w-[15%] text-gray-900 font-HindRegular text-center text-base' >{`ভর্তি`}</Text>
        </View>
        </Card>
      )
  }


  const getChartData = async () => {
    setLoader(true);
    try {
        const currentYear = new Date().getFullYear(); // 2025

        const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);

        const snapshot = await firestore()
          .collection('newinfos')
          .where('send_date', '>=', startOfYear)
          .get(); 

        const newStuData = snapshot.docs.map(doc => {
            const data = doc.data();
              return {
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
                ref_uid: data.ref_uid,
                ref_person: data.ref_person,
                sef_branch: data.sef_branch,
                is_admitted: data.is_admitted,
                send_date: data.add_date,
                add_point: data.add_point,
                is_active: data.is_active,
                valid_days: data.valid_days,
                total_add_fee: data.add_fee ?? 0,
                commission: data.commission ?? 0
                
              };
          });
        setAllData(newStuData);
        const countedData = summarizeByRefPerson(newStuData)
        
        setSummeryData(countedData)
        setLoader(false);
    } catch (error) {
      console.log(error)
    }


  }
  

  useEffect(()=> {
    getChartData();
  },[])
  return (
    <>
    {loader ? <LoaderAnimation/> : 


       <StatisticTable
          allData={allData}
          data={summeryData}
          navigation={navigation}
          route={route}
        />     
      
      }
     </>
  );
};

export default StatisticsScreen;


type StatisticTableProps = {
  allData: studentDataType[];
  data: Summary[];
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};


const StatisticTable = ({
  allData,
  data,
  navigation,
  route,
}: StatisticTableProps) => {
  const { user } = useAuthContexts();
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5,8,10]);
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
          <DataTable.Title style={{ flex: 1 }}>মোট</DataTable.Title>
          <DataTable.Title style={{ flex: 1}}>১০০%</DataTable.Title>
          <DataTable.Title style={{ flex: 1}}>ভর্তি</DataTable.Title>
        </DataTable.Header>

      {data.slice(from, to).map((item, index) => (
        <DataTable.Row 
            key={item.ref_uid} 
            onPress={()=>{
                user?.uid === item.ref_uid || user?.role === 'admin' ? 
                navigation.navigate('NewStuInfoByTeacher', 
                  {ref_uid:item.ref_uid})
                : null
              }
            }
        

        >
          <DataTable.Cell style={{ flex: 0.5 }}>{index+1}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 3 }}>{item.ref_person}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.total}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.posibility100}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.total_add}</DataTable.Cell>
        </DataTable.Row>
      ))}


    </DataTable>
  );
};
