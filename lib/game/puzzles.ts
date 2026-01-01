/**
 * Puzzle types and generators for the dungeon game
 */

export interface Puzzle {
  type: string;
  data: Record<string, unknown>;
  solution: string | number | string[];
}

export interface PuzzleResult {
  solved: boolean;
  message: string;
}

/**
 * Riddle puzzle - player must answer a riddle
 */
export function createRiddlePuzzle(): Puzzle {
  const riddles = [
    {
      question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      answer: "echo",
    },
    {
      question: "The more you take, the more you leave behind. What am I?",
      answer: "footsteps",
    },
    {
      question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
      answer: "map",
    },
    {
      question: "What has keys but no locks, space but no room, and you can enter but not go inside?",
      answer: "keyboard",
    },
  ];

  const riddle = riddles[Math.floor(Math.random() * riddles.length)];

  return {
    type: "riddle",
    data: {
      question: riddle.question,
    },
    solution: riddle.answer.toLowerCase(),
  };
}

/**
 * Pattern puzzle - player must identify the pattern
 */
export function createPatternPuzzle(): Puzzle {
  const patterns = [
    {
      sequence: [2, 4, 6, 8, "?"],
      answer: "10",
      hint: "Even numbers",
    },
    {
      sequence: [1, 1, 2, 3, 5, "?"],
      answer: "8",
      hint: "Fibonacci sequence",
    },
    {
      sequence: ["A", "C", "E", "G", "?"],
      answer: "I",
      hint: "Skip one letter",
    },
  ];

  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  return {
    type: "pattern",
    data: {
      sequence: pattern.sequence,
      hint: pattern.hint,
    },
    solution: pattern.answer,
  };
}

/**
 * Word puzzle - player must unscramble words
 */
export function createWordPuzzle(): Puzzle {
  const words = [
    { scrambled: "TREASURE", answer: "TREASURE" },
    { scrambled: "ADVENTURE", answer: "ADVENTURE" },
    { scrambled: "MYSTERY", answer: "MYSTERY" },
    { scrambled: "PUZZLE", answer: "PUZZLE" },
  ];

  const word = words[Math.floor(Math.random() * words.length)];
  const scrambled = word.scrambled.split("").sort(() => Math.random() - 0.5).join("");

  return {
    type: "word",
    data: {
      scrambled,
    },
    solution: word.answer,
  };
}

/**
 * Check if a puzzle solution is correct
 */
export function checkPuzzleSolution(
  puzzle: Puzzle,
  userAnswer: string
): PuzzleResult {
  const normalizedUserAnswer = userAnswer.toLowerCase().trim();
  const normalizedSolution = String(puzzle.solution).toLowerCase().trim();

  if (normalizedUserAnswer === normalizedSolution) {
    return {
      solved: true,
      message: "Correct! You solved the puzzle!",
    };
  }

  return {
    solved: false,
    message: "That's not quite right. Try again!",
  };
}

