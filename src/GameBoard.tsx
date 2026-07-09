import {
    useLoaderData,
    useFetcher,
    useParams,
    useRevalidator,
    type LoaderFunctionArgs,
    type ActionFunctionArgs,
} from "react-router-dom";
import PlayerCell from "./PlayerCell";
import EnemyCell from "./EnemyCell";
import useAdaptivePolling from "./useAdaptivePolling";
import Result from "./Result";

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
    IsYourTurn: boolean;
    TurnNumber: number;
    VictoryStatus: -1 | 0 | 1;
    GameIsReady: boolean;
}

const transformResponse = (rawJson: any): GameState => {
    return {
        ...rawJson,
        OpponentHits: rawJson.OpponentHits ?? [],
        OpponentMisses: rawJson.OpponentMisses ?? [],
        PlayerHits: rawJson.PlayerHits ?? [],
        PlayerMisses: rawJson.PlayerMisses ?? [],
        PlayerShips: rawJson.PlayerShips ?? [],
    };
};

const GameBoard = () => {
    const data = useLoaderData() as GameState;
    const fetcher = useFetcher();
    const { gameid } = useParams();
    const { revalidate } = useRevalidator();

    const gs = transformResponse(data);
    const opponentHits = gs.OpponentHits;
    const opponentMisses = gs.OpponentMisses;
    const playerHits = gs.PlayerHits;
    const playerShipsIndices = Object.values(gs.PlayerShips).flat();
    const playerMisses = gs.PlayerMisses;

    useAdaptivePolling(
        gameid as string,
        gs.TurnNumber,
        gs.IsYourTurn,
        gs.VictoryStatus,
        revalidate,
    );
    // Read current submission state for loading feedback (Optimistic UI)
    const isSubmitting = fetcher.state !== "idle";

    const handleCellClick = (idx: number) => {
        console.log("reaches here", idx);
        if (isSubmitting || !gs.IsYourTurn || gs.VictoryStatus !== 0 || playerHits.includes(idx) || playerMisses.includes(idx)) return; // Prevent clicking while a move is processing
        console.log("it's going to submit", idx);
        // Submit the cell index to your Route Action
        fetcher.submit({ cellIndex: idx.toString() }, { method: "POST" });
    };

    const enemyCells = Array.from({ length: 100 }, (_, idx) => (
        <EnemyCell
            key={idx}
            isHit={playerHits.includes(idx)}
            isMiss={playerMisses.includes(idx)}
            isPending={fetcher.formData?.get("cellIndex") === idx.toString()}
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
            {gs.VictoryStatus !== 0 && <Result victoryStatus={gs.VictoryStatus} />}
        </div>
    );
};

export default GameBoard;
