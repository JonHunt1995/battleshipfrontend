import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import ShipsState from "./ShipPlacementModal";
import PlayerCell from "./PlayerCell";

export const gameBoardLoader = async ({ request }: LoaderFunctionArgs) => {
  const response = await fetch("/api/play", {
    method: "GET",
    credentials: "include",
  });

  if (response.ok) {
    return response.json();
  }

  throw response;
};

const GameBoard = () => {
  const data = useLoaderData() as any;
  console.log(data);

  const enemyCells = Array.from({ length: 100 }, (_, idx) => (
    <PlayerCell
      key={idx}
      isShip={false}
      isHit={false}
      isMiss={false}
      idx={idx}
    />
  ));

  const allShipsIndices = Object.values(data).flat();
  const playerCells = Array.from({ length: 100 }, (_, idx) => (
    <PlayerCell
      key={idx}
      isShip={allShipsIndices.includes(idx)}
      isHit={false}
      isMiss={false}
      idx={idx}
      style={{ viewTransitionName: `cell-${idx}` }}
    />
  ));
  return (
    <div className="Game">
      <h2>Enemy Radar</h2>
      <div className="enemy board">{enemyCells}</div>
      <h2>Your Ships</h2>
      <div className="player board">{playerCells}</div>
    </div>
  );
};

export default GameBoard;
