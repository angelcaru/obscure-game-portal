const defaultOptions = {
    aiMoveCooldown: 0.5,
    language: "en",
}

let options = {...defaultOptions};

const langs = {
    "en": {
        "back": "Back",

        "mainMenu.title": "MAIN MENU",

        "games.parelha": "Parelha",
        "games.dicechess": "32 Dice",

        "singleplayer": "1 player",
        "multiplayer": "2 players",

        "options.button": "Options",
        "options.title": "OPTIONS",
        "options.aiMoveCooldown": "AI Delay: {0}s",
        "options.languageButton": "Language: {0}",
        "options.currentLanguage": "English",
        "options.reset": "Reset options to default values",

        "pauseMenu.title": "PAUSED",
        "pauseMenu.continue": "Continue",
        "pauseMenu.restart": "Restart",
        "pauseMenu.backToMainMenu": "Back to main menu",

        "victory": "PLAYER {0}: VICTORY",
        "drawByRepetition": "DRAW BY REPETITION",
    },
    "es": {
        "back": "Volver",

        "mainMenu.title": "MENÚ PRINCIPAL",

        "games.parelha": "Parelha",
        "games.dicechess": "32 Dados",

        "singleplayer": "1 jugador",
        "multiplayer": "2 jugadores",

        "options.button": "Opciones",
        "options.title": "OPCIONES",
        "options.aiMoveCooldown": "Tiempo de respuesta IA: {0}s",
        "options.languageButton": "Idioma: {0}",
        "options.currentLanguage": "Español",
        "options.reset": "Volver a valores por defecto",

        "pauseMenu.title": "PAUSA",
        "pauseMenu.continue": "Continuar",
        "pauseMenu.restart": "Reiniciar",
        "pauseMenu.backToMainMenu": "Volver al menú principal",

        "victory": "JUGADOR {0}: VICTORIA",
        "drawByRepetition": "TABLAS POR REPETICIÓN",
    },
};

function fetchOptionsFromLocalStorage() {
    const aiMoveCooldown = localStorage.getItem("aiMoveCooldown");
    if (aiMoveCooldown !== null) {
        options.aiMoveCooldown = Number(aiMoveCooldown);
    }
    const lang = localStorage.getItem("lang");
    if (lang !== null && Object.hasOwn(langs, lang)) {
        options.lang = lang;
    }
}

function localizeIn(lang, key, ...args) {
    let ret = langs[lang][key] ?? langs["en"][key] ?? key;
    for (let i = 0; i < args.length; i++) {
        ret = ret.replaceAll(`{${i}}`, args[i]);
    }
    return ret;
}

function localize(key, ...args) {
    return localizeIn(options.language, key, ...args);
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

        text(localize("options.title"), width/2, height/8);

        this.ui.button(localize("options.aiMoveCooldown", options.aiMoveCooldown));
        if (mouseIsPressed && mouseOverButton(width/2, height/4)) {
            options.aiMoveCooldown += (mouseX - pmouseX) * 0.05;
            options.aiMoveCooldown = Math.max(0, round(options.aiMoveCooldown, 1));
            localStorage.setItem("aiMoveCooldown", String(options.aiMoveCooldown));
        }
        this.ui.button(localize("options.languageButton", localize("options.currentLanguage")), () => {
            game = new LanguageMenu(this);
        });

        this.ui.button2(localize("options.reset"), () => {
            localStorage.clear();
            options = {...defaultOptions};
        });
        this.ui.button2(localize("back"), () => {
            game = this.game;
        });

        pop();
    }

    mousePressed() {
        this.ui.mousePressed();
    }
    keyPressed() {}
}

class LanguageMenu {
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

        for (const lang of Object.keys(langs)) {
            this.ui.button(localizeIn(lang, "options.currentLanguage"), () => {
                options.language = lang;
                game = this.game;
            });
        }
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
