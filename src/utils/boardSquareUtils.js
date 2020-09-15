/* Common utilties around analyzing board squares (players, contents, etc.) */

const PLAYER_1_MASK = 0b001;
const PLAYER_2_MASK = 0b010;
const FIRE_MASK = 0b100;

export function hasPlayer1(squareVal) {
  return !!(squareVal & PLAYER_1_MASK);
}

export function hasPlayer2(squareVal) {
  return !!(squareVal & PLAYER_2_MASK);
}

export function hasPlayer(squareVal) {
  return (!!squareVal & (PLAYER_1_MASK | PLAYER_2_MASK));
}

export function hasFire(squareVal) {
  return !!(squareVal & FIRE_MASK);
}

export function isEmpty(squareVal) {
  return squareVal === 0; // note undefined (ie out-of-bounds) is false
}

export function fillPlayer1() {
  return PLAYER_1_MASK;
}

export function fillPlayer2() {
  return PLAYER_2_MASK;
}

export function fillFire() {
  return FIRE_MASK;
}

export function fillEmpty() {
  return 0;
}
