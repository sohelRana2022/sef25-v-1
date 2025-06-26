import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { useAuthContexts } from '../../contexts/AuthContext';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { width } from '../../lib/configs/Dimensions';

// Define the student data structure
export interface StudentType {
  stu_id: string;
  roll: string;
  stu_name_bn: string;
  father_name_bn: string;
  mother_name_bn: string;
  stu_class: string;
  section: string;
  stu_gender: string;
  st_religion: string;
  // add more fields here if needed
};

// Define your stack params including the StudentDetails screen params
type RootStackParamList = {
  StudentDetails: {
    item: StudentType;
  };
  // add other routes here if needed
};

// Type for route and navigation props for this screen
type StudentDetailsRouteProp = RouteProp<RootStackParamList, 'StudentDetails'>;
type StudentDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'StudentDetails'
>;

interface StudentDetailsProps {
  route: StudentDetailsRouteProp;
  navigation: StudentDetailsNavigationProp;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ route, navigation }) => {
  const { item } = route.params;
  const { user } = useAuthContexts();

  return (
    <ScrollView>
      <View style={{ marginHorizontal: 12, alignItems: 'center', paddingTop: 8 }}>
        <Card style={{ width: '100%', margin: 5, padding: 10 }}>
          <Card.Title
            title="শিক্ষার্থীর তথ্য"
            titleStyle={{ textAlign: 'center' }}
            titleVariant="displayLarge"
          />
          <Card.Content>
            {([
              [1, 'শিক্ষার্থী আইডি', item?.stu_id],
              [2, 'রোল নং', item?.roll],
              [3, 'শিক্ষার্থীর নাম', item?.stu_name_bn],
              [4, 'পিতার নাম', item?.father_name_bn],
              [5, 'মাতার নাম', item?.mother_name_bn],
              [6, 'শ্রেণী', item?.stu_class],
              [7, 'শাখা', item?.section],
              [8, 'লিঙ্গ', item?.stu_gender],
              [9, 'ধর্ম', item?.st_religion],
            ] as [number, string, any][]).map(([_, label, value], idx) => (
              <View key={idx} style={styles.infoRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default StudentDetails;

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    color: 'black',
    fontFamily: 'HindSiliguri-SemiBold',
    width: '40%',
  },
  value: {
    color: 'black',
    fontFamily: 'HindSiliguri-Regular',
    width: '50%',
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#FFF',
    paddingHorizontal: 30,
    borderRadius: 10,
    width: width * 0.9,
    alignSelf: 'center',
    marginVertical: 5,
    paddingVertical: 5,
  },
});
