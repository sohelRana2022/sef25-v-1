import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {DataTable} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useAppContexts} from '../../contexts/AppContext';
import {useAuthContexts} from '../../contexts/AuthContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {studentDataType, summary} from '../../lib/dTypes/StudentDataType';
import {summarizeByRefPerson} from '../../lib/helpers/helpers';
import Loading from '../../comps/activityLoder/Loading';

interface StatisticsScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
  StudentInfo: studentDataType;
}

const StatisticsScreen = (props: StatisticsScreenProps) => {
  const [summeryData, setSummeryData] = useState<summary[]>([]);

  const {navigation} = props;

  const {loader, setLoader} = useAppContexts();
  const {user} = useAuthContexts();

  const getChartData = async () => {
    setLoader(true);

    try {
      const currentYear = new Date().getFullYear();

      const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);

      if (!user?.branch) {
        return;
      }

      const snapshot = await firestore()
        .collection('newinfos')
        .where('sef_branch', '==', user.branch)
        .where('send_date', '>=', startOfYear)
        .orderBy('send_date', 'desc')
        .get();

      const newStuData: studentDataType[] = snapshot.docs.map(doc => {
        const data = doc.data();

        const send_date = data?.send_date?.toDate
          ? data.send_date.toDate()
          : new Date();

        return {
          uid: doc.id,
          stu_name_bn: data.stu_name_bn,
          stu_name_eng: data.stu_name_eng,
          stu_class: data.stu_class,
          stu_gender: data.stu_gender,
          stu_religion: data.stu_religion,
          prev_school: data.prev_school,
          posibility: data.posibility,
          father_name: data.father_name,
          mother_name: data.mother_name,
          contact_1: data.contact_1,
          contact_2: data.contact_2,
          address: data.address,
          village: data.village,
          ref_uid: data.ref_uid,
          ref_person: data.ref_person,
          sef_branch: data.sef_branch,
          is_admitted: data.is_admitted,
          send_date: send_date,
          add_point: data.add_point,
          is_active: data.is_active,
          valid_days: data.valid_days,
          total_add_fee: data.add_fee ?? 0,
          commission: data.commission ?? 0,
        };
      });

      const countedData = summarizeByRefPerson(newStuData);

      console.log('SUMMARY:', countedData);

      setSummeryData(countedData);
    } catch (error) {
      console.log('Statistics error:', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <View style={{flex: 1}}>
      {loader ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Loading />
        </View>
      ) : (
        <StatisticTable data={summeryData} navigation={navigation} />
      )}
    </View>
  );
};

export default StatisticsScreen;

type StatisticTableProps = {
  data: summary[];
  navigation: NativeStackNavigationProp<any, any>;
};

const StatisticTable = ({data, navigation}: StatisticTableProps) => {
  const {user} = useAuthContexts();

  /*
   * toral_add অনুযায়ী descending sorting।
   */

  const sortedData = [...data].sort((a, b) => {
    const aTotal = Number(a.total_add) || 0;
    const bTotal = Number(b.total_add) || 0;

    return bTotal - aTotal;
  });

  return (
    <View style={{flex: 1}}>
      {/* Fixed Header */}
      <DataTable>
        <DataTable.Header
          style={{
            backgroundColor: '#ddd',
          }}>
          <DataTable.Title style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text className="text-black font-HindSemiBold">ক্রম</Text>
            </View>
          </DataTable.Title>

          <DataTable.Title style={{flex: 3}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text className="text-black font-HindSemiBold">শিক্ষকের নাম</Text>
            </View>
          </DataTable.Title>

          <DataTable.Title style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text className="text-black font-HindSemiBold">মোট</Text>
            </View>
          </DataTable.Title>

          <DataTable.Title style={{flex: 1.5}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text className="text-black font-HindSemiBold">এই সপ্তাহ</Text>
            </View>
          </DataTable.Title>

          <DataTable.Title style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text className="text-black font-HindSemiBold">১০০%</Text>
            </View>
          </DataTable.Title>

          <DataTable.Title style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text className="text-black font-HindSemiBold">ভর্তি</Text>
            </View>
          </DataTable.Title>
        </DataTable.Header>
      </DataTable>

      {/* Scrollable Rows */}
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingBottom: 30,
        }}>
        <DataTable>
          {sortedData.map((item, index) => (
            <DataTable.Row
              key={item.ref_uid}
              style={{
                backgroundColor: index % 2 === 0 ? '#FFF' : '#eee',
              }}
              onPress={() => {
                if (user?.uid === item.ref_uid || user?.role === 'admin') {
                  navigation.navigate('NewStuInfoByTeacher', {
                    ref_uid: item.ref_uid,
                  });
                }
              }}>
              {/* ক্রম */}
              <DataTable.Cell style={{flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text className="text-black font-HindSemiBold">
                    {index + 1}
                  </Text>
                </View>
              </DataTable.Cell>

              {/* শিক্ষকের নাম */}
              <DataTable.Cell style={{flex: 3}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}>
                  <Text className="text-black font-HindSemiBold">
                    {item.ref_person}
                  </Text>
                </View>
              </DataTable.Cell>

              {/* মোট */}
              <DataTable.Cell style={{flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text className="text-black font-HindSemiBold">
                    {item.total}
                  </Text>
                </View>
              </DataTable.Cell>

              {/* এই সপ্তাহ */}
              <DataTable.Cell style={{flex: 1.5}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text className="text-black font-HindSemiBold">
                    {item.prev7DayaData}
                  </Text>
                </View>
              </DataTable.Cell>

              {/* ১০০% */}
              <DataTable.Cell style={{flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text className="text-black font-HindSemiBold">
                    {item.posibility100}
                  </Text>
                </View>
              </DataTable.Cell>

              {/* ভর্তি */}
              <DataTable.Cell style={{flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text className="text-black font-HindSemiBold">
                    {item.total_add}
                  </Text>
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
};
