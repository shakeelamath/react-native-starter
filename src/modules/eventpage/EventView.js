import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

export default function EventScreen() {
  const artistProfileImageUrl = 'https://firebasestorage.googleapis.com/v0/b/syncup-c2f1d.appspot.com/o/EventImage.png?alt=media&token=c7f8814e-e2ac-4b1a-b165-18162125d59a';

  return (
    <View style={styles.container}>
      {/* Artist's Profile Picture */}
      <Image style={styles.profileImage} source={{ uri: artistProfileImageUrl }} />

      <View style={styles.textContainer}>
        {/* Artist's Name */}
        <Text style={styles.artistName}>Lunatics</Text>
        </View>

        {/* Calendar Icon and Date */}
        <View style={styles.dateContainer}>
          <Image source={require('../../../assets/images/RedCalendar.png')} style={styles.calendarIcon} />
          <View>
            <Text style={styles.dateText}>14 December 2021</Text>
            <Text style={styles.dateTextBelow}>Tuesday, 4:00pm-9:00pm</Text>
          </View>
      </View>
      <View style={styles.dateContainer}>
          <Image source={require('../../../assets/images/ArtistIcon.png')} style={styles.calendarIcon} />
          <View>
            <Text style={styles.dateText}>Almaz Numaan</Text>
            <Text style={styles.dateTextBelow}>Performer</Text>
          </View>
      </View>
      </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  profileImage: {
    width: '100%',
    height: '40%',
    resizeMode: 'cover',
  },
  textContainer: {
    position: 'absolute',
    top: '29%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 26,
    alignItems: 'left',
  },
  artistName: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding:10,
    marginLeft:15,
  },
  calendarIcon: {
    width: 35,
    height: 35,
    marginRight: 10,
    
  },
  dateText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight:'bold'
  },
  dateTextBelow: {
    color: '#fffff0',
    fontSize: 16,
  },
});
