"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Puzzle } from "@/lib/game/puzzles";
import { checkPuzzleSolution } from "@/lib/game/puzzles";

interface PuzzleSolverProps {
  puzzle: Puzzle;
  onSolve: () => void;
}

export function PuzzleSolver({ puzzle, onSolve }: PuzzleSolverProps) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ solved: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const checkResult = checkPuzzleSolution(puzzle, answer);
    setResult(checkResult);
    
    if (checkResult.solved) {
      setTimeout(() => {
        onSolve();
      }, 1500);
    }
  }

  function renderPuzzleContent() {
    switch (puzzle.type) {
      case "riddle":
        return (
          <div className="space-y-4">
            <p className="text-white text-lg">{puzzle.data.question as string}</p>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your answer..."
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            />
          </div>
        );

      case "pattern":
        return (
          <div className="space-y-4">
            <p className="text-white">Complete the pattern:</p>
            <div className="text-2xl font-mono text-white">
              {(puzzle.data.sequence as unknown[]).map((item, i) => (
                <span key={i} className="mx-2">
                  {item === "?" ? "?" : String(item)}
                </span>
              ))}
            </div>
            {(() => {
              const hint = puzzle.data.hint;
              return hint && typeof hint === "string" ? (
                <p className="text-blue-200 text-sm">Hint: {hint}</p>
              ) : null;
            })()}
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="What comes next?"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            />
          </div>
        );

      case "word":
        return (
          <div className="space-y-4">
            <p className="text-white">Unscramble this word:</p>
            <div className="text-3xl font-bold text-white tracking-wider">
              {puzzle.data.scrambled as string}
            </div>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Unscrambled word..."
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            />
          </div>
        );

      default:
        return <p className="text-white">Unknown puzzle type</p>;
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Solve the Puzzle</CardTitle>
        <CardDescription className="text-blue-200">
          {puzzle.type.charAt(0).toUpperCase() + puzzle.type.slice(1)} Puzzle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderPuzzleContent()}
        
        {result && (
          <div
            className={`p-4 rounded-md ${
              result.solved
                ? "bg-green-500/20 text-green-200 border border-green-500/30"
                : "bg-red-500/20 text-red-200 border border-red-500/30"
            }`}
          >
            {result.message}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!answer.trim() || result?.solved}
        >
          {result?.solved ? "Solved!" : "Submit Answer"}
        </Button>
      </CardContent>
    </Card>
  );
}

