// package com.insurancecompanyapp;

// import android.content.Intent;
// import android.os.Bundle;
// import android.os.Handler;
// import android.os.Looper;
// import android.widget.Toast;
// import com.facebook.react.ReactActivity;
// import com.facebook.react.ReactActivityDelegate;
// import com.facebook.react.ReactNativeHost;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
// import com.facebook.react.defaults.DefaultReactActivityDelegate;
// import java.io.File;
// import java.io.FileWriter;
// import java.io.IOException;
// import java.text.SimpleDateFormat;
// import java.util.Date;
// import java.util.Locale;
// import java.util.ArrayList;
// import java.util.List;

// public class MainActivity extends ReactActivity {
//   private InstallApkModule installApkModule;
//   private Handler mainHandler;

//   @Override
//   protected String getMainComponentName() {
//     return "InsuranceCompanyApp";
//   }

//   @Override
//   protected void onCreate(Bundle savedInstanceState) {
//     super.onCreate(savedInstanceState);
//     mainHandler = new Handler(Looper.getMainLooper());
//     mainHandler.post(() -> Toast.makeText(this, "MainActivity onCreate called", Toast.LENGTH_SHORT).show());
//     logToFile("MainActivity onCreate called");
//   }

//   @Override
//   protected ReactActivityDelegate createReactActivityDelegate() {
//     return new DefaultReactActivityDelegate(
//         this,
//         getMainComponentName(),
//         DefaultNewArchitectureEntryPoint.getFabricEnabled(),
//         DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled()) {
//       @Override
//       protected void onCreate(Bundle savedInstanceState) {
//         super.onCreate(savedInstanceState);
//         ReactNativeHost host = MainActivity.this.getReactNativeHost();
//         if (host != null && host.getReactInstanceManager() != null) {
//           ReactApplicationContext context = (ReactApplicationContext) host.getReactInstanceManager()
//               .getCurrentReactContext();
//           if (context != null) {
//             installApkModule = new InstallApkModule(context);
//             mainHandler.post(() -> Toast
//                 .makeText(getContext(), "MainActivity: InstallApkModule initialized", Toast.LENGTH_SHORT).show());
//             logToFile("MainActivity: InstallApkModule initialized");
//           }
//         }
//       }
//     };
//   }

//   @Override
//   public void onActivityResult(int requestCode, int resultCode, Intent data) {
//     super.onActivityResult(requestCode, resultCode, data);
//     mainHandler.post(() -> Toast
//         .makeText(this, "MainActivity onActivityResult: " + requestCode + ", " + resultCode, Toast.LENGTH_SHORT)
//         .show());
//     logToFile("MainActivity onActivityResult: " + requestCode + ", " + resultCode);
//     if (installApkModule != null) {
//       installApkModule.onActivityResult(requestCode, resultCode, data);
//     } else {
//       mainHandler.post(() -> Toast.makeText(this, "MainActivity: installApkModule is null", Toast.LENGTH_SHORT).show());
//       logToFile("MainActivity: installApkModule is null");
//     }
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

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "InsuranceCompanyApp";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        DefaultNewArchitectureEntryPoint.getFabricEnabled(),
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled());
  }
}