# Fixing "Could not connect to development server" on Android

This guide helps resolve the React Native Metro bundler connection issues on Android devices and emulators.

## What was fixed

The app has been configured to allow HTTP (cleartext) traffic to the Metro development server. Android 9+ (API 28+) blocks cleartext HTTP traffic by default for security, but the Metro bundler requires HTTP during development.

### Changes made:

1. **Network Security Configuration** (`android/app/src/main/res/xml/network_security_config.xml`)
   - Allows cleartext traffic to localhost and emulator IPs (10.0.2.2, 10.0.3.2)
   - Only affects development, not production builds

2. **AndroidManifest.xml** 
   - Added `android:usesCleartextTraffic="true"` for development
   - Added reference to network security config

## Setup Instructions

### For Android Emulator:

1. **Start the Metro bundler:**
   ```bash
   yarn start
   # or
   npm start
   ```

2. **In a new terminal, run the Android app:**
   ```bash
   yarn android
   # or
   npm run android
   ```

3. **If still having issues, try clearing cache:**
   ```bash
   yarn start --reset-cache
   ```

### For Physical Android Device (USB):

1. **Connect your device via USB** and ensure USB debugging is enabled

2. **Set up ADB reverse** (this forwards the device's port 8081 to your computer's port 8081):
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

3. **Start Metro bundler:**
   ```bash
   yarn start
   ```

4. **Run the app:**
   ```bash
   yarn android
   ```

### For Physical Android Device (WiFi):

1. **Ensure both your computer and device are on the same WiFi network**

2. **Find your computer's IP address:**
   - On Mac/Linux: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - On Windows: `ipconfig` (look for IPv4 Address)

3. **Start Metro bundler:**
   ```bash
   yarn start
   ```

4. **Run the app:**
   ```bash
   yarn android
   ```

5. **Open React Native Dev Menu** (shake device or `adb shell input keyevent 82`)

6. **Go to Settings → Debug server host & port**

7. **Enter your computer's IP and port** (e.g., `192.168.1.100:8081`)

8. **Reload the app**

## Troubleshooting

### Port 8081 is already in use

Find and kill the process using port 8081:

**Mac/Linux:**
```bash
lsof -ti:8081 | xargs kill -9
```

**Windows:**
```bash
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### Clean build if issues persist

```bash
cd android
./gradlew clean
cd ..
yarn android
```

### Reset Metro cache

```bash
yarn start --reset-cache
```

### Rebuild the app

```bash
cd android
./gradlew clean
cd ..
yarn android
```

## Why This Fix Works

- **Android Security:** Android 9+ blocks HTTP traffic by default to protect users
- **Development Need:** Metro bundler uses HTTP (not HTTPS) for hot reloading
- **Solution:** Network security config allows HTTP only for localhost and emulator IPs
- **Production:** This config doesn't affect production builds - it only allows local development connections

## Common Error Messages

If you see any of these, the fix should resolve them:
- "Could not connect to development server"
- "Unable to load script. Make sure you're either running a Metro server..."
- "Network request failed"
- Connection refused errors on port 8081

## IP Addresses Explained

- **10.0.2.2** - Default IP for Android Emulator to reach host machine
- **10.0.3.2** - Alternative IP for some Android Emulator configurations  
- **localhost** - Standard loopback address
- **Your WiFi IP** - Used when connecting physical device over WiFi

## Additional Resources

- [React Native Documentation - Running on Device](https://reactnative.dev/docs/running-on-device)
- [Android Network Security Config](https://developer.android.com/training/articles/security-config)
