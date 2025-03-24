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
import checkVersion from 'react-native-store-version';
import RNApkInstaller from '@dominicvonk/react-native-apk-installer';

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
        ]
      : []),
    // {title: 'Sync Payment', navigateTo: 'SyncPayment', icon: require('../assets/product-engine.png')},
  ];

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);

  const checkAppVersion = async () => {
    if (Platform.OS === 'android') {
      try {
        console.log('Checking app version...');

        // Fetch the latest version from your API
        const response = await fetch('http://27.147.163.94:1929/api/latest');
        const result = await response.json();
        console.log('API Response:', JSON.stringify(result, null, 2));

        const currentVersion = DeviceInfo.getVersion();
        const latestVersion = result.version;
        const apkUrl = String(result.app);

        console.log(`Current Version: ${currentVersion}`);
        console.log(`Latest Version: ${latestVersion}`);
        console.log(`APK URL: ${apkUrl}`);

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
  };

  const downloadApk = async (apkUrl, retries = 3) => {
    try {
      const downloadFolder = RNFS.DownloadDirectoryPath;
      const downloadDest = `${downloadFolder}/newApp.apk`;
      console.log('Downloading APK to:', downloadDest);

      const expectedSize = await getApkFileSize(apkUrl);
      console.log('Expected APK size:', expectedSize);
      ToastAndroid.show(
        `Expected APK size: ${expectedSize} bytes`,
        ToastAndroid.LONG,
      );

      const fileExists = await RNFS.exists(downloadDest);
      if (fileExists) {
        const stat = await RNFS.stat(downloadDest);
        console.log('Existing file size:', stat.size);
        if (stat.size === expectedSize && stat.size > 0) {
          console.log('APK already downloaded and valid');
          // await installApk(downloadDest);
          return;
        } else {
          console.log('Existing file invalid, deleting...');
          await RNFS.unlink(downloadDest);
        }
      }

      const freeSpace = await RNFS.getFSInfo().then(info => info.freeSpace);
      if (freeSpace < expectedSize) {
        throw new Error('Insufficient storage space');
      }

      const options = {
        fromUrl: String(apkUrl),
        toFile: downloadDest,
        background: true,
        progress: res => {
          let progress = (res.bytesWritten / res.contentLength) * 100;
          setDownloadProgress(progress);
          setIsDownloading(true);
        },
        begin: res => {
          console.log('Download started, content length:', res.contentLength);
          ToastAndroid.show('Download Started', ToastAndroid.LONG);
        },
        progressDivider: 1,
      };

      let downloadResult;
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          downloadResult = await RNFS.downloadFile(options).promise;
          console.log(
            'Download Complete, bytes written:',
            downloadResult.bytesWritten,
          );

          const downloadedStat = await RNFS.stat(downloadDest);
          console.log('Downloaded file size:', downloadedStat.size);
          if (
            downloadedStat.size !== expectedSize ||
            downloadedStat.size === 0
          ) {
            throw new Error(
              `APK download invalid: expected ${expectedSize}, got ${downloadedStat.size}`,
            );
          }

          ToastAndroid.show('Download Completed', ToastAndroid.LONG);
          break;
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);
          if (attempt === retries - 1) {
            throw new Error('Download failed after multiple attempts');
          }
          console.log('Retrying download...');
        }
      }

      setIsDownloading(false);
      // await installApk(downloadDest);
    } catch (error) {
      console.error('Download failed:', error);
      ToastAndroid.show(`Download failed: ${error.message}`, ToastAndroid.LONG);
    }
  };

  const getApkFileSize = async apkUrl => {
    try {
      const response = await fetch(apkUrl, {method: 'HEAD'});
      const contentLength = response.headers.get('content-length');
      console.log('Server reported size for', apkUrl, ':', contentLength);
      return parseInt(contentLength, 10); // Return file size in bytes
    } catch (error) {
      console.error('Error fetching APK file size:', error);
      return 0; // Return 0 if error occurs
    }
  };

  const installApk = async filePath => {
    try {
      console.log('Preparing to install APK from:', filePath);

      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        throw new Error('APK file does not exist');
      }

      // Notify user before installation
      Alert.alert(
        'Install Update',
        'The new version of the app has been downloaded.\n\nWould you like to install it now?',
        [
          {
            text: 'Install Now',
            onPress: async () => {
              setIsInstalling(true);
              try {
                // Check for unknown sources permission
                const hasPermission =
                  await RNApkInstaller.haveUnknownAppSourcesPermission();
                if (!hasPermission) {
                  ToastAndroid.show(
                    'Opening settings for unknown sources permission',
                    ToastAndroid.LONG,
                  );
                  await RNApkInstaller.showUnknownAppSourcesPermission();
                  return; // Wait for user to grant permission and retry manually
                }

                ToastAndroid.show('Installation Started', ToastAndroid.LONG);
                await RNApkInstaller.install(filePath);
                console.log('APK Installation Triggered');

                // Cleanup after successful install
                await RNFS.unlink(filePath);
                ToastAndroid.show('Installation Complete', ToastAndroid.LONG);
                console.log('APK file deleted');
              } catch (error) {
                console.error('Installation failed:', error);
                ToastAndroid.show(
                  `Installation Failed: ${error.message}`,
                  ToastAndroid.LONG,
                );
              } finally {
                setIsInstalling(false);
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              console.log('User canceled installation');
              ToastAndroid.show('Installation Canceled', ToastAndroid.LONG);
            },
          },
        ],
      );
    } catch (error) {
      console.error('Pre-installation check failed:', error);
      ToastAndroid.show(`Error: ${error.message}`, ToastAndroid.LONG);
    }
  };

  // // Add this near the top of HomeScreen.js, outside the component
  // DeviceEventEmitter.addListener('InstallApkLog', message => {
  //   console.log('Native Log:', message);
  // });

  // const installApk = async filePath => {
  //   setIsInstalling(true);
  //   try {
  //     console.log('filePath:', filePath);
  //     const fileExists = await RNFS.exists(filePath);

  //     if (!fileExists) {
  //       throw new Error('APK file does not exist');
  //     }

  //     if (Platform.OS === 'android') {
  //       const {InstallApk} = NativeModules;
  //       if (!InstallApk) {
  //         throw new Error('InstallApk native module not available');
  //       }

  //       ToastAndroid.show('Installation Started', ToastAndroid.LONG);
  //       console.log('APK Installation Triggered');

  //       // Set a timeout for the installation (e.g., 60 seconds)
  //       const installTimeout = new Promise((_, reject) =>
  //         setTimeout(
  //           () => reject(new Error('Installation timed out after 60 seconds')),
  //           60000,
  //         ),
  //       );

  //       // Race the installation promise against the timeout
  //       const result = await Promise.race([
  //         InstallApk.install(filePath),
  //         installTimeout,
  //       ]);
  //       console.log('Native result:', result);

  //       // Installation successful
  //       ToastAndroid.show('Installation Complete', ToastAndroid.LONG);
  //       await RNFS.unlink(filePath);
  //       console.log('APK file deleted');
  //     }
  //   } catch (error) {
  //     console.error('Installation failed:', error);
  //     if (error.message.includes('INSTALLATION_CANCELED')) {
  //       ToastAndroid.show('Installation Canceled by User', ToastAndroid.LONG);
  //     } else if (error.message.includes('INSTALLATION_FAILED')) {
  //       ToastAndroid.show(
  //         'Installation Failed: Invalid APK or Device Issue',
  //         ToastAndroid.LONG,
  //       );
  //     } else if (error.message.includes('timed out')) {
  //       ToastAndroid.show(
  //         'Installation Timed Out: Took too long',
  //         ToastAndroid.LONG,
  //       );
  //     } else {
  //       ToastAndroid.show(
  //         `Installation Failed: ${error.message}`,
  //         ToastAndroid.LONG,
  //       );
  //     }
  //     // File remains for inspection
  //   } finally {
  //     setIsInstalling(false);
  //   }
  // };

  // const installApk = async filePath => {
  //   setIsInstalling(true);
  //   try {
  //     console.log('filePath:', filePath);
  //     const fileExists = await RNFS.exists(filePath);

  //     if (!fileExists) {
  //       throw new Error('APK file does not exist');
  //     }

  //     if (Platform.OS === 'android') {
  //       const {InstallApk} = NativeModules;
  //       if (!InstallApk) {
  //         throw new Error('InstallApk native module not available');
  //       }

  //       ToastAndroid.show('Installation Started', ToastAndroid.LONG);
  //       console.log('APK Installation Triggered');

  //       // Await the installation result
  //       const result = await InstallApk.install(filePath);
  //       console.log('Native result:', result);

  //       // Installation successful
  //       ToastAndroid.show('Installation Complete', ToastAndroid.LONG);
  //       await RNFS.unlink(filePath); // Delete file only on success
  //       console.log('APK file deleted');
  //     }
  //   } catch (error) {
  //     console.error('Installation failed:', error);

  //     // Check the error code to determine the outcome
  //     if (error.message.includes('INSTALLATION_CANCELED')) {
  //       ToastAndroid.show('Installation Canceled by User', ToastAndroid.LONG);
  //     } else if (error.message.includes('INSTALLATION_FAILED')) {
  //       ToastAndroid.show(
  //         'Installation Failed: Invalid APK or Device Issue',
  //         ToastAndroid.LONG,
  //       );
  //     } else {
  //       ToastAndroid.show(
  //         `Installation Failed: ${error.message}`,
  //         ToastAndroid.LONG,
  //       );
  //     }
  //     // File remains if installation fails or is canceled
  //   } finally {
  //     setIsInstalling(false);
  //   }
  // };

  // const requestStoragePermission = async () => {
  //   if (Platform.OS !== 'android') {
  //     return true; // iOS doesn't require storage permissions
  //   }

  //   try {
  //     const apiLevel = parseInt(DeviceInfo.getSystemVersion(), 10); // Get Android API level

  //     ToastAndroid.show(`Android API Version: ${apiLevel}%`, ToastAndroid.LONG);

  //     if (apiLevel < 29) {
  //       const granted = await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       ]);

  //       if (
  //         granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] !==
  //           PermissionsAndroid.RESULTS.GRANTED ||
  //         granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] !==
  //           PermissionsAndroid.RESULTS.GRANTED
  //       ) {
  //         ToastAndroid.show('Storage permission denied', ToastAndroid.LONG);
  //         return false;
  //       }
  //       return true;
  //     } else if (apiLevel === 29) {
  //       const readPermission = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //       );

  //       if (readPermission !== PermissionsAndroid.RESULTS.GRANTED) {
  //         ToastAndroid.show('Storage permission denied', ToastAndroid.LONG);
  //         return false;
  //       }
  //       return true;
  //     } else if (apiLevel >= 30 && apiLevel < 34) {
  //       const managePermission = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
  //       );

  //       if (managePermission !== PermissionsAndroid.RESULTS.GRANTED) {
  //         ToastAndroid.show(
  //           'Please grant Manage Storage permission manually',
  //           ToastAndroid.LONG,
  //         );
  //         Linking.openSettings();
  //         return false;
  //       }
  //       return true;
  //     } else if (apiLevel >= 34) {
  //       ToastAndroid.show(
  //         'Storage access is restricted. Enable it manually in settings.',
  //         ToastAndroid.LONG,
  //       );
  //       Linking.openSettings(); // Open settings for manual permission
  //       return false;
  //     }

  //     return false;
  //   } catch (error) {
  //     console.error('Permission request error:', error);
  //     return false;
  //   }
  // };

  // // Function to install APK
  // const installApk = async filePath => {
  //   setIsInstalling(true);
  //   try {
  //     // ToastAndroid.show(`FilePath: ${filePath}`, ToastAndroid.LONG);
  //     console.log('filePath:', filePath);

  //     if (Platform.OS === 'android') {
  //       const fileExists = await RNFS.exists(filePath);
  //       if (fileExists) {
  //         // NativeModules.InstallApk.install(filePath);
  //         // installApk(filePath);
  //         // Linking.openURL(`file://${filePath}`);

  //         // const contentUri = await generateContentUri(filePath);

  //         // if (contentUri) {
  //         //   // Trigger installation using Intent.ACTION_VIEW
  //         //   const intent = {
  //         //     action: 'android.intent.action.VIEW',
  //         //     data: contentUri,
  //         //     flags: 1, //FLAG_GRANT_READ_URI_PERMISSION
  //         //     type: 'application/vnd.android.package-archive',
  //         //   };

  //         //   Linking.openURL(
  //         //     `intent:#Intent;${intent.action};${intent.data};${intent.type};${intent.flags};end`,
  //         //   ).catch(err => {
  //         //     console.error('Error opening APK for installation:', err);
  //         //     ToastAndroid.show(
  //         //       `Error opening APK for installation: ${err}`,
  //         //       ToastAndroid.LONG,
  //         //     );
  //         //   });

  //         const apkUri = `file://${filePath}`;
  //         Linking.openURL(apkUri).catch(err => {
  //           console.error('Error opening APK for installation:', err);
  //           ToastAndroid.show(`Error opening APK: ${err}`, ToastAndroid.LONG);
  //         });

  //         ToastAndroid.show('Installation Started', ToastAndroid.LONG);
  //         console.log('APK Installation Triggered');

  //         // Check installation status after a delay (simplified approach)
  //         setTimeout(async () => {
  //           const isInstalled = await checkInstallationStatus();
  //           if (isInstalled) {
  //             ToastAndroid.show('Installation Complete', ToastAndroid.LONG);
  //             await RNFS.unlink(filePath); // Delete APK after installation
  //             console.log('APK file deleted');
  //           } else {
  //             ToastAndroid.show('Installation Failed', ToastAndroid.LONG);
  //             console.error('APK installation failed');
  //           }
  //         }, 5000);
  //       } else {
  //         ToastAndroid.show(
  //           'Error: Could not generate content URI',
  //           ToastAndroid.LONG,
  //         );
  //         console.error('Could not generate content URI');
  //       }

  //       ToastAndroid.show('Installation Started', ToastAndroid.LONG);
  //       console.log('APK Installation Triggered');

  //       // Now confirm if the installation is successful
  //       const isInstalled = await checkInstallationStatus(); // Implement this method as per your requirement

  //       if (isInstalled) {
  //         ToastAndroid.show('Installation Complete', ToastAndroid.LONG);
  //         // After confirming installation, delete the APK file
  //         await RNFS.unlink(filePath);
  //         console.log('APK file deleted');
  //       } else {
  //         ToastAndroid.show('Installation Failed', ToastAndroid.LONG);
  //         console.error('APK installation failed');
  //       }
  //     } else {
  //       console.error('APK file does not exist at the specified path');
  //     }
  //   } catch (error) {
  //     ToastAndroid.show(`Installation Failed \n\n${error}`, ToastAndroid.LONG);
  //     console.error('Installation failed:', error);
  //   } finally {
  //     setIsInstalling(false);
  //   }
  // };

  // const installApk = async filePath => {
  //   setIsInstalling(true);
  //   try {
  //     console.log('filePath:', filePath);
  //     const fileExists = await RNFS.exists(filePath);

  //     if (!fileExists) {
  //       throw new Error('APK file does not exist');
  //     }

  //     if (Platform.OS === 'android') {
  //       const {InstallApk} = NativeModules;
  //       // const {FileProvider} = NativeModules;

  //       // if (!FileProvider) {
  //       //   throw new Error('FileProvider native module not available');
  //       // }

  //       // const contentUri = await new Promise((resolve, reject) => {
  //       //   FileProvider.getUriForFile(filePath, (error, uri) => {
  //       //     if (error) reject(new Error(error));
  //       //     else resolve(uri);
  //       //   });
  //       // });

  //       // if (contentUri) {
  //       //   const apkIntent = `intent://#Intent;action=android.intent.action.INSTALL_PACKAGE;data=${encodeURIComponent(
  //       //     contentUri,
  //       //   )};type=application/vnd.android.package-archive;flags=1;end`;
  //       //   await Linking.openURL(apkIntent);
  //       //   ToastAndroid.show('Installation Started', ToastAndroid.LONG);
  //       //   console.log('APK Installation Triggered');
  //       // } else {
  //       //   throw new Error('Could not generate content URI');
  //       // }

  //       InstallApk.install(filePath);

  //       setTimeout(async () => {
  //         const isInstalled = await checkInstallationStatus();
  //         if (isInstalled) {
  //           ToastAndroid.show('Installation Complete', ToastAndroid.LONG);
  //           await RNFS.unlink(filePath);
  //           console.log('APK file deleted');
  //         } else {
  //           ToastAndroid.show('Installation Failed', ToastAndroid.LONG);
  //           console.error('APK installation failed');
  //         }
  //       }, 5000);
  //     }
  //   } catch (error) {
  //     console.error('Installation failed:', error);
  //     ToastAndroid.show(
  //       `Installation Failed: ${error.message}`,
  //       ToastAndroid.LONG,
  //     );
  //   } finally {
  //     setIsInstalling(false);
  //   }
  // };

  // const checkInstallationStatus = async () => {
  //   try {
  //     const packageName = 'com.insurancecompanyapp';

  //     const isInstalled = await DeviceInfo.hasAppInstalled(packageName);

  //     return isInstalled;
  //   } catch (error) {
  //     console.error('Error checking installation status:', error);
  //     return false; // Return false if there's an error
  //   }
  // };

  // const generateContentUri = async filePath => {
  //   try {
  //     // Generate content URI using FileProvider
  //     const contentUri = NativeModules.FileProvider.getUriForFile(filePath);
  //     return contentUri;
  //   } catch (error) {
  //     console.error('Error generating content URI:', error);
  //     return null;
  //   }
  // };

  // const checkInstallationStatus = async () => {
  //   try {
  //     const isInstalled = await AppInstalledChecker.isAppInstalled(
  //       'com.insurancecompanyapp',
  //     ); // Replace with your app's package name
  //     return isInstalled;
  //   } catch (error) {
  //     console.error('Error checking installation status:', error);
  //     return false;
  //   }
  // };

  // const checkPlayStoreVersion = async () => {
  //   try {
  //     // Get the latest version from the Play Store for your package
  //     const currentVersion = DeviceInfo.getVersion();
  //     console.log('Current Version playstore:', currentVersion);
  //     const storeVersion = await checkVersion({
  //       version: currentVersion, // app local version
  //       // iosStoreURL: 'ios app store url',
  //       androidStoreURL:
  //         'https://play.google.com/store/apps/details?id=com.insurancecompanyapp&hl=en',
  //       // country: 'bd',
  //     });
  //     console.log('Store Version playstore:', storeVersion);
  //     if (storeVersion.result === 'new') {
  //       Alert.alert(
  //         'New Update Available',
  //         'A new version is available on the Play Store.',
  //         [
  //           {
  //             text: 'Update Now',
  //             onPress: () =>
  //               Linking.openURL(
  //                 'https://play.google.com/store/apps/details?id=com.insurancecompanyapp&hl=en',
  //               ),
  //           },
  //           {text: 'Later', style: 'cancel'},
  //         ],
  //       );
  //     } else {
  //       Alert.alert('No New Update', 'You are using the latest version.');
  //     }
  //   } catch (error) {
  //     console.error('Error checking Play Store version:', error);
  //     Alert.alert('Error', 'Could not check the Play Store version.');
  //   }
  // };

  // useEffect(() => {
  //   checkAppVersion();
  // }, []);

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
