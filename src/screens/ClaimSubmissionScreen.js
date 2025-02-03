import { View, Text, ImageBackground, ScrollView, StyleSheet } from 'react-native'
import React, {useState,useEffect, useRef, useLayoutEffect} from 'react';
import globalStyle from '../styles/globalStyle'
import { DatePickerComponent } from './../components/DatePickerComponent';
import { PickerComponent } from './../components/PickerComponent';
import { Input } from './../components/Input';
import { FilledButton } from './../components/FilledButton';
import Header from './../components/Header';
import BackgroundImage from '../assets/BackgroundImage.png'

const claimTypes = [
    {value:'Death Claim', label:'Death Claim'},
    {value:'Survival Benefit', label:'Survival Benefit (SB)'},    
];

const ClaimSubmissionScreen = ({navigation, route}) => {

  const [policyNo, setPolicyNo] = useState('');
  const [proposerName, setProposerName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [claimType, setClaimType] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [dateOfIncident, setDateOfIncident] = useState(new Date('1990-01-01'));
  const [remarks, setRemarks] = useState(''); 
  
  const handleClear = () => {
    setPolicyNo('');
    setClaimType('');
    setClaimAmount('');
    setDateOfIncident(new Date('1990-01-01'));
    setRemarks('');
  }
  
  const handleSubmit = async()=>{   

    let postData = {
      policy_no: policyNo,
      type: claimType,
      amount: claimAmount,
      incident_date: moment(dateOfIncident).format('YYYY-MM-DD'),
      remarks: remarks
        
    }

    const res = await createClaim(postData);

    if(res == true) 
      handleClear();

  }

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{flex:1}}>
        <Header navigation = {navigation} title = {'Online Claim'}/>
        <ScrollView style={[globalStyle.wrapper, {margin: 10}]}>     

        <Input
            label={'Policy No'}
            placeholder={''}        
            value={policyNo}
            onChangeText={setPolicyNo}
        />
        
        <PickerComponent
          items = {claimTypes}
          value = {claimType}
          setValue = {setClaimType}
          label ={'Claim Type'}
          placeholder = {'Select one'}
        />        
        <Input
            label={'Claim Amount'}
            placeholder={''}        
            value={claimAmount}
            onChangeText={setClaimAmount}
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

export default ClaimSubmissionScreen