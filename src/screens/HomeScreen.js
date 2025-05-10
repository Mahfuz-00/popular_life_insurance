/* eslint-disable react-hooks/exhaustive-deps */
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
  NativeModules,
  FileProvider,
  Context,
} from 'react-native';
var {width, height} = Dimensions.get('window');
import {useDispatch, useSelector} from 'react-redux';

import globalStyle from '../styles/globalStyle';
import iconProducer from '../assets/icon-producer.png';
import MenuComponent from '../components/MenuComponent';
import Header from '../components/Header';
import {COMPANY_NAME} from '../config';
import Slider from '../components/Slider';
// import DeviceInfo from 'react-native-device-info';
// import RNFS from 'react-native-fs';
// import checkVersion from 'react-native-store-version';
// import RNApkInstaller from '@dominicvonk/react-native-apk-installer';
// const {RNApkInstaller} = NativeModules;
// import RNIntentLauncher from 'react-native-intent-launcher';
// import RNRestart from 'react-native-restart';

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
    // Conditionally add "Pay First Premium" only if authenticated
    ...(isAuthenticated
      ? [
          {
            title: 'Pay First Premium',
            navigateTo: 'PhPayFirstPremium',
            icon: require('../assets/pay-first-premiums-menu.jpg'),
          },
          {
            title: 'Pay First Premium Transaction',
            navigateTo: 'PayFirstPremiumTransaction',
            icon: require('../assets/icon-premium-calc.png'),
          },
          {
            title: 'Collection Summary',
            navigateTo: 'CodeWiseCollectionScreen',
            icon: require('../assets/icon-claim-submission.png'),
          },
        ]
      : []),
    // {title: 'Sync Payment', navigateTo: 'SyncPayment', icon: require('../assets/product-engine.png')},
  ];

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);

  // async function downloadApkWrapper(apkUrl, expectedSize, latestVersion) {
  //   const getRequiredPermissions = () => {
  //     if (Platform.Version >= 33) {
  //       // Android 13+
  //       return [
  //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
  //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
  //       ];
  //     }
  //     if (Platform.Version >= 29) {
  //       // Android 10+
  //       return [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE];
  //     }
  //     return [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE];
  //   };

  //   const checkPermission = async () => {
  //     try {
  //       const permissions = getRequiredPermissions();
  //       const hasPermission = await PermissionsAndroid.check(permissions[0]);

  //       if (hasPermission) {
  //         return true;
  //       }

  //       const results = await PermissionsAndroid.requestMultiple(permissions);

  //       return Object.values(results).every(
  //         status => status === PermissionsAndroid.RESULTS.GRANTED,
  //       );
  //     } catch (err) {
  //       console.error('Permission error:', err);
  //       return false;
  //     }
  //   };

  //   const showSettingsAlert = () => {
  //     Alert.alert(
  //       'Permission Required',
  //       'Please enable storage permissions in app settings',
  //       [
  //         {text: 'Cancel', style: 'cancel'},
  //         {
  //           text: 'Open Settings',
  //           onPress: () => {
  //             Linking.openSettings();
  //             // Add delay to ensure settings screen loads
  //             setTimeout(() => {}, 1000);
  //           },
  //         },
  //       ],
  //     );
  //   };

  //   try {
  //     let hasPermission = await checkPermission();

  //     while (!hasPermission) {
  //       const tryAgain = await new Promise(resolve => {
  //         Alert.alert(
  //           'Permission Required',
  //           'Storage access is needed to download updates',
  //           [
  //             {
  //               text: 'Open Settings',
  //               onPress: () => {
  //                 Linking.openSettings();
  //                 resolve(false);
  //               },
  //             },
  //             {
  //               text: 'Try Again',
  //               onPress: async () => {
  //                 const result = await checkPermission();
  //                 resolve(result);
  //               },
  //             },
  //             {
  //               text: 'Cancel',
  //               style: 'cancel',
  //               onPress: () => resolve(false),
  //             },
  //           ],
  //           {cancelable: false},
  //         );
  //       });

  //       if (tryAgain === 'never_ask_again') {
  //         showSettingsAlert();
  //         return;
  //       }

  //       hasPermission = tryAgain;
  //     }

  //     if (hasPermission) {
  //       await downloadApk(apkUrl, expectedSize, latestVersion);
  //     }
  //   } catch (error) {
  //     console.error('Download error:', error);
  //     ToastAndroid.show('Download failed', ToastAndroid.LONG);
  //   }
  // }

  // const checkAppVersion = async () => {
  //   if (Platform.OS === 'android') {
  //     try {
  //       console.log('Checking app version...');

  //       // Fetch the latest version from your API
  //       // const response = await fetch('http://27.147.163.94:1929/api/latest');
  //       const response = await fetch(
  //         'https://vmi1596425.contaboserver.net/api/latest',
  //       );
  //       const result = await response.json();
  //       console.log('API Response:', JSON.stringify(result, null, 2));

  //       const currentVersion = DeviceInfo.getVersion();
  //       const latestVersion = result.version;
  //       const apkUrl = String(result.app);
  //       const expectedSize = result.filesize;

  //       console.log(`Current Version: ${currentVersion}`);
  //       console.log(`Latest Version: ${latestVersion}`);
  //       console.log(`APK URL: ${apkUrl}`);
  //       console.log(`Expected Size: ${expectedSize}`);

  //       if (currentVersion < latestVersion) {
  //         Alert.alert(
  //           'New Version Available',
  //           'A new version of the app is available.\n\nTap below to download:',
  //           [
  //             {
  //               text: 'Download Now',
  //               onPress: () =>
  //                 downloadApkWrapper(apkUrl, expectedSize, latestVersion),
  //             },
  //             {
  //               text: 'Later',
  //               style: 'default',
  //             },
  //           ],
  //         );
  //       } else if (currentVersion === latestVersion) {
  //         console.log('App is up to date');
  //         const downloadFolder = RNFS.DownloadDirectoryPath;
  //         const downloadDest = `${downloadFolder}/newApp-${currentVersion}.apk`;
  //         const fileExists = await RNFS.exists(downloadDest);
  //         if (fileExists) {
  //           await RNFS.unlink(downloadDest);
  //         }
  //       } else if (currentVersion > latestVersion) {
  //         console.log('App is up to date 2');
  //         const downloadFolder = RNFS.DownloadDirectoryPath;
  //         const downloadDest = `${downloadFolder}/newApp-${currentVersion}.apk`;
  //         const fileExists = await RNFS.exists(downloadDest);
  //         if (fileExists) {
  //           await RNFS.unlink(downloadDest);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Version check failed:', error);
  //     }
  //   }
  // };

  // const downloadApk = async (
  //   apkUrl,
  //   expectedSize,
  //   latestVersion,
  //   retries = 3,
  // ) => {
  //   try {
  //     console.log(`Latest Version: ${latestVersion}`);
  //     const downloadFolder = RNFS.DownloadDirectoryPath;
  //     const downloadDest = `${downloadFolder}/newApp-${latestVersion}.apk`;
  //     console.log('Downloading APK to:', downloadDest);

  //     // const expectedSize = await getApkFileSize(apkUrl);
  //     console.log('Expected APK size:', expectedSize);
  //     // ToastAndroid.show(
  //     //   `Expected APK size: ${expectedSize} bytes`,
  //     //   ToastAndroid.LONG,
  //     // );

  //     const fileExists = await RNFS.exists(downloadDest);
  //     if (fileExists) {
  //       const stat = await RNFS.stat(downloadDest);
  //       console.log('Existing file size:', stat.size);
  //       if (stat.size === expectedSize && stat.size > 0) {
  //         console.log('APK already downloaded and valid');
  //         // await RNFS.unlink(downloadDest);
  //         await installApk(downloadDest);
  //         return;
  //       } else {
  //         console.log('Existing file invalid, deleting...');
  //         await RNFS.unlink(downloadDest);
  //       }
  //     }

  //     const freeSpace = await RNFS.getFSInfo().then(info => info.freeSpace);
  //     if (freeSpace < expectedSize) {
  //       throw new Error('Insufficient storage space');
  //     }

  //     const options = {
  //       fromUrl: String(apkUrl),
  //       toFile: downloadDest,
  //       background: true,
  //       progress: res => {
  //         let progress = (res.bytesWritten / res.contentLength) * 100;
  //         setDownloadProgress(progress);
  //         setIsDownloading(true);
  //       },
  //       begin: res => {
  //         console.log('Download started, content length:', res.contentLength);
  //         ToastAndroid.show('Download Started', ToastAndroid.LONG);
  //       },
  //       progressDivider: 1,
  //     };

  //     let downloadResult;
  //     for (let attempt = 0; attempt < retries; attempt++) {
  //       try {
  //         downloadResult = await RNFS.downloadFile(options).promise;
  //         console.log(
  //           'Download Complete, bytes written:',
  //           downloadResult.bytesWritten,
  //         );

  //         const downloadedStat = await RNFS.stat(downloadDest);
  //         console.log('Downloaded file size:', downloadedStat.size);
  //         if (
  //           downloadedStat.size !== expectedSize ||
  //           downloadedStat.size === 0
  //         ) {
  //           throw new Error(
  //             `APK download invalid: expected ${expectedSize}, got ${downloadedStat.size}`,
  //           );
  //         }

  //         ToastAndroid.show('Download Completed', ToastAndroid.LONG);
  //         break;
  //       } catch (error) {
  //         console.error(`Attempt ${attempt + 1} failed:`, error);
  //         ToastAndroid.show(
  //           `Attempt ${attempt + 1} failed: ${error}`,
  //           ToastAndroid.LONG,
  //         );
  //         if (attempt === retries - 1) {
  //           throw new Error('Download failed after multiple attempts');
  //         }
  //         console.log('Retrying download...');
  //       }
  //     }

  //     setIsDownloading(false);

  //     // Alert.alert(
  //     //   'Install App',
  //     //   `Use this location to install the app: ${downloadDest}`,
  //     //   [
  //     //     {
  //     //       text: 'OK',
  //     //       onPress: () => {}, // No action, simply dismiss the alert
  //     //     },
  //     //   ],
  //     // );

  //     await installApk(downloadDest);
  //   } catch (error) {
  //     console.error('Download failed:', error);
  //     ToastAndroid.show(`Download failed: ${error.message}`, ToastAndroid.LONG);
  //   }
  // };

  // const installApk = async filePath => {
  //   try {
  //     // const filePath = `${RNFS.DownloadDirectoryPath}/newApp.apk`;

  //     // Show loading state
  //     // setIsInstalling(true);
  //     // ToastAndroid.show('Checking for update...', ToastAndroid.SHORT);

  //     // 1. Verify file exists
  //     if (!(await RNFS.exists(filePath))) {
  //       // setIsInstalling(false);
  //       return Alert.alert('Error', 'Installation file not found');
  //     }

  //     // 2. Show installation confirmation dialog
  //     Alert.alert(
  //       'Install Update',
  //       'A new version is ready. Install now?\n\n(If install fails, tap "Manual Install" for the APK location.)',
  //       [
  //         {
  //           text: 'Install Now',
  //           onPress: async () => {
  //             try {
  //               // setIsInstalling(true);

  //               // 3. Android-specific installation flow
  //               if (Platform.OS === 'android') {
  //                 try {
  //                   // const apkUri = `content://${filePath}`;
  //                   // console.log('APK URI:', apkUri);

  //                   // ToastAndroid.show(`ApK Url : ${apkUri}`, ToastAndroid.LONG);
  //                   if (await RNFS.exists(filePath)) {
  //                     ToastAndroid.show('Apk Installing', ToastAndroid.LONG);
  //                     // RNApkInstaller.install(filePath);

  //                     // await RNApkInstaller.install(filePath);

  //                     // try {
  //                     //   console.log(
  //                     //     'Attempting to install APK from:',
  //                     //     filePath,
  //                     //   );
  //                     //   await RNApkInstaller.install(filePath);
  //                     //   ToastAndroid.show(
  //                     //     'Installation initiated. Please follow the prompts.',
  //                     //     ToastAndroid.LONG,
  //                     //   );
  //                     //   // You might want to add logic here to check if the app was actually updated
  //                     //   // (this can be tricky and might involve checking app versions later).
  //                     // } catch (error) {
  //                     //   console.error('Error during APK installation:', error);
  //                     //   if (error.message) {
  //                     //     Alert.alert(
  //                     //       'Installation Failed',
  //                     //       'The app update could not be installed automatically. Please navigate to the following location using a file manager and install it manually:\n\n' +
  //                     //         filePath,
  //                     //       [
  //                     //         {
  //                     //           text: 'OK',
  //                     //           onPress: () =>
  //                     //             console.log('Manual install info shown'),
  //                     //         },
  //                     //       ],
  //                     //       {cancelable: false},
  //                     //     );
  //                     //   } else {
  //                     //     Alert.alert(
  //                     //       'Installation Failed',
  //                     //       'An error occurred during installation: ' +
  //                     //         (error.message || 'An unknown error occurred.'),
  //                     //       [
  //                     //         {
  //                     //           text: 'OK',
  //                     //           onPress: () =>
  //                     //             console.log('Installation error alert shown'),
  //                     //         },
  //                     //       ],
  //                     //       {cancelable: false},
  //                     //     );
  //                     //   }
  //                     // }
  //                   } else {
  //                     Alert.alert('Error', 'APK not found at: ' + filePath);
  //                   }
  //                   // try {
  //                   //   await RNIntentLauncher.startActivity({
  //                   //     action: 'android.intent.action.INSTALL_PACKAGE',
  //                   //     data: apkUri,
  //                   //     type: 'application/vnd.android.package-archive',
  //                   //     flags: 268435456, // Or try 3 or 268435456
  //                   //   });
  //                   // } catch (error) {
  //                   //   console.error('Test URL launch failed:', error);
  //                   //   Alert.alert(
  //                   //     'Error',
  //                   //     'Failed to launch APK installation.',
  //                   //     `error: ${error}`,
  //                   //   );
  //                   //   setIsInstalling(false);
  //                   // }
  //                 } catch (fileProviderError) {
  //                   console.error('FileProvider error:', fileProviderError);
  //                   Alert.alert(
  //                     'FileProvider Error',
  //                     fileProviderError.message,
  //                   );
  //                   // setIsInstalling(false);
  //                   return;
  //                 }
  //               }

  //               // ToastAndroid.show('Installation Complete', ToastAndroid.LONG);

  //               // 4. Cleanup after installation
  //               // setTimeout(async () => {
  //               //   try {
  //               //     // await RNFS.unlink(filePath);
  //               //     // ToastAndroid.show('APK file deleted.', ToastAndroid.LONG);
  //               //     RNRestart.restart();
  //               //   } catch (e) {
  //               //     console.warn('Cleanup error:', e);
  //               //   }
  //               // }, 5000);
  //             } catch (error) {
  //               Alert.alert('Install Failed', error.message);
  //             } finally {
  //               // setIsInstalling(false);
  //             }
  //           },
  //         },
  //         {
  //           text: 'Manual Install',
  //           onPress: () => {
  //             Alert.alert(
  //               'Manual Installation',
  //               `Uninstall current app first.\n\nUse file manager to find and tap:\n\n${filePath}\n\nThen install.`,
  //               [{text: 'OK'}],
  //               {cancelable: false},
  //             );
  //           },
  //         },
  //         {
  //           text: 'Cancel',
  //           onPress: () => {
  //             setIsInstalling(false);
  //             ToastAndroid.show('Installation canceled', ToastAndroid.SHORT);
  //           },
  //           style: 'cancel',
  //         },
  //       ],
  //     );
  //   } catch (error) {
  //     Alert.alert('Error', error.message);
  //     setIsInstalling(false);
  //   }
  // };


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

            {/* <View style={styles.updateContainer}>
              <TouchableOpacity
                onPress={checkPlayStoreVersion}
                style={styles.updateButton}>
                <Image
                  source={require('../assets/playstore.png')}
                  style={styles.playStoreIcon}
                />
              </TouchableOpacity>
              <Text style={styles.updateButtonText}>Check for Updates</Text>
            </View> */}

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
  updateContainer: {
    alignItems: 'center', // Center everything
    marginTop: 20, // Adjust spacing
    height: height * 0.12,
    width: '26%',
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 15,
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

export default HomeScreen;
