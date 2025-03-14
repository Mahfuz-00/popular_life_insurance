import * as React from 'react';
import {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Modal,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
var {width, height} = Dimensions.get('window');
import {useDispatch, useSelector} from 'react-redux';

import globalStyle from '../styles/globalStyle';
import iconProducer from '../assets/icon-producer.png';
import MenuComponent from '../components/MenuComponent';
import Header from '../components/Header';
import {COMPANY_NAME} from '../config';
import Slider from '../components/Slider';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';

const HomeScreen = ({navigation}) => {
  const {isAuthenticated, user} = useSelector(state => state.auth);

  const menus = [
    {
      title: 'Company Information',
      navigateTo: 'CompanyInfo',
      icon: require('../assets/icon-company-info.png'),
    },
    {
      title: 'Policy Information',
      navigateTo: isAuthenticated ? 'AuthPolicyInfo' : 'PolicyInfo',
      icon: require('../assets/icon-policy-info.png'),
    },
    {
      title: 'Premium Calculator',
      navigateTo: 'PremiumCalculator',
      icon: require('../assets/icon-premium-calc.png'),
    },
    // {title: 'My Account', navigateTo: 'PhMyProfile', icon: require('../assets/icon-my-transaction.png')},
    {
      title: 'Pay Premium',
      navigateTo: 'PayPremium',
      icon: require('../assets/icon-online-payment.png'),
    },
    //{title: 'Claim Submission', navigateTo: 'ClaimSubmission', icon: require('../assets/icon-claim-submission.png')},
    {
      title: 'Product Engine',
      navigateTo: 'ProductInfo',
      icon: require('../assets/product-engine.png'),
    },
    {
      title: 'Policy Phone No Update',
      navigateTo: 'PolicyPhoneUpdate',
      icon: require('../assets/product-engine.png'),
    },
    // {title: 'Sync Payment', navigateTo: 'SyncPayment', icon: require('../assets/product-engine.png')},
  ];

  const [isDownloading, setIsDownloading] = useState(false); // Track if downloading
  const [downloadProgress, setDownloadProgress] = useState(0); // Track progress
  const [isInstalling, setIsInstalling] = useState(false);

  const checkAppVersion = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        console.log('Checking app version...');

        // Fetch the latest version from your API
        const response = await fetch('http://27.147.163.94:1929/api/latest');
        const result = await response.json();

        // Get current and latest versions
        const currentVersion = DeviceInfo.getVersion();
        const latestVersion = result.version;
        const apkUrl = result.app; // APK download URL

        console.log(`Current Version: ${currentVersion}`);
        console.log(`Latest Version: ${latestVersion}`);
        console.log(`APK URL: ${apkUrl}`);

        // If an update is available, show the alert
        if (currentVersion < latestVersion) {
          Alert.alert(
            'New Version Available',
            'A new version of the app is available.\n\nTap below to download:',
            [
              {
                text: 'Download Now',
                onPress: () => downloadApk(apkUrl),
              },
              {
                text: 'Later',
                style: 'default',
              },
            ],
          );
        }
      } catch (error) {
        console.error('Version check failed:', error);
      }
    }
  }, [downloadApk]);

  const downloadApk = useCallback(async apkUrl => {
    ToastAndroid.show({
      text1: 'Function Triggered',
      position: 'bottom',
      visibilityTime: 3000,
    });

    try {
      if (Platform.OS === 'android') {
        const permissionGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (!permissionGranted) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Required',
              message:
                'App needs access to your storage to download the update.',
            },
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Storage permission denied');
            return;
          }
        }
      }

      // Define destination for APK file
      const downloadDest = `${RNFS.DownloadDirectoryPath}/newApp.apk`;

      ToastAndroid.show({
        text1: 'Root Path:',
        text2: `${RNFS.DownloadDirectoryPath}%`,
        position: 'bottom',
        visibilityTime: 3000,
      });

      ToastAndroid.show({
        text1: 'Downloading APK to:',
        text2: `${downloadDest}%`,
        position: 'bottom',
        visibilityTime: 3000,
      });

      console.log('Downloading APK to:', downloadDest);

      const options = {
        fromUrl: apkUrl, // URL of the APK
        toFile: downloadDest, // Where the APK will be saved locally
        background: true, // Continue downloading in the background
        progress: res => {
          let progress = (res.bytesWritten / res.contentLength) * 100;

          ToastAndroid.show({
            text1: 'Download Progress:',
            text2: `${progress.toFixed(2)}%`,
            position: 'bottom',
            visibilityTime: 3000,
          });

          console.log(`Download Progress: ${progress.toFixed(2)}%`);
        },
      };

      const downloadResult = await RNFS.downloadFile(options).promise;
      console.log('Download Complete:', downloadResult);

      // After download, trigger the installation
      installApk(downloadDest);
    } catch (error) {
      console.error('Download failed:', error);

      ToastAndroid.show({
        text1: 'Download failed:',
        text2: `${error}`,
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  }, []);

  // Function to install APK
  const installApk = async filePath => {
    setIsInstalling(true);
    try {
      ToastAndroid.show({
        text1: 'filePath:',
        text2: `${filePath}%`,
        position: 'bottom',
        visibilityTime: 3000, // Duration for the toast message to be visible
      });
      console.log('filePath:', filePath);

      // Check if the platform is Android
      if (Platform.OS === 'android') {
        const fileUri = 'file://' + filePath;

        ToastAndroid.show({
          text1: 'fileURI:',
          text2: `${fileUri}%`,
          position: 'bottom',
          visibilityTime: 3000, // Duration for the toast message to be visible
        });

        // Check if the file exists
        const fileExists = await RNFS.exists(fileUri);
        if (fileExists) {
          // Trigger APK installation via Linking
          Linking.openURL(`file://${filePath}`).catch(err => {
            console.error('Error opening APK for installation:', err);
          });
          console.log('APK Installation Triggered');
        } else {
          console.error('APK file does not exist at the specified path');
        }
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false); // Hide the loading indicator once installation is done
    }
  };

  useEffect(() => {
    checkAppVersion();
  }, [checkAppVersion]);

  const navigateToDashboard = () => {
    if (user.type == 'policy holder') {
      navigation.navigate('PhPolicyList');
    } else if (user.type == 'agent') {
      navigation.navigate('DashboardProducer');
    }
  };

  return (
    <View style={globalStyle.container}>
      <Header navigation={navigation} title={COMPANY_NAME} />

      <ScrollView>
        <Slider />
        <View style={globalStyle.wrapper}>
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {isAuthenticated ? (
              <MenuComponent
                onPress={navigateToDashboard}
                icon={require('../assets/icon-login.png')}
                title={
                  user.type == 'policy holder' ? 'Policy List' : 'Dashboard'
                }
              />
            ) : (
              <MenuComponent
                onPress={() => navigation.navigate('Login')}
                icon={require('../assets/icon-login.png')}
                title={'Role base login'}
              />
            )}

            {menus.map((item, index) => (
              <MenuComponent
                key={index}
                onPress={() => navigation.navigate(item.navigateTo)}
                icon={item.icon}
                title={item.title}
              />
            ))}

            {isAuthenticated ? (
              <MenuComponent
                onPress={() =>
                  user.type == 'policy holder'
                    ? navigation.navigate('PhMyProfile')
                    : navigation.navigate('OrgMyProfile')
                }
                icon={require('../assets/icon-my-transaction.png')}
                title={'My Account'}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* Modal for showing download progress */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isDownloading}
        onRequestClose={() => setIsDownloading(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#7B1FA2" />
            <Text style={styles.loadingText}>
              Downloading... {downloadProgress.toFixed(2)}%
            </Text>
          </View>
        </View>
      </Modal>

      {/* Modal for showing installation progress */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isInstalling}
        onRequestClose={() => setIsInstalling(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#7B1FA2" />
            <Text style={styles.loadingText}>Installing...</Text>
          </View>
        </View>
      </Modal>
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
});

export default HomeScreen;
