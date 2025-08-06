// /app/profile/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';

interface User {
  id: string;
  name: string;
  role: string;
  bio: string;
}

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const userRef = doc(db, 'users', id as string);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser({ id: userSnap.id, ...userSnap.data() } as User);
      }
    }

    if (id) fetchUser();
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.role}</p>
          <p className="text-sm text-gray-500">{user.bio}</p>
        </CardContent>
      </Card>
    </div>
  );
}
