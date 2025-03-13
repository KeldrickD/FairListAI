import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [listing, setListing] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateListing = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest("/api/generate", {
          method: "POST",
          body: JSON.stringify({ prompt: listing })
        });
        toast({
          title: "Success",
          description: "Listing generated successfully!"
        });
        return response;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate listing",
          variant: "destructive"
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Generate Your Listing</h1>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your listing details..."
            value={listing}
            onChange={(e) => setListing(e.target.value)}
            className="min-h-[200px]"
          />
          <Button
            onClick={() => generateListing.mutate()}
            disabled={isLoading || !listing}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Listing"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
} 