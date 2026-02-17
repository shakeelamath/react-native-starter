import React from 'react';
import { View, StyleSheet } from 'react-native';

// Conditional require so app doesn't crash if react-native-linear-gradient is not installed
let LinearGradient = null;
try {
  // eslint-disable-next-line global-require
  LinearGradient = require('react-native-linear-gradient').default;
} catch (e) {
  LinearGradient = null;
}

const GRADIENT_COLORS = ['#121212', '#7f0d0d']; // dark grey -> deep red

export default function GradientBackground({ children, style, pointerEvents }) {
  if (LinearGradient) {
    return (
      <LinearGradient colors={GRADIENT_COLORS} style={[styles.container, style]} pointerEvents={pointerEvents}>
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.fallback, style]} pointerEvents={pointerEvents}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    backgroundColor: GRADIENT_COLORS[0],
  },
});
