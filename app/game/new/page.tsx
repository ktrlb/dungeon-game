import { redirect } from "next/navigation";
import { NewGameForm } from "@/components/game/new-game-form";

export default function NewGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Create Your Character
          </h1>
          <NewGameForm />
        </div>
      </div>
    </div>
  );
}

