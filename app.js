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
import { drawEndScreen } from "./endScreen.js";

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

  //missel.draw();
  //console.log(player.getHeight());
  let line = lines(context, "red");

  var active_obstacles = [];
  var destroyed_Obstacles = [];
  var passed_obstacles = [];

  var obstacle_speed = 1;

  var lifes = 5;
  var active_missels = [];
  var bombs = 1;

  var newBombAdded;

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
    if (swipedir != "none") {
      clearTimeout(hidetimer);
      movePlayer(canvas, swipedir, player);
    } else {
      createMissel();
    }
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

  function decrementLife() {
    for (let i = 0; i < active_obstacles.length; i++) {
      if (active_obstacles[i].getY() > canvas.height) {
        active_obstacles.splice(i, 1);
        lifes--;
      }
    }
  }

  function newBomb() {
    if (
      destroyed_Obstacles.length % 10 == 0 &&
      destroyed_Obstacles.length > 0
    ) {
      bombs++;
      newBombAdded = true;
    }
  }

  function endGame() {
    drawEndScreen(context, canvas);

    canvas.addEventListener("touchstart", (evt) => {
      location.reload();
    });
  }

  function createMissel() {
    console.log("create missel");
    var missel = circle(context, 20, "red", "", player.getLane());
    console.log(missel.getLane());
    missel.setScale(1);
    missel.move(player.getX(), player.getY());
    active_missels.push(missel);
  }

  function draw() {
    if (game_started && !game_over) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      generateObstacle();
      decrementLife();
      for (let i = 0; i < active_missels.length; i++) {
        active_missels[i].draw();
        active_missels[i].shoot("horizontal");

        for (let y = 0; y < active_obstacles.length; y++) {
          if (
            active_obstacles[y].getY() + active_obstacles[y].getHeight() / 2 >
              active_missels[i].getY() &&
            active_obstacles[y].getLane() == active_missels[i].getLane()
          ) {
            destroyed_Obstacles.push(active_obstacles[i]);
            active_obstacles.splice(y, 1);
            active_missels.splice(i, 1);
          }
        }
      }

      line.draw();
      //   player.move(player.getX(), player.getY());
      player.draw();

      context.fillStyle = "yellow";
      context.fillText("Score: " + destroyed_Obstacles.length, 50, 50);

      context.fillText("Leben: " + lifes, canvas.width - 200, 50);

      context.fillText("Bomben: " + bombs, canvas.width / 2, 50);
      context.fillStyle = "blue";

      for (let i = 0; i < active_obstacles.length; i++) {
        active_obstacles[i].draw();
        let position_cval = active_obstacles[i].get_spawnStart();
        active_obstacles[i].set_spawnStart(position_cval + obstacle_speed);
        active_obstacles[i].move(active_obstacles[i].getX(), position_cval + 2);

        if (
          active_obstacles[i].getY() >= player.getY() - player.getHeight() &&
          active_obstacles[i].getLane() == player.getLane()
        ) {
          game_over = true;
        }
      }

      if (twoFingersOnScreen && bomb_loading_progress < 101 && bombs > 0) {
        let loadingBar = drawpercentage(context, bomb_loading_progress);
        loadingBar.move(canvas.width / 2, canvas.height / 2);
        loadingBar.setScale(1);
        loadingBar.draw();
        bomb_loading_progress += 2;
      } else {
        twoFingersOnScreen = false;
        bomb_loading_progress = 0;
      }
      if (bomb_loading_progress == 100) {
        active_obstacles = [];
        bombs--;
      }

      if (!newBombAdded) {
        newBomb();
      }
      if (destroyed_Obstacles.length % 10 != 0) {
        newBombAdded = false;
      }

      frameNo += 1;
    } else if (game_over) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      endGame();
    }
  }

  function animate() {
    draw();
    window.requestAnimationFrame(animate);
  }

  animate();

  canvas.addEventListener("touchstart", (evt) => {
    evt.preventDefault();
    if (evt.touches.length == 2) {
      twoFingersOnScreen = true;
    }
  });
}

window.onload = Init();
