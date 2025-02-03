import { View, Text, ScrollView, ToastAndroid, ImageBackground, Image, Dimensions } from 'react-native'
import React, {useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import globalStyle from '../styles/globalStyle';
import { Input } from './../components/Input';
import { FilledButton } from './../components/FilledButton';
import { login, clearErrors, getforgotPasswordOtp, verifyForgotPasswordOtp } from './../actions/userActions';
import BackgroundImage from '../assets/bg-login.png';
import logo from '../assets/icon-producer.png';
import { COMPANY_NAME } from '../config';
import { COMPANY_LOGO } from './../config';

const {height} = Dimensions.get('window');

const ForgotPasswordScreen = ({navigation}) => {

    const dispatch = useDispatch();
    const { isAuthenticated, user, error, loading } = useSelector(state => state.auth);

    const [isSentOtp, setIsSentOtp] = useState(false);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    const handleSubmit =async()=>{     
        let postData={
            phone: phone
        }

        const isSuccess = await dispatch(getforgotPasswordOtp(postData));
        setIsSentOtp(isSuccess);
    } 
    
    const handleVerify =async()=>{     
        let postData={
            phone: phone,
            otp: otp
        }

        const isSuccess = await dispatch(verifyForgotPasswordOtp(postData));
        if(isSuccess == true)
        {
            setIsSentOtp(false);
            setPhone('');
            setOtp('');
            
            navigation.navigate('ResetPassword', {phone: phone});
        }
            
    } 

    useEffect(() => {        

    }, [])

  return (
    <View style={globalStyle.container}>
        
            <View style={{height:'40%'}}>
                <ImageBackground source={BackgroundImage} style={{ flex:1}} resizeMode='stretch'>
                    <View style={{flexDirection:'row', justifyContent:'space-between', padding:15}}>
                        <Icon name="ios-menu" size={24} color="#000" style={{backgroundColor:'#FFF', padding:3, borderRadius: 8}} onPress={()=>navigation.toggleDrawer()} />
                        <Icon name="ios-search" size={24} color="#000" style={{backgroundColor:'#FFF', padding:3, borderRadius: 8}}/>
                    </View>
                    <View style={{flex:1, alignItems:'center'}}>
                        <View style={{width:85, height:85}}>
                            <Image style={{height:'100%',width:'100%'}} source={COMPANY_LOGO}/>
                        </View>
                        
                        <Text style={[globalStyle.fontFjallaOne, {fontSize:24, color:'#000', marginTop:5}]}>{COMPANY_NAME}</Text>
                    </View>
                </ImageBackground>
            </View>
            <View style={{height:'60%', backgroundColor:'#FFF', borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
                <ScrollView>
                    <View style={{alignItems:'center', padding: 20}}>
                        <Text style={[globalStyle.fontFjallaOne, {fontSize: 26}]}>Forgot Password</Text>
                        
                        {
                            !isSentOtp &&
                            <View style={{width:'100%', marginTop: 15}}>
                                <Input
                                    label={'Phone No'}
                                    placeholder={''}        
                                    value={phone}
                                    onChangeText={setPhone}
                                    style={{backgroundColor:'#D0D0D0'}}
                                />

                                <FilledButton
                                    title={'Submit'}
                                    style={{width: '40%', borderRadius: 50, alignSelf: 'center', marginVertical: 10, backgroundColor:'#EE4E89'}}
                                    onPress={() => {
                                        handleSubmit()
                                    }}
                                />                  
                            </View>
                        }

                        {
                            isSentOtp && 
                            <View style={{width:'100%', marginTop: 15}}>
                                <Input
                                    label={'Phone No'}
                                    placeholder={''}        
                                    value={phone}
                                    onChangeText={setPhone}
                                    style={{backgroundColor:'#D0D0D0'}}
                                    editable={false}
                                />

                                <Input
                                    label={'OTP'}
                                    placeholder={''}        
                                    value={otp}
                                    onChangeText={setOtp}
                                    style={{backgroundColor:'#D0D0D0'}}
                                />

                                <FilledButton
                                    title={'Verify'}
                                    style={{width: '40%', borderRadius: 50, alignSelf: 'center', marginVertical: 10, backgroundColor:'#EE4E89'}}
                                    onPress={() => {
                                        handleVerify()
                                    }}
                                />                  
                            </View>
                            
                        } 
                        <Text onPress={() => navigation.navigate('Login')} style={[globalStyle.font]}>Go to Login</Text>
                    </View>
                </ScrollView>
            </View>
        
    </View>
  )
}

export default ForgotPasswordScreen