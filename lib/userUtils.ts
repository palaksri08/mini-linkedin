// lib/userUtils.ts
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const createUserProfile = async (
  uid: string,
  name: string,
  email: string,
  jobTitle: string
) => {
  try {
    await setDoc(doc(db, "users", uid), {
      name,
      email,
      jobTitle,
      createdAt: new Date().toISOString(),
    });
    console.log("User profile created!");
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};
