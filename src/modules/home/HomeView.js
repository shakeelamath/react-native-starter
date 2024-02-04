import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';

const HomeScreen = () => {
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [tabHeight, setTabHeight] = useState(new Animated.Value(300));

  const toggleTabHeight = () => {
    const newHeight = tabHeight._value === 300 ? 600 : 300;
    Animated.timing(tabHeight, {
      toValue: newHeight,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const tabStyle = {
    height: tabHeight,
  };

  return (
    <View style={styles.container}>
      {/* Google Map */}
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider="google"
        customMapStyle={[]}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        toolbarEnabled={true}
        zoomControlEnabled={true}
        rotateEnabled={true}
        mapType="standard"
        onMapReady={() => {}}
      >
        {/* Marker for the initial location */}
        <Marker coordinate={initialRegion} title="Marker Title" description="Marker Description" />
      </MapView>

      {/* Animated Bottom Tab */}
      <Animated.View style={[styles.bottomTab, tabStyle]}>
        <TouchableOpacity onPress={toggleTabHeight}>
          <Text>Events Near Me</Text>
        </TouchableOpacity>
        {/* Add your tab content here */}
        <ScrollView>
          {/* Your tab content goes here */}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
});

export default HomeScreen;
