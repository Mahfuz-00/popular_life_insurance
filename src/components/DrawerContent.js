import React, {useContext,useEffect,useRef} from 'react';
import {Alert,BackHandler,View,Text,TouchableOpacity,StyleSheet,ScrollView,Image,Dimensions} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';

import { COMPANY_NAME } from '../config';
import { COMPANY_LOGO } from './../config';
import { logout } from './../actions/userActions';


function DrawerContent({navigation}) {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(logout(navigation)); 
    }

    return (
        <View style={styles.drawer}>
            <View style={{ padding:15, height:'15%'}}>
                <Icon style={{}} name="arrow-back-sharp" size={26} color="#000" onPress={()=>navigation.toggleDrawer()} />
                <View style={{flexDirection:'row', backgroundColor:'#fff', flex:1, marginTop:10}} >
                    <View style={{width:'30%',  height:'100%'}}>
                        <Image style={{height:'100%',width:'100%', resizeMode: 'contain'}} source={COMPANY_LOGO}/>
                    </View>
                    <View style={{flexDirection:'column', width:'70%'}}>
                        <Text style={{ fontSize:16, fontWeight:'bold', color:'#000'}}>{COMPANY_NAME}</Text>
                        {/* <Text>xyz@mail.com</Text> */}
                    </View>
                </View>

                
            </View>
            <View style={styles.line}></View>
            <ScrollView>
            <Text style={styles.drawerBodySectionTitle}>General</Text>

                <TouchableOpacity
                    onPress={()=>navigation.navigate('Home')}
                    style={styles.drawerBodyMenu}
                >
                    <View style={styles.drawerBodyMenuIconContainer}>
                        {/* <FontAwesome style={styles.drawerBodyMenuIcon}  name="file"  /> */}
                        <Icon style={styles.drawerBodyMenuIcon} name="home" size={30} color="#000" />
                    </View>
                    
                    <Text style={styles.drawerBodyMenuText}>Home</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={()=>navigation.navigate('MessageFromMd')}
                    style={styles.drawerBodyMenu}
                >
                    <View style={styles.drawerBodyMenuIconContainer}>
                        {/* <FontAwesome style={styles.drawerBodyMenuIcon}  name="file"  /> */}
                        <Icon style={styles.drawerBodyMenuIcon} name="mail-outline" size={30} color="#000" />
                    </View>
                    
                    <Text style={styles.drawerBodyMenuText}>Message from CEO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>navigation.navigate('ApplyOnline')}
                    style={styles.drawerBodyMenu}
                >
                    <View style={styles.drawerBodyMenuIconContainer}>
                        {/* <FontAwesome style={styles.drawerBodyMenuIcon}  name="file"  /> */}
                        <Icon style={styles.drawerBodyMenuIcon} name="create-outline" size={30} color="#000" />
                    </View>
                    
                    <Text style={styles.drawerBodyMenuText}>Apply for Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={()=>navigation.navigate('PolicyPhoneUpdate')}
                    style={styles.drawerBodyMenu}
                >
                    <View style={styles.drawerBodyMenuIconContainer}>
                        {/* <FontAwesome style={styles.drawerBodyMenuIcon}  name="file"  /> */}
                        <Icon style={styles.drawerBodyMenuIcon} name="md-phone-portrait-outline" size={30} color="#000" />
                    </View>
                    
                    <Text style={styles.drawerBodyMenuText}>Policy Phone No Update</Text>
                </TouchableOpacity>


                <TouchableOpacity
                onPress={()=>navigation.navigate('PolicyInfo')}
                    style={styles.drawerBodyMenu}
                >
                    <View style={styles.drawerBodyMenuIconContainer}>
                        <Icon style={styles.drawerBodyMenuIcon} name="md-newspaper-outline" size={30} color="#000"/>
                    </View>
                    
                    <Text style={styles.drawerBodyMenuText}>Policy Info</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>navigation.navigate('PremiumCalculator')}
                    style={styles.drawerBodyMenu}
                >
                    <View style={styles.drawerBodyMenuIconContainer}>
                        <Icon style={styles.drawerBodyMenuIcon} name="calculator-outline" size={30} color="#000"/>
                    </View>
                    
                    <Text style={styles.drawerBodyMenuText}>Premium Calculator</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                onPress={()=>navigation.navigate('PayPremium')}
                    style={styles.drawerBodyMenu}
                >
                    <View style={styles.drawerBodyMenuIconContainer}>
                        <Icon style={styles.drawerBodyMenuIcon} name="logo-usd" size={30} color="#000"/>
                    </View>
                    
                    <Text style={styles.drawerBodyMenuText}>Pay Premium</Text>
                </TouchableOpacity> */}
                
                
                

                <View style={styles.line}></View>
                <TouchableOpacity
                onPress={()=>navigation.navigate('About App')}>
                <Text style={[styles.drawerBodySectionTitle]}>About</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                onPress={()=>navigation.navigate('ContactUs')}
                    style={styles.drawerBodyMenu}
                >
                    <View style={styles.drawerBodyMenuIconContainer}>
                        <Icon style={styles.drawerBodyMenuIcon} name="notifications-outline" size={30} color="#000"/>
                    </View>
                    
                    <Text style={styles.drawerBodyMenuText}>Contact Us</Text>
                </TouchableOpacity>
                             
                <TouchableOpacity
                    onPress={()=>navigation.navigate('ProductInfo')}
                    style={styles.drawerBodyMenu}
                >
                    <View style={styles.drawerBodyMenuIconContainer}>
                        <Icon style={styles.drawerBodyMenuIcon} name="md-cube-outline" size={30} color="#000"/>
                    </View>
                    
                    <Text style={styles.drawerBodyMenuText}>Product Info</Text>
                </TouchableOpacity>
                             
                <TouchableOpacity
                    onPress={()=>navigation.navigate('CompanyInfo')}
                    style={styles.drawerBodyMenu}
                >
                    <View style={styles.drawerBodyMenuIconContainer}>
                        <Icon style={styles.drawerBodyMenuIcon} name="md-business-outline" size={30} color="#000"/>
                    </View>
                    
                    <Text style={styles.drawerBodyMenuText}>Company Info</Text>
                </TouchableOpacity>
                
                <View style={styles.line}></View>
                <Text style={styles.drawerBodySectionTitle}>Accounts</Text>
                
                {
                    isAuthenticated == false &&  
                    <>          
                        <TouchableOpacity
                            onPress={()=>navigation.navigate('Login')}
                            style={styles.drawerBodyMenu}
                        >
                            <View style={styles.drawerBodyMenuIconContainer}>
                                <Icon style={styles.drawerBodyMenuIcon} name="log-in-outline" size={30} color="#000"/>
                            </View>
                            
                            <Text style={styles.drawerBodyMenuText}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={()=>navigation.navigate('Registration')}
                            style={styles.drawerBodyMenu}
                        >
                            <View style={styles.drawerBodyMenuIconContainer}>
                                <Icon style={styles.drawerBodyMenuIcon} name="add" size={30} color="#000"/>
                            </View>
                            
                            <Text style={styles.drawerBodyMenuText}>Add Account</Text>
                        </TouchableOpacity>
                    </>    
                }

                {
                    isAuthenticated == true &&                    
                    <TouchableOpacity
                    onPress={()=>logoutHandler()}
                        style={styles.drawerBodyMenu}
                    >
                        <View style={styles.drawerBodyMenuIconContainer}>
                            <Icon style={styles.drawerBodyMenuIcon} name="log-in-outline" size={30} color="#000"/>
                        </View>
                        
                        <Text style={styles.drawerBodyMenuText}>Log Out</Text>
                    </TouchableOpacity>
                
                }
                
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    drawerBodyMenuEndIcon:{
        fontSize:25,
        color:'black',
        alignSelf:'center',
        marginTop:20
    },
    drawerBodySectionTitle:{
        fontFamily:'FjallaOne-Regular',
        marginLeft:20,
        marginBottom:5,
        marginTop:5,
        fontSize:16,
        color:'#000'
    },
    loggedinAs:{
        fontFamily:'Montserrat-Bold',
        fontSize:13,
        marginLeft:15,
        marginBottom:5,
        color: 'black',
        textTransform:'capitalize',
    },
    loggedinAsName:{
        fontFamily:'Montserrat-Bold',
        fontSize:13,
        marginLeft:15,
        marginBottom:5,
        color: 'green',
        textTransform:'capitalize',
    },
    line:{
        
        height:1,
        backgroundColor:'black',
        marginTop:10,
        marginBottom:10,
        marginHorizontal:10
    },
    drawerBodyMenuSelected:{
        backgroundColor:'#DFE0E0',
    },
    drawerBodyMenuText:{
        fontFamily:'Poppins-Regular',
        width:'85%',
        color:'#000',
    },
    drawerBodyMenuIconContainer:{
        width:'15%',
        marginRight:20,
        alignItems:'center'
    },
    drawerBodyMenuIcon:{
        fontSize:25,
        color:'#000',
    },
    drawerBodyMenu:{
        flexDirection:'row',
        // backgroundColor:'#DFE0E0',
        paddingHorizontal:10,
        paddingVertical:5,
        alignItems:'center'
    },
    drawerBody:{

    },
    drawerHeadText: {
        color:'white'
    },
    drawerHeadImageContainer:{
        width:'100%', 
        height:'100%',
        padding:0,
        justifyContent:'center',
        alignItems:'center'
    
    },
    drawerHeadImage: {
        width:'100%', 
        height:'100%',
        resizeMode:'contain'
    },
    
    drawer: {
        flex:1,
    },
})

export default DrawerContent;