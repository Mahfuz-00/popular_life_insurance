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

// package com.insurancecompanyapp;

// import android.os.Bundle;
// import com.facebook.react.ReactActivity;
// import com.facebook.react.ReactActivityDelegate;
// import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
// import com.facebook.react.defaults.DefaultReactActivityDelegate;

// public class MainActivity extends ReactActivity {

//   @Override
//   protected String getMainComponentName() {
//     return "InsuranceCompanyApp";
//   }

//   @Override
//   protected void onCreate(Bundle savedInstanceState) {
//     super.onCreate(savedInstanceState);
//   }

//   @Override
//   protected ReactActivityDelegate createReactActivityDelegate() {
//     return new DefaultReactActivityDelegate(
//         this,
//         getMainComponentName(),
//         DefaultNewArchitectureEntryPoint.getFabricEnabled(),
//         DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled());
//   }
// }

package com.insurancecompanyapp;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import androidx.core.content.FileProvider;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import java.io.File;

public class MainActivity extends ReactActivity {
  private static final int REQUEST_CODE_ENABLE_INSTALL = 100;
  private String apkPath = "/path/to/your/app.apk"; // Update with actual APK path

  @Override
  protected String getMainComponentName() {
    return "InsuranceCompanyApp"; // Replace with your app's main component name
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  // Method to trigger APK installation (call this from JavaScript via a native
  // module)
  public void startInstallation(String path) {
    apkPath = path;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      if (!getPackageManager().canRequestPackageInstalls()) {
        Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
        intent.setData(Uri.parse("package:" + getPackageName()));
        startActivityForResult(intent, REQUEST_CODE_ENABLE_INSTALL);
        return;
      }
    }
    installApk(apkPath);
  }

  private void installApk(String apkPath) {
    File apkFile = new File(apkPath);
    Uri apkUri = FileProvider.getUriForFile(this, "com.insurancecompanyapp.fileprovider", apkFile);
    Intent intent = new Intent(Intent.ACTION_VIEW);
    intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
    intent.putExtra(Intent.EXTRA_ALLOW_REPLACE, true);
    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    startActivity(intent);
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == REQUEST_CODE_ENABLE_INSTALL) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        if (getPackageManager().canRequestPackageInstalls()) {
          installApk(apkPath);
        } else {
          // Handle permission denial (e.g., show a message to the user)
        }
      }
    }
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