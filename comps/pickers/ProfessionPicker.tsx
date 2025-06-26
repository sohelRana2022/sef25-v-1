import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { HEIGHT, width } from '../../lib/configs/Dimensions';
import { THEME } from '../../lib/configs/Theme';
import axios from 'axios';
import { INFO_API_URL } from '../../apis/config';
import Icon from 'react-native-vector-icons/EvilIcons';
interface ProfessionPickerProps {
    selected: string,
    pickerTitle: string,
    setSelected:(x:string)=>{}
}



const ProfessionPicker = (props: ProfessionPickerProps) => {
  const {pickerTitle, setSelected} = props;
  const [data, setData] = useState([])
  const [searchText, setSearchText] = useState('');
  const [Data, setFilteredData] = useState([])
  
const searchPofession = (value: string)=> {
    setSearchText(value);
    let searchWords = searchText.toString().toLowerCase().trim().split(/\s+/);
    let searchColumns = Object.keys(data[0]);

    let resultsArray = searchText.length == 1 ? [] : data
    .filter((r)=>{
        return searchWords.every((word)=>{
        return searchColumns.some((columnName)=>{
            return r[columnName].toString().toLowerCase().indexOf(word) !== -1
        });
        });
    });
    setFilteredData(resultsArray);
}



const getProfessionData= async ()=>{
    await axios
      .get(INFO_API_URL+'?sheetName=profession&action=read&route=info')
      .then((res)=>{
        if(res.data.status){
          setData(res.data.response)
        }else{
          console.log(res.data.message);
          
        }
      })
      .catch((err)=>{
          if(err){
            console.log('Network error! Please, connect your network first.');
          }
      })
  }


useEffect(()=>{
  getProfessionData()
});





  // Render Item for UI
  const renderItem = ({item, index})=>{
    return ( 
      <View style={{borderBottomWidth:1, borderBlockColor:THEME.BORDERCOLOR, borderRadius:10, margin:5, width:width*0.85, padding:5}}>
        <TouchableOpacity
          onPress={()=>{
            setSearchText(item.value);
            setFilteredData([]);
            setSelected(item.value)
          }}
        >
          <Text>{item.value}</Text>
        </TouchableOpacity>
      </View>
    )
  }





  return (
    <View style={styles.container}>
        <Text style={styles.selectTitle}>{pickerTitle}</Text>
        <View style={styles.selectWraper}>
          <Icon name='search' style={styles.leftIcon} />
          <TextInput 
            value={searchText}
            placeholder={'Search ...'}
            onChangeText={(value)=>searchPofession(value)}
            placeholderTextColor="#000"
            underlineColorAndroid="transparent"
            selectionColor={'#000'}
            style={styles.inputStyle}
          />
          <Icon name='chevron-down' style={styles.rightIcon} />
        </View>

            
        <FlatList 
          data={Data} 
          renderItem={renderItem}
          keyExtractor={(item)=>item.key}
          showsVerticalScrollIndicator={false}

          
        /> 

    </View>
  );
};

export default ProfessionPicker;

const styles = StyleSheet.create({
  container: {
    width:width*0.85,
    justifyContent:'center',
    alignItems:'flex-start',
    marginVertical:10
  },
  selectTitle:{
    fontSize:THEME.SUBTITLEFONTSIZE,
    color:'#000',
    fontWeight:'bold',
    marginVertical:5
  },
  selectWraper:{
    width:width*0.85,
    height:40,
    flexDirection:'row',
    backgroundColor:THEME.BACKGROUNDCOLORLIGHT,
    borderRadius:10
  },
  inputStyle:{
    justifyContent:'center',
    alignItems:'center',
    width:'70%',
    paddingHorizontal:5,
    fontSize:THEME.TEXTSIZESECONDARY,
    fontWeight:'bold'
  },
  leftIcon:{
    fontSize:35,
    textAlign:'center',
    paddingVertical:2,
    width:'15%'
  },
  rightIcon:{
    fontSize:35,
    textAlign:'center',
    paddingVertical:2,
    width:'15%'
  }
});
