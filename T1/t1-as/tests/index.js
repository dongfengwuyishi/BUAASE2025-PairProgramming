import assert from "assert";
import { greedy_snake_move } from "../build/debug.js";



function checker (snake, food) {
    let now_snake = [
        snake[0], snake[1], snake[2], snake[3], snake[4], snake[5], snake[6], snake[7]
    ];
    let turn = 1;
    while (true) {
        let result = greedy_snake_move(now_snake, food);
        let new_snake = [
            now_snake[0] + (result == 3) - (result == 1),
            now_snake[1] + (result == 0) - (result == 2),
            now_snake[0],
            now_snake[1],
            now_snake[2],
            now_snake[3],
            now_snake[4],
            now_snake[5],
        ];
        if (new_snake[0] < 1 || new_snake[0] > 8 || new_snake[1] < 1 || new_snake[1] > 8) {
            return -1;
        }
        if (new_snake[0] == new_snake[2] && new_snake[1] == new_snake[3]) {
            return -2;
        }
        if (new_snake[0] == new_snake[4] && new_snake[1] == new_snake[5]) {
            return -2;
        }
        if (new_snake[0] == new_snake[6] && new_snake[1] == new_snake[7]) {
            return -2;
        }
        if (new_snake[0] == food[0] && new_snake[1] == food[1]) {
            console.log("Total turn: " + turn);
            return turn;
        }
        now_snake = [
            new_snake[0], new_snake[1], new_snake[2], new_snake[3], new_snake[4], new_snake[5], new_snake[6], new_snake[7]
        ];
        if (turn > 200) {
            return -3;
        }
        turn += 1;
    }
}


//用例1：蛇头上方有长身体，苹果在正下方（测试垂直路径选择）
assert.strictEqual(checker([4,4,4,5,4,6,4,7], [4,3], greedy_snake_move) >= 0, true);

//用例2：蛇头贴左墙，苹果在右侧（测试边界处理）
assert.strictEqual(checker([1,4,2,4,3,4,4,4], [8,4], greedy_snake_move) >= 0, true);

//用例3：蛇体形成环形（测试路径绕行）
assert.strictEqual(checker([3,3,3,4,4,4,4,3], [5,5], greedy_snake_move) >= 0, true);

//用例4：蛇头贴底边，苹果在上方（测试转向选择）
assert.strictEqual(checker([5,1,5,2,5,3,5,4], [5,8], greedy_snake_move) >= 0, true);

console.log("we passed our tests.");
