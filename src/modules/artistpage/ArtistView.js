import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, FlatList, ImageBackground } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import * as Animatable from 'react-native-animatable';
import DropDownPicker from 'react-native-dropdown-picker';
import Reviews from './reviews'; 
import LinearGradient from 'react-native-linear-gradient';
import { RadialGradient } from 'react-native-gradients';
import upcoming from '../home/upcomingEvents';
import reviewsData from './dummyReviews';
import artistPhotos from '../artists/dummyArtistPhotos';
import RatingStore from '../artists/ArtistRatingsStore';

export default function ArtistScreen({ route, navigation }) {
  // get artist from navigation params; fallback to defaults
  const artistParam = (route && route.params && route.params.artist) || {};
  const artistProfileImageUrl = artistParam.source && artistParam.source.uri
    ? artistParam.source.uri
    : (artistParam.source || 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/ArtistImage.png?alt=media&token=4a0fcfd4-4194-485a-9bad-7eca3cd57d1a');

  const [rating, setRating] = useState(() => RatingStore.getRatingForArtist(artistParam.id) || artistParam.rating || 0);
  const [animateStars, setAnimateStars] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Events');

  useEffect(() => {
    setAnimateStars(true);
  }, []);

  const showsPerformed = artistParam.shows || 0;
  const artistName = artistParam.name || 'Unknown Artist';
  const artistRole = artistParam.role || artistParam.place || '';

  // Filter upcoming events by performer matching the artist name (case-insensitive)
  const artistEvents = upcoming.filter(ev => ev.performer && ev.performer.toLowerCase().includes((artistName || '').toLowerCase()));

  // Use per-artist photos if available (from dummyArtistPhotos), else fallback to a generic set
  const rawPhotos = artistPhotos[artistParam.id] || artistPhotos['a1'] || [];
  const photoImages = rawPhotos.map((url, idx) => ({ image: url, name: `Photo ${idx + 1}` }));

  const onStarRatingPress = (val) => {
    // AirbnbRating returns values like 1..5; convert to 0-10 scale if desired, or keep 1..5
    setRating(val);
    if (artistParam && artistParam.id) {
      RatingStore.setRatingForArtist(artistParam.id, val);
    }
  };

  const sections = ['Events', 'Photos', 'Reviews'];

  return (
    <LinearGradient
      colors={['#4e4845', '#443e3b', '#3d3937', '#362f2d', '#332f2e', '#2d2824', '#272523', '#201d1a', '#1b1a19']}
      locations={[0, 0.08, 0.2, 0.4, 0.55, 0.65, 0.75, 0.85, 1]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* Artist's Profile Picture */}
        <Image style={styles.profileImage} source={typeof artistProfileImageUrl === 'string' ? { uri: artistProfileImageUrl } : artistProfileImageUrl} />

        {/* Grey bar */}
        <View style={styles.greyBar} />

        {/* Ratings and Events section */}
        <View style={styles.statsContainer}>
          {/* Ratings */}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{rating}</Text>
            <Text style={styles.statTitle}>Ratings</Text>
          </View>

          {/* Events Performed */}
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{showsPerformed}</Text>
            <Text style={styles.statTitle}>Events Performed</Text>
          </View>
        </View>

        {/* Interactive rating */}
        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <AirbnbRating
            defaultRating={rating}
            count={5}
            showRating={false}
            size={18}
            onFinishRating={onStarRatingPress}
          />
        </View>

        {/* Blackish transparent background for text */}
        <View style={styles.textContainer}>
          {/* Artist's Name */}
          <Text style={styles.artistName}>{artistName}</Text>

          {/* Artist's Role/Position */}
          <Text style={styles.artistPosition}>{artistRole}</Text>
        </View>

        {/* Follow button */}
        <TouchableOpacity style={styles.followButton} onPress={() => { /* placeholder follow action */ }}>
          <Text style={styles.followTxt}>Follow</Text>
        </TouchableOpacity>

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

        {/* Section content */}
        {selectedSection === 'Events' && (
          <View style={styles.sectionContent}>
            <FlatList
              data={artistEvents}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.eventRow} onPress={() => navigation.navigate('Event', { event: item })}>
                  <Image source={{ uri: item.image }} style={styles.eventThumb} />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventName}>{item.name}</Text>
                    <Text style={styles.eventMeta}>{item.place} • {item.performer}</Text>
                    <Text style={styles.eventDate}>{item.date} • {item.time || ''}</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 180 }}
            />
          </View>
        )}

        {selectedSection === 'Photos' && (
          <View style={styles.sectionContent}>
            <FlatList
              data={photoImages}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.photoGridItem}>
                  <Image source={{ uri: item.image }} style={styles.photoGridImage} />
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 180 }}
            />
          </View>
        )}

        {selectedSection === 'Reviews' && (
          <View style={styles.sectionContent}>
            {/* Filter reviews for this artist */}
            <FlatList
              data={reviewsData.filter(r => r.artistId === artistParam.id)}
              keyExtractor={(r) => r.id}
              renderItem={({ item }) => (
                <View style={styles.reviewRow}>
                  <Image source={{ uri: item.reviewerAvatar }} style={styles.reviewAvatar} />
                  <View style={styles.reviewContent}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.reviewerName}>{item.reviewerName}</Text>
                      <Text style={styles.reviewerRating}>★ {item.rating}.0</Text>
                    </View>
                    <Text style={styles.reviewText}>{item.text}</Text>
                    <Text style={styles.reviewDate}>{item.date}</Text>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 180 }}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b', // darker background like screenshot
  },
  gradientContainer: {
    flex: 1,
    overflow: 'hidden', // Clip child views to the bounds of the View
    borderRadius: 100,  // Adjust the borderRadius to create an oval shape
  },
  gradient: {
    flex: 1,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginTop: 5,
  },
  imageOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
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
    fontSize: 28,
    fontWeight: 'bold',
  },
  artistPosition: {
    color: '#ffffff', // Text color
    fontSize: 14,
  },
  followButton: {
    marginTop: 16,
    backgroundColor: '#e53935',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: 'center',
  },
  followTxt: { color: '#fff', fontWeight: '700' },
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
  sectionContent: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 20 },
  eventRow: { flexDirection: 'row', marginBottom: 12, backgroundColor: '#0f0f0f', borderRadius: 10, overflow: 'hidden' },
  eventThumb: { width: 110, height: 90, resizeMode: 'cover' },
  eventInfo: { padding: 10, flex: 1 },
  eventName: { color: '#fff', fontWeight: '700', fontSize: 16 },
  eventMeta: { color: '#ccc', fontSize: 12, marginTop: 6 },
  eventDate: { color: '#999', fontSize: 12, marginTop: 6 },
  photoGridItem: { flex: 1, margin: 6, borderRadius: 8, overflow: 'hidden' },
  photoGridImage: { width: '100%', height: 140, resizeMode: 'cover' },
  reviewRow: { flexDirection: 'row', marginBottom: 12, backgroundColor: '#111', padding: 12, borderRadius: 10 },
  reviewAvatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  reviewContent: { flex: 1 },
  reviewerName: { color: '#fff', fontWeight: '700' },
  reviewerRating: { color: '#ffd54f', fontWeight: '700' },
  reviewText: { color: '#ddd', marginTop: 6 },
  reviewDate: { color: '#999', marginTop: 8, fontSize: 12 },
 });
