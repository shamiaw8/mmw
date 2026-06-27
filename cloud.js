import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

export async function addUserItem(userId, collectionName, data) {
  const ref = collection(db, "users", userId, collectionName);

  await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function getUserItems(userId, collectionName) {
  const ref = collection(db, "users", userId, collectionName);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

export async function deleteUserItem(userId, collectionName, itemId) {
  await deleteDoc(doc(db, "users", userId, collectionName, itemId));
}

export async function updateUserItem(userId, collectionName, itemId, data) {
  await updateDoc(doc(db, "users", userId, collectionName, itemId), data);
}

export async function saveUserProfile(userId, data) {
  await setDoc(doc(db, "users", userId), data, { merge: true });
}

export async function getUserProfile(userId) {
  const snapshot = await getDoc(doc(db, "users", userId));
  return snapshot.exists() ? snapshot.data() : {};
}
