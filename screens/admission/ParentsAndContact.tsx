import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, useTheme, HelperText } from 'react-native-paper';
import { Control, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ParentsAndContactInfoSchemama, ParentsAndContactInfoType } from '../../lib/zodschemas/zodSchemas';
import RadioButtons from '../../comps/Inputs/RadioButton';
import CustomPicker from '../../comps/pickers/CustomPicker';
import ControlledInput from '../../comps/Inputs/ControlledInput';
import { useAdmissionContexts } from '../../contexts/AdmissionContext';
import { classData, sectionData, sefBranchData } from '../../lib/jsonValue/PickerData';
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
  const {parentsAndContactInfo, setParentsAndContactInfo} = useAdmissionContexts();
  const [address, setAddress] = useState<address[]>([]);
  const { control, handleSubmit, formState: { errors } } = useForm<ParentsAndContactInfoType>({
    resolver: zodResolver(ParentsAndContactInfoSchemama),
    defaultValues: parentsAndContactInfo || {
      father_name: '',
      mother_name: '',
      contact_1: '',
      contact_2: '',
      address: '',
      village: ''
    }
  });
  const prev = () => {
    navigation.navigate('AdmissionHome');
  };
  const next = (data: ParentsAndContactInfoType) => {
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
    fetchData('address', setAddress);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 15, gap:10 }}>
    
      <Card style={{ backgroundColor: "#FFF" }}>
        <Card.Title title={'পিতামাতা সম্পর্কিত তথ্য'} />
        <Card.Content style={styles.cardContent}>
          <ControlledInput 
            control={control}
            name={"father_name"}
            placeholder={""}
            label={"পিতার নাম (বাংলা)"}
            style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
          />
          <ControlledInput 
            control={control}
            name={"mother_name"}
            placeholder={""}
            label={"মাতার নাম (বাংলা)"}
            style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
          />
        </Card.Content>
      </Card>
      <Card style={{ backgroundColor: "#FFF" }}>
        <Card.Title title={'যোগাযোগ তথ্য'} />
        <Card.Content style={styles.cardContent}>
          <ControlledInput 
            control={control}
            name={"contact_1"}
            placeholder={""}
            label={"পিতার মোবাইল নাম্বার"}
            keyboardType='numeric'
              style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
          />
          <ControlledInput 
            control={control}
            name={"contact_2"}
            placeholder={""}
            label={"মাতার মোবাইল নাম্বার"}
            keyboardType='numeric'
              style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
          />
          <ControlledInput 
            control={control}
            name={"address"}
            placeholder={""}
            label={"বিস্তারিত ঠিকানা"}
            multiline={true}
            style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
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
        </Card.Content>
      </Card>


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
  },
  button: {
    flex: 1,
  },
});
