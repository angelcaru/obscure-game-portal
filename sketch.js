let game;

function setup() {
    createCanvas(windowWidth, windowHeight);
    game = new Parelha();
}

function draw() {
    game.draw();
}

function mousePressed() {
    game.mousePressed();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

