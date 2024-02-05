// CustomHeader.js

import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomHeader = () => {
  return (
    <View style={styles.headerBackground} />
  );
};

const styles = StyleSheet.create({
  headerBackground: {
   width:200,
    backgroundColor: '#1a1a1a',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    flex: 1,
    zIndex: 2,
  },
});

export default CustomHeader;
