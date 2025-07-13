import { Image, StyleSheet, Text, View, Keyboard } from "react-native";
import { CombinedItem } from "../../lib/dTypes/resultTypes";
import { width } from "../../lib/configs/Dimensions";
import { getSubjectCode, getSubjectName } from "../../lib/dTypes/subjectType";
let section: string = ''
const formatNumber = (val: number | null | undefined): string => {
  return typeof val === 'number' ? val.toFixed(2) : '0.00';
};
export const MarkSheet = ({ item }: { item: CombinedItem }) => {
   
    if (item.type === 'SIF') {
      const sif = item.data;
      section = sif.section;
     
    const sifInfo: [number, string, number | string][] = [
        [1, 'শিক্ষার্থী আইডি', sif.stu_id],
        [2, 'রোল নং', sif.roll],
        [3, 'শিক্ষার্থীর নাম', sif.stu_name_bn],
        [4, 'পিতার নাম', sif.father_name_bn],
        [5, 'মাতার নাম', sif.mother_name_bn],
        [6, 'শ্রেণী', sif.stu_class],
        [7, 'শাখা', sif.section],
        [8, 'প্রাপ্ত নম্বর', formatNumber(sif.tm)],
        [9, 'জিপিএ', formatNumber(sif.gpa)],
        [10, 'মেধাক্রম', sif.mp],
        ];

        if (['Nine', 'Ten'].includes(sif.stu_class)) {
        sifInfo.push([
            11,
            'চতুর্থ বিষয়',
            sif.sub_4 == 134
            ? 'কৃষি শিক্ষা'
            : sif.sub_4 == 138
            ? 'জীব বিজ্ঞান'
            : sif.sub_4 == 126
            ? 'উচ্চতর গণিত'
            : 'প্রযোজ্য নয়',
        ]);
        }
      return (
        <View style={styles.card}>
          <Image
            source={require('../../assets/images/schoolLogo.png')}
            resizeMode='contain'
            style={{ width: 220, height: 30, alignSelf: "center" }}
          />
          <Text className='text-black text-center text-sm font-HindBold py-1 mb-2 border-b'>
            {sif.examName === "FSE"
              ? "প্রথম সাময়িক পরীক্ষা"
              : sif.examName === "SSE"
                ? "দ্বিতীয় সাময়িক পরীক্ষা"
                : "বার্ষিক পরীক্ষা"}
          </Text>
          <Text className='text-black text-center self-center font-HindBold text-sm pt-1 w-20 border-b'>শিক্ষার্থী তথ্য</Text>
         
            {sifInfo
                .sort((a, b) => a[0] - b[0])
                .map(([_, label, value], idx) => (
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
          <Text className='text-black text-center self-center font-HindBold text-sm pt-1 w-220 border-b'>
            {`${getSubjectName(mark, section)}`}
          </Text>
          {([
            [1, 'বিষয় কোড', getSubjectCode(mark, section)],
            [2, 'বিষয়ের নাম', getSubjectName(mark, section)],
            [3, 'লিখিত', formatNumber(mark.cq)],
            [4, 'নৈর্ব্যক্তিক', formatNumber(mark.mcq)],
            [5, 'ব্যবহারিক', formatNumber(mark.prac)],
            [6, 'মোট এর ৭০%', formatNumber(mark.seventy)],
            [7, 'শৃঙ্খলা,হোমওয়ার্ক ২০%', formatNumber(mark.twenty)],
            [8, 'মাসিক ১০%', formatNumber(mark.ten)],
            [9, 'সর্বমোট', formatNumber(mark.total)],
            [10, 'জিপিএ', formatNumber(mark.gp)],
          ] as [number, string, any][]).sort((a, b) => a[0] - b[0])
            .map(([_, label, value]: [number, string, number | string], idx: number) => (
              <View key={idx} style={styles.infoRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
        </View>
      );
    }
  };

  
  const styles = StyleSheet.create({

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
    },
    card: {
      backgroundColor: '#FFF',
      paddingHorizontal: 30,
      borderRadius: 10,
      width: width * 0.9, // slightly smaller than screen for nice padding effect
      alignSelf: 'center', // center the card in Carousel
      height: '47%',
      marginVertical: 5,
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