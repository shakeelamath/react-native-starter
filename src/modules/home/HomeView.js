import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Image, FlatList, PanResponder, ImageBackground } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import BottomTabEvents from "./BottomTabEvents"
import BottomTabSingle from "./BottomTabSingle"
import eventService from '../../services/eventService';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../../components/GradientBackground';

// Move marker images and marker list to module-level constants so they keep stable references
const MARKER_IMAGE = require('../../../assets/images/marker.png');
const MARKER_IMAGE_WHITE = require('../../../assets/images/markerwhite.png');

const COLOMBO_MARKERS = [
  { id: 'm1', title: 'Sky Lounge', place: 'Colombo 01', coordinate: { latitude: 6.9275, longitude: 79.8612 } },
  { id: 'm2', title: 'The Loft', place: 'Colombo 02', coordinate: { latitude: 6.9240, longitude: 79.8565 } },
  { id: 'm3', title: 'Rhythm & Blues', place: 'Colombo 03', coordinate: { latitude: 6.9310, longitude: 79.8550 } },
  { id: 'm4', title: 'Love Bar', place: 'Colombo 04', coordinate: { latitude: 6.9205, longitude: 79.8670 } },
  { id: 'm5', title: 'Botanik', place: 'Colombo 05', coordinate: { latitude: 6.9290, longitude: 79.8700 } },
];

// Memoized marker component: renders a pulsing view marker behind and a child icon on top (explicit size).
// Top icon Marker enables tracksViewChanges briefly then disables it to prevent repeated bitmap recreation.
const MapMarker = React.memo(function MapMarker({ m, selected, onPress }) {
  const [tracksIcon, setTracksIcon] = React.useState(true);

  // disable view tracking after initial render to avoid continuous bitmap recreation on Android
  React.useEffect(() => {
    const t = setTimeout(() => setTracksIcon(false), 700);
    return () => clearTimeout(t);
  }, []);

  // when selection state changes, briefly re-enable tracking so the native marker bitmap updates (e.g., switches to white)
  React.useEffect(() => {
    // enable tracking to update the native bitmap when selected flips
    setTracksIcon(true);
    const t = setTimeout(() => setTracksIcon(false), 300);
    return () => clearTimeout(t);
  }, [selected]);

  return (
    <>
      {/* Pulse marker (behind) - anchor at center so pulse is centered on the icon */}
      <Marker
        key={`${m.id}-pulse`}
        coordinate={m.coordinate}
        anchor={{ x: 0.5, y: 0.5 }}
        zIndex={0}
        tracksViewChanges={true}
      >
        {/* Pulse sized to sit around the smaller icon */}
        <PulsingMarker size={80} pulseColor={selected ? 'rgba(255,255,255,0.22)' : 'rgba(229,57,53,0.30)'} />
      </Marker>

      {/* Icon marker on top (child Image) - pressable. Anchor at center so icon is centered on the coordinate */}
      <Marker
        key={m.id}
        coordinate={m.coordinate}
        onPress={() => onPress(m)}
        anchor={{ x: 0.5, y: 0.5 }}
        zIndex={1}
        tracksViewChanges={tracksIcon}
      >
        <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={selected ? MARKER_IMAGE_WHITE : MARKER_IMAGE}
            style={{ width: 36, height: 36, resizeMode: 'contain' }}
          />
        </View>
      </Marker>
    </>
  );
}, (prev, next) => {
  // Only re-render when selection state changes for this marker
  return prev.selected === next.selected && prev.m.id === next.m.id;
});

const HomeScreen = () => {
  // Center map on Colombo, Sri Lanka
  const initialRegion = {
    latitude: 6.927079, // Colombo approx
    longitude: 79.861244,
    latitudeDelta: 0.04, // zoomed out fallback
    longitudeDelta: 0.04,
  };
  // const data = events; // replaced by firestore-driven lists
  const navigation = useNavigation();

  // Use module-level COLOMBO_MARKERS (stable reference) to avoid re-creating arrays each render
  const colomboMarkers = COLOMBO_MARKERS;

  // start collapsed so the bottom tab is small and only shows 'Events Happening Near You'
  const COLLAPSED_HEIGHT = 220; // smaller collapsed size
  const EXPANDED_HEIGHT = 600; // expanded size when showing upcoming events
  const [tabHeight] = useState(new Animated.Value(COLLAPSED_HEIGHT));
  const [currentTab, setCurrentTab] = useState('events');
  const [markerTitle, setMarkerTitle] = useState('');
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
   const mapRef = useRef(null);

  // Add missing state hooks
  const [isExpanded, setIsExpanded] = useState(false);
  const [seenAllUpcoming, setSeenAllUpcoming] = useState(false);

  // New: hold events from Firestore
  const [liveEvents, setLiveEvents] = useState([]);

  // Fit the map to include all markers on mount so user sees them all
  useEffect(() => {
    if (mapRef.current && colomboMarkers && colomboMarkers.length) {
      try {
        const coords = colomboMarkers.map(m => m.coordinate);
        mapRef.current.fitToCoordinates(coords, {
          // further increase top padding to avoid clipping selected markers near the top
          edgePadding: { top: 300, right: 80, bottom: 300, left: 80 },
          animated: true,
        });
      } catch (e) {
        // fallback: no-op if fitToCoordinates not available
      }
    }

    // no marker tracking logic needed when using native Marker `image` for both states
    return () => {};
  }, []);

  // Subscribe to realtime published events from Firestore
  useEffect(() => {
    const unsubscribe = eventService.listenPublishedEvents((events) => {
      // convert firestore Timestamp -> Date handled in service
      setLiveEvents(events || []);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  // Determine today's events for the map and upcoming for the list
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const todaysEvents = liveEvents.filter(ev => {
    if (!ev.startTime || !ev.endTime) return false;
    return (ev.startTime <= endOfDay && ev.endTime >= startOfDay);
  });

  const upcoming = liveEvents.filter(ev => {
    if (!ev.startTime) return true;
    return ev.startTime > endOfDay;
  }).sort((a, b) => (a.startTime || 0) - (b.startTime || 0));

  // Auto-refresh mechanism so events disappear shortly after endTime without needing a reload
  useEffect(() => {
    let timer;
    // Recompute every 30 seconds
    timer = setInterval(() => {
      setLiveEvents((prev) => [...prev]); // trigger recompute by updating state reference
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Memoize handler so the function reference is stable across renders (reduces prop churn to Marker)
  const handleMarkerPress = React.useCallback((marker) => {
    // if same marker tapped again, just expand the tab and don't re-animate
    if (selectedMarkerId === marker.id) {
      setCurrentTab('single');
      expandTab();
      return;
    }

    setMarkerTitle(marker.title || '');
    setSelectedMarkerId(marker.id);
    // set selectedEvent by markerId if available
    const ev = liveEvents.find(e => e.markerId === marker.id) || null;
    setSelectedEvent(ev);
    setCurrentTab('single');
    expandTab();

    // animate map to center marker with an upward offset so selected marker is fully visible
    if (mapRef.current && marker && marker.coordinate) {
      try {
        const offsetLat = 0.0040; // tune if needed
        mapRef.current.animateToRegion({
          latitude: marker.coordinate.latitude + offsetLat,
          longitude: marker.coordinate.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }, 450);
      } catch (e) {
        // ignore if unavailable
      }
    }
  }, [selectedMarkerId, liveEvents]);

  const expandTab = () => {
    Animated.timing(tabHeight, { toValue: EXPANDED_HEIGHT, duration: 300, useNativeDriver: false }).start();
    setIsExpanded(true);
    // reset seen flag so footer only appears after user scrolls to end in this session
    setSeenAllUpcoming(false);
  };

  const collapseTab = () => {
    Animated.timing(tabHeight, { toValue: COLLAPSED_HEIGHT, duration: 300, useNativeDriver: false }).start();
    setIsExpanded(false);
  };

  const toggleTabHeight = () => {
    tabHeight.stopAnimation(value => {
      if (value > COLLAPSED_HEIGHT) collapseTab();
      else expandTab();
    });
  };

  const handleToggleFromChild = (open) => {
    if (open) expandTab();
    else collapseTab();
  };

  // When a user taps an event in a list, find the closest marker and select it
  const handleEventPress = (event) => {
    if (!event || !event.location) {
      // fallback: open the Event page if no coordinate
      navigation.navigate('Event', { event });
      return;
    }

    // find nearest marker by simple squared distance
    let nearest = null;
    let nearestDist = Infinity;
    colomboMarkers.forEach(m => {
      const dLat = (m.coordinate.latitude - event.location.latitude) || 0;
      const dLon = (m.coordinate.longitude - event.location.longitude) || 0;
      const dist = dLat * dLat + dLon * dLon;
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = m;
      }
    });

    // If we found a marker, treat it like a marker press
    if (nearest) {
      setMarkerTitle(event.title || nearest.title || '');
      setSelectedMarkerId(nearest.id);
      // also set selectedEvent to match this event
      const ev = liveEvents.find(e => e.markerId === nearest.id) || event || null;
      setSelectedEvent(ev);
      setCurrentTab('single');
      expandTab();

      // animate map to center the marker (same offset used in handleMarkerPress)
      if (mapRef.current && nearest && nearest.coordinate) {
        try {
          const offsetLat = 0.0040;
          mapRef.current.animateToRegion({
            latitude: nearest.coordinate.latitude + offsetLat,
            longitude: nearest.coordinate.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }, 450);
        } catch (e) {}
      }
    } else {
      // no nearby marker: open event page
      setSelectedEvent(event);
      navigation.navigate('Event', { event });
    }
  };

  // a modest dark map style. You can replace with any map style JSON.
  const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  ];

  const Arrow = () => {
    const rotation = tabHeight.interpolate({
      inputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
      outputRange: ['0deg', '180deg'],
    });
    return (
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Image source={require('../../../assets/images/icons/arrowupwhite.png')} style={styles.arrowIcon} />
      </Animated.View>
    );
  };

  const Heading = () => (
    <Text style={styles.tabHeaderText}>
      {currentTab === 'events' ? 'Events Happening Near You' : markerTitle}
    </Text>
  );
  
  const renderTabHeader = () => {
    return (
      <TouchableOpacity style={styles.tabHeader} onPress={toggleTabHeight} {...panResponder.panHandlers}>
        <Arrow />
        <Heading />
      </TouchableOpacity>
    );
  };

  // PanResponder for the bottom tab (detect vertical swipes anywhere on the tab)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const dy = gestureState.dy || 0;
        const dx = gestureState.dx || 0;
        // Only capture when there's a clear vertical swipe (large enough and more vertical than horizontal)
        return Math.abs(dy) > 30 && Math.abs(dy) > Math.abs(dx);
      },
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -20) {
          // swipe up
          expandTab();
        } else if (gestureState.dy > 20) {
          // swipe down
          collapseTab();
        }
      },
    })
  ).current;

  // Calculate a height for the upcoming list based on the animated tabHeight
  // topReserved approximates the vertical space taken by header + top carousel
  // reduced so the list has enough room to show three items
  const topReserved = 80; // adjust if header or carousel sizes change
  const upcomingHeight = tabHeight.interpolate({
    inputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
    outputRange: [COLLAPSED_HEIGHT - topReserved, EXPANDED_HEIGHT - topReserved],
    extrapolate: 'clamp',
  });

  // Viewability: mark 'seenAllUpcoming' when the last item is at least partly visible
  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!upcoming || upcoming.length === 0) return;
    const lastId = upcoming[upcoming.length - 1].id;
    const lastVisible = viewableItems.some(v => v.item && v.item.id === lastId);
    if (lastVisible) setSeenAllUpcoming(true);
  }).current;

  return (
    <GradientBackground style={styles.container}>
      {/* Google Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        provider="google"
        customMapStyle={darkMapStyle}
        onPress={() => {
          // deselect any marker when tapping the map background
          setCurrentTab('events');
          setSelectedMarkerId(null);
          setSelectedEvent(null);
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        toolbarEnabled={true}
        zoomControlEnabled={true}
        rotateEnabled={true}
        mapType="standard"
        onMapReady={() => {}}
      >
        {/* Render markers for Colombo nightlife (custom icon) */}
        {/* Use today's events to generate markers so past/future events don't show on map */}
        {todaysEvents.map((ev) => {
          // find matching marker by markerId or fallback to nearest marker by coordinate
          const m = colomboMarkers.find(mk => mk.id === ev.markerId) || {
            id: ev.id,
            coordinate: ev.location || { latitude: 0, longitude: 0 },
            title: ev.title || ev.venueName || 'Event',
          };
          return <MapMarker key={m.id} m={m} selected={selectedMarkerId === m.id} onPress={handleMarkerPress} />;
        })}

      </MapView>

      {/* Vendor FAB (show only for vendors later) */}
      <VendorFAB onPress={() => navigation.navigate('CreateEvent')} />

     {/* Animated Bottom Tab */}
     <Animated.View style={[styles.bottomTab, { height: tabHeight }]}>
       {/* Gradient background for the bottom tab (behind content) */}
       <GradientBackground style={styles.bottomTabGradient} pointerEvents="none" />
        {renderTabHeader()}

        {/* Conditionally render BottomTabEvents or BottomTabSingle based on the currentTab state */}
        {currentTab === 'events' ? (
          <BottomTabEvents data={todaysEvents} onEventPress={handleEventPress} />
        ) : (
          <BottomTabSingle markerTitle={markerTitle} selectedEvent={selectedEvent} />
        )}

        {/* Add your tab content here */}
        <View style={styles.tabContent}>
         {/* Only show 'Upcoming Events' and the list when expanded */}
         {isExpanded && (
           <>
             <Text style={styles.tabContentHeading}>Upcoming Events</Text>

             <FlatList
                data={upcoming}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled={true}
                scrollEnabled={true}
                removeClippedSubviews={false}
                keyboardShouldPersistTaps="handled"
                overScrollMode="always"
                style={[styles.upcomingList, { flex: 1 }]}
                showsVerticalScrollIndicator={true}
                onEndReached={() => setSeenAllUpcoming(true)}
                onEndReachedThreshold={0.5}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item }) => (
                 <TouchableOpacity onPress={() => handleEventPress(item)}>
                   <ImageBackground source={require('../../../assets/images/eventbg.png')} style={styles.eventCard} imageStyle={styles.eventCardImage}>
                     <View style={styles.eventOverlay}>
                       <Text style={styles.eventTitle}>{item.title || item.name}</Text>
                       <Text style={styles.eventSubtitle}>{item.venueName || item.place} • {item.performer || item.artist}</Text>
                       <Text style={styles.eventDate}>{item.startTime ? item.startTime.toLocaleString() : ''}</Text>
                     </View>
                   </ImageBackground>
                 </TouchableOpacity>
               )}
               contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 0, alignItems: 'stretch' }}
               ListFooterComponent={(isExpanded && seenAllUpcoming) ? (
                 <Text style={styles.cantFindText}>Can't find what you're looking for?{ '\n'}<Text style={styles.exploreMoreText}>Explore More</Text></Text>
               ) : null}
             />
           </>
         )}
     </View>
      </Animated.View>
    </GradientBackground>
  );
};

// PulsingMarker: shows a stronger radar effect clipped to a circle
const PulsingMarker = ({ children, size = 80, pulseColor = 'rgba(229,57,53,0.34)' }) => {
  const scale1 = useRef(new Animated.Value(0)).current;
  const opacity1 = useRef(new Animated.Value(0.8)).current;
  const scale2 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim1 = Animated.sequence([
      Animated.parallel([
        Animated.timing(scale1, { toValue: 2.8, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(opacity1, { toValue: 0, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: false }),
      ]),
      Animated.timing(scale1, { toValue: 0, duration: 0, useNativeDriver: false }),
      Animated.timing(opacity1, { toValue: 0.8, duration: 0, useNativeDriver: false }),
      Animated.delay(500),
    ]);

    const anim2 = Animated.sequence([
      Animated.delay(250),
      Animated.parallel([
        Animated.timing(scale2, { toValue: 1.9, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: false }),
        Animated.timing(opacity2, { toValue: 0, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: false }),
      ]),
      Animated.timing(scale2, { toValue: 0, duration: 0, useNativeDriver: false }),
      Animated.timing(opacity2, { toValue: 0.6, duration: 0, useNativeDriver: false }),
      Animated.delay(500),
    ]);

    const loop = Animated.loop(Animated.parallel([anim1, anim2]));
    loop.start();
    return () => loop.stop();
  }, [scale1, opacity1, scale2, opacity2]);

  const outerSize = size * 1.8;

  return (
    // circular container with overflow hidden so pulses are clipped to a circle
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: outerSize,
          height: outerSize,
          borderRadius: outerSize / 2,
          backgroundColor: pulseColor,
          transform: [{ scale: scale1 }],
          opacity: opacity1,
        }}
      />

      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: outerSize * 0.9,
          height: outerSize * 0.9,
          borderRadius: (outerSize * 0.9) / 2,
          backgroundColor: 'rgba(229,57,53,0.18)',
          transform: [{ scale: scale2 }],
          opacity: opacity2,
        }}
      />

      <View style={{ width: size * 0.5, height: size * 0.5, alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',

    justifyContent: 'flex-end', 
  },
  viewflat:{
height:180,
  },
  tabContent: {
    marginTop: 0,
    padding: 0,
    paddingTop: 0,
    alignItems: 'stretch',
    marginBottom: 0,
    paddingHorizontal: 20, // consistent horizontal padding for heading and list
    flex: 1,
    justifyContent: 'flex-start',
  },
  tabContentHeading: {
    fontSize: 24,
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
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, 
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent', // let gradient show through
    borderTopWidth: 0,
    borderTopColor: 'gray',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    overflow: 'hidden',

  },
  bottomTabGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    zIndex: 0,
  },

  tabHeader: {
    flexDirection: 'column',
     // Keep center alignment
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 20, // match tabContent paddingHorizontal and BottomTabEvents
  },
  
  tabHeaderTextContainer: {
    alignSelf: 'flex-start', 
    marginLeft:-70, // Align the text to the left
  },
  
  tabHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 0,
    alignSelf: 'flex-start',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center', 
    alignSelf: 'center',
    marginBottom: 6,
  },
  gridItem: {
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop:10,
  },
  gridImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
    justifyContent: 'center',
  },
  // (using native marker images now) keep some sizing values in case needed elsewhere
  markerImageFallback: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  gridText: {
    fontSize: 17,
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
    
    fontSize: 13,
     // Adjust the font size as needed
  },
  additionalImage: {
    display: 'none',
  },
  eventCard: {
    width: '100%',
    height: 120,
    marginVertical: 10,
    marginHorizontal: 0,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventCardImage: {
    // borderRadius handled by container + overflow
  },
  eventOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  eventSubtitle: {
    color: '#ddd',
    fontSize: 12,
    marginTop: 4,
  },
  eventDate: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 6,
  },
  upcomingList: {
    flex: 1,
    marginTop: 10,
  },

});

// Add a small floating action button for vendors (UI only). Will be shown conditionally by role in future.
const VendorFAB = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ position: 'absolute', bottom: 260, right: 20, backgroundColor: '#e63946', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6 }}>
    <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700' }}>+</Text>
  </TouchableOpacity>
);

export default HomeScreen;
