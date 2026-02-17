import React from 'react';
import { StyleSheet, View, Image, ImageBackground, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function EventScreen({ route, navigation }) {
  const event = route && route.params && route.params.event ? route.params.event : {
    id: 'dummy-1',
    name: 'Ladies Night',
    place: 'Love Bar',
    performer: 'Various Artists',
    date: '14 December, 2021',
    time: '8:00PM - 11:59PM',
    image: require('../../../assets/images/eventbg.png'),
    // some events may not have coordinate; use a sensible Colombo fallback
    coordinate: { latitude: 6.927079, longitude: 79.861244 },
    description: 'Join us for Ladies Night with great music, drink specials and an unforgettable atmosphere. DJs and live acts performing across the night. Dress code: Smart casual.',
  };

  const imageSource = typeof event.image === 'string' ? { uri: event.image } : event.image;
  // ensure coordinate exists before using it in MapView
  const coord = (event && event.coordinate && typeof event.coordinate.latitude === 'number' && typeof event.coordinate.longitude === 'number')
    ? event.coordinate
    : { latitude: 6.927079, longitude: 79.861244 };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ImageBackground source={imageSource} style={styles.headerImage} imageStyle={styles.headerImageStyle}>
          {/* Larger gradient overlay to mimic a soft blur + darkening for legibility */}
          <LinearGradient
            colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.75)"]}
            locations={[0, 0.5, 1]}
            style={styles.headerGradient}
          >
            <Text style={styles.title} numberOfLines={2}>{event.name}</Text>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.metaContainer}>
          <View style={styles.metaRow}>
            <Image source={require('../../../assets/images/RedCalendar.png')} style={styles.icon} />
            <View style={styles.metaTextWrap}>
              <Text style={styles.metaPrimary}>{event.date}</Text>
              <Text style={styles.metaTime}>{event.time}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Image source={require('../../../assets/images/avatar.png')} style={styles.iconSmall} />
            <View style={styles.metaTextWrap}>
              <Text style={styles.metaPrimary}>{event.performer}</Text>
              <Text style={styles.metaSecondary}>Performer</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Image source={require('../../../assets/images/marker.png')} style={styles.iconSmall} />
            <View style={styles.metaTextWrap}>
              <Text style={styles.metaPrimary}>{event.place}</Text>
              <Text style={styles.metaSecondary}>Location</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapWrap}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: coord.latitude,
                longitude: coord.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={coord} />
            </MapView>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookBtn} onPress={() => { /* placeholder */ }}>
          <Text style={styles.bookTxt}>Book A Table</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  headerImage: { width: '100%', height: Math.round(width * 0.6), justifyContent: 'flex-end' },
  headerImageStyle: { resizeMode: 'cover' },
  headerGradient: { paddingHorizontal: 18, paddingVertical: 20, justifyContent: 'flex-end', minHeight: 80 },
  title: { color: '#fff', fontSize: 38, fontWeight: '800', textShadowColor: 'rgba(0,0,0,0.85)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 8, lineHeight: 44 },

  metaContainer: { paddingHorizontal: 18, paddingTop: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  icon: { width: 28, height: 28, marginRight: 12 },
  iconSmall: { width: 22, height: 22, marginRight: 12 },
  metaTextWrap: {},
  metaPrimary: { color: '#fff', fontSize: 16, fontWeight: '700' },
  metaTime: { color: '#ddd', fontSize: 14, marginTop: 4 },
  metaSecondary: { color: '#ddd', fontSize: 12 },

  section: { paddingHorizontal: 18, paddingTop: 12 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  description: { color: '#ddd', lineHeight: 22, fontSize: 14 },

  mapWrap: { height: 140, borderRadius: 10, overflow: 'hidden', marginTop: 12 },
  map: { flex: 1 },

  footer: { position: 'absolute', left: 18, right: 18, bottom: 18 },
  bookBtn: { backgroundColor: '#e53935', paddingVertical: 14, borderRadius: 28, alignItems: 'center' },
  bookTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // inline back removed — use header back button only
});
