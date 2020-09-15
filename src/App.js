import React from 'react';
import './App.css';
import Board from "./components/Board";
import PlayerPanel from "./components/PlayerPanel";
import AIAgent from "./components/AIAgent";
import WildfireAgent from "./components/WildfireAgent";
import WestCoastExpansionControls from "./components/WestCoastExpansionControls";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Checkers, by Dan Lopuch</h2>
      </header>

      <section className="main">
        <div className={"game-contents"}>
          <PlayerPanel />
          <Board />
        </div>
        <div className={"expansion-contents"}>
          <WestCoastExpansionControls />
        </div>
      </section>

      <WildfireAgent
        probabilityNewFirePerTurn={0.4}
        newFireIntensity={0.5}
        newFireCheckerResistance={0.8}
        newFireSpread={1}
      />
      <AIAgent
        playerToAI={1}
        thinkingDelayMs={500}
        thinkingDelayMsWiggle={500}
      />
      <AIAgent
        playerToAI={2}
        thinkingDelayMs={2000}
        thinkingDelayMsWiggle={1000}
      />

    </div>
  );
}

export default App;
