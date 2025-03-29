import assert from "assert";
import { greedySnakeMoveBarriers } from "../build/release.js";


function checker(initial_snake, food_num, foods, barriers, access) {
    if (initial_snake.length !== 8) throw "Invalid snake length";

    let current_snake = [...initial_snake];
    let current_foods = [...foods];
    const barriers_list = [];
    for (let i = 0; i < barriers.length; i += 2) {
        const x = barriers[i];
        const y = barriers[i + 1];
        if (x !== -1 && y !== -1) {
            barriers_list.push({ x, y });
        }
    }
    let turn = 1;

    while (turn <= 200) {
        const direction = greedySnakeMoveBarriers(current_snake, current_foods, barriers);

        if (access === 0) {
            if (direction !== -1) {
                return -5;
            } else {
                return 1;
            }
        }

        // invalid direction
        if (direction < 0 || direction > 3) return -4;

        let new_snake = [
            current_snake[0] + (direction == 3) - (direction == 1),
            current_snake[1] + (direction == 0) - (direction == 2),
            current_snake[0],
            current_snake[1],
            current_snake[2],
            current_snake[3],
            current_snake[4],
            current_snake[5],
        ];


        // out of range
        if (new_snake[0] < 1 || new_snake[0] > 8 || new_snake[1] < 1 || new_snake[1] > 8) return -1;

        // hit a barrier
        if (barriers_list.some(ob => ob.x === new_snake[0] && ob.y === new_snake[1])) return -2;

        // eat food
        let ate_index = -1;
        for (let i = 0; i < current_foods.length; i += 2) {
            if (new_snake[0] === current_foods[i] && new_snake[1] === current_foods[i + 1]) {
                ate_index = i;
                break;
            }
        }

        // console.log("turn " + turn + " :" + direction);
        if (ate_index !== -1) {
            current_foods.splice(ate_index, 2);
            food_num -= 1;
        }

        if (food_num === 0) {
            console.log("Total turn: " + turn);
            return turn;
        }

        current_snake = new_snake;
        turn++;
    }

    // timeout
    return -3;
}

// 测试用例1：完全被障碍物包围
assert.strictEqual(
    checker(
        [4,4,4,3,4,2,4,1],
        1,
        [8,8],
        [3,1,3,2,3,3,3,4,3,5,4,5,4,6,5,5,5,4,5,3,5,2,5,1],
        0
    ) > 0,
    true
);


// 测试用例2：死亡回环
assert.strictEqual(
    checker(
        [4,4,5,4,5,5,4,5],
        1,
        [1,8],
        [3,3,3,4,3,5,3,6,6,3,6,4,6,5,6,6,5,3,4,3,5,6,4,6],
        0
    ),
    1
);



// 测试用例3：动态避障路径（短期绕行）
assert.strictEqual(
    checker(
        [2,5,3,5,4,5,5,5],
        1,
        [2,4],
        [3,4,4,4,5,4,3,6,4,6,5,6,6,4,6,5,6,6,7,4,7,5,7,6],
        1
    ) > 0,
    true
);



// 测试用例4：边界障碍规避
assert.strictEqual(
    checker(
        [8,5,7,5,6,5,5,5],
        1,
        [4,6],
        [8,6,7,6,6,6,5,6,8,3,7,3,6,3,5,3,8,2,7,2,6,2,5,2],
        1
    ) > 0,
    true
);


console.log("we passed our tests.");
