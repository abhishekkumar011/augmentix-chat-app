import { useEffect, useState } from "react";
import { DialogBox } from "./DialogBox";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { Link, useNavigate } from "react-router-dom";
import { ChatBubbleIcon, PersonIcon } from "@radix-ui/react-icons";
import { Router } from "react-router-dom";

interface IAllChats {
  chatId?: any;
}

const AllChats = ({ chatId }: IAllChats) => {
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats, setSelectedChat } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getSenderName = (loggedUser:any, users:any) => {
    return users[0]?._id === loggedUser?._id ? users[0].fullName : users[1].fullName;
  };

  const fetchAllChats = async () => {
    try {
      setLoading(true);
      const token = user.data.accessToken;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get("/api/v1/chat", config);
      setChats(data.data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load chats",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllChats();
  }, []);

  async function logoutHandler() {
    try {
      const token = user.data.accessToken;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // Send POST request with an empty body and the config for headers
      await axios.post(`/api/v1/users/logout`, config);

      // Optionally clear localStorage or handle post-logout actions
      localStorage.removeItem("userData");

      navigate("/login");
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        duration: 5000,
      });
    }
  }

  return (
    <div className="h-full w-3/12 rounded-3xl">
      <Card className="h-full ">
        <div className="w-full pt-2 flex justify-between px-4 my-2 items-center">
          <h2 className="font-semibold">Together</h2>
          <Button onClick={logoutHandler}>Logout</Button>
        </div>
        <CardHeader className="pb-3">
          <CardTitle>Chats</CardTitle>
          <CardDescription>Start Chatting, Start Connecting.</CardDescription>
          <DialogBox />
        </CardHeader>

        <CardContent className="grid gap-1">
          {loading && <p>Loading...</p>}
          <ScrollArea className="h-[440px]">
            {chats.length > 0 ? (
              chats.map((chat: any) => {
                return (
                  <Link to={`/chat/${chat?._id}`} key={chat?._id}>
                    <div
                      onClick={() => setSelectedChat(chat)}
                      className={`my-4 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer px-4 ${
                        chatId === chat?._id &&
                        "bg-gray-900 text-white rounded-2xl hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      {chat.isGroupChat ? (
                        <ChatBubbleIcon className="mt-px h-5 w-5" />
                      ) : (
                        <PersonIcon className="mt-px h-5 w-5" />
                      )}

                      <div className="space-y-2">
                        <p>
                          {chat.isGroupChat
                            ? chat.chatName
                            : getSenderName(user, chat.users)}
                        </p>
                        <p className="text-sm text-muted-foreground text-green-600">
                          {chat.latestMessage?.content
                            ? chat.latestMessage?.content
                            : "No message yet"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="w-full text-center mt-4">
                NO chats and Room Available
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllChats;
