// In App.js in a new project
import * as React from 'react';
import VersionCheck from 'react-native-version-check';
import { View, Text, Alert, BackHandler, Linking, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Provider } from 'react-redux';
import store from './src/store';
import { userPayPremium } from './src/actions/userActions';

import HomeScreen from './src/screens/HomeScreen';
import { loadUser } from './src/actions/userActions';
import SelectLoginScreen from './src/screens/SelectLoginScreen';
import PremiumCalculatorScreen from './src/screens/PremiumCalculatorScreen';
import CompanyInfoScreen from './src/screens/CompanyInfoScreen';
import LocateUsScreen from './src/screens/LocateUsScreen';
import PayPremiumScreen from './src/screens/PayPremiumScreen';
import ProductInfoScreen from './src/screens/ProductInfoScreen';
import Loading from './src/components/Loading';
import LoginScreen from './src/screens/LoginScreen';
import DashboardPhScreen from './src/screens/policyHolder/DashboardPhScreen';
import DashboardProducerScreen from './src/screens/producer/DashboardProducerScreen';
import DrawerContent from './src/components/DrawerContent';
import MessageFromMd from './src/screens/MessageFromMd';
import PolicyInfoScreen from './src/screens/PolicyInfoScreen';
import PhPolicyListScreen from './src/screens/policyHolder/PhPolicyListScreen';
import ContactUsScreen from './src/screens/ContactUsScreen';
import ApplyOnlineScreen from './src/screens/ApplyOnlineScreen';
import BusinessInfoScreen from './src/screens/producer/BusinessInfoScreen';
import EarningInfoScreen from './src/screens/producer/EarningInfoScreen';
import PolicyPhoneUpdateScreen from './src/screens/PolicyPhoneUpdateScreen';
import PolicyListScreen from './src/screens/producer/PolicyListScreen';
import ProposalTrackingScreen from './src/screens/ProposalTrackingScreen';
import MyTransactionScreen from './src/screens/MyTransactionScreen';
import PhPolicyStatementScreen from './src/screens/policyHolder/PhPolicyStatementScreen';
import PhDuePremiumScreen from './src/screens/policyHolder/PhDuePremiumScreen';
import PhPayPremiumScreen from './src/screens/policyHolder/PhPayPremiumScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ClaimSubmissionScreen from './src/screens/ClaimSubmissionScreen';
import PhPolicyTransactionsScreen from './src/screens/policyHolder/PhPolicyTransactionsScreen';
import AuthPolicyInfoScreen from './src/screens/AuthPolicyInfoScreen';
import PhMyProfileScreen from './src/screens/policyHolder/PhMyProfileScreen';
import OrgMyProfileScreen from './src/screens/producer/OrgMyProfileScreen';
import PhClaimSubmissionScreen from './src/screens/policyHolder/PhClaimSubmissionScreen';
import PhPRListScreen from './src/screens/policyHolder/PhPRListScreen';
import SyncPaymentScreen from './src/screens/policyHolder/SyncPaymentScreen';
import PayFirstPremiumScreen from './src/screens/PayFirstPremiumScreen';
import PayfirstPremiumGateway from './src/screens/PayfirstPremiumGateways';
import FirstPremiumTransactionsScreen from './src/screens/PayFirstPremiumTransaction';
import CodeWiseCollectionScreen from './src/screens/CodeWiseCollectionScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function StackNav() {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="PremiumCalculator"
        component={PremiumCalculatorScreen}
      />
      <Stack.Screen name="CompanyInfo" component={CompanyInfoScreen} />
      <Stack.Screen name="LocateUs" component={LocateUsScreen} />
      <Stack.Screen name="PayPremium" component={PayPremiumScreen} />
      <Stack.Screen
        name="PhPayFirstPremium"
        component={PayFirstPremiumScreen}
      />
      <Stack.Screen
        name="PayfirstPremiumGateways"
        component={PayfirstPremiumGateway}
      />
      <Stack.Screen
        name="PayFirstPremiumTransaction"
        component={FirstPremiumTransactionsScreen}
      />
      <Stack.Screen name="CodeWiseCollectionScreen" component={CodeWiseCollectionScreen} />
      <Stack.Screen name="ProductInfo" component={ProductInfoScreen} />
      <Stack.Screen name="ClaimSubmission" component={ClaimSubmissionScreen} />

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

      <Stack.Screen name="MessageFromMd" component={MessageFromMd} />
      <Stack.Screen name="PolicyInfo" component={PolicyInfoScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="ApplyOnline" component={ApplyOnlineScreen} />
      <Stack.Screen
        name="PolicyPhoneUpdate"
        component={PolicyPhoneUpdateScreen}
      />
      <Stack.Screen
        name="ProposalTracking"
        component={ProposalTrackingScreen}
      />
      <Stack.Screen name="MyTransaction" component={MyTransactionScreen} />
      <Stack.Screen name="SyncPayment" component={SyncPaymentScreen} />

      {/* Policy holder navigations */}
      <Stack.Screen name="DashboardPh" component={DashboardPhScreen} />
      <Stack.Screen name="PhPolicyList" component={PhPolicyListScreen} />
      <Stack.Screen
        name="PhPolicyStatement"
        component={PhPolicyStatementScreen}
      />
      <Stack.Screen name="PhDuePremium" component={PhDuePremiumScreen} />
      <Stack.Screen name="PhPayPremium" component={PhPayPremiumScreen} />
      <Stack.Screen
        name="PhPolicyTransactions"
        component={PhPolicyTransactionsScreen}
      />
      <Stack.Screen name="AuthPolicyInfo" component={AuthPolicyInfoScreen} />
      <Stack.Screen name="PhMyProfile" component={PhMyProfileScreen} />
      <Stack.Screen
        name="PhClaimSubmission"
        component={PhClaimSubmissionScreen}
      />
      <Stack.Screen name="PhPRList" component={PhPRListScreen} />

      {/* Producer navigations */}
      <Stack.Screen
        name="DashboardProducer"
        component={DashboardProducerScreen}
      />
      <Stack.Screen name="BusinessInfo" component={BusinessInfoScreen} />
      <Stack.Screen name="EarningInfo" component={EarningInfoScreen} />
      <Stack.Screen name="PolicyList" component={PolicyListScreen} />
      <Stack.Screen name="OrgMyProfile" component={OrgMyProfileScreen} />
    </Stack.Navigator>
  );
}

function App() {
  const handleSyncPayments = async () => {
    var syncPayments =
      JSON.parse(await AsyncStorage.getItem('syncPayments')) ?? [];
    syncPayments.map(async payment => {
      const isSuccess = await userPayPremium(payment);
      if (isSuccess) {
        var syncPayments =
          JSON.parse(await AsyncStorage.getItem('syncPayments')) ?? [];
        updateSyncPayments = syncPayments.filter(
          item => item.transaction_no != payment.transaction_no,
        );

        await AsyncStorage.setItem(
          'syncPayments',
          JSON.stringify(updateSyncPayments),
        );
      }
    });
  };

  React.useEffect(() => {
    store.dispatch(loadUser());
    if (Platform.OS != 'ios') {
      checkUpdateNeeded();
    }
  }, []);

  const checkUpdateNeeded = async () => {
    let updateNeeded = await VersionCheck.needUpdate();
    // console.log("updateNeeded: " + updateNeeded );
    if (updateNeeded.isNeeded) {
      Alert.alert(
        'Update Available !',
        'Please update the app.',
        [
          {
            text: 'Update',
            onPress: () => {
              BackHandler.exitApp();
              Linking.openURL(updateNeeded.storeUrl);
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    }
  };

  return (
    <Provider store={store}>
      <Loading />
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            headerShown: false,
          }}
          drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name="Stack" component={StackNav} />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
