import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import upcoming from '../home/upcomingEvents';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16; // match container padding
const GAP = 12; // space between columns
const ITEM_WIDTH = Math.floor((width - HORIZONTAL_PADDING * 2 - GAP) / 2); // compute item width to leave equal side padding

export default function EventsScreen({ navigation }) {
  useEffect(() => {
    if (navigation && navigation.setOptions) navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Event', { event: item })}>
      <ImageBackground source={{ uri: item.image }} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={styles.meta}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.sub}>{item.place} • {item.performer}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0f0f0f" barStyle="light-content" translucent={false} />
      {/* Custom header with back button and title */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ImageBackground source={require('../../../assets/images/icons/arrow-back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>Events</Text>
      </View>

      <FlatList
        data={upcoming}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: HORIZONTAL_PADDING }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingTop: 8, minHeight: 48 },
  backButton: { padding: 8, marginRight: 6 },
  backIcon: { width: 22, height: 22, tintColor: '#fff', resizeMode: 'contain' },
  heading: { color: '#fff', fontSize: 22, fontWeight: '700' },

  columnWrapper: { justifyContent: 'space-between', marginBottom: 12 },
  card: { width: ITEM_WIDTH, borderRadius: 12, overflow: 'hidden', backgroundColor: '#111' },
  image: { width: '100%', height: 140, justifyContent: 'flex-end' },
  imageStyle: { borderRadius: 12 },
  meta: { padding: 10, backgroundColor: 'rgba(0,0,0,0.35)' },
  title: { color: '#fff', fontSize: 14, fontWeight: '700' },
  sub: { color: '#ddd', marginTop: 6, fontSize: 12 },
  date: { color: '#ccc', marginTop: 6, fontSize: 12 },
});
