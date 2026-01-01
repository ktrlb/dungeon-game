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
            <p className="text-purple-100 text-lg leading-relaxed">{puzzle.data.question as string}</p>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-5 py-4 rounded-lg bg-slate-900/50 border-2 border-purple-500/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all"
              placeholder="Your answer..."
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            />
          </div>
        );

      case "pattern":
        return (
          <div className="space-y-4">
            <p className="text-purple-100 text-lg font-semibold">Complete the pattern:</p>
            <div className="text-3xl font-mono text-white bg-slate-800/50 p-6 rounded-lg border border-purple-500/30 text-center">
              {(puzzle.data.sequence as unknown[]).map((item, i) => (
                <span key={i} className="mx-2">
                  {item === "?" ? <span className="text-purple-400">?</span> : String(item)}
                </span>
              ))}
            </div>
            {(() => {
              const hint = puzzle.data.hint;
              return hint && typeof hint === "string" ? (
                <p className="text-purple-300 text-sm bg-purple-900/30 p-3 rounded-lg border border-purple-500/20">
                  💡 Hint: {hint}
                </p>
              ) : null;
            })()}
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-5 py-4 rounded-lg bg-slate-900/50 border-2 border-purple-500/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all"
              placeholder="What comes next?"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            />
          </div>
        );

      case "word":
        return (
          <div className="space-y-4">
            <p className="text-purple-100 text-lg font-semibold">Unscramble this word:</p>
            <div className="text-4xl font-bold text-white tracking-wider bg-slate-800/50 p-6 rounded-lg border border-purple-500/30 text-center">
              {puzzle.data.scrambled as string}
            </div>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-5 py-4 rounded-lg bg-slate-900/50 border-2 border-purple-500/30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all uppercase"
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
    <Card className="dungeon-card dungeon-glow">
      <CardHeader>
        <CardTitle className="text-white text-xl flex items-center gap-2">
          <span className="text-2xl">🧩</span>
          Solve the Puzzle
        </CardTitle>
        <CardDescription className="text-purple-200 text-base">
          {puzzle.type.charAt(0).toUpperCase() + puzzle.type.slice(1)} Puzzle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/30">
          {renderPuzzleContent()}
        </div>
        
        {result && (
          <div
            className={`p-5 rounded-lg border-2 ${
              result.solved
                ? "bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-200 border-green-500/50 shadow-lg"
                : "bg-gradient-to-r from-red-900/50 to-rose-900/50 text-red-200 border-red-500/50 shadow-lg"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{result.solved ? "✅" : "❌"}</span>
              <span className="font-semibold">{result.message}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg py-6 dungeon-glow disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!answer.trim() || result?.solved}
        >
          {result?.solved ? (
            <span className="flex items-center gap-2">
              <span>✅</span>
              Solved!
            </span>
          ) : (
            "Submit Answer"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

