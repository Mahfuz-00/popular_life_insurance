import { View, Text, ImageBackground, ScrollView, StyleSheet } from 'react-native'
import React, {useState,useEffect, useRef, useLayoutEffect} from 'react';
import moment from 'moment';

import globalStyle from '../../styles/globalStyle'
import { DatePickerComponent } from './../../components/DatePickerComponent';
import { PickerComponent } from './../../components/PickerComponent';
import { Input } from './../../components/Input';
import { FilledButton } from './../../components/FilledButton';
import Header from './../../components/Header';
import BackgroundImage from '../../assets/BackgroundImage.png'
import { createClaim } from '../../actions/userActions';
import { getClaimTypes } from '../../actions/commonServiceAction';

const PhClaimSubmissionScreen = ({navigation, route}) => {
  const policyNo = route.params.policyNo;

  const [proposerName, setProposerName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [claimTypes, setClaimTypes] = useState([]);
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [dateOfIncident, setDateOfIncident] = useState(new Date('1990-01-01'));
  const [remarks, setRemarks] = useState(''); 

  const [errors, setErrors] = useState({});
  
  const handleClear = () => {
    setType('');
    setAmount('');
    setDateOfIncident(new Date('1990-01-01'));
    setRemarks('');
  }
  
  const handleSubmit = async()=>{   
    setErrors({});

    let postData = {
      policy_no: policyNo,
      type: type,
      amount: amount,
      incident_date: moment(dateOfIncident).format('YYYY-MM-DD'),
      remarks: remarks        
    }

    const res = await createClaim(postData);

    if(res.errors && res.isSuccess == false)
      setErrors(res.errors);

    if(res.isSuccess == true) 
      handleClear();
  }

  useEffect(() => {
    async function fetchData() {      
      const response = await getClaimTypes();
      if(response)
        response.map((item, index)=>
          setClaimTypes(oldArray => [...oldArray,{value: item, label: item}] )
        )
    }

    fetchData();    

  }, []) 

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{flex:1}}>
        <Header navigation = {navigation} title = {'Online Claim'}/>
        <ScrollView style={[globalStyle.wrapper, {margin: 10}]}>     

        <Input
            label={'Policy No'}
            placeholder={''}        
            value={policyNo}
            editable={false}
        />
        
        <PickerComponent
          items = {claimTypes}
          value = {type}
          setValue = {setType}
          label ={'Claim Type'}
          placeholder = {'Select one'}
          errors={errors}
          errorField={'type'}
        />        
        <Input
            label={'Claim Amount'}
            placeholder={''}        
            value={amount}
            onChangeText={setAmount}
            errors={errors}
            errorField={'amount'}
        />

        <DatePickerComponent
          date = {dateOfIncident}
          setDate= {setDateOfIncident}
          label = {'Date of Incident'}
        />        
        <Input
            label={'Remarks'}
            placeholder={''}        
            value={remarks}
            onChangeText={setRemarks}
        />
        <FilledButton
            title={'Submit Claim'}
            style={styles.loginButton}
            onPress={() => {
              handleSubmit();
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

export default PhClaimSubmissionScreen