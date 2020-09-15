
# react-checkers

Basic implementation of checkers, using a simple React stack:

- `create-react-app` for bootstrapping (webpack, babel compatibility, etc.)
    - Standard browser compatibility / transpiling: ```"production": [ ">0.2%", "not dead", "not op_mini all" ]```
    - `jest` for testing
- State control:
    - `redux`
    - `redux-actions`: Convenience & redux boilerplate
- Misc:
    - `prop-types`: Minimal typing between React components
    - `react-dnd`: HTML5 drag-and-drop normalization & react-ification

## Available Scripts

**👉 Run Application: `npm start`**: Opens [http://localhost:3000](http://localhost:3000) to view development mode in the browser.

**Tests: `npm test`**: Run tests (see "Followup: Sanity Check a Requirement" section for notes on test failure)

**Production Build: `npm run build`**

**Eject: `npm run eject`**: This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 
Standard Eject warnings apply, eg "this is a one-way operation. Once you `eject`, you can’t go back!"


# Project Submission Statement

Implementation covers all project requirements and elements of extended requirements. 

**Redux**: Game state is implemented using `redux` actions and reducers. This single global state avoids tight coupling between components
and allows for multiple disparate components to trigger common actions or respond to common state while avoiding 'plumbing hell'. 
The global store has been exposed in non-production builds as `window.store` for ease of examination during development. No immutability
library/dependency was used, but modern javascript (later transpiled for compatibility) was widely used to implement immutability patterns  
(eg `newState = {...state, updatedKey: 'newValue' }`).

**Data Model**: The data model is captured in the redux reducers, and the main reducers of interest are in `reducers/boardReducers.js`. 
The checker board data model is a simple 8x8 Array of player values. 
The primary checkers-specific logic has been isolated into `reducers/boardRules/checkersRules.js`. This logic is easy to test because it
consists of pure (ie stateless) functions and is not coupled to the redux reducer framework (the reducers are only simple
action handlers that dispatch to the appropriate rules functions and package up the results).

When legal moves are calculated, they are encapsulated as JSON objects like: 

```javascript
{
  // Row and column coordinates of move's landing:
  "r": 2,
  "c": 1,

  // Row and column coordinates of move's origin:
  "fromR": 4,
  "fromC": 3,

  // List of row, column coordinates of all pieces that 
  // would be captured by the move:
  "captures": [
    [ 3, 2 ]
  ]
}
```

See `reducers/boardRules/checkersRules.test.js` for details and examples of calculating legal moves.


**Agents:** Automatic actions such as AI movements are implemented using components suffixed with `Agent.jsx`. Agents are designed as
content-less components that only react to state changes from the global redux store. For example, `AIAgent.jsx` looks for a change of
the "current player turn" state to decide if it is time to perform an action. Most business logic is still implemented in the reducers -- 
logic in Agents is mostly limited to listening to events and state changes, then dispatching appropriate `redux` actions.


**Extended Requirements:** Extended requirements were not implemented due to limited time constraints. Nevertheless, the implementation 
"shows the way" for many of the extended requirements:

- AI always favors the move that will capture the most opponents, showing how heuristics around available moves can be incorporated.
- Game state is implemented as simple JSON-able data using redux stores. Once in this form, persisting game state across refreshes/reloads
  has many well-documented solutions.
- Limited unit tests (`npm test`)
    - A unit test exists for mounting the app. Checks that all components do at least initial load, and demonstrates unit testing of JSX
      components
    - Unit tests implemented for checkers board rules. This is arguably the most complex logic and the logic that is not always apparent 
      from click-through testing. Ease of testing demonstrates benefit of implementing main logic rules as decoupled pure functions.
    - See "Followup: Sanity Check a Requirement" section for notes on failing test
- Limited game stats UI: Implemented displays of number of captured opponent pieces to show how stats could be collected and displayed

**Limitations**: The main limitation of the submission is a precise end-state is not implemented. The game ends when there are no more 
moves available (the AI player does alert when they run out of moves, however). As implementing "king" behavior would be the next (extended 
requirement) feature to implement, precise game end behavior was deferred until that functionality is built.

The submission does not use any CSS or UI frameworks, so the UI is basic and designed for desktops. Responsive design and touch controls
were out-of-scope.

🔥🔥 **Bonus**: Implemented custom checkers **"West Coast Expansion Rules"**. Open up the app and tap the checkbox! 🔥🔥


## Followup: Sanity Check a Requirement

One project requirement is requested to be re-reviewed: 

> If there is an opportunity to capture an enemy checker - it should be the only valid move

There are valid game positions where this may be undesirable, for example being Player 1 on the following board:

```
  __  P1  __  __  __    
  __  __  P2  __  __    
  __  __  __  __  __    
  __  __  __  __  P2    
```

If P1 is forced to capture the enemy checker, they will be forced to lose unnecessarily. This requirement was therefore NOT implemented. 
However:

- The above scenario **was coded as a failing test** (test expects behavior as spec'd). Failing test ensures followup before acceptance.
- AI players HAVE been implemented to always favor capturing enemy checkers, demonstrating how the provided implementation makes this 
  requirement possible.

**Followup work would validate this requirement with appropriate stakeholders and either implement it or fix the failing test.**

----

Thank you for your time.

-Dan Lopuch  
