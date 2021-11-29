import { Box } from "@chakra-ui/layout";
import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../components/firebase";
import { ChatScreen } from "../../components/screens/chat-screen";

export default function Chat() {
  const { query } = useRouter();
  const [user] = useAuthState(auth);

  if (!user) {
    return null;
  }

  return <ChatScreen groupId={query.id} />;
}
