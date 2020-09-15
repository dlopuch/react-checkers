import { fillEmpty, fillPlayer1, fillPlayer2 } from "../../utils/boardSquareUtils";
import {executeMove, getLegalMoves} from "./checkersRules";

const P1 = fillPlayer1();
const P2 = fillPlayer2();
const __ = fillEmpty();


describe('getLegalMoves', () => {
  test('Invalid square refs handled gracefully', () => {
    const board = [
      [__, __, __],
      [__, P1, __],
      [__, __, __],
    ];

    expect(getLegalMoves(board, 0, 666)).toEqual([])
    expect(getLegalMoves(board, 666, 0)).toEqual([])
    expect(getLegalMoves(board, 666, 666)).toEqual([])
  });


  test('No moves on empty square', () => {
    const board = [
      [__, __, __],
      [__, P1, __],
      [__, __, __],
    ];

    expect(getLegalMoves(board, 0, 0)).toEqual([])
  });


  test('Basic moves (P1 directionality)', () => {
    // Player 1 goes up the rows (downwards as drawn here)
    const board = [
      [__, __, __], // empty row to make sure no backwards moves
      [__, P1, __],
      [__, __, __],
    ];

    expect(getLegalMoves(board, 1, 1)).toEqual([
      { r:2, c:0, fromR:1, fromC:1, captures: [] },
      { r:2, c:2, fromR:1, fromC:1, captures: [] },
    ]);
  });


  test('Basic moves (P2 directionality)', () => {
    // Player 2 goes down the rows (upwards as drawn here)
    const board = [
      [__, __, __],
      [__, P2, __],
      [__, __, __], // empty row to make sure no backwards moves
    ];

    expect(getLegalMoves(board, 1, 1)).toEqual([
      { r:0, c:0, fromR:1, fromC:1, captures: [] },
      { r:0, c:2, fromR:1, fromC:1, captures: [] },
    ]);
  });


  test('Edge moves', () => {
    const board = [
      [__, __, __], // empty row to make sure no backwards moves
      [P1, __, P1],
      [__, __, __],
    ];

    // Left edge
    expect(getLegalMoves(board, 1, 0)).toEqual([
      { r:2, c:1, fromR:1, fromC:0, captures: [] },
    ]);

    // Right edge
    expect(getLegalMoves(board, 1, 2)).toEqual([
      { r:2, c:1, fromR:1, fromC:2, captures: [] },
    ]);
  });


  test('Self-blocked moves', () => {
    const board = [
      [__, P1, __],
      [P1, __, P1],
      [__, __, __],
    ];

    expect(getLegalMoves(board, 0, 1)).toEqual([
      // No valid moves -- blocked by other P1's
    ]);
  });


  test('No more forward moves', () => {
    const board = [
      [__, __, __],
      [__, __, __],
      [__, P1, __],
    ];

    expect(getLegalMoves(board, 0, 1)).toEqual([
      // No valid moves -- blocked by edge
      // TODO: This should be replaced with king-ification
    ]);
  });


  test('Single Move into a trap', () => {
    const board = [
      [P1, __, __, __],
      [__, __, __, __],
      [__, __, P2, __],
      [__, __, __, __],
    ];

    expect(getLegalMoves(board, 0, 0)).toEqual([
      {r: 1, c: 1, fromR:0, fromC:0, captures: []},
    ]);
  });


  test('Single Jump into a trap', () => {
    const board = [
      [P1, __, __, __],
      [__, P2, __, __],
      [__, __, __, __],
      [__, __, __, P2],
    ];

    expect(getLegalMoves(board, 0, 0)).toEqual([
      {r: 2, c: 2, fromR:0, fromC:0, captures: [[1, 1]]},
    ]);
  });

  test('Option to jump into a trap (TODO: Pending requirements verification)', () => {
    const board = [
      [__, P1, __, __, __],
      [__, __, P2, __, __],
      [__, __, __, __, __],
      [__, __, __, __, P2],
    ];

    expect(getLegalMoves(board, 0, 2)).toEqual([
      {r: 2, c: 3, fromR:0, fromC:0, captures: [[1, 1]]},
      // TODO: Project requirements need sanity check. Project specs said,
      //   > "If there is an opportunity to capture an enemy checker - it should be the only valid move"
      //   This however is a case where where there is an opportunity to capture an enemy checker, but there's no reason
      //   why that should be the ONLY valid move. Could choose not to.
      //   Test is written per requirements and so is failing until requirements are sanity-checked and that functionality
      //   is either implemented or the requirement is revised.
    ]);
  });


  test('Single Jump', () => {
    const board = [
      [P1, P1, P1],
      [__, P2, __],
      [__, __, __],
    ];

    // Down-towards-right
    expect(getLegalMoves(board, 0, 0)).toEqual([
      {r: 2, c: 2, fromR:0, fromC:0, captures: [[1, 1]]},
    ]);

    // Down-towards-left
    expect(getLegalMoves(board, 0, 2)).toEqual([
      {r: 2, c: 0, fromR:0, fromC:2, captures: [[1, 1]]},
    ]);

    // Not a valid board, but make sure that middle P1 can't do a jump straight down
    expect(getLegalMoves(board, 0, 1)).toEqual([
      {r: 1, c: 0, fromR:0, fromC:1, captures: [] },
      {r: 1, c: 2, fromR:0, fromC:1, captures: [] },
    ]);
  });


  test('Single Jump P2 directionality', () => {
    const board = [
      [__, __, __],
      [__, P1, __],
      [P2, __, P2],
      [__, __, __],
    ];

    // Up-towards-right
    expect(getLegalMoves(board, 2, 0)).toEqual([
      {r: 0, c: 2, fromR:2, fromC:0, captures: [[1, 1]]},
    ]);

    // Up-towards-left
    expect(getLegalMoves(board, 2, 2)).toEqual([
      {r: 0, c: 0, fromR:2, fromC:2, captures: [[1, 1]]},
    ]);
  });


  test('No backwards jumps', () => {
    const board = [
      [__, __, __],
      [__, P2, __],
      [P1, __, __],
      [__, __, __],
    ];

    expect(getLegalMoves(board, 2, 0)).toEqual([
      // Only move is to go forward, backwards jumps not allowed
      {r: 3, c: 1, fromR:2, fromC:0, captures: []},
      // TODO: This is a "house rule" that sometimes is played with backwards jumps being allowed.
      //   My house played forwrad only, so backwards jumps not implemented.
    ]);
  });


  test('Single Jump blocked by edge', () => {
    const board = [
      [__, P1, __],
      [P2, __, P2],
      [__, __, __],
    ];

    expect(getLegalMoves(board, 0, 1)).toEqual([
      // No jumps
    ]);
  });


  test('Blocked Jumps', () => {
    const board = [
      [P1, __, P1],
      [__, P2, __],
      [P1, __, P2],
    ];

    // Down-towards-right:
    expect(getLegalMoves(board, 0, 0)).toEqual([
      // No valid moves -- blocked by P2
    ]);

    // Down-towards-left:
    expect(getLegalMoves(board, 0, 2)).toEqual([
      // No valid moves -- blocked by P1
    ]);
  });


  test('Multi-jump rules', () => {
    const board = [
      //0   1   2   3   4   5   6   7
      [__, __, P1, __, __, __, __, __ ], // 0
      [__, P2, __, __, __, __, __, __ ], // 1
      [__, __, __, __, __, __, __, __ ], // 2
      [__, P2, __, P2, __, __, __, __ ], // 3 -- note no backwards jump across 3,3
      [__, __, __, __, __, __, __, __ ], // 4
      [__, P2, __, P2, __, __, __, __ ], // 5
      [__, __, __, __, __, __, __, __ ], // 6
      [__, __, __, P2, __, P2, __, __ ], // 7
      [__, __, __, __, __, __, P2, __ ], // 8 -- note that 8,6 should block jump from 6,4
    ];

    const legalMoves = getLegalMoves(board, 0, 2);

    expect(legalMoves).toEqual([
      { r:2, c:0, fromR:0, fromC:2, captures: [[1,1]] },
      { r:1, c:3, fromR:0, fromC:2, captures: [] },
      { r:4, c:2, fromR:0, fromC:2, captures: [[1,1], [3,1]] },
      { r:6, c:0, fromR:0, fromC:2, captures: [[1,1], [3,1], [5,1]] },
      { r:6, c:4, fromR:0, fromC:2, captures: [[1,1], [3,1], [5,3]] },
      { r:8, c:2, fromR:0, fromC:2, captures: [[1,1], [3,1], [5,3], [7,3]] },
    ])
  });
});


describe('executeMove', () => {
  test('Tolerates null-move inputs', () => {
    const board = [
      [__, __, __],
      [__, P1, __],
      [__, __, __],
    ];

    const newBoard = executeMove(board);

    expect(newBoard).toBe(board);
  });


  test('Executes a multi-jump', () => {
    const board = [
      [__, __, P1, __, P1, ], // 0
      [__, P2, __, __, __, ], // 1
      [__, __, __, __, __, ], // 2
      [__, P2, __, P2, __, ], // 3 -- note no backwards jumping, so second P2 will stay
      [__, __, __, __, __, ], // 4
    ];

    const newBoard = executeMove(
      board,
      { r:4, c:2, fromR:0, fromC:2, captures: [ [1,1], [3,1] ] },
    );

    expect(newBoard).toEqual([
      [__, __, __, __, P1, ], // 0
      [__, __, __, __, __, ], // 1
      [__, __, __, __, __, ], // 2
      [__, __, __, P2, __, ], // 3
      [__, __, P1, __, __, ], // 4
    ]);

    // And some immutability checks:
    expect(newBoard).not.toBe(board)
    expect(newBoard[0]).not.toBe(board[0]); // row 0 changed (origin)
    expect(newBoard[2]).toBe(board[2]); // row 2 did not, should be ===-same row
    expect(newBoard[4]).not.toBe(board[0]); // row 4 changed (landing)
    expect(newBoard[3]).not.toBe(board[3]); // row 4 changed (capture row)
  });
});
