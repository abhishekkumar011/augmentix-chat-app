import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CardContent, CardFooter } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";

const MessageBox = () => {
  const [loading, setLoading] = useState(false);
  const { selectedChat, user } = useAuthContext();
  const [message, setMessage] = useState<any>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageBoxRef = useRef<any>(null);
  

  const fetchMessage = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const token = user.data.accessToken;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `/api/v1/message/${selectedChat._id}`,
        config
      );

      setMessage(data.data);
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, [selectedChat]);

  const typingHandler = (e: any) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async (e: any) => {
    if (e.key == "Enter" && newMessage) {
      const token = user.data.accessToken;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `/api/v1/message`,
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );

      setMessage([...message, data.data]);
      setNewMessage(" ");
    }
  };

  return (
    <>
      <CardContent>
        <div className=" gap-1  border-t-2 border-gray-800 pt-3">
          {loading ? (
            <div className="w-full  h-[420px] flex justify-center items-center">
              <h2>Loading</h2>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[420px] relative">
                <div className="w-full flex flex-col gap-2 px-8">
                  {message?.map((msg: any, key: any) => (
                    <div
                      key={key}
                      className={`-mx-2 mt-1 flex items-start space-x-4 rounded-md p-2 transition-all cursor-pointer px-4 ${
                        msg?.sender?._id === user?._id
                          ? "self-end"
                          : "self-start"
                      }`}
                    >
                      <div className="space-y-1">
                        <p
                          className={`text-sm font-medium leading-none p-2 rounded-xl 
                          ${
                            msg?.sender?._id === user?._id
                              ? "bg-gray-200"
                              : "bg-black text-white"
                          }
                          `}
                        >
                          {msg.content}
                        </p>

                        {/* <p className="text-xs text-muted-foreground">
                            {show}
                        </p> */}
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={messageBoxRef}></div>
              </ScrollArea>
            </>
          )}
        </div>
      </CardContent>

      {isTyping && (
        <div className="flex justify-center items-center">
          <div className="w-2 h-2 rounded-full bg-green-400 mx-1 animate-bounce"></div>
          <p className="text-xs text-muted-foreground">Typing...</p>
        </div>
      )}

      <CardFooter className="py-4 h-20 flex gap-4">
        <Textarea
          onKeyDown={sendMessage}
          className="resize-none rounded-full px-9 py-2 border-4"
          placeholder="Write your message here"
          value={newMessage}
          onChange={typingHandler}
        ></Textarea>
      </CardFooter>
    </>
  );
};

export default MessageBox;
