import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to FairListAI</h1>
        <Button>Get Started</Button>
      </Card>
    </div>
  );
} 