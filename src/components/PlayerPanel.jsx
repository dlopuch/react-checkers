import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { calcValidMovesForPlayer } from '../actions/boardActions';
import { toggleAiPlayer } from '../actions/aiActions';
import { PlayerIcons } from "../utils/itemTypes";
import './playerPanel.css';


function PlayerPanel(props) {
  const turnIsP1 = props.playerTurn === 1;
  return (
    <div className="player-panel">
      <div>
        <div>
          <h3 className={turnIsP1 ? 'text-p1' : ''}>
            {turnIsP1 ? <span role="img" aria-label="Player 1's Turn'" style={{ marginRight: '1rem' }}>👉</span> : ''}
            {PlayerIcons.P1} Player 1
          </h3>
          <div className="small">
            <span className="text-p2">{PlayerIcons.P2}</span> Captured: {props.p1Captures}
          </div>
          <div className="small">
            <button onClick={() => props.calcValidMovesForPlayer(1)} disabled={!turnIsP1}>
              Hint: All Moves
            </button>
          </div>
          <div className="small">
            <label htmlFor="p1-ai-checkbox">
              <input id="p1-ai-checkbox" type="checkbox" checked={props.p1IsAi} onChange={() => props.toggleAiPlayer(1)} />
              AI (fast)
            </label>
          </div>
          <div style={{ marginTop: '1rem' }}>
            {turnIsP1 && !props.p1AiIsThinking ? 'Go go go!' : <span>&nbsp;</span>}
            {turnIsP1 && props.p1AiIsThinking ? 'Thinking....' : <span>&nbsp;</span>}
          </div>
        </div>


        <div>
          <h3 className={turnIsP1 ? '' : 'text-p2'}>
            {!turnIsP1 ? <span role="img" aria-label="Player 2's Turn'" style={{ marginRight: '1rem' }}>👉</span> : ''}
            {PlayerIcons.P2} Player 2
          </h3>
          <div className="small">
            <span className="text-p1">{PlayerIcons.P1}</span> Captured: {props.p2Captures}
          </div>
          <div className="small">
            <button onClick={() => props.calcValidMovesForPlayer(2)} disabled={turnIsP1}>
              Hint: All Moves
            </button>
          </div>
          <div className="small">
            <label htmlFor="p2-ai-checkbox">
              <input id="p2-ai-checkbox" type="checkbox" checked={props.p2IsAi} onChange={() => props.toggleAiPlayer(2)} />
              AI (slow)
            </label>
          </div>
          <div style={{ marginTop: '1rem' }}>
            {!turnIsP1 && !props.p2AiIsThinking ? 'Go go go!' : <span>&nbsp;</span>}
            {!turnIsP1 && props.p2AiIsThinking ? 'Thinking....' : <span>&nbsp;</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

PlayerPanel.propTypes = {
  // redux state props:
  playerTurn: PropTypes.number.isRequired,
  p1Captures: PropTypes.number.isRequired,
  p2Captures: PropTypes.number.isRequired,

  p1IsAi: PropTypes.bool.isRequired,
  p1AiIsThinking: PropTypes.bool.isRequired,
  p2IsAi: PropTypes.bool.isRequired,
  p2AiIsThinking: PropTypes.bool.isRequired,

  calcValidMovesForPlayer: PropTypes.func.isRequired,
  toggleAiPlayer: PropTypes.func.isRequired,
}

export default connect(
  // mapStateToProps():
  state => ({
    playerTurn: state.players.playerTurn,
    p1Captures: state.players.p1Captures,
    p2Captures: state.players.p2Captures,

    p1IsAi: state.players.p1IsAi,
    p1AiIsThinking: state.players.p1AiIsThinking,
    p2IsAi: state.players.p2IsAi,
    p2AiIsThinking: state.players.p2AiIsThinking,
  }),

  // mapDispatchToProps():
  {
    calcValidMovesForPlayer,
    toggleAiPlayer,
  },
)(PlayerPanel);
