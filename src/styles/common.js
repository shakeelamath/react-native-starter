import { StyleSheet, StatusBar, Platform } from 'react-native';

import colors from './colors';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: Platform.select({ ios: 0, android: StatusBar.currentHeight }),
  },
});
