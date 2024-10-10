class PauseMenu {
    constructor(game) {
        this.game = game;
        this.ui = new Ui(width/2, height/4, height-height/16);
    }

    draw() {
        push();
        background(0);
        textSize(40);
        textAlign(CENTER, CENTER);
        fill(255);
        stroke(255);

        this.ui.reset();

        text("PAUSA", width/2, height/8);

        this.ui.button("Continuar", () => {
            game = this.game;
        });
        this.ui.button("Reiniciar", () => {
            game = this.game;
            this.game.restart();
        });
        this.ui.button("Opciones", () => {
            game = new OptionsMenu(this);
        });
        this.ui.button("Volver al menú principal", () => {
            game = null;
        });

        pop();
    }

    mousePressed() {
        this.ui.mousePressed();
    }
    keyPressed() {}
}