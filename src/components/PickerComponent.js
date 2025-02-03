import React, {useState,useEffect} from 'react';
import {StyleSheet, TextInput, View, Text, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';

import globalStyle from '../styles/globalStyle';

export function PickerComponent({items=[], value, setValue, setLabel, style, label, placeholder, errors = {}, errorField='', ...props}) {
    
  return (
    <View style={styles.container}>
      <Text style={[globalStyle.font, styles.label]}>{label}</Text>
      <View
          style={styles.picker}
        >
          <Picker
              mode='dropdown'
              selectedValue={value}
              style={[globalStyle.font]}
              onValueChange={(itemValue, itemIndex) =>
                {
                    setValue(itemValue);
                    if(setLabel != undefined){
                        setLabel(itemValue == '' ? '' : items[itemIndex-1].label);
                    }
                    
                }
              }
          >
              <Picker.Item label={placeholder} value="" style={[globalStyle.font]} />
              {
                items.map((item, index)=>(
                  <Picker.Item label={item.label} value={item.value} key={index} style={[globalStyle.font]}/>
                ))
              }
              
          </Picker>
        </View>

        {
          errors && errors[errorField] &&
          <Text style={globalStyle.errorMessageText}>{errors[errorField]}</Text>
        }
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        marginVertical:5
    },
    picker:{
        backgroundColor:'#fff', 
        borderRadius:8,
        borderWidth:1, 
        borderColor:'#000', 
        marginVertical: 8,
    },
  label:{
    
  }
});
