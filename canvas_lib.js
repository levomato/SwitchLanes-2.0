function item(context, width, height, spawn_start) {
  var x = 0;
  var y = 0;
  var alpha = 0;
  var spawn_start = 0;
  var scale = 0;

  let matrix = new DOMMatrix();
  let needupdate = false;
  let obj_infos = {};
  let touchId;

  let horizontal = true;

  var children = [];

  function append(c) {
    children.push(c);
  }

  function getMatrix() {
    update();
    return matrix;
  }

  function isTouched(pointer, identifier) {
    let movingMatrix = ponter.getMatrix();

    let localInverse = DOMMatrix.fromMatrix(matrix);
    localInverse.invertSelf();

    let localTouchPoint = localInverse.transformPoint(
      new DOMPoint(movingMatrix.e, movingMatrix.f)
    );

    if (
      context.isPointInPath(
        obj_infos.path,
        localTouchPoint.x,
        localTouchPoint.y
      )
    ) {
      touchId = identifier;
      obj_infos.fillStyle = "orange";
      return true;
    }
    return false;
  }

  function touchEnd(identifier) {
    if (touchId === identifier) {
      obj_infos.fillStyle = "gray";
      touchId = undefined;
    }
  }

  function update() {
    if (needupdate) {
      matrix = new DOMMatrix();
      matrix.translateSelf(x, y);
      matrix.rotateSelf(alpha);
      matrix.scaleSelf(scale);
    }
  }

  function move(nx, ny) {
    x = nx;
    y = ny;
    needupdate = true;
  }

  function rotate(na) {
    alpha = na;
    needupdate = true;
  }

  function setScale(sc) {
    scale = sc;
    needupdate = true;
  }

  function draw(parent) {
    update();

    let local = DOMMatrix.fromMatrix(parent);
    local.multiplySelf(matrix);

    context.setTransform(local);
  }

  function get_spawnStart() {
    return spawn_start;
  }

  function getX() {
    return x;
  }
  function getY() {
    return y;
  }

  function getAlpha() {
    return alpha;
  }

  function getWidth() {
    return width;
  }

  function getHeight() {
    return height;
  }

  function setWidth(newWidth) {
    width = newWidth;
  }

  function setHeight(newHeight) {
    height = newHeight;
  }

  function set_spawnStart(spawn_cval) {
    spawn_start = spawn_cval;
  }

  function shoot(dir) {
    if (dir == "horizontal") {
      y -= 8;
    } else if (dir == "verticalMinus") {
      x -= 8;
    } else if (dir == "verticalPlus") {
      x += 8;
    }
  }

  function switchHorizontal() {
    horizontal = !horizontal;
  }

  function isHorizontal() {
    if (horizontal) {
      return true;
    } else {
      return false;
    }
  }

  function collision(otherObj) {
    let collisionDetected = true;
    var myLeft = x;
    var myRight = x + width;
    var myTop = y;
    var myBottom = y + height;

    var otherLeft = otherObj.getX();
    var otherRight = otherObj.getX() + otherObj.getWidth();
    var otherTop = otherObj.getY();
    var otherBottom = otherObj.getHeight();

    if (
      myBottom < otherTop ||
      myTop > otherBottom ||
      myRight < otherLeft ||
      myLeft > otherRight
    ) {
      collisionDetected = false;
    }

    return collisionDetected;
  }

  return {
    move: move,
    rotate: rotate,
    switchHorizontal,
    isHorizontal,
    isTouched,
    touchEnd,
    getMatrix,
    draw,
    append,
    setScale,
    obj_infos,
    getX,
    getY,
    collision,
    getWidth,
    getHeight,
    getAlpha,
    setWidth,
    setHeight,
    get_spawnStart,
    set_spawnStart,
    shoot,
  };
}

function rect_path(width, height) {
  let rectpath = new Path2D();

  rectpath.lineTo(-1, -1);
  rectpath.lineTo(1, -1);
  rectpath.lineTo(1, 1);
  rectpath.lineTo(-1, 1);
  rectpath.closePath();
  return rectpath;
}

export function rect(context, width, height, fillStyle) {
  let o = item(context, width, height);
  o.obj_infos.path = rect_path(width, height);
  let pre = o.draw;

  o.draw = function (parent) {
    pre(parent);

    context.fillStyle = fillStyle;
    context.fill(o.obj_infos.path);

    context.resetTransform();
  };
  return o;
}

export function lines(context, strokeStyle) {
  let o = item(context);

  let pre = o.draw;
  o.draw = function (parent) {
    pre(parent);
    for (
      let i = context.canvas.width / 5;
      i < context.canvas.width;
      i += context.canvas.width / 5
    ) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, context.canvas.width * 5);
      context.strokeStyle = strokeStyle;
      context.stroke();
      context.resetTransform();
    }
    context.closePath();
  };
  return o;
}

export function drawpercentage(context, percentage) {
  let o = item(context, 50, 50);

  let pre = o.draw;
  o.draw = function (parent) {
    pre(parent);
    context.fillStyle = "#fff";
    context.font = "20px Arial";
    context.lineWidth = 10;

    //Draw some text
    context.fillText(percentage + "%", 40, 65);

    //Draw a circle
    context.beginPath();

    //arcs start middle right of the circle so we tell it to start at Math.PI *0.5 which is the middle bottom
    var arcPercent = 0.5 + 2 * (percentage / 100);
    context.arc(60, 60, 50, 0.5 * Math.PI, arcPercent * Math.PI);
    context.stroke();
    context.resetTransform();
    context.lineWidth = 1;
    context.closePath();
  };
  return o;
}

export function circle(context, radius, fillStyle, text = "Circle") {
  let o = item(context, radius * 2, radius * 2);

  let pre = o.draw;
  o.draw = function (parent) {
    pre(parent);
    context.fillStyle = fillStyle;
    let endAngle = Math.PI * 2; // End point on circle
    context.beginPath();
    context.arc(0, 0, radius, 0, endAngle, true);
    context.fill();

    context.fillStyle = "#fff";
    context.fillText(text, -radius / 2 - 45, radius / 2);
  };
  return o;
}

export function getCanvas(id) {
  let canvas = document.getElementById(id);
  let context = canvas.getContext("2d");
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  return context;
}
