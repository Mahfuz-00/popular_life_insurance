import axios from 'axios';
import { API } from './../config';
import { ToastAndroid } from 'react-native'
import { HIDE_LOADING, SHOW_LOADING } from './../constants/commonConstants';

export const updatePolicyMobile = async (postData) => {
    try {
        const { data } = await axios.post(`${API}/api/update/policy/mobile`, postData);              
        
        ToastAndroid.show(data.message, ToastAndroid.LONG);
        
    } catch (error) {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
}

export const getPolicyDetails = (postData) => async (dispatch) => {
    try {
        dispatch({ type: SHOW_LOADING });
        const { data } = await axios.post(`${API}/api/policy-details`, postData);    
        dispatch({ type: HIDE_LOADING });          
        
        return data;
        
    } catch (error) {
        dispatch({ type: HIDE_LOADING });   
        ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
}