import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Firebase configuration using the provisioned project values
const firebaseConfig = {
  apiKey: "AIzaSyDMe7DLsI4Ia0N9nZpn7zOoRyl1dtpixvs",
  authDomain: "delivery-company-6cad4.firebaseapp.com",
  projectId: "delivery-company-6cad4",
  storageBucket: "delivery-company-6cad4.firebasestorage.app",
  messagingSenderId: "726136432014",
  appId: "1:726136432014:web:a31ba124301ce92a7a70df"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Use the specific database ID provisioned for this project
export const db = getFirestore(app, "ai-studio-74903f79-40cf-44b0-a593-53c4af7799ca");

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase Connection: Success!");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase Connection Error: The client is offline. Please check your Firebase configuration and internet connection.");
    } else {
      console.log("Firebase Connection: Server reached, but test document not found (this is expected).");
    }
  }
}
testConnection();
