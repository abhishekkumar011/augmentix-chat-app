import { useAuthContext } from "@/context/AuthContext";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import MessageBox from "./MessageBox";

interface IChatBox {
  chatId?: any;
}

const ChatBox = ({ chatId }: IChatBox) => {
  const { selectedChat, user } = useAuthContext();

  const getSenderName = (loggedUser:any, users:any) => {
    return users[0]?._id === loggedUser?._id ? users[0].fullName : users[1].fullName;
  };
  return (
    <div className="h-full w-9/12 bg-accent rounded-3xl relative bg-white border-2 flex justify-center items-center flex-col gap-2">
      {!selectedChat ? (
        <>
          <h1 className="text-5xl">📨</h1>
          <span className="font-bold">No Chat Open</span>
          <p className="w-[400px] text-center text-sm">
            Begin your chatting experience by opening your chat. Share thoughts,
            laughter, and memories with others in your personalized chat space.
          </p>
        </>
      ) : (
        <Card className="h-full w-full">
          <CardHeader className="pb-3 h-20">
            <CardTitle>
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : getSenderName(user, selectedChat.users)}
            </CardTitle>
            <CardDescription>
              {selectedChat.isGroupChat ? "Group" : "One2One"}
            </CardDescription>
          </CardHeader>
          <MessageBox />
        </Card>
      )}
    </div>
  );
};

export default ChatBox;
