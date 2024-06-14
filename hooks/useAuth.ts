import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { init } from "next/dist/compiled/webpack/webpack";

type AuthHook = {
  user: User | null;
  error: string | null;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  loading: boolean;
  loggedInUser: any;
  setUser: any;
  initializing: boolean;
};

const useAuth: () => AuthHook = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); // Add this line
      setInitializing(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  
  

  const logIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const getInfoOfCurrentUserFromFirebase = async () => {
    const user = auth.currentUser;

    if (user) {
      const { phoneNumber } = user;
      const userRef = await query(
        collection(db, "users"),
        where("phoneNumber", "==", phoneNumber)
      );

      const userSnapshot = await getDocs(userRef);

      const userData = userSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      })[0];

      setLoggedInUser(userData);
    }
  };

  useEffect(() => {
    getInfoOfCurrentUserFromFirebase();
  }, [user]);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return {
    user,
    error,
    logIn,
    signUp,
    logOut,
    loading,
    loggedInUser,
    setUser,
    initializing,
  };
};

export default useAuth;
