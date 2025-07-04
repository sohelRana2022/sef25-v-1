import {useEffect, useState} from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useAppContexts } from '../../contexts/AppContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAuthContexts } from '../../contexts/AuthContext';
import firestore from '@react-native-firebase/firestore';
import { UserfromServerType } from '../../lib/zodschemas/zodSchemas';
import LoaderAnimation from '../../comps/activityLoder/LoaderAnimation';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import { userDataType } from '../../lib/dTypes/userDataType';

interface AdminHomeProps {
    navigation: NativeStackNavigationProp<any, any>;
    route: RouteProp<any, any>;
}

 // approve user
  const approveUser = async (userId: string, isApprove: boolean) =>{
      try {
        await firestore()
          .collection('users')
          .doc(userId)
          .update({ isApprove });

    console.log('User approval status updated successfully');
    } catch (error) {
      console.error('Error updating user approval status:', error);
    }
  }



const AdminHome: React.FC<AdminHomeProps> = (props: AdminHomeProps) => {
  const {navigation, route} = props;
  const { user } = useAuthContexts();
  const { loader, setLoader } = useAppContexts();
  const [netStatus, setNetStatus] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<UserfromServerType[]>([]);

 

  const getData = async () => {
    setLoader(true);
    try {
        const snapshot = await firestore()
          .collection('users')
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
               nameBang:data.nameBang,
               nameEng: data.nameEng,
               password: data.password,
               role:data.role,
               contact:data.contact,
               title:data.title,
               relatedClass:data.relatedClass,
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
      await firestore().collection('users').doc(userId).update({ isApproved: isApprove });
      getData(); // refresh the list after update
    } catch (error) {
      console.error('Error updating user approval status:', error);
    }
  };




  return (
    <View style={styles.container}>
      {loader && (
        <View style={{ position: 'absolute', top: '45%', left: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <LoaderAnimation />
        </View>
      )}


{netStatus ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#444', fontFamily: 'HindSiliguri-SemiBold', fontSize: 20, paddingBottom: 20 }}>
            নেটওয়ার্ক কানেকশন সমস্যা!
          </Text>
          <Image
            source={require('../../assets/images/disconnect.png')}
            style={{ width: 200, height: 200 }}
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
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center'
  }
});


const UserTable = ({
  data,
  navigation,
  route,
  approveUser
}: {
  data: UserfromServerType[];
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
  approveUser: (userId: string, isApprove: boolean) => void;
}) => {
  const { user } = useAuthContexts();
  const [page, setPage] = useState<number>(0);
  const [numberOfItemsPerPageList] = useState([5,8,10]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );






  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, data.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <DataTable>
      <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
        <View style={{ width: 320 }}>
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(data.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${data.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
          />
        </View>
      </View>


        <DataTable.Header>
          <DataTable.Title style={{ flex: 0.5 }}>ক্রম</DataTable.Title>
          <DataTable.Title style={{ flex: 4 }}>ইউজারের নাম </DataTable.Title>
          <DataTable.Title style={{ flex: 1 }}>ভূমিকা</DataTable.Title>
          <DataTable.Title style={{ flex: 1 }}>একশন</DataTable.Title>
        </DataTable.Header>

      {data.slice(from, to).map((item, index) => (
        <DataTable.Row
        style={{backgroundColor: index % 2 === 0 ? '#FFF' : '#eee'}} 
        key={item.uid} 

        
        >
          <DataTable.Cell style={{ flex: 0.5 }}>{index+1}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 4}}>
           <View>
             <Text className='text-sm text-black font-HindSemiBold'>{item.nameBang}</Text>
            <Text className='text-xs text-gray-400 font-HindSemiBold'>{item.uid}</Text>
           </View>
            
            </DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.role}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>{item.isApproved ? 
            <TouchableOpacity
              onPress={()=>approveUser(item.uid,false)}
            >
              <Icon name="check" size={24} color="green" style={{width:'100%', textAlign:'center'}} />
            </TouchableOpacity> 
            :
            <TouchableOpacity
              onPress={()=>approveUser(item.uid,true)}
            >
            <Icon name="close" size={24} color="red" style={{width:'100%', textAlign:'center'}} /> 
            </TouchableOpacity>
            }
          </DataTable.Cell>
        </DataTable.Row>
      ))}

    </DataTable>
  );
};