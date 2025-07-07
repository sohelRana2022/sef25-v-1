
import axios from 'axios';
import { Linking } from 'react-native'
import { studentDataType, summary } from '../dTypes/StudentDataType';
//import { SendDirectSms } from 'react-native-send-direct-sms';


// Validation Rules
const isValidEmail =(value:string)=> {
    const regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return regx.test(value)
  }
  const isValidObj = (obj:object) : any => {
    return Object.values(obj).every(value=>value.trim());
  }
  const isValidMobile =(mobile: string)=>{
    const regx = /(^(01){1}[3-9]{1}(\d){8})$/;
    return regx.test(mobile)
  }
  
// update error
const updateError = (error: string, stateUpdater: any): any => {
    stateUpdater(error);
    setTimeout(()=>{
      stateUpdater('');
    },2500);
  }



const gp = (mark:number)=>{
  if(mark < 33){
    return 0;
  }else if(mark < 40){
    return 1;
  }else if(mark < 50){
    return 2;
  }else if(mark < 60){
    return 3;
  }else if(mark < 70){
    return 3.5;
  }else if(mark < 80){
    return 4;
  }else{
    return 5;
  }
}




// const sendSMS = async (phoneNumber:string, message:string) => {
//     const url = `sms:${phoneNumber}?body=${message}`
//     await Linking.openURL(url)
//   }

  // Send SMS from sim directly from this app
  // const sendSMS = async (mobileNumber:string, bodySMS:string) => {
  //   await SendDirectSms(mobileNumber, bodySMS)
  //     .then(res => res)
  //     .catch(err => err)
  // }



function removeAttributes<T extends object>(arr: T[], attributes: (keyof T)[]): Partial<T>[] {
    return arr.map(obj => {
        let newObj: Partial<T> = { ...obj };
        attributes.forEach(attr => {
            delete newObj[attr];
        });
        return newObj;
    });
}





const getDataFromSheet = async (url:string) => {
  try {
    const res = await axios.get(url);
    if (res.data.status) {
      return res.data.response;
    } else {
      return res.data.message;
    }
  } catch (err) {
    console.log('Network error! Please, connect your network first.');
  }
};

// format a date-time
const formatedDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };
  return date.toLocaleString('en-US', options);
};




const splitByFirstSpace = (str:string) => {
  const index = str.indexOf(' ');
  
  if (index === -1) {
    // If there's no space, return the original string and an empty string
    return [str, ''];
  }
  
  // Split the string into two parts: before and after the first space
  return [str.slice(0, index), str.slice(index + 1)];
}
export function countByPropWithRank<T>(
  array: T[],
  prop: keyof T
): { rank: number; countByItem: string; total: number }[] {
  const countMap: Record<string, number> = {};

  array.forEach(item => {
    const key = String(item[prop] ?? 'ref_person'); // fallback for undefined/null
    countMap[key] = (countMap[key] || 0) + 1;
  });

  const sorted = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1]);

  return sorted.map(([value, total], index) => ({
    rank: index + 1,
    countByItem: value,
    total
  }));
}

// valid days calculate 

const calculateValidDays =(date: Date)=>{
  const year = date.getFullYear();
  const checkPoints = [
    {cutoff: new Date(`${year}-07-10`), days: 15},
    {cutoff: new Date(`${year}-07-15`), days: 14},
    {cutoff: new Date(`${year}-08-01`), days: 13},
    {cutoff: new Date(`${year}-08-15`), days: 12},
    {cutoff: new Date(`${year}-09-01`), days: 11},
    {cutoff: new Date(`${year}-09-15`), days: 10},
    {cutoff: new Date(`${year}-10-01`), days: 9},
    {cutoff: new Date(`${year}-10-15`), days: 8},
    {cutoff: new Date(`${year}-11-01`), days: 7},
    {cutoff: new Date(`${year}-11-15`), days: 6},
    {cutoff: new Date(`${year}-12-31`), days: 5},
  ];

  for(let i=0; i<checkPoints.length; i++){
    if(date <= checkPoints[i].cutoff){
      return checkPoints[i].days;
    }
  }
  return 5
}

// get remaining days
const getRemainingDays = (send_date: Date, valid_days: number): number => {
  const now = new Date();
  const added = new Date(send_date);

  const diffOfTime = now.getTime() - added.getTime(); // milliseconds
  const passedDays = Math.floor(diffOfTime / (1000 * 60 * 60 * 24));

  const remaining = valid_days - passedDays;
  return remaining > 0 ? remaining : 0;
};



export const summarizeByRefPerson = (data: studentDataType[]): summary[] => {
  const grouped = data.reduce<Record<string, summary>>((acc, curr) => {
    const today = new Date();
    const sevenDayAgoDate = new Date();
    sevenDayAgoDate.setDate(today.getDate()-7);
    const person = curr.ref_person || 'Unknown';
    const ref_uid = curr.ref_uid || 'Unknown';
    if (!acc[ref_uid]) {
      acc[ref_uid] = {
        ref_person: person,
        ref_uid: ref_uid,
        total: 0,
        admitted: 0,
        posibility100: 0,
        total_add: 0,
        total_com: 0,
        prev7DayaData:0
      };
    }

    acc[ref_uid].total += 1;
    if (curr.is_admitted) acc[ref_uid].admitted += 1;
    if (Number(curr.posibility) === 100) acc[ref_uid].posibility100 += 1;
    if (new Date(curr.send_date) >= sevenDayAgoDate) acc[ref_uid].prev7DayaData += 1;
    acc[ref_uid].total_add += Number(curr.add_point || 0); // add_point যোগ
    acc[ref_uid].total_com += Number(curr.commission || 0); // commission যোগ
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => b.admitted - a.admitted);
};

export {
  getRemainingDays, 
  calculateValidDays, 
  splitByFirstSpace, 
  formatedDateTime, 
  getDataFromSheet, 
  removeAttributes, 
  isValidEmail, 
  updateError, 
  isValidObj, 
  isValidMobile, 
  gp
}