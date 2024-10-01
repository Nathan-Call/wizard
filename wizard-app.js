const { useState, useEffect, useRef } = React;

// function Init() {

// }

// function Game(props) {
//   return (
//     <div id="game-div">
//       {props.players.map((item, index) => (
//         <div key={index}>
//           <h3
//             id={"headline-alert-" + index}
//             class="alert-headline"
//             onClick={() => toggleElement("alert-" + index)}
//           >
//             <i class="fa-solid fa-triangle-exclamation"></i>
//             {item.properties.headline}
//           </h3>
//           <p
//             id={"alert-" + index}
//             class="alert-description"
//             style={{ display: "none" }}
//           >
//             {item.properties.description}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// let playersArr = [];

// let playersForm = document
//   .querySelector("#form-1")
//   .addEventListener("submit", (e) => {
//     e.stop
//     console.log(playersForm["name"]);
//   });

// function renderGame() {
//   ReactDOM.render(
//     <React.StrictMode>
//         <Init />
//         <Game players={playersArr} count={playersArr.length} />
//     </React.StrictMode>,
//     document.getElementById("root")
//   );
// }

// renderGame();

// Title Component
function Title() {
  return (
    <div id="header-div">
      <h1>WIZARD</h1>
    </div>
  );
}

// AddPlayerForm Component
function AddPlayerForm({ addPlayer }) {
  const [name, setName] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== "") {
      addPlayer(name); // Add player to the list
      setName(""); // Clear input field
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Player name"
      />
      <button type="submit">Add</button>
    </form>
  );
}

// Game Component for Adding Players and Starting the Game
function Game({ players, startGame }) {
  return (
    <div id="game-div">
      <h2>Players ({players.length})</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      <button onClick={startGame} disabled={players.length === 0}>
        Start Game
      </button>
    </div>
  );
}

// Betting Phase Component
function BettingPhase({ players, setBets, proceedToScoring, round }) {
  const [bets, setLocalBets] = React.useState(players.map(() => 0));

  const handleBetChange = (index, value) => {
    const newBets = [...bets];
    newBets[index] = parseInt(value) || 0;
    setLocalBets(newBets);
  };

  const handleProceed = () => {
    setBets(bets);
    proceedToScoring();
  };

  return (
    <div id="game-div">
      <h2>
        Betting Phase <span id="header-diamond">◆</span> Round {round}
      </h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Bet</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{player}</td>
              <td>
                <input
                  type="number"
                  value={bets[index]}
                  onChange={(e) => handleBetChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleProceed}>Proceed to Scoring</button>
    </div>
  );
}

// Scoring Phase Component
function ScoringPhase({
  players,
  bets,
  proceedToScoreView,
  round,
  updateScores,
}) {
  const [results, setResults] = React.useState(players.map(() => 0));

  const handleResultChange = (index, value) => {
    const newResults = [...results];
    newResults[index] = parseInt(value) || 0;
    setResults(newResults);
  };

  const handleCalculateScores = () => {
    updateScores(results);
    proceedToScoreView();
  };

  return (
    <div id="game-div">
      <h2>
        Scoring Phase <span id="header-diamond">◆</span> Round {round}
      </h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Bet</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{player}</td>
              <td>{bets[index]}</td>
              <td>
                <input
                  type="number"
                  value={results[index]}
                  onChange={(e) => handleResultChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleCalculateScores}>Calculate Scores</button>
    </div>
  );
}

// Score Viewing Phase Component
function ScoreViewPhase({ players, scores, nextRound, round, endGame }) {
  // Combine players and scores into a single array and sort by score
  const sortedPlayersScores = players
    .map((player, index) => ({ player, score: scores[index] }))
    .sort((a, b) => b.score - a.score); // Sort descending by score

  return (
    <div id="game-div">
      <h2>
        Viewing Phase <span id="header-diamond">◆</span> Round {round}
      </h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayersScores.map(({ player, score }, index) => (
            <tr key={index}>
              <td>{player}</td>
              <td>{score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {round < 10 ? (
        <button onClick={nextRound}>Next Round</button>
      ) : (
        <button onClick={endGame}>End Game</button>
      )}
    </div>
  );
}

function App() {
  const [players, setPlayers] = React.useState([]);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [bets, setBets] = React.useState([]);
  const [scores, setScores] = React.useState([]);
  const [phase, setPhase] = React.useState("betting");
  const [round, setRound] = React.useState(1);

  const addPlayer = (name) => {
    setPlayers([...players, name]);
    setScores([...scores, 0]); // Initialize scores
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const nextRound = () => {
    setRound(round + 1);
    setPhase("betting");
  };

  const proceedToScoring = () => {
    setPhase("scoring");
  };

  const proceedToScoreView = () => {
    setPhase("scoreView");
  };

  const updateScores = (results) => {
    const newScores = scores.map((score, index) => {
      const bet = bets[index];
      const result = results[index];
      if (bet === result) {
        return score + 20 + 10 * bet; // 20 points for correct bid, 10 points per trick
      } else {
        return score - 10 * Math.abs(bet - result); // 10 points lost per trick over/under
      }
    });
    setScores(newScores);
  };

  const endGame = () => {
    alert("Game Over!");
    // Optionally reset the game or display final scores
  };

  return (
    <React.StrictMode>
      <Title />
      {!gameStarted ? (
        <>
          <AddPlayerForm addPlayer={addPlayer} />
          <Game players={players} startGame={startGame} />
        </>
      ) : phase === "betting" ? (
        <BettingPhase
          players={players}
          setBets={setBets}
          proceedToScoring={proceedToScoring}
          round={round}
        />
      ) : phase === "scoring" ? (
        <ScoringPhase
          players={players}
          bets={bets}
          proceedToScoreView={proceedToScoreView}
          round={round}
          updateScores={updateScores}
        />
      ) : (
        <ScoreViewPhase
          players={players}
          scores={scores}
          nextRound={nextRound}
          round={round}
          endGame={endGame}
        />
      )}
    </React.StrictMode>
  );
}

function renderGame() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

renderGame();
