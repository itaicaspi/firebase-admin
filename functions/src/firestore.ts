import admin = require("firebase-admin");

admin.initializeApp();
export const storage = admin.storage();
export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true })
export const messaging = admin.messaging();