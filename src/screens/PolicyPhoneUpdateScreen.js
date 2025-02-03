import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity, Image, ImageBackground } from 'react-native';
import React, {useState,useEffect} from 'react';
import {Picker} from '@react-native-community/picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

import globalStyle from '../styles/globalStyle';
import { Input } from './../components/Input';
import { FilledButton } from './../components/FilledButton';
import { DatePickerComponent } from './../components/DatePickerComponent';
import { PickerComponent } from './../components/PickerComponent';
import { BottomModal } from './../components/BottomModal';
import Header from './../components/Header';

import BackgroundImage from '../assets/BackgroundImage.png'
import { updatePolicyMobile } from './../actions/policyServiceActions';

const PolicyPhoneUpdateScreen = ({navigation}) => {
    const [dateOfBirth, setDateOfBirth] = useState(new Date('1990-01-01'));
    const [policyNo, setPolicyNo] = useState('');
    const [phoneNo, setPhoneNo] = useState('');

    const handleSubmit = async() =>{
      let postData = {
        policyNo: policyNo,
        mobileNo: phoneNo,
        dob: moment(dateOfBirth).format('YYYY-MM-DD')
      }

      await updatePolicyMobile(postData);
  
      await clearData();            
    } 

    const clearData = async()=>{
      setPolicyNo('');
      setDateOfBirth(new Date('1990-01-01'));
      setPhoneNo('');
    }

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{flex:1}}>
        <Header navigation = {navigation} title = {'Policy Phone No Update'}/>
        <ScrollView style={[globalStyle.wrapper, {margin: 10}]}>     
        
        <Input
        label={'policy No'}
        placeholder={''}        
        value={policyNo}
        onChangeText={setPolicyNo}
        />  

        <DatePickerComponent
          date = {dateOfBirth}
          setDate= {setDateOfBirth}
          label = {'Birth Date'}
        />        
        <Input
        label={'Phone No'}
        placeholder={''}        
        value={phoneNo}
        onChangeText={setPhoneNo}
        />

        <FilledButton
        title={'SUBMIT'}
        style={styles.loginButton}
        onPress={() => {
          handleSubmit()
        }}
        />

        </ScrollView>
      </ImageBackground>
    </View>
  )
}
const styles = StyleSheet.create({
    title: {
      marginVertical: 10,
      fontWeight:'bold'
    },
    loginButton: {
      marginVertical: 10,
    }
  });
export default PolicyPhoneUpdateScreen