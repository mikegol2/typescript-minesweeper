import {Field} from "./Field"
import {GameStatus} from "./Field"

let field = new Field();
let table : HTMLElement;

export function main(tbl: HTMLElement): void {
    table = tbl;

    // init the field, put mines on it
    field.Init(10,10);

    // build html table
    buildHtmlTable();
}

export function blockClicked(row: number, col: number): void {
    field.OpenOneBlock(row, col);
    let gameStatus = field.CheckGameStatus();

    if (gameStatus.Lost) {
        alert('Boooom!!! You lost.');
        return;
    }

    if (gameStatus.Won) {
        alert('Yay!!! You won.');
        return;
    }

    buildHtmlTable();
}

function buildHtmlTable() {
    let html = "";
    for (let row = 0; row < field.Size; ++row) {
        html += '<tr>';
        for (let col = 0; col < field.Size; ++col) {
            html += '<td>';

            let strEvent = 'onclick="blockClicked(' + row + ',' + col + ')"';

            if (field.IsBlockOpen(row, col)) {
                let count = field.GetCountMinesAround(row, col);
                html += '<a class="btn btn-default block-open" ' + strEvent + '>' + count + '</a>';
            }
            else {
                html += '<a class="btn btn-primary block-notopen" ' + strEvent + '>-</a>';
            }
            html += '</td>';
        }
        html += '</tr>';
    }
    table.innerHTML = html;
}
