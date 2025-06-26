import * as React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
interface componentNameProps {
    successText : string,
    fontFamily ?: string,
    iconName ?: string
}

const SuccessMsg = (props: componentNameProps) => {
    const {iconName, successText, fontFamily} = props;
  return (
    <View style={styles.container}>
      <Icons style={styles.iconStyle} name={iconName}/>
      <Text style={[styles.errorTxt, {fontFamily: fontFamily ? fontFamily : 'Roboto-Regular'}]}>{successText}</Text>
    </View>
  );
};

export default SuccessMsg;

const styles = StyleSheet.create({
    container: {
        width: (Dimensions.get('window').width * 3.4) / 4,
        backgroundColor: 'rgba(rgba(2,256,5,0.2)',
        padding:15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:8
      },
      errorTxt:{
        width: '85%',
        textAlign:'center',
        color: 'rgba(27,27,51,1)',
        fontSize: 14,
      },
      iconStyle:{
        width: '15%',
        textAlign:'center',
        fontSize: 40,
        fontWeight:'800',
        color: 'rgba(0,200,0,1)',
      }
});
