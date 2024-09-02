import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      toast({ description: "Loging in, please wait..." });

      const response = await axios.post(
        "/api/v1/users/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        localStorage.setItem("userData", JSON.stringify(response.data));
        toast({
          title: "Login successful",
          description: "You successfully logged in",
          duration: 5000,
        });
        navigate("/chat")
      }

      setEmail("");
      setPassword("");
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
      <Card className="w-[450px] p-10 shadow-md border rounded-tr-none rounded-bl-none rounded-tl-2xl rounded-br-2xl border-r-4 border-r-gray-700">
        <CardHeader>
          <div className="w-full mb-2 flex justify-center">
            <img src={logo} width={30} />
          </div>
          <CardTitle className="text-center">Welcome Back!</CardTitle>
          <CardDescription className="text-center">
            Your chats await sign in to reconnect.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4 my-4">
            <div className="flex flex-col space-y-2">
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
            <div className="flex flex-col space-y-2">
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
        </CardContent>
        <CardFooter className="flex items-start flex-col gap-4">
          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Loggin In" : "Login"}
          </Button>
          <div className="flex gap-2">
            <span className="font-semibold">Create an account?</span>
            <Link to={"/signup"}>Signup</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
