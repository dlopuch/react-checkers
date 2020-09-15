import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import { resetGame } from '../actions/boardActions';


function GameControls(props) {
  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <button onClick={() => props.resetGame()} title="Restart Game">
        (╯°□°)╯︵ ┻━┻
      </button>
    </div>
  );
}

GameControls.propTypes = {
  resetGame: PropTypes.func.isRequired,
}

export default connect(
  // mapStateToProps():
  state => ({}),

  // mapDispatchToProps():
  {
    resetGame,
  },
)(GameControls);
