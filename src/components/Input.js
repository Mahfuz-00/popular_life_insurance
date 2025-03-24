import React from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';
import globalStyle from '../styles/globalStyle';

export function Input({
  style,
  label,
  labelStyle,
  errors = {},
  errorField = '',
  required = false,
  ...props
}) {
  return (
    <View style={styles.container}>
      <Text style={[globalStyle.font, styles.label, labelStyle]}>
        {label}
        {required && <Text style={styles.requiredAsterisk}>*</Text>}{' '}
        {/* Show asterisk only if required */}
      </Text>
      <TextInput
        {...props}
        style={[
          globalStyle.font,
          styles.input,
          style,
          {
            backgroundColor:
              props.editable != undefined
                ? props.editable == false
                  ? '#b2b2b2'
                  : '#FFF'
                : '#FFF',
          },
        ]}
        placeholderTextColor={'darkgray'}
      />

      {errors && errors[errorField] && (
        <Text style={globalStyle.errorMessageText}>{errors[errorField]}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  input: {
    width: '100%',
    paddingHorizontal: 15,
    borderRadius: 8,
    color: 'black',
    borderWidth: 1,
    marginVertical: 8,
    paddingVertical: 10,
  },
  label: {},
  requiredAsterisk: {
    color: 'red', // Red color for the asterisk
  },
});
