import { View, Text, ImageBackground, ScrollView, StyleSheet } from 'react-native'
import React, {useState,useEffect, useRef, useLayoutEffect} from 'react';
import globalStyle from '../styles/globalStyle'
import { DatePickerComponent } from './../components/DatePickerComponent';
import { PickerComponent } from './../components/PickerComponent';
import { Input } from './../components/Input';
import { FilledButton } from './../components/FilledButton';
import Header from './../components/Header';
import BackgroundImage from '../assets/BackgroundImage.png'

const RelationOptions = [
    {value:'FATHER', label:'Father'},
    {value:'MOTHER', label:'Mother'},
    {value:'WIFE', label:'Wife'},
    {value:'HUSBAND', label:'Husband'},
    {value:'SON', label:'Son'},
    {value:'DAUGHTER', label:'Daughter'},
    {value:'BROTHER', label:'Brother'},
    {value:'SISTER', label:'Sister'},
    {value:'NEPHEW', label:'Nephew'},
    {value:'NIECE', label:'Niece'},
    {value:'UNCLE', label:'Uncle'},
    {value:'AUNT', label:'Aunt'},
    {value:'GRAND FATHER', label:'Grand Father'},
    {value:'GRAND MOTHER', label:'Grand Mother'},
];

const educationOptions = [
    {value:'NoLit', label:'No Literacy'},
    {value:'PSC', label:'PSC'},
    {value:'JSC', label:'JSC'},
    {value:'SSC/Equivalent', label:'SSC/Equivalent'},
    {value:'HSC/Equivalent', label:'HSC/Equivalent'},
    {value:'BSc/Equivalent', label:'BSc/Equivalent'},
    {value:'MSc/Equivalent', label:'MSc/Equivalent'},
    {value:'PhD/Equivalent', label:'PhD/Equivalent'}
];

const ApplyOnlineScreen = ({navigation, route}) => {
    const firstRender = useRef(true);

    const [dateOfBirth, setDateOfBirth] = useState(new Date('1990-01-01'));
  const [plans, setPlans] = useState([]);
  const [terms, setTerms] = useState([]);
  const [modes, setModes] = useState([]);
  
  

  const [age, setAge] = useState(route.params?.age ?? '');
  const [plan, setPlan] = useState(route.params?.plan ?? '');
  const [term, setTerm] = useState(route.params?.term ?? '');
  const [rate, setRate] = useState(route.params?.rate ?? '');
  const [mode, setMode] = useState(route.params?.mode ?? '');
  const [sumAssured, setSumAssured] = useState(route.params?.sumAssured ?? '');
  const [premium, setPremium] = useState(route.params?.premium ?? '1000');

  const [idType, setIdType] = React.useState('');
    const [idNumber, setIdNumber] = React.useState('');
    const [proposersName, setProposersName] = React.useState('');
    const [fatherName, setFatherName] = React.useState('');
    const [motherName, setMotherName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [education, setEducation] = React.useState('');
    
    const [faCode, setFaCode] = React.useState('');
    const [nomineeName, setNomineeName] = React.useState('');
    const [nomineeAge, setNomineeAge] = React.useState('');
    const [nomineeRelation, setNomineeRelation] = React.useState('');

    const getPremium=()=>{
        setPremium('1000');
    }  

    useLayoutEffect(() => {
        if(!firstRender.current){
            setPremium('');
        }                          
        
    }, [dateOfBirth, plan, term, mode, sumAssured]);

    useEffect(() => {        
        firstRender.current = false;    
    }, []);
    

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{flex:1}}>
        <Header navigation = {navigation} title = {'Apply for Policy'}/>
        <ScrollView style={[globalStyle.wrapper, {margin: 10}]}>     

        <DatePickerComponent
          date = {dateOfBirth}
          setDate= {setDateOfBirth}
          label = {'Birth Date'}
        />

        <PickerComponent
          items = {[{label: 'product one', value:'01'}, {label: 'two product', value:'02'}]}
          value = {plan}
          setValue = {setPlan}
          label ={'Product / Plan'}
          placeholder = {'Select one'}
        />

        <PickerComponent
          items = {[{label: '6', value:'80.5'}, {label: '10', value:'75'}]}
          value = {rate}
          setValue = {setRate}
          setLabel = {setTerm}
          label ={'Term'}
          placeholder = {'Select one'}
        />

        <PickerComponent
          items = {[{label: 'Yearly', value:'Yly'}, {label: 'Monthly', value:'Mly'}]}
          value = {mode}
          setValue = {setMode}
          label ={'Mode of Payment'}
          placeholder = {'Select one'}
        />

        <Input
            label={'Sum Assured'}
            placeholder={''}        
            value={sumAssured}
            onChangeText={setSumAssured}
        />

        <Input
            label={'Premium'}
            placeholder={''}        
            value={premium}
            editable={false}
        />
{
    premium == '' &&
    <>
        <FilledButton
            title={'GET PREMIUM'}
            style={styles.loginButton}
            onPress={() => {
                getPremium()
            }}
        />
        </>
}

{
    premium != '' && 
    <>
        <PickerComponent
          items = {[{label: 'NID', value:'NID'}, {label: 'Birth Certificate', value:'Birth_Certificate'}]}
          value = {idType}
          setValue = {setIdType}
          label ={'ID Type'}
          placeholder = {'Select one'}
        />

        <Input
            label={'ID Number'}
            placeholder={''}        
            value={idNumber}
            onChangeText={setIdNumber}
        />

        <Input
            label={'Proposers Name'}
            placeholder={''}        
            value={proposersName}
            onChangeText={setProposersName}
        />

        <Input
            label={'Father Name'}
            placeholder={''}        
            value={fatherName}
            onChangeText={setFatherName}
        />

        <Input
            label={'Mother Name'}
            placeholder={''}        
            value={motherName}
            onChangeText={setMotherName}
        />

        <Input
            label={'Mother Name'}
            placeholder={''}        
            value={address}
            onChangeText={setAddress}
        />

        <PickerComponent
          items = {[{label: 'Male', value:'male'}, {label: 'Female', value:'female'}]}
          value = {gender}
          setValue = {setGender}
          label ={'Gender'}
          placeholder = {'Select one'}
        />

        <PickerComponent
          items = {educationOptions}
          value = {education}
          setValue = {setEducation}
          label ={'Education'}
          placeholder = {'Select one'}
        />

        <Input
            label={'FA Code ( optional )'}
            placeholder={''}        
            value={faCode}
            onChangeText={setFaCode}
        />

        <Input
            label={'Nominee Name'}
            placeholder={''}        
            value={nomineeName}
            onChangeText={setNomineeName}
        />

        <Input
            label={'Nominee Age'}
            placeholder={''}        
            value={nomineeAge}
            onChangeText={setNomineeAge}
        />

        <PickerComponent
          items = {RelationOptions}
          value = {nomineeRelation}
          setValue = {setNomineeRelation}
          label ={'Nominee Relation'}
          placeholder = {'Select one'}
        />

        <FilledButton
            title={'SUBMIT'}
            style={styles.loginButton}
            onPress={() => {
            handleSubmit()
            }}
        />
</>
}
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

export default ApplyOnlineScreen