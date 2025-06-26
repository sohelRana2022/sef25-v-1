import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { useAuthContexts } from '../../contexts/AuthContext';
import { Card } from 'react-native-paper';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

interface ResultSheetPrimaryProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}
const ResultSheetPrimary: React.FC<ResultSheetPrimaryProps> = ({route}) => {
  const { item } = route.params;
  const { user } = useAuthContexts();


 const stuClass = item.sif.stuClass.trim();
  const isZeroClass = ['প্লে', 'নার্সারি'].includes(stuClass);
  const isLowerClass = ['প্রথম', 'দ্বিতীয়'].includes(stuClass);
  const isMiddleClass = ['তৃতীয়', 'চতুর্থ', 'পঞ্চম'].includes(stuClass);

  const subjects = [
    [1, !isZeroClass && !isLowerClass ? 'বাংলা প্রথম পত্র' : 'বাংলা', '100', item.marks.bangOneHighest, item.marks.bangOne],
    !isZeroClass && !isLowerClass && [2, 'বাংলা দ্বিতীয় পত্র', '50', item.marks.bangTwoHighest, item.marks.bangTwo],
    [3, isZeroClass && !isLowerClass ? 'ইংরেজি প্রথম পত্র' : 'ইংরেজি', '100', item.marks.engOneHighest, item.marks.engOne],
    !isZeroClass && !isLowerClass && [4, 'ইংরেজি দ্বিতীয় পত্র', '50', item.marks.engTwoHighest, item.marks.engTwo],
    [5, 'গণিত', '100', item.marks.mathHighest, item.marks.math],
    !isZeroClass && !isLowerClass && [6, 'সাধারণ বিজ্ঞান', '100', item.marks.sciHighest, item.marks.sci],
    !isZeroClass && !isLowerClass && [7, 'বাওবি', '100', item.marks.bobHighest, item.marks.bob],
    !isMiddleClass && [8, 'পরিবেশ পরিচিতি', '50', item.marks.envIntroHighest, item.marks.envIntro],
    [9, 'ধর্ম ও নৈতিক শিক্ষা', '100', item.marks.relHighest, item.marks.rel],
    !isMiddleClass && [10, 'সাধা. জ্ঞান স্পোকেন', '50', item.marks.gkHighest, item.marks.gk],
  ].filter(Boolean) as [number, string, string, number, number][];





console.log(item)
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
      <Card.Content>
        <Image
          source={require('../../assets/images/schoolLogo.png')}
          resizeMode="contain"
          style={styles.logo}
        />
          
          <Text className='text-black text-center font-HindBold'>{user?.branch+' শাখা'}</Text>
          <Text className='text-black text-center font-HindBold pb-1 mb-2 border-b'>
            {item.result.examName === "FSE"
              ? "প্রথম সাময়িক পরীক্ষা"
              : item.result.examName === "SSE"
                ? "দ্বিতীয় সাময়িক পরীক্ষা"
                : "বার্ষিক পরীক্ষা"}
          </Text>
          <Text className='text-black text-center font-HindBold text-base'>শিক্ষার্থী তথ্য</Text>

        {([
            [1, 'শিক্ষার্থী আইডি', item.sif.stuId],
            [2, 'রোল নং', item.sif.roll],
            [3, 'শিক্ষার্থীর নাম', item.sif.stuName],
            [4, 'পিতার নাম', item.sif.fatherName],
            [5, 'মাতার নাম', item.sif.motherName],
            [6, 'শ্রেণী', item.sif.stuClass],
            [7, 'শাখা', item.sif.section],
            [8, 'প্রাপ্ত নম্বর', item.result.totalMark],
            [9, 'মেধাক্রম', item.result.meritPosition],
            [10, '১০% নম্বর', item.result.totalMark10Percent]
          ] as [number, string, any][])
            .sort((a, b) => a[0] - b[0])
            .map(([_, label, value]: [number, string, any], idx: number) => (
              <View key={idx} style={styles.infoRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))} 
          
          <Text className='text-black text-center font-HindBold text-base pt-2'>বিষয়ভিত্তিক নম্বর</Text>
          <View style={styles.subjectRow}>
          <Text className='w-[50%] text-left font-HindSemiBold text-black'>বিষয়</Text>
          <Text className='w-[15%] text-center font-HindSemiBold text-black'>পূর্ণমান</Text>
          <Text className='w-[15%] text-center font-HindSemiBold text-black'>সর্বোচ্চ</Text>
          <Text className='w-[20%] text-center font-HindSemiBold text-black'>নিজ নম্বর</Text>
        </View>

        {subjects.map(([_, label, full, high, value], idx) => (
          <View key={idx} style={styles.subjectRow}>
            <Text className='w-[50%] text-left font-HindLight text-black'>{label}</Text>
            <Text className='w-[15%] text-center font-HindLight text-black'>{full}</Text>
            <Text className='w-[15%] text-center font-HindLight text-black'>{high}</Text>
            <Text className='w-[20%] text-center font-HindLight text-black'>{value}</Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: '90%', 
    paddingHorizontal: 10
  },
  logo: {
    width: 200,
    height: 40,
    alignSelf: 'center'
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 2,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  label: {
    color: 'black',
    fontFamily: 'HindSiliguri-SemiBold',
    width: '35%'
  },
  value: {
    color: 'black',
    fontFamily: 'HindSiliguri-Regular',
    width: '65%',
    textAlign: 'right'
  }
});
export default ResultSheetPrimary;
