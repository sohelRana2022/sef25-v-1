import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ControlledInput from '../../comps/Inputs/ControlledInput'
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'react-native-paper';
const contactSchema = z.object({
                    contact: z.string()
                    .min(1, {message:'পিতার মোবাইল নাম্বার অবশ্যক!'})
                    .regex(/(^(01){1}[3-9]{1}(\d){8})$/,{message:'মোবাইল নাম্বারটি সঠিক নয়!'})
                    })
type contactType = z.infer<typeof contactSchema>;


const CheckNewData = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<contactType>({
        resolver: zodResolver(contactSchema),
        defaultValues: {contact:''}
      });

const check = (data:contactType) => {
                console.log(data)
            }   

  return (
    <View className='flex-1 justify-center items-center bg-white'>
        <Text className='text-black text-lg font-HindSemiBold'>তথ্য যাচাই করুন</Text>
        <View className='w-[80%] px-10'>
            
            <ControlledInput 
                control={control}
                name={"contact"}
                placeholder={"01740096832"}
                label={"মোবাইল নাম্বার দিন"}
                keyboardType='numeric'
                style={{ backgroundColor: "#FFF", fontFamily: 'HindSiliguri-SemiBold', marginVertical:20}}
            />
            <Button className='my-5' onPress={handleSubmit(check)} mode={"contained"}>
            যাচাই
            </Button>
        </View>

    </View>
  )
}

export default CheckNewData

const styles = StyleSheet.create({})