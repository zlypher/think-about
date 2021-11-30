import { Avatar } from "@chakra-ui/avatar";
import { Box, Center, Flex, Grid, Heading } from "@chakra-ui/layout";
import {
  query,
  where,
  setDoc,
  doc,
  collection,
  getFirestore,
  getDocs,
} from "firebase/firestore";
import { User, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { Button } from "@chakra-ui/button";

const saveUserToFirestore = async (user: User) => {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  });
};

export const SignInScreen = () => {
  const [user] = useAuthState(auth);
  if (user) {
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

  return (
    <Center bgColor="gray.50" h="100vh" flexDir="column">
      <Heading as="h1" mb="8">
        Think About
      </Heading>
      <Button onClick={signin} colorScheme="blue">
        Sign In with Google
      </Button>
    </Center>
  );
};
