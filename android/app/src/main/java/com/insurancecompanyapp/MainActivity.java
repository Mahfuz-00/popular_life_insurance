package com.insurancecompanyapp;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.util.Log;

public class MainActivity extends ReactActivity {
  private InstallApkModule installApkModule;

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "InsuranceCompanyApp"; // Matches your app's registered name
  }

  /**
   * Override onCreate to ensure proper initialization.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState); // Pass savedInstanceState, not null
  }

  /**
   * Returns the instance of the ReactActivityDelegate. We use
   * DefaultReactActivityDelegate
   * to enable Fabric and Concurrent React if opted-in via build settings.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // Fabric enabled flag
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // Concurrent root enabled flag
    ) {
      @Override
      protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Access ReactNativeHost directly from MainActivity
        ReactNativeHost host = MainActivity.this.getReactNativeHost();
        if (host != null && host.getReactInstanceManager() != null) {
          ReactApplicationContext context = (ReactApplicationContext) host.getReactInstanceManager()
              .getCurrentReactContext();
          if (context != null) {
            installApkModule = new InstallApkModule(context);
          }
        }
      }
    };
  }

  /**
   * Handle activity result to pass installation outcome to InstallApkModule.
   */
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    Log.i("MainActivity", "onActivityResult: requestCode=" + requestCode + ", resultCode=" + resultCode);
    if (installApkModule != null) {
      installApkModule.onActivityResult(requestCode, resultCode, data);
    } else {
      Log.i("MainActivity", "installApkModule is null");
    }
  }

  // No need to override getReactNativeHost since it's final and accessible via
  // ReactActivity
}