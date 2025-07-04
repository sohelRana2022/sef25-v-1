import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
interface NewStuInfoByTeacherProps{
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}


const NewStuInfoByTeacher = (props:NewStuInfoByTeacherProps) => {
  const {navigation, route} = props;
  const teaSummery = route?.params?.teaSummery;
  const stuData = route?.params?.stuData;
  const {ref_person, total_add, total, admitted, posibility100, total_com} = teaSummery;

  return (
    <View style={styles.container}>     

              <Text style={{textAlign:'center', color:"#000", fontFamily:'HindSiliguri-SemiBold', fontSize:16}}>{ref_person}</Text>
              <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:10}}>
                
                <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}>
                  <Icon name="addusergroup" size={18} color="#444" />
                  <Text style={{color:"#444", fontFamily:'HindSiliguri-Regular', fontSize:18, paddingHorizontal:5}}>{total}</Text>
                </View>
                 <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}>
                  <Icon name="Trophy" size={18} color="#444" />
                  <Text style={{color:"#444", fontFamily:'HindSiliguri-Regular', fontSize:18, paddingHorizontal:5}}>{total_add}</Text>
                </View>                
                <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}>
                  <Icon name="heart" size={18} color="#444" />
                  <Text style={{color:"#444", fontFamily:'HindSiliguri-Regular', fontSize:18, paddingHorizontal:5}}>{posibility100}</Text>
                </View>                
                <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}>
                  <Icon name={admitted <= 5 ? "download" : "upload"} size={18} color="#444" />
                  <Text style={{color:"#444", fontFamily:'HindSiliguri-Regular', fontSize:18, paddingHorizontal:5}}>{total_add-5}</Text>
                </View>                 
                <View style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', padding:10}}>
                  <Icon name="gift" size={18} color="#444" />
                  <Text style={{color:"#444", fontFamily:'HindSiliguri-Regular', fontSize:18, paddingHorizontal:5}}>{total_com}</Text>
                </View>            
              </View>


              <View style={[styles.infoRow,{marginBottom:10, backgroundColor:'#ddd'}]}>
                <Text style={[styles.serial,{fontFamily: 'HindSiliguri-SemiBold'}]}>{'ক্রম'}</Text>
                <Text style={[styles.label,{fontFamily: 'HindSiliguri-SemiBold'}]}>{'শিক্ষার্থীর নাম'}</Text>
                <Text style={[styles.value,{fontFamily: 'HindSiliguri-SemiBold'}]}>{"সম্ভাবনা"}</Text>
                <Text style={[styles.value,{fontFamily: 'HindSiliguri-SemiBold'}]}>{"ভর্তি"}</Text>
              </View>

            <ScrollView>
              {stuData.map((item: { uid: string; is_admitted:string, stu_name_bn: string; posibility: string }, idx: number) => (
                
                <View key={item.uid} style={[styles.infoRow,{backgroundColor: item.is_admitted ? '#eee' : '#FFF'}]}>
                  <Text style={[styles.serial,{fontFamily: 'HindSiliguri-Regular'}]}>{idx + 1}</Text>
                  <Text style={[styles.label,{fontFamily: 'HindSiliguri-Regular'}]}>{item.stu_name_bn}</Text>
                  <Text style={[styles.value,{fontFamily: 'HindSiliguri-Regular'}]}>{item.posibility+"%"}</Text>
                  {item.is_admitted ? <Icon name="check" size={24} color="green" style={styles.icon} /> 
                  : 
                      <Icon name="close" size={24} color="red" style={styles.icon} /> 
                 
                  }
                </View>
              ))}
            </ScrollView>

    </View>
  );
};

export default NewStuInfoByTeacher;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal:5,
    marginVertical:10

  },
  card: {
    width: '100%',
    margin: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  headerImage: {
    width: '95%',
    height: 45,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'HindSiliguri-SemiBold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  icon: {
    width: '15%',
    textAlign:'center'
  },
  serial: {
    color: 'black',
    width: '10%',
    textAlign:'center'
  },
  label: {
    color: 'black',
    width: '55%',
  },
  value: {
    color: 'black',
    width: '15%',
    textAlign: 'center',
  },
})