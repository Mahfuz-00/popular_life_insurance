import { View, Text, ScrollView, ToastAndroid } from 'react-native'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import globalStyle from '../../styles/globalStyle';
import MenuComponent from './../../components/MenuComponent';
import iconProducer from '../../assets/icon-producer.png';
import { logout } from '../../actions/userActions';
import Header from './../../components/Header';
import { COMPANY_NAME } from './../../config';

const DashboardPhScreen = ({navigation, route}) => {
  const policyNo = route.params.policyNo;

  const menus = [
    {title: 'Policy Statement', navigateTo: 'PhPolicyStatement', icon: require('../../assets/icon-company-info.png')},
    {title: 'Due Premium', navigateTo: 'PhDuePremium', icon: require('../../assets/icon-my-transaction.png')},
    {title: 'Pay Premium', navigateTo: 'PhPayPremium', icon: require('../../assets/icon-premium-calc.png')},    
    {title: 'Policy Transactions', navigateTo: 'PhPolicyTransactions', icon: require('../../assets/icon-premium-calc.png')},    
    {title: 'Claim Submission', navigateTo: 'PhClaimSubmission', icon: require('../../assets/icon-claim-submission.png')},    
    {title: 'PR List', navigateTo: 'PhPRList', icon: require('../../assets/icon-claim-submission.png')},    
  ]

  const dispatch = useDispatch();
  
  const logoutHandler = () => {
    dispatch(logout(navigation)); 
  }

  return (    
    <View style={globalStyle.container}>
      <Header navigation = {navigation} title = {policyNo}/>
      
      <ScrollView >      
      <View style={globalStyle.wrapper}>
      <View style={{ padding:10, flexDirection:'row', flexWrap: 'wrap', justifyContent:'space-between'}}>
            
      {
        menus.map((item, index) => (
          <MenuComponent
            key={index} 
            onPress={()=>navigation.navigate(item.navigateTo, {policyNo: policyNo})}
            icon={item.icon}
            title={item.title}
          />
        ))
      }   

          <MenuComponent             
            onPress={()=>logoutHandler()}
            icon={require('../../assets/icon-premium-calc.png')}
            title={'Logout'}
          />
      </View>
      </View>
    </ScrollView>
    </View>
    
  )
}


export default DashboardPhScreen