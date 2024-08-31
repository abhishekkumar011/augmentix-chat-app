import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
              <Input id="email" type="email" onChange={handleEmailChange} />
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
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-start flex-col gap-4">
          <Button className="w-full">Login</Button>
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
