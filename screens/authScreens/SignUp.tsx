import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import ControlledInput from '../../comps/Inputs/ControlledInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserInfoType, UserInfoSchema } from '../../lib/zodschemas/zodSchemas';
import { Button, Card } from 'react-native-paper';
import CustomPicker from '../../comps/pickers/CustomPicker';
import { classes} from '../../lib/jsonValue/PickerData';
import { useAuthContexts } from '../../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import AdmissionFormContainer from '../../comps/Containers/AdmissionFormContainer';
interface SignUpScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}


const SignUpScreen:React.FC<SignUpScreenProps>  = ({ navigation })=> {
  const {loader, setLoader, register } = useAuthContexts();

  const { control, handleSubmit, formState: { errors } } = useForm<UserInfoType>({
    resolver: zodResolver(UserInfoSchema),
    defaultValues:{
      role:'editor',
      title: 'সহকারী শিক্ষক',
      branch:'তারাকান্দি'
    }
  });
 



  const handleSingnup = async (data: UserInfoType) => {
    
    setLoader(true)

    try {
      // Step 1: Remove confirmPassword
      const { confirmPassword, ...rest } = data;

      // Step 2: Build data compatible with `UserfromServerType`
      const finalData = {
        ...rest,
        isApproved: false,
        imageId: '1FhLWX6sr_drBK1iyWO-ABQCX_Pj1v9nD',
        uid: '', // Will be replaced inside register()
      };

      // Step 3: Call the context-based register function
      const result = await register(finalData);


    } catch (error) {
      console.error('Signup failed:', error);
      Alert.alert('ত্রুটি', 'সাইন আপের সময় একটি সমস্যা হয়েছে!');
    } finally{
      setLoader(false)
    }
};


  return (
    

      <View
        style={{padding:40, backgroundColor:'#FFF', flex:1, justifyContent:'center'}}
      >
          {loader && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text className='text-base font-HindRegular text-[#FFF] pt-5'>অপেক্ষা করুন .....!</Text>
            </View>
          )}
          <View style={{ alignItems: 'center', marginVertical:5}}>
              <Image 
                source={require('../../assets/images/logo.gif')}
                resizeMode={'contain'}
                style={{ width: 80, height: 80, padding:15}} 
              />
              <Text className='text-gray-900 font-SutonnyBold text-3xl mt-2'>ইউজার সাইন আপ</Text>
          </View>     


         <ScrollView>
              <ControlledInput 
                control={control}
                name={"nameBang"}
                placeholder={""}
                label={"বাংলা নাম"}
                style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
              /> 
              <ControlledInput 
                control={control}
                name={"nameEng"}
                placeholder={""}
                label={"ইংরেজি নাম"}
                style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
              />
     
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

            <ControlledInput 
              control={control}
              name={"password"}
              placeholder={""}
              label={"পাসওয়ার্ড"}
              secureTextEntry={true}
              style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
            />
            <ControlledInput 
              control={control}
              name={"confirmPassword"}
              placeholder={""}
              label={"কনফার্ম পাসওয়ার্ড"}
              secureTextEntry={true}
              style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
            />
       
            <CustomPicker 
              control={control}
              data={classes}
              name={'relatedClass'}
              pickerTitle={'সম্পৃক্ত শ্রেণী'}
            />          
  
          
            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between', marginTop: 20 }}>
              <Button style={{ flex: 1 }} onPress={handleSubmit(handleSingnup)} mode={"contained"}>
                সাইন আপ
              </Button>
            </View>
          </ScrollView>
        </View>
       
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    loaderOverlay: {
    flex:1,  
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