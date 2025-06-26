import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { THEME } from '../../lib/configs/Theme';
import {
  Controller,
  Control,
  Path,
  FieldValues,
} from 'react-hook-form';
import Icon from 'react-native-vector-icons/AntDesign';
import { height, width } from '../../lib/configs/Dimensions';
import { HelperText } from 'react-native-paper';

interface CustomPickerProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  data: Array<{ id: number; label: string; value: string }>;
  pickerTitle: string;
  pickerName?: string;
  pickerAreaStyle?: Object;
  setPickerData?: (val: string) => void;
  onSelect?: () => void;
}

const CustomPicker = <TFieldValues extends FieldValues>({
  control,
  name,
  data,
  pickerTitle,
  pickerAreaStyle,
  setPickerData,
  onSelect,
}: CustomPickerProps<TFieldValues>) => {
  const [showList, setShowList] = useState(false);
  const [label, setLabel] = useState<string>('বাছাই করুন!');

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error, invalid } }) => {
        // Update label if a value is selected
        useEffect(() => {
          if (value) {
            const selectedItem = data.find((item) => item.value === value);
            if (selectedItem) {
              setLabel(selectedItem.label);
            }
          } else {
            setLabel('বাছাই করুন!');
          }
        }, [value]);

        const renderItem = ({ item }: { item: { id: number; label: string; value: string } }) => (
          <View key={item.id} style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => {
                onChange(item.value);
                setLabel(item.label);
                if (setPickerData) setPickerData(item.label);
                if (onSelect) onSelect();
                setShowList(false);
              }}
            >
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          </View>
        );

        return (
          <View style={pickerAreaStyle}>
            <Text className="text-gray-500 font-HindSemiBold px-3 pt-2 text-xs">
              {pickerTitle}
            </Text>

            {invalid && (
              <View className="flex-row items-center">
                <Icon name="warning" color="red" size={15} />
                <HelperText type="error" visible={invalid}>
                  {error?.message}
                </HelperText>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setShowList(true)}
              style={styles.pickerAreaTouchable}
            >
              <View className="flex-row justify-between pl-4 py-1">
                <Text className="text-gray-900 font-HindSemiBold text-base">
                  {label}
                </Text>
                <Icon name="caretdown" color={'#444'} style={styles.rightIcon} />
              </View>
            </TouchableOpacity>

            <Modal
              animationType="fade"
              transparent={true}
              visible={showList}
              onRequestClose={() => setShowList(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>বাছাই করুন!</Text>
                    <TouchableOpacity onPress={() => setShowList(false)}>
                      <Icon name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            </Modal>
          </View>
        );
      }}
    />
  );
};

export default CustomPicker;

const styles = StyleSheet.create({
  rightIcon: {
    fontSize: 15,
    textAlign: 'center',
    marginRight:10,
    marginTop:5
  },
  pickerAreaTouchable: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    height: height / 2,
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
    color: '#000',
  },
  itemContainer: {
    borderRadius: 10,
    borderBottomWidth: 1,
    margin: 5,
    padding: 5,
  },
  itemText: {
    color: THEME.SECONDARYCOLOR,
    fontFamily: 'HindSiliguri-SemiBold',
  },
});
