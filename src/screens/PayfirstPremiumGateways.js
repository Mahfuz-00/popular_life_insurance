/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  Switch,
  TouchableOpacity,
  ToastAndroid,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {WebView} from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

import Header from './../components/Header';
import globalStyle from '../styles/globalStyle';
import BackgroundImage from '../assets/BackgroundImage.png';
import {FilledButton} from './../components/FilledButton';
import {
  bkashCreatePayment,
  bkashExecutePayment,
  bkashGetToken,
  nagadPaymentUrl,
} from '../actions/paymentServiceActions';
import {SHOW_LOADING, HIDE_LOADING} from '../constants/commonConstants';
import {userPayPremium} from '../actions/userActions';
import axios from 'axios';
import {API} from '../config';

const PayFirstPremiumGateway = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);

  // Extract data from route params
  const {
    project,
    code,
    nid,
    date,
    name,
    mobile,
    totalPremium,
    servicingCell,
    agentMobile,
    fa,
    um,
    bm,
    agm,
  } = route.params;

  // State variables
  const [amount] = useState(totalPremium);
  const [method, setMethod] = useState('bkash');
  const [isEnabled, setIsEnabled] = useState(false);
  const [bkashToken, setBkashToken] = useState('');
  const [bkashPaymentId, setBkashPaymentId] = useState('');
  const [bkashUrl, setBkashUrl] = useState('');
  const [nagadPGUrl, setNagadPGUrl] = useState('');
  const [showNagadPG, setShowNagadPG] = useState(false);
  const [transactionNo, setTransactionNo] = useState('');
  const [isFirstPayment, setIsFirstPayment] = useState(true);

  // Back button handler setup
  useEffect(() => {
    const backAction = () => {
      if (bkashUrl || showNagadPG) {
        // Close WebView instead of navigating back
        setBkashUrl('');
        setShowNagadPG(false);
        // ToastAndroid.show('Transaction canceled', ToastAndroid.SHORT);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove(); // Cleanup on unmount
  }, [bkashUrl, showNagadPG]);

  // Payment gateway options
  const gatewayOptions = [
    {
      label: (
        <Image
          source={require('../assets/bkash.png')}
          style={{width: 80, height: 35}}
        />
      ),
      value: 'bkash',
    },
    {
      label: (
        <Image
          source={require('../assets/nagad.png')}
          style={{width: 80, height: 35}}
        />
      ),
      value: 'nagad',
    },
    {
      label: (
        <Image
          source={require('../assets/otherCards.png')}
          style={{height: 35}}
        />
      ),
      value: 'ssl',
    },
  ];

  // Table data
  const tableData = [
    {label: 'Project', value: project},
    {label: 'Code', value: code},
    {label: 'NID', value: nid},
    {label: 'Date', value: date},
    {label: 'Name', value: name},
    {label: 'Mobile No.', value: mobile},
    {label: 'Total Premium', value: totalPremium},
    {label: 'Servicing Cell', value: servicingCell},
    {label: 'Agent Mobile', value: agentMobile},
    {label: 'FA', value: fa},
    {label: 'UM', value: um},
    {label: 'BM', value: bm},
    {label: 'AGM', value: agm},
  ];

  const handleFirstPremiumSubmission = async () => {
    try {
      dispatch({type: SHOW_LOADING}); // Keep loading if needed

      const token = await AsyncStorage.getItem('token');

      const postData = {
        nid,
        project,
        code,
        name,
        mobile,
        totalPremium,
        servicingCell,
        fa,
        um: um || null,
        bm: bm || null,
        agm: agm || null,
        agentMobile,
      };

      const response = await axios.post(`${API}/api/first-premium`, postData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });

      if (response.status === 200) {
        console.log('Data submitted successfully:', response.data);
        // ToastAndroid.show('Data submitted successfully', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Submission failed:', error);
      // ToastAndroid.show(
      //   `Submission failed: ${error.response?.data?.message || 'Server error'}`,
      //   ToastAndroid.LONG,
      // );
    } finally {
      dispatch({type: HIDE_LOADING});
    }
  };

  // Handle payment submission
  const handleSubmit = async () => {
    if (!isEnabled) {
      return ToastAndroid.show(
        'Please agree to the terms & conditions',
        ToastAndroid.LONG,
      );
    }

    if (method === 'bkash') {
      console.log('Processing bkash payment...');

      if (isFirstPayment) {
        console.log('First payment, obtaining grant token...');
        try {
          const tokenResult = await bkashGetToken();
          const token = tokenResult.id_token;
          console.log('Grant token obtained:', token);

          const createPaymentResult = await bkashCreatePayment(
            token,
            amount,
            nid,
          );
          console.log(
            'First payment created successfully:',
            createPaymentResult,
          );

          setBkashPaymentId(createPaymentResult.paymentID);
          setBkashUrl(createPaymentResult.bkashURL);

          setBkashToken(token);
          setIsFirstPayment(false);
        } catch (error) {
          alert('First failed: ' + error.message);
        }
      } else {
        const storedToken = await AsyncStorage.getItem('bkashToken');
        console.log('Retrieved bkashToken:', storedToken);

        if (storedToken) {
          console.log('Payment with stored refresh token...');
          try {
            const createPaymentResult = await bkashCreatePayment(
              storedToken,
              amount,
              nid,
            );
            console.log(
              'Payment created successfully with refresh token:',
              createPaymentResult,
            );

            setBkashPaymentId(createPaymentResult.paymentID);
            setBkashUrl(createPaymentResult.bkashURL);
          } catch (error) {
            alert('Payment failed: ' + error.message);
          }
        } else {
          console.log('No stored token, obtaining grant token again...');
          try {
            const tokenResult = await bkashGetToken();
            const token = tokenResult.id_token;
            console.log('New grant token obtained:', token);

            const createPaymentResult = await bkashCreatePayment(
              token,
              amount,
              nid,
            );
            console.log(
              'Payment created successfully with new grant token:',
              createPaymentResult,
            );

            setBkashPaymentId(createPaymentResult.paymentID);
            setBkashUrl(createPaymentResult.bkashURL);

            setBkashToken(token);
            await AsyncStorage.setItem('bkashToken', token);
            console.log('New refresh token stored in AsyncStorage.');

            setTimeout(async () => {
              console.log(
                '55 minutes elapsed. Removing bkashToken from AsyncStorage...',
              );
              await AsyncStorage.removeItem('bkashToken');
              setBkashToken(null);
              setIsFirstPayment(true);
              console.log('bkashToken removed and isFirstPayment set to true.');
            }, 55 * 60 * 1000);
          } catch (error) {
            alert('Payment failed: ' + error.message);
          }
        }
      }
    }
    if (method === 'nagad') {
      const trnxNo = moment().format('YYYYMMDDHHmmss');
      setTransactionNo(trnxNo);
      const postData = {
        policyNo: nid,
        amount: amount,
        mobileNo: mobile,
        transactionNo: trnxNo,
      };
      const url = await nagadPaymentUrl(postData);
      if (url === '') {
        return ToastAndroid.show('Something went wrong!', ToastAndroid.LONG);
      } else {
        setNagadPGUrl(url);
        setShowNagadPG(true);
      }
    }
  };

  // Render Bkash WebView
  if (bkashUrl) {
    return (
      <WebView
        source={{
          uri: bkashUrl,
        }}
        style={{marginTop: 20}}
        onNavigationStateChange={async data => {
          // if (!data || data.status === undefined || data.status !== 'success') {
          //   Alert.alert(
          //     'Payment Failed',
          //     'Please try again from the dashboard.',
          //   );
          // }
          try {
            console.log('Bkash: ', JSON.stringify(data));
            if (JSON.stringify(data).includes('status=success')) {
              await setBkashUrl('');
              dispatch({type: SHOW_LOADING});
              const createExecuteResult = await bkashExecutePayment(
                bkashToken,
                bkashPaymentId,
              );

              console.log(
                'Status Message API Reponse: ',
                JSON.stringify(createExecuteResult),
              );
              console.log(
                'Status Message: ',
                createExecuteResult.statusMessage,
              );

              if (
                createExecuteResult.statusMessage ===
                'Duplicate for All Transactions'
              ) {
                alert(
                  createExecuteResult.statusMessage +
                    '\n\nThe transaction failed.\nA payment of the same amount has already been made recently. Please try again after a 2-5 minutes.',
                );
              } else {
                alert(createExecuteResult.statusMessage);
              }

              dispatch({type: HIDE_LOADING});

              if (createExecuteResult.transactionStatus == 'Completed') {
                let postData = {
                  policy_no: nid,
                  method: method,
                  amount: amount,
                  transaction_no: createExecuteResult.trxID,
                  date_time: moment().format('DD-MM-YYYY HH:mm:ss'),
                };

                console.log('Post Data: ', postData);

                var syncPayments =
                  JSON.parse(await AsyncStorage.getItem('syncPayments')) ?? [];
                await AsyncStorage.setItem(
                  'syncPayments',
                  JSON.stringify([...syncPayments, postData]),
                );

                console.log('Sync Payments: ', syncPayments);
                const isSuccess = await userPayPremium(postData);
                console.log('Is Success: ', isSuccess);
                handleFirstPremiumSubmission();

                // Reset navigation to HomeScreen instead of popping
                navigation.reset({
                  index: 0,
                  routes: [{name: 'HomeScreen'}],
                });

                if (isSuccess) {
                  var syncPayments =
                    JSON.parse(await AsyncStorage.getItem('syncPayments')) ??
                    [];
                  console.log('Sync Payments: ', syncPayments);
                  updateSyncPayments = syncPayments.filter(
                    item => item.transaction_no != postData.transaction_no,
                  );
                  console.log('Update Sync Payments: ', updateSyncPayments);
                  await AsyncStorage.setItem(
                    'syncPayments',
                    JSON.stringify(updateSyncPayments),
                  );
                  navigation.pop();
                }
              }
            } else {
              dispatch({type: HIDE_LOADING});
              // ToastAndroid.show('Payment Failed !', ToastAndroid.LONG);
            }
          } finally {
            // dispatch({type: HIDE_LOADING});

            // Always navigate to HomeScreen
            navigation.reset({
              index: 0,
              routes: [{name: 'HomeScreen'}],
            });
          }
        }}
      />
    );
  }

  // Render Nagad WebView
  if (showNagadPG) {
    return (
      <WebView
        source={{
          uri: nagadPGUrl,
          method: 'post',
        }}
        style={{marginTop: 20}}
        onNavigationStateChange={async data => {
          console.log(data);
          if (JSON.stringify(data).includes('Aborted')) {
            setShowNagadPG(false);
            dispatch({type: HIDE_LOADING});
            return ToastAndroid.show('Aborted !', ToastAndroid.LONG);
          }
          if (JSON.stringify(data).includes('Failed')) {
            setShowNagadPG(false);
            dispatch({type: HIDE_LOADING});
            return ToastAndroid.show('Failed !', ToastAndroid.LONG);
          }
          if (JSON.stringify(data).includes('Success')) {
            dispatch({type: SHOW_LOADING});
            let postData = {
              policy_no: nid,
              method: method,
              amount: amount,
              transaction_no: transactionNo,
              date_time: moment().format('DD-MM-YYYY HH:mm:ss'),
            };

            var syncPayments =
              JSON.parse(await AsyncStorage.getItem('syncPayments')) ?? [];
            await AsyncStorage.setItem(
              'syncPayments',
              JSON.stringify([...syncPayments, postData]),
            );
            const isSuccess = await userPayPremium(postData);
            handleFirstPremiumSubmission();

            // Reset navigation to HomeScreen instead of popping
            navigation.reset({
              index: 0,
              routes: [{name: 'HomeScreen'}],
            });

            if (isSuccess) {
              var syncPayments =
                JSON.parse(await AsyncStorage.getItem('syncPayments')) ?? [];
              updateSyncPayments = syncPayments.filter(
                item => item.transaction_no != postData.transaction_no,
              );
              await AsyncStorage.setItem(
                'syncPayments',
                JSON.stringify(updateSyncPayments),
              );
              navigation.pop();
            }
            setShowNagadPG(false);
            dispatch({type: HIDE_LOADING});
            return ToastAndroid.show('Payment Success !', ToastAndroid.LONG);
          }
        }}
      />
    );
  }

  // Main UI with table
  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{flex: 1}}>
        <Header navigation={navigation} title={'Pay First Premium'} />
        <ScrollView>
          <View style={globalStyle.wrapper}>
            {/* Table to display data */}
            <View>
              {tableData.length > 0 && (
                <View style={globalStyle.wrapper}>
                  <View
                    style={{
                      borderTopWidth: 2,
                      borderLeftWidth: 2,
                      borderRightWidth: 2,
                      borderColor: '#5382AC',
                      marginVertical: 15,
                    }}>
                    {tableData.map((item, index) => (
                      <View key={index} style={styles.rowWrapper}>
                        <Text style={styles.rowLable}>{item.label}</Text>
                        <Text style={styles.rowValue}>{item.value}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Payment method selection */}
            <Text
              style={[globalStyle.fontMedium, {color: 'black', marginTop: 15}]}>
              Choose Your Payment Method
            </Text>
            <RadioButtonRN
              data={gatewayOptions}
              selectedBtn={e => setMethod(e.value)}
              initial={1}
              boxActiveBgColor={'#FFF'}
              textStyle={{height: 60, textAlign: 'center', width: '100%'}}
              boxStyle={{height: 60, justifyContent: 'center'}}
            />

            {/* Terms and Conditions */}
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Switch
                trackColor={{false: '#767577', true: 'green'}}
                thumbColor={isEnabled ? 'black' : 'black'}
                ios_backgroundColor="green"
                onValueChange={() => setIsEnabled(!isEnabled)}
                value={isEnabled}
              />
              <Text style={[globalStyle.fontMedium, {fontSize: 16}]}>
                I Agree to the{' '}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    'https://signup.sslcommerz.com/term-condition',
                  )
                }>
                <Text
                  style={[
                    globalStyle.fontMedium,
                    {color: 'green', fontSize: 16},
                  ]}>
                  Terms & Conditions
                </Text>
              </TouchableOpacity>
            </View>

            {/* Pay Button */}
            <FilledButton
              title={`Pay ${Math.ceil(amount).toString()}`}
              style={{
                width: '40%',
                borderRadius: 50,
                alignSelf: 'center',
                marginVertical: 10,
              }}
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

// Styles for the table
const styles = StyleSheet.create({
  rowWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 2,
    borderColor: '#5382AC',
  },
  rowLable: {
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 2,
    borderColor: '#5382AC',
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: globalStyle.fontMedium.fontFamily,
  },
  rowValue: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: globalStyle.fontMedium.fontFamily,
  },
});

export default PayFirstPremiumGateway;
