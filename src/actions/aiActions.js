import {createActions} from "redux-actions";

const scopedActions = createActions({
  AI_ACTIONS: {
    /** Enable/disable a player as an AI */
    TOGGLE_AI_PLAYER: playerNum => playerNum,

    /** Flag raised/lowered by AI to indicate it is thinking of a move. */
    SET_AI_THINKING: (aiPlayerNum, isThinking) => ({ aiPlayerNum, isThinking }),

    /** AI may choose to broadcast a move before it actually executes it*/
    BROADCAST_AI_MOVE: move => move,
  }
});

// Explicitly export the action keys, but skip the top-level name-scoping key (eg actions.actionsModuleName)
// Note that redux-actions converts the ALL_CAPS keys in the keymap to camelCase.
const actions = scopedActions.aiActions;
export const { toggleAiPlayer, setAiThinking, broadcastAiMove } = actions;
