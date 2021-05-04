export function drawEndScreen(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.resetTransform();
    context.fillStyle = "red";
    var game_started = false;
    context.lineTo(150, 170);
    context.stroke();
    var text = "Game Over";
    // var text2 = "Swipe left and right to move";
    // var text3 = "Swipe Up and Down to rotate yourself and steer your missels";
    // var text4 = "Tap to start";
    // var text5 = "Tap with two fingers to load your Bomb";
    context.font = "60px Arial";
  
    context.textAlign = "center";
    context.fillText(text, canvas.width / 2, (canvas.height / 2) * 0.8);
    
  
    return true;
  }
  