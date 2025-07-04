import React, { useEffect, useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Image, Modal, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/AntDesign';
import UserIcon from 'react-native-vector-icons/FontAwesome5';
import { height } from '../../lib/configs/Dimensions';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAppContexts } from '../../contexts/AppContext';
import { API_URL } from '../../apis/config';
import { Button, DataTable } from 'react-native-paper';
import { useAuthContexts } from '../../contexts/AuthContext';
import LoaderAnimation from '../../comps/activityLoder/LoaderAnimation';
import firestore from '@react-native-firebase/firestore';
import { getRemainingDays } from '../../lib/helpers/helpers';
import { addInfoSchema, addInfoType } from '../../lib/zodschemas/zodSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import RadioButtons from '../../comps/Inputs/RadioButton';
import { addPointData } from '../../lib/jsonValue/PickerData';
import ControlledInput from '../../comps/Inputs/ControlledInput';

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
    send_date: Date,
    is_active: boolean,
    valid_days: number
}

const NewStuInfoScreen: React.FC<NewStuInfoScreenProps> = ({ navigation, route }) => {
  const { user } = useAuthContexts();
  const [netStatus, setNetStatus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<StudentInfo[]>([]);
  const { loader, setLoader } = useAppContexts();



const { control, handleSubmit, reset, watch } = useForm<addInfoType>({
  resolver: zodResolver(addInfoSchema),
  defaultValues: {
    total_add_fee: 0,
    add_point: 0,
    commission: 0,
    is_admitted: true,
    add_date: new Date()
  }
});

const watchedTotal = watch('total_add_fee');
const watchedPoint = watch('add_point');

useEffect(() => {
  const newCommission = (watchedTotal || 0) * 0.1 * (watchedPoint || 0);
  reset((prev) => ({
    ...prev,
    commission: newCommission
  }));
}, [watchedTotal, watchedPoint, reset]);








  const getData = async () => {
    setLoader(true);
    try {
        const currentYear = new Date().getFullYear(); // 2025

        const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
        const now = new Date();
        const snapshot = await firestore()
          .collection('newinfos')
          .where('send_date', '>=', startOfYear)
          .orderBy('send_date', 'desc')
          .get();

        const newStuData: StudentInfo[] = snapshot.docs.map(doc => {
            const data = doc.data();
            const timestamp = data.send_date; // Firestore Timestamp
            const jsDate = timestamp.toDate() // JavaScript Date object

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
                send_date: jsDate,
                add_point: data.add_point,
                is_active: data.is_active,
                valid_days: data.valid_days
              };
          });
        
        const activeStudents = newStuData.filter(student => {
          const validTill = new Date(student.send_date);
          validTill.setDate(validTill.getDate()+student.valid_days);
          const isActive = student.is_active !== false;
          const isAdmitted = student.is_admitted === true;
          return isActive && (now < validTill || isAdmitted) 
        });

        user?.role === 'admin' ? setData(newStuData) : setData(activeStudents);

        
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

const submit = (data:addInfoType) =>{
  console.log(data);
}



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
          setModalVisible={setModalVisible}
        />
      )}



{/* Modal */}
    <Modal
      transparent
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)} // For Android back button
    >
      <View style={styles.modalBackground}>
        <View className='w-[90%] bg-white py-5 px-10 rounded-lg justify-center'>
          <Text className='text-base text-black font-HindSemiBold text-center py-2'>ভর্তি নিশ্চায়ন ফরম</Text>


              <ControlledInput 
                control={control}
                name={"total_add_fee"}
                placeholder={""}
                label={"সর্বমোট ভর্তি-ফি (টাকা)"}
                keyboardType='numeric'
                style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold', marginBottom:20}}
              />
              <RadioButtons
                control={control}
                name='add_point'
                labelTitle={"ভর্তিতে অবদান রাখা শিক্ষক সংখ্যা"}
                direction='column'
                items={addPointData}
                
              />

            

                <Button className='my-5' onPress={handleSubmit(submit)} mode={"contained"}>
                  <ActivityIndicator
                    style={{position:'absolute', left:40, right:20}}
                  />
                  ভর্তি নিশ্চিত করুন
                </Button>
            
        </View>
      </View>
    </Modal>







    </>
  );
};

export default NewStuInfoScreen;


const styles = StyleSheet.create({

  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderColor: '#000',
    borderRadius: 8
  },
  buttonText: {
    color: '#000'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center'
  },


})




const NewInfoTable = ({
  data,
  navigation,
  route,
  setModalVisible
}: {
  data: StudentInfo[];
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>

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
          <DataTable.Title style={{ flex: 0.5 }}>শ্রেণী </DataTable.Title>
          <DataTable.Title style={{ flex: 1}}>{''}</DataTable.Title>
          <DataTable.Title style={{ flex: 1}}>{''}</DataTable.Title>
        </DataTable.Header>

      {data.slice(from, to).map((item, index) => (
        <DataTable.Row
        style={{backgroundColor: index % 2 === 0 ? '#FFF' : '#eee'}} 
        key={item.uid}
        
        >
          <DataTable.Cell style={{ flex: 0.5 }}>{index+1}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 3}}>
           <View className='justify-center items-center flex-row'>
            <Text className='absolute top-[10] left-4 text-black bg-gray-200 rounded-lg text-center font-HindSemiBold px-1.5' style={{fontSize: 10}}>{getRemainingDays(item.send_date, item.valid_days)}</Text>
            <View className='w-[20%]'>
              {item.is_admitted ? 
                <Icon name="check" size={15} color="green" style={{textAlign:'left'}} /> :
                <Icon name="close" size={15} color="red" style={{textAlign:'left'}} /> }
            </View>
            <View className='flex-col w-[80%]'>
             <Text className='text-sm text-black font-HindSemiBold'>{item.stu_name_bn}</Text>
            <Text className='text-xs text-gray-400 font-HindSemiBold'>{item.ref_person}</Text>
            </View>
           </View>
            
            </DataTable.Cell>
          <DataTable.Cell style={{ flex: 0.5 }}>{item.stu_class}</DataTable.Cell>
          <DataTable.Cell 
          textStyle={{textAlign:'center', color:'#ddd', alignSelf:'center'}} 
          style={{ flex: 1, justifyContent: 'center'}}
              onPress={() =>
              user && (item.ref_uid === user.uid || user.role === 'admin')
                ? navigation.navigate('NewStudentDataDetailScreen', {item: {...item, send_date: item.send_date.toISOString()}}) : null
              }
            >
            {<Icon name="eye" size={25} color="black" style={{textAlign:'left'}} /> }
            </DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}
            onPress={() =>
            user && (user.role === 'admin')
              ? setModalVisible(true)
              : null
            }
          >{
            <Icon name="checkcircle" size={24} color="green" style={{width:'100%', textAlign:'center'}} /> }
          </DataTable.Cell>
        </DataTable.Row>
      ))}

    </DataTable>
  );
};

