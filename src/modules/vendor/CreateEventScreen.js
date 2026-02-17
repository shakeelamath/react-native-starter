import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform, ImageBackground } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import eventService from '../../services/eventService';
import { auth } from '../../services/firebase';

// UI-only CreateEvent multi-step screen matching the dark maroon mockup
export default function CreateEventScreen() {
  const navigation = useNavigation();

  // Form state
  const [step, setStep] = useState(0); // 0..4
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Music');
  const [description, setDescription] = useState('');
  const [performers, setPerformers] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [addressText, setAddressText] = useState('');
  const [location, setLocation] = useState({ latitude: 6.927079, longitude: 79.861244 });
  const [isPaid, setIsPaid] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [images, setImages] = useState([]);

  const mapRef = useRef(null);

  const onPickImage = () => {
    Alert.alert('Upload', 'Image picker not integrated in UI-only preview.');
  };

  const onAddPerformer = () => {
    const id = Date.now().toString();
    setPerformers([...performers, { id, name: `Artist ${performers.length + 1}`, role: 'Singer' }]);
  };

  const onAddTicketTier = () => {
    const id = Date.now().toString();
    setTickets([...tickets, { id, name: `General Admission`, price: '20.00', quantity: 100 }]);
  };

  const onMapLongPress = (e) => {
    const { coordinate } = e.nativeEvent;
    setLocation(coordinate);
  };

  const goNext = () => {
    if (step < 4) setStep(step + 1);
  };
  const goBack = () => {
    if (step === 0) navigation.goBack();
    else setStep(step - 1);
  };

  // Publish now creates an event via eventService.createEvent (uses firebase stub). It ensures start/end default to now/today+3h if missing so event appears on map.
  const onPreviewPublish = async () => {
    try {
      const currentUser = auth().currentUser;
      const vendorId = (currentUser && currentUser.uid) || 'vendor-stub';

      // default start/end if missing (so event shows up as 'today')
      const now = new Date();
      const startTime = start ? new Date(start) : now;
      const endTime = end ? new Date(end) : new Date(now.getTime() + 3 * 60 * 60 * 1000);

      const eventData = {
        title: title || 'Untitled Event',
        description: description || '',
        performers,
        startTime,
        endTime,
        location,
        venueName: addressText || '',
        status: 'published',
      };

      const eventId = await eventService.createEvent(vendorId, eventData, images);
      Alert.alert('Event published', `Event ID: ${eventId}`,
        [{ text: 'OK', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'VendorDashboard' }] }) }]
      );
    } catch (e) {
      console.warn('publish failed', e && e.message);
      Alert.alert('Publish failed', e && e.message ? e.message : 'Unknown error');
    }
  };

  // Top step labels
  const STEP_TITLES = ['Details', 'Performers', 'Date & Location', 'Tickets', 'Preview'];

  // Renderers for each step
  const renderDetails = () => (
    <View>
      <Text style={styles.sectionLabel}>Event Banner</Text>
      <TouchableOpacity style={styles.bannerPlaceholder} onPress={onPickImage} activeOpacity={0.8}>
        {images.length === 0 ? (
          <View style={styles.bannerInner}>
            <Image source={require('../../../assets/images/icons/arrowupwhite.png')} style={{ tintColor: 'rgba(255,255,255,0.6)', width: 28, height: 28, marginBottom: 10 }} />
            <Text style={styles.bannerText}>Upload Cover Image</Text>
            <Text style={styles.bannerHint}>Recommended: 1200 x 800</Text>
          </View>
        ) : (
          <ImageBackground source={{ uri: images[0] }} style={styles.bannerImage} imageStyle={{ borderRadius: 14 }}>
            <View style={styles.bannerOverlay} />
          </ImageBackground>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Event Name</Text>
      <TextInput style={styles.input} placeholder="Ex: Neon Nights" placeholderTextColor="#b9a9a9" value={title} onChangeText={setTitle} />

      <Text style={styles.sectionLabel}>Category</Text>
      <TouchableOpacity style={styles.selectBox} onPress={() => Alert.alert('Category', 'Category picker placeholder')}>
        <Text style={styles.selectText}>{category}</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Description</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Tell guests what to expect — music, dress code, mood" placeholderTextColor="#b9a9a9" value={description} onChangeText={setDescription} multiline />
    </View>
  );

  const renderPerformers = () => (
    <View>
      <Text style={styles.sectionLabel}>Who is performing?</Text>

      <TouchableOpacity style={styles.addPerformerBox} onPress={onAddPerformer} activeOpacity={0.8}>
        <Text style={styles.addPerformerPlus}>+</Text>
        <Text style={styles.addPerformerText}>Add Performer</Text>
        <Text style={styles.addPerformerHint}>Tap to add artist details</Text>
      </TouchableOpacity>

      {performers.length > 0 && (
        <View style={{ marginTop: 12 }}>
          {performers.map(p => (
            <View key={p.id} style={styles.performerItem}>
              <Image source={require('../../../assets/images/avatar.png')} style={styles.performerAvatar} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.performerName}>{p.name}</Text>
                <Text style={styles.performerRole}>{p.role}</Text>
              </View>
              <TouchableOpacity onPress={() => setPerformers(performers.filter(x => x.id !== p.id))} style={styles.performerRemove}><Text style={{ color: '#fff' }}>✕</Text></TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderDateLocation = () => (
    <View>
      <Text style={styles.sectionLabel}>When is it happening?</Text>
      <View style={styles.rowChips}>
        <TextInput style={styles.chip} placeholder="Start" placeholderTextColor="#b9a9a9" value={start} onChangeText={setStart} />
        <TextInput style={[styles.chip, { marginLeft: 10 }]} placeholder="End" placeholderTextColor="#b9a9a9" value={end} onChangeText={setEnd} />
      </View>

      <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Where is the party?</Text>
      <TextInput style={styles.input} placeholder="Search venue or address (Google Places)" placeholderTextColor="#b9a9a9" value={addressText} onChangeText={setAddressText} />
      <Text style={styles.helper}>Tap on the map below to pick a precise location (long-press)</Text>

      <View style={styles.mapPreviewContainer}>
        <MapView ref={mapRef} style={styles.mapPreview} initialRegion={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }} onLongPress={onMapLongPress}>
          <Marker coordinate={location} />
        </MapView>
      </View>

    </View>
  );

  const renderTickets = () => (
    <View>
      <Text style={styles.sectionLabel}>Tickets & Pricing</Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <TouchableOpacity style={[styles.toggleSmall, isPaid && styles.toggleSmallActive]} onPress={() => setIsPaid(!isPaid)}><Text style={[styles.toggleSmallText, isPaid && styles.toggleSmallTextActive]}>{isPaid ? 'Paid Ticket' : 'Free Event'}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.addTinyButton} onPress={onAddTicketTier}><Text style={styles.addTinyText}>Add Ticket Type</Text></TouchableOpacity>
      </View>

      {tickets.map(t => (
        <View key={t.id} style={styles.ticketCard}>
          <View>
            <Text style={styles.ticketName}>{t.name}</Text>
            <Text style={styles.ticketMeta}>${t.price} · {t.quantity} available</Text>
          </View>
          <TouchableOpacity onPress={() => setTickets(tickets.filter(x => x.id !== t.id))}><Text style={{ color: '#fff' }}>Remove</Text></TouchableOpacity>
        </View>
      ))}

    </View>
  );

  const renderPreview = () => (
    <View>
      <ImageBackground source={require('../../../assets/images/eventbg.png')} style={styles.previewImage} imageStyle={{ borderRadius: 14 }}>
        <View style={styles.previewOverlay} />
        <View style={styles.previewBadge}><Text style={{ color: '#fff', fontWeight: '700' }}>${tickets.length ? tickets[0].price : '0'}</Text></View>
      </ImageBackground>

      <Text style={styles.previewTitle}>{title || 'Neon Nights: Summer Opening Party'}</Text>
      <Text style={styles.previewMeta}>Hosted by {performers.length ? performers[0].name : 'Various Artists'}</Text>

      <View style={styles.previewInfoRow}>
        <Text style={styles.previewInfoLabel}>Date & Time</Text>
        <Text style={styles.previewInfoText}>{start || 'Fri, Aug 24 · 10:00 PM'}</Text>
      </View>
      <View style={styles.previewInfoRow}>
        <Text style={styles.previewInfoLabel}>Location</Text>
        <Text style={styles.previewInfoText}>{addressText || 'The Basement Club, Colombo'}</Text>
      </View>

      <TouchableOpacity style={styles.publishButton} onPress={onPreviewPublish}><Text style={styles.publishText}>Publish Event</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBack} style={styles.headerBack}><Text style={styles.headerBackText}>‹</Text></TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Create Event</Text>
          <Text style={styles.headerSubtitle}>{STEP_TITLES[step]}</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Save Draft', 'Draft saved (UI-only)')} style={styles.saveDraft}><Text style={styles.saveDraftText}>Save</Text></TouchableOpacity>
      </View>

      <View style={styles.stepIndicatorRow}>
        {STEP_TITLES.map((t, i) => (
          <View key={t} style={[styles.stepDot, i <= step ? styles.stepDotActive : null]} />
        ))}
      </View>

      <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }}>
        {step === 0 && renderDetails()}
        {step === 1 && renderPerformers()}
        {step === 2 && renderDateLocation()}
        {step === 3 && renderTickets()}
        {step === 4 && renderPreview()}

        <View style={{ height: 20 }} />

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}><Text style={styles.backBtnText}>{step === 0 ? 'Cancel' : 'Back'}</Text></TouchableOpacity>
          {step < 4 ? (
            <TouchableOpacity style={styles.nextBtn} onPress={goNext}><Text style={styles.nextBtnText}>Next</Text></TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextBtn} onPress={onPreviewPublish}><Text style={styles.nextBtnText}>Publish</Text></TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#160707' },
  headerRow: { height: 82, paddingTop: 36, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderBottomColor: 'rgba(255,255,255,0.02)', borderBottomWidth: 1 },
  headerBack: { width: 40, alignItems: 'flex-start' },
  headerBackText: { color: '#fff', fontSize: 28 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerSubtitle: { color: '#f1c6c6', fontSize: 12 },
  saveDraft: { width: 60, alignItems: 'flex-end' },
  saveDraftText: { color: '#f1c6c6' },
  stepIndicatorRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 12 },
  stepDot: { width: 22, height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 6, marginHorizontal: 6 },
  stepDotActive: { backgroundColor: '#e63946' },
  form: { paddingHorizontal: 18, paddingTop: 6 },
  sectionLabel: { color: '#fff', marginTop: 8, marginBottom: 8, fontWeight: '700', fontSize: 14 },
  bannerPlaceholder: { height: 180, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  bannerInner: { alignItems: 'center' },
  bannerText: { color: '#f1dede', fontWeight: '700' },
  bannerHint: { color: '#b9a9a9', fontSize: 12 },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  input: { backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff', padding: 12, borderRadius: 10, marginTop: 6 },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  selectBox: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 10 },
  selectText: { color: '#fff' },
  addPerformerBox: { marginTop: 12, padding: 20, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center' },
  addPerformerPlus: { color: '#fff', backgroundColor: '#e63946', width: 48, height: 48, borderRadius: 24, textAlign: 'center', lineHeight: 48, fontSize: 28, fontWeight: '800' },
  addPerformerText: { color: '#fff', fontWeight: '700', marginTop: 10 },
  addPerformerHint: { color: '#b9a9a9', fontSize: 12, marginTop: 6 },
  performerItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 12, marginTop: 8 },
  performerAvatar: { width: 44, height: 44, borderRadius: 22 },
  performerName: { color: '#fff', fontWeight: '700' },
  performerRole: { color: '#ffb3b3', fontSize: 12 },
  performerRemove: { padding: 8 },
  rowChips: { flexDirection: 'row', marginTop: 6 },
  chip: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 10, color: '#fff' },
  helper: { color: '#b9a9a9', fontSize: 12, marginTop: 8 },
  mapPreviewContainer: { height: 160, borderRadius: 12, overflow: 'hidden', marginTop: 10 },
  mapPreview: { flex: 1 },
  toggleSmall: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  toggleSmallActive: { backgroundColor: '#e63946', borderColor: '#e63946' },
  toggleSmallText: { color: '#fff' },
  toggleSmallTextActive: { color: '#fff' },
  addTinyButton: { marginLeft: 12, padding: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.02)' },
  addTinyText: { color: '#fff' },
  ticketCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 10, marginTop: 10 },
  ticketName: { color: '#fff', fontWeight: '700' },
  ticketMeta: { color: '#b9a9a9', marginTop: 4 },
  previewImage: { height: 220, borderRadius: 14, overflow: 'hidden' },
  previewOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  previewBadge: { position: 'absolute', right: 12, top: 12, backgroundColor: '#e63946', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  previewTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 12 },
  previewMeta: { color: '#f1dede', marginTop: 6 },
  previewInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  previewInfoLabel: { color: '#b9a9a9' },
  previewInfoText: { color: '#fff', fontWeight: '700' },
  publishButton: { marginTop: 18, backgroundColor: '#e63946', padding: 14, borderRadius: 12, alignItems: 'center' },
  publishText: { color: '#fff', fontWeight: '700' },

  bottomActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  backBtn: { backgroundColor: 'transparent', padding: 12, borderRadius: 10 },
  backBtnText: { color: '#fff' },
  nextBtn: { backgroundColor: '#e63946', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  nextBtnText: { color: '#fff', fontWeight: '800' },
});
