import Brain, { Paddle, gameObject } from "./brain";

export default class UI {
    width = -1;
    height = -1;

    brain: Brain;
    appContainer: Element;

    showScoreboard = false;

    xScaling = -1;
    yScaling = -1;

    constructor(brain: Brain, appContainer: Element) {
        this.brain = brain;
        this.appContainer = appContainer;
        this.setScreenDimensions();
    }

    setScreenDimensions() {
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        this.xScaling = this.width / this.brain.width;
        this.yScaling = this.height / this.brain.height;
    }

    drawDiv(left: number, top: number, width: number, height: number, color: string) {
        let div = document.createElement("div");

        div.style.zIndex = "10";
        div.style.position = "fixed";

        div.style.left = left + "px";
        div.style.top = top + "px";

        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.background = color;

        this.appContainer.append(div);
    }

    drawBorder(color: string) {
        // Top
        this.drawDiv(
            0,
            0,
            this.width,
            this.scaleY(this.brain.borderThichkness),
            color
        );
        // Left
        this.drawDiv(
            0,
            0,
            this.scaleX(this.brain.borderThichkness),
            this.height,
            color
        );
        // Right
        this.drawDiv(
            this.width - this.scaleX(this.brain.borderThichkness),
            0,
            this.scaleX(this.brain.borderThichkness),
            this.height,
            color
        );
        // Bottom
        this.drawDiv(
            0,
            this.height - this.scaleY(this.brain.borderThichkness),
            this.width,
            this.scaleY(this.brain.borderThichkness),
            color
        );
    }

    scaleX(x: number) {
        return x * this.xScaling | 0;
    }

    scaleY(y: number) {
        return y * this.yScaling | 0;
    }

    drawPaddle(paddle: Paddle) {
        let div = document.createElement("div");

        div.style.zIndex = "10";
        div.style.position = "fixed";

        div.style.left = this.scaleX(paddle.left) + "px";
        div.style.top = this.scaleY(paddle.top) + "px";

        div.style.width = this.scaleX(paddle.width) + "px";
        div.style.height = this.scaleY(paddle.height) + "px";

        div.style.background = paddle.color;

        this.appContainer.append(div);
    }

    drawObject(obj: gameObject) {
        this.drawDiv(this.scaleX(obj.left), this.scaleY(obj.top), this.scaleX(obj.width), this.scaleY(obj.height), obj.color);
    }

    drawLabelDiv(left: number, top: number, width: number, height: number, color: string, text: string) {
        let div = document.createElement("div");

        div.style.zIndex = "10";
        div.style.position = "fixed";

        div.style.left = left + "px";
        div.style.top = top + "px";

        div.style.width = width + "px";
        div.style.height = height + "px";
        div.style.background = color;
        div.innerHTML = text;

        this.appContainer.append(div);
    }

    draw() {
        this.appContainer.innerHTML = "";
        this.setScreenDimensions();
        this.drawBorder("green");
        if (this.showScoreboard) {
            for (let i = 0; i < Math.min(10, this.brain.scores.length); i++) {
                this.drawLabelDiv(
                    this.scaleX(125),
                    this.scaleY(100 + i * 50),
                    150,
                    50,
                    "none",
                    (i + 1).toString() + ": " + this.brain.scores[i].toString()
                );
            }
        }
        else {
            this.drawObject(this.brain.paddle);
            this.drawObject(this.brain.ball);
            for (let i = 0; i < this.brain.bricks.length; i++) {
                this.drawObject(this.brain.bricks[i]);
            }
            this.drawLabelDiv(
                this.scaleX(50),
                this.scaleY(this.brain.height - 100),
                40,
                40,
                "none",
                "Lives: " + this.brain.lives.toString()
            );
            this.drawLabelDiv(
                this.scaleX(125),
                this.scaleY(this.brain.height - 100),
                40,
                40,
                "none",
                "Score: " + this.brain.score.toString()
            );
            this.drawLabelDiv(
                this.scaleX(200),
                this.scaleY(this.brain.height - 100),
                40,
                40,
                "none",
                "Level: " + this.brain.level.toString()
            );
        }
    }
}