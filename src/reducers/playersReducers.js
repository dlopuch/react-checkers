import { handleActions } from "redux-actions";

import { executeMove, resetGame } from '../actions/boardActions';
import { toggleAiPlayer, setAiThinking } from '../actions/aiActions';


export default handleActions(
  {
    [executeMove]: (state, action) => {
      if (!action.payload) {
        return state; // no-op
      }

      const wasP1Turn = state.playerTurn === 1;

      let p1Captures = state.p1Captures;
      let p2Captures = state.p2Captures;

      if (wasP1Turn) {
        p1Captures += action.payload.captures.length;
      } else {
        p2Captures += action.payload.captures.length;
      }

      return {
        ...state,
        playerTurn: wasP1Turn ? 2 : 1,
        p1Captures,
        p2Captures,
      };
    },


    [toggleAiPlayer]: (state, action) => {
      if (action.payload === 1) {
        return {
          ...state,
          p1IsAi: !state.p1IsAi,
        };
      } else if (action.payload === 2) {
        return {
          ...state,
          p2IsAi: !state.p2IsAi,
        };
      } else {
        throw new Error('Invalid player num specified.');
      }
    },


    [setAiThinking]: (state, action) => {
      const { aiPlayerNum, isThinking } = action.payload;

      if (aiPlayerNum === 1) {
        return {
          ...state,
          p1AiIsThinking: isThinking,
        };
      } else if (aiPlayerNum === 2) {
        return {
          ...state,
          p2AiIsThinking: isThinking,
        };
      } else {
        throw new Error('invalid aiPlayerNum specified');
      }
    },


    [resetGame]: (state) => ({
      ...state,
      playerTurn: 1,
      p1Captures: 0,
      p2Captures: 0,
      p1AiIsThinking: false,
      p2AiIsThinking: false,
      // leave isAi prefs the same
    }),
  },

  // default state:
  {
    playerTurn: 1,
    p1Captures: 0,
    p2Captures: 0,

    p1IsAi: false,
    p1AiIsThinking: false,
    p2IsAi: false,
    p2AiIsThinking: false,
  },
);
