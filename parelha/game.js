const PARELHA_BOARD_SIZE = 4;
const PARELHA_TILE_SIZE = 40;

class Parelha {
    constructor(aiEnabled) {
        this.board = new ParelhaBoard(aiEnabled);
        this.layout = this.board.layout;
        this.turn = 0;
        this.currentHex = null;
        this.aiMoveCooldown = options.aiMoveCooldown;
    }

    draw() {
        background(this.turn === 0 ? "lightgray" : "darkgray");
        translate(width / 2, height / 2);

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
    
        if (this.board.drawByRepetition) {
            background("limegreen");
            fill("black");
            stroke("black");
            textSize(40);
            textAlign(CENTER, CENTER);
            text(`TABLAS POR REPETICIÓN`, 0, 0);
            return;
        }
    
        this.board.checkHasMoves(this.turn);
        for (const { hex } of this.board.grid) {
            const loc = hex2Screen(this.layout, hex);
            push();
            fill("limegreen");
            if (hexIsEquals(this.mouseHex(), hex)) fill("green");
            for (const home of this.board.homes) {
                if (hexIsEquals(hex, home.hex)) {
                    fill(home.owner === 0 ? "white" : "black");
                    break;
                }
            }
            if (this.currentHex !== null && hexIsEquals(hex, this.currentHex)) {
                fill("red");
            }
            hexDraw(this.layout, hex);
            pop();
            
            push();
            rectMode(CENTER);
            strokeWeight(4);
            stroke("darkblue");
            let piece = this.board.at(hex).piece;
            let shape = circle;
            if (piece >= 2) {
                shape = square;
                piece -= 2;
            }
            fill(piece === 0 ? "white" : "black");
            if (piece !== -1) shape(loc.x, loc.y, PARELHA_TILE_SIZE);
            if (this.currentHex !== null &&
                this.board.possibleMovesForHex(this.turn, this.currentHex)
                    .find(move => hexIsEquals(move.dest, hex))) {
                fill("lightgray");
                noStroke();
                circle(loc.x, loc.y, PARELHA_TILE_SIZE*0.8);
            }
            pop();
    
            // push();
            // fill("gray");
            // text(coord, loc.x, loc.y);
            // pop();
        }
    
        if (this.board.aiEnabled && this.turn === 1) {
            this.aiMoveCooldown -= 1/frameRate();
            if (this.aiMoveCooldown <= 0) {
                this.board.makeAiMove(this.turn);
                this.turn = 1 - this.turn;
            }
        }
    }

    mousePressed() {
        if (this.board.aiEnabled && this.turn === 1) return;
    
        const hex = this.mouseHex();
        
        if (!this.board.inbounds(hex)) return;
        
        if (this.board.at(hex).piece !== -1) this.currentHex = hex;
        if (this.currentHex === null) return;
        const moves = this.board.possibleMovesForHex(this.turn, this.currentHex);
        if (moves.length > 0) {
            const move = moves.find(move => hexIsEquals(move.dest, hex));
            if (!move) return;
            this.board.performMove(move);
            this.currentHex = null;
            this.turn = 1 - this.turn;
    
            this.aiMoveCooldown = options.aiMoveCooldown;
        }
    }

    keyPressed() {}

    mouseHex() {
        const mx = mouseX - width / 2;
        const my = mouseY - height / 2;
        return screen2Hex(this.layout, Point(mx, my));
    }

    restart() {
        this.board = new ParelhaBoard(this.board.aiEnabled);
        this.turn = 0;
        this.currentHex = null;
        this.aiMoveCooldown = options.aiMoveCooldown;
    }
}

Parelha.prototype.canPause = true;
