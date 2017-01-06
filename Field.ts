export class Coordinate {
    constructor(row: number, col: number) {
        this.Row = row;
        this.Col = col;
    }
    Row: number;
    Col: number;
}

class Block {
    constructor(row: number, col: number) {
        this.Coordinate = new Coordinate(row, col);
        this.IsMine = false;
        this.CountMinesAround = 0;
        this.Opened = false;
    }

    Coordinate: Coordinate;
    IsMine: boolean;
    CountMinesAround: number;
    Opened: boolean;
}

export class GameStatus {
    NumberOfBlocksToOpen: number;
    Won: boolean;
    Lost: boolean;
}

export class Field {
    Size: number;
    NumberOfMines: number;
    protected Blocks: Block[][];

    constructor() {
    }

    Init(size: number, numberOfMines: number) {
        if (size <= 1 || size >= 1000)
            throw new Error('invalid size');
        if (numberOfMines < 1 || numberOfMines >= size * size / 2)
            throw new Error('invalid number of mines for this size of the board');
        this.Size = size;
        this.NumberOfMines = numberOfMines;

        // init blocks array
        this.Blocks = [];
        for (let row = 0; row < this.Size; ++row) {
            this.Blocks[row] = [];
            for (let col = 0; col < this.Size; ++col)
                this.Blocks[row][col] = new Block(row, col);
        }

        // add mines
        for (let mine = 0; mine < this.NumberOfMines; ++mine) {
            let row: number;
            let col: number;

            // find a new random spot for the mine
            for (let iter = 0; ; ++iter) {
                row = Math.floor(Math.random() * this.Size);
                col = Math.floor(Math.random() * this.Size);
                if (this.Blocks[row][col].IsMine == false)
                    break;
                if (iter > 1000)
                    throw new Error('too many mines for the field!');
            }

            this.Blocks[row][col].IsMine = true;
        }

        // count mines around each block
        for (let row = 0; row < this.Size; ++row)
            for (let col = 0; col < this.Size; ++col) {
                this.Blocks[row][col].CountMinesAround = this.countMinesAround(row, col);
            }
    }

    OpenOneBlock(row: number, col: number) {
        if (this.IsInBounds(row, col) == false)
            throw new Error('out of field bounds');
        this.Blocks[row][col].Opened = true;

        if (this.Blocks[row][col].CountMinesAround == 0) {
            let neighbours = this.getNeighbourBlocks(row, col);

            for (let neighbour of neighbours)
                if (neighbour.Opened == false) {
                    if (neighbour.IsMine)
                        continue;
                    neighbour.Opened = true;
                    if (neighbour.CountMinesAround == 0)
                        this.OpenOneBlock(neighbour.Coordinate.Row, neighbour.Coordinate.Col);
                }
        }
    }

    CheckGameStatus(): GameStatus {
        let status = new GameStatus();
        status.NumberOfBlocksToOpen = this.Size * this.Size - this.NumberOfMines;
        for (let row = 0; row < this.Size; ++row)
            for (let col = 0; col < this.Size; ++col) {
                let block = this.Blocks[row][col];
                if (block.IsMine && block.Opened)
                    status.Lost = true;
                if (block.Opened)
                    status.NumberOfBlocksToOpen--;
            }

        if (status.Lost == false && status.NumberOfBlocksToOpen <= 0)
            status.Won = true;

        return status;
    }

    IsInBounds(row: number, col: number): boolean {
        if (row < 0 || col < 0)
            return false;
        if (row >= this.Size || col >= this.Size)
            return false;
        return true;
    }

    IsBlockOpen(row: number, col: number): boolean {
        if (this.IsInBounds(row, col) == false)
            throw new Error('out of field bounds');
        return this.Blocks[row][col].Opened;
    }

    GetCountMinesAround(row: number, col: number): number {
        if (this.IsInBounds(row, col) == false)
            throw new Error('out of field bounds');
        let block = this.Blocks[row][col];
        if (block.Opened == false)
            return null;
        return block.CountMinesAround;
    }

    protected countMinesAround(row : number, col : number): number {
        let neighbours = this.getNeighbourBlocks(row, col);
        let count = 0;
        for (let neighbour of neighbours)
            if (neighbour.IsMine)
                count++;
        return count;
    }

    protected getNeighbourBlocks(row: number, col: number): Block[] {
        let neighbours: Block[] = [];

        // row above
        if (row > 0 && col > 0)
            neighbours.push(this.Blocks[row - 1][col - 1]);
        if (row > 0)
            neighbours.push(this.Blocks[row - 1][col]);
        if (row > 0 && col < this.Size - 1)
            neighbours.push(this.Blocks[row - 1][col + 1]);

        // same row
        if (col > 0)
            neighbours.push(this.Blocks[row][col - 1]);
        if (col < this.Size - 1)
            neighbours.push(this.Blocks[row][col + 1]);

        // row below
        if (row < this.Size - 1 && col > 0)
            neighbours.push(this.Blocks[row + 1][col - 1]);
        if (row < this.Size - 1)
            neighbours.push(this.Blocks[row + 1][col]);
        if (row < this.Size - 1 && col < this.Size - 1)
            neighbours.push(this.Blocks[row + 1][col + 1]);

        return neighbours;
    }
}
