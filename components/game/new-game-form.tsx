"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NewGameForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/game/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) throw new Error("Failed to create game");

      const data = await response.json();
      router.push(`/game/${data.playerId}`);
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Failed to create game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Character Details</CardTitle>
        <CardDescription className="text-blue-200">
          Choose a name for your adventurer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Character Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your character name"
              required
              maxLength={50}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? "Creating..." : "Start Adventure"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

