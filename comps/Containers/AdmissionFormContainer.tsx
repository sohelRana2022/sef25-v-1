import * as React from 'react';
import {View, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';

type AdmissionFormContainerProps = {
  children: React.ReactNode;
};

const AdmissionFormContainer: React.FC<AdmissionFormContainerProps> = ({children}) => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default AdmissionFormContainer;

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    paddingHorizontal:30,
    backgroundColor:'#FFF'
  }
});
