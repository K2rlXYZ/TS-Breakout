export default class Brain {
    width = 1000;
    height = 1000;
    borderThichkness = 20;

    lives = 3;
    score = 0;
    level = 1;

    paddle: Paddle;
    ball: Ball;
    bricks: Brick[] = []

    scores: number[] = []

    constructor() {
        this.paddle = new Paddle(400, 800, "blue");
        this.ball = new Ball(490, 400, "red");
        this.generateBricks();
    }


    generateBricks() {
        for (let i = this.borderThichkness + 2; i < 150; i += 18) {
            for (let j = this.borderThichkness + 2; j < this.width - this.borderThichkness; j += 80) {
                this.bricks.push(new Brick(j, i, "black"));
            }
        }
    }

    checkCollisionWorldX(obj: gameObject) {
        let next = obj.left + obj.velocityX;
        return (0 + this.borderThichkness > next || this.width - this.borderThichkness < next + obj.width)
    }

    checkCollisionWorldY(obj: gameObject) {
        let next = obj.top + obj.velocityY;
        return (0 + this.borderThichkness > next || this.height - this.borderThichkness < next + obj.height)
    }

    checkCollision(obj1: gameObject, obj2: gameObject) {
        let nextXObj1 = obj1.left + obj1.velocityX;
        let nextYObj1 = obj1.top + obj1.velocityY;

        let obj1X = nextXObj1;
        let obj1MaxX = nextXObj1 + obj1.width;
        let obj1Y = nextYObj1;
        let obj1MaxY = nextYObj1 + obj1.height;

        let nextXObj2 = obj2.left + obj2.velocityX;
        let nextYObj2 = obj2.top + obj2.velocityY;

        let obj2X = nextXObj2;
        let obj2MaxX = nextXObj2 + obj2.width;
        let obj2Y = nextYObj2;
        let obj2MaxY = nextYObj2 + obj2.height;

        let o1LeftOfO2 = obj1MaxX < obj2X;
        let o1RightOfO2 = obj1X > obj2MaxX;
        let o1AboveO2 = obj1Y > obj2MaxY;
        let o1BelowO2 = obj1MaxY < obj2Y;

        // [0] - boolean collision
        // [1] - boolean horizontal collision
        return [!(o1LeftOfO2 || o1RightOfO2 || o1AboveO2 || o1BelowO2), !(o1LeftOfO2 || o1RightOfO2) && (o1AboveO2 || o1BelowO2)];
    }

    async movePaddle(paddle: Paddle) {
        if (paddle.moving) {
            let col = this.checkCollisionWorldX(paddle);
            if (!col) {
                paddle.left = paddle.left + paddle.velocityX;
            }
            else {
                clearInterval(paddle.intervalId);
            }
        }
    }

    moveBall(ball: Ball) {
        let colX = this.checkCollisionWorldX(ball);
        let colY = this.checkCollisionWorldY(ball);

        if (this.checkCollision(ball, this.paddle)[0]) {
            colY = true;
            if (this.paddle.velocityX != 0) {
                ball.velocityX += this.paddle.velocityX / 2;
            }
        }

        for (let i = 0; i < this.bricks.length; i++) {
            let col = this.checkCollision(this.bricks[i], ball);
            if (col[0]) {
                this.bricks.splice(i, 1);
                this.score += 1;
                if (col[1]) {
                    colX = true;
                }
                else {
                    colY = true;
                }
                if (this.bricks.length == 0) {
                    ball.reset();
                    this.generateBricks();
                    this.level += 1;
                }
            }
        }

        if (colX) {
            ball.velocityX = -ball.velocityX;
            ball.left = ball.left + ball.velocityX;
        }
        else {
            ball.left = ball.left + ball.velocityX;
        }

        if (colY) {
            ball.velocityY = -ball.velocityY;
            ball.top = ball.top + ball.velocityY;
        }
        else {
            ball.top = ball.top + ball.velocityY;
        }

        if (ball.top > this.paddle.top) {
            this.lives -= 1;
            if (this.lives <= 0) {
                ball.moving = false;
                clearInterval(this.ball.intervalId);
            }
            ball.reset();
        }
    }

    resetGame() {
        this.ball.reset()
        this.ball.velocityX = 3;
        this.ball.velocityY = 3;
        if (!this.scores.includes(this.score)) {
            this.scores.push(this.score)
            this.scores.sort(function (a, b) {
                return a - b;
            });
            this.scores.reverse();
        }
        this.bricks = [];
        this.generateBricks();
        this.lives = 3;
        this.score = 0;
        this.level = 1;

    }
}

export class gameObject {
    width = -1;
    height = -1;
    left = -1;
    top = -1;

    velocityX = 0;
    velocityY = 0;

    intervalId: number = setTimeout(() => {});

    color = "red";

    constructor(x: number, y: number, color: string) {
        this.left = x;
        this.top = y;
        this.color = color;
    }
}

export class Paddle extends gameObject {
    width = 200;
    height = 20;

    initialVelocityX = 5
    velocityX = 0;

    moving = false;
}

export class Ball extends gameObject {
    width = 10;
    height = 10;

    initialVelocityX = 3
    velocityX = 3;
    velocityY = 3;

    moving = false;

    reset() {
        this.left = 490;
        this.top = 400;
        if (this.velocityX > 0) {
            this.velocityX = Math.max(this.velocityX / 2, this.initialVelocityX)
        }
        else {
            this.velocityX = Math.min(this.velocityX / 2, -this.initialVelocityX)
        }
    }
}

export class Brick extends gameObject {
    width = 78;
    height = 16;
}