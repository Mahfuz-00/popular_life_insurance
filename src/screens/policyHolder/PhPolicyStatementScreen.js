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
                                <Text style={styles.rowLable}>Policy No</Text>
                                <Text style={styles.rowValue}>{policyNo}</Text>
                            </View>
                            
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Project</Text>
                                <Text style={styles.rowValue}>{policyDetails.project}</Text>
                            </View>
                            
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Name</Text>
                                <Text style={styles.rowValue}>{policyDetails.name}</Text>
                            </View>
                            
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Mobile</Text>
                                <Text style={styles.rowValue}>{policyDetails.mobile}</Text>
                            </View>
    
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Address</Text>
                                <Text style={styles.rowValue}>{policyDetails.address}</Text>
                            </View>
    
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Table & Term</Text>
                                <Text style={styles.rowValue}>{`${policyDetails.planNo} - ${policyDetails.tarm}`}</Text>
                            </View>
    
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Sum Assured</Text>
                                <Text style={styles.rowValue}>{policyDetails.sumAssured}</Text>
                            </View>
    
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Total Premium</Text>
                                <Text style={styles.rowValue}>{policyDetails.totalPremium}</Text>
                            </View>                        
    
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Mode</Text>
                                <Text style={styles.rowValue}>{policyDetails.mode}</Text>
                            </View>                  
    
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>No of Installment</Text>
                                <Text style={styles.rowValue}>{policyDetails.noOfInstallment}</Text>
                            </View>                  
    
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Status</Text>
                                <Text style={styles.rowValue}>{policyDetails.status}</Text>
                            </View>                
    
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Total Paid</Text>
                                <Text style={styles.rowValue}>{Number(policyDetails.totalPaid).toFixed(2)}</Text>
                            </View>
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Date of Birth</Text>
                                <Text style={styles.rowValue}>{policyDetails.dateOfBirth.format3}</Text>
                            </View>
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Com. Date</Text>
                                <Text style={styles.rowValue}>{policyDetails.comDate.format3}</Text>
                            </View> 
                            <View style={styles.rowWrapper}>
                                <Text style={styles.rowLable}>Next Due Date</Text>
                                <Text style={styles.rowValue}>{policyDetails.nextDueDate.format3}</Text>
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