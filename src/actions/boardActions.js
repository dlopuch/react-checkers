import { createActions } from 'redux-actions';


const scopedActions = createActions({
  BOARD_ACTIONS: {

    /** Action creator for the board business to start calculating valid moves from a single square */
    CALC_VALID_MOVES_FROM_SQUARE: (row, col) => ({ r: row, c: col }),

    /**
     * Action creator to find all the valid moves a player can do.
     * Payload should be player num, 1 or 2.
     * Optional second param will be a unique requestID metafield (attached to moves, used by AI for syncing)
     */
    CALC_VALID_MOVES_FOR_PLAYER: [
      playerNum => playerNum,
      (playerNum, requestID) => requestID || null,
    ],

    /**
     * Action creator for the board business to execute a move definition
     * Payload should be the move definition (eg one of board.activeMoves)
     */
    EXECUTE_MOVE: null,

    /** Action creator to start a new game. No payload. */
    RESET_GAME: null,
  },
});


// Explicitly export the action keys, but skip the top-level name-scoping key (eg actions.actionsModuleName)
// Note that redux-actions converts the ALL_CAPS keys in the keymap to camelCase.
const actions = scopedActions.boardActions;
export const { calcValidMovesFromSquare, calcValidMovesForPlayer, executeMove, resetGame } = actions;
