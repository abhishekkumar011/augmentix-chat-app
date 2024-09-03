import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export const DialogBox = () => {
  const { toast } = useToast();
  const { user, setSelectedChat, chats, setChats } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [userNotFound, setUserNotFound] = useState(null);
  const [groupChatName, setGroupChatName] = useState("");
  const [addUserIntoGroup, setAddUserIntoGroup] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = user.data.accessToken;

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(
          `/api/v1/users?search=${searchQuery}`,
          config
        );

        setFetchedUsers(data.data);
        setUserNotFound(data.data.message);

      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Error Fetching the user",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  async function createOne2OneChat(userId: any) {
    const token = user.data.accessToken;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`/api/v1/chat`, { userId }, config);

    if (!chats.find((c) => c._id === data.data._id))
      setChats([data.data, ...chats]);

    setSelectedChat(data.data);
  }

  async function createGroupChat() {
    const token = user.data.accessToken;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `/api/v1/chat/group-chat`,
      {
        chatName: groupChatName,
        users: JSON.stringify(addUserIntoGroup.map((u: any) => u.userId)),
      },
      config
    );
    setChats([data, ...chats]);
    setSelectedChat(data);
  }

  function addUserToGroupHandler(userId: String, chatId: String) {
    if (addUserIntoGroup.find((c: any) => c.userId === userId)) {
      alert("User already exists in the group");
      return;
    }
    setAddUserIntoGroup((prevUser: any) => [...prevUser, { userId, chatId }]);
    setFetchedUsers([]);
    setSearchQuery("");
  }

  return (
    <div className="w-full flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">Add Chat</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Type user name</DialogTitle>
          </DialogHeader>
          <div className="qw-full">
            <Input
              id="chatid"
              placeholder="Start typing...."
              className="col-span-3 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DialogFooter>
            {loading ? (
              <div className="w-full">Loading...</div>
            ) : (
              <DialogClose asChild>
                {fetchedUsers?.length > 0 && (
                  <div className="w-full flex flex-col gap-2">
                    {fetchedUsers.map((user: any) => {
                      return (
                        <Link to={`/chat/${user._id}`} key={user._id}>
                          <div
                            className="w-full bg-slate-100 border-2 border-gray-200 h-14 rounded-lg px-4 flex items-center cursor-pointer hover:bg-gray-200"
                            onClick={() => createOne2OneChat(user?._id)}
                          >
                            <div className=" w-10">
                              <img src={user?.avatar.url}/>
                            </div>
                            <div className="flex flex-col gap-0 px-1">
                              <h6 className="text-sm">{user?.fullName}</h6>
                              <span className="text-xs">{user?.email}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </DialogClose>
            )}

            {userNotFound && <div className="w-full">User not found</div>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"default"} className=" w-full">
            Add Group
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
          </DialogHeader>
          <div className="qw-full">
            <Input
              id="groupChatName"
              placeholder="Write Group Name"
              className="col-span-3 w-full"
              value={groupChatName}
              onChange={(e: any) => setGroupChatName(e.target.value)}
            />
          </div>
          <div className="qw-full">
            <Input
              id="chatid"
              placeholder="Add users by name and email"
              className="col-span-3 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full">
            <>
              {addUserIntoGroup.map((user: any) => {
                return (
                  <>
                    <div
                      className="w-fit bg-green-100 px-3 rounded-xl"
                      key={user._id}
                    >
                      {user?.fullName}
                    </div>
                  </>
                );
              })}
            </>
          </div>
          <DialogFooter>
            {loading ? (
              <div className="w-full">Loading...</div>
            ) : (
              <>
                {fetchedUsers.length > 0 && (
                  <div className="w-full flex flex-col gap-2">
                    {fetchedUsers?.map((user: any) => {
                      return (
                        <Link to={`/chat/${user._id}`} key={user._id}>
                          <div
                            className="w-full bg-slate-100 border-2 border-gray-200 h-14 rounded-lg px-4 flex items-center cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              addUserToGroupHandler(user?._id, user?.fullName)
                            }
                          >
                            <div>
                              <h1 className="text-2xl">🔍</h1>
                            </div>
                            <div className="flex flex-col gap-0 px-1">
                              <h6 className="text-sm">{user?.fullName}</h6>
                              <span className="text-xs">{user?.email}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            {userNotFound && <div className="w-full">User not found</div>}
          </DialogFooter>
          <div className="w-full">
            <DialogClose>
              <Button onClick={createGroupChat}>Create Group</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
