import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  StyleSheet,
  Linking,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/AntDesign';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {useAppContexts} from '../../contexts/AppContext';
import {Button} from 'react-native-paper';
import {useAuthContexts} from '../../contexts/AuthContext';
import firestore from '@react-native-firebase/firestore';
import {addInfoSchema, addInfoType} from '../../lib/zodschemas/zodSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import RadioButtons from '../../comps/Inputs/RadioButton';
import {addPointData} from '../../lib/jsonValue/PickerData';
import ControlledInput from '../../comps/Inputs/ControlledInput';
import Loading from '../../comps/activityLoder/Loading';
import NewStuInfoTable from '../../comps/tables/NewStuInfoTable';
import {searchNewStudents} from '../../lib/helpers/SearchNewStu';
import {StudentInfo} from '../../lib/dTypes/StudentDataType';

interface NewStuInfoScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const NewStuInfoScreen: React.FC<NewStuInfoScreenProps> = ({
  navigation,
  route,
}) => {
  const {user} = useAuthContexts();
  const {loader, setLoader} = useAppContexts();

  const [netStatus, setNetStatus] = useState(false);

  // Admission modal
  const [modalVisible, setModalVisible] = useState(false);

  // Delete confirmation modal
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteUid, setDeleteUid] = useState('');

  const [searchText, setSearchText] = useState('');
  const [docuid, setDocuid] = useState('');
  const [data, setData] = useState<StudentInfo[]>([]);

  const {control, handleSubmit, reset} = useForm<addInfoType>({
    resolver: zodResolver(addInfoSchema),
    defaultValues: {
      total_add_fee: 0,
      add_point: 0,
      commission: 0,
      is_admitted: true,
      add_date: new Date(),
    },
  });

  /* -------------------------------------------------------------------------- */
  /* Reset Admission Modal                                                     */
  /* -------------------------------------------------------------------------- */

  const resetModalForm = () => {
    reset({
      total_add_fee: 0,
      add_point: 0,
      commission: 5,
      is_admitted: true,
      add_date: new Date(),
    });

    setDocuid('');
  };

  /* -------------------------------------------------------------------------- */
  /* Update Admission Information                                               */
  /* -------------------------------------------------------------------------- */

  const update = async (formData: addInfoType) => {
    if (!docuid) return;

    setLoader(true);

    try {
      const commission =
        (((formData.total_add_fee || 0) * (formData.commission || 0)) / 100) *
        (formData.add_point || 0);

      await firestore()
        .collection('newinfos')
        .doc(docuid)
        .update({
          ...formData,
          commission,
        });

      setModalVisible(false);
      resetModalForm();

      // চাইলে update-এর পর data refresh হবে
      await getData();
    } catch (error) {
      console.log('Update error:', error);
    } finally {
      setLoader(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Get Student Data                                                           */
  /* -------------------------------------------------------------------------- */

  const getData = async () => {
    if (!user?.branch) return;

    setLoader(true);
    setNetStatus(false);

    try {
      const currentYear = new Date().getFullYear();

      const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);

      let query = firestore()
        .collection('newinfos')
        .where('sef_branch', '==', user.branch)
        .where('send_date', '>=', startOfYear);

      // Editor হলে শুধু নিজের data
      if (user.role === 'editor') {
        query = query.where('ref_uid', '==', user.uid);
      }

      const snapshot = await query.orderBy('send_date', 'desc').get();

      const newStuData: StudentInfo[] = snapshot.docs.map(doc => {
        const studentData = doc.data();

        const timestamp = studentData.send_date;
        const jsDate = timestamp.toDate();

        return {
          ref_uid: studentData.ref_uid,
          uid: doc.id,
          stu_name_bn: studentData.stu_name_bn,
          stu_name_eng: studentData.stu_name_eng,
          stu_class: studentData.stu_class,
          stu_gender: studentData.stu_gender,
          stu_religion: studentData.stu_religion,
          prev_school: studentData.prev_school,
          posibility: studentData.posibility,
          father_name: studentData.father_name,
          mother_name: studentData.mother_name,
          contact_1: studentData.contact_1,
          contact_2: studentData.contact_2,
          address: studentData.address,
          village: studentData.village,
          ref_person: studentData.ref_person,
          sef_branch: studentData.sef_branch,
          is_admitted: studentData.is_admitted,
          send_date: jsDate,
          add_point: studentData.add_point,
          is_active: studentData.is_active,
          valid_days: studentData.valid_days,
        };
      });

      setData(newStuData);
    } catch (err) {
      console.log('getData error:', err);
      setNetStatus(true);
    } finally {
      setLoader(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Initial Data Fetch                                                         */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (user?.branch) {
      getData();
    }
  }, [user?.branch]);

  /* -------------------------------------------------------------------------- */
  /* Search                                                                     */
  /* -------------------------------------------------------------------------- */

  const filteredData = useMemo(() => {
    return searchNewStudents(data, searchText);
  }, [searchText, data]);

  /* -------------------------------------------------------------------------- */
  /* Delete Button Press                                                        */
  /* -------------------------------------------------------------------------- */

  const handleDelete = (uid: string) => {
    setDeleteUid(uid);
    setDeleteConfirmVisible(true);
  };

  /* -------------------------------------------------------------------------- */
  /* Confirm Delete                                                             */
  /* -------------------------------------------------------------------------- */

  const confirmDelete = async () => {
    if (!deleteUid) return;

    setLoader(true);

    try {
      await firestore().collection('newinfos').doc(deleteUid).delete();

      // Local state থেকে delete করা
      setData(prevData => prevData.filter(item => item.uid !== deleteUid));

      // Modal close
      setDeleteConfirmVisible(false);
      setDeleteUid('');
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setLoader(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Cancel Delete                                                              */
  /* -------------------------------------------------------------------------- */

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setDeleteUid('');
  };

  /* -------------------------------------------------------------------------- */
  /* Phone Call                                                                 */
  /* -------------------------------------------------------------------------- */

  const handleCall = async (phone: string) => {
    const url = `tel:${phone}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Unable to open dialer:', error);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      {/* -------------------------------------------------------------------- */}
      {/* Search Area                                                          */}
      {/* -------------------------------------------------------------------- */}

      <View className="flex-row border border-gray-300 mx-4 my-2 rounded-full items-center px-3 bg-gray-300 justify-center">
        <View className="w-1/10">
          <Icons
            name="search"
            style={{
              color: '#444',
              fontSize: 30,
            }}
          />
        </View>

        <View className="w-4/5">
          <TextInput
            value={searchText}
            placeholder="অনুসন্ধান করুন ..."
            onChangeText={setSearchText}
            placeholderTextColor="rgba(16, 36, 33, 0.6)"
            underlineColorAndroid="transparent"
            selectionColor="rgba(0, 0, 0, 0.5)"
            style={{
              fontFamily: 'HindSiliguri-Regular',
              fontSize: 15,
              color: '#000',
            }}
          />
        </View>

        <View className="w-1/10">
          <Text className="text-gray-900 text-right text-base font-HindSemiBold">
            {filteredData?.length || ''}
          </Text>
        </View>
      </View>

      {/* -------------------------------------------------------------------- */}
      {/* Loading                                                               */}
      {/* -------------------------------------------------------------------- */}

      {loader && (
        <View
          style={{
            position: 'absolute',
            top: '45%',
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
          <Loading />
        </View>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Network Error / Student Table                                         */}
      {/* -------------------------------------------------------------------- */}

      {netStatus ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#444',
              fontFamily: 'HindSiliguri-SemiBold',
              fontSize: 20,
              paddingBottom: 20,
            }}>
            নেটওয়ার্ক কানেকশন সমস্যা!
          </Text>

          <Image
            source={require('../../assets/images/disconnect.png')}
            style={{
              width: 200,
              height: 200,
            }}
            resizeMode="contain"
          />
        </View>
      ) : (
        <NewStuInfoTable
          data={searchText === '' ? data : filteredData}
          navigation={navigation}
          route={route}
          setModalVisible={setModalVisible}
          setDocuid={setDocuid}
          handleDelete={handleDelete}
          handleCall={handleCall}
        />
      )}

      {/* ==================================================================== */}
      {/* Admission Modal                                                       */}
      {/* ==================================================================== */}

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetModalForm();
        }}>
        <View style={styles.modalBackground}>
          <View className="w-[90%] bg-white py-5 px-10 rounded-lg justify-center">
            {loader && (
              <View
                style={{
                  position: 'absolute',
                  top: 50,
                  right: 170,
                  zIndex: 1000,
                }}>
                <Loading />
              </View>
            )}

            <TouchableOpacity
              className="absolute top-5 right-5"
              onPress={() => {
                setModalVisible(false);
                resetModalForm();
              }}>
              <Icon name="close" size={25} color="red" />
            </TouchableOpacity>

            <Text className="text-base text-black font-HindSemiBold text-center py-2">
              ভর্তি কাউন্ট ফরম
            </Text>

            <ControlledInput
              control={control}
              name="total_add_fee"
              placeholder=""
              label="সর্বমোট ভর্তি-ফি"
              keyboardType="numeric"
              style={{
                backgroundColor: '#FFF',
                fontFamily: 'HindSiliguri-SemiBold',
                marginBottom: 20,
              }}
            />

            <ControlledInput
              control={control}
              name="commission"
              placeholder=""
              label="কমিশন (%)"
              keyboardType="numeric"
              style={{
                backgroundColor: '#FFF',
                fontFamily: 'HindSiliguri-SemiBold',
                marginBottom: 20,
              }}
            />

            <RadioButtons
              control={control}
              name="add_point"
              labelTitle="ভর্তিতে অবদান রাখা শিক্ষক সংখ্যা"
              direction="column"
              items={addPointData}
            />

            <Button
              className="my-5"
              onPress={handleSubmit(update)}
              mode="contained">
              কাউন্ট নিশ্চিত করুন
            </Button>
          </View>
        </View>
      </Modal>

      {/* ==================================================================== */}
      {/* Delete Confirmation Modal                                              */}
      {/* ==================================================================== */}

      <Modal
        transparent
        animationType="fade"
        visible={deleteConfirmVisible}
        onRequestClose={cancelDelete}>
        <View style={styles.modalBackground}>
          <View className="w-[85%] bg-white rounded-2xl px-6 py-7">
            {/* Warning Icon */}
            <View className="items-center mb-3">
              <Icon name="exclamationcircleo" size={48} color="#DC2626" />
            </View>

            {/* Title */}
            <Text className="text-xl text-black font-HindSemiBold text-center">
              তথ্য মুছে ফেলবেন?
            </Text>

            {/* Warning Text */}
            <Text className="text-base text-gray-600 font-HindRegular text-center mt-2 leading-6">
              আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীর তথ্য মুছে ফেলতে চান?
              {'\n'}
              মুছে ফেলার পর তথ্যটি আর ফিরে পাওয়া যাবে না।
            </Text>

            {/* Buttons */}
            <View className="flex-row mt-6">
              <Button
                mode="outlined"
                onPress={cancelDelete}
                style={{
                  flex: 1,
                  marginRight: 6,
                }}
                contentStyle={{
                  paddingVertical: 3,
                }}>
                বাতিল
              </Button>

              <Button
                mode="contained"
                buttonColor="#DC2626"
                onPress={confirmDelete}
                style={{
                  flex: 1,
                  marginLeft: 6,
                }}
                contentStyle={{
                  paddingVertical: 3,
                }}>
                মুছে ফেলুন
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default NewStuInfoScreen;

/* ========================================================================== */
/* Styles                                                                     */
/* ========================================================================== */

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderColor: '#000',
    borderRadius: 8,
  },

  buttonText: {
    color: '#000',
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
