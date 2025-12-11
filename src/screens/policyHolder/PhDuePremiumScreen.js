import { View, Text, ImageBackground, ScrollView, StyleSheet } from 'react-native'
import React, {useState,useEffect} from 'react';
import moment from 'moment';

import { getPolicyDetailsByUser } from '../../actions/userActions';
import Header from '../../components/Header';
import { Input } from '../../components/Input';
import { FilledButton } from '../../components/FilledButton';
import globalStyle from '../../styles/globalStyle';
import BackgroundImage from '../../assets/BackgroundImage.png';
import { getDuePremiumDetails } from './../../actions/userActions';

const PhDuePremiumScreen = ({navigation, route}) => {
    const policyNo = route.params.policyNo;
    const [policyDetails, setPolicyDetails] = useState(null);

    useEffect(() => {
        async function fetchData() {      
            const response = await getDuePremiumDetails(policyNo);
            if(response)
            setPolicyDetails(response);
          }
          fetchData(); 
    }, []) 

    return (
        <View style={globalStyle.container}>
            <ImageBackground source={BackgroundImage} style={{flex:1}}>
                <Header navigation = {navigation} title = {'Due Premium'}/>      
                <ScrollView>
                    <View style={globalStyle.wrapper}>                        
    
                        {
                            policyDetails && 
                            <View style={{borderTopWidth:2, borderLeftWidth: 2, borderRightWidth: 2, borderColor:'#5382AC', marginVertical:15}}>

                                <View style={styles.rowWrapper}>
                                    <Text style={[styles.rowLable, globalStyle.tableText]}>Policy No</Text>
                                    <Text style={[styles.rowValue, globalStyle.tableText]}>{policyNo}</Text>
                                </View>
                                <View style={styles.rowWrapper}>
                                    <Text style={[styles.rowLable, globalStyle.tableText]}>Due Date</Text>
                                    <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.NextDueDate.format3}</Text>
                                </View>
        
                                <View style={styles.rowWrapper}>
                                    <Text style={[styles.rowLable, globalStyle.tableText]}>Instalment</Text>
                                    <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.NoofInstolment}</Text>
                                </View>
        
                                <View style={styles.rowWrapper}>
                                    <Text style={[styles.rowLable, globalStyle.tableText]}>Instalment Expected</Text>
                                    <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.ins_expected}</Text>
                                </View>
        
                                <View style={styles.rowWrapper}>
                                    <Text style={[styles.rowLable, globalStyle.tableText]}>Due Per Instalment</Text>
                                    <Text style={[styles.rowValue, globalStyle.tableText]}>{Number(policyDetails.DuePerInstalMent).toFixed(2)}</Text>
                                </View>
        
                                <View style={styles.rowWrapper}>
                                    <Text style={[styles.rowLable, globalStyle.tableText]}>Total Premium</Text>
                                    <Text style={[styles.rowValue, globalStyle.tableText]}>{Number(policyDetails.totalpremium).toFixed(2)}</Text>
                                </View>   
        
                                <View style={styles.rowWrapper}>
                                    <Text style={[styles.rowLable, globalStyle.tableText]}>Due Amount</Text>
                                    <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.DueAmount}</Text>
                                </View>   
        
                                <View style={styles.rowWrapper}>
                                    <Text style={[styles.rowLable, globalStyle.tableText]}>Mode</Text>
                                    <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.mode}</Text>
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
        fontFamily: globalStyle.fontMedium.fontFamily
    },
    rowValue:{
        flex:1, textAlign:'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        fontFamily: globalStyle.fontMedium.fontFamily
    }
})
export default PhDuePremiumScreen