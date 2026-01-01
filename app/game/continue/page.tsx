import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContinueGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Continue Your Adventure
          </h1>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Load Saved Game</CardTitle>
              <CardDescription className="text-blue-200">
                Enter your player ID to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-4">
                This feature will be implemented to allow you to save and load your game progress.
              </p>
              <Link href="/">
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

