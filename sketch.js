let game = null;
let selectedGame = null;

function setup() {
    createCanvas(windowWidth, windowHeight);
    fetchOptionsFromLocalStorage();
}

const BUTTON_FONT_SIZE = 26;
const BUTTON_GAP = BUTTON_FONT_SIZE*1.25;

function draw() {
    if (game !== null) return game.draw();

    push();
    background(0);
    textSize(40);
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(255);

    if (selectedGame === null) {
        text("MENÚ PRINCIPAL", width/2, height/8);

        drawButton(width/2, height/4, "Parelha");
        drawButton(width/2, height/4 + BUTTON_GAP, "32 Dados");
        drawButton(width/2, height-height/16, "Opciones");
    } else {
        drawButton(width/2, height/4, "1 jugador");
        drawButton(width/2, height/4 + BUTTON_GAP, "2 jugadores");
    }
    pop();
}

function drawButton(x, y, label, size = BUTTON_FONT_SIZE, bg = 0, fg = 255) {
    push();
    textSize(size);
    fill(fg)
    noStroke();
    if (mouseOverButton(x, y, size)) {
        rectMode(CORNERS)
        rect(0, y - size/2, width, y + size/2);
        fill(bg);
    }
    text(label, x, y);
    pop();
}

function mouseOverButton(_x, y, size = BUTTON_FONT_SIZE) {
    return y - size/2 < mouseY && mouseY < y + size/2;
}

function mousePressed() {
    if (game !== null) return game.mousePressed();

    if (selectedGame === null) {
        if (mouseOverButton(width/2, height/4)) {
            selectedGame = Parelha;
        } else if (mouseOverButton(width/2, height/4+BUTTON_GAP)) {
            game = new DiceChess(false);
        } else if (mouseOverButton(width/2, height-height/16)) {
            game = new OptionsMenu(null);
        }
    } else {
        if (mouseOverButton(width/2, height/4)) {
            game = new selectedGame(true);
            selectedGame = null;
        } else if (mouseOverButton(width/2, height/4+BUTTON_GAP)) {
            game = new selectedGame(false);
            selectedGame = null;
        }
    }
}

function keyPressed() {
    if (game !== null && game.canPause && key === "p") game = new PauseMenu(game);

    if (game !== null) return game.keyPressed();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

