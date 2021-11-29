import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Grid } from "@chakra-ui/layout";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";

// const getGroupsForUser = async (uid: string) => {
//   const grpRef = collection(db, "groups");
//   const q = query(grpRef, where("members", "array-contains", uid));
//   console.log(q);
//   const querySnapshot = await getDocs(q);
//   console.log(querySnapshot);

//   const allGroups = [];
//   querySnapshot.forEach((doc) => {
//     allGroups.push({
//       id: doc.id,
//       ...doc.data(),
//     });
//   });
//   return allGroups;
// };

const getMessagesForGroup = async (groupId: string) => {
  console.log(groupId);
  const msgRef = collection(db, "messages", groupId, "messages");
  const querySnapshot = await getDocs(msgRef);

  const allMessages = [];
  querySnapshot.forEach((m) => {
    allMessages.push({
      ...m.data(),
    });
  });
  console.log(allMessages);
  return allMessages;
};

export const ChatScreen = ({ groupId }) => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<any[]>();

  useEffect(() => {
    async function fetchData() {
      const groupsForUser = await getMessagesForGroup(groupId);
      setMessages(groupsForUser);
    }

    fetchData();
  }, [groupId]);

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
        <Avatar src="https://bit.ly/kent-c-dodds" mr="4" />
        <Box>Max Musterman</Box>
      </Flex>
      <Grid bgColor="gray.50" h="100%" templateRows="1fr 40px">
        <Box p="4">
          {messages &&
            messages.map((m) => (
              <Box
                mt="2"
                key={m.id}
                textAlign={m.from === "234" ? "right" : "left"}
              >
                <ChatMessage {...m} />
              </Box>
            ))}
        </Box>
        <Box bgColor="white">User Input</Box>
      </Grid>
    </Flex>
  );
};

const ChatMessage = ({ id, text, from }) => (
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
);
