import { redirect } from "next/navigation";
import { GameView } from "@/components/game/game-view";

interface GamePageProps {
  params: Promise<{ playerId: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { playerId } = await params;
  return <GameView playerId={playerId} />;
}

