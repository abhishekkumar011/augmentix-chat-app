import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFullnamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSignup = async () => {
    const formData = new FormData();
    formData.append("fullName", fullname);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar !== null) {
      formData.append("avatar", avatar);
    }

    try {
      setLoading(true);

      toast({ description: "Submitting the form, please wait..." });

      const response = await axios.post("/api/v1/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response) {
        localStorage.setItem("userData", JSON.stringify(response.data));
        toast({
          title: "Signup successful",
          description: "You successfully create an account",
          duration: 5000,
        });
      }

      setFullname("");
      setEmail("");
      setPassword("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100vh] flex justify-center items-center">
      <Card className="w-[450px] px-10 py-2 my-5 shadow-md border rounded-tr-none rounded-bl-none rounded-tl-2xl rounded-br-2xl border-r-4 border-r-gray-700">
        <CardHeader>
          <div className="w-full mb-2 flex justify-center">
            <img src={logo} width={30} />
          </div>
          <CardTitle className="text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Create your account and chat without limits!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4 my-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="fullname" className="font-semibold">
                Full Name :
              </Label>
              <Input
                id="fullname"
                type="text"
                onChange={handleFullnamChange}
                value={fullname}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-4 my-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="email" className="font-semibold">
                Email :
              </Label>
              <Input
                id="email"
                type="email"
                onChange={handleEmailChange}
                value={email}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-4 my-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="password" className="font-semibold">
                Password :
              </Label>
              <Input
                id="password"
                type="password"
                onChange={handlePasswordChange}
                value={password}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-4 my-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="picture" className="font-semibold">
                Upload Picture :
              </Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                ref={fileInputRef}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-start flex-col gap-4">
          <Button className="w-full" onClick={handleSignup} disabled={loading}>
            {loading ? "Signing Up" : "Signup"}
          </Button>
          <div className="flex gap-2">
            <span className="font-semibold">Already have an account?</span>
            <Link to={"/"}>Login</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
