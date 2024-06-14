import { db, storage, auth } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  setDoc,
  Timestamp,
  where,
  deleteDoc,
} from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

const useFirestore = () => {
  const addUser = async ({
    email,
    uid,
  }: {
    email: string;
    uid: string;
  }): Promise<boolean> => {
    try {
      console.log("Before querying database");
      const emailQuerySnapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      if (!emailQuerySnapshot.empty) {
        console.log("Email already exists.");
        return false;
      }

      const userRef = doc(db, "users", email);

      console.log("Before setting document");
      await setDoc(userRef, {
        email,
        createdDate: new Date(),
        updatedDate: new Date(),
        displayName: "",
        photoURL: "",
        uid,
      });

      console.log("After setting document");
      return true;
    } catch (error) {
      console.error("Error in addUser:", error);
      return false;
    }
  };

  const addInterviewHistory = async (uuid: string, history: string[]): Promise<boolean> => {
    try {
      const docRef = doc(db, "interviews", uuid);
      await setDoc(docRef, { history }, { merge: true });
      return true;
    } catch (error) {
      console.error("Error in addInterviewHistory:", error);
      return false;
    }
  };

  const updateUserEmail = async ({
    oldEmail,
    newEmail,
    uid,
  }: {
    oldEmail: string;
    newEmail: string;
    uid: string;
  }): Promise<boolean> => {
    try {
      const userRefOld = doc(db, "users", oldEmail);
      const userRefNew = doc(db, "users", newEmail);

      const userDocOld = await getDoc(userRefOld);

      if (!userDocOld.exists()) {
        console.log("User not found");
        return false;
      }

      const userData = userDocOld.data();

      // Get the original createdDate
      // const createdDate = userDoc.data().createdDate;
      // const displayName = userDoc.data().displayName;
      // const photoURL = userDoc.data().photoURL;

      await setDoc(userRefNew, {
        ...userData,
        email: newEmail,
        updatedDate: new Date(),
        uid,
      });

      await deleteDoc(userRefOld);

      return true;
    } catch (error) {
      console.error("Error in updateUser:", error);
      return false;
    }
  };

  const updateUserProfile = async ({
    email,
    displayName,
    photoURL,
  }: {
    email: string;
    displayName: string;
    photoURL: string;
  }): Promise<boolean> => {
    try {
      const userRef = doc(db, "users", email);

      // Fetch the existing user document using getDoc
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.log("User not found");
        return false;
      }

      // Get the original createdDate
      const userData = userDoc.data();

      // Update the user document with the new email and updated date
      await setDoc(userRef, {
        ...userData,
        updatedDate: new Date(),
        displayName,
        photoURL,
      });

      return true;
    } catch (error) {
      console.error("Error in updateUser:", error);
      return false;
    }
  };

  const uploadProfileImage = async ({
    email,
    file,
  }: {
    email: string;
    file: File;
  }): Promise<string> => {
    try {
      const storageRef = ref(storage, `users/${email}/profileImage`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log("url:", url);

      return url;
    } catch (error) {
      console.error("Error in uploadProfileImage:", error);
      return "";
    }
  };

  const deleteUserFromFirestore = async ({
    email,
  }: {
    email: string;
  }): Promise<boolean> => {
    try {
      const userRef = doc(db, "users", email);
      await deleteDoc(userRef);
      return true;
    } catch (error) {
      console.error("Error in deleteUserFromFirestore:", error);
      return false;
    }
  };


  const getInterviewDetails = async (uuid: string): Promise<any> => {
    // uuid = uuid.substring(1);

    try {
      const docRef = doc(db, "interviews", uuid);
      const docSnap = await getDoc(docRef);


      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log(uuid);
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error in getInterviewDetails:", error);
      return null;
    }
  };

  const addUserDetails = async ({
    nameofCandidate,
    jobTitle,
    description,
    keywords,
    questions,
    uuid,
    pdfText,
  }: {
    nameofCandidate: string;
    jobTitle: string;
    description: string;
    keywords: string[];
    questions: string[];
    uuid: string;
    pdfText: string | null;
  }): Promise<boolean> => {
    try {
      const docRef = doc(collection(db, "interviews"), uuid);

      await setDoc(docRef, {
        nameofCandidate,
        jobTitle,
        description,
        keywords,
        questions,
        createdDate: Timestamp.fromDate(new Date()),
        updatedDate: Timestamp.fromDate(new Date()),
        uuid,
        pdfText,
      });

      return true;
    } catch (error) {
      console.error("Error in addUserDetails:", error);
      return false;
    }
  };

  const addFeedbackAnalysis = async (uuid: string, feedbackAnalysis: string): Promise<boolean> => {
    try {
      const docRef = doc(db, "interviews", uuid);
      await setDoc(docRef, { feedbackAnalysis }, { merge: true });
      return true;
    } catch (error) {
      console.error("Error in addFeedbackAnalysis:", error);
      return false;
    }
  };

  const getAllInterviews = async (): Promise<any[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, "interviews"));
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Error in getAllInterviews:", error);
      return [];
    }
  };


  return {
    addUser,
    updateUserEmail,
    updateUserProfile,
    uploadProfileImage,
    deleteUserFromFirestore,
    addUserDetails,
    getInterviewDetails,
    addInterviewHistory,
    addFeedbackAnalysis,
    getAllInterviews,
  };
};

export default useFirestore;
