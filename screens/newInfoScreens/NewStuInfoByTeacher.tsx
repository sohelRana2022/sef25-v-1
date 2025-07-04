import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Card } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import { studentDataType, summary } from '../../lib/dTypes/StudentDataType';
import { summarizeByRefPerson } from '../../lib/helpers/helpers';

type RootStackParamList = {
  NewStuInfoByTeacher: {
    ref_uid: string;
    // Add other params here if needed
  };
};

interface NewStuInfoByTeacherProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NewStuInfoByTeacher'>;
  route: RouteProp<RootStackParamList, 'NewStuInfoByTeacher'>;
}



const NewStuInfoByTeacher = (props:NewStuInfoByTeacherProps) => {
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
}]);


  const getMyData = async () => {
    setLoader(true);
    try {
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
          
        setMyData(newStuData);

        const countedData = summarizeByRefPerson(newStuData)
        
        setSummery(countedData)
        setLoader(false);
    } catch (error) {
      console.log(error)
    }


  }
  

  useEffect(()=> {
    getMyData();
  },[])







  return (
    <View style={styles.container}>     

              <Text style={{textAlign:'center', color:"#000", fontFamily:'HindSiliguri-SemiBold', fontSize:16}}>{summery[0].ref_person ?? ''}</Text>
              <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                
                <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}>
                  <Icon name="addusergroup" size={18} color="#444" />
                  <Text style={{color:"#444", fontFamily:'HindSiliguri-Regular', fontSize:18, paddingHorizontal:5}}>{summery[0].total?? 0}</Text>
                </View>
                 <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}>
                  <Icon name="Trophy" size={18} color="#444" />
                  <Text style={{color:"#444", fontFamily:'HindSiliguri-Regular', fontSize:18, paddingHorizontal:5}}>{summery[0].total_add ?? 0}</Text>
                </View>                
                <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}>
                  <Icon name="heart" size={18} color="#444" />
                  <Text style={{color:"#444", fontFamily:'HindSiliguri-Regular', fontSize:18, paddingHorizontal:5}}>{summery[0].posibility100 ?? 0}</Text>
                </View>                
                <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}>
                  <Icon name={"download"} size={18} color="#444" />
                  <Text style={{color:"#444", fontFamily:'HindSiliguri-Regular', fontSize:18, paddingHorizontal:5}}>{summery[0].total_add ?? 0 -5}</Text>
                </View>                 
                <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}>
                  <Icon name="gift" size={18} color="#444" />
                  <Text style={{color:"#444", fontFamily:'HindSiliguri-Regular', fontSize:18, paddingHorizontal:5}}>{summery[0].total_com}</Text>
                </View>            
              </View>


              <View style={[styles.infoRow,{marginBottom:10, backgroundColor:'#ddd'}]}>
                <Text style={[styles.serial,{fontFamily: 'HindSiliguri-SemiBold'}]}>{'ক্রম'}</Text>
                <Text style={[styles.label,{fontFamily: 'HindSiliguri-SemiBold'}]}>{'শিক্ষার্থীর নাম'}</Text>
                <Text style={[styles.value,{fontFamily: 'HindSiliguri-SemiBold'}]}>{"সম্ভাবনা"}</Text>
                <Text style={[styles.value,{fontFamily: 'HindSiliguri-SemiBold'}]}>{"ভর্তি"}</Text>
              </View>

            <ScrollView>
              {myData.map((item:studentDataType, idx: number) => (
                
                <View key={item.uid} style={[styles.infoRow,{backgroundColor: item.is_admitted ? '#eee' : '#FFF'}]}>
                  <Text style={[styles.serial,{fontFamily: 'HindSiliguri-Regular'}]}>{idx + 1}</Text>
                  <Text style={[styles.label,{fontFamily: 'HindSiliguri-Regular'}]}>{item.stu_name_bn}</Text>
                  <Text style={[styles.value,{fontFamily: 'HindSiliguri-Regular'}]}>{item.posibility+"%"}</Text>
                  {item.is_admitted ? <Icon name="check" size={24} color="green" style={styles.icon} /> 
                  : 
                      <Icon name="close" size={24} color="red" style={styles.icon} /> 
                 
                  }
                </View>
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
  },
  icon: {
    width: '15%',
    textAlign:'center'
  },
  serial: {
    color: 'black',
    width: '10%',
    textAlign:'center'
  },
  label: {
    color: 'black',
    width: '55%',
  },
  value: {
    color: 'black',
    width: '15%',
    textAlign: 'center',
  },
})