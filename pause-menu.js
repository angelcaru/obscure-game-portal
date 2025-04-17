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

        text(localize("pauseMenu.title"), width/2, height/8);

        this.ui.button(localize("pauseMenu.continue"), () => {
            game = this.game;
        });
        this.ui.button(localize("pauseMenu.restart"), () => {
            game = this.game;
            this.game.restart();
        });
        this.ui.button(localize("options.button"), () => {
            game = new OptionsMenu(this);
        });
        this.ui.button(localize("pauseMenu.backToMainMenu"), () => {
            game = null;
        });

        pop();
    }

    mousePressed() {
        this.ui.mousePressed();
    }
    keyPressed() {}
}
