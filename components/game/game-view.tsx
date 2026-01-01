"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PuzzleSolver } from "./puzzle-solver";
import type { Puzzle } from "@/lib/game/puzzles";

interface Player {
  id: string;
  name: string;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  inventory: string[];
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
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your adventure...</div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Failed to load game</div>
      </div>
    );
  }

  const { player, dungeon, currentRoom } = gameState;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Player Stats */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white">{player.name}</CardTitle>
            <CardDescription className="text-blue-200">
              Level {player.level} • {player.experience} XP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Health</span>
                <span>{player.health} / {player.maxHealth}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Room */}
        {currentRoom ? (
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">{currentRoom.name}</CardTitle>
              <CardDescription className="text-blue-200">
                {dungeon?.name} • Room {currentRoom.order}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentRoom.imageUrl && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={currentRoom.imageUrl}
                    alt={currentRoom.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-white">{currentRoom.description}</p>
              
              {currentRoom.puzzleType && !currentRoom.isCompleted && (
                <div className="border-t border-white/20 pt-4">
                  {!showPuzzle ? (
                    <>
                      <h3 className="text-white font-semibold mb-2">Puzzle</h3>
                      <p className="text-blue-200 mb-4">
                        This room contains a {currentRoom.puzzleType} puzzle! Solve it to proceed.
                      </p>
                      <Button onClick={async () => {
                        // Fetch puzzle data from API
                        try {
                          const response = await fetch(`/api/game/${playerId}/room/${currentRoom.id}/puzzle`);
                          if (response.ok) {
                            const puzzleData = await response.json();
                            setCurrentPuzzle(puzzleData);
                            setShowPuzzle(true);
                          } else {
                            // Fallback: create puzzle from room data
                            const puzzle: Puzzle = {
                              type: currentRoom.puzzleType!,
                              data: currentRoom.puzzleData || {},
                              solution: (currentRoom.puzzleData as { answer?: string })?.answer || "",
                            };
                            setCurrentPuzzle(puzzle);
                            setShowPuzzle(true);
                          }
                        } catch (error) {
                          console.error("Error loading puzzle:", error);
                          // Fallback
                          const puzzle: Puzzle = {
                            type: currentRoom.puzzleType!,
                            data: currentRoom.puzzleData || {},
                            solution: (currentRoom.puzzleData as { answer?: string })?.answer || "",
                          };
                          setCurrentPuzzle(puzzle);
                          setShowPuzzle(true);
                        }
                      }}>
                        Solve Puzzle
                      </Button>
                    </>
                  ) : currentPuzzle ? (
                    <PuzzleSolver
                      puzzle={currentPuzzle}
                      onSolve={async () => {
                        // Mark room as completed
                        await fetch(`/api/game/${playerId}/room/${currentRoom.id}/complete`, {
                          method: "POST",
                        });
                        setShowPuzzle(false);
                        loadGameState();
                      }}
                    />
                  ) : null}
                </div>
              )}

              {currentRoom.isCompleted && (
                <div className="border-t border-white/20 pt-4">
                  <div className="bg-green-500/20 text-green-200 p-4 rounded-md border border-green-500/30">
                    ✓ Room completed! You can proceed to the next room.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="py-12 text-center">
              <p className="text-white text-lg mb-4">
                Ready to start your adventure?
              </p>
              <Button
                size="lg"
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/game/${playerId}/start-dungeon`, {
                      method: "POST",
                    });
                    if (response.ok) {
                      loadGameState();
                    }
                  } catch (error) {
                    console.error("Error starting dungeon:", error);
                  }
                }}
              >
                Enter First Dungeon
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

