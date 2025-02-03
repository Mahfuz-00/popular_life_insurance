
import axios from 'axios';
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
import { getPlanList, getTermList, getCalculatedPremium } from './../actions/calculatePremiumActions';
import { API } from './../config';

const PremiumCalculatorScreen = ({navigation}) => { 
  let modalRef = React.createRef();

  const [dateOfBirth, setDateOfBirth] = useState(new Date('1990-01-01'));
  const [plans, setPlans] = useState([]);
  const [terms, setTerms] = useState([]);
  const [modes, setModes] = useState([
    {label: 'Yearly', value:'yly'},
    {label: 'Half Yearly', value:'hly'},
    {label: 'Quarterly', value:'qly'},
    {label: 'Monthly', value:'mly'},
  ]);

  const [age, setAge] = useState('');
  const [plan, setPlan] = useState('');
  const [term, setTerm] = useState('');
  const [mode, setMode] = useState('');
  const [sumAssured, setSumAssured] = useState('');
  const [premium, setPremium] = useState('');

  const handleSubmit = async() =>{
    let postData = {
      plan: plan,
      tarm: term,
      mode: mode,
      dob: moment(dateOfBirth).format('YYYY-MM-DD'),
      sumAssured: sumAssured
    }

    const calculatedPremium = await getCalculatedPremium(postData);

    setPremium(calculatedPremium);
          
  }  

  const onCloseModal = () =>{
    modalRef.close();
  }  

  // const getPlanList=async()=>{
  //   const { data } = await axios.get(`${API}/api/plans`);
  //   setPlans(data.data.map((item)=>({label: item.name, value: item.code})));
  // }

  // useEffect(() => {
  //   if(premium){
  //     modalRef.show();
  //   }
  // }, [premium]) 

  useEffect(() => {
    var age = moment().diff(dateOfBirth, 'years');
    setAge(age);
}, [dateOfBirth]) 

  useEffect(() => {    
    async function fetchData() {      
      const response = await getPlanList();
      if(response)
        setPlans(response);
    }
    fetchData();    
  }, [])

  useEffect(() => {
    async function fetchData() {      
      const response = await getTermList(plan);
      if(response)
        setTerms(response);
    }
    if(plan){
      fetchData(); 
    }else{
      setTerms([]);
    }      
  }, [plan]) 

  const renderContent = () =>{   

    return (
        <View>
            <View style={{flexDirection:'row', marginVertical: 5}}>
              <Text style={[globalStyle.font, {width:'48%', fontWeight: 'bold'}]}>Birth Date</Text>
              <Text style={[globalStyle.font, {width:'2%'}]}>:</Text>
              <Text style={[globalStyle.font, {width:'48%', marginLeft: 20}]}>{moment(dateOfBirth).format('YYYY-MM-DD')}</Text>
            </View>

            <View style={{flexDirection:'row', marginVertical: 5}}>
              <Text style={[globalStyle.font, {width:'48%', fontWeight: 'bold'}]}>Term</Text>
              <Text style={[globalStyle.font, {width:'2%'}]}>:</Text>
              <Text style={[globalStyle.font, {width:'48%', marginLeft: 20}]}>{term}</Text>
            </View>

            <View style={{flexDirection:'row', marginVertical: 5}}>
              <Text style={[globalStyle.font, {width:'48%', fontWeight: 'bold'}]}>Sum Assured</Text>
              <Text style={[globalStyle.font, {width:'2%'}]}>:</Text>
              <Text style={[globalStyle.font, {width:'48%', marginLeft: 20}]}>{sumAssured}</Text>
            </View>

            <View style={{flexDirection:'row', marginVertical: 5}}>
              <Text style={[globalStyle.font, {width:'48%', fontWeight: 'bold'}]}>Premium</Text>
              <Text style={[globalStyle.font, {width:'2%'}]}>:</Text>
              <Text style={[globalStyle.font, {width:'48%', marginLeft: 20}]}>{premium}</Text>
            </View>

            <View style={{flexDirection:'row', marginVertical: 5}}>
              <Text style={[globalStyle.font, {width:'48%', fontWeight: 'bold'}]}>Mode</Text>
              <Text style={[globalStyle.font, {width:'2%'}]}>:</Text>
              <Text style={[globalStyle.font, {width:'48%', marginLeft: 20}]}>{mode}</Text>
            </View>

            <View style={{flexDirection:'row', marginVertical: 5, justifyContent:'space-between'}}>
              <FilledButton
                title={'Apply'}
                style={{width: '48%'}}
                onPress={() => {
                  navigation.replace('ApplyOnline', {
                    dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD'),
                    age: age,
                    plan: plan,
                    term: term,
                    sumAssured: sumAssured,
                    premium: premium
                  })
                }}
                />

              <FilledButton
                title={'Cancel'}
                style={{width: '48%'}}
                onPress={() => {
                  onCloseModal()
                }}
                />
            </View>
        </View>
    )
  }

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{flex:1}}>
        <Header navigation = {navigation} title = {'Premium Calculator'}/>
        <ScrollView style={[globalStyle.wrapper, {margin: 10}]}>     

        <DatePickerComponent
          date = {dateOfBirth}
          setDate= {setDateOfBirth}
          label = {'Birth Date'}
        />

        <PickerComponent
          items = {plans}
          value = {plan}
          setValue = {setPlan}
          label ={'Product / Plan'}
          placeholder = {'Select one'}
        />

        <PickerComponent
          items = {terms}
          value = {term}
          setValue = {setTerm}
          label ={'Term'}
          placeholder = {'Select one'}
        />

        <PickerComponent
          items = {modes}
          value = {mode}
          setValue = {setMode}
          label ={'Mode'}
          placeholder = {'Select one'}
        />

        {/* <PickerComponent
          items = {[{label: 'Yearly', value:'Yly'}, {label: 'Monthly', value:'Mly'}]}
          value = {mode}
          setValue = {setMode}
          label ={'Mode of Payment'}
          placeholder = {'Select one'}
        /> */}

        <Input
        label={'Sum Assured'}
        placeholder={''}        
        value={sumAssured}
        onChangeText={setSumAssured}
        />

        <FilledButton
        title={'SUBMIT'}
        style={styles.loginButton}
        onPress={() => {
          handleSubmit();
          modalRef.show();
        }}
        />

        <BottomModal
        title = {'Premium Calculation'}
        content = {renderContent()}
        ref={(target) => modalRef = target}
        onTouchOutside = {onCloseModal}
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

export default PremiumCalculatorScreen