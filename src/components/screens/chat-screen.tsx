import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Grid, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "@firebase/firestore";
import { useRouter } from "next/dist/client/router";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";

const sendMessage = async (userId: string, groupId: string, msg: string) => {
  const msgRef = collection(db, "messages", groupId, "messages");
  addDoc(msgRef, {
    from: userId,
    sentAt: serverTimestamp(),
    text: msg,
  });
};

interface IMessage {
  id: string;
  text: string;
  from: string;
}

export const ChatScreen = ({ groupId }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const focusRef = useRef<HTMLElement>();
  const [messages, loading, error] = useCollectionData(
    query(collection(db, "messages", groupId, "messages"), orderBy("sentAt")),
    {
      idField: "id",
      // transform: (val) => val as IMessage,
    }
  );

  useEffect(() => {
    focusRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) {
    return null;
  }

  return (
    <Flex h="100vh" flexDir="column">
      <Flex
        px="4"
        h="80px"
        color="white"
        bgColor="blue.400"
        alignItems="center"
      >
        <Button onClick={() => router.push("/")}>Back</Button>
        <Avatar src="https://bit.ly/kent-c-dodds" mr="4" />
        <Box>Max Musterman</Box>
      </Flex>
      <Grid
        bgColor="gray.50"
        h="100%"
        templateRows="1fr 40px"
        minH="0"
        overflow="auto"
      >
        <Box p="4" overflow="scroll">
          {messages &&
            messages.map((m) => (
              <Box
                mt="2"
                key={m.id}
                textAlign={m.from === user.uid ? "right" : "left"}
              >
                <ChatMessage {...(m as any)} />
              </Box>
            ))}
          <Box ref={focusRef}></Box>
        </Box>
        <Flex bgColor="gray.50" justifyContent="space-around">
          <Text p="2" onClick={() => sendMessage(user.uid, groupId, "🥰")}>
            🥰
          </Text>
          <Text p="2" onClick={() => sendMessage(user.uid, groupId, "😘")}>
            😘
          </Text>
          <Text p="2" onClick={() => sendMessage(user.uid, groupId, "🤗")}>
            🤗
          </Text>
          <Text p="2" onClick={() => sendMessage(user.uid, groupId, "😭")}>
            😭
          </Text>
          <Text p="2" onClick={() => sendMessage(user.uid, groupId, "🥳")}>
            🥳
          </Text>
        </Flex>
      </Grid>
    </Flex>
  );
};

const ChatMessage = ({ id, text, from, sentAt }) => (
  <>
    <Box
      border="1px solid"
      borderColor="blue.200"
      d="inline-block"
      bgColor="blue.50"
      borderRadius="4"
      p="2"
    >
      {text}
    </Box>
    <Text color="gray.500" fontSize="sm">
      {sentAt
        ? sentAt
            .toDate()
            .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "-"}
    </Text>
  </>
);
