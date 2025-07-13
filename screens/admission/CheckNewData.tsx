import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import ControlledInput from '../../comps/Inputs/ControlledInput'
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Snackbar } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAdmissionContexts } from '../../contexts/AdmissionContext';
import { primaryContactSchema, primaryContactType } from '../../lib/zodschemas/zodSchemas';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useAuthContexts } from '../../contexts/AuthContext';

interface CheckDataProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const CheckNewData:React.FC<CheckDataProps>  = ({ navigation}) => {
  const {user} = useAuthContexts();
  const {primaryContact, setPrimaryContact} = useAdmissionContexts();
  const [isExist, setIsExist] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)
  const [msg, setMsg] = useState<string>('');
    const { control, handleSubmit, formState: { errors } } = useForm<primaryContactType>({
        resolver: zodResolver(primaryContactSchema),
        defaultValues: {contact_1:''}
      });



const check = async (data:primaryContactType) => {
  setLoading(true)
  const {contact_1} = data; // You only send one contact
  try {
    const [match1, match2] = await Promise.all([
      firestore()
        .collection('newinfos')
        .where('contact_1', '==', contact_1)
        .get(),
      firestore()
        .collection('newinfos')
        .where('contact_2', '==', contact_1)
        .get()
    ]);

    if ((!match1.empty || !match2.empty) && user?.role !== 'admin') {
      setLoading(false)
      setIsExist(true);
      setMsg('এই শিক্ষার্থীর তথ্য ইতোমধ্যে ডাটাবেইজে এন্ট্রি আছে!');
      return;
    }

    setLoading(false)
    // Proceed to go next page
    setPrimaryContact(data);
    navigation.navigate('AdmissionHome');

  } catch (error) {
    setIsExist(true);
    setMsg('সার্ভারজনিত বা নেট জনিত সমস্যা হয়েছে । কিছুক্ষণ পর আবার চেষ্টা করুন!');
  } finally{
    setLoading(false)
  }
};






  return (
    <View className='flex-1 justify-center items-center bg-white'>
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        )}

        {isExist  && (
          <View style={styles.snackbarWrapper}>
            <Snackbar
              visible
              onDismiss={() => {setIsExist(false); setMsg('')}}
              duration={7000}
              style={styles.snackbar}
            >
              <Text style={{ color: 'red', fontFamily:'HindSiliguri-SemiBold' }}>{msg}</Text>
            </Snackbar>
          </View>
        )}


        <Icon name="warning" size={30} color="orange" />
        <Text className='flex-start text-gray-500 text-xs font-HindSemiBold pt-5 w-[60%] text-justify'>শিক্ষার্থীর পিতার সচল ফোন নাম্বারটি এখানে লিখুন। এই ফোন নাম্বার ভুল হলে তথ্যটি আপনার নয় বলে বিবেচিত হবে। এক্ষেত্রে, কোন অজুহাত গ্রহণ করা হবে না। </Text>
        <View className='w-[80%] px-10'>
            
            <ControlledInput 
                control={control}
                name={"contact_1"}
                placeholder={"01740096832"}
                label={"পিতার মোবাইল নাম্বার"}
                keyboardType='numeric'
                style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold', marginVertical:20}}
            />
            
            <Button className='my-5' onPress={handleSubmit(check)} mode={"contained"} >

            পরবর্তী
            </Button>
        </View>

    </View>
  )
}



export default CheckNewData

const styles = StyleSheet.create({
  snackbarWrapper: { position: 'absolute', top: '25%', left: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  snackbar: { width: '80%', borderRadius: 8, alignSelf: 'center', backgroundColor:'#fff' },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.5)',
    zIndex:100
  }
})