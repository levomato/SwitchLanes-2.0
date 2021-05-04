export function everyinterval(n, frameNo) {
  if ((frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}
