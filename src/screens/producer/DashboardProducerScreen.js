import { View, Text, ScrollView, ToastAndroid, StyleSheet } from 'react-native'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import globalStyle from '../../styles/globalStyle';
import MenuComponent from './../../components/MenuComponent';
import iconProducer from '../../assets/icon-producer.png';
import { logout } from '../../actions/userActions';
import Header from './../../components/Header';

const DashboardProducerScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const menus = [
    {title: 'Business Info', navigateTo: 'BusinessInfo', icon: require('../../assets/icon-company-info.png')},
    {title: 'My Earnings', navigateTo: 'EarningInfo', icon: require('../../assets/icon-my-transaction.png')},
    {title: 'My Policies', navigateTo: 'PolicyList', icon: require('../../assets/icon-premium-calc.png')},    
  ]

  const logoutHandler = () => {
    dispatch(logout(navigation));
    //ToastAndroid.show('Logged out successfully.', ToastAndroid.LONG);    
  }

  return (    
    <View style={globalStyle.container}>
      <Header navigation = {navigation} title = {'Producer Dashboard'}/>
      
      <ScrollView >      
      <View style={globalStyle.wrapper}>
        
          <View style={{backgroundColor: '#5382AC', borderRadius: 15, padding: 5}}>
              <View style={styles.rowWrapper}>
                  <Text style={styles.rowLable}>ID</Text>
                  <Text style={styles.rowValue}>010101</Text>
              </View>

              <View style={styles.rowWrapper}>
                  <Text style={styles.rowLable}>Name</Text>
                  <Text style={styles.rowValue}>XXXXXX</Text>
              </View>

              <View style={styles.rowWrapper}>
                  <Text style={styles.rowLable}>Designation</Text>
                  <Text style={styles.rowValue}>SEVP</Text>
              </View>

              <View style={styles.rowWrapper}>
                  <Text style={styles.rowLable}>Office</Text>
                  <Text style={styles.rowValue}>XXXX XXXXX XXXXXX</Text>
              </View>
          </View>
      <View style={{ flexDirection:'row', flexWrap: 'wrap', justifyContent:'space-between'}}>
            
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

const styles = StyleSheet.create({
  rowWrapper:{
      flexDirection:'row', 
      flexWrap:'wrap', 
      borderBottomWidth:2, 
      borderColor:'#5382AC',
  },
  rowLable:{
      flex:0.5, 
      textAlign:'center', 
      borderRightWidth: 2, 
      borderColor:'#5382AC',
      paddingVertical: 5,
      paddingHorizontal: 5,
      fontFamily: globalStyle.fontMedium.fontFamily,
      color:'#FFF'
  },
  rowValue:{
      flex:1.5, textAlign:'center',
      paddingVertical: 5,
      paddingHorizontal: 5,
      fontFamily: globalStyle.fontMedium.fontFamily,
      color:'#FFF'
  }
})

export default DashboardProducerScreen