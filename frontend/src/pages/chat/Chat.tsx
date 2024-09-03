import AllChats from "@/components/AllChats";
import ChatBox from "@/components/ChatBox";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { id } = useParams();

  return (
    <div className="w-screen h-screen bg-accent flex p-8 gap-4">
      <AllChats chatId={id} />
      <ChatBox chatId={id} />
    </div>
  );
};

export default Chat;
