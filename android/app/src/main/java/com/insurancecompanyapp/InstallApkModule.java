// package com.insurancecompanyapp;

// import android.content.Intent;
// import android.net.Uri;
// import android.os.Handler;
// import android.os.Looper;
// import android.widget.Toast;
// import androidx.core.content.FileProvider;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;
// import com.facebook.react.bridge.Promise;
// import java.io.File;
// import java.io.FileWriter;
// import java.io.IOException;
// import java.text.SimpleDateFormat;
// import java.util.Date;
// import java.util.Locale;
// import java.util.ArrayList;
// import java.util.List;

// public class InstallApkModule extends ReactContextBaseJavaModule {
// private static final String FILE_PROVIDER_AUTHORITY =
// "com.insurancecompanyapp.fileprovider";
// private static final int INSTALL_REQUEST_CODE = 1234;
// private Promise installPromise;
// private final Handler mainHandler;

// public InstallApkModule(ReactApplicationContext context) {
// super(context);
// mainHandler = new Handler(Looper.getMainLooper());
// mainHandler.post(() -> Toast.makeText(context, "InstallApkModule
// initialized", Toast.LENGTH_SHORT).show());
// logToFile("InstallApkModule initialized");
// }

// @Override
// public String getName() {
// return "InstallApk";
// }

// private void logToFile(String message) {
// try {
// File logFile = new File(getReactApplicationContext().getFilesDir(),
// "app_debug.log");
// FileWriter writer = new FileWriter(logFile, true); // Append mode
// String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",
// Locale.US).format(new Date());
// writer.append(timestamp).append(" - ").append(message).append("\n");
// writer.flush();
// writer.close();
// } catch (IOException e) {
// try {
// File logFile = new File(getReactApplicationContext().getFilesDir(),
// "app_debug.log");
// FileWriter writer = new FileWriter(logFile, true);
// String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",
// Locale.US).format(new Date());
// writer.append(timestamp).append(" - ").append("Log failed").append("\n");
// writer.flush();
// writer.close();
// } catch (IOException ignored) {
// // Truly silent fail if second attempt fails
// }
// }
// }

// @ReactMethod
// public void install(String filePath, Promise promise) {
// try {
// mainHandler.post(() -> Toast
// .makeText(getReactApplicationContext(), "Install method called",
// Toast.LENGTH_SHORT).show());
// logToFile("Install method called");
// File file = new File(filePath);
// if (!file.exists()) {
// promise.reject("FILE_NOT_FOUND", "APK file does not exist at: " + filePath);
// mainHandler.post(() -> Toast
// .makeText(getReactApplicationContext(), "APK file not found: " + filePath,
// Toast.LENGTH_SHORT)
// .show());
// logToFile("APK file not found: " + filePath);
// return;
// }

// this.installPromise = promise;

// Uri apkUri = FileProvider.getUriForFile(
// getReactApplicationContext(),
// FILE_PROVIDER_AUTHORITY,
// file);
// mainHandler.post(() -> Toast
// .makeText(getReactApplicationContext(), "APK URI: " + apkUri.toString(),
// Toast.LENGTH_SHORT)
// .show());
// logToFile("APK URI: " + apkUri.toString());

// Intent intent = new Intent(Intent.ACTION_INSTALL_PACKAGE);
// intent.setData(apkUri);
// intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION |
// Intent.FLAG_ACTIVITY_NEW_TASK);
// intent.putExtra(Intent.EXTRA_RETURN_RESULT, true);
// intent.putExtra(Intent.EXTRA_NOT_UNKNOWN_SOURCE, true);

// if (getCurrentActivity() == null) {
// promise.reject("ACTIVITY_NOT_FOUND", "No current activity available");
// mainHandler.post(() -> Toast
// .makeText(getReactApplicationContext(), "No current activity found",
// Toast.LENGTH_SHORT)
// .show());
// logToFile("No current activity found");
// return;
// }

// mainHandler.post(() -> Toast.makeText(getReactApplicationContext(),
// "Starting installation intent with requestCode: " + INSTALL_REQUEST_CODE,
// Toast.LENGTH_SHORT)
// .show());
// logToFile("Starting installation intent with requestCode: " +
// INSTALL_REQUEST_CODE);
// getCurrentActivity().startActivityForResult(intent, INSTALL_REQUEST_CODE);
// mainHandler.post(() -> Toast
// .makeText(getReactApplicationContext(), "Intent launched, waiting for
// result", Toast.LENGTH_SHORT)
// .show());
// logToFile("Intent launched, waiting for result");
// } catch (Exception e) {
// promise.reject("INSTALLATION_ERROR", "Failed to start installation: " +
// e.getMessage());
// mainHandler.post(() -> Toast
// .makeText(getReactApplicationContext(), "Installation error: " +
// e.getMessage(), Toast.LENGTH_LONG)
// .show());
// logToFile("Installation error: " + e.getMessage());
// }
// }

// public void onActivityResult(int requestCode, int resultCode, Intent data) {
// mainHandler.post(() -> Toast.makeText(getReactApplicationContext(),
// "onActivityResult called with requestCode: " + requestCode + ", resultCode: "
// + resultCode,
// Toast.LENGTH_SHORT).show());
// logToFile("onActivityResult called with requestCode: " + requestCode + ",
// resultCode: " + resultCode);
// if (requestCode == INSTALL_REQUEST_CODE && this.installPromise != null) {
// if (resultCode == android.app.Activity.RESULT_OK) {
// this.installPromise.resolve("Installation successful");
// mainHandler.post(() -> Toast
// .makeText(getReactApplicationContext(), "Installation successful",
// Toast.LENGTH_SHORT).show());
// logToFile("Installation successful");
// } else if (resultCode == android.app.Activity.RESULT_CANCELED) {
// this.installPromise.reject("INSTALLATION_CANCELED", "Installation was
// canceled by the user");
// mainHandler.post(() -> Toast
// .makeText(getReactApplicationContext(), "Installation canceled",
// Toast.LENGTH_SHORT).show());
// logToFile("Installation canceled");
// } else {
// this.installPromise.reject("INSTALLATION_FAILED",
// "Installation failed with result code: " + resultCode);
// mainHandler
// .post(() -> Toast
// .makeText(getReactApplicationContext(),
// "Installation failed with result code: " + resultCode, Toast.LENGTH_SHORT)
// .show());
// logToFile("Installation failed with result code: " + resultCode);
// }
// this.installPromise = null;
// } else {
// mainHandler.post(() -> Toast.makeText(getReactApplicationContext(),
// "No matching request code or promise is null", Toast.LENGTH_SHORT).show());
// logToFile("No matching request code or promise is null");
// }
// }
// }

// package com.insurancecompanyapp;

// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;
// import android.widget.Toast;

// public class InstallApkModule extends ReactContextBaseJavaModule {
//     public InstallApkModule(ReactApplicationContext reactContext) {
//         super(reactContext);
//     }

//     @Override
//     public String getName() {
//         return "RNApkInstaller";
//     }

//     @ReactMethod
//     public void install(String filePath) {
//         MainActivity activity = (MainActivity) getCurrentActivity();
//         if (activity != null) {
//             activity.startInstallation(filePath);
//         } else {
//             Toast.makeText(getReactApplicationContext(), "Activity not available", Toast.LENGTH_LONG).show();
//         }
//     }
// }