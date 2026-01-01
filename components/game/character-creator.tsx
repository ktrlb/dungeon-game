"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CharacterAppearance {
  gender: string;
  race: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  skinTone: string;
  clothing: string;
  accessories: string[];
}

interface CharacterStats {
  strength: number;
  intelligence: number;
  agility: number;
  wisdom: number;
}

const INITIAL_STATS: CharacterStats = {
  strength: 10,
  intelligence: 10,
  agility: 10,
  wisdom: 10,
};

const TOTAL_POINTS = 20; // Points to distribute beyond base stats

const APPEARANCE_OPTIONS = {
  gender: ["Boy", "Girl"],
  race: ["Human", "Elf", "Dwarf", "Halfling", "Gnome"],
  hairColor: ["Black", "Brown", "Blonde", "Red", "Silver", "Blue", "Green"],
  hairStyle: ["Short", "Medium", "Long", "Braided", "Curly", "Spiky", "Bald"],
  eyeColor: ["Brown", "Blue", "Green", "Hazel", "Amber", "Purple", "Silver"],
  skinTone: ["Fair", "Light", "Medium", "Olive", "Tan", "Dark", "Pale"],
  clothing: ["Adventurer's Gear", "Scholar's Robes", "Ranger's Outfit", "Warrior's Armor", "Mage's Cloak", "Rogue's Leather"],
  accessories: ["Glasses", "Hat", "Scarf", "Jewelry", "Tattoos", "None"],
};

export function CharacterCreator() {
  const router = useRouter();
  const [step, setStep] = useState<"name" | "appearance" | "stats">("name");
  const [name, setName] = useState("");
  const [appearance, setAppearance] = useState<CharacterAppearance>({
    gender: "Boy",
    race: "Human",
    hairColor: "Brown",
    hairStyle: "Medium",
    eyeColor: "Brown",
    skinTone: "Medium",
    clothing: "Adventurer's Gear",
    accessories: [],
  });
  const [stats, setStats] = useState<CharacterStats>(INITIAL_STATS);
  const [remainingPoints, setRemainingPoints] = useState(TOTAL_POINTS);
  const [isLoading, setIsLoading] = useState(false);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [generatingPortrait, setGeneratingPortrait] = useState(false);

  function updateStat(stat: keyof CharacterStats, delta: number) {
    const newValue = stats[stat] + delta;
    const newRemaining = remainingPoints - delta;
    
    if (newValue < 5 || newValue > 20) return; // Min 5, Max 20
    if (newRemaining < 0) return; // Can't go negative
    
    setStats({ ...stats, [stat]: newValue });
    setRemainingPoints(newRemaining);
  }

  function updateAppearance(field: keyof CharacterAppearance, value: string) {
    if (field === "accessories") {
      const current = appearance.accessories;
      const newAccessories = current.includes(value)
        ? current.filter(a => a !== value)
        : [...current, value];
      setAppearance({ ...appearance, accessories: newAccessories });
    } else {
      setAppearance({ ...appearance, [field]: value });
    }
    // Reset portrait when appearance changes
    setPortraitUrl(null);
  }

  async function generatePortrait() {
    setGeneratingPortrait(true);
    try {
      const response = await fetch("/api/game/generate-portrait", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appearance }),
      });

      if (!response.ok) throw new Error("Failed to generate portrait");

      const data = await response.json();
      setPortraitUrl(data.portraitUrl);
    } catch (error) {
      console.error("Error generating portrait:", error);
      alert("Failed to generate portrait. You can continue without it.");
    } finally {
      setGeneratingPortrait(false);
    }
  }

  async function handleSubmit() {
    if (!name.trim() || remainingPoints > 0) return;

    setIsLoading(true);
    try {
      // Include portrait URL in appearance if generated
      const finalAppearance = portraitUrl
        ? { ...appearance, portraitUrl }
        : appearance;

      const response = await fetch("/api/game/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          appearance: finalAppearance,
          stats,
        }),
      });

      if (!response.ok) throw new Error("Failed to create character");

      const data = await response.json();
      router.push(`/game/${data.playerId}`);
    } catch (error) {
      console.error("Error creating character:", error);
      alert("Failed to create character. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function renderStep() {
    switch (step) {
      case "name":
        return (
          <div className="space-y-6">
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
              type="button"
              onClick={() => setStep("appearance")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg py-6 dungeon-glow"
              disabled={!name.trim()}
            >
              Next: Customize Appearance
            </Button>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            {/* Character Preview */}
            <div className="bg-slate-900/50 p-6 rounded-lg border border-purple-500/30">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex-shrink-0">
                  {portraitUrl ? (
                    <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-purple-500/50">
                      <img
                        src={portraitUrl}
                        alt="Character portrait"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-lg bg-slate-800 border-2 border-purple-500/30 flex items-center justify-center">
                      <span className="text-6xl">⚔️</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Character Preview</h3>
                    <div className="text-purple-200 text-sm space-y-1">
                      <p><span className="font-semibold">Gender:</span> {appearance.gender}</p>
                      <p><span className="font-semibold">Race:</span> {appearance.race}</p>
                      <p><span className="font-semibold">Hair:</span> {appearance.hairColor} {appearance.hairStyle}</p>
                      <p><span className="font-semibold">Eyes:</span> {appearance.eyeColor}</p>
                      <p><span className="font-semibold">Skin:</span> {appearance.skinTone}</p>
                      <p><span className="font-semibold">Clothing:</span> {appearance.clothing}</p>
                      {appearance.accessories.length > 0 && (
                        <p><span className="font-semibold">Accessories:</span> {appearance.accessories.join(", ")}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={generatePortrait}
                    disabled={generatingPortrait}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    {generatingPortrait ? "Generating..." : "🎨 Generate Portrait"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(APPEARANCE_OPTIONS).map(([key, options]) => {
                if (key === "accessories") return null;
                return (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-white mb-2 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <select
                      value={appearance[key as keyof Omit<CharacterAppearance, "accessories">]}
                      onChange={(e) => updateAppearance(key as keyof CharacterAppearance, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border-2 border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Accessories (select multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {APPEARANCE_OPTIONS.accessories.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateAppearance("accessories", option)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      appearance.accessories.includes(option)
                        ? "bg-purple-600 border-purple-400 text-white"
                        : "bg-slate-900/50 border-purple-500/30 text-purple-200 hover:border-purple-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setStep("name")}
                variant="outline"
                className="flex-1 bg-purple-900/50 text-white border-purple-500/50 hover:bg-purple-800/50"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setStep("stats")}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold dungeon-glow"
              >
                Next: Allocate Stats
              </Button>
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="space-y-6">
            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
              <p className="text-white font-semibold text-center">
                Remaining Points: <span className="text-purple-300 text-xl">{remainingPoints}</span>
              </p>
              <p className="text-purple-200 text-sm text-center mt-1">
                Distribute {TOTAL_POINTS} points across your stats (Min: 5, Max: 20)
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(stats).map(([stat, value]) => (
                <div key={stat} className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white font-semibold capitalize">
                      {stat.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <span className="text-purple-300 font-bold text-xl">{value}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => updateStat(stat as keyof CharacterStats, -1)}
                      disabled={value <= 5 || remainingPoints >= TOTAL_POINTS}
                      className="flex-1 bg-red-600/50 hover:bg-red-600 text-white disabled:opacity-30"
                    >
                      -
                    </Button>
                    <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all"
                        style={{ width: `${((value - 5) / 15) * 100}%` }}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => updateStat(stat as keyof CharacterStats, 1)}
                      disabled={value >= 20 || remainingPoints <= 0}
                      className="flex-1 bg-green-600/50 hover:bg-green-600 text-white disabled:opacity-30"
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setStep("appearance")}
                variant="outline"
                className="flex-1 bg-purple-900/50 text-white border-purple-500/50 hover:bg-purple-800/50"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={remainingPoints > 0 || isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg py-6 dungeon-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚔️</span>
                    Creating Character...
                  </span>
                ) : (
                  "Create Character & Start Adventure"
                )}
              </Button>
            </div>
          </div>
        );
    }
  }

  return (
    <Card className="dungeon-card dungeon-glow max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-2xl flex items-center gap-3">
          <span className="text-3xl">⚔️</span>
          Character Creation
        </CardTitle>
        <CardDescription className="text-purple-200 text-base">
          {step === "name" && "Step 1: Choose your character's name"}
          {step === "appearance" && "Step 2: Customize your character's appearance"}
          {step === "stats" && "Step 3: Allocate stat points"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}

