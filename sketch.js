const BOARD_SIZE = 4;
const TILE_SIZE = 40;
let layout;

let board;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    board = new Board();
    layout = board.layout;
}

let turn = 0;

function draw() {
    background(turn === 0 ? "lightgray" : "darkgray");
    translate(width / 2, height / 2);
    for (const { hex } of board.grid) {
        const loc = hex2Screen(layout, hex);
        const coord = hexGetCoord(hex);
        push();
        fill("limegreen");
        for (const home of board.homes) {
            if (hexIsEquals(hex, home.hex)) {
                fill(home.owner === 0 ? "white" : "black");
                break;
            }
        }
        if (currentHex !== null && hexIsEquals(hex, currentHex)) {
            fill("red");
        }
        hexDraw(layout, hex);
        pop();
        
        push();
        rectMode(CENTER);
        strokeWeight(4);
        stroke("darkblue");
        let piece = board.at(hex).piece;
        let shape = circle;
        if (piece >= 2) {
            shape = square;
            piece -= 2;
        }
        fill(piece === 0 ? "white" : "black");
        if (piece !== -1) shape(loc.x, loc.y, TILE_SIZE);
        if (currentHex !== null && board.possibleMovesForHex(turn, currentHex).find(move => hexIsEquals(move.dest, hex))) {
            fill("lightgray");
            noStroke();
            circle(loc.x, loc.y, TILE_SIZE*0.8);
        }
        pop();

        // push();
        // fill("gray");
        // text(coord, loc.x, loc.y);
        // pop();
    }

    const winner = board.winner();
    if (winner !== -1) {
        background(winner === 0 ? "white" : "black");
        fill(winner === 0 ? "black" : "white");
        stroke(winner === 0 ? "black" : "white");
        textSize(40);
        textAlign(CENTER, CENTER);
        text(`JUGADOR ${winner+1}: VICTORIA`, 0, 0);
        noLoop();
        return;
    }
}

let currentHex = null;

function mousePressed() {
    const mx = mouseX - width / 2;
    const my = mouseY - height / 2;
    const hex = screen2Hex(layout, Point(mx, my));
    
    if (!board.inbounds(hex)) return;
    
    if (board.at(hex).piece !== -1) currentHex = hex;
    if (currentHex === null) return;
    const moves = board.possibleMovesForHex(turn, currentHex);
    if (moves.length > 0) {
        const move = moves.find(move => hexIsEquals(move.dest, hex));
        if (!move) return;
        board.performMove(move);
        currentHex = null;
        turn = 1 - turn;
    }
}

