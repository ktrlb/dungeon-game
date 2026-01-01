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
    <Card className="dungeon-card dungeon-glow max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-2xl flex items-center gap-3">
          <span className="text-3xl">⚔️</span>
          Character Creation
        </CardTitle>
        <CardDescription className="text-purple-200 text-base">
          Choose a name for your brave adventurer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-white mb-3">
              Character Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-4 rounded-lg bg-slate-900/50 border-2 border-purple-500/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all"
              placeholder="Enter your character name..."
              required
              maxLength={50}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg py-6 dungeon-glow disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !name.trim()}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⚔️</span>
                Creating Character...
              </span>
            ) : (
              "Start Adventure"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

