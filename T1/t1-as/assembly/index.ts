// The entry file of your WebAssembly module.


export function greedy_snake_move(snakeBody: i32[], food: i32[]): i32 {
  //蛇头坐标
  const hx = snakeBody[0];
  const hy = snakeBody[1];

  //身体坐标
  const b1x = snakeBody[2];
  const b1y = snakeBody[3];
  const b2x = snakeBody[4];
  const b2y = snakeBody[5];

  //果子坐标
  const foodX = food[0];
  const foodY = food[1];

  //当前移动方向的反方向
  const dx = hx - b1x;
  const dy = hy - b1y;
  let oppositeDir: i32 = -1;

  if (dx !== 0) {
    oppositeDir = dx === 1 ? 1 : 3; // 原方向右(3)→反左(1), 原左(1)→反右(3)
  } else {
    oppositeDir = dy === 1 ? 0 : 2; // 原方向下(2)→反上(0), 原上(0)→反下(2)
  }

  //排除反方向
  const candidates: i32[] = [];
  for (let dir: i32 = 0; dir < 4; dir++) {
    if (dir !== oppositeDir) candidates.push(dir);
  }

  //寻找最优方向
  let bestDir = -1;
  let minDist = i32.MAX_VALUE;

  for (let i = 0; i < candidates.length; i++) {
    const dir = candidates[i];
    let newHx = hx;
    let newHy = hy;

    //计算新头坐标
    switch (dir) {
      case 0: newHy++; break; // 上
      case 1: newHx--; break; // 左
      case 2: newHy--; break; // 下
      case 3: newHx++; break; // 右
    }

    //检测碰撞
    const collide = (newHx === b1x && newHy === b1y) ||
        (newHx === b2x && newHy === b2y) ||
        (newHx < 1 || newHx > 8 || newHy < 1 || newHy > 8);

    if (!collide) {
      const xd = (newHx - foodX) >= 0? (newHx - foodX) : (foodX - newHx);
      const yd = (newHy - foodY) >= 0? (newHy - foodY) : (foodY - newHy);
      // 计算距离
      const dist = xd + yd;
      if (dist < minDist || (dist === minDist && dir < bestDir)) {
        minDist = dist;
        bestDir = dir;
      }
    }
  }

  // 返回方向
  return bestDir !== -1 ? bestDir : candidates[0];
}
