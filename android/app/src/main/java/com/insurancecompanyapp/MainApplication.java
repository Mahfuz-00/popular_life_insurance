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
      // No custom packages added
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