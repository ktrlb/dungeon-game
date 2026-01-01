import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold text-white mb-4">
            🏰 Dungeon Trawler
          </h1>
          <p className="text-xl text-blue-100 mb-12">
            Embark on a creative puzzle-solving adventure through mysterious dungeons!
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Start New Adventure</CardTitle>
                <CardDescription className="text-blue-200">
                  Create a new character and begin your journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/game/new">
                  <Button size="lg" className="w-full">
                    New Game
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Continue Adventure</CardTitle>
                <CardDescription className="text-blue-200">
                  Resume your existing game
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/game/continue">
                  <Button size="lg" variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Continue
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">About the Game</CardTitle>
            </CardHeader>
            <CardContent className="text-left text-blue-100 space-y-4">
              <p>
                Dungeon Trawler is a creative puzzle-solving adventure game designed for middle-grade players and up. 
                Explore mysterious dungeons, solve creative puzzles, and uncover secrets as you progress through 
                each level.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Creative puzzle-solving challenges</li>
                <li>Beautiful AI-generated dungeon rooms</li>
                <li>Progressive difficulty levels</li>
                <li>Engaging story elements</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
