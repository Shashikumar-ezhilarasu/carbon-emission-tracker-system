// lib/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBX_F3gGptRm5DaMfLswr2F1gJ7ER3bM0Q",
  authDomain: "carbone-b96c6.firebaseapp.com",
  projectId: "carbone-b96c6",
  storageBucket: "carbone-b96c6.firebasestorage.app",
  messagingSenderId: "967159806841",
  appId: "1:967159806841:web:64aca1e5a3ba87de854da8",
  measurementId: "G-81B5GQEX28"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// -------------------- USERS --------------------
export async function addUser(data: {
  name: string,
  email: string,
  registrationDate: Date,
  location?: string,
  userSettings?: {
    preferredUnits: string,
    notificationPreferences: string[]
  }
}) {
  const docRef = await addDoc(collection(db, 'users'), {
    ...data,
    registrationDate: Timestamp.fromDate(data.registrationDate)
  });
  return docRef.id;
}

export async function getUsers() {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateUser(id: string, updatedData: any) {
  await updateDoc(doc(db, 'users', id), updatedData);
}

export async function deleteUser(id: string) {
  await deleteDoc(doc(db, 'users', id));
}

// -------------------- ACTIVITIES --------------------
export async function addActivity(data: {
  userId: string,
  timestamp: Date,
  activityType: string,
  details: any,
  carbonEmissions: number
}) {
  const docRef = await addDoc(collection(db, 'activities'), {
    ...data,
    timestamp: Timestamp.fromDate(data.timestamp)
  });
  return docRef.id;
}

export async function getActivities(userId?: string) {
  let q = collection(db, 'activities');
  if (userId) {
    q = query(q, where('userId', '==', userId));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateActivity(id: string, updatedData: any) {
  await updateDoc(doc(db, 'activities', id), updatedData);
}

export async function deleteActivity(id: string) {
  await deleteDoc(doc(db, 'activities', id));
}

// -------------------- EMISSION FACTORS --------------------
export async function addEmissionFactor(data: {
  activityType: string,
  subCategory: string,
  unit: string,
  emissionFactor: number,
  source: string,
  lastUpdated: Date
}) {
  const docRef = await addDoc(collection(db, 'emissionFactors'), {
    ...data,
    lastUpdated: Timestamp.fromDate(data.lastUpdated)
  });
  return docRef.id;
}

export async function getEmissionFactors(activityType?: string) {
  let q = collection(db, 'emissionFactors');
  if (activityType) {
    q = query(q, where('activityType', '==', activityType));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateEmissionFactor(id: string, updatedData: any) {
  await updateDoc(doc(db, 'emissionFactors', id), updatedData);
}

export async function deleteEmissionFactor(id: string) {
  await deleteDoc(doc(db, 'emissionFactors', id));
}

// -------------------- RECOMMENDATIONS --------------------
export async function addRecommendation(data: {
  userId: string,
  timestamp: Date,
  category: string,
  recommendationText: string,
  impactEstimate: number,
  status: string
}) {
  const docRef = await addDoc(collection(db, 'recommendations'), {
    ...data,
    timestamp: Timestamp.fromDate(data.timestamp)
  });
  return docRef.id;
}

export async function getRecommendations(userId?: string) {
  let q = collection(db, 'recommendations');
  if (userId) {
    q = query(q, where('userId', '==', userId));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateRecommendation(id: string, updatedData: any) {
  await updateDoc(doc(db, 'recommendations', id), updatedData);
}

export async function deleteRecommendation(id: string) {
  await deleteDoc(doc(db, 'recommendations', id));
}

// -------------------- EMISSIONS --------------------
export async function addEmission(data: {
  userId: string,
  timestamp: Date,
  activityType: string,
  amount: number,
  unit: string,
  category: string,
  description?: string
}) {
  const docRef = await addDoc(collection(db, 'emissions'), {
    ...data,
    timestamp: Timestamp.fromDate(data.timestamp)
  });
  return docRef.id;
}

export async function getEmissions(userId?: string) {
  let q = collection(db, 'emissions');
  if (userId) {
    q = query(q, where('userId', '==', userId));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateEmission(id: string, updatedData: any) {
  await updateDoc(doc(db, 'emissions', id), updatedData);
}

export async function deleteEmission(id: string) {
  await deleteDoc(doc(db, 'emissions', id));
}
