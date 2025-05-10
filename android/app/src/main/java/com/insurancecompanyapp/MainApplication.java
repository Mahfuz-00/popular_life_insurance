// package com.insurancecompanyapp;

// import android.app.Application;
// import android.os.Handler;
// import android.os.Looper;
// import android.widget.Toast;
// import com.facebook.react.PackageList;
// import com.facebook.react.ReactApplication;
// import com.facebook.react.ReactNativeHost;
// import com.facebook.react.ReactPackage;
// import com.facebook.react.bridge.NativeModule;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.uimanager.ViewManager;
// import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
// import com.facebook.react.defaults.DefaultReactNativeHost;
// import com.facebook.soloader.SoLoader;
// import java.io.File;
// import java.io.FileWriter;
// import java.io.IOException;
// import java.text.SimpleDateFormat;
// import java.util.ArrayList;
// import java.util.Collections;
// import java.util.Date;
// import java.util.Locale;
// import java.util.ArrayList;
// import java.util.List;

// public class MainApplication extends Application implements ReactApplication {
//   private final Handler mainHandler = new Handler(Looper.getMainLooper());

//   private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
//     @Override
//     public boolean getUseDeveloperSupport() {
//       return BuildConfig.DEBUG;
//     }

//     @Override
//     protected List<ReactPackage> getPackages() {
//       List<ReactPackage> packages = new PackageList(this).getPackages();
//       packages.add(new ReactPackage() {
//         @Override
//         public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
//           List<NativeModule> modules = new ArrayList<>();
//           modules.add(new InstallApkModule(reactContext));
//           mainHandler.post(
//               () -> Toast.makeText(reactContext, "MainApplication: InstallApkModule added", Toast.LENGTH_SHORT).show());
//           logToFile("MainApplication: InstallApkModule added");
//           return modules;
//         }

//         @Override
//         public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
//           return Collections.emptyList();
//         }
//       });
//       return packages;
//     }

//     @Override
//     protected String getJSMainModuleName() {
//       return "index";
//     }

//     @Override
//     protected boolean isNewArchEnabled() {
//       return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
//     }

//     @Override
//     protected Boolean isHermesEnabled() {
//       return BuildConfig.IS_HERMES_ENABLED;
//     }
//   };

//   @Override
//   public ReactNativeHost getReactNativeHost() {
//     return mReactNativeHost;
//   }

//   @Override
//   public void onCreate() {
//     super.onCreate();
//     SoLoader.init(this, false);
//     if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
//       DefaultNewArchitectureEntryPoint.load();
//     }
//     mainHandler.post(() -> Toast.makeText(this, "MainApplication onCreate completed", Toast.LENGTH_SHORT).show());
//     logToFile("MainApplication onCreate completed");
//   }

//   private void logToFile(String message) {
//     try {
//       File logFile = new File(getFilesDir(), "app_debug.log");
//       FileWriter writer = new FileWriter(logFile, true); // Append mode
//       String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(new Date());
//       writer.append(timestamp).append(" - ").append(message).append("\n");
//       writer.flush();
//       writer.close();
//     } catch (IOException e) {
//       try {
//         File logFile = new File(getFilesDir(), "app_debug.log");
//         FileWriter writer = new FileWriter(logFile, true);
//         String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(new Date());
//         writer.append(timestamp).append(" - ").append("Log failed").append("\n");
//         writer.flush();
//         writer.close();
//       } catch (IOException ignored) {
//         // Truly silent fail if second attempt fails
//       }
//     }
//   }
// }

// package com.insurancecompanyapp;

// // import com.insurancecompanyapp.InstallApkPackage;

// import android.app.Application;
// import com.facebook.react.PackageList;
// import com.facebook.react.ReactApplication;
// import com.facebook.react.ReactNativeHost;
// import com.facebook.react.ReactPackage;
// import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
// import com.facebook.react.defaults.DefaultReactNativeHost;
// import com.facebook.soloader.SoLoader;
// import java.util.List;

// public class MainApplication extends Application implements ReactApplication {

//   private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
//     @Override
//     public boolean getUseDeveloperSupport() {
//       return BuildConfig.DEBUG;
//     }

//     @Override
//     protected List<ReactPackage> getPackages() {
//       List<ReactPackage> packages = new PackageList(this).getPackages();
//       // No custom packages added
//       // packages.add(new InstallApkPackage());
//       return packages;
//     }

//     @Override
//     protected String getJSMainModuleName() {
//       return "index";
//     }

//     @Override
//     protected boolean isNewArchEnabled() {
//       return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
//     }

//     @Override
//     protected Boolean isHermesEnabled() {
//       return BuildConfig.IS_HERMES_ENABLED;
//     }
//   };

//   @Override
//   public ReactNativeHost getReactNativeHost() {
//     return mReactNativeHost;
//   }

//   @Override
//   public void onCreate() {
//     super.onCreate();
//     SoLoader.init(this, false);
//     if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
//       DefaultNewArchitectureEntryPoint.load();
//     }
//   }
// }

// <!-- <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES"/>
//     <!-- <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE"/> -->
//     <!-- <uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" /> -->
//     <!-- <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
//     <uses-permission android:name="android.permission.READ_MEDIA_VIDEO"/>
//     <uses-permission android:name="android.permission.READ_MEDIA_AUDIO"/> -->
//     <!-- <uses-feature android:name="android.hardware.type.pc" android:required="false"/> -->
//       <!-- android:requestLegacyExternalStorage="true" -->


// <!-- Add FileProvider -->
// <!-- <provider
//     android:name="androidx.core.content.FileProvider"
//     android:authorities="${applicationId}.fileprovider"
//     android:exported="false"
//     android:grantUriPermissions="true"
//     android:readPermission="android.permission.READ_EXTERNAL_STORAGE"
//     android:writePermission="android.permission.WRITE_EXTERNAL_STORAGE">
//     <meta-data
//         android:name="android.support.FILE_PROVIDER_PATHS"
//         android:resource="@xml/file_paths" />
// </provider> -->

// android:requestLegacyExternalStorage="true"

// <!-- <?xml version="1.0" encoding="utf-8"?>
// <paths>
//     <!-- External storage (e.g., Downloads folder) -->
//     <external-path name="download" path="Download/" />
//     <external-path name="external" path="." />
//     <!-- Internal app-specific storage -->
//     <files-path name="files" path="." />
//     <!-- External files directory (e.g., /sdcard/Android/data/com.insurancecompanyapp/files) -->
//     <external-files-path name="external_files" path="." />
//     <!-- <external-path name="external_files" path="."/> -->
//     <cache-path name="cache" path="."/>
//     <!-- <external-files-path name="external_files_root" path="."/> -->
//     <external-cache-path name="external_cache_root" path="."/>
//     <!-- <files-path name="internal_files" path="."/> -->
// </paths> -->



// <!-- <?xml version="1.0" encoding="utf-8"?>
// <paths>
//   <!-- Add this for Download directory access -->
//   <external-path 
//     name="download" 
//     path="." />
//   <!-- <root-path 
//     name="root" 
//     path="." /> -->
// </paths> -->


package com.insurancecompanyapp;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            List<ReactPackage> packages = new PackageList(this).getPackages();
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
            return BuildConfig.IS_HERMES_ENABLED;
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, false);
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            DefaultNewArchitectureEntryPoint.load();
        }
    }
}