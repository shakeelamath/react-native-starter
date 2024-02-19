import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';

const BottomTab = ({ data }) => {
  const renderItem = ({ item }) => (
    <View style={styles.gridItem}>
      <Image source={item.source} style={styles.gridImage} />
      <Text style={styles.gridText}>{item.text}</Text>
      <Text style={styles.additionalText}>{item.additionalText}</Text>
    </View>
  );

  return (
    <View style={styles.viewflat}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        style={styles.flatList}
      />
    </View>
  );
};

const styles = {
  viewflat: {
    height: 180,
  },
  gridItem: {
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 10,
  },
  gridImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
    justifyContent: 'center',
  },
  gridText: {
    fontSize: 17,
    marginTop: 5,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  additionalText: {
    marginTop: 5,
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 0,
    fontSize: 13,
    // Adjust the font size as needed
  },
  flatList: {
    zIndex: 1,
    overflow: 'hidden',
  },
};

export default BottomTab;
