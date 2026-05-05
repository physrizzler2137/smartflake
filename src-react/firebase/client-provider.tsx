'use client';

import React, { useMemo, useEffect, type ReactNode, useState } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { seedDatabase } from '@/lib/seed-database';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [hasSeedingBeenTriggered, setHasSeedingBeenTriggered] = useState(false);

  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // This effect ensures we have an authenticated user (even anonymous) before attempting to seed the database.
    // This is crucial because the database write rules require authentication.
    const unsubscribe = onAuthStateChanged(firebaseServices.auth, (user: User | null) => {
      if (user) {
        // Once we have a user, trigger the one-time seeding if it hasn't happened yet.
        if (firebaseServices.firestore && !hasSeedingBeenTriggered) {
          seedDatabase(firebaseServices.firestore);
          setHasSeedingBeenTriggered(true); // Prevents re-seeding on subsequent auth changes
        }
      } else {
        // If there is no user, it's the initial load. Sign in anonymously.
        // This will trigger onAuthStateChanged again, but this time with a user object.
        signInAnonymously(firebaseServices.auth).catch(error => {
          console.error("FirebaseClientProvider: Anonymous sign-in for seeding failed:", error);
        });
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [firebaseServices, hasSeedingBeenTriggered]);


  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
