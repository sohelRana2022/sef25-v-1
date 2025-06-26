import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useForm, Controller, Control, DefaultValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from 'react-native-paper';
import CustomPicker from '../../comps/pickers/CustomPicker';
import { classData, classDataHigh, subName, subNameWithCode } from '../../lib/jsonValue/PickerData';
import { width } from '../../lib/configs/Dimensions';

// ✅ Dynamic Zod schema based on class
const getMarkSchema = (stuClass: string) =>
  z.object({
    class: z.string(),
    subject: z.string(),
    marks: z.array(
      z.object({
        stuId: z.string(),
        roll: z.number(),
        stuName: z.string(),
        cq: z
          .string()
          .refine(
            (val) =>
              !isNaN(Number(val)) &&
              Number(val) >= 0 &&
              Number(val) <= (stuClass === 'Nine' || stuClass === 'Ten' ? 50 : 70),
            { message: 'লিখিত নম্বর বেশি দিয়েছেন!' }
          ),
        mcq: z
          .string()
          .refine(
            (val) =>
              !isNaN(Number(val)) &&
              Number(val) >= 0 &&
              Number(val) <= (stuClass === 'Nine' || stuClass === 'Ten' ? 25 : 30),
            { message: 'নৈর্ব্যাক্তিক নম্বর বেশি দিয়েছেন!' }
          ),
        ...(stuClass === 'Nine' || stuClass === 'Ten'
          ? {
              prac: z
                .string()
                .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 25, {
                  message: 'ব্যাবহারিক নম্বর বেশি দিয়েছেন!',
                }),
            }
          : {}),
      })
    ),
  });

type FormData = z.infer<ReturnType<typeof getMarkSchema>>;

const students = [
  { stuId: 'STU001', roll: 1, stuName: 'রহিম উদ্দিন' },
  { stuId: 'STU002', roll: 2, stuName: 'ফাতেমা বেগম' },
  { stuId: 'STU003', roll: 3, stuName: 'রহিম উদ্দিন রহিম উদ্দিন' },
  // ... up to STU050 as before
];

const SendMarkScreen = () => {
  
  const cqRefs = useRef<(TextInput | null)[]>([]);
  const mcqRefs = useRef<(TextInput | null)[]>([]);
  const pracRefs = useRef<(TextInput | null)[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
      resolver: (data, ctx, opts) => {
        const tempWatch = data.class || 'Ten'; // fallback if watch is not available yet
        return zodResolver(getMarkSchema(tempWatch))(data, ctx, opts);
      },
    defaultValues: {
      marks: students.map((student) => ({
        class: 'Ten',
        subject: '',
        ...student,
        cq: '',
        mcq: '',
        prac: '',
      })),
    } as DefaultValues<FormData>,
  });

  const stuClass = watch('class'); // Needed for conditionally rendering prac input

  const onSubmit = (data: FormData) => {
    Keyboard.dismiss();
    console.log('Submitted Data:', data);
    Alert.alert('Success', 'Marks submitted successfully!');
  };

  return (
    <View style={styles.container}>
      <Text className='text-black font-HindRegular'>Message Screen</Text>
    </View>
  );
};

export default SendMarkScreen;

type InputFieldProps = {
  control: Control<FormData>;
  name: `marks.${number}.${'cq' | 'mcq' | 'prac'}`;
  valueRef: (ref: TextInput | null) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
};

const InputField = ({
  control,
  name,
  valueRef,
  onSubmitEditing,
  placeholder,
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          ref={valueRef}
          keyboardType="numeric"
          blurOnSubmit={false}
          placeholder={placeholder}
          placeholderTextColor="#888"
          selectionColor="black"
          onChangeText={(val) => onChange(val.trim())}
          value={typeof value === 'string' ? value : ''}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="next"
          style={[
            styles.input,
            {
              borderBottomColor: isFocused ? 'black' : 'gray',
              borderBottomWidth: isFocused ? 1 : 0.5
            },
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent:'center',
    alignContent:'center'
  }
})