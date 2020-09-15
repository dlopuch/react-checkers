/* Common utilities around navigating a board's layout and accessing contents */

import { hasPlayer1, hasPlayer2 } from './boardSquareUtils';

/**
 * Gets the contents of a board square
 * @param board Board matrix
 * @param r Row to access
 * @param c Col to access
 * @param tR Row translation (offset)
 * @param tC Col translation (offset)
 * @return Contents of the board square, or undefined if invalid reference
 */
export function getBoardContents(board, r, c, tR = 0, tC = 0) {
  let row = board[r + tR]; // Out of range will return undefined
  if (!row) {
    return undefined; // On an invalid row ref, return undefined
  }
  return board[r + tR][c + tC]; // Invalid col refs will also return undefined
}


/**
 * Generates a globally-unique board square index string
 * @param r The row index
 * @param c The column index
 * @return {string}
 */
export function indexSquare(r, c) {
  if (!r && r !== 0) {
    throw new Error('Invalid rc -- no r');
  }
  if (!c && c !== 0) {
    throw new Error('Invalid rc -- no c');
  }
  return `sq_${r}_${c}`;
}


/**
 * Generates a globally-unique board square index string
 * @param rcObj Object containing a .r and a .c index for the square
 * @return {string}
 */
export function indexSquareFromRC(rcObj) {
  return indexSquare(rcObj.r, rcObj.c);
}


/**
 * Scans the board and returns the r,c coordinates of all squares occupied by a player
 * @param board Board data
 * @param playerNum either 1 or 2, depending on which player
 * @return {Array[Array[]]} List of [r,c] tuples
 */
export function getAllPlayerRCs(board, playerNum) {
  if (playerNum !== 1 && playerNum !== 2) {
    throw new Error('Invalid player specification, must be 1 or 2');
  }

  const hasPlayer = playerNum === 1 ? hasPlayer1 : hasPlayer2;

  const playerRCs = [];
  for (let r=0; r < board.length; r += 1) {
    for (let c=0; c < board[r].length; c += 1) {
      if (hasPlayer(board[r][c])) {
        playerRCs.push([r, c])
      }
    }
  }

  return playerRCs;
}

