/**
 * Scavenger hunt / exploration-based puzzle system
 * Players explore rooms and find clues that combine to solve puzzles
 */

export interface Clue {
  id: string;
  name: string;
  description: string;
  location: string; // e.g., "bookshelf", "chest", "wall", "floor"
  found: boolean;
  hint?: string;
}

export interface ScavengerHuntPuzzle {
  type: "scavenger-hunt";
  theme: string;
  clues: Clue[];
  solution: string; // The answer that combines all clues
  solutionHint: string; // How the clues combine
  requiredClues: number; // How many clues needed to solve
}

/**
 * Create a scavenger hunt puzzle for a room
 */
export function createScavengerHuntPuzzle(roomTheme: string): ScavengerHuntPuzzle {
  const themes = [
    {
      theme: "Ancient Riddle",
      clues: [
        {
          id: "clue1",
          name: "Old Scroll",
          description: "A weathered scroll with faded writing",
          location: "bookshelf",
          found: false,
          hint: "The first word starts with 'W'",
        },
        {
          id: "clue2",
          name: "Carved Stone",
          description: "A stone tablet with ancient symbols",
          location: "wall",
          found: false,
          hint: "The second word rhymes with 'door'",
        },
        {
          id: "clue3",
          name: "Glowing Crystal",
          description: "A crystal that pulses with light",
          location: "pedestal",
          found: false,
          hint: "The answer is a single word combining both clues",
        },
      ],
      solution: "waterfall",
      solutionHint: "Combine the words from the scroll and stone: 'water' + 'fall'",
      requiredClues: 2,
    },
    {
      theme: "Number Sequence",
      clues: [
        {
          id: "clue1",
          name: "First Number",
          description: "A number carved into a wooden beam",
          location: "ceiling",
          found: false,
          hint: "The number is 2",
        },
        {
          id: "clue2",
          name: "Second Number",
          description: "A number painted on a flag",
          location: "wall",
          found: false,
          hint: "The number is 4",
        },
        {
          id: "clue3",
          name: "Third Number",
          description: "A number etched in stone",
          location: "floor",
          found: false,
          hint: "The number is 8",
        },
        {
          id: "clue4",
          name: "Pattern Hint",
          description: "A note explaining the pattern",
          location: "chest",
          found: false,
          hint: "Each number doubles the previous",
        },
      ],
      solution: "16",
      solutionHint: "The pattern doubles each time: 2, 4, 8, ?",
      requiredClues: 3,
    },
    {
      theme: "Color Combination",
      clues: [
        {
          id: "clue1",
          name: "Red Gem",
          description: "A glowing red gem",
          location: "left wall",
          found: false,
          hint: "Red represents fire",
        },
        {
          id: "clue2",
          name: "Blue Gem",
          description: "A shimmering blue gem",
          location: "right wall",
          found: false,
          hint: "Blue represents water",
        },
        {
          id: "clue3",
          name: "Combination Note",
          description: "Instructions for combining the gems",
          location: "altar",
          found: false,
          hint: "Combine fire and water to get...",
        },
      ],
      solution: "steam",
      solutionHint: "Fire + Water = Steam",
      requiredClues: 2,
    },
    {
      theme: "Direction Puzzle",
      clues: [
        {
          id: "clue1",
          name: "North Arrow",
          description: "An arrow pointing north",
          location: "north wall",
          found: false,
          hint: "Points to 'N'",
        },
        {
          id: "clue2",
          name: "East Arrow",
          description: "An arrow pointing east",
          location: "east wall",
          found: false,
          hint: "Points to 'E'",
        },
        {
          id: "clue3",
          name: "South Arrow",
          description: "An arrow pointing south",
          location: "south wall",
          found: false,
          hint: "Points to 'S'",
        },
        {
          id: "clue4",
          name: "West Arrow",
          description: "An arrow pointing west",
          location: "west wall",
          found: false,
          hint: "Points to 'W'",
        },
      ],
      solution: "news",
      solutionHint: "Combine the directions: N + E + W + S",
      requiredClues: 4,
    },
  ];

  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
  
  return {
    type: "scavenger-hunt",
    theme: selectedTheme.theme,
    clues: selectedTheme.clues.map(clue => ({ ...clue })),
    solution: selectedTheme.solution.toLowerCase(),
    solutionHint: selectedTheme.solutionHint,
    requiredClues: selectedTheme.requiredClues,
  };
}

/**
 * Check if enough clues are found to attempt solving
 */
export function canAttemptSolution(puzzle: ScavengerHuntPuzzle): boolean {
  const foundClues = puzzle.clues.filter(c => c.found).length;
  return foundClues >= puzzle.requiredClues;
}

/**
 * Check if the solution is correct
 */
export function checkScavengerSolution(
  puzzle: ScavengerHuntPuzzle,
  userAnswer: string
): { solved: boolean; message: string } {
  const normalizedAnswer = userAnswer.toLowerCase().trim();
  const normalizedSolution = puzzle.solution.toLowerCase().trim();

  if (normalizedAnswer === normalizedSolution) {
    return {
      solved: true,
      message: "Correct! You solved the puzzle by combining all the clues!",
    };
  }

  const foundClues = puzzle.clues.filter(c => c.found).length;
  if (foundClues < puzzle.requiredClues) {
    return {
      solved: false,
      message: `You need to find at least ${puzzle.requiredClues} clues before attempting to solve. You've found ${foundClues}.`,
    };
  }

  return {
    solved: false,
    message: "That's not quite right. Review the clues you've found and try again!",
  };
}

