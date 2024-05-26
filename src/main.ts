import UI from "./UI";
import Brain from "./brain";

function addEventListeners(brain: Brain, ui: UI) {
    document.addEventListener("keydown", async (e) => {
        switch (e.key) {
            case 's':
                if (brain.lives <= 0) {
                    brain.resetGame();
                }
                if (!brain.ball.moving) {
                    brain.ball.moving = true;
                    brain.ball.intervalId = setInterval(brain.moveBall.bind(brain, brain.ball), 10);
                } else {
                    brain.ball.moving = false;
                    clearInterval(brain.ball.intervalId);
                }
                break;
            case 'c':
                if (ui.showScoreboard) {
                    ui.showScoreboard = false;
                }
                else {
                    ui.showScoreboard = true;
                }
        }
        if (!brain.paddle.moving &&
            brain.ball.moving &&
            (e.key == 'a' || e.key == 'd')
        ) {
            brain.paddle.moving = true;
            switch (e.key) {
                case 'a':
                    brain.paddle.velocityX = -Math.abs(brain.paddle.initialVelocityX);
                    break;
                case 'd':
                    brain.paddle.velocityX = Math.abs(brain.paddle.initialVelocityX);
                    break;
            }
            brain.paddle.intervalId = setInterval(brain.movePaddle.bind(brain, brain.paddle), 2);
        }
    })

    document.addEventListener("keyup", () => {
        brain.paddle.moving = false;
        brain.paddle.velocityX = 0;
        clearInterval(brain.paddle.intervalId);
    })
}

function uiDrawRepeater(ui: UI) {
    setTimeout(() => {
        ui.draw();
        uiDrawRepeater(ui);
    }, 4);
}

function main() {
    let appDiv = document.querySelector("#app");
    let brain = new Brain();
    if(appDiv != null){
        let ui = new UI(brain, appDiv);

        addEventListeners(brain, ui);
    
        uiDrawRepeater(ui);
    }
}

console.log("App startup...")
main();