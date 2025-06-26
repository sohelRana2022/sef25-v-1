import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import ControlledInput from '../../comps/Inputs/ControlledInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserInfoType, UserInfoSchema } from '../../lib/zodschemas/zodSchemas';
import { Button, Card } from 'react-native-paper';
import CustomPicker from '../../comps/pickers/CustomPicker';
import { classData, sefBranchData, userRoleData } from '../../lib/jsonValue/PickerData';
import { useAuthContexts } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import AdmissionFormContainer from '../../comps/Containers/AdmissionFormContainer';
interface SignUpScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}


const SignUpScreen:React.FC<SignUpScreenProps>  = ({ navigation })=> {
  const { control, handleSubmit, formState: { errors } } = useForm<UserInfoType>({
    resolver: zodResolver(UserInfoSchema),
    defaultValues:{
      role:'viewer',
      title:"অভিভাবক"
    }
  });
 
  const { register } = useAuthContexts();
  const handleSingnup = async(data:UserInfoType) => {
    const finalData = {
      ...data,
      isApproved: false,
      imageId: '1FhLWX6sr_drBK1iyWO-ABQCX_Pj1v9nD',
    }
   await register(finalData);
  }

  return (
      <>

      <AdmissionFormContainer>
      
      <Card style={{ width: '95%', maxWidth: 420, paddingVertical:10, marginTop:15}}>  
        <View style={{ alignItems: 'center', marginVertical:5, borderBottomWidth:2, borderBottomColor:'#666'  }}>
            <Image 
              source={require('../../assets/images/logo.gif')}
              resizeMode={'contain'}
              style={{ width: 80, height: 80, padding:15}} 
            />
            <Text className='text-gray-900 font-SutonnyBold text-3xl mt-2'>ইউজার সাইন আপ</Text>
        </View>     
        <Card.Content style={{ gap: 1 }}>
            <View className='flex-row gap-2'>
            <ControlledInput 
              control={control}
              name={"nameBang"}
              placeholder={""}
              label={"বাংলা নাম"}
              inputAreaStyle={{width:'50%'}}
              style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
            /> 
            <ControlledInput 
              control={control}
              name={"nameEng"}
              placeholder={""}
              label={"ইংরেজি নাম"}
              inputAreaStyle={{width:'50%'}}
              style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
            />
            </View>


          <ControlledInput 
            control={control}
            name={"contact"}
            placeholder={""}
            label={"মোবাইল"}
            style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
          />
          
          <ControlledInput 
            control={control}
            name={"email"}
            placeholder={""}
            label={"ইমেইল"}
            style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
          />
          <View className='flex-row gap-2  pb-2'>
          <ControlledInput 
            control={control}
            name={"password"}
            placeholder={""}
            label={"পাসওয়ার্ড"}
            secureTextEntry={true}
            inputAreaStyle={{width:'50%'}}
            style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
          />
          <ControlledInput 
            control={control}
            name={"confirmPassword"}
            placeholder={""}
            label={"কনফার্ম পাসওয়ার্ড"}
            secureTextEntry={true}
            inputAreaStyle={{width:'50%'}}
            style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
          />
          </View>
          <View className='flex-row'>
          <CustomPicker 
            control={control}
            data={sefBranchData}
            name={'branch'}
            pickerTitle={'এসইফ শাখা'}
            pickerAreaStyle={{width:'50%'}}
          /> 
          <CustomPicker 
            control={control}
            data={classData}
            name={'relatedClass'}
            pickerTitle={'সম্পৃক্ত শ্রেণী'}
            pickerAreaStyle={{width:'50%'}}
          />           
          </View>
 
         
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between', marginTop: 20 }}>
            <Button style={{ flex: 1 }} onPress={handleSubmit(handleSingnup)} mode={"contained"}>
              সাইন আপ
            </Button>
          </View>
        </Card.Content>
        </Card>
        </AdmissionFormContainer>
        </>
  );
};

export default SignUpScreen;
