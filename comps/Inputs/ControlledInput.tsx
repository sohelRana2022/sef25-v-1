import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import Icon from 'react-native-vector-icons/AntDesign';

type ControlledInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  inputAreaStyle?: Object;
} & React.ComponentProps<typeof TextInput>;

const ControlledInput = <TFieldValues extends FieldValues>({
  control,
  name,
  inputAreaStyle,
  ...TextInputProps
  
}: ControlledInputProps<TFieldValues>) => {
  const theme = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error, invalid } }) => (
        <View style={inputAreaStyle}>
          <TextInput
            {...TextInputProps}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={invalid}
          />
          {invalid ? (
            <View style={styles.errorContainer}>
              <Icon name='warning' color='red' size={15} />
              <HelperText type="error" visible={invalid}>
                {error?.message}
              </HelperText>
            </View>
          ) : null}
        </View>
      )}
    />
  );
};

export default ControlledInput;

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
});
