import axios from 'axios';
import { API } from './../config';
import { ToastAndroid } from 'react-native'

export const getPolicyDetails = async (policyNo) => {
    try {
        const { data } = await axios.get( `${API}/api/policy-details/${policyNo}`);              
        return data.data;
        
    } catch (error) {
        return [];
    }
}

export const getClaimTypes = async () => {
    try {
        const { data } = await axios.get( `${API}/api/claims/types`);
              
        return data.data;
        
    } catch (error) {
        return [];
    }
}

export const getOfficeInfo = async (type) => {
    try {
        const { data } = await axios.get(type == 'corporate' ? `${API}/api/corporate-office` : `${API}/api/divisional-office`);
              
        return data.data;
    } catch (error) {
        return [];
    }
}

export const guestPayPremium = async (postData) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json"
            }
        }
        const { data } = await axios.post(`${API}/api/payment-without-auth`, postData, config);  
        
        ToastAndroid.show(data.message, ToastAndroid.LONG);
        return true;  

    } catch (error) {     
        ToastAndroid.show('Failed to pay. Try again..', ToastAndroid.LONG);   
        return false;
    }
}

