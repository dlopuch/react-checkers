/* Implements West Coast Expansion Pack rules. See reducers/boardRules/fireRules.js */

import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { propagateFire, lightFire } from '../actions/fireActions';


function WildfireAgent(props) {
  // Destruct props for useEffect deps.
  const {
    fireRulesActive, propagateFire, probabilityNewFirePerTurn, lightFire,
    newFireIntensity, newFireCheckerResistance, newFireSpread
  } = props;

  // On every new turn, propagate the fire.
  useEffect(() => {
    if (!fireRulesActive) {
      return;
    }

    propagateFire();

    // And have a chance of starting a new one
    if (Math.random() < probabilityNewFirePerTurn) {
      lightFire(newFireIntensity, newFireCheckerResistance, newFireSpread);
    }
  }, [
    fireRulesActive, propagateFire, probabilityNewFirePerTurn, lightFire,
    newFireIntensity, newFireCheckerResistance, newFireSpread,
    props.playerTurn, // not used directly, but consider this dep to run on every new turn
  ]);

  return <></>;
}

WildfireAgent.propTypes = {
  /** Number 0-1: probability of every turn starting a new fire */
  probabilityNewFirePerTurn: PropTypes.number,

  /**
   * Number from 0-1. Every square around the origin of a new fire has a probability of lighting.
   * 0=never lights, 1=always lights
   */
  newFireIntensity: PropTypes.number,

  /**
   * Number from 0-1. If a checker is on a square that lights up, they get an additional probability of resisting it.
   * 0=No extra resistance (always burns), 1=Never burns
   */
  newFireCheckerResistance: PropTypes.number,

  /** Integer 1-n: how many squares around the random origin to light up */
  newFireSpread: PropTypes.number,

  //
  // redux state
  playerTurn: PropTypes.number.isRequired,
  fireRulesActive: PropTypes.bool.isRequired,

  propagateFire: PropTypes.func.isRequired,
  lightFire: PropTypes.func.isRequired,
}

WildfireAgent.defaultProps = {
  probabilityNewFirePerTurn: 0.33,
  newFireIntensity: 0.5,
  newFireCheckerResistance: 0.8,
  newFireSpread: 2,
}

export default connect(
  // mapStateToProps():
  state => ({
    playerTurn: state.players.playerTurn,
    fireRulesActive: state.board.fireRulesActive,
  }),

  // mapDispatchToProps():
  {
    propagateFire,
    lightFire,
  },
)(WildfireAgent);
