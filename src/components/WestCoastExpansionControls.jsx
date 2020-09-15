/* Implements West Coast Expansion Pack rules. See reducers/boardRules/fireRules.js */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { propagateFire, lightFire, toggleFireRules } from '../actions/fireActions';
import {PlayerIcons} from "../utils/itemTypes";


function WestCoastExpansionControls(props) {

  return (<div style={{ marginLeft: "3rem" }}>
    <h3>"West Coast" Expansion Rules</h3>

    <div className="small">
      <label htmlFor="toggle-wce">
        <input id="toggle-wce" type="checkbox" checked={props.fireRulesActive} onChange={() => props.toggleFireRules()} />
        Use Expansion
      </label>
    </div>

    { props.fireRulesActive ?
      <div className="small" style={{ marginTop: '1rem' }}>
        <em>
          It's been a bone-dry summer out here, and things are just heating up...
        </em>
        <div style={{ marginTop: '1rem' }}>
          <span style={{ marginRight: '1rem' }} className="text-p1" title="Number of Player 1 checkers caught in the fires">
            <span role="img" aria-label="Player 1 Burns">🔥</span>{PlayerIcons.P1}: {props.countP1Burned}
          </span>
          <span className="text-p2" title="Number of Player 2 checkers caught in the fires">
            <span role="img" aria-label="Player 1 Burns">🔥</span>{PlayerIcons.P2}: {props.countP2Burned}
          </span>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <p>
            Throw some chaos into your life! With the "West Coast" Expansion Rules (TM), squares can sometimes just, er, catch fire.
          </p>
          <p>
            Since fire is often said to be almost alive, what better way of simulating it than with Conway's Game of Life. Just make sure
            your pieces don't get in the way of the flames, they're not flame-retardant.
          </p>
          <p>
            Can't wait for your turn? Grab your gender-reveal pyrotechnic device and slam one of the buttons below!
          </p>
        </div>
        <div>
          <button onClick={() => props.lightFire()}>Arson</button>
          <button onClick={() => props.propagateFire()} style={{ marginLeft: '1rem' }}>Fan the Flames</button>
        </div>


      </div> :
      ''
      }
  </div>)
}

WestCoastExpansionControls.propTypes = {
  //
  // redux state
  playerTurn: PropTypes.number.isRequired,
  fireRulesActive: PropTypes.bool.isRequired,
  countP1Burned: PropTypes.number.isRequired,
  countP2Burned: PropTypes.number.isRequired,

  propagateFire: PropTypes.func.isRequired,
  lightFire: PropTypes.func.isRequired,
  toggleFireRules: PropTypes.func.isRequired,
}

WestCoastExpansionControls.defaultProps = {
}

export default connect(
  // mapStateToProps():
  state => ({
    playerTurn: state.players.playerTurn,
    fireRulesActive: state.board.fireRulesActive,
    countP1Burned: state.board.countP1Burned,
    countP2Burned: state.board.countP2Burned,

  }),

  // mapDispatchToProps():
  {
    propagateFire,
    lightFire,
    toggleFireRules,
  },
)(WestCoastExpansionControls);
