import React, { useEffect, useRef } from 'react';
import { View, Image, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import events from './dummyEvents';

const ITEM_WIDTH = 110;
const ITEM_MARGIN_HORIZONTAL = 12; // matches styles.gridItem marginHorizontal
const ITEM_TOTAL_WIDTH = ITEM_WIDTH + ITEM_MARGIN_HORIZONTAL * 2;

const BottomTab = ({ data = events, onEventPress = () => {} }) => {
  const navigation = useNavigation();
  const flatRef = useRef(null);
  const rafRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const paused = useRef(false);
  const resumeTimeout = useRef(null);

  // Duplicate data so we can seamlessly loop: [ ...data, ...data ]
  const carouselData = data && data.length ? [...data, ...data] : [];
  const halfWidth = (data && data.length) ? ITEM_TOTAL_WIDTH * data.length : 0;

  // pixels per frame (at ~60fps). Tune this for slower/faster scroll.
  const SPEED_PX_PER_FRAME = 0.6; // ~36px/sec

  useEffect(() => {
    startAnimation();
    return () => {
      stopAnimation();
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const step = () => {
    // if paused, keep the RAF running but don't advance
    if (!flatRef.current) {
      rafRef.current = requestAnimationFrame(step);
      return;
    }

    if (!paused.current) {
      scrollOffsetRef.current += SPEED_PX_PER_FRAME;

      // when we've scrolled past the first copy, jump back by halfWidth
      if (halfWidth > 0 && scrollOffsetRef.current >= halfWidth) {
        scrollOffsetRef.current -= halfWidth;
        // set offset without animation so the user doesn't see the jump (the duplicated content makes this seamless)
        flatRef.current.scrollToOffset({ offset: scrollOffsetRef.current, animated: false });
      } else {
        // continuous movement
        flatRef.current.scrollToOffset({ offset: scrollOffsetRef.current, animated: false });
      }
    }

    rafRef.current = requestAnimationFrame(step);
  };

  const startAnimation = () => {
    stopAnimation();
    rafRef.current = requestAnimationFrame(step);
  };

  const stopAnimation = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const handleTouchStart = () => {
    paused.current = true;
    if (resumeTimeout.current) {
      clearTimeout(resumeTimeout.current);
      resumeTimeout.current = null;
    }
  };

  const handleTouchEnd = () => {
    // resume after a short delay so the user can finish interaction
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      paused.current = false;
      // ensure RAF is running
      if (!rafRef.current) startAnimation();
    }, 900);
  };

  const onMomentumScrollEnd = (ev) => {
    const offsetX = ev.nativeEvent.contentOffset.x || 0;
    // keep ref in sync so the smooth animation continues from user's position
    scrollOffsetRef.current = offsetX;
    // if user scrolled into the second half, normalize back into first half for continuity
    if (halfWidth > 0 && scrollOffsetRef.current >= halfWidth) {
      scrollOffsetRef.current -= halfWidth;
      flatRef.current && flatRef.current.scrollToOffset({ offset: scrollOffsetRef.current, animated: false });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem} onPress={() => onEventPress(item)} activeOpacity={0.9}>
      <Image source={item.source} style={styles.gridImage} />
      <Text style={styles.gridText} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.placeText} numberOfLines={1}>{item.place}</Text>
    </TouchableOpacity>
  );

  if (!carouselData.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={carouselData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        getItemLayout={(d, index) => ({ length: ITEM_TOTAL_WIDTH, offset: ITEM_TOTAL_WIDTH * index, index })}
        // pause auto-scroll while user interacts
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onScroll={(ev) => {
          // keep offset in sync while user is dragging/scrolling
          const offsetX = ev.nativeEvent.contentOffset.x || 0;
          scrollOffsetRef.current = offsetX;
          // if user dragged into the second half, normalize immediately to keep loop seamless
          if (halfWidth > 0 && scrollOffsetRef.current >= halfWidth) {
            scrollOffsetRef.current -= halfWidth;
            flatRef.current && flatRef.current.scrollToOffset({ offset: scrollOffsetRef.current, animated: false });
          }
        }}
        scrollEventThrottle={16}
        onScrollBeginDrag={handleTouchStart}
        onScrollEndDrag={handleTouchEnd}
        onMomentumScrollEnd={onMomentumScrollEnd}
        // start centered so the loop appears seamless on mount
        onLayout={() => {
          // ensure initial position is at the start of the first copy
          scrollOffsetRef.current = 0;
          flatRef.current && flatRef.current.scrollToOffset({ offset: 0, animated: false });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
  },
  contentContainer: {
    paddingLeft: 20, // align with page headings (HomeView tab/content padding)
    paddingRight: 12,
  },
  gridItem: {
    alignItems: 'center',
    marginHorizontal: ITEM_MARGIN_HORIZONTAL,
    marginTop: 10,
    width: ITEM_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
  },
  gridImage: {
    width: ITEM_WIDTH,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  gridText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
    width: ITEM_WIDTH,
  },
  placeText: {
    marginTop: 4,
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    width: ITEM_WIDTH,
  },
  flatList: {
    marginTop: 6,
  },
});

export default BottomTab;
