import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
interface CustomActivityIndicatorProps {
  width: any,
  height: any,
  loadingText: string
}

const CustomActivityIndicator = (props: CustomActivityIndicatorProps) => {
  const {width, height, loadingText}=props;
  return (
    <View style={[styles.container, {width, height}]}>
      
      <ActivityIndicator size='large' animating={true} />   
      <Text style={{fontSize:16, color:'#000', fontFamily:'HindSiliguri-Regular'}}>{`${loadingText}...`}</Text>
    </View>
  );
};

export default CustomActivityIndicator;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor:'rgba(0,0,0,0.4))',
    alignItems: 'center',
    zIndex:1
  }
});
