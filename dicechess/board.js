class DiceChessBoard extends Board {
    constructor(aiEnabled) {
        super();
        this.grid = Array(DICE_CHESS_BOARD_SIZE ** 2).fill(0).map(() => ({owner: -1, value: 0}));

        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < DICE_CHESS_BOARD_SIZE; x++) {
                this.at(x, DICE_CHESS_BOARD_SIZE - y - 1).owner = 0;
                this.at(x, DICE_CHESS_BOARD_SIZE - y - 1).value = floor(random(1, 7));

                this.at(x, y).owner = 1;
                this.at(x, y).value = floor(random(1, 7));
            }
        }
        this.aiEnabled = aiEnabled;
    }

    copy() {
        const newBoard = new DiceChessBoard(this.aiEnabled);
        newBoard.grid = this.grid.map(({owner, value}) => ({owner, value}));
        return newBoard;
    }

    legalMovesForTile(turn, x, y) {
        const moves = this.possibleMoves(turn);
        return moves.filter(({src: {x: sx, y: sy}}) => sx === x && sy === y);
    }

    possibleMoves(turn) {
        const moves = [];
        for (let x = 0; x < DICE_CHESS_BOARD_SIZE; x++) {
            for (let y = 0; y < DICE_CHESS_BOARD_SIZE; y++) {
                if (this.at(x, y).owner !== turn) continue;
                const movesForTile = this.possibleMovesForTile(x, y);
                const startRank = turn === 0 ? DICE_CHESS_BOARD_SIZE - 1 : 0;

                for (const move of movesForTile) {
                    moves.push(move);
                    if (move.type === "move" && move.dest.y === startRank && this.at(move.dest.x, move.dest.y).owner === 1 - turn) {
                        return [move];
                    }
                }
            }
        }
        return moves;
    }

    possibleMovesForTile(x, y) {
        const tile = this.at(x, y);
        if (tile.owner === -1) return [];

        const moves = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;

                const nx = x + dx*tile.value;
                const ny = y + dy*tile.value;

                if (!this.inbounds(nx, ny)) continue;
                if (this.at(nx, ny).owner === tile.owner) continue;

                if (this.pathIsBlocked(x, y, nx, ny, dx, dy)) continue;

                moves.push({type: "move", src: {x, y}, dest: {x: nx, y: ny}});
            }
        }

        for (let i = 1; i <= 6; i++) {
            if (i !== 7 - tile.value) moves.push({type: "rotate", src: {x, y}, value: i});
        }

        return moves;
    }

    pathIsBlocked(x, y, nx, ny, dx, dy) {
        x += dx;
        y += dy;

        while (x !== nx || y !== ny) {
            if (this.at(x, y).owner !== -1) return true;

            x += dx;
            y += dy;
        }
        return false;
    }

    performMove(move) {
        switch (move.type) {
            case "move":
                const {src: {x: sx, y: sy}, dest: {x: nx, y: ny}} = move;
                this.grid[this.idx(nx, ny)] = this.grid[this.idx(sx, sy)];
                this.grid[this.idx(sx, sy)] = {owner: -1, value: 0};
                break;
            case "rotate":
                const {src: {x, y}, value} = move;
                this.at(x, y).value = value;
                break;
        }
    }

    winner() {
        for (let x = 0; x < DICE_CHESS_BOARD_SIZE; x++) {
            if (this.at(x, 0).owner === 0 && !this.attacked(x, 0)) {
                return 0;
            } else if (this.at(x, DICE_CHESS_BOARD_SIZE - 1).owner === 1 && !this.attacked(x, DICE_CHESS_BOARD_SIZE - 1)) {
                return 1;
            }
        }
        return -1;
    }

    attacked(x, y) {
        const owner = this.at(x, y).owner;
        if (owner === -1) return false;

        for (let ox = 0; ox < DICE_CHESS_BOARD_SIZE; ox++) {
            for (let oy = 0; oy < DICE_CHESS_BOARD_SIZE; oy++) {
                if (this.at(ox, oy).owner !== 1 - owner) continue;

                const moves = this.possibleMovesForTile(ox, oy);
                if (moves.filter(move =>
                    move.type === "move" && move.dest.x === x && move.dest.y === y).length > 0) return true;
            }
        }
        return false;
    }

    inbounds(x, y) {
        return x >= 0 && x < DICE_CHESS_BOARD_SIZE && y >= 0 && y < DICE_CHESS_BOARD_SIZE;
    }

    idx(x, y) {
        return y * DICE_CHESS_BOARD_SIZE + x;
    }

    at(x, y) {
        return this.grid[this.idx(x, y)];
    }
}

DiceChessBoard.MINIMAX_DEPTH = 1;
