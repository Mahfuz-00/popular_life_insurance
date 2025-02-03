import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
var {width,height} = Dimensions.get('window');

import { useDispatch, useSelector } from 'react-redux';

import globalStyle from '../styles/globalStyle';
import iconProducer from '../assets/icon-producer.png';
import MenuComponent from '../components/MenuComponent';
import Header from '../components/Header';
import { COMPANY_NAME } from '../config';
import Slider from '../components/Slider';

const HomeScreen = ({navigation}) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const menus = [
    {title: 'Company Information', navigateTo: 'CompanyInfo', icon: require('../assets/icon-company-info.png')},
    {title: 'Policy Information', navigateTo: isAuthenticated ? 'AuthPolicyInfo' : 'PolicyInfo', icon: require('../assets/icon-policy-info.png')},
    {title: 'Premium Calculator', navigateTo: 'PremiumCalculator', icon: require('../assets/icon-premium-calc.png')},
    // {title: 'My Account', navigateTo: 'PhMyProfile', icon: require('../assets/icon-my-transaction.png')},
    {title: 'Pay Premium', navigateTo: 'PayPremium', icon: require('../assets/icon-online-payment.png')},   
    //{title: 'Claim Submission', navigateTo: 'ClaimSubmission', icon: require('../assets/icon-claim-submission.png')},
    {title: 'Product Engine', navigateTo: 'ProductInfo', icon: require('../assets/product-engine.png')},
    {title: 'Policy Phone No Update', navigateTo: 'PolicyPhoneUpdate', icon: require('../assets/product-engine.png')},
    // {title: 'Sync Payment', navigateTo: 'SyncPayment', icon: require('../assets/product-engine.png')},
  ]

  const navigateToDashboard =()=>{
    if(user.type == 'policy holder'){
      navigation.navigate('PhPolicyList');
    }else if(user.type == 'agent'){
      navigation.navigate('DashboardProducer');
    }
  }

  return (
    <View style={globalStyle.container}>
      <Header navigation = {navigation} title = {COMPANY_NAME}/>
      
      <ScrollView >
      <Slider/>
      <View style={globalStyle.wrapper}>
      <View style={{marginBottom: 20, flexDirection:'row', flexWrap: 'wrap', justifyContent:'space-between'}}>
      {
        isAuthenticated ? (
          <MenuComponent
            onPress={navigateToDashboard}
            icon={require('../assets/icon-login.png')}
            title={user.type == 'policy holder' ? 'Policy List' :'Dashboard'}
          />
        ) : (
          <MenuComponent
            onPress={()=>navigation.navigate('Login')}
            icon={require('../assets/icon-login.png')}
            title={'Role base login'}
          />
        )
      }
      
      {
        menus.map((item, index) => (
          <MenuComponent
            key={index} 
            onPress={()=>navigation.navigate(item.navigateTo)}
            icon={item.icon}
            title={item.title}
          />
        ))
      }   

      {
        isAuthenticated ? (
          <MenuComponent
            onPress={()=> user.type == 'policy holder' ? navigation.navigate('PhMyProfile') : navigation.navigate('OrgMyProfile')}
            icon={require('../assets/icon-my-transaction.png')}
            title={'My Account'}
          />
        ) 
        : 
        null
      }

      </View>
      </View>
    </ScrollView>
    </View>
    
  )
}

const styles = StyleSheet.create({
  GridViewContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    margin: 5,
    backgroundColor: '#7B1FA2'
 },
 GridViewTextLayout: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    color: '#fff',
    padding: 10,
  }
})

export default HomeScreen;
