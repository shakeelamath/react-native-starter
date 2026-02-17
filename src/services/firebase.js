// Lightweight Firebase stub used when native @react-native-firebase/* packages are not installed.
// This stub now includes a simple in-memory Firestore data store and auth implementation
// so UI flows like vendor signup/login and user role creation work during frontend development.

const _inMemoryDB = {
  users: {},
  events: {},
};

// Auth state
const _authUsersByEmail = {}; // email -> { uid, email, password, displayName }
let _currentUser = null;
const _authStateListeners = [];

function _emailToUid(email) {
  // simple deterministic uid for the stub
  return `uid_${Buffer.from(email).toString('hex').slice(0,12)}`;
}

function _notifyAuthStateChanged(user) {
  _authStateListeners.forEach(cb => {
    try { cb(user); } catch (e) { /* ignore */ }
  });
}

// Collection listeners for firestore onSnapshot
const _collectionListeners = {}; // collectionName -> [callback,...]

function _notifyCollectionListeners(collectionName) {
  const listeners = _collectionListeners[collectionName] || [];
  const coll = _inMemoryDB[collectionName] || {};
  // build snapshot-like object with forEach
  const docs = Object.keys(coll).map(id => ({ id, data: () => coll[id] }));
  const snapshot = {
    forEach: (fn) => { docs.forEach(d => fn(d)); },
  };
  listeners.forEach(cb => {
    try { cb(snapshot); } catch (e) { /* ignore */ }
  });
}

function _makeDocRef(collectionName, id) {
  const docId = id || `doc_${Date.now()}_${Math.floor(Math.random()*10000)}`;
  return {
    id: docId,
    async set(data) {
      _inMemoryDB[collectionName] = _inMemoryDB[collectionName] || {};
      _inMemoryDB[collectionName][this.id] = JSON.parse(JSON.stringify(data));
      // notify listeners for this collection
      _notifyCollectionListeners(collectionName);
      return;
    },
    async get() {
      const coll = _inMemoryDB[collectionName] || {};
      const exists = !!coll[this.id];
      return {
        exists,
        id: this.id,
        data: () => (exists ? coll[this.id] : undefined),
      };
    },
    async delete() {
      const coll = _inMemoryDB[collectionName] || {};
      delete coll[this.id];
      _notifyCollectionListeners(collectionName);
      return;
    }
  };
}

function firestore() {
  return {
    collection: (name) => {
      return {
        doc: (id) => _makeDocRef(name, id),
        where: function() {
          // return a query-like object that supports orderBy().limit().onSnapshot()
          const self = this;
          return {
            orderBy: () => ({ limit: () => ({ onSnapshot: (onSuccess) => {
              // register the onSuccess as a listener for this collection
              _collectionListeners[name] = _collectionListeners[name] || [];
              _collectionListeners[name].push(onSuccess);
              // immediately call with current data
              setTimeout(() => _notifyCollectionListeners(name), 0);
              // return unsubscribe
              return () => {
                _collectionListeners[name] = (_collectionListeners[name] || []).filter(cb => cb !== onSuccess);
              };
            } }) }),
            onSnapshot: (onSuccess) => {
              _collectionListeners[name] = _collectionListeners[name] || [];
              _collectionListeners[name].push(onSuccess);
              setTimeout(() => _notifyCollectionListeners(name), 0);
              return () => { _collectionListeners[name] = (_collectionListeners[name] || []).filter(cb => cb !== onSuccess); };
            }
          };
        },
        orderBy: function() {
          return { limit: () => ({ onSnapshot: (onSuccess) => {
            _collectionListeners[name] = _collectionListeners[name] || [];
            _collectionListeners[name].push(onSuccess);
            setTimeout(() => _notifyCollectionListeners(name), 0);
            return () => { _collectionListeners[name] = (_collectionListeners[name] || []).filter(cb => cb !== onSuccess); };
          } }) };
        },
        limit: function() {
          return { onSnapshot: (onSuccess) => {
            _collectionListeners[name] = _collectionListeners[name] || [];
            _collectionListeners[name].push(onSuccess);
            setTimeout(() => _notifyCollectionListeners(name), 0);
            return () => { _collectionListeners[name] = (_collectionListeners[name] || []).filter(cb => cb !== onSuccess); };
          } };
        },
        onSnapshot: (onSuccess) => {
          _collectionListeners[name] = _collectionListeners[name] || [];
          _collectionListeners[name].push(onSuccess);
          setTimeout(() => _notifyCollectionListeners(name), 0);
          return () => { _collectionListeners[name] = (_collectionListeners[name] || []).filter(cb => cb !== onSuccess); };
        },
      };
    },
    FieldValue: {
      serverTimestamp: () => new Date(),
    },
    Timestamp: {
      fromDate: d => d,
    },
  };
}

function auth() {
  return {
    async createUserWithEmailAndPassword(email, password) {
      const uid = _emailToUid(email);
      _authUsersByEmail[email] = { uid, email, password, displayName: '' };
      _currentUser = { uid, email, displayName: '' };
      _notifyAuthStateChanged(_currentUser);
      return { user: _currentUser };
    },
    async signInWithEmailAndPassword(email, password) {
      const rec = _authUsersByEmail[email];
      if (!rec || rec.password !== password) {
        const err = new Error('Invalid email or password (stub auth)');
        err.code = 'auth/invalid-credentials';
        throw err;
      }
      _currentUser = { uid: rec.uid, email: rec.email, displayName: rec.displayName || '' };
      _notifyAuthStateChanged(_currentUser);
      return { user: _currentUser };
    },
    get currentUser() { return _currentUser; },
    onAuthStateChanged(cb) {
      _authStateListeners.push(cb);
      // call immediately with current user
      setTimeout(() => cb(_currentUser), 0);
      return () => { const idx = _authStateListeners.indexOf(cb); if (idx >= 0) _authStateListeners.splice(idx, 1); };
    },
    async signOut() { _currentUser = null; _notifyAuthStateChanged(null); return; },
    useEmulator: () => {},
  };
}

function storage() {
  return {
    ref: (path) => ({
      putFile: async (localPath) => {
        return { task: true };
      },
      getDownloadURL: async () => {
        return '';
      },
    }),
    useEmulator: () => {},
  };
}

function app() { return { name: 'stub-app' }; }

// Attach compatibility properties so modules that expect `firestore.FieldValue` / `firestore.Timestamp`
// (the common pattern with the real @react-native-firebase package) continue to work when using this stub.
try {
  // call firestore() to obtain the helper objects and copy them onto the function object
  firestore.FieldValue = firestore().FieldValue;
  firestore.Timestamp = firestore().Timestamp;
} catch (e) {
  // ignore if something goes wrong — the stub still works via firestore() calls
}

export { app, auth, firestore, storage };

// Developer notes (same as before): to use real Firebase, install @react-native-firebase/* packages
// and replace this file with actual imports. This stub is only for local UI development and testing.
