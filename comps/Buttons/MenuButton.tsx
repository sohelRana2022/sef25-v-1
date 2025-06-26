import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity} from 'react-native';

interface componentNameProps {
  btnTitle : string,
  backgroundColor: string
}

const MenuButton = (props: componentNameProps) => {
    const {btnTitle, backgroundColor} = props
  return (
    <TouchableOpacity 
        {...props}
        >
          <View style={[styles.container, {backgroundColor:backgroundColor}]}>
            <Text style={styles.btnTextStyle}>{btnTitle}</Text>
          </View>
    </TouchableOpacity>
  );
};

export default MenuButton;

const styles = StyleSheet.create({
  container: {
        borderWidth: 1.5,
        borderRadius: 40,
        paddingVertical:4,
        paddingHorizontal:10,
        margin:5,
        borderColor:'#FFF'
    },
    btnTextStyle:{
        color:'#FFF', 
        textAlign:'center', 
        fontSize:18
    }
});
