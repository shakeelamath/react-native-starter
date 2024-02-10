import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import * as Animatable from 'react-native-animatable';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ArtistScreen() {
  const artistProfileImageUrl = 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/ArtistImage.png?alt=media&token=4a0fcfd4-4194-485a-9bad-7eca3cd57d1a';

  const [rating, setRating] = useState(0);
  const [animateStars, setAnimateStars] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    setAnimateStars(true);
  }, []);

  const handleRating = (newRating) => {
    // Handle the rating as needed (e.g., send it to the server)
    setRating(newRating);
  };

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
          <Text style={styles.statTitle}>Ratings</Text>
          <Text style={styles.statValue}>9.5</Text>
        </View>

        {/* Events Performed */}
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Events Performed</Text>
          <Text style={styles.statValue}>25</Text>
        </View>
      </View>

      {/* 5-Star Rating System with Animation */}
      <Animatable.View
        animation={animateStars ? 'bounceIn' : undefined}
        duration={2000}
        style={styles.ratingContainer}
      >
        <AirbnbRating
          showRating={false}
          count={5}
          defaultRating={rating}
          size={20} // Adjust the size of the stars
          starContainerStyle={{ flexDirection: 'row', justifyContent: 'space-between' }} // Space out the stars
          starStyle={{ marginHorizontal: 5 }} // Adjust the horizontal margin between stars
          onFinishRating={handleRating}
        />
      </Animatable.View>

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
        <View style={styles.dropdownContent}>
          {/* Content for Event section */}
          <Text>Event Section Content</Text>
        </View>
      )}

      {selectedSection === 'Photos' && (
        <View style={styles.dropdownContent}>
          {/* Content for Photos section */}
          <Text>Photos Section Content</Text>
        </View>
      )}

      {selectedSection === 'Reviews' && (
        <View style={styles.dropdownContent}>
          {/* Content for Reviews section */}
          <Text>Reviews Section Content</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Set the background color as needed
  },
  ratingContainer: {
    alignItems: 'center',
    marginTop: 20,
    
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
    fontSize: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    fontSize: 16, // Adjust the font size as needed
  },
  selectedSectionButtonText: {
    color: 'red', // Change the color to red when selected
    fontSize: 16, // Adjust the font size as needed
  },
  
});
