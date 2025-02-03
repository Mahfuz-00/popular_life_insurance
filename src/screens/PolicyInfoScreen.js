import { View, Text, ImageBackground, ScrollView, StyleSheet } from 'react-native'
import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import BackgroundImage from '../assets/BackgroundImage.png';
import globalStyle from '../styles/globalStyle';
import Header from './../components/Header';
import { Input } from './../components/Input';
import { FilledButton } from './../components/FilledButton';
import { getPolicyDetails } from '../actions/policyServiceActions';
import { DatePickerComponent } from './../components/DatePickerComponent';

const PolicyInfoScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const [policyNumber, setPolicyNumber] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [otp, setOtp] = useState('');
    const [sentOtp, setSentOtp] = useState('');
    const [policyDetails, setPolicyDetails] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(new Date('1990-01-01'));

    const handleClear = () => {
        setPolicyDetails(null);
        setSentOtp('');
        setOtp('');
    }

    const handleSubmit = async()=>{      

        let postDataWithOtp = {
            policyNo: policyNumber,
            dob: moment(dateOfBirth).format('YYYY-MM-DD'),
            phoneNo: phoneNo,
            code: otp
        }

        let postDataWithoutOtp = {
            policyNo: policyNumber,
            dob: moment(dateOfBirth).format('YYYY-MM-DD'),
            phoneNo: phoneNo
        }

        const res = await dispatch(getPolicyDetails(sentOtp ? postDataWithOtp : postDataWithoutOtp));

        if(res.data == null) return alert('Invalid data')

        if(res.data.code){
            setSentOtp(res.data.code);
        }

        if(res.data.name)
        {
            setPolicyDetails({
                name: res.data.name,
                sumAssured: res.data.sumAssured,
                totalPremium: res.data.totalPremium,
                plan: res.data.plan,
                tarm: res.data.tarm,
                mode: res.data.mode,
            });
        }
    }

  return (
    <View style={globalStyle.container}>
        <ImageBackground source={BackgroundImage} style={{flex:1}}>
            <Header navigation = {navigation} title = {'Policy Information'}/>      
            <ScrollView>
                <View style={globalStyle.wrapper}>
                    <Input
                        label={'Policy Number'}
                        placeholder={''}        
                        value={policyNumber}
                        onChangeText={setPolicyNumber}
                        labelStyle={[globalStyle.fontMedium, {color: '#FFF', marginTop: 15}]}
                        editable={sentOtp != '' ? false : true}
                    />

                    <DatePickerComponent
                        date = {dateOfBirth}
                        setDate= {setDateOfBirth}
                        label = {'Birth Date'}
                        labelStyle = {{color: '#FFF'}}
                        editable={sentOtp != '' ? false : true}
                    />

                    <Input
                        label={'Phone No.'}
                        placeholder={''}        
                        value={phoneNo}
                        onChangeText={setPhoneNo}
                        labelStyle={[globalStyle.fontMedium, {color: '#FFF', marginTop: 15}]}
                        editable={sentOtp != '' ? false : true}
                    />

                    {
                        sentOtp != '' &&
                        <Input
                            label={'OTP'}
                            placeholder={''}        
                            value={otp}
                            onChangeText={setOtp}
                            labelStyle={[globalStyle.fontMedium, {color: '#FFF', marginTop: 15}]}
                        />
                        
                    }

                    {
                        policyDetails ? 
                        <FilledButton
                            title={'Clear'}
                            style={{width: '40%', borderRadius: 50, alignSelf: 'center', marginVertical: 10, backgroundColor:'#EE4E89'}}
                            onPress={() => {
                                handleClear()
                            }}
                        /> 
                        :
                        <FilledButton
                            title={'Submit'}
                            style={{width: '40%', borderRadius: 50, alignSelf: 'center', marginVertical: 10, backgroundColor:'#EE4E89'}}
                            onPress={() => {
                                handleSubmit()
                            }}
                        /> 

                    }

                    

                    {
                        policyDetails && 
                        <View style={{borderTopWidth:2, borderLeftWidth: 2, borderRightWidth: 2, borderColor:'#5382AC', marginVertical:15}}>
                        <View style={styles.rowWrapper}>
                            <Text style={styles.rowLable}>Name</Text>
                            <Text style={styles.rowValue}>{policyDetails.name}</Text>
                        </View>

                        <View style={styles.rowWrapper}>
                            <Text style={styles.rowLable}>Plan</Text>
                            <Text style={styles.rowValue}>{policyDetails.plan}</Text>
                        </View>

                        <View style={styles.rowWrapper}>
                            <Text style={styles.rowLable}>Term</Text>
                            <Text style={styles.rowValue}>{policyDetails.tarm}</Text>
                        </View>

                        <View style={styles.rowWrapper}>
                            <Text style={styles.rowLable}>Sum Assured</Text>
                            <Text style={styles.rowValue}>{policyDetails.sumAssured}</Text>
                        </View>

                        <View style={styles.rowWrapper}>
                            <Text style={styles.rowLable}>Total Premium</Text>
                            <Text style={styles.rowValue}>{policyDetails.totalPremium}</Text>
                        </View>                        

                        <View style={styles.rowWrapper}>
                            <Text style={styles.rowLable}>Mode</Text>
                            <Text style={styles.rowValue}>{policyDetails.mode}</Text>
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
        borderRightWidth: 2, 
        borderColor:'#5382AC',
        paddingVertical: 5,
        paddingHorizontal: 5,
        fontFamily: globalStyle.fontMedium.fontFamily,
        color:'#000'
    },
    rowValue:{
        flex:1, textAlign:'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        fontFamily: globalStyle.fontMedium.fontFamily,
        color:'#000'
    }
})
export default PolicyInfoScreen