import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { User } from '../types';

// Your Firebase config - you'll need to replace these with your actual values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

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
    console.log('🔄 Creating user in Firebase Auth...');
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ User created in Firebase Auth:', user.uid);

    console.log('🔄 Updating display name...');
    // Update display name
    await updateProfile(user, { displayName: name });
    console.log('✅ Display name updated');

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
    await setDoc(doc(db, 'users', user.uid), userData);
    console.log('✅ User data saved to Firestore');

    return userData;
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email already registered');
    }
    throw new Error(error.message);
  }
};

// Login user
export const loginUserWithFirebase = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data() as User;

    // Check if user is active
    if (!userData.isActive) {
      throw new Error('Account is deactivated. Please contact administrator.');
    }

    // Update last login
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date().toISOString()
    });

    return userData;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password');
    }
    throw new Error(error.message);
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  const user = auth.currentUser;
  return user ? convertFirebaseUser(user) : null;
};

// Get all users (for admin)
export const getAllUsersFromFirebase = async (): Promise<User[]> => {
  try {
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
    await updateDoc(doc(db, 'users', userId), { isActive });
  } catch (error) {
    throw new Error('Failed to update user status');
  }
};

// Update user role
export const updateUserRoleInFirebase = async (userId: string, role: 'user' | 'admin'): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), { role });
  } catch (error) {
    throw new Error('Failed to update user role');
  }
};

// Delete user
export const deleteUserFromFirebase = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};

// Update user profile
export const updateUserProfileInFirebase = async (userId: string, name: string, email: string): Promise<User> => {
  try {
    await updateDoc(doc(db, 'users', userId), { name, email });
    
    // Get updated user data
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.data() as User;
  } catch (error) {
    throw new Error('Failed to update user profile');
  }
}; 