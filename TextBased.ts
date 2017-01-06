import {Field} from "./Field"
import {GameStatus} from "./Field"

var the: MinesweeperTextBasedGame;
let countIDontUnderstand = 0;

export class MinesweeperTextBasedGame {
    field: Field;
    rl: any;

    InitGame(size: number, numberOfMines: number) {
        this.field = new Field();
        this.field.Init(size, numberOfMines);
    }

    PlayGame() {
        this.PrintField();

        // keep asking user for the next move
        the = this;
        this.ProcessNextGuess(null);
    }

    ProcessNextGuess(answer: string) {
        if (answer != null) {
            let strs = answer.split(',');
            if (strs.length != 2) {
                console.log("I don't understand. Enter like this: (row#,col#)");
            }
            else {
                let row = -1;
                let col = -1;
                try {
                    row = +strs[0];
                    col = +strs[1];
                }
                catch (Exception) {
                    row = -1;
                    col = -1;
                }
                if (col < 0 || row < 0 || col >= this.field.Size || row >= this.field.Size) {
                    console.log("I don't understand. Enter like this: (row#,col#)");
                }
                else {
                    this.field.OpenOneBlock(row, col);
                    let gameStatus = this.field.CheckGameStatus();
                    if (gameStatus.Lost) {
                        console.log('BOOOOOM! You lost.');
                        process.exit();
                    }
                    this.PrintField();
                    if (gameStatus.Won) {
                        console.log('YOU ARE AWESOME! You won!.');
                        process.exit();
                    }
                }
            }
        }

        var rl = require('readline');
        var read = rl.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        read.question('Enter next space to uncover (row,col):', function (answer: string) {
            read.close();
            the.ProcessNextGuess(answer);
        });
    }

    PrintField() {
        console.log('MINSWEEPER BOARD:');
        console.log('----------------------------------');
        for (let row = 0; row < this.field.Size; ++row) {
            let textLine = '';
            for (let col = 0; col < this.field.Size; ++col) {
                textLine += this.getTextForBlock(row, col);
            }
            console.log(textLine);
        }
        console.log('----------------------------------');
    }

    getTextForBlock(row: number, col: number) {
        if (this.field.IsBlockOpen(row, col) == false)
            return '[?]';
        return '[' + this.field.GetCountMinesAround(row, col).toString() + ']';
    }

    //PrintFieldCheat() {
    //    console.log('MINSWEEPER BOARD (CHEAT):');
    //    console.log('----------------------------------');
    //    for (let row = 0; row < this.field.size; ++row) {
    //        let textLine = '';
    //        for (let col = 0; col < this.field.size; ++col) {
    //            let state = this.field.GetStateOfSpace(row, col);
    //            if (state == SpaceState.MarkedAsMine || state == SpaceState.HiddenMine)
    //                textLine += '[*]';
    //            else {
    //                let count = this.field.HowManyMinesAround(row, col);
    //                textLine += '[' + count + ']';
    //            }
    //        }
    //        console.log(textLine);
    //    }
    //    console.log('----------------------------------');
    //}

}