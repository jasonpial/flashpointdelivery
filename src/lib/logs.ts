import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function createLog(uid: string, event: string, status: 'Success' | 'Error' = 'Success') {
  try {
    await addDoc(collection(db, 'logs'), {
      uid,
      event,
      status,
      timestamp: serverTimestamp(),
      ip: '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) // Mock IP
    });
  } catch (err) {
    console.error("Error creating log:", err);
  }
}
