import React from "react";
import PropTypes from "prop-types";
import { useDrop } from 'react-dnd'

import {hasFire, hasPlayer1, hasPlayer2} from "../utils/boardSquareUtils";
import { DragItemTypes } from "../utils/itemTypes";
import './boardSquare.css';
import {DraggableChecker} from "./DraggableChecker";


const NO_OP = () => {};


export default function BoardSquare(props) {
  //
  // Configured drag-n-drop
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DragItemTypes.CHECKER,
    canDrop: () => !!props.onSelectForMove,
    drop: () => props.onSelectForMove(),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })

  // Configure display
  let squareContents = <div> </div>;
  let playerNum = 0;
  if (hasPlayer1(props.squareValue)) {
    playerNum = 1;
    squareContents = <DraggableChecker isP1 canDrag={playerNum === props.playerTurn} />
  } else if (hasPlayer2(props.squareValue)) {
    playerNum = 2;
    squareContents = <DraggableChecker isP1={false} canDrag={playerNum === props.playerTurn} />
  } else if (hasFire(props.squareValue)) {
    squareContents = <div>
      <span role="img" aria-label="On Fire">🔥</span>
    </div>;
  }

  let squareColorClass = (props.r + props.c) % 2 ? 'bs-x' : 'bs-y';
  if ((isOver && canDrop) || props.highlightIntendedMove) {
    squareColorClass += ' bs-drop';
  } else if (props.highlightActive) {
    squareColorClass += ' bs-active';
  } else if (props.highlightPotentialMove || canDrop) {
    squareColorClass += ' bs-potential';
  } else if (props.highlightCapture) {
    squareColorClass += ' bs-capture';
  }

  // On hover: Only try to calculate moves if a player exists, it's their turn, and they're not an AI
  let onHover = NO_OP;
  if (
    playerNum === props.playerTurn &&
    ((playerNum === 1 && !props.p1IsAi) || (playerNum === 2 && !props.p2IsAi))
  ) {
    onHover = props.dispatchCalcValidMovesFromSquare.bind(this, props.r, props.c);
  }

  return <div
    ref={drop}
    className={`board-square ${squareColorClass}`}
    onMouseEnter={onHover}
  >
    {squareContents}
  </div>;
}

BoardSquare.propTypes = {
  r: PropTypes.number.isRequired,
  c: PropTypes.number.isRequired,
  squareValue: PropTypes.number.isRequired,

  /** 1 or 2, depending on the current player. Will disable some behaviors if not active player. */
  playerTurn: PropTypes.number.isRequired,

  p1IsAi: PropTypes.bool.isRequired,
  p2IsAi: PropTypes.bool.isRequired,

  highlightActive: PropTypes.bool,
  highlightPotentialMove: PropTypes.bool,
  highlightCapture: PropTypes.bool,
  highlightIntendedMove: PropTypes.bool,

  /** boardActions.calcValidMovesFromSquare() action creator, connected to dispatch */
  dispatchCalcValidMovesFromSquare: PropTypes.func.isRequired,

  /**
   * If this square can be the target of a move, callback to hit if the square was chosen
   * (can be selected via drag-drop, etc.)
   */
  onSelectForMove: PropTypes.func,
}

BoardSquare.defaultProps = {
  highlightActive: false,
  highlightPotentialMove: false,
  highlightCapture: false,
  highlightIntendedMove: false,
  onSelectForMove: null,
};
