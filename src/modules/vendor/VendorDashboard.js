import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function VendorDashboard() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.venueName}>The Blue Note Lounge</Text>
          <Text style={styles.venueSub}>Welcome back</Text>
        </View>
        <Image source={require('../../../assets/images/avatar.png')} style={styles.avatar} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statTitle}>Events</Text><Text style={styles.statValue}>4</Text></View>
          <View style={styles.statCard}><Text style={styles.statTitle}>Revenue</Text><Text style={styles.statValue}>$12.4k</Text></View>
        </View>

        <Text style={styles.sectionHeader}>Upcoming Events</Text>
        <View style={styles.eventItem}><Text style={styles.eventTitle}>Jazz Night: The Quintet</Text><Text style={styles.eventMeta}>Fri, Oct 23 · 9:00 PM</Text></View>
        <View style={styles.eventItem}><Text style={styles.eventTitle}>Electronic Souls</Text><Text style={styles.eventMeta}>Sat, Oct 24 · 10:00 PM</Text></View>

      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateEvent')}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  venueName: { color: '#fff', fontSize: 20, fontWeight: '800' },
  venueSub: { color: '#bbb', fontSize: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  statCard: { backgroundColor: '#151515', padding: 12, borderRadius: 12, width: '48%' },
  statTitle: { color: '#bbb' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: '800' },
  sectionHeader: { color: '#fff', marginTop: 16, fontWeight: '700' },
  eventItem: { backgroundColor: '#121212', padding: 12, borderRadius: 10, marginTop: 12 },
  eventTitle: { color: '#fff', fontWeight: '700' },
  eventMeta: { color: '#bbb', marginTop: 6 },
  fab: { position: 'absolute', right: 16, bottom: 32, width: 56, height: 56, borderRadius: 28, backgroundColor: '#e63946', alignItems: 'center', justifyContent: 'center' },
});
