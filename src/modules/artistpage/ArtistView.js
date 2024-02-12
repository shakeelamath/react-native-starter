import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, FlatList, ImageBackground } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import * as Animatable from 'react-native-animatable';
import DropDownPicker from 'react-native-dropdown-picker';
import Reviews from './reviews'; 
export default function ArtistScreen() {
  const artistProfileImageUrl = 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/ArtistImage.png?alt=media&token=4a0fcfd4-4194-485a-9bad-7eca3cd57d1a';

  const [rating, setRating] = useState(0);
  const [animateStars, setAnimateStars] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Events');
  const eventImages = [
    { image: 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/eventbg.png?alt=media&token=24f446fc-672c-4ce7-ad88-e6c89c723cad', title: 'Love Bar',date: '2024-03-15' },
    { image: 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/eventbg.png?alt=media&token=24f446fc-672c-4ce7-ad88-e6c89c723cad', title: 'Industri',date: '2024-03-16'  },
    { image: 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/eventbg.png?alt=media&token=24f446fc-672c-4ce7-ad88-e6c89c723cad', title: 'RnB',date: '2024-03-17'  },
    { image: 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/eventbg.png?alt=media&token=24f446fc-672c-4ce7-ad88-e6c89c723cad', title: 'Sunset Blu',date: '2024-03-18'  },


    // Add more objects with different image URLs and titles
  ];

  const photoImages = [
    { image: 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/artistphoto.png?alt=media&token=65dd47de-12ad-4071-b5d0-cb920934bfea', name: 'Photo 1' },
    { image: 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/artistphoto.png?alt=media&token=65dd47de-12ad-4071-b5d0-cb920934bfea', name: 'Photo 2' },
    { image: 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/artistphoto.png?alt=media&token=65dd47de-12ad-4071-b5d0-cb920934bfea', name: 'Photo 3' },
    { image: 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/artistphoto.png?alt=media&token=65dd47de-12ad-4071-b5d0-cb920934bfea', name: 'Photo 4' },
        { image: 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/artistphoto.png?alt=media&token=65dd47de-12ad-4071-b5d0-cb920934bfea', name: 'Photo 3' },
    { image: 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/artistphoto.png?alt=media&token=65dd47de-12ad-4071-b5d0-cb920934bfea', name: 'Photo 4' },
    // Add more objects with different image URLs and names
  ];
  useEffect(() => {
    setAnimateStars(true);
  }, []);



  const sections = ['Events', 'Photos', 'Reviews'];

  return (
    <View style={styles.container}>
      {/* Artist's Profile Picture */}
      <Image style={styles.profileImage} source={{ uri: artistProfileImageUrl }} />

      {/* Grey bar */}
      <View style={styles.greyBar} />

      {/* Ratings and Events section */}
      <View style={styles.statsContainer}>
        {/* Ratings */}
        <View style={styles.statItem}>
        <Text style={styles.statValue}>9.5</Text>
          <Text style={styles.statTitle}>Ratings</Text>
        </View>

        {/* Events Performed */}
        <View style={styles.statItem}>
        <Text style={styles.statValue}>25</Text>
          <Text style={styles.statTitle}>Events Performed</Text>
        </View>
      </View>

      {/* 5-Star Rating System with Animation */}
     

      {/* Blackish transparent background for text */}
      <View style={styles.textContainer}>
        {/* Artist's Name */}
        <Text style={styles.artistName}>Lunatics</Text>

        {/* Artist's Position */}
        <Text style={styles.artistPosition}>DJ</Text>
      </View>

      {/* Sections */}
      <View style={styles.sectionsContainer}>
        {sections.map((section, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.sectionButton,
              selectedSection === section && styles.selectedSectionButton,
            ]}
            onPress={() => setSelectedSection(section === selectedSection ? null : section)}
          >
            <Text
              style={[
                styles.sectionButtonText,
                selectedSection === section && styles.selectedSectionButtonText,
              ]}
            >
              {section}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    

      {/* Your content for the selected section goes here */}
      {selectedSection === 'Events' && (
        <ScrollView style={styles.scrollableContent}>
          <View style={styles.dropdownContent}>
            {/* Content for Event section */}

            {/* Vertical list of images with text and calendar icon */}
            <FlatList
  data={eventImages}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <ImageBackground source={{ uri: item.image }} style={styles.eventImage} resizeMode="cover">
      <View style={styles.imageOverlay}>
        <Text style={styles.imageText}>{item.title}</Text>
        <View style={styles.dateContainer}>
          <Image source={require('../../../assets/images/drawer/calendar.png')} style={styles.icon} />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
    </ImageBackground>
  )}
/>
          </View>
        </ScrollView>
      )}

      
{selectedSection === 'Photos' && (
  <ScrollView style={styles.scrollableContent}>
    <View style={styles.dropdownContent}>
      {/* Content for Photos section */}
      <FlatList
        data={photoImages}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.photoItem}>
            <Image source={{ uri: item.image }} style={styles.photoImage} resizeMode="cover" />
            <Text style={styles.photoText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  </ScrollView>
)}

{selectedSection === 'Reviews' && (
  <Reviews />
)}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Set the background color as needed
  },
  
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginTop: 5,
  },
  imageOverlay: {
    flex: 1,
    justifyContent: 'left',
    padding: 15,
  },
  photoItem: {
    flex: 1,
    margin: 8,
  },
  photoImage: {
    width: '100%',
    height: 200,  // Adjust the height as needed
    borderRadius: 20,
    marginBottom: 8,
    resizeMode: 'cover',  // Maintain aspect ratio
  },
  photoText: {
    color: 'white',
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  dateText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 5,
  },

  imageText: {
    color: 'white',
    fontSize: 20,
  },
  ratingContainer: {
    alignItems: 'center',
    marginTop: 20,
    
  },
  icon: {
    width: 20, // Adjust the width as needed
    height: 20, // Adjust the height as needed
    tintColor: 'white', // Adjust the icon color as needed
  },

  imageScrollView: {
    marginTop: 15,
  },
  eventImage: {
    width: '100%',
    height: 100,
    marginRight: 10,
    borderRadius: 5,
    marginBottom: 15,
    
     // For Android
  },
  profileImage: {
    width: '100%',
    height: '35%', // Adjust the height as needed
    resizeMode: 'cover',
    borderBottomLeftRadius: 10, // Add border radius to match the shadow effect
    borderBottomRightRadius: 10, // Add border radius to match the shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 }, // Adjust the offset to control the shadow position
    shadowOpacity: 0.5, // Adjust the opacity to control the shadow strength
    shadowRadius: 5, // Adjust the radius to control the blur effect
  },
  greyBar: {
    height: 7, // Adjust the height of the grey bar as needed
    backgroundColor: '#CCCCCC', // Grey color
    alignSelf: 'center', // Center the grey bar horizontally
    position: 'absolute',
    top: '35%', // Adjust the top position as needed
    width: '15%',
    marginTop:15,
    borderRadius:5, // Adjust the width of the grey bar as needed
  },
  textContainer: {
    position: 'absolute',
    top: '26%', // Adjust the top position as needed
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Blackish transparent background
    padding: 15,
    alignItems: 'center', 
    
  },
  artistName: {
    color: '#ffffff', // Text color
    fontSize: 20,
    fontWeight: 'bold',
  },
  artistPosition: {
    color: '#ffffff', // Text color
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 45,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statTitle: {
    color: '#ffffff',
    fontSize: 17,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
  dropdown: {
    backgroundColor: '#1a1a1a',
  },
  dropdownItem: {
    justifyContent: 'flex-start',
  },
  dropdownContent: {
    
    padding: 15,
    marginTop: 10,
  },
  sectionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    
  },
  sectionButton: {
   paddingTop:10,
    fontSize:18,
    marginHorizontal:15,
  },
  selectedSectionButton: {
    borderBottomWidth: 2,
    borderBottomRightRadius:2, // Adjust the size of the underline as needed
    borderColor: 'white', // Change the color of the underline when selected
    paddingBottom: 4,
    // Adjust the padding at the bottom to make the underline shorter
  },

  sectionButtonText: {
    color: 'grey',
    fontSize: 18,
    fontWeight:'bold', // Adjust the font size as needed
  },
  selectedSectionButtonText: {
    color: 'red', // Change the color to red when selected
    fontSize: 18, // Adjust the font size as needed
  },
  
});
