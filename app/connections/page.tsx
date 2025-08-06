"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface Request {
  id: string;
  from: string;
  to: string;
  status: string;
  senderName: string;
  senderEmail: string;
}

export default function Connections() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setCurrentUser(user);
        await fetchRequests(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchRequests = async (userId: string) => {
    const q = query(
      collection(db, "connectionRequests"),
      where("to", "==", userId),
      where("status", "==", "pending")
    );

    const snapshot = await getDocs(q);
    const requestList: Request[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const senderRef = doc(db, "users", data.from);
      const senderSnap = await getDoc(senderRef);
      const senderData = senderSnap.exists() ? senderSnap.data() : {};

      requestList.push({
        id: docSnap.id,
        from: data.from,
        to: data.to,
        status: data.status,
        senderName: senderData.name || "Unknown",
        senderEmail: senderData.email || "Unknown",
      });
    }

    setRequests(requestList);
  };

  const handleResponse = async (id: string, action: "accepted" | "rejected") => {
    const reqRef = doc(db, "connectionRequests", id);
    await updateDoc(reqRef, { status: action });

    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Connection Requests</h1>

      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li
              key={req.id}
              className="border p-4 rounded mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{req.senderName}</p>
                <p className="text-sm text-gray-500">{req.senderEmail}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => handleResponse(req.id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleResponse(req.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
