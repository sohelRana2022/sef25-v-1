import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
  Keyboard,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  findNodeHandle,
  UIManager,
} from 'react-native';
import { useForm, Controller, Control } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Snackbar } from 'react-native-paper';
import CustomPicker from '../../comps/pickers/CustomPicker';
import { classDataHigh, subNameWithCode } from '../../lib/jsonValue/PickerData';
import { width } from '../../lib/configs/Dimensions';
import axios from 'axios';
import { CRUD_API } from '../../apis/config';
import LoaderAnimation from '../../comps/activityLoder/LoaderAnimation';

// Student type
interface StudentList {
  stu_id: string;
  roll: number;
  stu_name_bn: string;
}

// Schema factory
const getMarkSchema = (subjectCode: string) => {
  const getMax = (type: 'cq' | 'mcq' | 'prac') => {
    switch (subjectCode) {
      case '101': case '109': case '127': case '150': case '111': return type === 'cq' ? 70 : type === 'mcq' ? 30 : null;
      case '107': case '108': return type === 'cq' ? 100 : type === 'mcq' ? 0 : null;
      case '136': case '137': case '126': case '138': return type === 'cq' ? 50 : type === 'mcq' ? 25 : type === 'prac' ? 25 : null;
      case '154': return type === 'cq' ? 10 : type === 'mcq' ? 15 : type === 'prac' ? 25 : null;
      default: return type === 'cq' ? 70 : type === 'mcq' ? 30 : null;
    }
  };

  return z.object({
    class: z.string(),
    subject: z.string(),
    marks: z.array(z.object({
      stu_id: z.string(),
      roll: z.number(),
      stu_name_bn: z.string(),
      cq: z.string().refine(val => !isNaN(+val) && +val >= 0 && +val <= (getMax('cq') ?? 70), { message: 'লিখিত নম্বর সীমা অতিক্রম করেছে!' }),
      mcq: z.string().refine(val => !isNaN(+val) && +val >= 0 && +val <= (getMax('mcq') ?? 30), { message: 'নৈর্ব্যক্তিক নম্বর সীমা অতিক্রম করেছে!' }),
      ...(getMax('prac') !== null ? {
        prac: z.string().optional().refine(val => val === undefined || (!isNaN(+val) && +val >= 0 && +val <= (getMax('prac') ?? 25)), { message: 'ব্যবহারিক নম্বর সীমা অতিক্রম করেছে!' })
      } : {})
    }))
  });
};

type FormData = z.infer<ReturnType<typeof getMarkSchema>>;

const SendMarkScreen: React.FC = () => {
  const [schema, setSchema] = useState(() => getMarkSchema(''));
  const [stuList, setStuList] = useState<StudentList[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>('');
  const [loader, setLoader] = useState(false);
  const [isFormExist, setIsFormExist] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const studentRefs = useRef<(View | null)[]>([]);
  const cqRefs = useRef<(TextInput | null)[]>([]);
  const mcqRefs = useRef<(TextInput | null)[]>([]);
  const pracRefs = useRef<(TextInput | null)[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { class: 'Ten', subject: '', marks: [] },
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const selectedClass = watch('class');
  const subject = watch('subject');

  const subCodes = ['126', '136', '137', '138', '154'].includes(subject);

  useEffect(() => {
    const newSchema = getMarkSchema(subject);
    setSchema(() => newSchema);

    reset((form) => form, {
      keepValues: true,
      keepErrors: true,
      keepDirty: true,
    });
  }, [subject, reset]);

  useEffect(() => {
    setIsFormExist(false);
    reset((form) => form, { keepValues: true, keepErrors: true });
  }, [selectedClass, reset]);

  useEffect(() => {
    const marksErrors = errors?.marks;
    if (Array.isArray(marksErrors)) {
      const errorIndex = marksErrors.findIndex((mark) => mark !== undefined);
      if (errorIndex !== -1 && studentRefs.current[errorIndex]) {
        const handle = findNodeHandle(studentRefs.current[errorIndex]);
        const scrollHandle = findNodeHandle(scrollRef.current);
        if (handle && scrollRef.current && scrollHandle != null) {
          UIManager.measureLayout(
            handle,
            scrollHandle,
            () => {},
            (_x, y) => scrollRef.current?.scrollTo({ y: y - 20, animated: true })
          );
        }
      }
    }
  }, [errors]);

  const getStuList = async (data: FormData) => {
    try {
      setLoader(true);
      setFetchError(null);
      setStuList([]);
      const reqBody = {
        tabs: [{ tab: 'SIF', data: [], columns: ['stu_id', 'roll', 'stu_name_bn'] }],
      };
      const res = await axios.post(`${CRUD_API}?action=read&stuClass=${data.class}`, reqBody, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.data.success) {
        const fetchedList: StudentList[] = res.data.results[0].data;
        setStuList(fetchedList || []);
        reset({
          class: data.class,
          subject: data.subject,
          marks: fetchedList.map((s) => ({ ...s, cq: '', mcq: '', prac: '' })),
        });
      } else {
        setFetchError('দুঃখিত, তথ্য পাওয়া যায়নি!');
      }
    } catch {
      setFetchError('নেটওয়ার্ক সমস্যা!');
    } finally {
      setLoader(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!data.class || !data.subject || data.marks.length === 0) {
      Alert.alert('শ্রেণী, বিষয় ও নম্বর পূরণ করুন।');
      return;
    }
    try {
      setIsFormExist(true);
      setLoader(true);
      setSuccess('');
      setFetchError(null);
      const reqBody = {
        tabs: [{ tab: data.subject, data: data.marks }],
      };
      const res = await axios.post(`${CRUD_API}?action=insertbatchmarks&stuClass=${data.class}`, reqBody, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.data.success) {
        setSuccess('মার্কস সফলভাবে আপলোড হয়েছে!');
      } else {
        setFetchError('ডেটা পাঠাতে সমস্যা হয়েছে!');
      }
    } catch {
      setFetchError('ডেটা পাঠাতে সমস্যা হয়েছে!');
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      {!!success && (
        <View style={styles.snackbarWrapper}>
          <Snackbar visible onDismiss={() => setSuccess('')} duration={5000} style={styles.snackbar}>
            {success}
          </Snackbar>
        </View>
      )}
      <Card style={[styles.card, { marginBottom: 10 }]}>
        <Card.Content>
          <CustomPicker control={control} data={classDataHigh} name="class" pickerTitle="শ্রেণী" />
          <CustomPicker control={control} data={subNameWithCode} name="subject" pickerTitle="বিষয়ের নাম" onSelect={() => handleSubmit(getStuList)()} />
        </Card.Content>
      </Card>
      {loader && <LoaderAnimation />}
      {!isFormExist && (
        <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled">
          {stuList.map((stu, index) => {
            const markErrors = errors.marks?.[index];
            const isLast = index === stuList.length - 1;
            return (
              <View key={stu.stu_id} ref={(ref) => (studentRefs.current[index] = ref)} style={styles.card}>
                <Card>
                  <Card.Content>
                    <Text style={styles.studentName}>{stu.roll}. {stu.stu_name_bn}</Text>
                    <View style={styles.inputBlock}>
                      <InputField control={control} name={`marks.${index}.cq`} placeholder="CQ" valueRef={(ref) => (cqRefs.current[index] = ref)} error={markErrors?.cq?.message} onSubmitEditing={() => mcqRefs.current[index]?.focus()} />
                      <InputField control={control} name={`marks.${index}.mcq`} placeholder="MCQ" valueRef={(ref) => (mcqRefs.current[index] = ref)} error={markErrors?.mcq?.message} onSubmitEditing={() => {
                        if (subCodes) pracRefs.current[index]?.focus();
                        else if (isLast) { Keyboard.dismiss(); handleSubmit(onSubmit)(); }
                        else cqRefs.current[index + 1]?.focus();
                      }} />
                      {subCodes && (
                        <InputField control={control} name={`marks.${index}.prac`} placeholder="PRAC" valueRef={(ref) => (pracRefs.current[index] = ref)} error={markErrors?.prac?.message} onSubmitEditing={() => {
                          if (isLast) { Keyboard.dismiss(); handleSubmit(onSubmit)(); }
                          else cqRefs.current[index + 1]?.focus();
                        }} />
                      )}
                    </View>
                    {markErrors?.cq?.message && <Text style={styles.errorText}>{markErrors.cq.message}</Text>}
                    {markErrors?.mcq?.message && <Text style={styles.errorText}>{markErrors.mcq.message}</Text>}
                    {markErrors?.prac?.message && <Text style={styles.errorText}>{markErrors.prac.message}</Text>}
                  </Card.Content>
                </Card>
              </View>
            );
          })}
          {!!stuList.length && (
            <Button style={{ flex: 1, paddingVertical: 5, marginVertical: 15, width: width * 0.9 }} onPress={handleSubmit(onSubmit)} mode="contained">
              পাঠাও
            </Button>
          )}
        </ScrollView>
      )}
    </View>
  );
};

interface InputFieldProps {
  control: Control<FormData>;
  name: `marks.${number}.${'cq' | 'mcq' | 'prac'}`;
  valueRef: (ref: TextInput | null) => void;
  onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
  placeholder?: string;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ control, name, valueRef, onSubmitEditing, placeholder, error }) => {
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
          onChangeText={(val) => onChange(val?.trim() ?? '')}
          value={typeof value === 'string' ? value : ''}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="next"
          style={[styles.input, { borderBottomColor: error ? 'red' : isFocused ? 'black' : 'gray', borderBottomWidth: 1 }]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { setIsFocused(false); onBlur(); }}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, alignItems: 'center', flex: 1 },
  card: { width: width * 0.9, marginVertical: 5 },
  studentName: { fontFamily: 'HindSiliguri-SemiBold', fontSize: 16, color: '#000' },
  inputBlock: { flexDirection: 'row', gap: 10, marginTop: 5 },
  input: { padding: 8, color: '#000', width: 60, height: 35, textAlign: 'center' },
  errorText: { color: 'red', fontSize: 12, marginTop: 5, fontFamily: 'HindSiliguri-Regular' },
  snackbarWrapper: { position: 'absolute', top: '45%', left: 0, right: 0, alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  snackbar: { width: '80%', borderRadius: 8, alignSelf: 'center' },
});

export default SendMarkScreen;
