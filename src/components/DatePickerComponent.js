import React, {useState,useEffect} from 'react';
import {StyleSheet, TextInput, View, Text, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

import globalStyle from '../styles/globalStyle';

export function DatePickerComponent({date, setDate, style, label, labelStyle, ...props}) {
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(new Date('1990-01-01'));

  return (
    <View style={[styles.container, style]}>
      <Text style={[globalStyle.font, labelStyle]}>{label}</Text>
      <TouchableOpacity
        onPress={()=> props.editable != undefined ? props.editable == false ? '' : setOpenDatePicker(true) : setOpenDatePicker(true) }
      >
        <TextInput
          style={[globalStyle.font, styles.textInput, {backgroundColor: props.editable != undefined ? props.editable == false ? '#b2b2b2' : '#FFF' : '#FFF' } ]}
          editable={false}
          value={date ? moment(date).format('YYYY-MM-DD') : '' }
        />
      </TouchableOpacity>
      <DatePicker
          modal
          mode={"date"}
          open={openDatePicker}
          date={dateOfBirth}
          onConfirm={(date) => {
            setOpenDatePicker(false)
            setDate(date)
          }}
          onCancel={() => {
            setOpenDatePicker(false)
          }}
          textColor="green" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
      marginVertical:5
    },
    textInput: {
      borderWidth:1,
      borderRadius:8, 
      backgroundColor:'#fff', 
      color:'black',
      paddingHorizontal: 15,
      marginVertical: 8,
      paddingVertical:10,
      fontSize:16
    },
  label:{
    
  }
});
