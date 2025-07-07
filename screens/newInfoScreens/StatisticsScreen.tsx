
import React, { useEffect, useState } from 'react';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import { Card, DataTable } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useAppContexts } from '../../contexts/AppContext';
import { useAuthContexts } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { studentDataType, summary } from '../../lib/dTypes/StudentDataType';
import { summarizeByRefPerson } from '../../lib/helpers/helpers';
interface StatisticsScreenProps{
    navigation: NativeStackNavigationProp<any, any>;
    route: RouteProp<any, any>;
    StudentInfo: studentDataType;
}


const StatisticsScreen = (props: StatisticsScreenProps) => {
  const [allData, setAllData] = useState<studentDataType[]>([]);
  const [summeryData, setSummeryData] = useState<summary[]>([]);
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
            const send_date = data?.send_date.toDate();
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
                send_date: send_date,
                add_point: data.add_point,
                is_active: data.is_active,
                valid_days: data.valid_days,
                total_add_fee: data.add_fee ?? 0,
                commission: data.commission ?? 0
                
              };
          });
        const countedData = summarizeByRefPerson(newStuData)
        setSummeryData(countedData)
        
    } catch (error) {
      console.log(error)
    } finally{
      setLoader(false);
    }


  }
  

  useEffect(()=> {
    getChartData();
  },[])


  return (
    <>
    {loader ? 
    
    <View className='justify-center items-center flex-1'>
      <ActivityIndicator color={'#000'} size="large"/>
    </View>
    
    : 


       <StatisticTable
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
  data: summary[];
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};


const StatisticTable = ({
  data,
  navigation,
  route,
}: StatisticTableProps) => {
  const { user } = useAuthContexts();

  return (
    <DataTable>



        <DataTable.Header
          style={{backgroundColor:'#ddd'}}
        >
          <DataTable.Title style={{ flex: 1 }}>
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft:10 }}>
              <Text className="text-left text-black font-HindSemiBold">ক্রম</Text>
            </View>            
          </DataTable.Title>
          <DataTable.Title style={{ flex: 3 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text className="text-left text-black font-HindSemiBold">শিক্ষকের নাম</Text>
            </View>             
          </DataTable.Title>
          <DataTable.Title style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text className="text-center text-black font-HindSemiBold">মোট</Text>
            </View> 
          </DataTable.Title>
          <DataTable.Title style={{ flex: 1.5 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text className="text-center text-black font-HindSemiBold">এই সপ্তাহ</Text>
            </View>             
          </DataTable.Title>
          <DataTable.Title style={{ flex: 1}}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text className="text-center text-black font-HindSemiBold">১০০%</Text>
            </View>             
          </DataTable.Title>
          <DataTable.Title style={{ flex: 1}}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft:10 }}>
              <Text className="text-center text-black font-HindSemiBold">ভর্তি</Text>
            </View>  
          </DataTable.Title>
        </DataTable.Header>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

      {data.map((item, index) => (
        <DataTable.Row 
            style={{backgroundColor: index % 2 === 0 ? '#FFF' : '#eee'}} 
            key={item.ref_uid} 
            onPress={()=>{
                user?.uid === item.ref_uid || user?.role === 'admin' ? 
                navigation.navigate('NewStuInfoByTeacher', 
                  {ref_uid:item.ref_uid})
                : null
              }
            }
        

        >
          <DataTable.Cell style={{ flex: 1 }}>
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text className="text-center text-black font-HindSemiBold">{index+1}</Text>
            </View>              
          </DataTable.Cell>
          <DataTable.Cell style={{ flex: 3 }}>
             <View style={{ flex: 3, justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text className="text-black font-HindSemiBold">{item.ref_person}</Text>
            </View>             
          </DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }} >
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text className="text-black font-HindSemiBold">  {item.total}</Text>
            </View>            
          </DataTable.Cell>
          <DataTable.Cell style={{ flex: 1.5 }} >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text className="text-center text-black font-HindSemiBold">{item.prev7DayaData}</Text>
            </View>            
          </DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text className="text-center text-black font-HindSemiBold">{item.posibility100}</Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text className="text-center text-black font-HindSemiBold">{item.total_add}</Text>
            </View> 
            </DataTable.Cell>
        </DataTable.Row>
      ))}

      </ScrollView>
    </DataTable>
  );
};
