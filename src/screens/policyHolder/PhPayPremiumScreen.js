import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import RadioButtonRN from 'radio-buttons-react-native';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RSA } from 'react-native-rsa-native';

import Header from '../../components/Header';
import globalStyle from '../../styles/globalStyle';
import BackgroundImage from '../../assets/BackgroundImage.png';
import { Input } from '../../components/Input';
import { FilledButton } from '../../components/FilledButton';
import {
  getDuePremiumDetails,
  userPayPremium,
} from './../../actions/userActions';
import {
  bkashCreatePayment,
  bkashExecutePayment,
  bkashGetToken,
  nagadPaymentUrl,
} from '../../actions/paymentServiceActions';
import { HIDE_LOADING, SHOW_LOADING } from '../../constants/commonConstants';

var numberOptions = [
  { label: 'Proposal No', value: false },
  { label: 'Policy No', value: true },
];

var gatewayOptions = [
  {
    label: (
      <Image
        source={require('../../assets/nagad.png')}
        style={{ width: 80, height: 35 }}
      />
    ),
    value: 'nagad',
  },
  {
    label: (
      <Image
        source={require('../../assets/bkash.png')}
        style={{ width: 80, height: 35 }}
      />
    ),
    value: 'bkash',
  },
  {
    label: (
      <Image
        source={require('../../assets/otherCards.png')}
        style={{ height: 35 }}
      />
    ),
    value: 'ssl',
  },
];

const PhPayPremiumScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const policyNo = route.params.policyNo;
  const [amount, setAmount] = useState('0');
  const [policyDetails, setPolicyDetails] = useState(null);
  const [method, setMethod] = useState('nagad');

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [bkashToken, setBkashToken] = useState('');
  const [bkashPaymentId, setBkashPaymentId] = useState('');
  const [bkashUrl, setBkashUrl] = useState('');
  const [isFirstPayment, setIsFirstPayment] = useState(true);

  const [nagadPGUrl, setNagadPGUrl] = useState('');
  const [showNagadPG, setShowNagadPG] = useState(false);
  const [transactionNo, setTransactionNo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = React.useRef(false);

  const handleSubmit = async () => {
    if (!isEnabled)
      return ToastAndroid.show(
        'Please agree terms & conditions',
        ToastAndroid.LONG,
      );
    if (Number(amount) == 0)
      return ToastAndroid.show('Amount can not be zero !', ToastAndroid.LONG);
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
            policyNo,
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
          alert('Payment failed: ' + error.message);
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
              policyNo,
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
              policyNo,
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

    //   const createPaymentResult = await bkashCreatePayment(tokenResult.id_token, amount, policyNo);

    //   setBkashPaymentId(createPaymentResult.paymentID);

    //   setBkashUrl(createPaymentResult.bkashURL);
    // }

    // if (method === 'bkash') {
    //   // try {
    //   //   const lastTokenTime = await AsyncStorage.getItem('lastBkashTokenTime');
    //   //   const currentTime = Date.now();

    //   //   if (lastTokenTime) {
    //   //     const elapsedTime =
    //   //       (currentTime - parseInt(lastTokenTime, 10)) / 60000; // Convert ms to minutes
    //   //     const remainingTime = 30 - elapsedTime;

    //   //     if (elapsedTime < 30) {
    //   //       alert(
    //   //         `Rate limit exceeded. Please try again in ${Math.ceil(
    //   //           remainingTime,
    //   //         )} minutes.`,
    //   //       );
    //   //       return;
    //   //     }
    //   //   }

    //   //   // Proceed with getting a new token
    //   //   const tokenResult = await bkashGetToken();
    //   //   setBkashToken(tokenResult.id_token);

    //   //   // Store the timestamp of the new token retrieval
    //   //   await AsyncStorage.setItem(
    //   //     'lastBkashTokenTime',
    //   //     currentTime.toString(),
    //   //   );

    //   //   const createPaymentResult = await bkashCreatePayment(
    //   //     tokenResult.id_token,
    //   //     amount,
    //   //     policyNo,
    //   //   );
    //   //   setBkashPaymentId(createPaymentResult.paymentID);
    //   //   setBkashUrl(createPaymentResult.bkashURL);
    //   // } catch (error) {
    //   //   if (error.response && error.response.status === 429) {
    //   //     alert('Rate limit exceeded. Please wait before retrying.');
    //   //   } else {
    //   //     alert('An error occurred. Please try again.');
    //   //   }
    //   // }
    // }

    if (method == 'nagad') {
      // Alert.alert('Under Maintenance');
      console.log();
      const trnxNo = moment().format('YYYYMMDDHHmmss');
      setTransactionNo(trnxNo);
      let postData = {
        policyNo: policyNo,
        amount: amount,
        mobileNo: user?.phone,
        transactionNo: trnxNo,
      };
      const url = await nagadPaymentUrl(postData);
      if (url == '') {
        return ToastAndroid.show('Something wrong !', ToastAndroid.LONG);
      } else {
        setNagadPGUrl(url);
        setShowNagadPG(true);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await getDuePremiumDetails(policyNo);
      if (response) setPolicyDetails(response);
      //setAmount(Math.ceil(Number(response.totalpremium)))
    }
    fetchData();
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

          console.log('Bkash: ', JSON.stringify(data));
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
                policy_no: policyNo,
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
          console.log('Nagad WebView State:', data, 'URL:', data.url);
          if (isProcessingRef.current) {
            console.log('Transaction already processing, ignoring state change');
            return;
          }


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
            isProcessingRef.current = true; // Lock processing
            setShowNagadPG(false); // Clear WebView immediately


            dispatch({ type: SHOW_LOADING });
            let postData = {
              policy_no: policyNo,
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


            // Check for duplicate transaction ID in lastTransactionId
            var lastTransactionId = await AsyncStorage.getItem('lastTransactionId') ?? '';
            console.log('Last Transaction ID Before Check', lastTransactionId);
            console.log('Checking Transaction ID', postData.transaction_no);
            const isDuplicate = lastTransactionId === postData.transaction_no;
            console.log('Is Duplicate Transaction', isDuplicate);

            if (!isDuplicate) {
              // Store new transaction ID in lastTransactionId
              await AsyncStorage.setItem('lastTransactionId', postData.transaction_no);
              console.log('Stored Last Transaction ID', postData.transaction_no);


              const isSuccess = await userPayPremium(postData);
              console.log('Response', isSuccess);

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
              isProcessingRef.current = false; // Unlock processing
              // return ToastAndroid.show('Payment Success !', ToastAndroid.LONG);
            } else {
              console.log('Duplicate transaction detected, skipping userPayPremium');
              setShowNagadPG(false);
              dispatch({ type: HIDE_LOADING });
              isProcessingRef.current = false; // Unlock processing
              navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
              }
              );
            }
          }
        }
        }
      />
    );
  }

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
        <Header navigation={navigation} title={'Pay Premium'} />

        <ScrollView>
          <View>
            {policyDetails ? (
              <View style={globalStyle.wrapper}>
                {policyDetails && (
                  <View
                    style={{
                      borderTopWidth: 2,
                      borderLeftWidth: 2,
                      borderRightWidth: 2,
                      borderColor: '#5382AC',
                      marginVertical: 15,
                    }}>
                    <View style={styles.rowWrapper}>
                      <Text style={styles.rowLable}>Policy No</Text>
                      <Text style={styles.rowValue}>{policyNo}</Text>
                    </View>
                    <View style={styles.rowWrapper}>
                      <Text style={styles.rowLable}>Due Date</Text>
                      <Text style={styles.rowValue}>
                        {policyDetails.NextDueDate.format3}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={styles.rowLable}>Instalment</Text>
                      <Text style={styles.rowValue}>
                        {policyDetails.NoofInstolment}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={styles.rowLable}>Instalment Expected</Text>
                      <Text style={styles.rowValue}>
                        {policyDetails.ins_expected}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={styles.rowLable}>Due Per Instalment</Text>
                      <Text style={styles.rowValue}>
                        {Number(policyDetails.DuePerInstalMent).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={styles.rowLable}>Total Premium</Text>
                      <Text style={styles.rowValue}>
                        {Number(policyDetails.totalpremium).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={styles.rowLable}>Due Amount</Text>
                      <Text style={styles.rowValue}>
                        {policyDetails.DueAmount}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={styles.rowLable}>Mode</Text>
                      <Text style={styles.rowValue}>{policyDetails.mode}</Text>
                    </View>
                  </View>
                )}

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

                <Input
                  keyboardType="numeric"
                  label={''}
                  placeholder={'Amount'}
                  value={amount}
                  onChangeText={e => setAmount(e)}
                  labelStyle={[
                    globalStyle.fontMedium,
                    { color: '#FFF', marginTop: 5 },
                  ]}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    flexWrap: 'wrap',
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
              </View>
            ) : (
              <View>
                <Text>No due found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

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

export default PhPayPremiumScreen;
