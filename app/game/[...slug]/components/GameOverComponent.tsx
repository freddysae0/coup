import { ReactElement } from "react";

type GameOverProps = {
  children?: ReactElement;
  win: boolean;
};
export const GameOverComponent: React.FC<GameOverProps> = (win) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center w-full">
        <h1 className="text-4xl font-bold text-primary">
          {win ? "You've won, Congrats" : "Game Over"}
        </h1>
        <p className="text-lg text-default-600">Your game has ended.</p>
      </div>
    </div>
  );
};
