export function drawStartScreen(context, canvas) {
  context.resetTransform();
  context.fillStyle = "red";
  var game_started = false;
  context.lineTo(150, 170);
  context.stroke();
  var text = "Tap to Shoot";
  var text2 = "Swipe left and right to move";
  var text3 = "Swipe Up and Down to rotate yourself and steer your missels";
  var text4 = "Tap to start";
  var text5 = "Tap with two fingers to load your Bomb";
  context.font = "18px Arial";

  context.textAlign = "center";
  context.fillText(text, canvas.width / 2, (canvas.height / 2) * 0.8);
  context.fillText(text2, canvas.width / 2, (canvas.height / 2) * 0.9);
  context.fillText(text3, canvas.width / 2, canvas.height / 2);
  context.fillText(text5, canvas.width / 2, (canvas.height / 2) * 1.1);
  context.fillText(text4, canvas.width / 2, (canvas.height / 2) * 1.2);

  return true;
}
