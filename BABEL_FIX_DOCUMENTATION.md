# React Native Reanimated Babel Plugin Error Fix

## Problem
The application was experiencing a build error:
```
error: node_modules\react-native-reanimated\src\reanimated2\threads.ts: [Reanimated] Babel plugin exception: Error: Unknown node type: "TSInstantiationExpression"
```

## Root Cause
- **TypeScript 5.0.4** uses `TSInstantiationExpression` syntax (added in TypeScript 4.7)
- **Babel 7.20.0** didn't have parser support for this TypeScript feature
- **react-native-reanimated 1.13.4** was incompatible with React Native 0.73.1
- The Reanimated Babel plugin couldn't parse modern TypeScript syntax

## Solution

### 1. Upgraded Babel Core (7.20.0 → 7.28.6)
- Babel 7.23.0+ includes full support for TypeScript 5.0 features including `TSInstantiationExpression`
- NPM resolved to 7.28.6 (latest compatible version)
- This allows the parser to understand explicit type arguments syntax like `func<T>()`

### 2. Upgraded react-native-reanimated (1.13.4 → 3.6.3)
- Version 3.6.3 is the recommended version for React Native 0.73.x
- Includes updated Babel plugin compatible with modern TypeScript
- Uses new JSI auto-linking (no manual setup required)

### 3. Simplified Babel Configuration
Updated babel.config.js to use only the essential plugins:
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // Must be last!
};
```

**Important:** `react-native-reanimated/plugin` MUST be the last plugin in the array. The `@react-native/babel-preset` already includes all necessary TypeScript and modern JavaScript transforms, so additional plugins are not needed.

### 4. Added Missing Dependencies
- `@gorhom/bottom-sheet@^4.4.0` - Swipeable bottom sheet component
- `@react-navigation/native-stack@^6.9.26` - Native stack navigator
- `deprecated-react-native-prop-types@^4.1.0` - ViewPropTypes compatibility
- `patch-package@^8.0.0` - For applying custom patches to node_modules

### 5. Fixed Dependency Conflicts
- Removed `@react-native-community/cli` (peer dependency conflict with RN 0.73)
- Switched from yarn to npm for package management
- Added `postinstall-postinstall` to ensure patches apply correctly after yarn/npm installs

## Verification Steps

1. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start Metro Bundler**
   ```bash
   npx react-native start --reset-cache
   ```
   ✅ Should start without errors

3. **Build Android App**
   ```bash
   npx react-native run-android
   ```

## Compatibility Matrix

| Package | Version | Resolved | Reason |
|---------|---------|----------|--------|
| react-native | 0.73.1 | - | Current version |
| react-native-reanimated | ~3.6.3 | 3.6.3 | Compatible with RN 0.73.x |
| @babel/core | ^7.23.0 | 7.28.6 | Supports TypeScript 5.0 |
| TypeScript | 5.0.4 | - | Modern syntax support |
| @gorhom/bottom-sheet | ^4.4.0 | - | Reanimated 3.x compatible |

## Common Issues & Solutions

### Issue: "Unknown node type: TSInstantiationExpression"
**Solution:** Upgrade Babel to 7.23.0 or newer

### Issue: Peer dependency conflicts
**Solution:** Use `npm install --legacy-peer-deps`

### Issue: Metro bundler cache issues
**Solution:** Run `npx react-native start --reset-cache`

### Issue: Old Reanimated JSI registration error
**Solution:** Remove manual JSI setup from MainApplication - Reanimated 3.x auto-links

## Development Workflow

### Terminal 1 - Metro Bundler
```bash
npx react-native start --reset-cache
```

### Terminal 2 - Android Build
```bash
npx react-native run-android --no-packager
```

### Troubleshooting Commands
```bash
# Connect emulator to Metro
adb reverse tcp:8081 tcp:8081

# Force stop app
adb shell am force-stop com.company.syncup

# Clean build (if needed)
cd android && ./gradlew clean && cd ..
```

## References
- [Reanimated 3.6.3 Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [Babel TypeScript Support](https://babeljs.io/docs/en/babel-preset-typescript)
- [React Native 0.73 Release Notes](https://github.com/facebook/react-native/releases/tag/v0.73.0)
