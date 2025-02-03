import axios from 'axios';
import { API } from './../config';
import { ToastAndroid } from 'react-native'

export const getPlanList = async () => {
    try {
        const { data } = await axios.get(`${API}/api/plans`);
        const res = await data.data.map((item)=>({label: item.name, value: item.code}));        
        return res;
    } catch (error) {
        return [];
    }
}

export const getTermList = async (code) => {
    try {
        const { data } = await axios.get(`${API}/api/plan-to-tarm/${code}`);
        const res = await data.data.tarms.map((item)=>({label: item, value: item}));        
        
        return res;
    } catch (error) {
        return [];
    }
}

export const getCalculatedPremium = async (postData) => {
    try {
        const { data } = await axios.post(`${API}/api/premium-calculator`, postData);              
        return data.data.result;
    } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
}