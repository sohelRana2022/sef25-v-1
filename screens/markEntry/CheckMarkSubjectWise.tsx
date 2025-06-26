import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import { useAuthContexts } from '../../contexts/AuthContext';
import { Card, Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useAppContexts } from '../../contexts/AppContext';
import {
  getMarkSubjectWise,
} from '../../apis/config';
import {
  getSubjectMarkSchemaHigh,
  getSubjectMarkTypeHigh,
} from '../../lib/zodschemas/zodSchemas';
import CustomPicker from '../../comps/pickers/CustomPicker';
import { classData, subName } from '../../lib/jsonValue/PickerData';
import LoaderAnimation from '../../comps/activityLoder/LoaderAnimation';
const { width } = Dimensions.get('window');

type StudentMark = {
  stu_Id: string;
  roll: string | number;
  stu_Name_bn: string;
  cq: string | number;
  mcq: string | number;
  prac: string | number;
};

const CheckMarkSubjectWise = () => {
  const [allData, setAllData] = useState<StudentMark[]>([]);
  const [subjectName, setSubjectName] = useState('');
  const [fetchError, setFetchError] = useState('');
  const { loader, setLoader } = useAppContexts();
  const { user } = useAuthContexts();

  const relatedClassMap: Record<string, string> = {
    ষষ্ঠ: 'Six',
    অষ্টম: 'Eight',
    সপ্তম: 'Seven',
    নবম: 'Nine',
    দশম: 'Ten',
  };

  // Map relatedClass from user context or fallback to "N/A"
  const defaultClass = relatedClassMap[user?.relatedClass || ''] || 'N/A';

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<getSubjectMarkTypeHigh>({
    resolver: zodResolver(getSubjectMarkSchemaHigh),

  });

  // Watch class and subject values
  const selectedClass = watch('class');
  const selectedSubject = watch('subject');

  const Submit = async (data: getSubjectMarkTypeHigh) => {
    try {
      setLoader(true);
      setFetchError('');
      const res = await axios.get(
        `${getMarkSubjectWise}?class=${relatedClassMap[data.class]}&subject=${data.subject}`
      );
      if (res.data?.success && Array.isArray(res.data.data)) {
        setAllData(res.data.data);
        setSubjectName(res.data.subject_name);
      } else {
        setFetchError('এখনো ফলাফল প্রকাশিত হয়নি।');
        setAllData([]);
      }
    } catch (err) {
      setFetchError('নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      setAllData([]);
    } finally {
      setLoader(false);
    }
  };

    const listHeader=()=>{
      return(
        <View className='w-[95%] mx-2 flex-row px-2 py-2 bg-gray-300 my-1 justify-center items-center'>
 
            <Text className='w-[10%] text-gray-900 font-HindRegular text-center text-base' >{`রোল`}</Text>
            <Text className='w-[45%] text-gray-900 font-HindRegular text-left text-base' >{`শিক্ষার্থীর নাম`}</Text>
            <Text className='w-[13%] text-gray-900 font-HindRegular text-center text-base' >{`রচনা`}</Text>
            <Text className='w-[13%] text-gray-900 font-HindRegular text-center text-base' >{`নৈর্ব্যা.`}</Text>
            <Text className='w-[14%] text-gray-900 font-HindRegular text-center text-base' >{`ব্যাব.`}</Text>
       
          </View>
        )
    }

    const renderItem = ({ item }: { item: StudentMark; index: number })=>{
      return (
        <View className='w-[95%] mx-2 border-dashed border-b flex-row px-2 bg-gray-200 py-1 justify-center items-center'>
            <View
              className='flex-row'
            > 
              <Text className='w-[10%] text-gray-900  font-HindLight text-center text-base' >{`${item.roll}.`}</Text>
              <Text className='w-[45%] text-gray-900 font-HindLight text-left text-base'>{`${item.stu_Name_bn}`}</Text>
              <Text className='w-[15%] text-gray-900 font-HindLight text-center text-base'>{`${item.cq}`}</Text>
              <Text className='w-[15%] text-gray-900 font-HindLight text-center text-base'>{`${item.mcq}`}</Text>
              <Text className='w-[15%] text-gray-900 font-HindLight text-center text-base'>{`${item.prac}`}</Text>
            </View>
        </View>
      )
    }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <CustomPicker
            control={control}
            data={classData}
            name="class"
            pickerTitle="শ্রেণী"
          />

          <CustomPicker
            control={control}
            data={subName}
            name="subject"
            pickerTitle="বিষয়ের নাম"
          />

          {fetchError !== '' && (
            <Text style={styles.errorText}>{fetchError}</Text>
          )}

          <View style={styles.buttonRow}>
            <Button onPress={handleSubmit(Submit)} mode="contained" style={styles.button}>
              Send
            </Button>
          </View>
        </Card.Content>
      </Card>



      {/* If you want to display allData, add a FlatList or map here */}
       {loader ? 
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
       : 
            <FlatList
              data={allData}
              initialNumToRender={50}
              maxToRenderPerBatch={50}
              windowSize={50}
              renderItem={renderItem}
              ListHeaderComponent={listHeader}
              keyExtractor={(item) => item.stu_Id.toString()}
              showsVerticalScrollIndicator={false}
            />}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  card: {
    width: width * 0.95,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontFamily: 'HindSiliguri-SemiBold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  button: {
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
});

export default CheckMarkSubjectWise;
