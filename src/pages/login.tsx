import React from 'react';
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const { toast } = useToast();

  const handleLogin = () => {
    toast({
      title: "Login successful",
      description: "Welcome back!"
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Log in</button>
    </div>
  );
} 