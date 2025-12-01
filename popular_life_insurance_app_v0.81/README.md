# popular_life_insurance_app_v0.81

This is a scaffolded React Native 0.81 + TypeScript project to migrate the existing "Popular Life Insurance" app into RN 0.81.

Quick start (on macOS):

1. Install dependencies

```bash
cd popular_life_insurance_app_v0.81
npm install
# or: yarn install
```

2. iOS: install CocoaPods

```bash
cd ios
pod install
cd ..
```

3. Run Metro and the app

```bash
# start Metro
npm start
# in another terminal
npm run ios     # or npm run android
```

Notes & next steps
- This is a minimal skeleton. To complete the migration we should copy your existing `src/` files from the old project into `src/` here and then:
  - Convert JS files to TS/TSX incrementally (start with screens and components)
  - Update native iOS/Android config if needed
  - Run `pod install` after adding native iOS libs

- I can copy the `src/` content for you and perform an initial automated JS->TS rename plus small fixes, or I can provide a step-by-step migration plan. Which do you prefer?
