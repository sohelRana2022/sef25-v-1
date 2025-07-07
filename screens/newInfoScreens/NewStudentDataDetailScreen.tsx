import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { formatedDateTime } from '../../lib/helpers/helpers';
import { studentDataType } from '../../lib/dTypes/StudentDataType';

// 1. Define your stack route types
type RootStackParamList = {
  NewStudentDataDetailScreen: {
    stu_data: studentDataType
  };
};

// 2. Use Route and Navigation types from stack
type NewStudentDataDetailRouteProp = RouteProp<
  RootStackParamList,
  'NewStudentDataDetailScreen'
>;

type NewStudentDataDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NewStudentDataDetailScreen'
>;

interface NewStudentDataDetailScreenProps {
  route: NewStudentDataDetailRouteProp;
  navigation: NewStudentDataDetailNavigationProp;
}

const NewStudentDataDetailScreen: React.FC<NewStudentDataDetailScreenProps> = ({
  route,navigation
}) => {
  const item = route.params.stu_data;
 
  return (

      <View style={styles.container}>
       
          <Image
            source={require('../../assets/images/schoolName.jpg')}
            style={styles.headerImage}
            resizeMode="contain"
          />
          <Text className='text-black text-center font-HindSemiBold text-lg pb-2'>শিক্ষার্থীর বিস্তারিত তথ্য</Text>

          
            {([
              
              [1, 'শিক্ষার্থীর নাম', item.stu_name_bn],
              [2, 'পিতার নাম', item.father_name],
              [3, 'মাতার নাম', item.mother_name],
              [4, 'পিতার মোবাইল নাম্বার', item.contact_1],
              [5, 'মাতার মোবাইল নাম্বার', item.contact_2],
              [6, 'ভর্তি-ইচ্ছুক শ্রেণী', item.stu_class],
              [7, 'SEF-শাখা', item.sef_branch],
              [8, 'ভর্তির সম্ভাবনা', `${item.posibility}%`],
              [9, 'ঠিকানা', `${item.address}, ${item.village}`],
              [10, 'লিঙ্গ', item.stu_gender],
              [11, 'ধর্ম', item.stu_religion],
              [12, 'পূর্বের বিদ্যালয়ের নাম', item.prev_school],
              [13, 'তথ্য সংগ্রহের তারিখ', formatedDateTime(item.send_date)],
              [14, 'তথ্য সংগ্রহকারী', item.ref_person],
            ] as [number, string, any][]).map(([_, label, value], idx) => (
            
              <View key={idx} style={styles.infoRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>

            ))}
      
        </View>
    

  );
};

export default NewStudentDataDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:40
  },
  headerImage: {
    width: '85%',
    height: 45,
    alignSelf: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'HindSiliguri-SemiBold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    color: 'black',
    fontFamily: 'HindSiliguri-SemiBold',
    width: '40%',
  },
  value: {
    color: 'black',
    fontFamily: 'HindSiliguri-Regular',
    width: '60%',
    textAlign: 'right',
  },
});
