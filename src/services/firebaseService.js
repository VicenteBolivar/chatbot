const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const saveAppointment = async (data) => {
  try {
    const docRef = await db.collection("appointments").add({
      ...data,
      createdAt: new Date()
    });

    console.log("✅ Cita guardada:", docRef.id);
  } catch (error) {
    console.error("❌ Error guardando cita:", error);
  }
};

module.exports = { saveAppointment };