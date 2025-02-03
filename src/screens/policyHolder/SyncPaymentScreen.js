import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { userPayPremium } from './../../actions/userActions';

const SyncPaymentScreen = ({navigation}) => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const [payments, setPayments] = useState([]);
    
    const handleSync = async(payment) => {
        const isSuccess = await userPayPremium(payment);
        if(isSuccess){
            var syncPayments =  JSON.parse(await AsyncStorage.getItem('syncPayments')) ?? [];
            updateSyncPayments = syncPayments.filter(item => item.transaction_no != payment.transaction_no);
    
            await AsyncStorage.setItem('syncPayments', JSON.stringify(updateSyncPayments))
            await getSyncPayments();
        }
    }
    const getSyncPayments = async() => {
        var syncPayments =  JSON.parse(await AsyncStorage.getItem('syncPayments')) ?? [];
        setPayments(syncPayments);       
        
    }
    useEffect(() => {
        getSyncPayments();
        if(isAuthenticated == false){
         navigation.navigate('Login');
        }
     }, []) 
    return (
        <View>
            {
                payments.map((payment, index) => {
                    return (
                        <View key={index} style={{ flexDirection: 'row', backgroundColor: 'gray', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 }}>
                            <Text style={{ color: '#FFFFFF', fontSize: 16, marginLeft: 5 }}>Tnx: {payment.transaction_no}</Text>
                            <TouchableOpacity
                                style={{ backgroundColor: '#EE4E89', paddingHorizontal: 16, paddingVertical: 8 }}
                                onPress={() => handleSync(payment)}
                            >
                                <Text style={{ color: '#FFFFFF' }}>Sync</Text>
                            </TouchableOpacity>

                        </View>
                    )
                })
            }

        </View>
    )
}

export default SyncPaymentScreen