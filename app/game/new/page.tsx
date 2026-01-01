import { CharacterCreator } from "@/components/game/character-creator";

export default function NewGamePage() {
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-glow font-serif">
              Create Your Character
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
            <p className="text-purple-200 text-lg mt-4">
              Design your adventurer and prepare for your journey
            </p>
          </div>
          <CharacterCreator />
        </div>
      </div>
    </div>
  );
}

