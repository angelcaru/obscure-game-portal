const defaultOptions = {
    aiMoveCooldown: 0.5,
}

let options = {...defaultOptions};

function fetchOptionsFromLocalStorage() {
    const aiMoveCooldown = localStorage.getItem("aiMoveCooldown");
    if (aiMoveCooldown !== null) {
        options.aiMoveCooldown = Number(aiMoveCooldown);
    }
}

class OptionsMenu {
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

        text("OPCIONES", width/2, height/8);

        this.ui.button(`Tiempo de respuesta IA: ${options.aiMoveCooldown}s`);
        if (mouseIsPressed && mouseOverButton(width/2, height/4)) {
            options.aiMoveCooldown += (mouseX - pmouseX) * 0.05;
            options.aiMoveCooldown = Math.max(0, round(options.aiMoveCooldown, 1));
            localStorage.setItem("aiMoveCooldown", String(options.aiMoveCooldown));
        }

        this.ui.button2("Volver a valores por defecto", () => {
            localStorage.clear();
            options = {...defaultOptions};
        });
        this.ui.button2("Volver", () => {
            game = this.game;
        });

        pop();
    }

    mousePressed() {
        this.ui.mousePressed();
    }
    keyPressed() {}
}