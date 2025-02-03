
import { BackHandler, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants';
import { API } from "../config";
import { HIDE_LOADING, SHOW_LOADING } from './../constants/commonConstants';
import axios from '../utils/axios';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const createClaim = async (postData) => {
    try {
        const token = await AsyncStorage.getItem('token'); 
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }
        
        const { data } = await axios.post(`${API}/api/claims/create`, postData, config);  
            
        if(data.errors)
        {
            ToastAndroid.show(data.message, ToastAndroid.LONG);
            return {
                isSuccess: false,
                errors: data.errors,
                data: ''
            };  
        }
            
        ToastAndroid.show("Claim submit successfull", ToastAndroid.LONG);

        return {
            isSuccess: true,
            errors: '',
            data: ''
        };  

    } catch (error) {     
        ToastAndroid.show(error.message, ToastAndroid.LONG);   
        return {
            isSuccess: false,
            errors: '',
            data: ''
        };
    }
}

export const getAuthPolicyDetails = (postData) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('token');         
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }

        dispatch({ type: SHOW_LOADING });
        const { data } = await axios.post(`${API}/api/policy-details/auth`, postData, config);    
        dispatch({ type: HIDE_LOADING });     

        return data;
        
    } catch (error) {
        dispatch({ type: HIDE_LOADING });   
        ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
}

export const userPolicyPaymentList = async (postData) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }
        const { data } = await axios.post(`${API}/api/policy/payments`, postData, config);  
        
        return data;
         

    } catch (error) {     
        
        return ;
    }
}

export const userPayPremium = async (postData) => {
    try {
        const token = await AsyncStorage.getItem('token');    

        const config = {
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }
        const { data } = await axios.post(`${API}/api/payment`, postData, config);  
        console.log('userPayPremium: ', JSON.stringify(data));
        
        ToastAndroid.show(data.message, ToastAndroid.LONG);
        return true;  

    } catch (error) {     
        ToastAndroid.show('Failed to pay. Try again..', ToastAndroid.LONG);   
        return false;
    }
}

export const getDuePremiumDetails = async (policyNo) => {
    try {
        const token = await AsyncStorage.getItem('token');    

        const config = {
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }
        const { data } = await axios.post(`${API}/api/policy-due-premium`, {policyNo: policyNo}, config);  
        
        return data.data;  

    } catch (error) {        
        return [];
    }
}

export const getPrListByUser = (policyNo) => async (dispatch) => {
    try {
        dispatch({ type: SHOW_LOADING })
        const token = await AsyncStorage.getItem('token');    

        const config = {
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }
        const { data } = await axios.post(`${API}/api/policy-pr-list-year-wise/${policyNo}`, {}, config);  
        // const { data } = await axios.post(`${API}/api/policy-pr-list/${policyNo}`, {}, config);  
        dispatch({ type: HIDE_LOADING })
        return data.data;  

    } catch (error) {        
        dispatch({ type: HIDE_LOADING })
        return [];
    }
}

export const getPolicyDetailsByUser = async (policyNo) => {
    try {
        const token = await AsyncStorage.getItem('token');    

        const config = {
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }
        const { data } = await axios.get(`${API}/api/policy-details/${policyNo}`, config);  

        return data.data;  

    } catch (error) {        
        return [];
    }
}

export const getPolicyListByUser = async () => {
    try {
        const token = await AsyncStorage.getItem('token');    

        const config = {
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json",
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }
        const { data } = await axios.post(`${API}/api/policy-list/auth`,{}, config);    

        return data.data;  

    } catch (error) {        
        return [];
    }
}

// Login
export const login = (postData) => async (dispatch) => {
    try {
        dispatch({ type: SHOW_LOADING })
        dispatch({ type: LOGIN_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`${API}/api/login`, postData, config);
        
        dispatch({ type: HIDE_LOADING });

        if(data.errors) return data;       

        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));        
        
        await AsyncStorage.setItem('token', JSON.stringify(data.data.token)); 

        if(postData.isRemember == true){
            //check if no already exist
            
            var savedcredentials =  JSON.parse(await AsyncStorage.getItem('savedcredentials')) ?? [];
            savedcredentials?.findIndex(cred => cred.userName == postData.phone) !== -1 ? console.log("ache: ")
                : await AsyncStorage.setItem('savedcredentials', JSON.stringify([...savedcredentials, {userName: postData.phone, password: postData.password}]))

            
        }

        dispatch({
            type: LOGIN_SUCCESS,
            payload: { token: data.data.token, user: data.data.user}
        })
        
    } catch (error) {        
        dispatch({
            type: LOGIN_FAIL,
            payload: 'Failed'
        })

        dispatch({ type: HIDE_LOADING })
    }
}

export const resetPassword = (postData) => async (dispatch) => {
    try {
        const { data } = await axios.post(`${API}/api/reset-password`, postData, config)

        

        if(data.errorMessage){
            ToastAndroid.show(data.errorMessage, ToastAndroid.LONG);   
            return false;
        }
        else if(data.status == 200){            
            ToastAndroid.show(data.successMessage, ToastAndroid.LONG);   
            return true;
        }

    } catch (error) {
        
        ToastAndroid.show(error.message, ToastAndroid.LONG);
        return false;

    }
}

export const verifyForgotPasswordOtp = (postData) => async (dispatch) => {
    try {
        const { data } = await axios.post(`${API}/api/verify-forgot-password-otp`, postData, config)

        if(data.errorMessage){
            ToastAndroid.show(data.errorMessage, ToastAndroid.LONG);   
            return false;
        }
        else if(data.status == 200){            
            ToastAndroid.show(data.message, ToastAndroid.LONG);   
            return true;
        }

    } catch (error) {
        
        ToastAndroid.show(error.message, ToastAndroid.LONG);
        return false;

    }
}

export const getforgotPasswordOtp = (postData) => async (dispatch) => {
    try {
        const { data } = await axios.post(`${API}/api/forgot-password`, postData, config)

        ToastAndroid.show(data.successMessage, ToastAndroid.LONG);

        if(data.status == 200){
            return true;
        }
        else{
            ToastAndroid.show(data.message, ToastAndroid.LONG);
            return false;
        }      

    } catch (error) {
        
        ToastAndroid.show(error.message, ToastAndroid.LONG);
        return false;        
    }
}

export const verifyRegistration = (postData) => async (dispatch) => {
    try {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`${API}/api/verify-registration`, postData, config)

        if(data.errorMessage){
            ToastAndroid.show(data.errorMessage, ToastAndroid.LONG);   
        }
        else if(data.data.token){
            await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
            await AsyncStorage.setItem('token', JSON.stringify(data.data.token)); 

            dispatch({
                type: LOGIN_SUCCESS,
                payload: { token: data.data.token, user: data.data.user}
            })  
            ToastAndroid.show(data.message, ToastAndroid.LONG);   
        }

    } catch (error) {

        ToastAndroid.show(error.message, ToastAndroid.LONG);

    }
}

// Register user
export const register = (postData) => async (dispatch) => {
    try {
        //dispatch({ type: REGISTER_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`${API}/api/registration`, postData, config)
        ToastAndroid.show(data.message, ToastAndroid.LONG);

        if(data.status == 200){
            return true;
        }
        else{
            return data;
        }      

    } catch (error) {

        ToastAndroid.show(error.message, ToastAndroid.LONG);

        return false;
    }
}

// Load user
export const loadUser = () => async (dispatch) => {
    try {
        
        dispatch({ type: LOAD_USER_REQUEST });

        const user = await AsyncStorage.getItem('user');       
        const token = await AsyncStorage.getItem('token');       

        if(token !== null){
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    'Authorization': `Bearer ${JSON.parse(token)}`
                }
            }
            const { data } = await axios.get(`${API}/api/user`, config);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { token: JSON.parse(token), user: data.data.user}
            })
    
            await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
        }else{
            //await AsyncStorage.removeItem('token');
        }       

    } catch (error) {        
        dispatch({
            type: LOAD_USER_FAIL,
            payload: ''
        })

        //await AsyncStorage.removeItem('token');
    }
}

// Update profile
export const updateProfile = (userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PROFILE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`${API}/api/v1/me/update`, userData, config)

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update password
export const updatePassword = (passwords) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`${API}/api/v1/password/update`, passwords, config)

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
    try {

        dispatch({ type: FORGOT_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`${API}/api/v1/password/forgot`, email, config)

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        })

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

// Logout user
export const logout = (navigation) => async (dispatch) => {
    try {

        Alert.alert("Hey!", "Are you sure you want to logout?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { 
                text: "YES", 
                onPress: () => {
                    dispatch({
                        type: LOGOUT_SUCCESS,
                    })

                    ToastAndroid.show('Logged out successfully.', ToastAndroid.LONG);
                    AsyncStorage.removeItem('user')
                    AsyncStorage.removeItem('token')
                    navigation.reset({
                        index: 0,
                        routes: [
                        {
                            name: 'Home',
                        },
                        ],
                    });
                }
            }
          ]);

        

    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.message
        })
    }
}



// Update user - ADMIN
export const updateUser = (id, userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`${API}/api/v1/admin/user/${id}`, userData, config)

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}


// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}