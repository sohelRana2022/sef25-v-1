import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator} from 'react-native';
import { Card, Button, useTheme, HelperText } from 'react-native-paper';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ParentsAndContactInfoSchemama, ParentsAndContactInfoType } from '../../lib/zodschemas/zodSchemas';
import CustomPicker from '../../comps/pickers/CustomPicker';
import ControlledInput from '../../comps/Inputs/ControlledInput';
import { useAdmissionContexts } from '../../contexts/AdmissionContext';
import { getDataFromSheet } from '../../lib/helpers/helpers';
import { INFO_API_URL } from '../../apis/config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
type ParentsAndContactProps = {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}
type address = {
  id: number,
  label: string,
  value: string
}
const ParentsAndContact:React.FC<ParentsAndContactProps> = ({ navigation, route }) => {
  const {loader, setLoader, parentsAndContactInfo, setParentsAndContactInfo} = useAdmissionContexts();
  const [address, setAddress] = useState<address[]>([]);
  const { control, handleSubmit, formState: { errors } } = useForm<ParentsAndContactInfoType>({
    resolver: zodResolver(ParentsAndContactInfoSchemama),
    defaultValues: parentsAndContactInfo || {
      father_name: '',
      mother_name: '',
      contact_2: '',
      address: '',
      village: ''
    }
  });
  const prev = () => {
    navigation.navigate('AdmissionHome');
  };
  const next = (data: ParentsAndContactInfoType) => {
    setLoader(true)
    setParentsAndContactInfo(data);
    navigation.navigate('CheckAllDataAndSubmit'); // Replace with the actual next screen's name
    
  };

  const fetchData = async (sheetName: string, setData: (data: any) => void) => {
    const data = await getDataFromSheet(`${INFO_API_URL}?sheetName=${sheetName}&action=read&route=info`);
    setData(data ? data : [
      {id:1,label:'দোলভিটী',value:'দোলভিটী'},
      {id:2,label:'তারাকান্দি',value:'তারাকান্দি'},
      {id:3,label:'পাখীমারা',value:'পাখীমারা'},
      {id:4,label:'চরপাড়া',value:'চরপাড়া'}
    ]);
  };

  useEffect(() => {
    setLoader(false)
    fetchData('address', setAddress);
  }, []);
  return (
    <View style={{flex: 1, justifyContent:'center', alignItems:'center', alignContent:'center', backgroundColor:"#FFF"}}>
      {loader && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}
      
      
      <View style={{ width:'80%'}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingVertical:10}}
          >
            <Text className='text-lg text-black font-HindSemiBold text-center'>পিতামাতা সম্পর্কিত তথ্য</Text>

            <ControlledInput 
              control={control}
              name={"father_name"}
              placeholder={""}
              label={"পিতার নাম"}
              style={{ fontFamily: 'HindSiliguri-SemiBold', backgroundColor:"#FFF"}}
            />          

            <ControlledInput 
              control={control}
              name={"mother_name"}
              placeholder={""}
              label={"মাতার নাম"}
              style={{fontFamily: 'HindSiliguri-SemiBold', backgroundColor:"#FFF"}}
            />

            <ControlledInput 
              control={control}
              name={"contact_2"}
              placeholder={""}
              label={"মাতার মোবাইল নাম্বার"}
              keyboardType='numeric'
                style={{ fontFamily: 'HindSiliguri-SemiBold', backgroundColor:"#FFF"}}
            />
            <ControlledInput 
              control={control}
              name={"address"}
              placeholder={""}
              label={"বিস্তারিত ঠিকানা"}
              multiline={true}
              style={{ fontFamily: 'HindSiliguri-SemiBold', backgroundColor:"#FFF"}}
            />
            <CustomPicker 
              control={control}
              data={[...address.map((item: any) => ({
                id: item.id,
                label: item.label,       // Assuming section items have an `id` field
                value: item.value.toString(), // Assuming section items have a `value` field
              }))]}
              name={'village'}
              pickerTitle={'গ্রাম / এলাকা / মহল্লা'}
            />



          <View style={styles.buttonContainer}>
            <Button style={styles.button} onPress={prev} mode={"contained"}>
              ফিরুন
            </Button>
            <Button style={styles.button} onPress={handleSubmit(next)} mode={"contained"}>
              পরবর্তী
            </Button>
          </View>

      </ScrollView>
      </View>
  </View>
  );
};

export default ParentsAndContact;

const styles = StyleSheet.create({

  cardContent: {
    gap: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'space-between',
    marginTop:20
  },
  button: {
    flex: 1,
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
    zIndex:100
  }
});
