import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuthContexts } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import { studentDataType, summary } from '../../lib/dTypes/StudentDataType';
import { getRemainingDays, summarizeByRefPerson } from '../../lib/helpers/helpers';


type RootStackParamList = {
  NewStuInfoByTeacher: { ref_uid: string };
  NewInfoNavigator: {
    screen: 'NewStudentDataDetailScreen';
    params: { stu_data: studentDataType };
  };
};

interface NewStuInfoByTeacherProps {
  navigation: NativeStackNavigationProp<RootStackParamList>; // ✅ Generic 1 only
  route: RouteProp<RootStackParamList, 'NewStuInfoByTeacher'>;
}



const NewStuInfoByTeacher = (props:NewStuInfoByTeacherProps) => {
const {user} = useAuthContexts();
  const {navigation, route} = props;
  const [loader, setLoader] = useState<boolean>(false);
  const [myData, setMyData] = useState<studentDataType[]>([]);
  const [summery, setSummery] = useState<summary[]>([{
  ref_uid: '',
  ref_person: '',
  total: 0,
  admitted: 0,
  posibility100: 0,
  total_add: 0,
  total_com: 0,
  prev7DayaData:0
}]);



  const getMyData = async () => {
    setLoader(true);
    try {
        const now = new Date();
        const currentYear = new Date().getFullYear(); // 2025

        const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);

        const snapshot = await firestore()
          .collection('newinfos')
          .where('ref_uid', '==', route.params.ref_uid)
          .where('send_date', '>=', startOfYear)
          .get(); 

        const newStuData = snapshot.docs.map(doc => {
            const data = doc.data();
            const send_date = data?.send_date.toDate()
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
          
        const activeStudents = newStuData.filter(student => {
          const validTill = new Date(student.send_date);
          validTill.setDate(validTill.getDate()+student.valid_days);
          const isActive = student.is_active !== false;
          const isAdmitted = student.is_admitted === true;
          return isActive && (now < validTill || isAdmitted) 
        });

       
        setMyData(activeStudents);

        const countedData = summarizeByRefPerson(activeStudents)
        
        setSummery(countedData)
        setLoader(false);
    } catch (error) {
      console.log(error)
    }


  }
  

  useEffect(()=> {
    getMyData();
  },[])

const data = summery[0];
if (!data) return (
  <View className='flex-1 justify-center items-center px-5'>
    <Text className='text-black text-justify font-HindSemiBold'>{'আপনি এখনো কোন নতুন শিক্ষার্থীর তথ্য জমা দেননি!'}</Text>
  </View>
)


const summaryData = [
  { icon: 'addusergroup', label: 'Total', value: summery[0]?.total ?? 0 },
  { icon: 'Trophy', label: 'Add Point', value: summery[0]?.total_add ?? 0 },
  { icon: 'heart', label: '100% Possible', value: summery[0]?.posibility100 ?? 0 },
  { icon: 'download', label: 'Adjusted', value: (summery[0]?.total_add ?? 0) - 5 },
  { icon: 'gift', label: 'Commission', value: summery[0]?.total_com ?? 0 }
];


  return (
    <View style={styles.container}>     

              <Text className='text-center text-black font-HindSemiBold text-lg py-3'>{summery[0].ref_person ?? ''}</Text>
              
              
             <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
              {summaryData.map((item, index) => (
                <View
                  key={index}
                  className='flex-row justify-center items-center mx-2'
                >
                  <Icon name={item.icon} size={20} color="#444" />
                  <View
                    style={{
                      backgroundColor: '#ddd',
                      paddingTop:6,
                      marginLeft:2,
                      paddingHorizontal: 8,
                      minHeight: 25,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'HindSiliguri-Regular',
                        fontSize: 14,
                        color: '#000',
                        lineHeight: 18,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                      }}
                    >
                      {item.value}
                    </Text>
                  </View>

                </View>
              ))}
              </View>


              <View style={[styles.infoRow,{marginBottom:10, backgroundColor:'#ddd', marginTop:20}]}>
                <Text className='w-[15%] text-black text-base text-center font-HindSemiBold'>{'ক্রম'}</Text>
                <Text className='w-[55%] text-black text-base text-left font-HindSemiBold'>{'শিক্ষার্থীর নাম'}</Text>
                <Text className='w-[15%] text-black text-base text-center font-HindSemiBold'>{"সম্ভাবনা"}</Text>
                <Text className='w-[15%] text-black text-base text-center font-HindSemiBold'>{"ভর্তি"}</Text>
              </View>

            <ScrollView>
              {myData.map((item:studentDataType, idx: number) => (
                <TouchableOpacity
                  onPress={
                    
                    ()=>{navigation.navigate('NewInfoNavigator', {
                                            screen: 'NewStudentDataDetailScreen',
                                            params: {stu_data: {...item, send_date: new Date(item.send_date).toISOString()}},
                                          })}}

                  key={item.uid}
                >

                
                <View style={[styles.infoRow,{backgroundColor: item.is_admitted ? '#eee' : '#FFF'}]}>
                  <View className='w-[15%] justify-center'>
                  <Text className='text-black text-base text-center font-HindRegular'>{idx + 1}</Text>
                  </View>
                  <View className='w-[55%] justify-center'>
                    <Text className='absolute top-[12] right-0 text-black bg-yellow-200 rounded-lg text-center font-HindSemiBold px-2' style={{fontSize: 12}}>{getRemainingDays(new Date(item.send_date), item.valid_days)}</Text>
                    <Text className='text-black text-base text-left font-HindSemiBold'>{item.stu_name_bn}</Text>
                    <Text className='text-gray-400 text-xs font-HindRegular'>{item.village+' ('+item.stu_class+' )'}</Text>
                  </View>
                  
                  <View className='w-[15%] justify-center'>
                    <Text className='text-black text-base text-center font-HindRegular'>{item.posibility+"%"}</Text>
                  </View>

                  {item.is_admitted ? 
                   <View  className='w-[15%] justify-center'>
                    <Icon name="check" size={24} color="green" style={{textAlign:'center'}}/> 
                  </View>
                   : 
                  <View className='w-[15%] justify-center'>
                    <Icon name="close" size={24} color="red" style={{textAlign:'center'}} /> 
                  </View>
                 
                  }
                </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

    </View>
  );
};

export default NewStuInfoByTeacher;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal:5,
    marginVertical:10

  },
  card: {
    width: '100%',
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  headerImage: {
    width: '95%',
    height: 45,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'HindSiliguri-SemiBold',
  },
  infoRow: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: '#eee'
  }
})