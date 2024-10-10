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
    }

    draw() {
        push();
        background(0);
        textSize(40);
        textAlign(CENTER, CENTER);
        fill(255);
        stroke(255);

        text("OPCIONES", width/2, height/8);

        drawButton(width/2, height/4, `Tiempo de respuesta IA: ${options.aiMoveCooldown}s`);
        if (mouseIsPressed && mouseOverButton(width/2, height/4)) {
            options.aiMoveCooldown += (mouseX - pmouseX) * 0.05;
            options.aiMoveCooldown = Math.max(0, round(options.aiMoveCooldown, 1));
            localStorage.setItem("aiMoveCooldown", String(options.aiMoveCooldown));
        }

        drawButton(width/2, height-height/16-BUTTON_GAP, "Volver a valores por defecto");
        drawButton(width/2, height-height/16, "Volver");

        pop();
    }

    mousePressed() {
        if (mouseOverButton(width/2, height-height/16)) {
            game = this.game;
        } else if (mouseOverButton(width/2, height-height/16-BUTTON_GAP)) {
            localStorage.clear();
            options = {...defaultOptions};
        }
    }
    keyPressed() {}
}