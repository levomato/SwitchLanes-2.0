import {
  getCanvas,
  rect,
  circle,
  lines,
  drawpercentage,
} from "./canvas_lib.js";

import { drawStartScreen } from "./startScreen.js";

import { swipedetect, movePlayer } from "./swipeFunctions.js";

function Init() {
  let context = getCanvas("canvas01");
  let canvas = context.canvas;

  var frameNo = 0;

  var game_over = false;
  var game_started = false;

  var player = rect(context, 100, 100, "blue");
  player.setScale(canvas.width / 10);
  player.move(canvas.width / 2, canvas.height * 0.8);

  let line = lines(context, "red");

  var active_obstacles = [];
  var destroyed_Obstacles = [];
  var passed_obstacles = [];

  var obstacle_speed = 1;

  var lifes = 5;
  var active_missels = [];
  var bombs = 0;

  var bomb_loading_progress = 0;

  let twoFingersOnScreen = false;

  if (!game_started) {
    startGame();
  }

  function startGame() {
    drawStartScreen(context, canvas);
    canvas.addEventListener("touchstart", (evt) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      game_started = true;
    });
  }

  swipedetect(canvas, function (swipedir) {
    var hidetimer = null;
    if (swipedir != "none");
    clearTimeout(hidetimer);
    movePlayer(canvas, swipedir, player);
  });

  function draw() {
    if (game_started) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      line.draw();
      player.draw();
    }
  }

  function animate() {
    draw();
    window.requestAnimationFrame(animate);
  }

  animate();
}

window.onload = Init();
