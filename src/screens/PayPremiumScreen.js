import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  Switch,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import RadioButtonRN from 'radio-buttons-react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

import Header from './../components/Header';
import globalStyle from '../styles/globalStyle';
import BackgroundImage from '../assets/BackgroundImage.png';
import { Input } from './../components/Input';
import { FilledButton } from './../components/FilledButton';
import {
  bkashCreatePayment,
  bkashExecutePayment,
  bkashGetToken,
  bkashPaymentStatus,
  nagadPaymentUrl,
} from '../actions/paymentServiceActions';
import { guestPayPremium } from '../actions/commonServiceAction';
import { HIDE_LOADING, SHOW_LOADING } from '../constants/commonConstants';
import { getDuePremiumDetails, userPayPremium } from './../actions/userActions';

var numberOptions = [
  { label: 'Proposal No', value: false },
  { label: 'Policy No', value: true },
];

var gatewayOptions = [
  {
    label: (
      <Image
        source={require('../assets/bkash.png')}
        style={{ width: 80, height: 35 }}
      />
    ),
    value: 'BKASH',
  },
  {
    label: (
      <Image
        source={require('../assets/nagad.png')}
        style={{ width: 80, height: 35 }}
      />
    ),
    value: 'NAGAD',
  },
  {
    label: (
      <Image
        source={require('../assets/otherCards.png')}
        style={{ height: 35 }}
      />
    ),
    value: 'SSL',
  },
];

const PayPremiumScreen = ({ navigation }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  // const [number, setNumber] = useState('0704554000284');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('0');
  const [policyDetails, setPolicyDetails] = useState({});
  const [isEnabled, setIsEnabled] = useState(false);
  const [method, setMethod] = useState('bkash');

  const [bkashToken, setBkashToken] = useState('');
  const [bkashPaymentId, setBkashPaymentId] = useState('');
  const [bkashUrl, setBkashUrl] = useState('');
  const [isFirstPayment, setIsFirstPayment] = useState(true);

  const [nagadPGUrl, setNagadPGUrl] = useState('');
  const [showNagadPG, setShowNagadPG] = useState(false);
  const [transactionNo, setTransactionNo] = useState('');

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleSubmit = async () => {
    console.log(`is enabled: ${isEnabled}`);
    console.log(`policyDetails: ${JSON.stringify(policyDetails)}`);
    if (!isEnabled)
      return ToastAndroid.show(
        'Please agree terms & conditions',
        ToastAndroid.LONG,
      );
    // if(Number(policyDetails.ins_expected) < 1) return ToastAndroid.show('No expected instalment found', ToastAndroid.LONG);
    // if( Number(amount) > Number(policyDetails.DueAmount)) return ToastAndroid.show('You can not pay more than due', ToastAndroid.LONG);
    if (policyDetails.isLaps == true)
      return ToastAndroid.show('Policy is lapsed !', ToastAndroid.LONG);
    if (policyDetails.isMaturity == true)
      return ToastAndroid.show('Policy is matured !', ToastAndroid.LONG);
    // if( Number(amount) < Number(policyDetails.totalpremium)) return  ToastAndroid.show('Amount is less than premium !', ToastAndroid.LONG);
    if (Number(amount) % Number(policyDetails.totalpremium) != 0)
      return ToastAndroid.show(
        'Amount should be multiples of premium !',
        ToastAndroid.LONG,
      );

    // const tokenResult = await bkashGetToken();

    // setBkashToken(tokenResult.id_token);

    // const createPaymentResult = await bkashCreatePayment(tokenResult.id_token, amount, number);

    // setBkashPaymentId(createPaymentResult.paymentID);

    // setBkashUrl(createPaymentResult.bkashURL);

    if (method === 'BKASH') {
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
            number,
          );

          // Check for expired token message
          if (createPaymentResult?.message === 'The incoming token has expired') {
            ToastAndroid.show('Payment token has expired. Please try again.', ToastAndroid.LONG);
            await AsyncStorage.removeItem('bkashToken');
            setBkashToken(null);
            setIsFirstPayment(true);
            return;
          }


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
              number,
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
              number,
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

    // if(method == "bkash"){
    //   const tokenResult = await bkashGetToken();

    //   setBkashToken(tokenResult.id_token);

    //   const createPaymentResult = await bkashCreatePayment(tokenResult.id_token, amount, number);

    //   setBkashPaymentId(createPaymentResult.paymentID);

    //   setBkashUrl(createPaymentResult.bkashURL);
    // }

    // if (method === 'bkash') {
    //   try {
    //     // const lastTokenTime = await AsyncStorage.getItem('lastBkashTokenTime');
    //     // const currentTime = Date.now();

    //     // if (lastTokenTime) {
    //     //   const elapsedTime =
    //     //     (currentTime - parseInt(lastTokenTime, 10)) / 60000; // Convert ms to minutes
    //     //   const remainingTime = 30 - elapsedTime;

    //     //   if (elapsedTime < 30) {
    //     //     alert(
    //     //       `Rate limit exceeded. Please try again in ${Math.ceil(
    //     //         remainingTime,
    //     //       )} minutes.`,
    //     //     );
    //     //     return;
    //     //   }
    //     // }

    //     // // Proceed with getting a new token
    //     // const tokenResult = await bkashGetToken();
    //     // setBkashToken(tokenResult.id_token);

    //     // // Store the timestamp of the new token retrieval
    //     // await AsyncStorage.setItem(
    //     //   'lastBkashTokenTime',
    //     //   currentTime.toString(),
    //     // );

    //     // const createPaymentResult = await bkashCreatePayment(
    //     //   tokenResult.id_token,
    //     //   amount,
    //     //   number,
    //     // );
    //     // setBkashPaymentId(createPaymentResult.paymentID);
    //     // setBkashUrl(createPaymentResult.bkashURL);
    //   } catch (error) {
    //     if (error.response && error.response.status === 429) {
    //       alert('Rate limit exceeded. Please wait before retrying.');
    //     } else {
    //       alert('An error occurred. Please try again.');
    //     }
    //   }
    // }

    console.log('Method: ', method);

    if (method == 'NAGAD') {
      // Alert.alert('Under Maintenance');
      console.log('Processing nagad payment...');
      const trnxNo = moment().format('YYYYMMDDHHmmss');
      setTransactionNo(trnxNo);
      let postData = {
        policyNo: number,
        amount: amount,
        mobileNo: user?.phone,
        transactionNo: trnxNo,
      };
      const url = await nagadPaymentUrl(postData);
      console.log('Nagad URL: ', url);
      if (url == '') {
        return ToastAndroid.show('Something wrong !', ToastAndroid.LONG);
      } else {
        setNagadPGUrl(url);
        setShowNagadPG(true);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated == false) {
      navigation.navigate('Login');
    }
  }, []);

  if (bkashUrl) {
    return (
      <WebView
        source={{
          uri: bkashUrl,
        }}
        style={{ marginTop: 20 }}
        onNavigationStateChange={async data => {
          // if (!data || data.status === undefined || data.status !== 'success') {
          //   Alert.alert(
          //     'Payment Failed',
          //     'Please try again from the dashboard.',
          //   );
          // }

          console.log('bkash: ', JSON.stringify(data));
          if (JSON.stringify(data).includes('status=success')) {
            await setBkashUrl('');

            dispatch({ type: SHOW_LOADING });

            const createExecuteResult = await bkashExecutePayment(
              bkashToken,
              bkashPaymentId,
            );

            console.log(
              'Status Message API Reponse: ',
              JSON.stringify(createExecuteResult),
            );
            console.log('Status Message: ', createExecuteResult.statusMessage);

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

            dispatch({ type: HIDE_LOADING });

            if (createExecuteResult.transactionStatus == 'Completed') {
              let postData = {
                policy_no: number,
                method: 'bkash',
                amount: amount,
                transaction_no: createExecuteResult.trxID,
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

              if (isSuccess) {
                var syncPayments =
                  JSON.parse(await AsyncStorage.getItem('syncPayments')) ?? [];
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
            dispatch({ type: HIDE_LOADING });
            // ToastAndroid.show('Payment Failed !', ToastAndroid.LONG);
          }
        }}
      />
    );
  }

  if (showNagadPG) {
    return (
      <WebView
        source={{
          uri: nagadPGUrl,
          method: 'post',
        }}
        style={{ marginTop: 20 }}
        onNavigationStateChange={async data => {
          if (JSON.stringify(data).includes('Aborted')) {
            setShowNagadPG(false);
            dispatch({ type: HIDE_LOADING });
            return ToastAndroid.show('Aborted !', ToastAndroid.LONG);
          }
          if (JSON.stringify(data).includes('Failed')) {
            setShowNagadPG(false);
            dispatch({ type: HIDE_LOADING });
            return ToastAndroid.show('Failed !', ToastAndroid.LONG);
          }
          if (JSON.stringify(data).includes('Success')) {
            dispatch({ type: SHOW_LOADING });
            let postData = {
              policy_no: number,
              method: 'nagad',
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
            dispatch({ type: HIDE_LOADING });
            // return ToastAndroid.show('Payment Success !', ToastAndroid.LONG);
          }
        }}
      />
    );
  }

  const handleGetPolicyDetails = async () => {
    dispatch({ type: SHOW_LOADING });
    const res = await getDuePremiumDetails(number);
    console.log(JSON.stringify(res));
    dispatch({ type: HIDE_LOADING });

    if (res.Policyno) {
      console.log(JSON.stringify(res));
      setPolicyDetails(res);
    } else {
      alert('Policy not found');
    }
  };

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
        <Header navigation={navigation} title={'Pay Premium'} />
        <ScrollView>
          <View style={globalStyle.wrapper}>
            <Input
              label={'Proposal or Policy Number'}
              placeholder={''}
              value={number}
              editable={Object.keys(policyDetails).length > 0 ? false : true}
              onChangeText={setNumber}
              labelStyle={[
                globalStyle.fontMedium,
                { color: '#FFF', marginTop: 15 },
              ]}
            />

            {Object.keys(policyDetails).length == 0 && (
              <FilledButton
                title={`Next`}
                style={{
                  width: '40%',
                  borderRadius: 50,
                  alignSelf: 'center',
                  marginVertical: 10,
                }}
                onPress={() => {
                  handleGetPolicyDetails();
                }}
              />
            )}

            {Object.keys(policyDetails).length > 0 && (
              <>
                <Input
                  label={'Name'}
                  placeholder={''}
                  value={policyDetails.name}
                  editable={false}
                  labelStyle={[
                    globalStyle.fontMedium,
                    { color: '#FFF', marginTop: 15 },
                  ]}
                />

                <Input
                  keyboardType="numeric"
                  label={'Amount'}
                  placeholder={''}
                  value={amount}
                  onChangeText={setAmount}
                  labelStyle={[
                    globalStyle.fontMedium,
                    { color: '#FFF', marginTop: 15 },
                  ]}
                />

                <Text
                  style={[
                    globalStyle.fontMedium,
                    { color: '#FFF', marginTop: 15 },
                  ]}>
                  Choose Your Payment Method
                </Text>

                <RadioButtonRN
                  data={gatewayOptions}
                  selectedBtn={e => setMethod(e.value)}
                  initial={1}
                  boxActiveBgColor={'#FFF'}
                  textStyle={{ height: 60, textAlign: 'center', width: '100%' }}
                  boxStyle={{ height: 60, justifyContent: 'center' }}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Switch
                    trackColor={{ false: '#767577', true: 'green' }}
                    thumbColor={isEnabled ? 'black' : 'black'}
                    ios_backgroundColor="green"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                  <Text style={[globalStyle.fontMedium, { fontSize: 16 }]}>
                    I Agree to the{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(
                        'https://signup.sslcommerz.com/term-condition',
                      );
                    }}>
                    <Text
                      style={[
                        globalStyle.fontMedium,
                        { color: 'green', fontSize: 16 },
                      ]}>
                      Terms & Conditions
                    </Text>
                  </TouchableOpacity>
                </View>

                <FilledButton
                  title={`Pay ${Math.ceil(amount).toString()}`}
                  style={{
                    width: '40%',
                    borderRadius: 50,
                    alignSelf: 'center',
                    marginVertical: 10,
                  }}
                  onPress={() => {
                    handleSubmit();
                  }}
                />
              </>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default PayPremiumScreen;
