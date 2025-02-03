import { View, Text, ScrollView, ToastAndroid, ImageBackground, Image, Dimensions, TouchableOpacity, Modal } from 'react-native'
import CheckBox from "@react-native-community/checkbox";
import React, {useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import globalStyle from '../styles/globalStyle';
import { Input } from './../components/Input';
import { FilledButton } from './../components/FilledButton';
import { login, clearErrors } from './../actions/userActions';
import BackgroundImage from '../assets/bg-login.png';
import { COMPANY_NAME } from '../config';
import { COMPANY_LOGO } from './../config';
import { SecuredInput } from '../components/SecuredInput';

const {height} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
    const [isRemember, setIsRemember] = useState(false)
    const [isShowSavedAccounts, setIsShowSavedAccounts] = useState(false)
    const [savedcredentials, setSavedcredentials] = useState([])
    const dispatch = useDispatch();
    const { isAuthenticated, user, error, loading } = useSelector(state => state.auth);

    // const [userName, setUserName] = useState('01322919716');
    // const [password, setPassword] = useState('12345600');

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});

    const handleSubmit =async()=>{     
        //return console.log({phone: userName, password: password, isRemember: isRemember})
        setErrors({});

        const res = await dispatch(login({phone: userName, password: password, isRemember: isRemember}));
        if(res != undefined && res.errors) setErrors(res.errors); 
    } 

    const showSavedAccounts = async() => {
        setSavedcredentials(JSON.parse(await AsyncStorage.getItem('savedcredentials')) ?? []);
        // var savedcredentials = await AsyncStorage.getItem('savedcredentials');
        // console.log(savedcredentials)
        setIsShowSavedAccounts(true);
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
            ToastAndroid.show(error, ToastAndroid.LONG);
            dispatch(clearErrors());
        }

    }, [dispatch, isAuthenticated, error])

  return (
    <View style={globalStyle.container}>
        <Modal
                animationType='fade'
                transparent={true}
                visible={isShowSavedAccounts}
                onRequestClose = {this.close}
            >
              <View
                style = {{
                    flex: 1,
                    backgroundColor: '#000000AA',
                    justifyContent:'center',
                    alignItems: 'center'
                }}
              >
                
                  <View style={{ height: 400, width: '90%', backgroundColor: '#FFFFFF', borderRadius: 16 }}>
                      <ScrollView style={{ flex: 1 }}>
                          {
                              savedcredentials.map((cred, index) => {
                                  return (
                                      <TouchableOpacity
                                        key={index}
                                          style={{ backgroundColor: 'gray', paddingVertical: 16, alignItems: 'center', borderBottomWidth: 1 }}
                                          onPress={() => { setUserName(cred.userName); setPassword(cred.password); setIsShowSavedAccounts(false)}}
                                      >
                                          <Text style={{ fontSize: 16, color: '#FFFFFF' }}>{cred.userName} / *****</Text>
                                      </TouchableOpacity>
                                  )
                              })
                          }

                      </ScrollView>
                      <FilledButton
                          title={'Close'}
                          style={{ width: '40%', borderRadius: 50, alignSelf: 'center', marginVertical: 10, backgroundColor: '#EE4E89' }}
                          onPress={() => {
                              setIsShowSavedAccounts(false)
                          }}
                      />

                  </View>
                
              </View>
            </Modal>
        
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
                        <Text style={[globalStyle.fontFjallaOne, {fontSize: 26}]}>Login</Text>
                        <Text style={[globalStyle.font]}>Login to Continue</Text>

                        <View style={{width:'100%', marginTop: 15}}>
                            <Input
                                label={'Phone No'}
                                placeholder={''}        
                                value={userName}
                                onChangeText={setUserName}
                                style={{backgroundColor:'#D0D0D0'}}
                                errors={errors}
                                errorField={'phone'}
                            />

                            <TouchableOpacity
                                onPress={() => showSavedAccounts()}
                                style={{flexDirection: 'row', alignItems: 'center'}}
                            >
                                <Text style={{color: 'blue'}}>Saved Accounts </Text>
                                <Icon name="save" size={24} color="#000" style={{ padding:3, borderRadius: 8}}/>
                            </TouchableOpacity>

                            <SecuredInput
                                label={'Password'}
                                placeholder={''}        
                                value={password}
                                onChangeText={setPassword}
                                style={{backgroundColor:'#fff'}}
                                secureTextEntry={true}
                                errors={errors}
                                errorField={'password'}
                            />

                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <CheckBox
                                    value={isRemember}
                                    onValueChange={e => setIsRemember(e)}                  
                                    tintColors = "black"            
                                />
                                <Text style={globalStyle.font}>Remember Me?</Text>
                            </View>

                            <FilledButton
                                title={'Login'}
                                style={{width: '40%', borderRadius: 50, alignSelf: 'center', marginVertical: 10, backgroundColor:'#EE4E89'}}
                                onPress={() => {
                                    handleSubmit()
                                }}
                            />                        
                        </View>
                        <Text onPress={() => navigation.navigate('ForgotPassword')} style={[globalStyle.font,{marginBottom: 5}]}>Forgot Password?</Text>
                        <Text onPress={() => navigation.navigate('Registration')} style={[globalStyle.font]}>Dont have an account? Sign up</Text>
                    </View>
                </ScrollView>
            </View>
        
    </View>
  )
}

export default LoginScreen