import { View, Text, ImageBackground, ScrollView, StyleSheet } from 'react-native'
import React, {useState,useEffect} from 'react';
import moment from 'moment';

import { getPolicyDetailsByUser } from '../../actions/userActions';
import Header from '../../components/Header';
import { Input } from '../../components/Input';
import { FilledButton } from '../../components/FilledButton';
import globalStyle from '../../styles/globalStyle';
import BackgroundImage from '../../assets/BackgroundImage.png';

const PhPolicyStatementScreen = ({navigation, route}) => {
    const policyNo = route.params.policyNo;
    const [policyDetails, setPolicyDetails] = useState(null);

    useEffect(() => {
        async function fetchData() {      
            const response = await getPolicyDetailsByUser(policyNo);
            console.log("info: ",response);
            if(response)
            setPolicyDetails(response);
          }
          fetchData(); 
    }, []) 

    return (
        <View style={globalStyle.container}>
            <ImageBackground source={BackgroundImage} style={{flex:1}}>
                <Header navigation = {navigation} title = {'Policy Information'}/>      
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
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Project</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.project}</Text>
                            </View>
                            
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Name</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.name}</Text>
                            </View>
                            
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Mobile</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.mobile}</Text>
                            </View>
    
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Address</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.address}</Text>
                            </View>
    
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Table & Term</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{`${policyDetails.planNo} - ${policyDetails.tarm}`}</Text>
                            </View>
    
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Sum Assured</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.sumAssured}</Text>
                            </View>
    
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Total Premium</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.totalPremium}</Text>
                            </View>                        
    
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Mode</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.mode}</Text>
                            </View>                  
    
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>No of Installment</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.noOfInstallment}</Text>
                            </View>                  
    
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Status</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.status}</Text>
                            </View>                
    
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Total Paid</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{Number(policyDetails.totalPaid).toFixed(2)}</Text>
                            </View>
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Date of Birth</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.dateOfBirth.format3}</Text>
                            </View>
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Com. Date</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.comDate.format3}</Text>
                            </View> 
                            <View style={styles.rowWrapper}>
                                <Text style={[styles.rowLable, globalStyle.tableText]}>Next Due Date</Text>
                                <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.nextDueDate.format3}</Text>
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
        fontFamily: globalStyle.fontMedium.fontFamily,
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
export default PhPolicyStatementScreen