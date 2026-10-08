const Result = ({ victoryStatus }: { victoryStatus: -1 | 1 }) => {
    const isWin = victoryStatus === 1;

    return (
        <dialog open className="result-dialog">
            <div className={`result-modal ${isWin ? "win" : "lose"}`}>
                <h2>{isWin ? "Victory" : "Defeat"}</h2>
                <p>
                    {isWin
                        ? "All enemy ships have been sunk."
                        : "Your fleet was destroyed in combat."}
                </p>
                <div className="result-actions">
                    <a href="/" className="play-again-btn">
                        Play Again
                    </a>
                </div>
            </div>
        </dialog>
    );
};

export default Result;