const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const clouds = document.querySelector(".clouds");
const scoreBoard = document.querySelector(".score");
const DEFAULT_SPEED = 2200;

let jumpTime = null;
let play = false;
let score = 0;
let speed = DEFAULT_SPEED;

const setSpeed = () => {
  const value = `${speed}ms`;
  pipe.style.animationDuration = value;
};

const getScore = () => {
  if (!play) return 0;
  const timeElapsed = (new Date().getTime() - play) / 1000;
  return Math.round(timeElapsed / 2) * 10;
};

const animate = (initial) => {
  if (!initial) {
    // finishes the game
    pipe.classList.remove("pipe-move");
    // pipe.style.animation = "none";
    clouds.style.animation = "none";
    mario.src = "./images/game-over.png";
    mario.style.width = "75px";
    return;
  }
  // set beginning stats
  mario.style.animation = "";
  mario.style.bottom = `0`;
  mario.style.width = "150px";
  mario.style.marginLeft = "0px";
  mario.src = "./images/mario.gif";

  clouds.style.animation = "clouds-animation 20s infinite linear";

  pipe.classList.add("pipe-move");
  pipe.style.left = "";
  // reset speed
  speed = DEFAULT_SPEED;
  setSpeed();
};

const jump = (e) => {
  if (e.key !== " ") return;
  if (!play) {
    play = new Date().getTime();
    score = 0;
    scoreBoard.textContent = score;
    animate(true);
    return loop();
  }
  jumpTime = new Date().getTime();
  mario.classList.add("jump");
};
document.addEventListener("keydown", jump);

const loop = () => {
  const land = new Date().getTime();
  const localScore = getScore();
  if (!play) return cancelAnimationFrame(loop);
  // get score
  if (localScore !== score) {
    score = localScore;
    scoreBoard.textContent = score;
  }
  // make pipe comes faster
  if (Math.round(land - play) % speed < 50 && speed > 500) {
    speed -= 10;
    setSpeed(speed);
  }
  // remove jump class
  if (jumpTime && land - jumpTime >= 500) {
    mario.classList.remove("jump");
    jumpTime = null;
  }

  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");

  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    pipe.style.left = `${pipePosition}px`;

    mario.style.bottom = `${marioPosition}px`;

    mario.src = "./images/game-over.png";
    mario.style.width = "75px";
    mario.style.marginLeft = "50px";
    mario.style.animation = "die-animation 2s linear";

    play = false;
    animate();
    cancelAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};

animate();
