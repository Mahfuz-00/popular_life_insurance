import React, {useState} from 'react';
import {StyleSheet, TextInput, View, Text, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export function SecuredInput({style, label, labelStyle, errors = {}, errorField='', ...props}) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <View style={styles.container}>
      { label && <Text style={styles.text}>{label}</Text>}
      <View style={styles.inputWrapper}>
      <TextInput
        {...props}
        secureTextEntry={!showPassword}
        style={[styles.input, style]}
        placeholderTextColor={'darkgray'}
      />
      <TouchableOpacity style={styles.inputBtn} onPress={() => setShowPassword(!showPassword)}>
        <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={26} color="black" />
      </TouchableOpacity>
      </View>
        {
          errors && errors[errorField] &&
          <Text style={[ {color: 'red'}]}>{errors[errorField]}</Text>
        }
    </View>
    
  );
}

const styles = StyleSheet.create({
  container:{
    marginVertical: 8
  },
  text:{
    color: '#000',
    fontSize: 14,
    marginLeft: 3
  },
  inputWrapper:{
    flexDirection: 'row',
    backgroundColor: '#fff', 
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  input: {       
    padding: 8,    
    color: 'black',
    flex: 1,
    fontSize: 14,
    borderRadius: 8,
  },
  inputBtn:{
    paddingHorizontal: 8
  }
});