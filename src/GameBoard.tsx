import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import PlayerCell from "./PlayerCell";

export const gameBoardLoader = async ({ params }: LoaderFunctionArgs) => {
  const { gameid } = params;
  const response = await fetch(`/api/play/${gameid}`, {
    method: "GET",
    credentials: "include",
  });

  if (response.ok) {
    return await response.json();
  }

  throw response;
};

interface ShipStatus {
  Carrier: boolean;
  Battleship: boolean;
  Cruiser: boolean;
  Submarine: boolean;
  Destroyer: boolean;
}

interface GameState {
  OpponentHits: number[];
  OpponentLivingShips: ShipStatus;
  OpponentMisses: number[];
  OpponentShips: number[];
  PlayerHits: number[];
  PlayerLivingShips: ShipStatus;
  PlayerMisses: number[];
  PlayerShips: number[];
}

const transformResponse = (rawJson: any): GameState => {
  return {
    ...rawJson,
    OpponentHits: rawJson.OpponentHits ?? [],
    OpponentMisses: rawJson.OpponentMisses ?? [],
    OpponentShips: rawJson.OpponentShips ?? [],
    PlayerHits: rawJson.PlayerHits ?? [],
    PlayerMisses: rawJson.PlayerMisses ?? [],
    PlayerShips: rawJson.PlayerShips ?? [], // Already has data, but safe to include
  };
};

const GameBoard = () => {
  const data = useLoaderData() as any;
  console.log(data);
  const gs = transformResponse(data);
  const opponentShipsIndices = Object.values(gs.OpponentShips).flat();
  const opponentHits = Object.values(gs.OpponentHits);
  const opponentMisses = Object.values(gs.OpponentMisses);
  const enemyCells = Array.from({ length: 100 }, (_, idx) => (
    <PlayerCell
      key={idx}
      isShip={opponentShipsIndices.includes(idx)}
      isHit={opponentHits.includes(idx)}
      isMiss={opponentMisses.includes(idx)}
      idx={idx}
    />
  ));

  const playerShipsIndices = Object.values(gs.PlayerShips).flat();
  const playerHits = Object.values(gs.PlayerHits);
  const playerMisses = Object.values(gs.OpponentMisses);
  const playerCells = Array.from({ length: 100 }, (_, idx) => (
    <PlayerCell
      key={idx}
      isShip={playerShipsIndices.includes(idx)}
      isHit={playerHits.includes(idx)}
      isMiss={playerMisses.includes(idx)}
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
