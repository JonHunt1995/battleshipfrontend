export interface ShipStatus {
    Carrier: boolean;
    Battleship: boolean;
    Cruiser: boolean;
    Submarine: boolean;
    Destroyer: boolean;
}

export interface GameHudProps {
    gameInfo: {
        playerHits: number[];
        playerMisses: number[];
        playerLivingShips: ShipStatus;
        opponentHits: number[];
        opponentMisses: number[];
        opponentLivingShips: ShipStatus;
        isTurn: boolean;
        gameIsReady: boolean;
    };
}

interface PlayerInfoData {
    hits: number;
    misses: number;
    ships: ShipStatus;
    name: string;
    isTurn: boolean;
}

function PlayerInfo({ playerInfo }: { playerInfo: PlayerInfoData }) {
    const shipNames: (keyof ShipStatus)[] = [
        "Carrier",
        "Battleship",
        "Cruiser",
        "Submarine",
        "Destroyer",
    ];

    const shipsDisplay = shipNames.map((name) => (
        <span
            className={playerInfo.ships?.[name] ? "alive" : "dead"}
            key={name}
        >
            {name}
        </span>
    ));

    const totalShots = playerInfo.hits + playerInfo.misses;
    const accuracy =
        totalShots === 0
            ? "0.0"
            : ((playerInfo.hits / totalShots) * 100).toFixed(1);

    return (
        <section className="player-info">
            <div className="turn-indicator-container">
                {playerInfo.isTurn && <div className="turn-indicator" />}
            </div>
            <div className="player-name">{playerInfo.name}</div>
            <div className="ships-list">{shipsDisplay}</div>
            <div className="acc">Acc: {accuracy}%</div>
        </section>
    );
}

export default function GameHud({ gameInfo }: GameHudProps) {
    const opp: PlayerInfoData = {
        hits: gameInfo.opponentHits.length,
        misses: gameInfo.opponentMisses.length,
        ships: gameInfo.opponentLivingShips,
        name: "Opp",
        isTurn: !gameInfo.isTurn && gameInfo.gameIsReady,
    };

    const player: PlayerInfoData = {
        hits: gameInfo.playerHits.length,
        misses: gameInfo.playerMisses.length,
        ships: gameInfo.playerLivingShips,
        name: "You",
        isTurn: gameInfo.isTurn && gameInfo.gameIsReady,
    };

    return (
        <header className="hud">
            <PlayerInfo playerInfo={opp} />
            <PlayerInfo playerInfo={player} />
        </header>
    );
}
