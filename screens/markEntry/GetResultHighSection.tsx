import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Image,
  Keyboard
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useAuthContexts } from '../../contexts/AuthContext';
import { Card } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ControlledInput from '../../comps/Inputs/ControlledInput';
import axios from 'axios';
import { useAppContexts } from '../../contexts/AppContext';
import { GET_RESULT_API, IMG_API } from '../../apis/config';
import { resultInfoSchemaH, resultInfoTypeH } from '../../lib/zodschemas/zodSchemas';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const formatNumber = (val: number | null | undefined): string => {
  return typeof val === 'number' ? val.toFixed(2) : '0.00';
};

type SifItem = {
  type: 'SIF';
  data: {
    stu_id: string;
    roll: number;
    stu_name_bn: string;
    father_name_bn: string;
    mother_name_bn: string;
    stu_class: string;
    section: string;
    stu_gender: string;
    st_religion: string;
    totalMark?: number | null;
    gpa?: number | null;
    meritPosition?: number | string | null;
    sub_4?: number | string | null;
    examName?: string;
  };
};

type MarkItem = {
  type: 'MARK';
  data: {
    gp: number | null;
    mcq: number | null;
    prac: number | null;
    seventy: number | null;
    subject_code: string;
    subject_name: string;
    ten: number | null;
    total: number | null;
    twenty: number | null;
    writen: number | null;
  };
};

type CombinedItem = SifItem | MarkItem;

const GetResultHighSection = () => {
  const [allData, setAllData] = useState<any[]>([]);
  const [resultData, setResultData] = useState<any | null>(null);
  const [fetchError, setFetchError] = useState('');
  const [showResult, setShowResult] = useState(false);

  const { loader, setLoader } = useAppContexts();
  const { user } = useAuthContexts();

  const getSubjectName = (
    mark: { subject_code: string; subject_name: string },
    section: string
  ): string => {
    if (section === "মানবিক" && mark.subject_code === '150') {
      return "সাধারণ বিজ্ঞান";
    } else if (section === "মানবিক" && mark.subject_code === '136') {
      return "ভূগোল ও পরিবেশ";
    } else if (section === "মানবিক" && mark.subject_code === '137') {
      return "অর্থনীতি";
    } else if (section === "মানবিক" && mark.subject_code === '138') {
      return "ইতিহাস ও বিশ্বসভ্যতা";
    } else if (section === "মানবিক" && mark.subject_code === '126') {
      return "কৃষি শিক্ষা";
    }
    return mark.subject_name;
  };

  const getSubjectCode = (
    mark: { subject_code: string; subject_name: string },
    section: string
  ): string => {
    if (section === "মানবিক" && mark.subject_code === '150') {
      return "127";
    } else if (section === "মানবিক" && mark.subject_code === '136') {
      return "110";
    } else if (section === "মানবিক" && mark.subject_code === '137') {
      return "141";
    } else if (section === "মানবিক" && mark.subject_code === '138') {
      return "153";
    } else if (section === "মানবিক" && mark.subject_code === '126') {
      return "134";
    }
    return mark.subject_code.toString();
  };

  const relatedClassMap: Record<string, string> = {
    "ষষ্ঠ": "Six",
    "অষ্টম": "Eight",
    "সপ্তম": "Seven",
    "নবম": "Nine",
    "দশম": "Ten"
  };

  const defaultClass = relatedClassMap[user?.relatedClass || ""] || "N/A";

  const renderItem = ({ item }: { item: CombinedItem }) => {
    if (item.type === 'SIF') {
      const sif = item.data;
      return (
        <View style={styles.card}>
          <Image
            source={require('../../assets/images/schoolLogo.png')}
            resizeMode='contain'
            style={{ width: 250, height: 40, alignSelf: "center" }}
          />
          <Text className='text-black text-center font-HindBold pt-1 pb-1 mb-4 border-b'>
            {sif.examName === "FSE"
              ? "প্রথম সাময়িক পরীক্ষা"
              : sif.examName === "SSE"
                ? "দ্বিতীয় সাময়িক পরীক্ষা"
                : "বার্ষিক পরীক্ষা"}
          </Text>
          <Text className='text-black text-center font-HindBold p-1 text-xl'>শিক্ষার্থী তথ্য</Text>
          {([
            [1, 'শিক্ষার্থী আইডি', sif.stu_id],
            [2, 'রোল নং', sif.roll],
            [3, 'শিক্ষার্থীর নাম', sif.stu_name_bn],
            [4, 'পিতার নাম', sif.father_name_bn],
            [5, 'মাতার নাম', sif.mother_name_bn],
            [6, 'শ্রেণী', sif.stu_class],
            [7, 'শাখা', sif.section],
            [8, 'লিঙ্গ', sif.stu_gender],
            [9, 'ধর্ম', sif.st_religion],
            [10, 'প্রাপ্ত নম্বর', formatNumber(sif.totalMark)],
            [11, 'জিপিএ', formatNumber(sif.gpa)],
            [12, 'মেধাক্রম', sif.meritPosition],
            [13, 'চতুর্থ বিষয়',
              sif.sub_4 === 134 ? "কৃষি শিক্ষা" :
                sif.sub_4 === 138 ? "জীব বিজ্ঞান" :
                  sif.sub_4 === 126 ? "উচ্চতর গণিত" : "প্রযোজ্য নয়"],
          ] as [number, string, any][])
            .sort((a, b) => a[0] - b[0])
            .map(([_, label, value]: [number, string, any], idx: number) => (
              <View key={idx} style={styles.infoRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
        </View>
      );
    } else {
      const mark = item.data;
      return (
        <View style={styles.card}>
          <Text className='text-black text-center font-HindBold pt-2 pb-2 mt-5 mb-5 text-xl'>
            {`${getSubjectName(mark, resultData.SIF.section)} নম্বরপত্র`}
          </Text>
          {([
            [1, 'বিষয়কোড', getSubjectCode(mark, resultData.SIF.section)],
            [2, 'বিষয়ের নাম', getSubjectName(mark, resultData.SIF.section)],
            [3, 'লিখিত', formatNumber(mark.writen)],
            [4, 'নৈর্ব্যক্তিক', formatNumber(mark.mcq)],
            [5, 'ব্যবহারিক', formatNumber(mark.prac)],
            [6, 'মোট এর ৭০%', formatNumber(mark.seventy)],
            [7, 'শৃঙ্খলা,হোমওয়ার্ক ২০%', formatNumber(mark.twenty)],
            [8, 'মাসিক ১০%', formatNumber(mark.ten)],
            [9, 'সর্বমোট', formatNumber(mark.total)],
            [10, 'জিপিএ', formatNumber(mark.gp)],
          ] as [number, string, any][]).sort((a, b) => a[0] - b[0])
            .map(([_, label, value]: [number, string, any], idx: number) => (
              <View key={idx} style={styles.infoRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
        </View>
      );
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<resultInfoTypeH>({
    resolver: zodResolver(resultInfoSchemaH),
    defaultValues: {
      sefBranch: user?.branch || '',
      class: defaultClass,
      examYear: new Date().getFullYear().toString(),
      examName: '',
      studentId: ''
    }
  });

  const watchStudentId = watch('studentId');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoader(true);
        const res = await axios.get(`${GET_RESULT_API}?class=${defaultClass}`);
        if (res.data?.success && Array.isArray(res.data.data)) {
          setAllData(res.data.data);
        } else {
          setFetchError('এখনো ফলাফল প্রকাশিত হয়নি।');
        }
      } catch (err) {
        setFetchError('নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      } finally {
        setLoader(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (watchStudentId.length === 8) {
       Keyboard.dismiss();
      const match = allData.find(
        (item) => Number(item?.SIF?.stu_id) === Number(watchStudentId)
      );
      if (match) {
        setResultData(match);
        setShowResult(true);
        setFetchError('');
      } else {
        setResultData(null);
        setShowResult(false);
        setFetchError('আপনার দেওয়া আইডি অনুসারে ফলাফল পাওয়া যায়নি!');
      }
    } else {
      setResultData(null);
      setShowResult(false);
    }
  }, [watchStudentId]);

  // ✅ Combine data for carousel
  const combinedData: CombinedItem[] =
    resultData && resultData.SIF && Array.isArray(resultData.marks)
      ? [{ type: 'SIF', data: resultData.SIF }, ...resultData.marks.map((item: any) => ({ type: 'MARK', data: item }))]
      : [];

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
      <Card style={{ width: width * 0.9, marginTop: 10 }}>
        <Card.Content>
          <ControlledInput
            control={control}
            name={'studentId'}
            placeholder=""
            label={"আইডি"}
            keyboardType='numeric'
            style={{
              backgroundColor: "#FFF",
              fontFamily: 'HindSiliguri-SemiBold',
              fontSize: 16
            }}
            onChangeText={() => setFetchError('+')}
          />
          {fetchError !== '' && (
            <Text style={{ color: 'red', marginTop: 5, fontFamily: 'HindSiliguri-SemiBold' }}>
              {fetchError}
            </Text>
          )}
        </Card.Content>
      </Card>

      {loader && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      )}

      {combinedData.length > 0 && (
        <>
          <Carousel
            autoPlay={false}
            autoPlayInterval={2000}
            data={combinedData}
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
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  resultCard: {
    width: width * 0.8,
    marginHorizontal: 10,
    padding: 10
  },
  closeButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
  card: {
    backgroundColor: '#FFF',
    paddingHorizontal: 30,
    borderRadius: 10,
    width: width * 0.9, // slightly smaller than screen for nice padding effect
    alignSelf: 'center', // center the card in Carousel
    height: '60%',
    marginVertical: 10,
    paddingVertical: 10
  },
  subject: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: "#FFF"
  },
  flatListContainer: {
    paddingVertical: 10,
  }
});

export default GetResultHighSection;
