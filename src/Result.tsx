const Result = ({ victoryStatus }: { victoryStatus: -1 | 1 }) => {

    return (
    <div className={`result-overlay ${victoryStatus === 1 ? "win" : "lose"}`}>
        <div className="result-modal">
            <h1>{victoryStatus === 1 ? "You win!" : "You lose!"}</h1>
        </div>; 
    </div>
    )
}

export default Result;