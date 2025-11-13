import { Spotlight } from "@repo/ui/components/ui/spotlight-new";
import { Button } from "@repo/ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/ui/card";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

interface AuthFormProps {
  isLogin: boolean;
}

export function AuthForm({ isLogin }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log({ isLogin, name, email, password });
    } catch (error) {
      console.error("Authentication error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
      <Spotlight />
      <Card className="max-w-md shadow-2xl py-10 relative z-50 w-full border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isLogin
              ? "Sign in to your account to continue"
              : "Sign up to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-200"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-white/20 bg-white/5 placeholder:text-gray-500 py-3 transition-all duration-200"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-200"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/20 bg-white/5 placeholder:text-gray-500 py-3 transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-200"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-white/20 bg-white/5 placeholder:text-gray-500 py-3 transition-all duration-200"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full font-bold py-5 transition-all duration-300 "
              disabled={isLoading}
            >
              {isLoading
                ? isLogin
                  ? "Signing In..."
                  : "Signing Up..."
                : isLogin
                  ? "Sign In"
                  : "Sign Up"}
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                className="text-sm transition-colors"
                type="button"
                onClick={() => router.push(isLogin ? "/signup" : "/login")}
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Button>
            </div>
            <div className="text-center">
              <Button
                variant="secondary"
                className="w-full py-5 transition-all duration-300 bg-white/5 hover:bg-white/10 border-white/10"
              >
                Continue with a Guest Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
