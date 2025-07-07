import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Prevent multiple initializations
if (!admin.apps.length) {
  try {
    // Try to load from environment variable first (more secure)
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : JSON.parse(
          fs.readFileSync(path.resolve(__dirname, './config/serviceAccountKey.json'), 'utf8')
        );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || 'where-it-go',
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    throw new Error('Firebase Admin SDK initialization failed');
  }
}

export default admin;
