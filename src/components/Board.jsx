import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

import { calcValidMovesFromSquare, executeMove } from '../actions/boardActions';
import { indexSquare } from "../utils/boardLayoutUtils";

import BoardSquare from './BoardSquare';

import './board.css';
import GameControls from "./GameControls";


function Board(props) {
  return (<div>
    <div className={`board-container ${props.playerTurn === 1 ? 'p1' : 'p2'}`}>
      {props.board.map((row, iR) => (
        <div key={`r${iR}`} className="board-row">

          {row.map((colValue, iC) => {
            const squareId = indexSquare(iR, iC);

            // Check if a move definition exists that lands on this square
            const landingMove = props.activeMovesByLandingId[squareId];

            return <BoardSquare
              key={squareId}
              r={iR}
              c={iC}
              squareValue={colValue}
              playerTurn={props.playerTurn}
              p1IsAi={props.p1IsAi}
              p2IsAi={props.p2IsAi}
              dispatchCalcValidMovesFromSquare={props.calcValidMovesFromSquare}
              highlightActive={props.activeSquaresById[squareId]}
              highlightPotentialMove={!!landingMove}
              highlightCapture={!!props.activeCapturesById[squareId]}
              highlightIntendedMove={!!props.highlightedSquaresById[squareId]}
              onSelectForMove={landingMove && props.executeMove.bind(this, landingMove)}
            />
          })}

        </div>
      ))}
    </div>

    <GameControls />
  </div>);
}

export default connect(
  // mapStateToProps():
  state => ({
    board: state.board.board,
    activeSquaresById: state.board.activeSquaresById,
    activeMovesByLandingId: state.board.activeMovesByLandingId,
    activeCapturesById: state.board.activeCapturesById,
    highlightedSquaresById: state.board.highlightedSquaresById,
    playerTurn: state.players.playerTurn,
    p1IsAi: state.players.p1IsAi,
    p2IsAi: state.players.p2IsAi,
  }),

  // mapDispatchToProps():
  {
    calcValidMovesFromSquare,
    executeMove,
  },
)(Board);

