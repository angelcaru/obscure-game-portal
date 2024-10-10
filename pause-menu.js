class PauseMenu {
    constructor(game) {
        this.game = game;
    }

    draw() {
        push();
        background(0);
        textSize(40);
        textAlign(CENTER, CENTER);
        fill(255);
        stroke(255);

        text("PAUSA", width/2, height/8);

        drawButton(width/2, height/4, "Continuar");
        drawButton(width/2, height/4+BUTTON_GAP, "Reiniciar");
        drawButton(width/2, height/4+BUTTON_GAP*2, "Volver al menú principal");

        pop();
    }

    mousePressed() {
        if (mouseOverButton(width/2, height/4)) {
            game = this.game;
        } else if (mouseOverButton(width/2, height/4+BUTTON_GAP)) {
            game = this.game;
            game.restart();
        } else if (mouseOverButton(width/2, height/4+BUTTON_GAP*2)) {
            game = null;
        }
    }
    keyPressed() {}
}