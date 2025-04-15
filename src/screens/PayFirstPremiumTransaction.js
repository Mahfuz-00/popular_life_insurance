/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import Header from './../components/Header';
import globalStyle from '../styles/globalStyle';
import BackgroundImage from '../assets/BackgroundImage.png';
import { FilledButton } from './../components/FilledButton';
import { SHOW_LOADING, HIDE_LOADING } from '../constants/commonConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API } from '../config';

const FirstPremiumTransactionsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [nid, setNid] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Fetch transaction history based on NID
  const fetchTransactionHistory = async () => {
    if (!nid.trim()) {
      Alert.alert('Error', 'Please enter a valid NID.', [{ text: 'OK', style: 'cancel' }]);
      return;
    }

    try {
      dispatch({ type: SHOW_LOADING });
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API}/api/first-payment/transactions/${nid}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });

      if (response.status === 200 && response.data?.data) {
        console.log(response.data.data);
        setTransactions(response.data.data); 
      } else {
        Alert.alert('Error', 'No transactions found for this NID.', [
          { text: 'OK', style: 'cancel' },
        ]);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      Alert.alert(
        'Error',
        `Failed to fetch transactions: ${error.response?.data?.message || error.message || 'Server error'}`,
        [{ text: 'OK', style: 'cancel' }],
      );
      setTransactions([]);
    } finally {
      dispatch({ type: HIDE_LOADING });
    }
  };

  // Handle download receipt
  const handleDownloadReceipt = async (code, nid) => {
    const receiptUrl = `${API}/api/first-payment/e-receipt/${nid}/${code}`;
    console.log('Opening receipt URL:', receiptUrl);
    try {
      await Linking.openURL(receiptUrl);
    } catch (err) {
      console.error('Failed to open URL:', err);
      Alert.alert(
        'Error',
        `Failed to download receipt: ${err.message || 'Unknown error'}`,
        [{ text: 'OK', style: 'cancel' }],
      );
    }
  };

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
        <Header navigation={navigation} title={'Transaction History'} />
        <ScrollView>
          <View style={globalStyle.wrapper}>
            {/* NID Input Field */}
            <View style={styles.inputContainer}>
              <Text style={[globalStyle.fontMedium, styles.label]}>Enter NID</Text>
              <TextInput
                style={styles.input}
                value={nid}
                onChangeText={setNid}
                placeholder="Enter NID"
                keyboardType="numeric"
                autoCapitalize="none"
              />
              <FilledButton
                title="Fetch Transactions"
                style={styles.fetchButton}
                onPress={fetchTransactionHistory}
              />
            </View>

            {/* Transaction Table */}
            {transactions.length > 0 && (
              <View style={{ borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#5382AC', marginVertical: 15 }}>
                <View style={styles.rowWrapper}>
                  <Text style={styles.rowLabel}>Project Name</Text>
                  <Text style={styles.rowLabel}>Trns. Date</Text>
                    {/* <Text style={styles.rowLable}>Trns. No</Text> */}
                  <Text style={styles.rowLable}>Method</Text>
                  <Text style={styles.rowLabel}>Premium</Text>
                  <Text style={styles.rowLabel}>Receipt</Text>
                </View>
                {transactions.map((item, index) => (
                  <View style={styles.rowWrapper} key={index}>
                    <Text style={styles.rowValue}>{item.Project_Name}</Text>
                    <Text style={styles.rowValue}>{moment(item.entrydate).format('YYYY-MM-DD')}</Text> 
                    {/* <Text style={styles.rowValue}>{item.transaction_no}</Text> */}
                    <Text style={styles.rowValue}>{item.method}</Text> 
                    <Text style={styles.rowValue}>{parseFloat(item.Total_Premium).toFixed(2)}</Text>
                    <TouchableOpacity
                      style={[styles.rowValue, { alignItems: 'center' }]}
                      onPress={() => handleDownloadReceipt(item.Project_Code, item.NID_NO)}
                    >
                      <Icon name="download-outline" size={26} color="blue" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {transactions.length === 0 && nid.trim() && (
              <Text style={[globalStyle.fontMedium, { textAlign: 'center', marginTop: 20 }]}>
                No transactions found for this NID.
              </Text>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 20,
  },
  label: {
    color: 'black',
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#5382AC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontFamily: globalStyle.fontMedium.fontFamily,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  fetchButton: {
    width: '50%',
    borderRadius: 50,
    alignSelf: 'center',
  },
  rowWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 2,
    borderColor: '#5382AC',
  },
  rowLabel: {
    flex: 1,
    textAlign: 'center',
    borderColor: '#5382AC',
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: globalStyle.fontBold.fontFamily,
    color: '#000',
  },
  rowValue: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: globalStyle.fontMedium.fontFamily,
    color: '#000',
  },
});

export default FirstPremiumTransactionsScreen;