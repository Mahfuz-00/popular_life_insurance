import {
  View,
  Text,
  ScrollView,
  ToastAndroid,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  Linking,
} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
var {width, height} = Dimensions.get('window');

import globalStyle from '../../styles/globalStyle';
import MenuComponent from './../../components/MenuComponent';
import iconProducer from '../../assets/icon-producer.png';
import {logout} from '../../actions/userActions';
import Header from './../../components/Header';
import {COMPANY_NAME} from './../../config';
import DeviceInfo from 'react-native-device-info';
import checkVersion from 'react-native-store-version';

const DashboardPhScreen = ({navigation, route}) => {
  const policyNo = route.params.policyNo;

  const menus = [
    {
      title: 'Policy Statement',
      navigateTo: 'PhPolicyStatement',
      icon: require('../../assets/icon-company-info.png'),
    },
    {
      title: 'Due Premium',
      navigateTo: 'PhDuePremium',
      icon: require('../../assets/icon-my-transaction.png'),
    },
    {
      title: 'Pay Premium',
      navigateTo: 'PhPayPremium',
      icon: require('../../assets/icon-premium-calc.png'),
    },
    {
      title: 'Policy Transactions',
      navigateTo: 'PhPolicyTransactions',
      icon: require('../../assets/icon-premium-calc.png'),
    },
    {
      title: 'Claim Submission',
      navigateTo: 'PhClaimSubmission',
      icon: require('../../assets/icon-claim-submission.png'),
    },
    {
      title: 'PR List',
      navigateTo: 'PhPRList',
      icon: require('../../assets/icon-claim-submission.png'),
    },
  ];

  const dispatch = useDispatch();

  const checkPlayStoreVersion = async () => {
    try {
      // Get the latest version from the Play Store for your package
      const currentVersion = DeviceInfo.getVersion();
      console.log('Current Version playstore:', currentVersion);
      const storeVersion = await checkVersion({
        version: currentVersion, // app local version
        // iosStoreURL: 'ios app store url',
        androidStoreURL:
          'https://play.google.com/store/apps/details?id=com.insurancecompanyapp&hl=en',
        // country: 'bd',
      });
      console.log('Store Version playstore:', storeVersion);
      if (storeVersion.result === 'new') {
        Alert.alert(
          'New Update Available',
          'A new version is available on the Play Store.',
          [
            {
              text: 'Update Now',
              onPress: () =>
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.insurancecompanyapp&hl=en',
                ),
            },
            {text: 'Later', style: 'cancel'},
          ],
        );
      } else {
        Alert.alert('No New Update', 'You are using the latest version.');
      }
    } catch (error) {
      console.error('Error checking Play Store version:', error);
      Alert.alert('Error', 'Could not check the Play Store version.');
    }
  };

  const logoutHandler = () => {
    dispatch(logout(navigation));
  };

  return (
    <View style={globalStyle.container}>
      <Header navigation={navigation} title={policyNo} />

      <ScrollView>
        <View style={globalStyle.wrapper}>
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {menus.map((item, index) => (
              <MenuComponent
                key={index}
                onPress={() =>
                  navigation.navigate(item.navigateTo, {policyNo: policyNo})
                }
                icon={item.icon}
                title={item.title}
              />
            ))}

            <View style={styles.updateContainer}>
              <TouchableOpacity
                onPress={checkPlayStoreVersion}
                style={styles.updateButton}>
                <Image
                  source={require('../../assets/playstore.png')}
                  style={styles.playStoreIcon}
                />
              </TouchableOpacity>
              <Text style={styles.updateButtonText}>Check for Updates</Text>
            </View>

            <MenuComponent
              onPress={() => logoutHandler()}
              icon={require('../../assets/icon-premium-calc.png')}
              title={'Logout'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  GridViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    margin: 5,
    backgroundColor: '#7B1FA2',
  },
  GridViewTextLayout: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    color: '#fff',
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
  },
  modalContent: {
    width: 250,
    padding: 20,
    backgroundColor: 'white', // white background for the modal
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  updateContainer: {
    alignItems: 'center', // Center everything
    marginTop: 20, // Adjust spacing
    height: height * 0.12,
    width: '26%',
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 15,
    marginLeft: 10,
  },
  updateButton: {
    backgroundColor: '#ffffff',
    marginVertical: 20,
    alignItems: 'center',
    height: height * 0.07,
    width: '32%',
    marginTop: 28,
  },
  playStoreIcon: {
    width: 50, // Adjust icon size
    height: 50,
    alignContent: 'center',
    //tintColor: '', // Change color if needed
  },
  updateButtonText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    // fontWeight: 'bold',
    alignContent: 'center',
  },
});

export default DashboardPhScreen;
