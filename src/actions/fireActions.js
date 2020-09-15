import { createActions } from "redux-actions";

const scopedActions = createActions({
  FIRE_ACTIONS: {
    TOGGLE_FIRE_RULES: null,

    /** Action-creator to light a fire. See fireRules.js:startFire() for param interpretations. */
    LIGHT_FIRE: (intensity=0.5, checkerResistance=0.8, spread=2) => ({ intensity, checkerResistance, spread }),

    /** Action-creator to make fire advance one generation. */
    PROPAGATE_FIRE: null,
  }
});

// Explicitly export the action keys, but skip the top-level name-scoping key (eg actions.actionsModuleName)
// Note that redux-actions converts the ALL_CAPS keys in the keymap to camelCase.
const actions = scopedActions.fireActions;
export const { toggleFireRules, lightFire, propagateFire } = actions;
