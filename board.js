class Board {
    constructor() {
        this.grid = [];
        this.homes = Object.freeze([
            {owner: 0, hex: Hex(0, 3, -3)},
            {owner: 0, hex: Hex(3, -3, 0)},
            {owner: 0, hex: Hex(-3, 0, 3)},
            
            {owner: 1, hex: Hex(3, 0, -3)},
            {owner: 1, hex: Hex(-3, 3, 0)},
            {owner: 1, hex: Hex(0, -3, 3)},
        ]);
        this.scores = [0, 0];
        this.layout = hexLayout(pointyOrient, Point(TILE_SIZE, TILE_SIZE));

        const hexes = [];
        hexGenerateBoard(BOARD_SIZE - 1, hexes);
        
        for (const hex of hexes) {
            this.grid.push({hex, piece: -1});
        }

        for (const home of this.homes) {
            this.at(home.hex).piece = home.owner;
        }
    }

    winner() {
        for (const player of [0, 1]) {
            if (this.scores[player] >= 3) return player;
        }
        return -1;
    }

    at(hex) {
        for (const tile of this.grid) {
            if (hexIsEquals(hex, tile.hex)) {
                return tile;
            }
        }
        throw new Error("Board.at() argument out of bounds");
    }

    checkHomes(hex) {
        const player = this.at(hex).piece;
        for (const home of this.homes) {
            if (home.owner === player) continue;
            if (hexIsEquals(home.hex, hex)) {
                this.at(hex).piece = player + 2;
                this.scores[player]++;
                break;
            }
        }
    }
    
    performMove(move) {
        switch (move.type) {
            case "clone":
                this.at(move.dest).piece = this.at(move.src).piece;
                break;
            case "capture":
                this.at(move.dest).piece = this.at(move.src).piece;
                this.at(move.src).piece = -1;
                this.at(move.kill).piece = -1;
                break;
            default:
                throw `not implemented: ${move.type}`;
        }
        this.checkHomes(move.dest);
    }
    
    possibleMovesForHex(turn, hex) {
        const moves = this.possibleMoves(turn);
        return moves.filter(move => hexIsEquals(move.src, hex));
    }
    
    possibleMoves(turn) {
        let moves = this.possibleCaptures(turn);
        if (moves.length === 0) moves = this.possibleClones(turn);
        return moves;
    }
    
    possibleClones(turn) {
        const moves = [];
        for (const tile of this.grid) {
            const hex = tile.hex;
            if (this.at(hex).piece !== turn) continue;
    
            moves.push(...this.possibleClonesForHex(hex));
        }
        return moves;
    }
    
    possibleClonesForHex(hex) {
        const moves = [];
        for (let i = 0; i < 6; i++) {
            const neigh = hexGetNeighbor(hex, i);
    
            if (!this.inbounds(neigh)) continue;
            if (this.at(neigh).piece !== -1) continue;
            
            moves.push({type: "clone", src: hex, dest: neigh});
        }
        return moves;
    }
    
    possibleCaptures(turn) {
        const moves = [];
        for (const tile of this.grid) {
            const hex = tile.hex;
            if (this.at(hex).piece !== turn) continue;
    
            moves.push(...this.possibleCapturesForHex(hex));
        }
        return moves;
    }
    
    possibleCapturesForHex(hex) {
        const moves = [];
        for (let i = 0; i < 6; i++) {
            const neigh = hexGetNeighbor(hex, i);
    
            if (!this.inbounds(neigh)) continue;
            if (this.at(neigh).piece !== 1 - this.at(hex).piece) continue;
    
            const dest = hexGetNeighbor(neigh, i);
            if (!this.inbounds(dest)) continue;
            if (this.at(dest).piece !== -1) continue;
    
            moves.push({type: "capture", src: hex, kill: neigh, dest});
        }
        return moves;
    }
    
    inbounds(hex) {
        return this.grid.filter(tile => hexIsEquals(hex, tile.hex)).length > 0;
    }    
}