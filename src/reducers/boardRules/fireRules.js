/*
 * West-coast Checkers Expansion Pack: Sometimes wildfires break out.
 * It is often said fire can seem almost alive... when our fire breaks out, it follows three simple rules for life-like propagation:
 *   1. Any fire cell with two or three firey neighbors keeps burning
 *   2. Any non-burning cell with exactly three firey neighbors become lit
 *   3. All other firey cells get extinguished (ie either burned itself out or sufficiently controlled)
 *
 * Sadly, if a fire expands into a checker, the checker burns up.
 */

import {getBoardContents} from "../../utils/boardLayoutUtils";
import {fillEmpty, fillFire, hasFire, hasPlayer, hasPlayer1, hasPlayer2} from "../../utils/boardSquareUtils";

function countFireyNeighbors(board, r, c) {
  let count = 0;
  for (let tR = -1; tR <= 1; tR += 1) {
    for (let tC = -1; tC <= 1; tC += 1) {
      if (tR === 0 && tC === 0) {
        continue;
      }
      let val = getBoardContents(board, r, c, tR, tC);
      if (hasFire(val)) {
        count += 1;

      // Tuning: Tried to make players count as firefighters and reduce the fire count, but wasn't able to find params that were good.
      // lets not complicate a beautifully simple set of rules and stick with classic Conway.
      // } else if (hasPlayer(val)) {
      //   count -= .25;
      }
    }
  }
  return count;
}


export function propagateFire(board) {
  let countP1Burned = 0;
  let countP2Burned = 0;

  // Copy the board (immutability)
  const newBoard = board.map(row => Array.from(row));

  // simple brute-force neighbor checking for fire propagation rules. Can be improved.
  for (let r = 0; r < newBoard.length; r += 1) {
    for (let c = 0; c < newBoard[r].length; c += 1) {
      let fireCount = countFireyNeighbors(board, r, c);
      let curVal = getBoardContents(board, r, c);
      let cellIsLit = hasFire(curVal);

      // Rule 2: Any non-burning cell with exactly three firey neighbors become lit
      if (!cellIsLit && fireCount === 3) {
        newBoard[r][c] = fillFire();
        if (hasPlayer1(curVal)) {
          countP1Burned += 1;
        } else if (hasPlayer2(curVal)) {
          countP2Burned += 1;
        }

      // Rule 3: Any other firey cells [cells with <2 or >3 firey neighbors) gets extinguished
      } else if (cellIsLit && ((fireCount < 2) || (fireCount > 3))) {
        newBoard[r][c] = fillEmpty();
      }
    }
  }

  return [newBoard, countP1Burned, countP2Burned];
}


/**
 * Starts a fire in a random spot on the board
 * @param board Board array
 * @param intensity Number from 0-1. Every square around the origin has a probability of lighting. 1=always lights, 0=never lights.
 * @param checkerResistance Number from 0-1. If a checker is on a square that lights up, they get an additional probability of resisting it.
 *   0=No extra resistance (always burns), 1=Never burns
 * @param spread Integer how many squares around the random origin to light up
 * @return {Array} Tuple of [newBoard, count of P1 pieces burned up, count of P2 pieces burned up, count of new fires started]
 */
export function startFire(board, intensity = 0.5, checkerResistance = 0.8, spread=2) {
  let countP1Burned = 0;
  let countP2Burned = 0;
  let countFiresStarted = 0;

  // Copy the board (immutability)
  const newBoard = board.map(row => Array.from(row));

  const numRows = newBoard.length;
  const numCols = newBoard[0].length;
  const originR = Math.floor(Math.random() * numRows);
  const originC = Math.floor(Math.random() * numCols);

  for (let r = originR - spread; r <= originR + spread; r += 1) {
    for (let c = originC - spread; c <= originC + spread; c += 1) {
      if (r < 0 || numRows <= r || c < 0 || numCols <= c) {
        continue; // out of bounds
      }

      // Each square has a probability of lighting.
      if (Math.random() > intensity) {
        continue; // got lucky, this square didn't catch fire.
      }

      // If a player lives on the square, they get an extra resistance
      let curVal = getBoardContents(board, r, c);
      if (hasPlayer(curVal)) {
        if (Math.random() < checkerResistance) {
          continue; // Player successfully resisted being burned. For now.
        }

        if (hasPlayer1(curVal)) {
          countP1Burned += 1;
        } else if (hasPlayer2(curVal)) {
          countP2Burned += 1;
        }
      }

      // BURN IT DOWN
      newBoard[r][c] = fillFire();
      countFiresStarted += 1;
    }
  }

  return [newBoard, countP1Burned, countP2Burned, countFiresStarted];
}
