import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User as FirebaseUser, Auth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, Firestore } from 'firebase/firestore';
import { User } from '../types';

// Debug: Log Firebase environment variables
console.log('🔧 Firebase Environment Variables Check:');
console.log('API Key exists:', !!process.env.REACT_APP_FIREBASE_API_KEY);
console.log('Auth Domain exists:', !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
console.log('Project ID exists:', !!process.env.REACT_APP_FIREBASE_PROJECT_ID);
console.log('Storage Bucket exists:', !!process.env.REACT_APP_FIREBASE_STORAGE_BUCKET);
console.log('Messaging Sender ID exists:', !!process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID);
console.log('App ID exists:', !!process.env.REACT_APP_FIREBASE_APP_ID);

// Your Firebase config - you'll need to replace these with your actual values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || ''
};

// Check if all required Firebase config values are present
const missingConfigs = [];
if (!firebaseConfig.apiKey) missingConfigs.push('REACT_APP_FIREBASE_API_KEY');
if (!firebaseConfig.authDomain) missingConfigs.push('REACT_APP_FIREBASE_AUTH_DOMAIN');
if (!firebaseConfig.projectId) missingConfigs.push('REACT_APP_FIREBASE_PROJECT_ID');
if (!firebaseConfig.storageBucket) missingConfigs.push('REACT_APP_FIREBASE_STORAGE_BUCKET');
if (!firebaseConfig.messagingSenderId) missingConfigs.push('REACT_APP_FIREBASE_MESSAGING_SENDER_ID');
if (!firebaseConfig.appId) missingConfigs.push('REACT_APP_FIREBASE_APP_ID');

if (missingConfigs.length > 0) {
  console.error('❌ Missing Firebase environment variables:', missingConfigs);
  console.error('Please create a .env file with the required Firebase configuration.');
  console.error('See firebase.env.example for the required variables.');
  console.error('Firebase will not initialize properly without these variables.');
}

// Only initialize Firebase if we have the minimum required configuration
let app;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase initialized successfully');
  } else {
    console.error('❌ Firebase not initialized - missing required configuration');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

export { auth, db };

// Convert Firebase user to our User type
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || '',
    savedArticles: [],
    role: 'user',
    isActive: true,
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
};

// Register new user
export const registerUserWithFirebase = async (email: string, password: string, name: string): Promise<User> => {
  try {
    if (!auth || !db) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }

    console.log('🔄 Creating user in Firebase Auth...');
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ User created in Firebase Auth:', user.uid);

    console.log('🔄 Updating display name...');
    // Update display name
    try {
      await updateProfile(user, { displayName: name });
      console.log('✅ Display name updated');
    } catch (profileError) {
      console.warn('⚠️ Failed to update display name:', profileError);
      // Don't fail registration if display name update fails
    }

    // Create user document in Firestore
    const userData: User = {
      id: user.uid,
      email: user.email || '',
      name,
      savedArticles: [],
      role: email === 'admin@newsapp.com' ? 'admin' : 'user', // Make admin@newsapp.com an admin
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    console.log('🔄 Saving user data to Firestore...');
    try {
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('✅ User data saved to Firestore');
    } catch (firestoreError) {
      console.error('❌ Failed to save user data to Firestore:', firestoreError);
      console.log('⚠️ Continuing with registration despite Firestore error');
      // Don't fail registration if Firestore is unavailable
    }

    return userData;
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already registered');
    }
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
};

// Login user
export const loginUserWithFirebase = async (email: string, password: string): Promise<User> => {
  try {
    if (!auth || !db) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }

    console.log('🔄 Attempting to sign in with Firebase Auth...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ Firebase Auth sign in successful:', user.uid);

    // Get user data from Firestore
    try {
      console.log('🔄 Attempting to get user data from Firestore...');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        console.warn('⚠️ User document not found in Firestore, creating fallback data');
        // Create fallback user data
        const userData: User = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          savedArticles: [],
          role: 'user',
          isActive: true,
          createdAt: user.metadata.creationTime || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        console.log('✅ Using fallback user data for login:', userData);
        return userData;
      }

      const userData = userDoc.data() as User;
      console.log('✅ User data loaded from Firestore:', userData);

      // Check if user is active
      if (!userData.isActive) {
        throw new Error('Account is deactivated. Please contact administrator.');
      }

      // Update last login (non-blocking)
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date().toISOString()
        });
        console.log('✅ Last login updated in Firestore');
      } catch (updateError) {
        console.warn('⚠️ Failed to update last login in Firestore:', updateError);
        // Don't fail the login if this update fails
      }

      return userData;
    } catch (firestoreError) {
      console.error('❌ Firestore error during login:', firestoreError);
      // Create fallback user data if Firestore is unavailable
      const userData: User = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        savedArticles: [],
        role: 'user',
        isActive: true,
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      console.log('✅ Using fallback user data due to Firestore error:', userData);
      return userData;
    }
  } catch (error: any) {
    console.error('❌ Login error:', error);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password');
    }
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw new Error(error.message || 'Login failed. Please try again.');
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (!auth) {
    console.warn('⚠️ Firebase auth not initialized');
    return null;
  }
  const user = auth.currentUser;
  return user ? convertFirebaseUser(user) : null;
};

// Get all users (for admin)
export const getAllUsersFromFirebase = async (): Promise<User[]> => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

// Update user status
export const updateUserStatusInFirebase = async (userId: string, isActive: boolean): Promise<void> => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }
    await updateDoc(doc(db, 'users', userId), { isActive });
  } catch (error) {
    throw new Error('Failed to update user status');
  }
};

// Update user role
export const updateUserRoleInFirebase = async (userId: string, role: 'user' | 'admin'): Promise<void> => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }
    await updateDoc(doc(db, 'users', userId), { role });
  } catch (error) {
    throw new Error('Failed to update user role');
  }
};

// Delete user
export const deleteUserFromFirebase = async (userId: string): Promise<void> => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }
    await deleteDoc(doc(db, 'users', userId));
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};

// Update user profile
export const updateUserProfileInFirebase = async (userId: string, name: string, email: string): Promise<User> => {
  try {
    if (!db) {
      throw new Error('Firebase not initialized. Please check your environment variables.');
    }
    await updateDoc(doc(db, 'users', userId), { name, email });
    
    // Get updated user data
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.data() as User;
  } catch (error) {
    throw new Error('Failed to update user profile');
  }
}; 