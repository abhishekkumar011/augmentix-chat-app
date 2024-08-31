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
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

const Signup = () => {
  // const [pic, setPic] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFullnamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
              <Label htmlFor="name" className="font-semibold">
                Full Name :
              </Label>
              <Input id="name" type="text" onChange={handleFullnamChange} />
            </div>
          </div>

          <div className="grid w-full items-center gap-4 my-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="email" className="font-semibold">
                Email :
              </Label>
              <Input id="email" type="email" onChange={handleEmailChange} />
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
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-4 my-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="picture" className="font-semibold">
                Upload Picture :
              </Label>
              <Input id="picture" type="file" accept="image/*" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-start flex-col gap-4">
          <Button className="w-full">Signup</Button>
          <div className="flex gap-2">
            <span className="font-semibold">Already have an account?</span>
            <Link to={"/login"}>Login</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
