class Ui {
    constructor(x, y, y2) {
        this.x = x;
        this.y = y;
        this.y2 = y2;
        this.baseY = y;
        this.baseY2 = y2;
        this.buttons = [];
    }

    reset() {
        this.y = this.baseY;
        this.y2 = this.baseY2;
        this.buttons = [];
    }

    button(label, cb = () => {}) {
        this.buttons.push({x: this.x, y: this.y, label, cb});
        drawButton(this.x, this.y, label);
        this.y += BUTTON_GAP;
    }

    button2(label, cb = () => {}) {
        this.buttons.push({x: this.x, y: this.y2, label, cb});
        drawButton(this.x, this.y2, label);
        this.y2 -= BUTTON_GAP;
    }

    mousePressed() {
        for (const button of this.buttons) {
            if (mouseOverButton(button.x, button.y)) {
                button.cb();
            }
        }
    }
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
