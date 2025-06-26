import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { THEME } from '../../lib/configs/Theme';
import axios from 'axios';
import { INFO_API_URL } from '../../apis/config';
import Icon from 'react-native-vector-icons/AntDesign';
import { width } from '../../lib/configs/Dimensions';

interface ExamPickerProps {
  pickerTitle: string;
  exam: string;
  setExam: (exam: string) => void;
}

interface ExamItem {
  key: string;
  value: string;
}

const ExamPicker = (props: ExamPickerProps) => {
  const { pickerTitle, exam, setExam} = props;
  const [data, setData] = useState<ExamItem[]>([]);
  const [showList, setShowList] = useState(false);

  const getExamData = async () => {
    try {
      const res = await axios.get(`${INFO_API_URL}?sheetName=examNames&action=read&route=info`);
      if (res.data.status) {
        setData(res.data.response);
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.log('Network error! Please, connect your network first.');
    }
  };

  useEffect(() => {
    getExamData();
  }, []);

  const renderItem = ({ item }: { item: ExamItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => {
          setExam(item.value);
          setShowList(false);// Use item.value directly here
        }}
      >
        <Text style={styles.itemText}>{item.value}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.selectTitle}>{pickerTitle}</Text>
      <View style={styles.selectWrapper}>
        <Text style={styles.selectedStyle}>{exam}</Text>
        <TouchableOpacity onPress={() => setShowList(true)}>
          <Icon name='down' style={styles.rightIcon} />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showList}
        onRequestClose={() => setShowList(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>পরীক্ষা বাছাই করুন!</Text>
              <TouchableOpacity onPress={() => setShowList(false)}>
                <Icon name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.key}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ExamPicker;

const styles = StyleSheet.create({
  container: {
    width:width * 0.40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  selectTitle: {
    fontSize: THEME.SUBTITLEFONTSIZE,
    color: THEME.SECONDARYCOLOR,
    marginVertical: 5,
    fontFamily: 'HindSiliguri-SemiBold',
  },
  selectWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: THEME.BACKGROUNDCOLORLIGHT,
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
  },
  selectedStyle: {
    fontSize: THEME.TEXTSIZESECONDARY,
    textAlign: 'center',
    fontFamily: 'HindSiliguri-SemiBold',
  },
  rightIcon: {
    fontSize: 30,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: THEME.SUBTITLEFONTSIZE,
    fontFamily: 'HindSiliguri-SemiBold',
    color:'#000'
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: THEME.BORDERCOLOR,
    borderRadius: 10,
    margin: 5,
    padding: 5,
  },
  itemText: {
    color: THEME.SECONDARYCOLOR,
    fontFamily: 'HindSiliguri-SemiBold',
  },
});
