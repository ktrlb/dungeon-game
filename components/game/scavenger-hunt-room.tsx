"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import type { ScavengerHuntPuzzle } from "@/lib/game/scavenger-hunt";
import { checkScavengerSolution, canAttemptSolution } from "@/lib/game/scavenger-hunt";

interface ScavengerHuntRoomProps {
  puzzle: ScavengerHuntPuzzle;
  roomImageUrl: string | null;
  roomName: string;
  onSolve: () => void;
}

export function ScavengerHuntRoom({ puzzle, roomImageUrl, roomName, onSolve }: ScavengerHuntRoomProps) {
  const [foundClues, setFoundClues] = useState<string[]>([]);
  const [showSolutionInput, setShowSolutionInput] = useState(false);
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState<{ solved: boolean; message: string } | null>(null);

  function handleClueClick(clueId: string) {
    if (!foundClues.includes(clueId)) {
      setFoundClues([...foundClues, clueId]);
      // Update puzzle state
      const clue = puzzle.clues.find(c => c.id === clueId);
      if (clue) {
        clue.found = true;
      }
    }
  }

  function handleAttemptSolution(e: React.FormEvent) {
    e.preventDefault();
    const updatedPuzzle = {
      ...puzzle,
      clues: puzzle.clues.map(c => ({
        ...c,
        found: foundClues.includes(c.id),
      })),
    };
    const checkResult = checkScavengerSolution(updatedPuzzle, solution);
    setResult(checkResult);
    
    if (checkResult.solved) {
      setTimeout(() => {
        onSolve();
      }, 2000);
    }
  }

  const foundCluesList = puzzle.clues.filter(c => foundClues.includes(c.id));
  const canSolve = canAttemptSolution({
    ...puzzle,
    clues: puzzle.clues.map(c => ({
      ...c,
      found: foundClues.includes(c.id),
    })),
  });

  return (
    <div className="space-y-6">
      {/* Room Image with Clickable Areas */}
      {roomImageUrl && (
        <div className="relative w-full h-80 rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-2xl">
          <Image
            src={roomImageUrl}
            alt={roomName}
            fill
            className="object-cover"
            unoptimized={roomImageUrl.includes("via.placeholder.com")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
          
          {/* Clickable clue locations overlay */}
          <div className="absolute inset-0">
            {puzzle.clues.map((clue, index) => {
              if (foundClues.includes(clue.id)) return null;
              
              // Position clues in different areas
              const positions: Record<string, { top: string; left: string }> = {
                "bookshelf": { top: "20%", left: "10%" },
                "wall": { top: "30%", left: "70%" },
                "chest": { top: "60%", left: "50%" },
                "floor": { top: "75%", left: "30%" },
                "pedestal": { top: "50%", left: "80%" },
                "ceiling": { top: "10%", left: "50%" },
                "altar": { top: "40%", left: "20%" },
                "left wall": { top: "40%", left: "5%" },
                "right wall": { top: "40%", left: "90%" },
                "north wall": { top: "5%", left: "50%" },
                "east wall": { top: "50%", left: "95%" },
                "south wall": { top: "95%", left: "50%" },
                "west wall": { top: "50%", left: "5%" },
              };
              
              const position = positions[clue.location.toLowerCase()] || { 
                top: `${20 + (index * 15)}%`, 
                left: `${10 + (index * 20)}%` 
              };
              
              return (
                <button
                  key={clue.id}
                  onClick={() => handleClueClick(clue.id)}
                  className="absolute w-12 h-12 rounded-full bg-purple-500/70 hover:bg-purple-500 border-2 border-white/50 cursor-pointer transition-all hover:scale-110 flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse"
                  style={position}
                  title={`Click to explore ${clue.location}`}
                >
                  ?
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Puzzle Theme */}
      <Card className="dungeon-card dungeon-glow">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            {puzzle.theme}
          </CardTitle>
          <CardDescription className="text-purple-200 text-base">
            Explore the room to find clues! Click on the glowing question marks to discover hidden items.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Found Clues */}
      {foundCluesList.length > 0 && (
        <Card className="dungeon-card dungeon-glow">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <span className="text-xl">📋</span>
              Found Clues ({foundCluesList.length} / {puzzle.clues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {foundCluesList.map((clue) => {
                const clueData = puzzle.clues.find(c => c.id === clue.id);
                if (!clueData) return null;
                return (
                  <div
                    key={clue.id}
                    className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-4 rounded-lg border border-purple-500/30"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✨</span>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">{clueData.name}</h4>
                        <p className="text-purple-200 text-sm mb-2">{clueData.description}</p>
                        {clueData.hint && (
                          <p className="text-purple-300 text-xs bg-purple-900/30 p-2 rounded border border-purple-500/20">
                            💡 {clueData.hint}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solution Input */}
      {canSolve && !result?.solved && (
        <Card className="dungeon-card dungeon-glow">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <span className="text-xl">🧩</span>
              Ready to Solve!
            </CardTitle>
            <CardDescription className="text-purple-200 text-base">
              You've found enough clues. Combine them to solve the puzzle!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAttemptSolution} className="space-y-4">
              <div>
                <p className="text-purple-200 text-sm mb-2">{puzzle.solutionHint}</p>
                <input
                  type="text"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full px-5 py-4 rounded-lg bg-slate-900/50 border-2 border-purple-500/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all"
                  placeholder="Enter your solution..."
                  onKeyDown={(e) => e.key === "Enter" && handleAttemptSolution(e)}
                />
              </div>
              {result && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    result.solved
                      ? "bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-200 border-green-500/50"
                      : "bg-gradient-to-r from-red-900/50 to-rose-900/50 text-red-200 border-red-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{result.solved ? "✅" : "❌"}</span>
                    <span className="font-semibold">{result.message}</span>
                  </div>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg py-6 dungeon-glow disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!solution.trim() || result?.solved}
              >
                {result?.solved ? (
                  <span className="flex items-center gap-2">
                    <span>✅</span>
                    Solved!
                  </span>
                ) : (
                  "Submit Solution"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      {!canSolve && (
        <Card className="dungeon-card">
          <CardContent className="py-4">
            <p className="text-purple-200 text-center">
              Find {puzzle.requiredClues - foundCluesList.length} more clue{puzzle.requiredClues - foundCluesList.length !== 1 ? "s" : ""} to unlock the solution!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

