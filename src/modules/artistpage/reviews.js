import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Modal } from 'react-native';
import { initializeApp } from '@react-native-firebase/app';
import { getDatabase, ref, push, onValue } from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const Reviews = () => {
  const [reviewData, setReviewData] = useState([]);
  const [showReviewTab, setShowReviewTab] = useState(false);
  const [reviewText, setReviewText] = useState('');

  // Get the Firebase database instance
  const database = getDatabase();

  useEffect(() => {
    // Fetch reviews from Firebase when the component mounts
    const reviewsRef = ref(database, 'reviews');
    onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const reviewsArray = Object.values(data);
        setReviewData(reviewsArray);
      }
    });
  }, []); // Empty dependency array to run only once when the component mounts

  const openReviewTab = () => setShowReviewTab(true);

  const closeReviewTab = () => {
    setShowReviewTab(false);
    setReviewText(''); // Clear review text on close
  };

  const submitReview = () => {
    if (reviewText.trim() !== '') {
      // Push review to Firebase along with user information
      const user = auth().currentUser;
      const reviewsRef = ref(database, 'reviews');
      push(reviewsRef, {
        text: reviewText,
        userId: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      closeReviewTab();
    }
  };

  return (
    <ScrollView style={styles.scrollableContent}>
      <View style={styles.reviewsContainer}>
        {reviewData.map((review, index) => (
          <View key={index} style={styles.reviewItem}>
            <Image source={{ uri: review.photoURL }} style={styles.profileImage} />
            <View style={styles.reviewContent}>
              <Text style={styles.reviewDisplayName}>{review.displayName}</Text>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Leave a review button */}
      <TouchableOpacity style={styles.leaveReviewButton} onPress={openReviewTab}>
        <Text style={styles.leaveReviewText}>Leave a Review</Text>
      </TouchableOpacity>

      {/* Review tab as a Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showReviewTab}
        onRequestClose={closeReviewTab}
      >
        <View style={styles.reviewTab}>
          <TouchableOpacity style={styles.closeButton} onPress={closeReviewTab}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Write your review here"
            multiline
            style={styles.reviewInput}
            value={reviewText}
            onChangeText={(text) => setReviewText(text)}
          />
          <TouchableOpacity style={styles.submitReviewButton} onPress={submitReview}>
            <Text style={styles.submitReviewText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollableContent: {
    flex: 1,
  },
  reviewsContainer: {
    padding: 40,
    marginTop: 10,
  },
  reviewItem: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
  },
  reviewText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  reviewTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    padding: 16,
    // Set the maximum height to the full height of the screen
  },
  reviewInput: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    color: 'white',
    textAlignVertical: 'top', 
    verticalAlign:'middle',
     // Align the text to the top
  },
  leaveReviewButton: {
    alignSelf: 'center',
    marginTop: 0,
    padding: 20,
    paddingRight:40,
    paddingLeft:40,
    backgroundColor: 'red',
    borderRadius: 15,
    alignItems: 'center',  // Center the text horizontally
  },
  leaveReviewText: {
    color: 'white',
    fontSize: 20,
    fontWeight:'bold',// Center the text within the button
  },
  submitReviewButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  submitReviewText: {
    color: 'white',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
  },
  reviewContent: {
    flex: 1,
  },
  reviewDisplayName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Reviews;
