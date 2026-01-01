"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ScavengerHuntRoom } from "./scavenger-hunt-room";
import type { ScavengerHuntPuzzle } from "@/lib/game/scavenger-hunt";

interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  inventory: string[];
  strength?: number;
  intelligence?: number;
  agility?: number;
  wisdom?: number;
  appearance?: {
    race?: string;
    hairColor?: string;
    hairStyle?: string;
    eyeColor?: string;
    skinTone?: string;
    clothing?: string;
    accessories?: string[];
    portraitUrl?: string;
  };
}

interface Room {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  puzzleType: string | null;
  puzzleData: Record<string, unknown> | null;
  isCompleted: boolean;
  order: number;
}

interface Dungeon {
  id: string;
  name: string;
  level: number;
  description: string | null;
  imageUrl: string | null;
}

interface GameState {
  player: Player;
  dungeon: Dungeon | null;
  currentRoom: Room | null;
  completedRooms: string[];
}

export function GameView({ playerId }: { playerId: string }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingDungeon, setIsStartingDungeon] = useState(false);
  const [dungeonProgress, setDungeonProgress] = useState<string>("");
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<ScavengerHuntPuzzle | null>(null);

  useEffect(() => {
    loadGameState();
  }, [playerId]);

  async function loadGameState() {
    try {
      const response = await fetch(`/api/game/${playerId}`);
      if (!response.ok) throw new Error("Failed to load game");
      const data = await response.json();
      setGameState(data);
    } catch (error) {
      console.error("Error loading game:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">⚔️</div>
          <div className="text-white text-xl font-semibold">Loading your adventure...</div>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>
          <div className="text-white text-xl font-semibold">Failed to load game</div>
        </div>
      </div>
    );
  }

  const { player, dungeon, currentRoom } = gameState;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Full-screen loading overlay when starting dungeon */}
      {isStartingDungeon && (
        <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="text-6xl animate-pulse">🏰</div>
            <h2 className="text-white text-2xl font-bold">Creating Your Dungeon</h2>
            <p className="text-purple-200 text-lg">{dungeonProgress || "Preparing your adventure..."}</p>
            <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 rounded-full animate-pulse" style={{ width: "100%" }}></div>
            </div>
            <p className="text-purple-300 text-sm">Generating images and puzzles... This may take a moment.</p>
          </div>
        </div>
      )}
      
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Player Stats */}
        <Card className="dungeon-card mb-6 dungeon-glow">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <span className="text-3xl">⚔️</span>
              {player.name}
            </CardTitle>
            <CardDescription className="text-purple-200 text-base">
              Level {player.level} • {player.experience} XP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-white mb-2">
                  <span className="font-semibold">Health</span>
                  <span className="font-semibold">{player.health} / {player.maxHealth}</span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden border border-purple-500/30">
                  <div
                    className="health-bar h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-white mb-2">
                  <span className="font-semibold">Experience</span>
                  <span className="font-semibold">{player.experience} / {player.level * 200}</span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden border border-blue-500/30">
                  <div
                    className="xp-bar h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((player.experience % 200) / 200) * 100}%` }}
                  />
                </div>
              </div>
              {"strength" in player && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-purple-500/30">
                  <div className="text-center">
                    <div className="text-xs text-purple-300 mb-1">Strength</div>
                    <div className="text-lg font-bold text-white">{player.strength}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-purple-300 mb-1">Intelligence</div>
                    <div className="text-lg font-bold text-white">{player.intelligence}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-purple-300 mb-1">Agility</div>
                    <div className="text-lg font-bold text-white">{player.agility}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-purple-300 mb-1">Wisdom</div>
                    <div className="text-lg font-bold text-white">{player.wisdom}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Room */}
        {currentRoom ? (
          <Card className="dungeon-card dungeon-glow">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <span className="text-3xl">🚪</span>
                {currentRoom.name}
              </CardTitle>
              <CardDescription className="text-purple-200 text-base">
                {dungeon?.name} • Room {currentRoom.order}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentRoom.imageUrl && (
                <div className="relative w-full h-80 rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-2xl">
                  <Image
                    src={currentRoom.imageUrl}
                    alt={currentRoom.name}
                    fill
                    className="object-cover"
                    unoptimized={currentRoom.imageUrl.includes("via.placeholder.com")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                </div>
              )}
              <p className="text-purple-100 text-lg leading-relaxed bg-slate-900/30 p-4 rounded-lg border border-purple-500/20">
                {currentRoom.description}
              </p>
              
              {currentRoom.puzzleType && !currentRoom.isCompleted && (
                <div className="border-t border-purple-500/30 pt-6">
                  {currentRoom.puzzleType === "scavenger-hunt" && currentRoom.puzzleData ? (
                    <ScavengerHuntRoom
                      puzzle={currentRoom.puzzleData as unknown as ScavengerHuntPuzzle}
                      roomImageUrl={currentRoom.imageUrl}
                      roomName={currentRoom.name}
                      onSolve={async () => {
                        // Mark room as completed
                        await fetch(`/api/game/${playerId}/room/${currentRoom.id}/complete`, {
                          method: "POST",
                        });
                        loadGameState();
                      }}
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-6 rounded-lg border border-purple-500/30">
                      <h3 className="text-white text-xl font-bold mb-3 flex items-center gap-2">
                        <span className="text-2xl">🧩</span>
                        Puzzle Challenge
                      </h3>
                      <p className="text-purple-200 mb-6 text-lg">
                        This room contains a puzzle! Explore and find clues to solve it.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {currentRoom.isCompleted && (
                <div className="border-t border-purple-500/30 pt-6">
                  <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-200 p-6 rounded-lg border-2 border-green-500/50 shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">✅</span>
                      <div>
                        <h4 className="font-bold text-white text-lg mb-1">Room Completed!</h4>
                        <p className="text-green-200">You can proceed to the next room.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="dungeon-card dungeon-glow">
            <CardContent className="py-16 text-center">
              <div className="space-y-6">
                <div className="text-6xl mb-4">🏰</div>
                <h3 className="text-white text-2xl font-bold mb-2">Ready to Start Your Adventure?</h3>
                <p className="text-purple-200 text-lg mb-8 max-w-md mx-auto">
                  Enter your first dungeon and begin solving puzzles to progress through the mysterious chambers.
                </p>
                <Button
                  size="lg"
                  onClick={async () => {
                    setIsStartingDungeon(true);
                    setDungeonProgress("Creating your dungeon...");
                    
                    try {
                      // Start the API call
                      const responsePromise = fetch(`/api/game/${playerId}/start-dungeon`, {
                        method: "POST",
                      });
                      
                      // Update progress messages while waiting
                      setTimeout(() => {
                        if (isStartingDungeon) setDungeonProgress("Generating dungeon rooms...");
                      }, 1000);
                      
                      setTimeout(() => {
                        if (isStartingDungeon) setDungeonProgress("Creating puzzles and clues...");
                      }, 2000);
                      
                      setTimeout(() => {
                        if (isStartingDungeon) setDungeonProgress("Generating room images with your character...");
                      }, 3000);
                      
                      const response = await responsePromise;
                      
                      if (response.ok) {
                        setDungeonProgress("Finalizing your adventure...");
                        // Wait a bit more for images to fully process
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        await loadGameState();
                        setIsStartingDungeon(false);
                        setDungeonProgress("");
                      } else {
                        const errorData = await response.json().catch(() => ({}));
                        console.error("Error starting dungeon:", errorData);
                        setDungeonProgress(`Error: ${errorData.error || "Failed to create dungeon"}`);
                        setTimeout(() => {
                          setIsStartingDungeon(false);
                          setDungeonProgress("");
                        }, 3000);
                      }
                    } catch (error) {
                      console.error("Error starting dungeon:", error);
                      setDungeonProgress("Error: Failed to create dungeon. Please try again.");
                      setTimeout(() => {
                        setIsStartingDungeon(false);
                        setDungeonProgress("");
                      }, 3000);
                    }
                  }}
                  disabled={isStartingDungeon}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg px-8 py-6 dungeon-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStartingDungeon ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⚔️</span>
                      Creating Dungeon...
                    </span>
                  ) : (
                    "Enter First Dungeon"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

