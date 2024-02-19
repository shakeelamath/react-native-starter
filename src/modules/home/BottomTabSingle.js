import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Image, FlatList, ScrollView } from 'react-native';

const BottomTab = ({ data, selectedMarker }) => {
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

  const renderItem = ({ item }) => (
    <View style={styles.gridItem}>
      <Image source={item.source} style={styles.gridImage} />
      <Text style={styles.gridText}>{item.text}</Text>
      <Text style={styles.additionalText}>{item.additionalText}</Text>
    </View>
  );
  const renderCustomContent = () => (
    <View style={styles.customContentContainer}>
      <Image source={require('../../../assets/images/singletabevent.png')} style={styles.customImage} />
      <Text style={styles.titleAboveButton}>Ladies Night</Text>
      <TouchableOpacity style={styles.customButton} onPress={() => console.log('Button Pressed')}>
        <Text style={styles.buttonText}>See More</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.bottomTabContainer}>
      {/* Animated Bottom Tab */}
      <Animated.View style={[styles.bottomTab, tabStyle]}>
        <TouchableOpacity style={styles.tabHeader} onPress={toggleTabHeight}>
          <Animated.Image
            source={require('../../../assets/images/icons/arrowupwhite.png')}
            style={[styles.arrowIcon, { transform: [{ rotate: rotateArrow }] }]}
          />
          <Text style={styles.tabHeaderText}>{selectedMarker ? selectedMarker.title : 'The Love Bar'}</Text>
        </TouchableOpacity>
        <View style={styles.viewflat}>
        {renderCustomContent()}
        </View>
        {/* Add your tab content here */}
        
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
   
    bottomTabContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex:4,
      },
    viewflat:{
  height:180,
  width:380,
    },
    titleAboveButton: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        zIndex: 3, // Higher zIndex for the title
      },
    customContentContainer: {
        marginTop: 5,
        marginBottom: 15,
        position: 'relative',
      },
      customImage: {
        width: "100%",
        height: "100%",
        borderRadius: 5,
        zIndex: 1,
      },
      customButton: {
        position: 'absolute',
        bottom: 40,
        left: 130,
        right: 140,
        backgroundColor: 'red', // Set your desired button background color
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width:130,
        borderRadius:20,
        zIndex:2,
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
      },
    tabContent: {
      marginTop:0,
      padding: 0,
      paddingTop:0,
      alignItems: 'center',
      marginBottom: 0,
      alignSelf: 'flex-start',
    },
    tabContentHeading: {
      fontSize: 22,
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
      alignItems: 'center',
      
    },
    tabHeader: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    tabHeaderText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'white', 
      marginTop: 5,
      alignSelf: 'flex-start',
      
      marginEnd:290,
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
      
      resizeMode: 'cover',
      borderRadius: 5,
      justifyContent: 'center',
    },
    gridText: {
      fontSize: 15,
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
      
      fontSize: 11,
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
export default BottomTab;
