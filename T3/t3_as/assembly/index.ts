// The entry file of your WebAssembly module.


export function greedy_snake_step(n: i32, snake_Body: i32[], snake_num: i32, other_snakes_Body: i32[], food_num: i32, foods: i32[], round: i32): i32 {
    const hx = snake_Body[0];
    const hy = snake_Body[1];

    const barriers = new Set<i32>();
    const all_possible_barriers = new Set<i32>();
    // 添加其他蛇障碍
    for (let i = 0; i < other_snakes_Body.length; i += 2) {
        if (i % 6 !== 0) {
            // 不是蛇尾巴
            barriers.add(other_snakes_Body[i] * 100 + other_snakes_Body[i + 1]);
            // 所有可能的障碍
            all_possible_barriers.add(other_snakes_Body[i] * 100 + other_snakes_Body[i + 1]);
        }
        if (i % 8 === 0) {
            // 蛇头
            all_possible_barriers.add((other_snakes_Body[i] - 1) * 100 + (other_snakes_Body[i + 1] - 1));
            all_possible_barriers.add((other_snakes_Body[i] - 1) * 100 + (other_snakes_Body[i + 1] + 1));
            all_possible_barriers.add((other_snakes_Body[i] + 1) * 100 + (other_snakes_Body[i + 1] - 1));
            all_possible_barriers.add((other_snakes_Body[i] + 1) * 100 + (other_snakes_Body[i + 1] + 1));
        }
    }

    //当前移动方向的反方向
    const dx = hx - snake_Body[2];
    const dy = hy - snake_Body[3];
    let oppositeDir: i32 = -1;

    if (dx !== 0) {
        oppositeDir = dx === 1 ? 1 : 3; // 原方向右(3)→反左(1), 原左(1)→反右(3)
    } else {
        oppositeDir = dy === 1 ? 2 : 0; // 原方向上(0)→反下(2), 原下(2)→反上(0)
    }


    const maxDirs = findDirs(oppositeDir, hx, hy, n, barriers, food_num, foods);
    const minDirs = findDirs(oppositeDir, hx, hy, n, all_possible_barriers, food_num, foods);
    if (minDirs !== -1) {
        return minDirs;
    } else {
        return maxDirs === -1? 0 : maxDirs;
    }
}




function findDirs(oppositeDir: i32, hx: i32, hy: i32, n: i32, barriers: Set<i32>, food_num: i32, foods: i32[]): i32 {
    const validDirs: i32[] = [];
    // 检查四个方向
    for (let dir = 0; dir < 4; dir++) {
        if (dir === oppositeDir) continue;
        let newHx = hx, newHy = hy;
        switch (dir) {
            case 0:
                newHy++;
                break;
            case 1:
                newHx--;
                break;
            case 2:
                newHy--;
                break;
            case 3:
                newHx++;
                break;
        }
        if (newHx < 1 || newHx > n || newHy < 1 || newHy > n) continue;
        if (!barriers.has(newHx * 100 + newHy)) validDirs.push(dir);
    }

    if (validDirs.length === 0) return -1;

    // 寻找最优方向
    let bestDir = validDirs[0];
    let minDist = 999;
    for (let i = 0; i < validDirs.length; i++) {
        const dir = validDirs[i];
        let newHx = hx, newHy = hy;
        switch (dir) {
            case 0:
                newHy++;
                break;
            case 1:
                newHx--;
                break;
            case 2:
                newHy--;
                break;
            case 3:
                newHx++;
                break;
        }
        for (let i = 0; i < food_num; i++) {

            const xd = (newHx - foods[i * 2]) >= 0 ? (newHx - foods[i * 2]) : (foods[i * 2] - newHx);
            const yd = (newHy - foods[i * 2 + 1]) >= 0 ? (newHy - foods[i * 2 + 1]) : (foods[i * 2 + 1] - newHy);
            // 计算距离
            const dist = xd + yd;
            if (dist <= minDist) {
                minDist = dist;
                bestDir = dir;
            }
        }
    }
    return bestDir;
}
