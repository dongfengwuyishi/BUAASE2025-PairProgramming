// The entry file of your WebAssembly module.

export function greedySnakeMoveBarriers(snakeBody: i32[], food: i32[], barriers: i32[]): i32 {
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


  // 构建障碍物集合
  const barrierSet = new Set<i32>();
  for (let i = 0; i < 24; i += 2) {
    barrierSet.add(barriers[i] * 10 + barriers[i + 1]);
  }

  // 可达性检查（BFS）
  if (!isReachable(hx, hy, foodX, foodY, barrierSet)) {
    return -1;
  }

  //当前移动方向的反方向
  const dx = hx - b1x;
  const dy = hy - b1y;
  let oppositeDir: i32 = -1;
  let currentDir: i32 = -1;

  if (dx !== 0) {
    oppositeDir = dx === 1 ? 1 : 3; // 原方向右(3)→反左(1), 原左(1)→反右(3)
    currentDir = dx === 1? 3 : 1; // 原方向右(3)→当前右(3), 原左(1)→当前左(1)
  } else {
    oppositeDir = dy === 1 ? 2 : 0; // 原方向上(0)→反下(2), 原下(2)→反上(0)
    currentDir = dy === 1? 0 : 2; // 原方向上(0)→当前上(0), 原下(2)→当前下(2)
  }

  //排除反方向
  const candidates: i32[] = [];
  for (let dir: i32 = 0; dir < 4; dir++) {
    if (dir !== oppositeDir) candidates.push(dir);
  }

  // 评估有效移动方向
  const validDirs: i32[] = [];
  for (let i = 0; i < candidates.length; i++) {
    const dir = candidates[i];
    let newHx = hx;
    let newHy = hy;

    // 计算新坐标
    switch (dir) {
      case 0: newHy++; break; // 上
      case 1: newHx--; break; // 左
      case 2: newHy--; break; // 下
      case 3: newHx++; break; // 右
    }

    // 边界检查
    if (newHx < 1 || newHx > 8 || newHy < 1 || newHy > 8) continue;

    // 障碍物检查
    if (barrierSet.has(newHx * 10 + newHy)) continue;

    // 身体碰撞检查
    if ((newHx == b1x && newHy == b1y) || (newHx == b2x && newHy == b2y) || (newHx == hx && newHy == hy)) continue;

    validDirs.push(dir);
  }

  // 无有效方向时返回-1
  if (validDirs.length == 0) return -1;

  //寻找最优方向
  let bestDir = -1;
  let minDist = i32.MAX_VALUE;
  const bestDirs = new Set<i32>();


  for (let i = 0; i < validDirs.length; i++) {
    const dir = validDirs[i];
    let newHx = hx;
    let newHy = hy;

    //计算新头坐标
    switch (dir) {
      case 0: newHy++; break; // 上
      case 1: newHx--; break; // 左
      case 2: newHy--; break; // 下
      case 3: newHx++; break; // 右
    }

    const xd = (newHx - foodX) >= 0? (newHx - foodX) : (foodX - newHx);
    const yd = (newHy - foodY) >= 0? (newHy - foodY) : (foodY - newHy);
    // 计算距离
    const dist = xd + yd;
    if (dist <= minDist) {
      minDist = dist;
      bestDir = dir;
      bestDirs.add(bestDir);
    }
  }

  //优先选择直行
  if (bestDirs.has(currentDir)) {
    return currentDir;
  }

  return bestDir;
}


// BFS 可达性检查
function isReachable(startX: i32, startY: i32, targetX: i32, targetY: i32, barriers: Set<i32>): bool {
  const visited = new Set<i32>();
  const queue: i32[] = [];
  queue.push(startX * 10 + startY);
  visited.add(startX * 10 + startY);

  const dirs = [[0, 1], [-1, 0], [0, -1], [1, 0]]; // 上、左、下、右

  while (queue.length > 0) {
    const coord = queue.shift() as i32;
    const x = coord / 10;
    const y = coord % 10;

    if (x == targetX && y == targetY) return true;

    for (let i = 0; i < 4; i++) {
      const nx = x + dirs[i][0];
      const ny = y + dirs[i][1];
      const key = nx * 10 + ny;

      if (nx >= 1 && nx <= 8 && ny >= 1 && ny <= 8 &&
          !barriers.has(key) && !visited.has(key)) {
        visited.add(key);
        queue.push(key);
      }
    }
  }

  return false;
}
