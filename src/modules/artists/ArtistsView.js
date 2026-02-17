import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import artistsData from './dummyArtists'; // dedicated artists data

export default function ArtistsScreen({ navigation }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    // hide the stack header so we don't have two headers
    if (navigation && navigation.setOptions) navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const artists = useMemo(() => artistsData, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return artists;
    return artists.filter(a => a.name.toLowerCase().includes(q));
  }, [artists, query]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Artist', { artist: item })}>
      <Image source={item.source} style={styles.gridAvatar} />
      <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.gridRole} numberOfLines={1}>{item.role}</Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>★ {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
       {/* Custom header with back button and title (single header only) */}
       <View style={styles.headerRow}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Image source={require('../../../assets/images/icons/arrow-back.png')} style={styles.backIcon} />
         </TouchableOpacity>
         <Text style={styles.heading}>Artists</Text>
       </View>

       <TextInput
         placeholder="Search artists..."
         placeholderTextColor="#999"
         style={styles.search}
         value={query}
         onChangeText={setQuery}
       />

       <FlatList
         data={filtered}
         keyExtractor={(i) => i.id}
         renderItem={renderItem}
         numColumns={3}
         columnWrapperStyle={styles.columnWrapper}
         contentContainerStyle={{ paddingBottom: 80 }}
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
   search: { backgroundColor: '#1a1a1a', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 12 },

   // grid styles
   columnWrapper: { justifyContent: 'space-between', marginBottom: 12 },
   gridItem: {
     flex: 1,
     marginHorizontal: 6,
     alignItems: 'center',
     backgroundColor: '#111',
     paddingVertical: 10,
     borderRadius: 8,
   },
   gridAvatar: { width: 72, height: 72, borderRadius: 36, marginBottom: 8 },
   gridName: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
   gridRole: { color: '#ccc', fontSize: 12, fontWeight: '400', marginBottom: 6, textAlign: 'center' },
   ratingContainer: { backgroundColor: '#1a1a1a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
   ratingText: { color: 'red', fontWeight: '700' },

   // legacy/list styles (kept in case other parts rely on them)
   item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomColor: '#222', borderBottomWidth: 1 },
   avatar: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
   info: { flex: 1 },
   name: { color: '#fff', fontSize: 16, fontWeight: '600' },
   place: { color: 'red', fontSize: 12, marginTop: 4 },
 });
