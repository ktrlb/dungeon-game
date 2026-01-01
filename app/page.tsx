import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Title */}
          <div className="space-y-4 mb-12">
            <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 text-glow font-serif">
              🏰 Dungeon Trawler
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
            <p className="text-2xl md:text-3xl text-purple-200 font-medium mb-4">
              Embark on a Creative Puzzle Adventure
            </p>
            <p className="text-lg text-purple-300/80 max-w-2xl mx-auto">
              Explore mysterious dungeons, solve creative puzzles, and uncover secrets as you progress through each level
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="dungeon-card group cursor-pointer">
              <Link href="/game/new" className="block">
                <CardHeader>
                  <CardTitle className="text-white text-2xl mb-2 flex items-center gap-2">
                    <span className="text-3xl">⚔️</span>
                    Start New Adventure
                  </CardTitle>
                  <CardDescription className="text-purple-200 text-base">
                    Create a new character and begin your journey into the unknown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg py-6 dungeon-glow">
                    Begin Quest
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="dungeon-card group cursor-pointer">
              <Link href="/game/continue" className="block">
                <CardHeader>
                  <CardTitle className="text-white text-2xl mb-2 flex items-center gap-2">
                    <span className="text-3xl">🗺️</span>
                    Continue Adventure
                  </CardTitle>
                  <CardDescription className="text-purple-200 text-base">
                    Resume your existing game and continue where you left off
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="lg" variant="outline" className="w-full bg-purple-900/50 text-white border-purple-500/50 hover:bg-purple-800/50 hover:border-purple-400 font-semibold text-lg py-6">
                    Resume Journey
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* About Card */}
          <Card className="dungeon-card">
            <CardHeader>
              <CardTitle className="text-white text-2xl mb-2 flex items-center gap-2">
                <span className="text-2xl">📜</span>
                About the Game
              </CardTitle>
            </CardHeader>
            <CardContent className="text-left text-purple-100 space-y-4">
              <p className="text-lg leading-relaxed">
                Dungeon Trawler is a creative puzzle-solving adventure game designed for middle-grade players and up. 
                Explore mysterious dungeons filled with challenging puzzles, solve creative riddles, and uncover secrets 
                as you progress through each level.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🧩</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Creative Puzzles</h4>
                    <p className="text-purple-200 text-sm">Riddles, patterns, and word challenges</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">AI-Generated Rooms</h4>
                    <p className="text-purple-200 text-sm">Beautiful, unique dungeon environments</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Progressive Levels</h4>
                    <p className="text-purple-200 text-sm">Increasing difficulty as you advance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Engaging Story</h4>
                    <p className="text-purple-200 text-sm">Immersive narrative elements</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
