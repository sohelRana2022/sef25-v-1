import React from 'react';
import {View, Text} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {DataTable} from 'react-native-paper';
import {useAuthContexts} from '../../contexts/AuthContext';
import ThreeDots from '../../comps/Menu/ThreeDots';
import {StudentInfo} from '../../lib/dTypes/StudentDataType';

const subMenuItems = [
  {
    id: 'call',
    title: 'কল করুন',
    icon: 'phone-outline',
  },
  {
    id: 'view',
    title: 'বিস্তারিত দেখুন',
    icon: 'eye-outline',
  },
  {
    id: 'admission',
    title: 'ভর্তি করুন',
    icon: 'plus-circle-outline',
  },
  {
    id: 'delete',
    title: 'মুছে ফেলুন',
    icon: 'delete-outline',
    destructive: true,
  },
];

type NewStuInfoTableProps = {
  data: StudentInfo[];
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setDocuid: React.Dispatch<React.SetStateAction<string>>;
  handleDelete: (uid: string) => void;
  handleCall: (phone: string) => Promise<void>;
};

const NewStuInfoTable: React.FC<NewStuInfoTableProps> = ({
  data,
  navigation,
  setModalVisible,
  setDocuid,
  handleDelete,
  handleCall,
}) => {
  const {user} = useAuthContexts();

  const [page, setPage] = React.useState(0);

  const numberOfItemsPerPageList = [10, 8, 12];

  const [itemsPerPage, setItemsPerPage] = React.useState(
    numberOfItemsPerPageList[0],
  );

  const from = page * itemsPerPage;

  const to = Math.min((page + 1) * itemsPerPage, data.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <DataTable>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.max(1, Math.ceil(data.length / itemsPerPage))}
        onPageChange={newPage => setPage(newPage)}
        label={
          data.length === 0 ? '0 of 0' : `${from + 1}-${to} of ${data.length}`
        }
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        showFastPaginationControls
        selectPageDropdownLabel="Rows per page"
      />

      {data.slice(from, to).map((item, index) => (
        <DataTable.Row
          key={item.uid}
          style={{
            backgroundColor: index % 2 === 0 ? '#FFF' : '#eee',
            height: 60,
          }}>
          <DataTable.Cell style={{flex: 1}}>
            <View className="justify-center items-center flex-row">
              <Text className="text-sm pl-4 text-black font-HindSemiBold">
                {from + index + 1}
              </Text>
            </View>
          </DataTable.Cell>

          <DataTable.Cell style={{flex: 5}}>
            <View className="justify-center items-center flex-row">
              <View className="flex-col">
                <Text className="text-sm text-black font-HindSemiBold leading-5">
                  {item.stu_name_bn}
                </Text>

                <Text className="text-xs text-gray-400 font-HindSemiBold leading-5">
                  {`${item.stu_class} | ${item.father_name} | ${item.village}`}
                </Text>
              </View>
            </View>
          </DataTable.Cell>

          <DataTable.Cell
            style={{
              flex: 1,
              height: '100%',
              justifyContent: 'center',
            }}>
            <ThreeDots
              items={subMenuItems}
              onSelect={action => {
                switch (action.id) {
                  case 'call':
                    handleCall(item.contact_1);
                    break;

                  case 'view':
                    navigation.navigate('NewStudentDataDetailScreen', {
                      stu_data: {
                        ...item,
                        send_date: item.send_date?.toISOString(),
                      },
                    });
                    break;

                  case 'admission':
                    if (user?.role === 'admin') {
                      setDocuid(item.uid);
                      setModalVisible(true);
                    }
                    break;

                  case 'delete':
                    if (user?.role === 'admin') {
                      void handleDelete(item.uid);
                    }
                    break;

                  default:
                    break;
                }
              }}
            />
          </DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
};

export default NewStuInfoTable;
