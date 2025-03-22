package com.insurancecompanyapp;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import com.insurancecompanyapp.InstallApkModule;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // packages.add(new RNFSPackage()); // Uncomment if using react-native-fs
      packages.add(new ReactPackage() {
        @Override
        public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
          List<NativeModule> modules = new ArrayList<>();
          modules.add(new InstallApkModule(reactContext)); // Register InstallApkModule
          return modules;
        }

        @Override
        public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
          return Collections.emptyList();
        }
      });
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
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for
      // this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    // ReactNativeFlipper.initializeFlipper(this,
    // getReactNativeHost().getReactInstanceManager());
  }
}
