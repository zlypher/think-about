import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Grid } from "@chakra-ui/layout";
import {
  query,
  where,
  setDoc,
  doc,
  collection,
  getFirestore,
  getDocs,
} from "firebase/firestore";
import {
  User,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData, useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";

const saveUserToFirestore = async (user: User) => {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  });
};

export const SignInScreen = () => {
  const [user] = useAuthState(auth);
  if (!user) {
    return null;
  }

  const signin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      console.log(res);
      await saveUserToFirestore(res.user);
    } catch (e) {
      console.log(e);
    }
  };

  const signout = () => {
    auth.signOut();
  };

  // const test = async () => {
  //   await getGroupsForUser(user.uid);
  // };

  return (
    <>
      <div>{user ? "logged in" + user.email : "logged out"}</div>
      <a onClick={signin}>Sign In</a>
      <a onClick={signout}>Sign Out</a>
      {/* <a onClick={test}>Test</a> */}
    </>
  );
};
