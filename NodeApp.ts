import {MinesweeperTextBasedGame} from "./TextBased"

// run Minesweeper
//
console.log('Welcome to Minesweeper!');
let boardSize = 10;
let numberOfMines = 5;
console.log('Board size: ' + boardSize);
console.log('# of mines: ' + numberOfMines);
let game = new MinesweeperTextBasedGame();
game.InitGame(boardSize, numberOfMines);
game.PlayGame();
