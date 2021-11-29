import { Box, Flex, Grid, Link } from "@chakra-ui/layout";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";

interface IGroup {
  id: string;
  name: string;
}

const getGroupsForUser = async (uid: string) => {
  const grpRef = collection(db, "groups");
  const q = query(grpRef, where("members", "array-contains", uid));
  console.log(q);
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot);

  const allGroups = [];
  querySnapshot.forEach((doc) => {
    allGroups.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return allGroups;
};

export const GroupScreen = () => {
  const [user] = useAuthState(auth);
  const [groups, setGroups] = useState<IGroup[]>();

  useEffect(() => {
    async function fetchData() {
      const groupsForUser = await getGroupsForUser(user.uid);
      setGroups(groupsForUser);
    }

    fetchData();
  }, [user]);

  console.log(groups);

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
        <Box>Gruppen</Box>
      </Flex>
      <Grid bgColor="gray.50" h="100%" templateRows="1fr 40px">
        {groups &&
          groups.map((m) => (
            <Box key={m.id}>
              <ChatGroup {...m} />
            </Box>
          ))}
      </Grid>
    </Flex>
  );
};

const ChatGroup = ({ id, name }) => (
  <Link
    href={`/chat/${id}`}
    d="block"
    border="1px solid"
    borderColor="blue.200"
    bgColor="blue.50"
    variant="unstyled"
  >
    <Flex alignItems="center" h="80px" p="4">
      {name}
    </Flex>
  </Link>
);
