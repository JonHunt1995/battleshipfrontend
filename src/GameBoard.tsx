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
import GameHud from "./GameHud";

const mockDemoState: GameState = {
    OpponentHits: [14, 15, 16],
    OpponentLivingShips: {
        Carrier: true,
        Battleship: true,
        Cruiser: true,
        Submarine: true,
        Destroyer: true,
    },
    OpponentMisses: [3, 4, 25, 36, 47],
    PlayerHits: [32, 42],
    PlayerLivingShips: {
        Carrier: true,
        Battleship: true,
        Cruiser: true,
        Submarine: true,
        Destroyer: true,
    },
    PlayerMisses: [1, 11, 21, 58, 69],
    PlayerShips: [10, 11, 12, 13, 14, 30, 40, 50, 60, 72, 73, 74, 85, 95, 27, 28],
    IsYourTurn: true,
    TurnNumber: 5,
    Victor: 0,
    GameIsReady: true,
};

export const gameBoardLoader = async ({ params }: LoaderFunctionArgs) => {
    const { gameid } = params;
    if (gameid === "demo") {
        return mockDemoState;
    }
    if (gameid === "demo-win" || gameid === "demo-victory") {
        return { ...mockDemoState, Victor: 1 };
    }
    if (
        gameid === "demo-loss" ||
        gameid === "demo-lost" ||
        gameid === "demo-lose" ||
        gameid === "demo-defeat"
    ) {
        return { ...mockDemoState, Victor: -1 };
    }
    try {
        const response = await fetch(`/api/play/${gameid}`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            return await response.json();
        }
    } catch {
        return mockDemoState;
    }

    return mockDemoState;
};

export const gameBoardAction = async ({
    params,
    request,
}: ActionFunctionArgs) => {
    const { gameid } = params;
    const formData = await request.formData();
    const cellIndex = formData.get("cellIndex");

    if (gameid === "demo") {
        return { ok: true, guess: cellIndex };
    }

    try {
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
    } catch {
        return { ok: true };
    }

    return { ok: true };
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
    Victor: -1 | 0 | 1;
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
        gs.GameIsReady,
        gs.Victor,
        revalidate,
    );
    // Read current submission state for loading feedback (Optimistic UI)
    const isSubmitting = fetcher.state !== "idle";

    const handleCellClick = (idx: number) => {
        console.log("reaches here", idx);
        if (isSubmitting || !gs.IsYourTurn || gs.Victor !== 0 || !gs.GameIsReady || playerHits.includes(idx) || playerMisses.includes(idx)) return; // Prevent clicking while a move is processing
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
            style={{ viewTransitionName: `cell-${idx}` }}
        />
    ));
    return (
        <div className="Game">
            <GameHud
                gameInfo={{
                    playerHits: playerHits,
                    playerMisses: playerMisses,
                    playerLivingShips: gs.PlayerLivingShips,
                    opponentHits: opponentHits,
                    opponentMisses: opponentMisses,
                    opponentLivingShips: gs.OpponentLivingShips,
                    isTurn: gs.IsYourTurn,
                    gameIsReady: gs.GameIsReady,
                }}
            />
            {!gs.GameIsReady && (
                <div className="waiting-overlay">
                    <div className="waiting-modal">
                        <h2>Waiting for opponent to join</h2>
                        <p>Share your invite link to begin combat.</p>
                    </div>
                </div>
            )}
            <div className="clamshell-container">
                <div className="camera">
                    <div className="panel screen">
                        <div className="panel-header">
                            <span className="panel-title">Enemy Radar</span>
                        </div>
                        <div className="board-area">
                            <div className="enemy board">{enemyCells}</div>
                        </div>
                    </div>
                    <div className="panel base">
                        <div className="panel-header">
                            <span className="panel-title">Your Ships</span>
                        </div>
                        <div className="board-area">
                            <div className="player board">{playerCells}</div>
                        </div>
                    </div>
                </div>
            </div>
            {!!gs.Victor && <Result victoryStatus={gs.Victor} />}
        </div>
    );
};

export default GameBoard;
