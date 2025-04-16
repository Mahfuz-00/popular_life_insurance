/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

const CodeWiseCollectionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [projectCode, setProjectCode] = useState('');
  const [designation, setDesignation] = useState('');
  const [code, setCode] = useState('');
  const [reportType, setReportType] = useState('Summary');
  const [data, setData] = useState(null);

  // Fetch collection data based on report type
  const fetchCollectionData = async () => {
    if (!projectCode.trim() || !designation.trim() || !code.trim()) {
      Alert.alert('Error', 'Please fill all fields.', [{ text: 'OK', style: 'cancel' }]);
      return;
    }

    try {
      dispatch({ type: SHOW_LOADING });
      const token = await AsyncStorage.getItem('token');
      const endpoint =
        reportType === 'Summary'
          ? `${API}/api/code-wise-collection-summary`
          : `${API}/api/code-wise-collection-details`;
      const response = await axios.post(
        endpoint,
        {
          project_code: projectCode,
          designation,
          code,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );

      if (response.status === 200 && response.data?.data) {
        console.log('API Response:', response.data.data);
        setData(response.data.data);
      } else {
        Alert.alert('Error', 'No data found for the provided inputs.', [
          { text: 'OK', style: 'cancel' },
        ]);
        setData(null);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Alert.alert(
        'Error',
        `Failed to fetch data: ${error.response?.data?.message || error.message || 'Server error'}`,
        [{ text: 'OK', style: 'cancel' }],
      );
      setData(null);
    } finally {
      dispatch({ type: HIDE_LOADING });
    }
  };

  // Render Summary Table
  const renderSummaryTable = () => {
    if (!data || !data.months) return null;

    return (
      <View style={styles.table}>
        <Text style={[globalStyle.fontBold, styles.title]}>
          Popular Life Insurance Co.Ltd.
        </Text>
        <Text style={[globalStyle.fontMedium, styles.subtitle]}>
          Alamina Bima Prokolpo - Code Wise Collection Summary
        </Text>
        <Text style={[globalStyle.fontMedium, styles.codeInfo]}>
          Code No: {data.code} {data.name}
        </Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 2 }]}>Month</Text>
          <Text style={styles.headerCell}>Type</Text>
          <Text style={styles.headerCell}>Amount</Text>
          <Text style={styles.headerCell}>No of Trns.</Text>
        </View>
        {Object.keys(data.months).map((month, index) => (
          <View key={index}>
            <View style={styles.row}>
              <Text style={[styles.cell, { flex: 2 }]}>{month}</Text>
              <Text style={styles.cell}>Deferred</Text>
              <Text style={styles.cell}>{data.months[month].Deferred?.amount || 0}</Text>
              <Text style={styles.cell}>{data.months[month].Deferred?.transactions || 0}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.cell, { flex: 2 }]}></Text>
              <Text style={styles.cell}>Renewal</Text>
              <Text style={styles.cell}>{data.months[month].Renewal?.amount || 0}</Text>
              <Text style={styles.cell}>{data.months[month].Renewal?.transactions || 0}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.cell, { flex: 2 }]}></Text>
              <Text style={styles.cell}>Total</Text>
              <Text style={styles.cell}>{data.months[month].Total?.amount || 0}</Text>
              <Text style={styles.cell}>{data.months[month].Total?.transactions || 0}</Text>
            </View>
          </View>
        ))}
        <View style={[styles.row, styles.grandTotal]}>
          <Text style={[styles.cell, { flex: 2 }]}>Grand Total</Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}>{data.grandTotal?.amount || 0}</Text>
          <Text style={styles.cell}>{data.grandTotal?.transactions || 0}</Text>
        </View>
      </View>
    );
  };

  // Render Details Table
  const renderDetailsTable = () => {
    if (!data || !data.months) return null;

    return (
      <View style={styles.table}>
        <Text style={[globalStyle.fontBold, styles.title]}>
          Popular Life Insurance Co.Ltd.
        </Text>
        <Text style={[globalStyle.fontMedium, styles.subtitle]}>
          Alamina Bima Prokolpo - Code Wise Collection Detail
        </Text>
        <Text style={[globalStyle.fontMedium, styles.codeInfo]}>
          Code No: {data.code} {data.name}
        </Text>
        {Object.keys(data.months).map((month, index) => (
          <View key={index}>
            <Text style={[globalStyle.fontMedium, styles.monthHeader]}>{month}</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Trns. No</Text>
              <Text style={styles.headerCell}>Amount</Text>
              <Text style={styles.headerCell}>D/R</Text>
              <Text style={styles.headerCell}>Date</Text>
            </View>
            {data.months[month].map((txn, idx) => (
              <View style={styles.row} key={idx}>
                <Text style={styles.cell}>{txn.transaction_no || 'N/A'}</Text>
                <Text style={styles.cell}>{txn.amount || 0}</Text>
                <Text style={styles.cell}>{txn.type || 'N/A'}</Text>
                <Text style={styles.cell}>
                  {txn.date ? moment(txn.date).format('YYYY-MM-DD') : 'N/A'}
                </Text>
              </View>
            ))}
            <View style={[styles.row, styles.subTotal]}>
              <Text style={styles.cell}>Sub Total</Text>
              <Text style={styles.cell}>
                {data.months[month].reduce((sum, txn) => sum + (txn.amount || 0), 0)}
              </Text>
              <Text style={styles.cell}></Text>
              <Text style={styles.cell}></Text>
            </View>
          </View>
        ))}
        <View style={styles.totals}>
          <View style={styles.row}>
            <Text style={styles.cell}>Deferred Collection</Text>
            <Text style={styles.cell}>{data.totals?.Deferred?.amount || 0}</Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>{data.totals?.Deferred?.transactions || 0}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Renewal Collection</Text>
            <Text style={styles.cell}>{data.totals?.Renewal?.amount || 0}</Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>{data.totals?.Renewal?.transactions || 0}</Text>
          </View>
          <View style={[styles.row, styles.grandTotal]}>
            <Text style={styles.cell}>Grand Total</Text>
            <Text style={styles.cell}>{data.totals?.GrandTotal?.amount || 0}</Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>{data.totals?.GrandTotal?.transactions || 0}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
        <Header navigation={navigation} title={'Collection Summary'} />
        <ScrollView>
          <View style={globalStyle.wrapper}>
            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <Text style={[globalStyle.fontMedium, styles.label]}>Project Code</Text>
              <TextInput
                style={styles.input}
                value={projectCode}
                onChangeText={setProjectCode}
                placeholder="Enter Project Code (e.g., IA)"
                autoCapitalize="none"
                placeholderTextColor="#808080"
                color="#000"
              />
              <Text style={[globalStyle.fontMedium, styles.label]}>Designation</Text>
              <TextInput
                style={styles.input}
                value={designation}
                onChangeText={setDesignation}
                placeholder="Enter Designation (e.g., Agm)"
                autoCapitalize="none"
                placeholderTextColor="#808080"
                color="#000"
              />
              <Text style={[globalStyle.fontMedium, styles.label]}>Code</Text>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={setCode}
                placeholder="Enter Code (e.g., 001943)"
                keyboardType="numeric"
                autoCapitalize="none"
                placeholderTextColor="#808080"
                color="#000"
              />
              <Text style={[globalStyle.fontMedium, styles.label]}>Report Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={reportType}
                  onValueChange={(itemValue) => setReportType(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Summary" value="Summary" />
                  <Picker.Item label="Details" value="Details" />
                </Picker>
              </View>
              <FilledButton
                title="Fetch Summary"
                style={styles.fetchButton}
                onPress={fetchCollectionData}
              />
            </View>

            {/* Data Display */}
            {data && reportType === 'Summary' && renderSummaryTable()}
            {data && reportType === 'Details' && renderDetailsTable()}
            {data === null && projectCode.trim() && designation.trim() && code.trim() && (
              <Text style={[globalStyle.fontMedium, { textAlign: 'center', marginTop: 20 }]}>
                No data found for the provided inputs.
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
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#5382AC',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  fetchButton: {
    width: '50%',
    borderRadius: 50,
    alignSelf: 'center',
  },
  table: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#5382AC',
    marginVertical: 15,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 5,
  },
  codeInfo: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#5382AC',
    backgroundColor: '#F0F8FF',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: globalStyle.fontBold.fontFamily,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#5382AC',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: globalStyle.fontMedium.fontFamily,
    color: '#000',
  },
  subTotal: {
    backgroundColor: '#E6E6FA',
  },
  grandTotal: {
    backgroundColor: '#D3D3D3',
  },
  monthHeader: {
    fontSize: 16,
    marginVertical: 10,
    marginLeft: 10,
  },
  totals: {
    marginTop: 10,
    borderTopWidth: 2,
    borderColor: '#5382AC',
  },
});

export default CodeWiseCollectionScreen;