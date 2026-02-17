import { firestore, storage } from './firebase';

// Events collection name
const EVENTS_COLL = 'events';

// Convert a Firestore doc to a plain event object with JS Date fields
function docToEvent(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    // Firestore Timestamp -> JS Date
    startTime: data.startTime && data.startTime.toDate ? data.startTime.toDate() : (data.startTime || null),
    endTime: data.endTime && data.endTime.toDate ? data.endTime.toDate() : (data.endTime || null),
  };
}

// Listen to published events in realtime. Returns unsubscribe function.
export function listenPublishedEvents(onUpdate, options = {}) {
  // options: { center, radiusKm, todayOnly: boolean }
  let query = firestore().collection(EVENTS_COLL).where('status', '==', 'published');

  // keep simple for now - order by start time
  query = query.orderBy('startTime', 'asc').limit(200);

  const unsubscribe = query.onSnapshot(snapshot => {
    const events = [];
    snapshot.forEach(doc => events.push(docToEvent(doc)));
    onUpdate(events);
  }, (err) => {
    console.warn('listenPublishedEvents error', err && err.message);
    onUpdate([]);
  });

  return unsubscribe;
}

// Helper to upload a single local file path to storage and return download URL
async function uploadFileAndGetUrl(vendorId, eventId, localPath) {
  // localPath is expected to be a file:// or content:// uri from the image picker
  const filename = localPath.split('/').pop() || `image-${Date.now()}.jpg`;
  const storagePath = `events/${vendorId}/${eventId}/${filename}`;
  const ref = storage().ref(storagePath);
  // putFile supports local URIs; it returns a task, await to finish
  await ref.putFile(localPath);
  const url = await ref.getDownloadURL();
  return url;
}

// Create event. images param is array of local file URIs (from image picker)
export async function createEvent(vendorId, eventData, images = []) {
  // eventData: { title, description, startTime: Date|string, endTime: Date|string, location: { latitude, longitude }, venueName, status }
  const docRef = firestore().collection(EVENTS_COLL).doc();
  const eventId = docRef.id;

  // createdAt: try to use Firestore FieldValue if available, otherwise fallback to JS Date
  let createdAt;
  try {
    if (firestore.FieldValue && typeof firestore.FieldValue.serverTimestamp === 'function') {
      createdAt = firestore.FieldValue.serverTimestamp();
    } else if (firestore().FieldValue && typeof firestore().FieldValue.serverTimestamp === 'function') {
      createdAt = firestore().FieldValue.serverTimestamp();
    } else {
      createdAt = new Date();
    }
  } catch (e) {
    createdAt = new Date();
  }

  // Upload images if provided and collect download URLs
  const imageUrls = [];
  try {
    for (const img of images) {
      if (!img) continue;
      try {
        const url = await uploadFileAndGetUrl(vendorId, eventId, img);
        imageUrls.push(url);
      } catch (uploadErr) {
        console.warn('upload image failed', uploadErr && uploadErr.message);
      }
    }
  } catch (e) {
    console.warn('image upload loop failed', e && e.message);
  }

  // Prepare Firestore-friendly payload
  // If real Firestore Timestamp helpers are available, convert Date -> Timestamp. Otherwise store plain Date objects.
  const safeStart = eventData.startTime ? new Date(eventData.startTime) : null;
  const safeEnd = eventData.endTime ? new Date(eventData.endTime) : null;

  let maybeStart = safeStart;
  let maybeEnd = safeEnd;

  try {
    if (firestore.Timestamp && typeof firestore.Timestamp.fromDate === 'function') {
      maybeStart = safeStart ? firestore.Timestamp.fromDate(safeStart) : null;
      maybeEnd = safeEnd ? firestore.Timestamp.fromDate(safeEnd) : null;
    } else if (firestore().Timestamp && typeof firestore().Timestamp.fromDate === 'function') {
      maybeStart = safeStart ? firestore().Timestamp.fromDate(safeStart) : null;
      maybeEnd = safeEnd ? firestore().Timestamp.fromDate(safeEnd) : null;
    }
  } catch (e) {
    // leave as plain Date
  }

  const payload = {
    vendorId,
    title: eventData.title || '',
    description: eventData.description || '',
    images: imageUrls,
    // store timestamps as Firestore Timestamp when possible
    startTime: maybeStart,
    endTime: maybeEnd,
    // store location as plain object { latitude, longitude }
    location: eventData.location || null,
    venueName: eventData.venueName || '',
    status: eventData.status || 'published',
    createdAt,
  };

  await docRef.set(payload);
  return eventId;
}

export default { listenPublishedEvents, createEvent };
