import { handleActions } from 'redux-actions';

import { calcValidMovesFromSquare, calcValidMovesForPlayer, executeMove as executeMoveAction, resetGame } from '../actions/boardActions';
import { broadcastAiMove } from '../actions/aiActions';
import { lightFire, propagateFire, toggleFireRules } from '../actions/fireActions';

import { generateNewBoard, getLegalMoves, executeMove as executeMoveRules } from './boardRules/checkersRules';
import { startFire as startFireRules, propagateFire as propagateFireRules } from './boardRules/fireRules';
import { getAllPlayerRCs, indexSquare, indexSquareFromRC } from '../utils/boardLayoutUtils';


/**
 * Converts move definitions (from getLegalMoves()) into state update (processes moves, adds indexing, etc.)
 * @param legalMoves List of move definitions from getLegalMoves()
 * @return {object} Updates to the reducer state
 */
function moveDefnsToStateUpdate(legalMoves) {
  // Add various square indexings to the legal moves results:
  const activeMoves = legalMoves
    .map(move => ({
      ...move,
      captureIdxs: move.captures.map(c => indexSquare(c[0], c[1])),
      squareId: indexSquareFromRC(move),
    }));

  const activeMovesByLandingId = {};
  const activeCapturesById = {};
  activeMoves.forEach(move => {
    activeMovesByLandingId[move.squareId] = move;
    move.captureIdxs.forEach(c => activeCapturesById[c] = true);
  });

  return {
    activeMoves,
    activeMovesByLandingId,
    activeCapturesById,
  };
}


export default handleActions(
  {
    [calcValidMovesFromSquare]: (state, action) => {
      const legalMoves = getLegalMoves(state.board, action.payload.r, action.payload.c);

      return {
        ...state,
        activeSquaresById: {
          [indexSquareFromRC(action.payload)]: true,
        },
        ...(moveDefnsToStateUpdate(legalMoves)),
        activeMovesRequestId: null,
        highlightedSquaresById: {},
      };
    },


    [calcValidMovesForPlayer]: (state, action) => {
      const allPlayerPositions = getAllPlayerRCs(state.board, action.payload);

      const allLegalMoves = allPlayerPositions
        .map(rc => getLegalMoves(state.board, rc[0], rc[1]));

      const activeSquaresById = {};
      allPlayerPositions.forEach((rc, i) => {
        // A player position should only be 'active' if it has moves associated with it.
        // So cross-index into allLegalMoves map.
        if (allLegalMoves[i].length) {
          activeSquaresById[indexSquare(rc[0], rc[1])] = true;
        }
      });

      return {
        ...state,
        activeSquaresById,
        ...(moveDefnsToStateUpdate(allLegalMoves.flat(1))),
        activeMovesRequestId: action.meta || null,
        highlightedSquaresById: {},
      };
    },


    [executeMoveAction]: (state, action) => {
      const move = action.payload;
      return {
        ...state,
        board: executeMoveRules(state.board, move),
        activeSquaresById: {},
        activeMoves: [],
        activeMovesRequestId: null,
        activeMovesByLandingId: {},
        activeCapturesById: {},
        highlightedSquaresById: {},
      };
    },


    [broadcastAiMove]: (state, action) => {
      // Highlight both the landing and the from square
      const move = action.payload;
      return {
        ...state,
        highlightedSquaresById: {
          [indexSquareFromRC(move)]: true, // landing square
          [indexSquare(move.fromR, move.fromC)]: true, // origin square
        },
      }
    },


    //
    // West Coast Expansion Reducers
    //
    [toggleFireRules]: (state) => ({
      ...state,
      fireRulesActive: !state.fireRulesActive,
    }),


    [lightFire]: (state, action) => {
      const [newBoard, countP1Burned, countP2Burned] = startFireRules(
        state.board, action.payload.intensity, action.payload.checkerResistance, action.payload.spread
      );

      return {
        ...state,
        board: newBoard,
        countP1Burned: state.countP1Burned + countP1Burned,
        countP2Burned: state.countP2Burned + countP2Burned,

        // Invalidate all previously calculated moves -- might have new fires that invalidate previous moves
        activeMoves: [],
        activeMovesRequestId: null,
        activeMovesByLandingId: {},
        activeCapturesById: {},
        highlightedSquaresById: {},
      };
    },


    [propagateFire]: (state) => {
      const [newBoard, countP1Burned, countP2Burned] = propagateFireRules(state.board);

      return {
        ...state,
        board: newBoard,
        countP1Burned: state.countP1Burned + countP1Burned,
        countP2Burned: state.countP2Burned + countP2Burned,

        // Invalidate all previously calculated moves -- fire may have moved things around
        activeMoves: [],
        activeMovesRequestId: null,
        activeMovesByLandingId: {},
        activeCapturesById: {},
        highlightedSquaresById: {},
      };
    },


    [resetGame]: (state) => ({
      ...state,
      board: generateNewBoard(),
      activeSquaresById: {},
      activeMoves: [],
      activeMovesRequestId: null,
      activeMovesByLandingId: {},
      activeCapturesById: {},
      highlightedSquaresById: {},

      countP1Burned: 0,
      countP2Burned: 0,
    })
  },

  // default state:
  {
    /** Current board layout */
    board: generateNewBoard(),

    /** Index of squares that should be highlighted as 'active' (eg current hover square) */
    activeSquaresById: {},

    /** List of available moves from the active square(s) */
    activeMoves: [],

    /** Optional metadata from move requesting actions. Used by AI for syncing requests. */
    activeMovesRequestId: null,

    /** Index of available moves from the active square(s), indexed by landing square ID */
    activeMovesByLandingId: {},

    /** Index of squares that would be captured by any of the active moves */
    activeCapturesById: {},

    /** Index of squares that should be highlighted as a landing square (used by AI to signal move) */
    highlightedSquaresById: {},

    // West Coast Expansion Rules:
    fireRulesActive: false,
    countP1Burned: 0,
    countP2Burned: 0,
  },
);
