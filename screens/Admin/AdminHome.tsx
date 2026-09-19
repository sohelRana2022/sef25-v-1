import {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {useAppContexts} from '../../contexts/AppContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {useAuthContexts} from '../../contexts/AuthContext';
import firestore from '@react-native-firebase/firestore';
import {UserfromServerType} from '../../lib/zodschemas/zodSchemas';
import LoaderAnimation from '../../comps/activityLoder/LoaderAnimation';
import {DataTable} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import Loading from '../../comps/activityLoder/Loading';

interface AdminHomeProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

// approve user
const approveUser = async (userId: string, isApprove: boolean) => {
  try {
    await firestore().collection('users').doc(userId).update({isApprove});

    console.log('User approval status updated successfully');
  } catch (error) {
    console.error('Error updating user approval status:', error);
  }
};

const AdminHome: React.FC<AdminHomeProps> = (props: AdminHomeProps) => {
  const {user} = useAuthContexts();
  const {navigation, route} = props;
  const {loader, setLoader} = useAppContexts();
  const [netStatus, setNetStatus] = useState(false);
  const [data, setData] = useState<UserfromServerType[]>([]);

  const getData = async () => {
    setLoader(true);
    //console.log(user?.branch);
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('branch', '==', user?.branch)
        .orderBy('nameBang', 'asc')
        .get();

      const userData: UserfromServerType[] = snapshot.docs.map(doc => {
        const data = doc.data();

        return {
          uid: data.uid,
          branch: data.branch,
          isApproved: data.isApproved,
          imageId: data.imageId,
          email: data.email,
          nameBang: data.nameBang,
          nameEng: data.nameEng,
          password: data.password,
          role: data.role,
          contact: data.contact,
          title: data.title,
          relatedClass: data.relatedClass,
        };
      });

      setData(userData);
    } catch (err) {
      setNetStatus(true);
    } finally {
      setLoader(false);
      setNetStatus(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const approveUser = async (userId: string, isApprove: boolean) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .update({isApproved: isApprove});
      getData(); // refresh the list after update
    } catch (error) {
      console.error('Error updating user approval status:', error);
    }
  };

  return (
    <View style={styles.container}>
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

      {netStatus ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
            style={{width: 200, height: 200}}
            resizeMode="contain"
          />
        </View>
      ) : (
        <UserTable
          data={data}
          navigation={navigation}
          route={route}
          approveUser={approveUser}
        />
      )}
    </View>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

const UserTable = ({
  data,
  navigation,
  route,
  approveUser,
}: {
  data: UserfromServerType[];
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
  approveUser: (userId: string, isApprove: boolean) => void;
}) => {
  const {user} = useAuthContexts();
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([10]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0],
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, data.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <DataTable>
      <View
        style={{flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
        <View style={{width: 320}}>
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(data.length / itemsPerPage)}
            onPageChange={page => setPage(page)}
            label={`${from + 1}-${to} of ${data.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            //onItemsPerPageChange={onItemsPerPageChange}
            //showFastPaginationControls
            //selectPageDropdownLabel={'Rows per page'}
          />
        </View>
      </View>

      <DataTable.Header
        style={{backgroundColor: '#60c4d6', margin: 5, borderRadius: 15}}>
        <DataTable.Title style={{flex: 1}}>
          <Text selectable className="text-sm text-black font-HindSemiBold">
            {'ক্রমিক নং'}
          </Text>
        </DataTable.Title>
        <DataTable.Title style={{flex: 4}}>
          <Text selectable className="text-sm text-black font-HindSemiBold">
            {' ইউজারের নাম '}
          </Text>
        </DataTable.Title>
        <DataTable.Title style={{flex: 0.5}}>{''}</DataTable.Title>
      </DataTable.Header>

      {data.slice(from, to).map((item, index) => (
        <DataTable.Row
          style={{
            backgroundColor: index % 2 === 0 ? '#FFF' : '#dfdada',
            margin: 3,
            borderRadius: 15,
          }}
          key={item.uid}>
          <DataTable.Cell
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {index + 1}
          </DataTable.Cell>
          <DataTable.Cell style={{flex: 4}}>
            <View>
              <Text selectable className="text-sm text-black font-HindSemiBold">
                {item.nameBang + '    ' + item.contact}
              </Text>
              <Text
                selectable
                className="text-xs text-gray-400 font-HindSemiBold">
                {item.uid.slice(0, 3) +
                  '   ' +
                  item.email +
                  ' ' +
                  item.password}
              </Text>
            </View>
          </DataTable.Cell>

          <DataTable.Cell
            style={{flex: 0.5, justifyContent: 'center', alignItems: 'center'}}>
            {item.isApproved ? (
              <TouchableOpacity onPress={() => approveUser(item.uid, false)}>
                <Icon
                  name="check"
                  size={24}
                  color="green"
                  style={{width: '100%', textAlign: 'center'}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => approveUser(item.uid, true)}>
                <Icon
                  name="close"
                  size={24}
                  color="red"
                  style={{width: '100%', textAlign: 'center'}}
                />
              </TouchableOpacity>
            )}
          </DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
};
