import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  Pressable,
} from 'react-native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {formatedDateTime} from '../../lib/helpers/helpers';
import {studentDataType} from '../../lib/dTypes/StudentDataType';
import Student from '../../comps/animations/Student';

// --------------------------------------------------
// Stack Route Types
// --------------------------------------------------

type RootStackParamList = {
  NewStudentDataDetailScreen: {
    stu_data: studentDataType;
  };
};

type NewStudentDataDetailRouteProp = RouteProp<
  RootStackParamList,
  'NewStudentDataDetailScreen'
>;

type NewStudentDataDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NewStudentDataDetailScreen'
>;

interface NewStudentDataDetailScreenProps {
  route: NewStudentDataDetailRouteProp;
  navigation: NewStudentDataDetailNavigationProp;
}

// --------------------------------------------------
// Component
// --------------------------------------------------

const NewStudentDataDetailScreen: React.FC<NewStudentDataDetailScreenProps> = ({
  route,
}) => {
  const item = route.params.stu_data;

  // --------------------------------------------------
  // Call Function
  // --------------------------------------------------

  const handleCall = async (phone: string) => {
    if (!phone) {
      return;
    }

    // Remove spaces, -, brackets etc.
    const cleanPhone = phone.replace(/[\s\-()]/g, '');

    const phoneUrl = `tel:${cleanPhone}`;

    try {
      const supported = await Linking.canOpenURL(phoneUrl);

      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('দুঃখিত', 'এই ডিভাইসে ফোন করার সুবিধা পাওয়া যাচ্ছে না।');
      }
    } catch (error) {
      console.log('Phone call error:', error);

      Alert.alert('দুঃখিত', 'ফোন করার সময় একটি সমস্যা হয়েছে।');
    }
  };

  // --------------------------------------------------
  // Student Information
  // --------------------------------------------------

  const studentInfo: [number, string, any, boolean][] = [
    [1, 'শিক্ষার্থীর নাম', item.stu_name_bn, false],

    [2, 'পিতার নাম', item.father_name, false],

    [3, 'মাতার নাম', item.mother_name, false],

    [4, 'পিতার মোবাইল নাম্বার', item.contact_1, true],

    [5, 'মাতার মোবাইল নাম্বার', item.contact_2, true],

    [6, 'ভর্তি-ইচ্ছুক শ্রেণী', item.stu_class, false],

    [7, 'SEF-শাখা', item.sef_branch, false],

    [8, 'ভর্তির সম্ভাবনা', `${item.posibility}%`, false],

    [9, 'ঠিকানা', `${item.address}, ${item.village}`, false],

    [10, 'লিঙ্গ', item.stu_gender, false],

    [11, 'ধর্ম', item.stu_religion, false],

    [12, 'পূর্বের বিদ্যালয়ের নাম', item.prev_school, false],

    [13, 'তথ্য সংগ্রহের তারিখ', formatedDateTime(item.send_date), false],

    [14, 'তথ্য সংগ্রহকারী', item.ref_person, false],
  ];

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.studentContainer}>
          <Student />
        </View>

        <View style={styles.infoContainer}>
          {studentInfo.map(([id, label, value, isPhone]) => (
            <View key={id} style={styles.infoRow}>
              <Text style={styles.label}>{label}</Text>

              <View style={styles.valueContainer}>
                <Text style={styles.value} selectable>
                  {value}
                </Text>

                {isPhone && value && (
                  <Pressable
                    onPress={() => handleCall(String(value))}
                    hitSlop={10}
                    style={({pressed}) => [
                      styles.callButton,
                      pressed && styles.callButtonPressed,
                    ]}>
                    <Ionicons name="call-outline" size={19} color="#000" />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default NewStudentDataDetailScreen;

// --------------------------------------------------
// Styles
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  studentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 25,
    paddingVertical: 30,
    paddingBottom: 50,
  },

  infoContainer: {
    width: '100%',
    marginTop: 5,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingVertical: 8,

    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  label: {
    color: '#000',
    fontFamily: 'HindSiliguri-SemiBold',
    width: '40%',
  },

  valueContainer: {
    width: '60%',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',

    gap: 8,
  },

  value: {
    color: '#000',
    fontFamily: 'HindSiliguri-Regular',

    textAlign: 'right',

    flexShrink: 1,
  },

  callButton: {
    width: 34,
    height: 34,

    borderRadius: 17,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#f1f1f1',
  },

  callButtonPressed: {
    opacity: 0.5,
    transform: [{scale: 0.94}],
  },
});
