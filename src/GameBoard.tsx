import {
    useLoaderData,
    useFetcher,
    type LoaderFunctionArgs,
    type ActionFunctionArgs,
} from "react-router-dom";
import PlayerCell from "./PlayerCell";
import EnemyCell from "./EnemyCell";

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

export const gameBoardAction = async ({
    params,
    request,
}: ActionFunctionArgs) => {
    const { gameid } = params;
    const formData = await request.formData();
    const cellIndex = formData.get("cellIndex");

    const response = await fetch(`/api/play/${gameid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ Guess: Number(cellIndex) }),
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
        PlayerHits: rawJson.PlayerHits ?? [],
        PlayerMisses: rawJson.PlayerMisses ?? [],
        PlayerShips: rawJson.PlayerShips ?? [], // Already has data, but safe to include
    };
};

const GameBoard = () => {
    const data = useLoaderData() as any;
    const fetcher = useFetcher(); // Grab the fetcher hook

    const gs = transformResponse(data);
    const opponentHits = Object.values(gs.OpponentHits);
    const opponentMisses = Object.values(gs.OpponentMisses);

    // Read current submission state for loading feedback (Optimistic UI)
    const isSubmitting = fetcher.state !== "idle";

    const handleCellClick = (idx: number) => {
        if (isSubmitting) return; // Prevent clicking while a move is processing
        if (opponentHits.includes(idx) || opponentMisses.includes(idx)) return; // Already targeted

        // Submit the cell index to your Route Action
        fetcher.submit({ cellIndex: idx.toString() }, { method: "POST" });
    };
    const playerShipsIndices = Object.values(gs.PlayerShips).flat();
    const playerHits = Object.values(gs.PlayerHits);
    const playerMisses = Object.values(gs.PlayerMisses);

    const enemyCells = Array.from({ length: 100 }, (_, idx) => (
        <EnemyCell
            key={idx}
            isHit={playerHits.includes(idx)}
            isMiss={playerMisses.includes(idx)}
            idx={idx}
            onClick={handleCellClick}
        />
    ));

    const playerCells = Array.from({ length: 100 }, (_, idx) => (
        <PlayerCell
            key={idx}
            isShip={playerShipsIndices.includes(idx)}
            isHit={opponentHits.includes(idx)}
            isMiss={opponentMisses.includes(idx)}
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
