import { View, Text, ScrollView, ToastAndroid, ImageBackground, Image, Dimensions } from 'react-native'
import React, {useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import globalStyle from '../styles/globalStyle';
import { Input } from '../components/Input';
import { FilledButton } from '../components/FilledButton';
import { login, clearErrors, register, verifyRegistration } from '../actions/userActions';
import BackgroundImage from '../assets/bg-login.png';
import logo from '../assets/icon-producer.png';
import { COMPANY_NAME } from '../config';
import { COMPANY_LOGO } from '../config';
import { SecuredInput } from '../components/SecuredInput';

const RegistrationScreen = ({navigation}) => {

    const dispatch = useDispatch();
    const { isAuthenticated, user, error, loading } = useSelector(state => state.auth);

    const [isSentOtp, setIsSentOtp] = useState(false);
    const [errors, setErrors] = useState(
        {
            
        }
    );

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [otp, setOtp] = useState('');

    const handleVerify =async()=>{     
        let postData={            
            phone: phone,
            otp: otp
        }

        const isSuccess = await dispatch(verifyRegistration(postData));
    } 

    const handleSubmit =async()=>{     
        setErrors({});
        
        let postData={
            name: name,
            phone: phone,
            email: email,
            password: password,
            confirm_password: confirmPassword
        }

        const isSuccess = await dispatch(register(postData));

        if(isSuccess.errors) return setErrors(isSuccess.errors);

        setIsSentOtp(isSuccess);
    } 

    useEffect(() => {

        if (isAuthenticated) {
            if(user.type == 'policy holder'){
                navigation.replace('PhPolicyList');
            }else if(user.type == 'agent'){
                navigation.replace('DashboardProducer');
            }
        }

        if (error) {
            
            dispatch(clearErrors());
        }

    }, [dispatch, isAuthenticated, error])

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
                    <Text style={[globalStyle.fontFjallaOne, {fontSize: 26}]}>Registration</Text>
                    <Text style={[globalStyle.font]}>Login to Continue</Text>

                    {
                        !isSentOtp &&

                        <View style={{width:'100%', marginTop: 15}}>
                            <Input
                                label={'Name'}
                                placeholder={''}        
                                value={name}
                                onChangeText={setName}
                                errors={errors}
                                errorField={'name'}
                                style={{backgroundColor:'#D0D0D0'}}
                            />

                            <Input
                                label={'Phone'}
                                placeholder={''}        
                                value={phone}
                                onChangeText={setPhone}
                                errors={errors}
                                errorField={'phone'}
                                style={{backgroundColor:'#D0D0D0'}}
                            />

                            <Input
                                label={'Email'}
                                placeholder={''}        
                                value={email}
                                onChangeText={setEmail}
                                errors={errors}
                                errorField={'email'}
                                style={{backgroundColor:'#D0D0D0'}}
                            />

                            <SecuredInput
                                label={'Password'}
                                placeholder={''}        
                                value={password}
                                onChangeText={setPassword}
                                style={{backgroundColor:'#FFF'}}
                                errors={errors}
                                errorField={'password'}
                                secureTextEntry={true}
                            />

                            <SecuredInput
                                label={'Confirm Password'}
                                placeholder={''}        
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                style={{backgroundColor:'#FFF'}}
                                errors={errors}
                                errorField={'confirm_password'}
                                secureTextEntry={true}
                            />

                            <FilledButton
                                title={'Register'}
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
                    <Text onPress={() => navigation.navigate('Login')} style={[globalStyle.font]}>Already have an account? Login</Text>
                </View>
            </ScrollView>
        </View>        
    </View>
  )
}

export default RegistrationScreen