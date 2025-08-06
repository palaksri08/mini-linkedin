import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export const sendConnectionRequest = async (fromId: string, toId: string) => {
  try {
    const docRef = await addDoc(collection(db, "connectionRequests"), {
      from: fromId,
      to: toId,
      status: "pending",
      timestamp: new Date(),
    });
    console.log("Request sent:", docRef.id);
  } catch (error) {
    console.error("Error sending request:", error);
  }
};
