
import { db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function storeUserData(user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}) {
  if (!user) return;

  const userRef = doc(db, "users", user.id);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      createdAt: new Date(),
    });
    console.log("User stored in Firestore:", user.id);
  } else {
    console.log("User already exists in Firestore:", user.id);
  }
}
