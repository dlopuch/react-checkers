import React, {useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { calcValidMovesForPlayer, executeMove } from '../actions/boardActions';
import { setAiThinking, broadcastAiMove } from '../actions/aiActions';


function AIAgent(props) {
  // Destructure props used in effects
  const {
    playerToAI, playerTurn, activeMoves, activeMovesRequestId, p1IsAi, p2IsAi, thinkingDelayMs, thinkingDelayMsWiggle,
    board,
    calcValidMovesForPlayer, executeMove, setAiThinking, broadcastAiMove,
  } = props;

  if (playerToAI !== 1 && playerToAI !== 2) {
    throw new Error('Invalid playerToAI');
  }

  // AI Agent is enabled/active if it's the correct turn AND the player is set to be an AI.
  const isEnabled = useMemo(
    () =>
      (playerToAI === playerTurn) && (
        (playerToAI === 1 && p1IsAi) ||
        (playerToAI === 2 && p2IsAi)
      ),
    [playerToAI, playerTurn, p1IsAi, p2IsAi]
  );

  const myMovesRequestId = useMemo(() => `AI_${playerToAI}`, [playerToAI]);
  const isMyMovesRequest = useMemo(
    () => activeMovesRequestId === myMovesRequestId,
    [activeMovesRequestId, myMovesRequestId],
  )

  // First, have an effect that requests all moves when it's this player's turn
  useEffect(() => {
    if (!isEnabled) {
      return; // Not AI's turn.
    }
    if (isMyMovesRequest) {
      return; // Receiving active moves... don't re-request this update.
    }
    calcValidMovesForPlayer(playerToAI, myMovesRequestId);
  }, [
    isEnabled, playerToAI, calcValidMovesForPlayer, isMyMovesRequest, myMovesRequestId,
    board, // also re-run when a new board is generated (eg from wildfire)
  ])

  // Next, have an effect that receives all the moves and picks one to use
  useEffect(() => {
    if (!isEnabled) {
      return; // Not AI's turn.
    }
    if (!isMyMovesRequest) {
      return; // Current active moves aren't requested by the AI (eg beginning of turn change)
    }

    // Game end condition: If no more moves, give up.
    if (!activeMoves.length) {
      alert(`Player ${playerToAI} AI says: "I have no more moves. You win."`)
      return;
    }

    // Otherwise, pick a move that maximizes captures
    let moves = Array.from(activeMoves);
    // but first, shuffle it so capture-ties are chosen randomly:
    for (let i=moves.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = moves[i];
      moves[i] = moves[j];
      moves[j] = temp;
    }
    moves.sort((a, b) => b.captures.length - a.captures.length );
    const chosenMove = moves[0];

    setAiThinking(playerToAI, true);

    let executeMoveTimeout;
    let broadcastMoveTimeout = setTimeout(
      () => {
        // First indicate the move we're about to take
        broadcastAiMove(chosenMove);
        // then take the move after another small delay
        executeMoveTimeout = setTimeout(
          () => {
            executeMove(moves[0]);
            setAiThinking(playerToAI, false);
          },
          500,
        );
      },
      thinkingDelayMs + Math.random() * thinkingDelayMsWiggle - thinkingDelayMsWiggle / 2
    );

    return () => {
      clearTimeout(broadcastMoveTimeout);
      clearTimeout(executeMoveTimeout);
      setAiThinking(playerToAI, false);
    };
  }, [
    isEnabled, playerToAI, isMyMovesRequest, activeMoves, executeMove, thinkingDelayMs, thinkingDelayMsWiggle, setAiThinking,
    broadcastAiMove,
    board, // also re-run when a new board is generated (eg from wildfire)
  ]);

  return <div />;
}


AIAgent.propTypes = {
  // public props:
  playerToAI: PropTypes.number.isRequired,

  /** Artifical delay when "contemplating" a move. Better UX. */
  thinkingDelayMs: PropTypes.number,
  thinkingDelayMsWiggle: PropTypes.number,

  //
  // redux state props:
  playerTurn: PropTypes.number.isRequired,
  board: PropTypes.array.isRequired,
  activeMoves: PropTypes.array.isRequired,
  activeMovesRequestId: PropTypes.string,
  p1IsAi: PropTypes.bool.isRequired,
  p2IsAi: PropTypes.bool.isRequired,

  // redux action props:
  calcValidMovesForPlayer: PropTypes.func.isRequired,
  executeMove: PropTypes.func.isRequired,
  setAiThinking: PropTypes.func.isRequired,
  broadcastAiMove: PropTypes.func.isRequired,
};


AIAgent.defaultProps = {
  thinkingDelayMs: 2000,
  thinkingDelayMsWiggle: 1000,

  activeMovesRequestId: null,
}


export default connect(
  // mapStateToProps():
  state => ({
    playerTurn: state.players.playerTurn,
    board: state.board.board,
    activeMoves: state.board.activeMoves,
    activeMovesRequestId: state.board.activeMovesRequestId,

    p1IsAi: state.players.p1IsAi,
    p2IsAi: state.players.p2IsAi,
  }),

  // mapDispatchToProps():
  {
    calcValidMovesForPlayer,
    executeMove,
    setAiThinking,
    broadcastAiMove,
  },
)(AIAgent);
