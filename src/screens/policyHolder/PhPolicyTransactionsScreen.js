import { View, Text, ScrollView, ImageBackground, Image, Switch, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import React, {useState,useEffect} from 'react';
import RadioButtonRN from 'radio-buttons-react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

import Header from './../../components/Header';
import globalStyle from '../../styles/globalStyle';
import BackgroundImage from '../../assets/BackgroundImage.png'
import { userPolicyPaymentList } from '../../actions/userActions';
import { API } from '../../config';


const PhPolicyTransactionsScreen = ({navigation, route}) => {
  const policyNo = route.params.policyNo;
  const dispatch = useDispatch();

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {      
      let postData = {
        policy_no: policyNo
      }
        const response = await userPolicyPaymentList(postData);
        if(response.errors){
          
        }else{
          if(response.data[policyNo] != undefined)          
            setTransactions(response.data[policyNo]);
        }
        
      }
      fetchData(); 
  }, []) 
    
  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{flex:1}}>
        <Header navigation = {navigation} title = {'My Transaction'}/>
      
        <ScrollView >
          <View style={globalStyle.wrapper}>
            <View style={{borderTopWidth:2, borderLeftWidth: 2, borderRightWidth: 2, borderColor:'#5382AC', marginVertical:15}}>
              <View style={styles.rowWrapper}>
                  <Text style={[styles.rowLable, globalStyle.tableText]}>Trns. No</Text>
                  <Text style={[styles.rowLable, globalStyle.tableText]}>Pay Date</Text>
                  <Text style={[styles.rowLable, globalStyle.tableText]}>Amount</Text>
                  <Text style={[styles.rowLable, globalStyle.tableText]}>Method</Text>
                  <Text style={[styles.rowLable, globalStyle.tableText]}>Receipt</Text>
              </View>
              {
                transactions.map((item, index)=>(
                  <View style={styles.rowWrapper} key={index}>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>{item.transaction_no}</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>{moment(item.created_at).format('YYYY-MM-DD')}</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>{item.amount}</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>{item.method}</Text>
                      <TouchableOpacity style={[styles.rowValue, globalStyle.tableText, {alignItems: 'center'}]} onPress={()=>Linking.openURL(`${API}/api/policy/e-receipt/${item.id}`)}>
                        <Icon name="download-outline" size={26} color="blue" />
                      </TouchableOpacity>
                  </View>
                ))
              }
              

            </View>
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
        fontFamily: globalStyle.fontBold.fontFamily,
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


export default PhPolicyTransactionsScreen