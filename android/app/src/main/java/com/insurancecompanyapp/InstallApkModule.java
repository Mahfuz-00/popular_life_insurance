package com.insurancecompanyapp;

import android.content.Intent;
import android.net.Uri;
import androidx.core.content.FileProvider;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import android.util.Log; // Use Android Log for Metro terminal logging
import java.io.File;

public class InstallApkModule extends ReactContextBaseJavaModule {
    private static final String FILE_PROVIDER_AUTHORITY = "com.insurancecompanyapp.fileprovider";
    private static final int INSTALL_REQUEST_CODE = 1234;
    private static final String TAG = "InstallApkModule"; // Log tag
    private Promise installPromise;

    public InstallApkModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "InstallApk";
    }

    @ReactMethod
    public void install(String filePath, Promise promise) {
        try {
            File file = new File(filePath);
            if (!file.exists()) {
                promise.reject("FILE_NOT_FOUND", "APK file does not exist at: " + filePath);
                Log.i(TAG, "APK file not found: " + filePath);
                return;
            }

            this.installPromise = promise;

            Uri apkUri = FileProvider.getUriForFile(
                    getReactApplicationContext(),
                    FILE_PROVIDER_AUTHORITY,
                    file);
            Log.i(TAG, "APK URI: " + apkUri.toString());

            Intent intent = new Intent(Intent.ACTION_INSTALL_PACKAGE);
            intent.setData(apkUri);
            intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra(Intent.EXTRA_RETURN_RESULT, true);

            if (getCurrentActivity() == null) {
                promise.reject("ACTIVITY_NOT_FOUND", "No current activity available");
                Log.i(TAG, "No current activity found");
                return;
            }

            Log.i(TAG, "Starting installation intent with requestCode: " + INSTALL_REQUEST_CODE);
            getCurrentActivity().startActivityForResult(intent, INSTALL_REQUEST_CODE);
            Log.i(TAG, "Intent launched, waiting for result");
        } catch (Exception e) {
            promise.reject("INSTALLATION_ERROR", "Failed to start installation: " + e.getMessage());
            Log.e(TAG, "Installation error: " + e.getMessage());
        }
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.i(TAG, "onActivityResult called with requestCode: " + requestCode + ", resultCode: " + resultCode);
        if (requestCode == INSTALL_REQUEST_CODE && this.installPromise != null) {
            if (resultCode == android.app.Activity.RESULT_OK) {
                this.installPromise.resolve("Installation successful");
                Log.i(TAG, "Installation successful");
            } else if (resultCode == android.app.Activity.RESULT_CANCELED) {
                this.installPromise.reject("INSTALLATION_CANCELED", "Installation was canceled by the user");
                Log.i(TAG, "Installation canceled");
            } else {
                this.installPromise.reject("INSTALLATION_FAILED",
                        "Installation failed with result code: " + resultCode);
                Log.i(TAG, "Installation failed with result code: " + resultCode);
            }
            this.installPromise = null;
        } else {
            Log.i(TAG, "No matching request code or promise is null");
        }
    }
}