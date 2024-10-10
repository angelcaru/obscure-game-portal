const DICE_CHESS_BOARD_SIZE = 8;
const DICE_CHESS_TILE_SIZE = 55;

class DiceChess {
    constructor() {
        this.board = new DiceChessBoard();
        this.currentTile = null;

        this.turn = 0;
    }

    draw() {
        background(this.turn === 0 ? "#aaaaaa" : "#222222");
        translate(width/2, height/2);
        
        const winner = this.board.winner();
        if (winner !== -1) {
            background(winner === 0 ? "white" : "black");
            fill(winner === 0 ? "black" : "white");
            stroke(winner === 0 ? "black" : "white");
            textSize(40);
            textAlign(CENTER, CENTER);
            text(`JUGADOR ${winner+1}: VICTORIA`, 0, 0);
            return;
        }
        
        noStroke();
        const baseX = -(DICE_CHESS_BOARD_SIZE/2 * DICE_CHESS_TILE_SIZE);
        const baseY = -(DICE_CHESS_BOARD_SIZE/2 * DICE_CHESS_TILE_SIZE);
        for (let y = 0; y < DICE_CHESS_BOARD_SIZE; y++) {
            for (let x = 0; x < DICE_CHESS_BOARD_SIZE; x++) {
                const realX = baseX + x*DICE_CHESS_TILE_SIZE;
                const realY = baseY + y*DICE_CHESS_TILE_SIZE;
                fill((x + y) % 2 === 0 ? "lightgreen" : "darkgreen");
                if (this.currentTile !== null && this.currentTile.x === x && this.currentTile.y === y) {
                    fill("red");
                }
                square(realX, realY, DICE_CHESS_TILE_SIZE);

                if (this.board.at(x, y).owner !== -1) {
                    fill(this.board.at(x, y).owner === 0 ? "white" : "black");
                    textSize(DICE_CHESS_TILE_SIZE / 2);
                    textAlign(CENTER, CENTER);
                    text(this.board.at(x, y).value, realX + DICE_CHESS_TILE_SIZE/2, realY + DICE_CHESS_TILE_SIZE/2);
                }

                if (this.currentTile !== null) {
                    const {x: cx, y: cy} = this.currentTile;

                    if (this.board.legalMovesForTile(this.turn, cx, cy).filter(move =>
                            move.type === "move" && move.dest.x === x && move.dest.y === y).length > 0) {
                        fill("lightgray");
                        noStroke();
                        circle(realX + DICE_CHESS_TILE_SIZE/2, realY + DICE_CHESS_TILE_SIZE/2, DICE_CHESS_TILE_SIZE / 2);
                    }
                }
            }
        }

        if (this.board.aiEnabled && this.turn === 1) {
            this.board.makeAiMove(this.turn);
            this.turn = 1 - this.turn;
        }
    }

    mousePressed() {
        const {x, y} = this.mouseTile();
        if (!this.board.inbounds(x, y)) return;
        if (this.currentTile === null) {
            if (this.board.at(x, y).owner === this.turn) {
                this.currentTile = {x, y};
            }
            return;
        }

        const {x: cx, y: cy} = this.currentTile;

        const moves = this.board.legalMovesForTile(this.turn, cx, cy);
        const move = moves.find(move => move.type === "move" && move.dest.x === x && move.dest.y === y);
        if (move) {
            this.board.performMove(move);
            this.currentTile = null;
            this.turn = 1 - this.turn;
            return;
        }
        if (this.board.at(x, y).owner === this.turn) {
            this.currentTile = {x, y};
            return;
        }
    }

    keyPressed() {
        if (this.currentTile === null) return;

        const {x, y} = this.currentTile;
        let num = Number(key);
        if (isNaN(num)) return;
        if (num < 0 || num > 6) return;

        const tile = this.board.at(x, y);
        const value = tile.value;
        const move = this.board.legalMovesForTile(this.turn, x, y).find(move => move.type === "rotate" && move.value === num);
        if (move) {
            this.board.performMove(move);
            this.currentTile = null;
            this.turn = 1 - this.turn;
        }
    }

    mouseTile() {
        const baseX = -(DICE_CHESS_BOARD_SIZE/2 * DICE_CHESS_TILE_SIZE);
        const baseY = -(DICE_CHESS_BOARD_SIZE/2 * DICE_CHESS_TILE_SIZE);
        
        const mx = mouseX - width / 2;
        const my = mouseY - height / 2;

        const x = floor((mx - baseX) / DICE_CHESS_TILE_SIZE);
        const y = floor((my - baseY) / DICE_CHESS_TILE_SIZE);
        return {x, y};
    }

    restart() {
        this.board = new DiceChessBoard();
        this.currentTile = null;

        this.turn = 0;
    }
}

DiceChess.prototype.canPause = true;
