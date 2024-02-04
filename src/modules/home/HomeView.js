import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen() {
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {/* Google Map */}
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        AIzaSyCCf_z6b4SXKfHRagYhC4GHUX2SWzX7M8s
        provider="google" // Add this line for using Google Maps
        customMapStyle={[]}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        toolbarEnabled={true}
        zoomControlEnabled={true}
        rotateEnabled={true}
        // Replace "YOUR_API_KEY" with your actual API key
        mapType="standard"
        //customMapStyle={[]}
        onMapReady={() => {}} // Optional: Add any additional props or event handlers
      >
        {/* Marker for the initial location */}
        <Marker coordinate={initialRegion} title="Marker Title" description="Marker Description" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
