import axios from 'axios';
import { API } from './../config';
import { ToastAndroid } from 'react-native'

export const getPlanList = async () => {
    try {
        const { data } = await axios.get(`${API}/api/plans`);
        const res = await data.data.map((item)=>({
            label: item.name, 
            value: item.code, 
            fullLabel: item.name,
            modes: {
                yly: item.yly === '1' ? { label: 'Yearly', value: 'yly' } : null,
                hly: item.hly === '1' ? { label: 'Half Yearly', value: 'hly' } : null,
                qly: item.qly === '1' ? { label: 'Quarterly', value: 'qly' } : null,
                mly: item.mly === '1' ? { label: 'Monthly', value: 'mly' } : null,
                single: item.single === '1' ? { label: 'Single', value: 'single' } : null,
            },
        }));        
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
    console.log('Calculator Data:', JSON.stringify(postData, null, 2)); // Pretty-print the object
    try {
        const { data } = await axios.post(`${API}/api/premium-calculator`, postData);              
        return data.data.result;
    } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
}