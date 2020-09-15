import React from 'react';
import PropTypes from 'prop-types';

import { useDrag } from 'react-dnd'
import { DragItemTypes, PlayerIcons } from '../utils/itemTypes';

import './draggableChecker.css';


export function DraggableChecker(props) {
  const [{ isDragging }, drag] = useDrag({
    item: { type: DragItemTypes.CHECKER },
    canDrag: props.canDrag,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`dc ${props.isP1 ? 'p1' : 'p2'} ${props.canDrag ? '' : 'disabled'}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {props.isP1 ? PlayerIcons.P1 : PlayerIcons.P2}
    </div>
  );
}


DraggableChecker.propTypes = {
  /** True if checker is Player 1, false for Player 2 */
  isP1: PropTypes.bool.isRequired,

  /** True if checker is draggable */
  canDrag: PropTypes.bool,
}

DraggableChecker.defaultProps = {
  canDrag: false,
};
