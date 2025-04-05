// utils/savePushToken.ts
import { db, collection, addDoc, query, where, getDocs } from "./firebase";

export async function savePushTokenToFirestore(token: string) {
  if (!token) return;

  try {
    const q = query(collection(db, "pushTokens"), where("token", "==", token));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(collection(db, "pushTokens"), {
        token,
        createdAt: new Date(),
      });
      console.log("✅ Token Firestore'a eklendi:", token);
    } else {
      console.log("ℹ️ Token zaten kayıtlı:", token);
    }
  } catch (error) {
    console.error("❌ Firestore'a token kaydedilemedi:", error);
  }
}
