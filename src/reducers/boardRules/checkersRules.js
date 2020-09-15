/* boardReducer helper functions that implement rules for checkers */

import { fillEmpty, fillPlayer1, fillPlayer2, hasPlayer1, hasPlayer2, isEmpty } from "../../utils/boardSquareUtils";
import { getBoardContents } from "../../utils/boardLayoutUtils";


/** Row-offset direction that Player 1's standard pieces can move */
const P1_STD_R_DIR = 1;

/** Row-offset direction that Player 2's standard pieces can move */
const P2_STD_R_DIR = -1;


/**
 * Sets up a new standard checkers board grid model
 * @param nRows Number of rows, default 8.
 * @param nCols Number of columns, default 8.
 * @param nPlayerRows How many rows to fill in with player pieces.
 *   nRows must be >= (2*nPlayerRows + 1)
 * @return {Array[Array[]]} New board grid
 */
export function generateNewBoard(nRows= 8, nCols= 8, nPlayerRows = 3) {
  if (nPlayerRows * 2 + 1 > nRows) {
    throw new Error('Invalid board setup -- must have more rows than 2n+1 nPlayerRows');
  }

  const rows = new Array(nRows);

  for (let r=0; r < nRows; r += 1) {
    rows[r] = new Array(nCols);

    let fillPlayer = r < nPlayerRows ? fillPlayer1 : fillPlayer2;
    let isPlayerRow = r < nPlayerRows || r >= (nRows - nPlayerRows);

    for (let c=0; c < nCols; c += 1) {
      if (isPlayerRow) {
        rows[r][c] = (r + c) % 2 ? fillPlayer() : fillEmpty();
      } else {
        rows[r][c] = fillEmpty();
      }
    }
  }

  return rows;
}


/**
 * Calculates list of legal moves from a position
 * @param board
 * @param r Starting row index
 * @param c Starting col index
 * @return {Array(MoveDefn)} List of legal moves, where each move definition is like:
 *   r: Landing row
 *   c: Landing col
 *   fromR: Starting row
 *   fromC: Starting col
 *   captures: List of [r, c] coordinates for all opponent pieces that this move would capture.
 */
export function getLegalMoves(board, r, c) {
  const baseContents = getBoardContents(board, r, c);

  if (baseContents === undefined || isEmpty(baseContents)) {
    return [];
  }

  // Figure out which row direction we can search in
  let tR = 0;
  let hasOpponent = () => false;
  if (hasPlayer1(baseContents)) {
    tR = P1_STD_R_DIR;
    hasOpponent = hasPlayer2;
  } else if (hasPlayer2(baseContents)) {
    tR = P2_STD_R_DIR;
    hasOpponent = hasPlayer1;
  }
  if (!tR) {
    throw new Error('Unexpected baseContents: neither player 1 nor player 2!'); // Catch for expanded functionality...
  }

  // Because we can do multiple jumps, we need a queue of potential moves (it's possible one move can have additional moves from it).
  // Each queue item will be a test-move that is checked for validity and potential derived moves.
  // Each test consists of keys:
  //   r, c: The row/col starting from
  //   tR, tC: The translation vector towards the landing spot to be tested
  //   captures: Array of [r, c] coordinates captured in jumps along the way
  let searchQ = [
    { r: r, c: c, tR: tR, tC: -1, captures: [], },
    { r: r, c: c, tR: tR, tC: 1,  captures: [], },
  ];
  let legalMoves = [];

  while (searchQ.length) {
    let test = searchQ.shift();

    let testSquare = getBoardContents(board, test.r, test.c, test.tR, test.tC);
    if (testSquare === undefined) {
      continue; // Invalid translation, move on to next one
    }

    // Empty spots are legal moves (unless the test is specifically looking for only valid jump moves)
    if (isEmpty(testSquare) && !test.onlyJumps) {
      legalMoves.push(
        { r: test.r + test.tR,
          c: test.c + test.tC,
          fromR: r,
          fromC: c,
          captures: test.captures,
        }
      );
      continue;
    }

    // Spots filled by opponents MIGHT be legal if the next spot along the way is legal
    if (hasOpponent(testSquare)) {
      // Check one more spot along the same vector
      let jumpTR = 2 * test.tR;
      let jumpTC = 2 * test.tC;
      let jumpSquare = getBoardContents(board, test.r, test.c, jumpTR, jumpTC);

      // Jump is legal iif the jump landing is empty
      if (isEmpty(jumpSquare)) {
        let newR = test.r + jumpTR;
        let newC = test.c + jumpTC;

        // Note the square we captured making this jump:
        let newCapture = [test.r + test.tR, test.c + test.tC];
        let captures = Array.from(test.captures);
        captures.push(newCapture); // add our jump-capture to other captures along the way

        // Record this jump as a legal move
        legalMoves.push(
          { r: newR, c: newC, fromR: r, fromC: c, captures: captures }
        );

        // but also check for multi-jumps from this landing
        searchQ.push(
          { r: newR, c: newC, tR: tR, tC: -1, captures: Array.from(captures), onlyJumps: true },
          { r: newR, c: newC, tR: tR, tC: 1,  captures: Array.from(captures), onlyJumps: true },
          // TODO: Some "house rules" allow for backward jumping for non-king pieces. If implementing that, be sure to not double-back!
        )
      }
    }

    // Otherwise, not a legal move. Move on to next test.
  }

  return legalMoves;

}


/**
 * Returns a new board layout after executing a given move.
 * @param board Input board
 * @param moveDefn An output from getLegalMoves()
 * @returns New board layout
 */
export function executeMove(board, moveDefn) {
  if (!moveDefn) {
    return board;
  }

  if (
    moveDefn.r === undefined || moveDefn.c === undefined ||
    moveDefn.fromR === undefined || moveDefn.fromC === undefined ||
    !moveDefn.captures
  ) {
    throw new Error('Invalid moveDefn! Missing attributes');
  }

  // Immutability-land:
  // Copy all the rows
  const newRows = Array.from(board);

  // Make a column-item replacer that puts in a new copy of the cols when done replacing
  function replaceItem(rI, cI, newValue) {
    const newCols = Array.from(newRows[rI]);
    newCols[cI] = newValue;
    newRows[rI] = newCols;
  }

  //
  // Execute the move:

  // First, move the existing piece to the new piece
  const toMoveVal = getBoardContents(newRows, moveDefn.fromR, moveDefn.fromC);

  // Clear out the value:
  replaceItem(moveDefn.fromR, moveDefn.fromC, fillEmpty());

  // Land it:
  replaceItem(moveDefn.r, moveDefn.c, toMoveVal);

  // And clear off all the captures
  moveDefn.captures.forEach(captureRC => {
    replaceItem(captureRC[0], captureRC[1], fillEmpty());
  });


  return newRows;
}
