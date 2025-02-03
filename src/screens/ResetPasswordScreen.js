import { View, Text, ScrollView, ToastAndroid, ImageBackground, Image, Dimensions } from 'react-native'
import React, {useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import globalStyle from '../styles/globalStyle';
import { Input } from './../components/Input';
import { FilledButton } from './../components/FilledButton';
import { resetPassword } from './../actions/userActions';
import BackgroundImage from '../assets/bg-login.png';
import logo from '../assets/icon-producer.png';
import { COMPANY_NAME } from '../config';
import { COMPANY_LOGO } from './../config';

const {height} = Dimensions.get('window');

const ResetPasswordScreen = ({navigation, route}) => {

    const dispatch = useDispatch();
    const { isAuthenticated, user, error, loading } = useSelector(state => state.auth);

    const phone = route.params.phone;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit =async()=>{     
        let postData={
            phone: phone,
            password: password,
            confirm_password: confirmPassword
        }

        const isSuccess = await dispatch(resetPassword(postData));
        if(isSuccess == true)
            navigation.replace('Login');
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
                        
                            <View style={{width:'100%', marginTop: 15}}>
                                <Input
                                    label={'Password'}
                                    placeholder={''}        
                                    value={password}
                                    onChangeText={setPassword}
                                    style={{backgroundColor:'#D0D0D0'}}
                                />

                                <Input
                                    label={'Confirm Password'}
                                    placeholder={''}        
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
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
                                       
                        <Text onPress={() => navigation.navigate('Login')} style={[globalStyle.font]}>Go to Login</Text>
                    </View>
                </ScrollView>
            </View>
        
    </View>
  )
}

export default ResetPasswordScreen