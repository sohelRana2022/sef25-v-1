import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ControlledInput from '../../comps/Inputs/ControlledInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInfoType, LoginInfoSchema } from '../../lib/zodschemas/zodSchemas';
import { Button, Card, Snackbar } from 'react-native-paper';
import { useAuthContexts } from '../../contexts/AuthContext';
import { useAppContexts } from '../../contexts/AppContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
interface LoginScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [statusMsg, setStatusMsg] = useState('');
  const [loader, setLoader] = useState(false);
  const { login } = useAuthContexts();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginInfoType>({
    resolver: zodResolver(LoginInfoSchema),
  });

  const signin = async (data: LoginInfoType) => {
    setLoader(true);
    const { email, password } = data;
    const isLoggedin = await login(email, password);
    setLoader(false);

    if (isLoggedin?.code === 'auth/invalid-credential') {
      setStatusMsg('ইমেইল বা পাসওয়ার্ড ভুল হয়েছে!');
    } else if (!isLoggedin?.status) {
      setStatusMsg('আপনি অনেক বার চেষ্টা করেছেন! ১০ মিনিট পরে আবার চেষ্টা করুন!');
    } else {
      setStatusMsg('');
      navigation.replace('UserHomeScreen'); // ✅ Success: redirect
    }
  };
  console.log(loader)
  return (
    <View style={{ flex: 1, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }}>
      {loader && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text className='text-base font-HindRegular text-[#FFF] pt-5'>অপেক্ষা করুন .....!</Text>
        </View>
      )}
    
    
        {statusMsg !== '' && (
          <View style={styles.snackbarWrapper}>
            <Snackbar
              visible
              onDismiss={() => setStatusMsg('')}
              duration={6000}
              style={styles.snackbar}
            >
              <Text style={{ color: 'red', fontFamily:'HindSiliguri-Regular' }}>{statusMsg}</Text>
            </Snackbar>
          </View>
        )}
        <Card style={{width: '80%', maxWidth: 400, paddingVertical:30}}>

        <View style={{ alignItems: 'center', marginVertical:5, borderBottomWidth:2, borderBottomColor:'#666'  }}>
          <Image 
            source={require('../../assets/images/logo.gif')}
            resizeMode={'contain'}
            style={{ width: 80, height: 80}} 
          />
          <Text className='text-gray-900 font-SutonnyBold text-2xl mt-2'>ইউজার লগিন</Text>
      </View>  
          <Card.Content style={{ gap: 5 }}>

            <ControlledInput 
              control={control}
              name={"email"}
              placeholder={""}
              label={"ইমেইল"}
              style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
            />
            
            <ControlledInput 
              control={control}
              name={"password"}
              placeholder={""}
              label={"পাসওয়ার্ড"}
              secureTextEntry={true}
              style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold'}}
            />
          </Card.Content>
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-between', marginTop: 20, paddingHorizontal:15 }}>
            <Button style={{ flex: 1 }} onPress={handleSubmit(signin)} mode={"contained"}>
              লগিন
            </Button>
          </View>
            
          <View style={{ flexDirection: 'row', gap: 10, justifyContent:'center', paddingTop:35}}>
            <Text className='text-gray-900 font-HindRegular'>কোনো একাউন্ট নেই?</Text> 
            <TouchableOpacity
              onPress={()=>navigation.navigate('SignUpScreen')}
            >
              <Text className='text-gray-900 font-HindBold border-gray-500 border-b'>এখানে ক্লিক করুন!</Text> 
            </TouchableOpacity>
          </View>
        </Card>
    </View>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  snackbarWrapper: { position: 'absolute', top: '20%', left: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  snackbar: { width: '80%', borderRadius: 8, alignSelf: 'center', backgroundColor:'#fff' },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.5)',
    zIndex:100
  }
});