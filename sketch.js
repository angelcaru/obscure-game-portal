let game = null;
let selectedGame = null;

let ui;

function setup() {
    createCanvas(windowWidth, windowHeight);
    fetchOptionsFromLocalStorage();

    ui = new Ui(width/2, height/4, height-height/16);
}

const BUTTON_FONT_SIZE = 26;
const BUTTON_GAP = BUTTON_FONT_SIZE*1.25;

function draw() {
    if (game !== null) return game.draw();

    ui.reset();

    push();
    background(0);
    textSize(40);
    textAlign(CENTER, CENTER);
    fill(255);
    stroke(255);

    if (selectedGame === null) {
        text(localize("mainMenu.title"), width/2, height/8);

        ui.button(localize("games.parelha"), () => {
            selectedGame = Parelha;
        });
        ui.button(localize("games.dicechess"), () => {
            game = new DiceChess(false);
        });
        ui.button2(localize("options.button"), () => {
            game = new OptionsMenu(null);
        });
    } else {
        ui.button(localize("singleplayer"), () => {
            game = new selectedGame(true);
            selectedGame = null;
        });
        ui.button(localize("multiplayer"), () => {
            game = new selectedGame(false);
            selectedGame = null;
        });
    }
    pop();
}

function mousePressed() {
    if (game !== null) return game.mousePressed();

    ui.mousePressed();
}

function keyPressed() {
    if (game !== null && game.canPause && key === "p") game = new PauseMenu(game);

    if (game !== null) return game.keyPressed();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
