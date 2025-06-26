import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppContexts } from '../../contexts/AppContext';
import LoaderAnimation from '../../comps/activityLoder/LoaderAnimation';


interface AddNewStudentProps {}

const AddNewStudent: React.FC<AddNewStudentProps> = (props: AddNewStudentProps) => {
 
  const { loader, setLoader } = useAppContexts();

  React.useEffect(()=>{
    setLoader(true)
    setTimeout(()=>{
      setLoader(false)
    },3000)
  },[])

  return (
    <>
    {loader ? <LoaderAnimation/> : <WebView source={{ uri: 'https://forms.gle/xm55qLFovsFovUDJA' }} />}     
    </>
    
   
  );
};

export default AddNewStudent;

const styles = StyleSheet.create({
  container: {
    flex:1
  }
});
