import { createStackNavigator } from '@react-navigation/stack';
import AppHomeTabRoute from '../users/AppHomeTabRoute';
import StudentDetails from '../../screens/userScreens/StudentDetails';
import AddmissionNavigator from '../Addmission/AddmissionRoute';
import NewInfoNavigator from '../newInfo/NewInfoRoute';
import { useEffect, useState } from 'react';
import { getJsonDatafromAsyncStorage } from '../../lib/helpers/localStorageFuncs';
import { authStackInfo } from '../../lib/dTypes/routeDataType';
import MyStudentsRoute from '../MyStudents/MyStudentsRoute';
import StatisticsScreen from '../../screens/newInfoScreens/StatisticsScreen';
import AppContextProvider from '../../contexts/AppContext';
import GetResultPrimary from '../../screens/markEntry/GetResultPrimary';
import GetResultHighSection from '../../screens/markEntry/GetResultHighSection';
import GetMarkSubWise from '../../screens/markEntry/CheckMarkSubjectWise';
import ResultSheetPrimary from '../../screens/markEntry/ResultSheetPrimary';
import SendMarkScreen from '../../screens/markEntry/SendMarkScreen';
import UserHomeScreen from '../../screens/userScreens/UserHomeScreen';
import NewStuInfoByTeacher from '../../screens/newInfoScreens/NewStuInfoByTeacher';
import AdminHomeRoute from '../Admin/AdminHomeRoute';
import ResultDownloadScreenHigh from '../../screens/markEntry/ResultDownloadScreenHigh';

const Stack = createStackNavigator();

const appStackData: authStackInfo[] = [
  {name: 'UserHomeScreen', component: UserHomeScreen, hasHeader: false, title: 'App Home', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'NewInfoNavigator', component: NewInfoNavigator, hasHeader: false, title: 'নতুন তথ্য সংগ্রহ ফরম', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'StudentDetails', component: StudentDetails, hasHeader: true, title: 'বিস্তারিত তথ্য', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'AddmissionNavigator', component: AddmissionNavigator, hasHeader: false, title: 'নতুন তথ্য', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'MyStudentsRoute', component: MyStudentsRoute, hasHeader: false, title: 'আপনার শিক্ষার্থীর তথ্য', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'StatisticsScreen', component: StatisticsScreen, hasHeader: true, title: 'পরিসংখ্যান', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'AdminHomeRoute', component: AdminHomeRoute, hasHeader: false, title: 'নতুন তথ্য সংগ্রহ ফরম', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'SendMarkScreen', component: SendMarkScreen, hasHeader: true, title: 'নম্বর এন্ট্রি ফরম', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'GetResultPrimary', component: GetResultPrimary, hasHeader: true, title: 'ফলাফল ডাউনলোড', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'GetResultHighSection', component: GetResultHighSection, hasHeader: true, title: 'ফলাফল ডাউনলোড', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'GetMarkSubWise', component: GetMarkSubWise, hasHeader: true, title: 'বিষয়ভিত্তিক নম্বর পত্র', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'ResultSheetPrimary', component: ResultSheetPrimary, hasHeader: true, title: 'নম্বরপত্র', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
  {name: 'NewStuInfoByTeacher', component: NewStuInfoByTeacher, hasHeader: true, title: 'সংগ্রহ তালিকা', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'},
   {name: 'ResultDownloadScreenHigh', component: ResultDownloadScreenHigh, hasHeader: true, title: 'ফলাফল ডাউনলোড', height: 60, backgroundColor: '#0B2447', fontFamily: 'HindSiliguri-SemiBold', headerTintColor: '#fff'}    
];


const MainAppRoute = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getJsonData = async () => {
    const data = await getJsonDatafromAsyncStorage('user');
    setUserData(data); // Update state with the fetched data
    setLoading(false); // Stop loading once data is fetched
  };

  useEffect(() => {
    getJsonData();
  }, []);

  return (
<AppContextProvider>
    <Stack.Navigator>
      {appStackData.map((item, index) => (
        <Stack.Screen
          name={item.name}
          component={item.component} // Passing data to BottomTabNavigator
          initialParams={{ userData }} // Pass userData here
          key={index}
          options={{
            title: item.title,
            headerShown: item.hasHeader,
            headerStyle: {
              backgroundColor: item.backgroundColor,
              height: item.height,
            },
            headerTintColor: item.headerTintColor,
            headerTitleStyle: {
              fontFamily: item.fontFamily,
            },
          }}
        />
      ))}
    </Stack.Navigator>
    </AppContextProvider>
  );
};

export default MainAppRoute;
