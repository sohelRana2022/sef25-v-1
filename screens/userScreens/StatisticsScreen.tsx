import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { INFO_API_URL } from '../../apis/config';
import { insertData, readAllData, deleteData } from '../../lib/crudFuncs/crud';
import { Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useAppContexts } from '../../contexts/AppContext';
import { useAuthContexts } from '../../contexts/AuthContext';
import LoaderAnimation from '../../comps/activityLoder/LoaderAnimation';
import { countByPropWithRank } from '../../lib/helpers/helpers';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
const uData = {"contact": "01740096872", "email": "sof@gmail.com", "id": "5K5CM5vrnBdoHIYGgANJ", "imageId": "FsjkwjvzkzigammKzv", "role": "Director", "sefBranch": "তারাকান্দি", "userName": "রবিন রানা"}
interface StatisticsScreenProps{
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
    add_date: string, 
}

type Summary = {
  ref_uid: string;
  ref_person: string;
  total: number;
  admitted: number;
  posibility100: number;
  total_add: number;
};

const summarizeByRefPerson = (data: StudentInfo[]): Summary[] => {
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
        total_add: 0
      };
    }

    acc[ref_uid].total += 1;
    if (curr.is_admitted) acc[ref_uid].admitted += 1;
    if (Number(curr.posibility) === 100) acc[ref_uid].posibility100 += 1;
    acc[ref_uid].total_add += Number(curr.add_point || 0); // add_point যোগ
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => b.admitted - a.admitted);
};

const StatisticsScreen = (props: StatisticsScreenProps) => {
  const [data, setData] = useState<StudentInfo[]>([]);
  const [filteredData, setFilteredData] = useState<Summary[]>([]);
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
  const renderItem = ({ item, index }: { item: {ref_uid: string, ref_person: string, total_add: number, total: number, admitted: number, posibility100: number }, index: number })=>{
    return (
      <Card className='flex-1 px-1 py-1 mx-2 my-0.5 justify-center items-center'>
          <TouchableOpacity
            onPress={()=>{
              console.log(user?.uid + '     ' + item.ref_uid)
                user?.uid === item.ref_uid || user?.role === 'admin' ? 
                navigation.navigate('NewStuInfoByTeacher', 
                  {teaData:data.filter(r=>r.ref_uid===item.ref_uid).sort((a,b)=>b.posibility-a.posibility), item})
                : null
              }
              
              }
                
          >

          
          <View
            className='flex-row'
          > 
          
            <Text className='w-[15%] text-gray-900 font-HindLight text-center text-base' >{`${index+1}`}</Text>
            <Text className='w-[40%] text-gray-900 font-HindLight text-left text-base'>{`${item.ref_person}`}</Text>
            <Text className='w-[15%] text-gray-900 font-HindLight text-center text-base'>{`${item.total}`}</Text>
            <Text className='w-[15%] text-gray-900 font-HindLight text-center text-base'>{`${item.posibility100}`}</Text>
            <Text className='w-[15%] text-gray-900 font-HindLight text-center text-base'>{`${item.total_add}`}</Text>
          </View>
          </TouchableOpacity>
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
          .where('add_date', '>=', startOfYear)
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
                add_date: data.add_date,
                add_point: data.add_point
              };
          });
        setData(newStuData);
        const countedData = summarizeByRefPerson(newStuData)
        
        setFilteredData(countedData)
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
      <FlatList
        data={filteredData}
        initialNumToRender={50}
        maxToRenderPerBatch={50}
        windowSize={50}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />}
     </>
  );
};

export default StatisticsScreen;



