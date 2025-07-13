import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Keyboard
} from 'react-native';
import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useAuthContexts } from '../../contexts/AuthContext';
import { Card } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ControlledInput from '../../comps/Inputs/ControlledInput';
import { resultInfoSchemaHigh, resultInfoTypeHigh } from '../../lib/zodschemas/zodSchemas';
import Carousel from 'react-native-reanimated-carousel';
import CustomPicker from '../../comps/pickers/CustomPicker';
import { classDataHigh, examData } from '../../lib/jsonValue/PickerData';
import { customOrder, SifData, MarkData, CombinedItem, relatedClassMap } from '../../lib/dTypes/resultTypes';
import { sortSubjects } from '../../lib/dTypes/sortSubject';
import { MarkSheet } from '../../comps/carousels/MarkSheet';
const { width } = Dimensions.get('window');

const toCombinedArray = (raw: Record<string, any>): CombinedItem[] => {
  const markKeys = Object.keys(raw).filter(k => k.startsWith('_'));

  const markItems: CombinedItem[] = markKeys.map(k => ({
    type: 'MARK',
    data: raw[k] as MarkData,
  }));

  const sifData: SifData = Object.fromEntries(
    Object.entries(raw).filter(([k]) => !k.startsWith('_'))
  ) as SifData;

  return [{ type: 'SIF', data: sifData }, ...markItems];
};


const GetResultHighSection = () => {
  const [resultData, setResultData] = useState<CombinedItem[]>([]);
  const [fetchError, setFetchError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const { user } = useAuthContexts();
  const toBnClass = (cls: string) => relatedClassMap[cls] ?? cls;

  const {
    control,
    watch,
    getValues,
    formState: { errors }
  } = useForm<resultInfoTypeHigh>({
    resolver: zodResolver(resultInfoSchemaHigh),
    defaultValues: {     
    stuClass: user?.role === 'admin'
      ? ''                 // admin হলে picker‑এ একটা ফাঁকা অপশন দেখাই
      : user?.relatedClass ?? '',
      examYear: new Date().getFullYear().toString(),
      examName: '',
      stuId: ''
    }
  });
  
  const watchExamName = watch('examName').toString();
  const watchStuClass = watch('stuClass').toString();
  const watchStuId = watch('stuId').toString();
const submit = async (data: resultInfoTypeHigh) => {
  setShowResult(true);
  const snapshot = await firestore()
    .collection('marksdata6to10')
    .where('examYear', '==', data.examYear)
    .where('examName', '==', data.examName)
    .where('stu_class', '==', toBnClass(data.stuClass))
    .where('stu_id', '==', data.stuId)
    .get();

  const docs = snapshot.docs.map(d => d.data());
  
  if (docs.length > 0) {
    setFetchError('');
    const formatted = toCombinedArray(docs[0]); // Assuming only 1 match
    const sorted = sortSubjects(formatted, customOrder); // ✅ এখানেই কাস্টম অর্ডার প্রয়োগ
    setResultData(sorted);
    setShowResult(false);
    return sorted;
  } else {
    setResultData([]);
    setFetchError('কোন ফলাফল পাওয়া যায়নি!');
    setShowResult(false);
    return;
  }
};

useEffect(() => {
  const fetchResult = async () => {
    if (watchStuId.length === 8) {
      Keyboard.dismiss();
      const currentValues = getValues();
      await submit(currentValues);
    } else {
      setResultData([]);
      setShowResult(false);
    }
  };

  fetchResult();
}, [watchStuId, watchStuClass, watchExamName]);


  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
      <Card style={{ width: width * 0.9, marginTop: 5 }}>
        <Card.Content>

        {
          user?.role == 'admin' ? 
          <CustomPicker 
            control={control}
            data={classDataHigh}
            name={'stuClass'}
            pickerTitle={'শ্রেণী'}
          />: null 
        }
          <CustomPicker 
            control={control}
            data={examData}
            name={'examName'}
            pickerTitle={'পরীক্ষার নাম'}
            pickerAreaStyle={{paddingTop:5}}
          />
          <ControlledInput
            control={control}
            name={'stuId'}
            placeholder=""
            label={"আইডি"}
            keyboardType='numeric'
            style={{
              backgroundColor: "#FFF",
              fontFamily: 'HindSiliguri-SemiBold',
              fontSize: 16
            }}
            onChangeText={() => setFetchError('')}
          />
          {fetchError !== '' && (
            <Text style={{ color: 'red', marginTop: 5, fontFamily: 'HindSiliguri-Light' }}>
              {fetchError}
            </Text>
          )}
        </Card.Content>
      </Card>

      {showResult && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      )}

       {resultData.length > 0 && (
        <>
          <Carousel
            autoPlay={false}
            autoPlayInterval={2000}
            data={ resultData}
            height={1000} // Adjust based on content
            loop={false}
            pagingEnabled={true}
            snapEnabled={true}
            width={width}
            style={{ alignSelf: 'center' }}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 1,
              parallaxScrollingOffset: 0,
            }}
            renderItem={({ item }) => <MarkSheet item={item} />}
          />
        </>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  loaderOverlay: {
    position: 'absolute',
    top: 220,
    right: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:1000
  }
});

export default GetResultHighSection;
