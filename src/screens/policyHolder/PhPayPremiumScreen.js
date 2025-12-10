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
import { showPartialReceiptAlert } from '../../components/premiumReciept';
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

  // Payment Type: Full or Partial
  const [paymentType, setPaymentType] = useState('full');

  const [amount, setAmount] = useState('0');

  // Partial Payment Fields
  const [partialAmount, setPartialAmount] = useState('');
  const [adjustWith, setAdjustWith] = useState('');
  const [cause, setCause] = useState('');


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


  // THIS IS THE AMOUNT SENT TO PAYMENT GATEWAY
  const amountToPay = paymentType === 'partial' ? partialAmount : amount;

  // MAX 50% of Due Per Instalment
  const maxPartialAllowed = policyDetails ? Math.floor(policyDetails.DuePerInstalMent * 0.5) : 0;

  const handleSubmit = async () => {
    if (!isEnabled)
      return ToastAndroid.show(
        'Please agree terms & conditions',
        ToastAndroid.LONG,
      );

    // if (Number(amount) == 0)
    //   return ToastAndroid.show('Amount can not be zero !', ToastAndroid.LONG);

    if (!amountToPay || Number(amountToPay) <= 0)
      return ToastAndroid.show('Amount cannot be zero!', ToastAndroid.LONG);

    if (paymentType === 'partial') {
      if (!partialAmount || !adjustWith || !cause.trim())
        return ToastAndroid.show('Please fill all partial payment fields', ToastAndroid.LONG);

      if (Number(partialAmount) > maxPartialAllowed)
        return ToastAndroid.show(`Partial amount cannot exceed 50% of instalment (Max: ${maxPartialAllowed})`, ToastAndroid.LONG);

      if (Number(partialAmount) > Number(policyDetails?.DueAmount))
        return ToastAndroid.show('Partial amount cannot exceed total due', ToastAndroid.LONG);
    }

    if (paymentType === 'full') {
      if (Number(amount) % Number(policyDetails?.totalpremium) !== 0)
        return ToastAndroid.show('Full amount must be multiple of premium', ToastAndroid.LONG);
    }

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
            amountToPay,
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
              amountToPay,
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
              amountToPay,
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
        amount: amountToPay,
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

  // CLEAR OPPOSITE FIELDS WHEN SWITCHING PAYMENT TYPE
  useEffect(() => {
    if (paymentType === 'full') {
      setPartialAmount('');
      setAdjustWith('');
      setCause('');
    } else {
      setAmount(''); // ← This clears the full amount field
    }
  }, [paymentType]);

  // DEBUG: Log every input change in real-time
useEffect(() => {
  console.log('DEBUG PAYMENT FORM STATE:');
  console.log('  Payment Type    :', paymentType);
  console.log('  Full Amount     :', amount || '(empty)');
  console.log('  Partial Amount  :', partialAmount || '(empty)');
  console.log('  Adjust With     :', adjustWith || '(not selected)');
  console.log('  Cause           :', cause || '(empty)');
  console.log('  Amount to Pay   :', amountToPay);
  console.log('  Max Partial     :', maxPartialAllowed);
  console.log('  T&C Accepted    :', isEnabled);
  console.log('  Gateway         :', method);
  console.log('  Policy Details  :', policyDetails ? 'Loaded' : 'Loading...');
  console.log('  ------------------------------');
  console.log('  Service Cell  :', policyDetails?.service_cell_code || 'Not loaded yet');
  console.log('  Branch        :', policyDetails?.branch_code || 'Not loaded yet');
  console.log('----------------------------------------');
}, [paymentType, amount, partialAmount, adjustWith, cause, amountToPay, isEnabled, method, policyDetails, maxPartialAllowed]);

  useEffect(() => {
    async function fetchData() {
      const response = await getDuePremiumDetails(policyNo);
      console.log('Due Premium Details:', response);
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
                amount: paymentType === 'full' ? amount : null,
                transaction_no: createExecuteResult.trxID,
                date_time: moment().format('DD-MM-YYYY HH:mm:ss'),
                partial_amount: paymentType === 'partial' ? partialAmount : null,
                adjust_with: paymentType === 'partial' ? adjustWith : null,
                cause: paymentType === 'partial' ? cause.trim() : null,
                // ADD THESE TWO LINES
                service_cell_code: policyDetails.service_cell_code || '',
                branch_code: policyDetails.branch_code || '',
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
                if (paymentType === "partial") {
                  showPartialReceiptAlert(postData.transaction_no);
                } 

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
              amount: paymentType === 'full' ? amount : null,
              transaction_no: transactionNo,
              date_time: moment().format('DD-MM-YYYY HH:mm:ss'),
              partial_amount: paymentType === 'partial' ? partialAmount : null,
              adjust_with: paymentType === 'partial' ? adjustWith : null,
              cause: paymentType === 'partial' ? cause.trim() : null,
              // ADD THESE TWO LINES
              service_cell_code: policyDetails.service_cell_code || '',
              branch_code: policyDetails.branch_code || '',
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
                if (paymentType === "partial") {
                  showPartialReceiptAlert(postData.transaction_no);
                } 


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
                      <Text style={[styles.rowLable, globalStyle.tableText]}>Policy No</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>{policyNo}</Text>
                    </View>
                    <View style={styles.rowWrapper}>
                      <Text style={[styles.rowLable, globalStyle.tableText]}>Due Date</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>
                        {policyDetails.NextDueDate.format3}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={[styles.rowLable, globalStyle.tableText]}>Instalment</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>
                        {policyDetails.NoofInstolment}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={[styles.rowLable, globalStyle.tableText]}>Instalment Expected</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>
                        {policyDetails.ins_expected}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={[styles.rowLable, globalStyle.tableText]}>Due Per Instalment</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>
                        {Number(policyDetails.DuePerInstalMent).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={[styles.rowLable, globalStyle.tableText]}>Total Premium</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>
                        {Number(policyDetails.totalpremium).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={[styles.rowLable, globalStyle.tableText]}>Due Amount</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>
                        {policyDetails.DueAmount}
                      </Text>
                    </View>

                    <View style={styles.rowWrapper}>
                      <Text style={[styles.rowLable, globalStyle.tableText]}>Mode</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.mode}</Text>
                    </View>


                      <View style={styles.rowWrapper}>
                      <Text style={[styles.rowLable, globalStyle.tableText]}>Service Cell</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.service_cell_code || 0}</Text>
                    </View>

                      <View style={styles.rowWrapper}>
                      <Text style={[styles.rowLable, globalStyle.tableText]}>Branch</Text>
                      <Text style={[styles.rowValue, globalStyle.tableText]}>{policyDetails.branch_code || 0}</Text>
                    </View>
                  </View>
                )}

                <Text style={[globalStyle.fontMedium, { color: '#000', marginTop: 15, fontSize: 16 }]}>
                Choose Payment Type
                </Text>

                {/* Full vs Partial Radio */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                {['full', 'partial'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setPaymentType(type);
                      if (type === 'full') {
                        setPartialAmount('');
                        setAdjustWith('');
                        setCause('');
                      } else {
                        setAmount('');
                      }
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: '#0066CC',
                        marginRight: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: paymentType === type ? '#0066CC' : '#FFF',
                      }}
                    >
                      {paymentType === type && (
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFF' }} />
                      )}
                    </View>
                    <Text style={{ fontSize: 16, color: '#000', textTransform: 'capitalize' }}>
                      {type === 'full' ? 'Full Payment' : 'Partial Payment'}
                    </Text>
                  </TouchableOpacity>
                ))}
                </View>

                {/* Full Payment Amount Field */}
                {paymentType === 'full' && (
                  <Input
                    keyboardType="numeric"
                    label="Amount"
                    placeholder="Enter full amount"
                    value={amount}
                    onChangeText={setAmount}
                  />
                )}


                {/* Partial Payment Fields */}
                {paymentType === 'partial' && (
                  <>
                    <Input
                      keyboardType="numeric"
                      label="Partial Amount"
                      placeholder="Enter partial amount"
                      value={partialAmount}
                      onChangeText={setPartialAmount}
                    />

                    <Text style={[globalStyle.fontMedium, { marginTop: 20, marginBottom: 10, color: '#000' }]}>
                      Adjust With
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                      {['SB', 'Age_Proof', 'Suspense', 'Others', 'F/E', 'O/E', 'ADAB', 'PDAB'].map((item) => (
                        <TouchableOpacity
                          key={item}
                          onPress={() => setAdjustWith(item)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '48%',
                            marginVertical: 8,
                          }}
                        >
                          <View
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 11,
                              borderWidth: 2,
                              borderColor: '#0066CC',
                              marginRight: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: adjustWith === item ? '#0066CC' : '#FFF',
                            }}
                          >
                            {adjustWith === item && (
                              <View style={{ width: 11, height: 11, borderRadius: 5.5, backgroundColor: '#FFF' }} />
                            )}
                          </View>
                          <Text style={{ fontSize: 15, color: '#000' }}>
                            {item === 'Age_Proof' ? 'Age Proof' : item}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Input
                      label="Cause / Reason"
                      placeholder="Enter reason for partial payment"
                      value={cause}
                      onChangeText={setCause}
                    />
                  </>
                )}


                <Text
                  style={[
                    globalStyle.fontMedium,
                    { color: '#000', marginTop: 15 },
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

                {/* <Input
                  keyboardType="numeric"
                  label={''}
                  placeholder={'Amount'}
                  value={amount}
                  onChangeText={e => setAmount(e)}
                  labelStyle={[
                    globalStyle.fontMedium,
                    { color: '#FFF', marginTop: 5 },
                  ]}
                /> */}

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
                  title={`Pay ${Math.ceil(amountToPay || 0).toString()}`}
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
