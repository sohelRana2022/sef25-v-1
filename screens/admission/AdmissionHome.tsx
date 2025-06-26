import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PersonalInfoSchemama, PersonalInfoType } from '../../lib/zodschemas/zodSchemas';
import ControlledInput from '../../comps/Inputs/ControlledInput';
import RadioButtons from '../../comps/Inputs/RadioButton';
import { classData, genderData, posibilityData, religionData, sectionData } from '../../lib/jsonValue/PickerData';
import { useAdmissionContexts } from '../../contexts/AdmissionContext';
import CustomPicker from '../../comps/pickers/CustomPicker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
interface AddmissionHomeProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const AdmissionHome:React.FC<AddmissionHomeProps>  = ({ navigation}) => {
  const { personalInfo, setPersonalInfo} = useAdmissionContexts();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<PersonalInfoType>({
    resolver: zodResolver(PersonalInfoSchemama),
    defaultValues: personalInfo || {
      stu_name_bn: '',
      stu_name_eng: '',
      prev_school: '',
      stu_class: '',
      stu_gender: '',
      stu_religion: '',
      posibility: ''
    }
    
  });
useFocusEffect(
  React.useCallback(() => {
    reset(personalInfo || {
      stu_name_bn: '',
      stu_name_eng: '',
      prev_school: '',
      stu_class: '',
      stu_gender: '',
      stu_religion: '',
      posibility: ''
    });
  }, [personalInfo])
);
  const next = (data: PersonalInfoType) => {
    setPersonalInfo(data);
    navigation.navigate('ParentsAndContact');
  };  

  

  return (
    <View style={{ flex: 1, justifyContent:'center', alignItems:'center', alignContent:'center'}}>
        <Card style={{ backgroundColor:"#FFF", height:'78%', width:'90%'}}>
          <ScrollView>
          <Card.Title title={'শিক্ষার্থী সম্পর্কিত তথ্য'} titleStyle={{textAlign:'center', marginTop:15}}/>
          <Card.Content>
            
            <ControlledInput 
              control={control}
              name={"stu_name_bn"}
              placeholder={""}
              label={"পূর্ণনাম (বাংলা)"}
              style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
            />
          <ControlledInput 
              control={control}
              name={"stu_name_eng"}
              placeholder={""}
              label={"পূর্ণনাম (ইংরেজি)"}
              style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
            />
        <ControlledInput 
          control={control}
          name={"prev_school"}
          placeholder={""}
          label={"পূর্বের বিদ্যালয়ের নাম"}
          style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
        />
          <CustomPicker 
            control={control}
            data={classData}
            name={'stu_class'}
            pickerTitle={'যে শ্রেণীতে ভর্তি হতে ইচ্ছুক'}
            pickerAreaStyle={{paddingTop:10}}
            />
          <RadioButtons
            control={control}
            name='stu_gender'
            labelTitle={"লিঙ্গ"}
            direction='row'
            items={genderData}
            
          />

        <RadioButtons
          control={control}
          name='stu_religion'
          labelTitle={"ধর্ম"}
          direction='row'
          items={religionData}
        />
        <RadioButtons 
          control={control}
          name='posibility'
          labelTitle={'ভর্তির সম্ভাবনা'}
          items={posibilityData}
          direction='row'
          />
          <View style={{ marginTop: 25, paddingBottom:5 }}>
          <Button style={{ flex: 1 }} onPress={handleSubmit(next)} mode={"contained"}>
            পরবর্তী
          </Button>
          </View>
          
          </Card.Content>
          </ScrollView>
        </Card>
        


    </View>
  );
};

export default AdmissionHome;


