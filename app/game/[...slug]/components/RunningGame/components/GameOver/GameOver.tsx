import { Button } from "@heroui/react";
import { Link } from "@heroui/link";

type GameOverProps = {
  win: boolean;
  winnerName?: string;
  canRestart?: boolean;
  onRestart?: () => void;
};

const GameOver: React.FC<GameOverProps> = ({
  win,
  winnerName,
  canRestart,
  onRestart,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center w-full">
        <h1 className="text-4xl font-bold text-primary" data-testid="game-over">
          {win ? "You've won, Congrats" : "Game Over"}
        </h1>
        <p className="text-lg text-default-600">
          {win ? "You are the last one standing." : `${winnerName} won.`}
        </p>
      </div>
      <div className="flex gap-2">
        {canRestart ? (
          <Button color="primary" data-testid="restart" onPress={onRestart}>
            Play again with this room
          </Button>
        ) : (
          <p className="text-sm text-default-500">
            Waiting for the host to start a rematch…
          </p>
        )}
        <Button as={Link} href="/" variant="light">
          Home
        </Button>
      </div>
    </div>
  );
};

export default GameOver;
