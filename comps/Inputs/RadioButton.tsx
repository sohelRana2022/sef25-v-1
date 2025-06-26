import * as React from 'react';
import {  View } from 'react-native';
import {Controller, Control, Path, FieldValues} from 'react-hook-form';
import {Text, RadioButton, HelperText} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';


interface ControlledRadioProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>,
    name: Path<TFieldValues>,
    items: Array<{ id: number; label: string; value: string; }>,
    direction?:
    | 'row'
    | 'column'
    | 'row-reverse'
    | 'column-reverse'
    | undefined,
    labelTitle: string

} 

const RadioButtons = <TFieldValues extends FieldValues,>({
    control, 
    name, 
    labelTitle, 
    items, 
    direction
}: ControlledRadioProps<TFieldValues>) => {


  return (
    <Controller
        control={control}
        name={name}
        render={({      
            field:{value, onChange},
            fieldState: {error, invalid}
        })=>(
            <View>
            <Text className='text-gray-500 font-HindSemiBold pl-3 pt-2 text-xs'>{labelTitle}</Text>
            <View className='pl-2 pb-1 divide-y'>
                <RadioButton.Group 
                    value={value}
                    onValueChange={newValue => onChange(newValue)} 
                    >
                    {invalid ?
                    <View className='flex-row items-center pl-1'>
                        <Icon name='warning' color={'red'} size={15}/>
                        <HelperText type="error" visible={invalid}>
                        {error?.message}
                        </HelperText> 
                    </View>: null
                    }  
                    <View style={{flexDirection: direction, marginLeft:-20}}>
                        {items.map((item)=>
                            <View key={item.id} style={{flexDirection:'row',  alignItems:'center', margin:-5}}>
                                <RadioButton.Item rippleColor="transparent" style={{margin:0,height:40,width:50}} key={item.id} label={''} value={item.value} />
                            <Text variant="titleSmall">{item.label}</Text>
                            </View>
                        )}
                    </View>
                </RadioButton.Group>
            </View>
           </View>
        )}
    />
  );
};

export default RadioButtons;