// package com.insurancecompanyapp;

// import android.net.Uri;
// import androidx.core.content.FileProvider;
// import com.facebook.react.bridge.NativeModule;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;
// import com.facebook.react.bridge.Promise;
// import java.io.File;

// public class FileProviderModule extends ReactContextBaseJavaModule {
// private static final String AUTHORITY =
// "com.insurancecompanyapp.fileprovider"; // Match AndroidManifest.xml

// public FileProviderModule(ReactApplicationContext reactContext) {
// super(reactContext);
// }

// @Override
// public String getName() {
// return "FileProvider";
// }

// @ReactMethod
// public void getUriForFile(String filePath, Promise promise) {
// try {
// File file = new File(filePath);
// Uri uri = FileProvider.getUriForFile(getReactApplicationContext(), AUTHORITY,
// file);
// promise.resolve(uri.toString());
// } catch (Exception e) {
// promise.reject("FILE_PROVIDER_ERROR", e.getMessage());
// }
// }
// }

// @Override
// protected List<ReactPackage> getPackages() {
// @SuppressWarnings("UnnecessaryLocalVariable")
// List<ReactPackage> packages = new PackageList(this).getPackages();
// packages.add(new FileProviderPackage()); // Add the package here
// return packages;
// }

// @Override
// protected List<ReactPackage> getPackages() {
// @SuppressWarnings("UnnecessaryLocalVariable")
// List<ReactPackage> packages = new PackageList(this).getPackages();
// // Packages that cannot be autolinked yet can be added manually here, for
// // example:
// // packages.add(new MyReactNativePackage());
// return packages;
// }

// @Override
// protected List<ReactPackage> getPackages() {
// List<ReactPackage> packages = new PackageList(this).getPackages();
// // Add custom module here
// packages.add(new ReactPackage() {
// @Override
// public List<NativeModule> createNativeModules(ReactApplicationContext
// reactContext) {
// List<NativeModule> modules = new ArrayList<>();
// // Ensure FileProviderModule is correctly implemented and imported
// modules.add(new FileProviderModule(reactContext)); // Replace with your
// custom module
// return modules;
// }

// @Override
// public List<ViewManager> createViewManagers(ReactApplicationContext
// reactContext) {
// return Collections.emptyList();
// }
// });
// return packages;
// }