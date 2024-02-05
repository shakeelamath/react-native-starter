import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Image, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';

const HomeScreen = () => {
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const data = [
    { id: '1', source: require('../../../assets/images/home/artist.png'), text: 'Steve Aoki', additionalText: 'Industri' },
    { id: '2', source: require('../../../assets/images/home/artist.png'), text: 'Obama', additionalText: 'White House' },
    { id: '3', source: require('../../../assets/images/home/artist.png'), text: 'Almaz', additionalText: 'Dehiwale' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.gridItem}>
      <Image source={item.source} style={styles.gridImage} />
      <Text style={styles.gridText}>{item.text}</Text>
      <Text style={styles.additionalText}>{item.additionalText}</Text>
    </View>
  );

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
  const rotateArrow = tabHeight.interpolate({
    inputRange: [300, 600],
    outputRange: ['0deg', '180deg'],
  });

  const tabStyle = {
    height: tabHeight,
  };
  const customMapStyle = [
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#000000"
        },
        {
          "lightness": 13
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#144b53"
        },
        {
          "lightness": 14
        },
        {
          "weight": 1.4
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#08304b"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0c4152"
        },
        {
          "lightness": 5
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {
          "color": "#146474"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#021019"
        }
      ]
    }
  ];
  return (
    <View style={styles.container}>
      {/* Google Map */}
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        
        provider="google"
        customMapStyle={customMapStyle}
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
        <TouchableOpacity style={styles.tabHeader} onPress={toggleTabHeight}>
        <Animated.Image
            source={require('../../../assets/images/icons/arrowupwhite.png')}
            style={[styles.arrowIcon, { transform: [{ rotate: rotateArrow }] }]}
          />
          <Text style={styles.tabHeaderText}>Events Near Me</Text>
        </TouchableOpacity>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
        />
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
    
    justifyContent: 'flex-end', 
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, 
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: 'gray',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: 'center',
  },
  tabHeader: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  tabHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', 
    marginTop: 5,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  gridItem: {
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop:10,
  },
  gridImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
    justifyContent: 'center',
  },
  gridText: {
    fontSize: 17,
    marginTop: 5,
    color: 'white',
    fontWeight: 'bold',
    textAlign:'left',
    alignSelf: 'flex-start', 
  },
  additionalText: {
    marginTop: 5,
    color: 'red',
    alignSelf: 'flex-start', 
    
    
    fontSize: 13, // Adjust the font size as needed
  },

});

export default HomeScreen;
