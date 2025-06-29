import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useAuthContexts } from '../../contexts/AuthContext';
import { Card } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomPicker from '../../comps/pickers/CustomPicker';
import { examYear, examData } from '../../lib/jsonValue/PickerData';
import { resultInfoSchema, resultInfoType } from '../../lib/zodschemas/zodSchemas';
import axios from 'axios';
import { useAppContexts } from '../../contexts/AppContext';
import { Mark_API } from '../../apis/config';
import ErrMsg from '../../comps/Messages/ErrMsg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { width, height } from '../../lib/configs/Dimensions';

const ITEM_HEIGHT = height / 3;
export type ResultDataType = {
 finalResult: {
    FSE10percent: number;
    SSE10percent: number;
    aeTotal70percent: number;
    me10percent: number;
    subTotalMark: number;
    finalMeritPosition: number;
  };

  marks: {
    bangOne: number;
    bangOneHighest: number;
    bangTwo: number;
    bangTwoHighest: number;
    bob: number;
    bobHighest: number;
    engOne: number;
    engOneHighest: number;
    engTwo: number;
    engTwoHighest: number;
    envIntro: number;
    envIntroHighest: number;
    gk: number;
    gkHighest: number;
    math: number;
    mathHighest: number;
    rel: number;
    relHighest: number;
    sci: number;
    sciHighest: number;
  };
  result: {
    examName: string;
    meritPosition: number;
    totalMark: number;
    totalMark10Percent: number;
  };
  sif: {
    acYear: string;
    branch: string;
    fatherName: string;
    gender: string;
    motherName: string;
    religion: string;
    roll: number;
    section: string;
    stuClass: string;
    stuId: number;
    stuName: string;
  };
};

interface NewStuInfoScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}


const GetResultPrimary: React.FC<NewStuInfoScreenProps> = ({ navigation, route }) => {
  const [resultData, setResultData] = useState<ResultDataType[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { loader, setLoader } = useAppContexts();
  const [netStatus, setNetStatus] = useState(true);
  const { user } = useAuthContexts();
 
  const classMap = {
    "Play":"প্লে",
    "Nursery":"নার্সারি",
    "One":"প্রথম",
    "Two":"দ্বিতীয়",
    "Three":"তৃতীয়",
    "Four":"চতুর্থ",
    "Five":"পঞ্চম"
}

  const initialStuClass = (user?.relatedClass && classMap[user.relatedClass as keyof typeof classMap]) || 'N/A';


  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<resultInfoType>({
    resolver: zodResolver(resultInfoSchema),
    defaultValues: {
      examName: 'প্রথম সেমিষ্টার পরীক্ষা',
      stuClass: initialStuClass,
      examYear: new Date().getFullYear().toString(),
    },
  });

  const getResult = async (resultInfo: resultInfoType) => {
    try {
      setLoader(true);
      setFetchError(null);
      setResultData([]);

      const res = await axios.get(
        `${Mark_API}?stClass=${resultInfo.stuClass}&examName=${resultInfo.examName}&acYear=${resultInfo.examYear}`
      );
      if (res.data?.status) {
        setResultData(res.data?.students || []);
        setLoader(false);
      } else {
        setFetchError('দুঃখিত, আপনার অনুসন্ধান অনুযায়ী কোন তথ্য পাওয়া যায়নি !');
      }
    } catch (error) {
      console.log('Fetch error:', error);
      setNetStatus(false);
      setFetchError('নেটওয়ার্ক সমস্যার কারণে ডেটা আনা যায়নি।');
    } finally {
      setLoader(false);
    }
  };

 
const StudentCard = ({ item }: { item: typeof resultData[0] }) => {
   return (
    <Card style={styles.card}>
    <TouchableOpacity
        style={{position:'absolute', right:15, bottom:-20}}
        onPress={() =>
          user && (user.role === 'editor' || user.role === 'admin')
            ? navigation.navigate('ResultSheetPrimary', { ...route.params, item })
            : null
        }
    >
      <Text className='text-blue-500 border-b border-blue-500 font-HindSemiBold text-xs'>সম্পূর্ণ কার্ড প্রদর্শন</Text>
    </TouchableOpacity>

    
    
      <Card.Content>
        <Text className='text-black border-b border-gray-200 w-[100] self-center  text-center text-base font-HindSemiBold'>{'রেজাল্ট কার্ড'}</Text>

        {([
            [1, 'রোল নং', item.sif.roll],
            [2, 'শ্রেণী', item.sif.stuClass],
            [3, 'শিক্ষার্থীর নাম', item.sif.stuName],
            [4, 'প্রাপ্ত নম্বর', item.result.totalMark],
            [5, 'মেধাক্রম', item.result.meritPosition]
          ] as [number, string, any][])
            .sort((a, b) => a[0] - b[0])
            .map(([_, label, value]: [number, string, any], idx: number) => (
              <View key={idx} style={styles.infoRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
      </Card.Content>
    </Card>
    
  );
};

  return (
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center' }}>
      <View className='w-[100%] px-[25] py-[15] border-b border-2 border-gray-400 bg-white'>
          {fetchError && (
            <ErrMsg errText={fetchError} hideAfter={3000} fontFamily={'HindSiliguri-Light'}/>
          )}
     


          <CustomPicker control={control} data={examData} name="examName" pickerTitle="পরীক্ষার নাম" />
          <CustomPicker
            control={control}
            data={examYear}
            name="examYear"
            pickerTitle="পরীক্ষার সাল"
            onSelect={() => handleSubmit(getResult)()}
          />

      </View>
     
      {loader && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#666" />
          <Text className='text-base text-[#666] pt-5'>Wait! data loading .....</Text>
        </View>
      )}

    
      <FlatList
        data={resultData}
        keyExtractor={(item) => item.sif.stuId.toString()}
        renderItem={({ item }) => <StudentCard item={item} />}
        contentContainerStyle={{ paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      />

    </View>
    
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  card: {
    margin: 5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: width*0.9,
    height: ITEM_HEIGHT, 
    paddingHorizontal: 20,
    justifyContent:'center',
    alignItems:'center'
    
  },
  logo: {
    width: 200,
    height: 40,
    alignSelf: 'center',
    marginBottom: 5,
  },
  title: {
    fontFamily: 'HindSiliguri-Bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontFamily: 'HindSiliguri-SemiBold',
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
    textAlign:'center'
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  cell: {
    width: '25%',
    textAlign: 'center',
    fontFamily: 'HindSiliguri-SemiBold',
    color: 'black',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 250,
    left: 0,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
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
  }
});

export default GetResultPrimary;
