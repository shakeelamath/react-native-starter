import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Image, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ScrollView } from 'react-native-gesture-handler';
import BottomTabEvents from "./BottomTabEvents"
import BottomTabSingle from "./BottomTabSingle"
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



  const [tabHeight, setTabHeight] = useState(new Animated.Value(300));
  const [currentTab, setCurrentTab] = useState('events');
  const [markerTitle, setMarkerTitle] = useState('');

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
  const handleMarkerPress = (title) => {
    setCurrentTab('single');
    setMarkerTitle(title);
    toggleTabHeight(); // Optionally close the tab when switching to BottomTabSingle
  };
  const Arrow = () => (
    <Animated.Image
      source={require('../../../assets/images/icons/arrowupwhite.png')}
      style={[styles.arrowIcon, { transform: [{ rotate: rotateArrow }] }]}
    />
  );
  
  const Heading = () => (
    <Text style={styles.tabHeaderText}>
      {currentTab === 'events' ? 'Events Happening Near You' : markerTitle}
    </Text>
  );
  
  const renderTabHeader = () => {
    return (
      <TouchableOpacity style={styles.tabHeader} onPress={toggleTabHeight}>
        <Arrow />
        <Heading />
      </TouchableOpacity>
    );
  };

  const handleContainerPress = () => {
    // Reset the current tab to 'events' when the container is pressed
    setCurrentTab('events');
    
  };
 
  
  return (
    <View style={styles.container} onTouchStart={handleContainerPress}>
      {/* Google Map */}
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider="google"
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
        <Marker
  coordinate={initialRegion}
  title="Love Bar"  // Updated marker title to "Love Bar"
  description="Marker Description"
  onPress={() => handleMarkerPress("Love Bar")}  // Updated handleMarkerPress function with the new title
/>

      </MapView>

     {/* Animated Bottom Tab */}
     <Animated.View style={[styles.bottomTab, tabStyle]}>
        {renderTabHeader()}

        {/* Conditionally render BottomTabEvents or BottomTabSingle based on the currentTab state */}
        {currentTab === 'events' ? (
          <BottomTabEvents data={data} />
        ) : (
          <BottomTabSingle markerTitle={markerTitle} />
        )}

        {/* Add your tab content here */}
        <ScrollView style={styles.scrollView}>
        <View style={styles.tabContent}>
        <Text style={styles.tabContentHeading}>Upcoming Events</Text>
    <Image source={require('../../../assets/images/genre.png')} style={styles.additionalImage} />
    <Image source={require('../../../assets/images/genre.png')} style={styles.additionalImage} />
    <Image source={require('../../../assets/images/genre.png')} style={styles.additionalImage} />
    <Text style={styles.cantFindText}>Can't find what you're looking for?{'\n'}<Text style={styles.exploreMoreText}>Explore More</Text></Text>
    
    </View>
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
  viewflat:{
height:180,
  },
  tabContent: {
    marginTop:0,
    padding: 0,
    paddingTop:0,
    alignItems: 'center',
    marginBottom: 0,
    paddingLeft:25,
   
  },
  tabContentHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  cantFindText:{
    color: 'white',
    marginBottom: 20,
    marginTop:-10,
    textAlign:'center',
    padding:20,
  },
  exploreMoreText:{
    color:'red',
    alignItems: 'center',
    textAlign:'center',

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
    borderTopWidth: 0,
    borderTopColor: 'gray',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
   
    
  },
 
  tabHeader: {
    flexDirection: 'column',
     // Keep center alignment
    padding: 10,
  },
  
  tabHeaderTextContainer: {
    alignSelf: 'flex-start', 
    marginLeft:-70, // Align the text to the left
  },
  
  tabHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
    alignSelf: 'flex-start', 
    marginLeft:20, // Adjust margin if needed
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center', 
    marginLeft:180,
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
    marginBottom:0,
    
    fontSize: 13,
     // Adjust the font size as needed
  },
  additionalImage: {
   
    marginBottom:25,
    marginRight:20,
    alignSelf: 'flex-start', 
  },
  flatList: {
   
    zIndex:1,
    overflow:'hidden',
  },

  

});

export default HomeScreen;
