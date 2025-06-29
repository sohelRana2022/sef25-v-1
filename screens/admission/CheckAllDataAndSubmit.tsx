import * as React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useAdmissionContexts } from '../../contexts/AdmissionContext';
import { Button, Card, Snackbar } from 'react-native-paper';
import { theme } from '../../lib/themes/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { extraDataSchema, extraDataType } from '../../lib/zodschemas/zodSchemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContexts } from '../../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Feather';
type CheckAllDataAndSubmitProps = {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const CheckAllDataAndSubmit:React.FC<CheckAllDataAndSubmitProps> = ({ navigation}) => {
  const [success, setSuccess] = React.useState(false);
  const [msg, setMsg] = React.useState<string>('');
  const {user} = useAuthContexts();

const {loader, setLoader, personalInfo, parentsAndContactInfo, onSubmitAll, resetForm } = useAdmissionContexts();
const { handleSubmit, reset } = useForm<extraDataType>({
  resolver: zodResolver(extraDataSchema),
  defaultValues: {
    ref_uid: user?.uid || '',
    ref_person: user?.nameBang || '', 
    sef_branch: user?.branch || '',
    add_point: 0
    }
});


const goAddHome = () => {
  setSuccess(false);
  navigation.navigate('AdmissionHome')
}

const submit = async (data:extraDataType) =>{
  setLoader(true);
  const submitStatus: {status: boolean, message: string} = await onSubmitAll(data);
  if(submitStatus.status){
    reset();
    resetForm();
    setLoader(false);
    setMsg(submitStatus.message);
    setSuccess(true)
  
  }else{
    setMsg(submitStatus.message);
    setSuccess(true);
  }
}
return (
<ScrollView>
    <View style={styles.container}>
        {!!success && (
          <View style={styles.msgWrapper}>
            <Icon name="check-square" size={60} color="green" />
            <Text style={styles.msgText}>
              {msg}
            </Text>
            <Button style={{height:40, marginTop:20 }} onPress={()=>goAddHome()} mode={"contained"}>
              আরেকটি তথ্য পাঠাবো 
            </Button>
          </View>
        )}


        {loader && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text className='text-base font-HindRegular text-[#FFF] pt-5'>অপেক্ষা করুন .....!</Text>
          </View>
        )}

      <Card style={{width:'100%', margin:5, padding:10,}}>
        <Image 
          source={require('../../assets/images/schoolLogo.png')} 
          style={{width:'95%', height:45}}
          resizeMode='contain'
          />
        <Card.Title titleStyle={{textAlign:'center'}} title={'নতুন শিক্ষার্থী তথ্য'} titleVariant='displayLarge' className='text-center'/>
        
          <Card.Content>


          {([
              [1, 'পূর্ণনাম (বাংলা)', personalInfo?.stu_name_bn],
              [2, 'পূর্ণনাম (ইংরেজি)', personalInfo?.stu_name_eng],
              [3, 'পিতার নাম', parentsAndContactInfo?.father_name],
              [4, 'মাতার নাম', parentsAndContactInfo?.mother_name],
              [5, 'SEF শাখা', user?.branch],
              [6, 'শ্রেণী', personalInfo?.stu_class],
              [7, 'লিঙ্গ', personalInfo?.stu_gender],
              [8, 'ধর্ম', personalInfo?.stu_religion],
              [9, 'পূর্বের বিদ্যালয়ের নাম', personalInfo?.prev_school],
              [10, 'ভর্তির সম্ভাবনা', personalInfo?.posibility+'%'],
              [11, 'পিতার মোবাইল নাম্বার', parentsAndContactInfo?.contact_1],
              [12, 'মাতার মোবাইল নাম্বার', parentsAndContactInfo?.contact_2],
              [13, 'ঠিকানা', `${parentsAndContactInfo?.address}, ${parentsAndContactInfo?.village}`],
              [14, 'রেফারেন্স', user?.nameBang],
            ] as [number, string, any][]).sort((a, b) => a[0] - b[0])
            .map(([_, label, value]: [number, string, any], idx: number) => (
              <View key={idx} style={styles.infoRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
  
           

        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between', marginTop: 20 }}>
          <Button style={{ flex: 1 }} onPress={()=>navigation.navigate('ParentsAndContact')} mode={"contained"}>
            সম্পাদনা
          </Button>
          <Button style={{ flex: 1 }} onPress={handleSubmit(submit)} mode={"contained"}>
            জমা দিন
          </Button>
        </View>   
          </Card.Content>
      </Card> 
      
    </View>
</ScrollView>
  );
};

export default CheckAllDataAndSubmit;


const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems:'center',
    margin:20
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  label: {
    color: 'black',
    fontFamily: 'HindSiliguri-SemiBold',
    width: '50%'
  },
  value: {
    color: 'black',
    fontFamily: 'HindSiliguri-Regular',
    width: '50%',
    textAlign: 'right'
  },
  heading:{
    paddingTop:10,
    color:'#444', 
    fontSize:12, 
    fontFamily:'HindSiliguri-SemiBold'
  },
  text:{
    color:'#000', 
    fontSize:16,
    fontFamily:'HindSiliguri-SemiBold', 
    paddingBottom:2
  },
  callbutton:{
    position:'absolute',
    top:5,
    right:10
  },
  msgbutton:{
    position:'absolute',
    top:5,
    right:70
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
    zIndex:100,
    borderRadius:10
  },
  msgWrapper: {
    backgroundColor:'#ddd', 
    position: 'absolute', 
    height:'100%',
    top: 0, 
    left: 0, 
    right: 0, 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 1000 
  },
  msgText: {  
    borderRadius: 8, 
    textAlign: 'center', 
    color:'#000', 
    padding:15,
    fontFamily:'HindSiliguri-SemiBold',
    fontSize:16
  }
});

