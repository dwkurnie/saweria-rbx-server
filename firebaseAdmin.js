// firebaseAdmin.js
import admin from 'firebase-admin';

let app;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Vercel menyimpan private key di satu baris, jadi kita ganti \n jadi newline
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
} else {
  app = admin.app();
}

const db = admin.firestore();

export { db };
