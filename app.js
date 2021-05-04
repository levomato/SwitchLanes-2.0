import {
  getCanvas,
  rect,
  circle,
  lines,
  drawpercentage,
} from "./canvas_lib.js";

import { drawStartScreen } from "./startScreen.js";

import { swipedetect, movePlayer } from "./swipeFunctions.js";

import { everyinterval } from "./intervalHelper.js";

function Init() {
  let context = getCanvas("canvas01");
  let canvas = context.canvas;

  var frameNo = 0;

  var game_over = false;
  var game_started = false;

  var player = rect(
    context,
    Math.round(canvas.width / 5),
    Math.round(canvas.width / 5),
    "blue",
    2
  );
  player.setScale(canvas.width / 10);
  player.move(canvas.width / 2, Math.round(canvas.height * 0.8));
  console.log(player.getLane());
  //console.log(player.getHeight());
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

  function generateObstacle() {
    var randomNumber = Math.floor(Math.random() * 5, 0);
    var randomLane = (canvas.width / 5) * randomNumber;

    if (frameNo == 1 || everyinterval(150, frameNo)) {
      console.log(player.getY() - player.getHeight());
      var newObstacle = rect(
        context,
        Math.round(canvas.width / 5),
        Math.round(canvas.width / 5),
        "#" + (((1 << 24) * Math.random()) | 0).toString(16),
        randomNumber
      );
      newObstacle.setScale(canvas.width / 10);
      newObstacle.move(newObstacle.getWidth() / 2 + randomLane);
      active_obstacles.push(newObstacle);
      console.log(newObstacle.getLane());
    }
  }

  function draw() {
    if (game_started) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      generateObstacle();
      line.draw();
      //   player.move(player.getX(), player.getY());
      player.draw();

      for (let i = 0; i < active_obstacles.length; i++) {
        active_obstacles[i].draw();
        let position_cval = active_obstacles[i].get_spawnStart();
        active_obstacles[i].set_spawnStart(position_cval + obstacle_speed);
        active_obstacles[i].move(active_obstacles[i].getX(), position_cval + 2);

        if (
          active_obstacles[i].getY() <= player.getY() - player.getHeight() &&
          active_obstacles[i].getLane() == player.getLane()
        ) {
          console.log("Collision");
        }
      }

      frameNo += 1;
    }
  }

  function animate() {
    draw();
    window.requestAnimationFrame(animate);
  }

  animate();
}

window.onload = Init();
