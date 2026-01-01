"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SavedPlayer {
  id: string;
  name: string;
  level: number;
  experience: number;
  appearance?: {
    gender?: string;
    race?: string;
    hairColor?: string;
    hairStyle?: string;
    eyeColor?: string;
    skinTone?: string;
    clothing?: string;
    accessories?: string[];
    portraitUrl?: string;
  };
  createdAt: string;
}

export default function ContinueGamePage() {
  const router = useRouter();
  const [players, setPlayers] = useState<SavedPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedPlayers();
  }, []);

  async function loadSavedPlayers() {
    try {
      const response = await fetch("/api/game/list");
      if (!response.ok) throw new Error("Failed to load players");
      const data = await response.json();
      setPlayers(data.players || []);
    } catch (error) {
      console.error("Error loading players:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-glow">
              Continue Your Adventure
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
          </div>

          {isLoading ? (
            <Card className="dungeon-card dungeon-glow">
              <CardContent className="py-16 text-center">
                <div className="text-6xl animate-pulse mb-4">⚔️</div>
                <p className="text-purple-200 text-lg">Loading your characters...</p>
              </CardContent>
            </Card>
          ) : players.length === 0 ? (
            <Card className="dungeon-card dungeon-glow">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <span className="text-3xl">🗺️</span>
                  No Saved Characters
                </CardTitle>
                <CardDescription className="text-purple-200 text-base">
                  Create a new character to start your adventure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-purple-100 mb-6 text-lg">
                    You don't have any saved characters yet. Create a new character to begin your dungeon adventure!
                  </p>
                  <div className="flex gap-4">
                    <Link href="/" className="flex-1">
                      <Button variant="outline" className="w-full bg-purple-900/50 text-white border-purple-500/50 hover:bg-purple-800/50 hover:border-purple-400 font-semibold text-lg py-6">
                        Back to Home
                      </Button>
                    </Link>
                    <Link href="/game/new" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg py-6 dungeon-glow">
                        Create New Character
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="dungeon-card dungeon-glow">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center gap-2">
                    <span className="text-3xl">🗺️</span>
                    Your Characters
                  </CardTitle>
                  <CardDescription className="text-purple-200 text-base">
                    Select a character to continue their adventure
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {players.map((player) => (
                  <Card key={player.id} className="dungeon-card dungeon-glow hover:scale-105 transition-transform cursor-pointer" onClick={() => router.push(`/game/${player.id}`)}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {player.appearance?.portraitUrl ? (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-purple-500/50 flex-shrink-0">
                            <Image
                              src={player.appearance.portraitUrl}
                              alt={player.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-purple-900/50 border-2 border-purple-500/50 flex items-center justify-center text-4xl flex-shrink-0">
                            ⚔️
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white text-xl font-bold mb-1 truncate">{player.name}</h3>
                          <p className="text-purple-300 text-sm mb-2">
                            Level {player.level} • {player.experience} XP
                          </p>
                          {player.appearance && (
                            <div className="text-purple-400 text-xs space-y-0.5">
                              {player.appearance.race && <p>{player.appearance.race}</p>}
                              {player.appearance.gender && <p>{player.appearance.gender}</p>}
                            </div>
                          )}
                          <Button 
                            className="mt-3 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm py-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/game/${player.id}`);
                            }}
                          >
                            Continue Adventure
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full bg-purple-900/50 text-white border-purple-500/50 hover:bg-purple-800/50 hover:border-purple-400 font-semibold text-lg py-6">
                    Back to Home
                  </Button>
                </Link>
                <Link href="/game/new" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg py-6 dungeon-glow">
                    Create New Character
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
