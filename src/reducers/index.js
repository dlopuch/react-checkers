import { combineReducers } from 'redux';

import boardReducers from './boardReducers';
import playerReducers from './playersReducers';


export const reducers = combineReducers({
  board: boardReducers,
  players: playerReducers,
});
