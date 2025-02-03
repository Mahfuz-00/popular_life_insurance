import { View, Text, ScrollView, ImageBackground, Image, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import React, {useState} from 'react';
import RadioButtonRN from 'radio-buttons-react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Header from './../components/Header';
import globalStyle from '../styles/globalStyle';
import BackgroundImage from '../assets/BackgroundImage.png'
import { Input } from './../components/Input';
import { FilledButton } from './../components/FilledButton';
import { BUTTON_BG_PINK } from '../constants/colorConstant';
import { getPolicyDetails } from '../actions/policyServiceActions';

var numberOptions = [
  {label: 'Proposal No', value: false },
  {label: 'Policy No', value: true }
];

const MyTransactionScreen = ({navigation}) => {
  const dispatch = useDispatch();
    const [number, setNumber] = useState('');
    const [isPolicy, setIsPolicy] = useState(true);
    const [inputOtp, setInputOtp] = useState('');
    const [policyDetails, setPolicyDetails] = useState(null);

    const handleSubmit = async()=>{
      if(isPolicy){
        const res = await dispatch(getPolicyDetails(number));

        if(res)
        {
            setPolicyDetails({
              lastPayDate: res.data.lastPayDate.original,
              totalPaid: res.data.totalPaid,
            });
        }
      }
      
  }

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{flex:1}}>
        <Header navigation = {navigation} title = {'My Transaction'}/>
      
        <ScrollView >
          <View style={globalStyle.wrapper}>

          <RadioButtonRN
            data={numberOptions}
            selectedBtn={(e) => setIsPolicy(e.value)}
            box={false}
            textStyle={{color: '#FFF', fontFamily: globalStyle.fontMedium.fontFamily}}
            initial={2}
          />

          <Input
            label={'Proposal or Policy Number'}
            placeholder={''}        
            value={number}
            onChangeText={setNumber}
            labelStyle={[globalStyle.fontMedium, {color: '#FFF', marginTop: 15}]}
          />

            <FilledButton
                title={'Submit'}
                style={{width: '40%', borderRadius: 50, alignSelf: 'center', marginVertical: 10, backgroundColor: BUTTON_BG_PINK}}
                onPress={() => {
                    handleSubmit()
                }}
            /> 

            <Input
                label={'OTP'}
                placeholder={''}        
                value={inputOtp}
                onChangeText={setInputOtp}
                labelStyle={[globalStyle.fontMedium, {color: '#FFF', marginTop: 15}]}
            />

            <FilledButton
                title={'Verify'}
                style={{width: '40%', borderRadius: 50, alignSelf: 'center', marginVertical: 10, backgroundColor: BUTTON_BG_PINK}}
                onPress={() => {
                    handleSubmit()
                }}
            /> 

            {
              policyDetails && 
              <View style={{borderTopWidth:2, borderLeftWidth: 2, borderRightWidth: 2, borderColor:'#5382AC', marginVertical:15}}>
                <View style={styles.rowWrapper}>
                    <Text style={styles.rowValue}>Last Pay Date</Text>
                    <Text style={styles.rowValue}>{moment(policyDetails.lastPayDate).format('YYYY-MM-DD') }</Text>
                </View>

                <View style={styles.rowWrapper}>
                    <Text style={styles.rowLable}>Total Paid</Text>
                    <Text style={styles.rowValue}>{policyDetails.totalPaid}</Text>
                </View>
            </View>
            }            

          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
    rowWrapper:{
        flexDirection:'row', 
        flexWrap:'wrap', 
        borderBottomWidth:2, 
        borderColor:'#5382AC',
    },
    rowLable:{
        flex:1, 
        textAlign:'center', 
        borderColor:'#5382AC',
        paddingVertical: 5,
        paddingHorizontal: 5,
        fontFamily: globalStyle.fontMedium.fontFamily
    },
    rowValue:{
        flex:1, textAlign:'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        fontFamily: globalStyle.fontMedium.fontFamily
    }
})

export default MyTransactionScreen