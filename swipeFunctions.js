export function swipedetect(canvas, callback) {
  var swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function (swipedir) {};
  canvas.addEventListener(
    "touchstart",
    function (e) {
      var touchobj = e.changedTouches[0];
      swipedir = "none";
      var dist = 0;
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime();
      e.preventDefault();
    },
    false
  );

  canvas.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault(); // prevent scrolling when inside DIV
    },
    false
  );

  canvas.addEventListener(
    "touchend",
    function (e) {
      var touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime; // get time elapsed
      if (elapsedTime <= allowedTime) {
        // first condition for awipe met
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          // 2nd condition for horizontal swipe met
          swipedir = distX < 0 ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
        } else if (
          Math.abs(distY) >= threshold &&
          Math.abs(distX) <= restraint
        ) {
          // 2nd condition for vertical swipe met
          swipedir = distY < 0 ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
        } else {
        }
      }
      handleswipe(swipedir);
      e.preventDefault();
    },
    false
  );
}

export function movePlayer(canvas, swipedir, player) {
  if (swipedir == "right") {
    player.move(
      Math.round(player.getX() + canvas.width / 5),
      Math.round(player.getY())
    );
    player.setLane(player.getLane() + 1);
    console.log(player.getX());
  }
  if (swipedir == "left") {
    player.move(
      Math.round(player.getX() - canvas.width / 5),
      Math.round(player.getY())
    );
    player.setLane(player.getLane() - 1);
    console.log(player.getX());
  }
  if (swipedir == "up") {
    player.rotate(player.getAlpha() + 90);
  }
  if (swipedir == "down") {
    player.rotate(player.getAlpha() - 90);
  }
}
