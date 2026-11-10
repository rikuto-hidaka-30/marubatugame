// ゲームの状態
const CONTINUE = null; // まだ決着がついていない
const WIN_PLAYER_1 = 1; // 〇の勝ち
const WIN_PLAYER_2 = -1; // ✕の勝ち
const DRAW_GAME = 0; // 引き分け

const cells = [ // 空なら0、〇なら1、✕なら-1
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
]
let turn = 1;  // 〇の番なら1、✕の番なら-1
let result = CONTINUE;
let mode = "hard";
let gameStarted = false;

const startButton = document.querySelector("#start-button");
const modeStartButton = document.querySelector("#mode-start-button");
const replayButton = document.querySelector("#replay-button");
const endButton = document.querySelector("#end-button");
const intro = document.querySelector("#intro");
const modeSelect = document.querySelector("#mode-select");
const resultSelect = document.querySelector("#result-select");

startButton.addEventListener("click", () => {
    intro.classList.add("hidden");
    modeSelect.classList.remove("hidden");
});

modeStartButton.addEventListener("click", () => {
    const selectedMode = document.querySelector("input[name='mode']:checked");
    mode = selectedMode.value;
    document.querySelector("#back").classList = mode;
    modeSelect.classList.add("hidden");
    resetBoard();
    gameStarted = true;
});

replayButton.addEventListener("click", () => {
    resultSelect.classList.add("hidden");
    modeSelect.classList.remove("hidden");
    resetBoard();
    gameStarted = false;
});

endButton.addEventListener("click", () => {
    resultSelect.classList.add("hidden");
    modeSelect.classList.add("hidden");
    intro.classList.remove("hidden");
    resetBoard();
    gameStarted = false;
});

// セルをクリックしたときのイベントを登録
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
        const cell = document.querySelector(`#cell_${row}_${col}`);
        cell.addEventListener("click", () => {
            if (!gameStarted || result !== CONTINUE) {
                return;
            }
            if (cells[row][col] === 0) { // 置けるかどうかの判定
                putMark(row, col); // ○か×を置く
                turn = turn * -1;
                thinkAI(); // AIに考えてもらう
                turn = turn * -1;
                check(); // ゲームの状態を確認
            }
        });
    }
}

// ○か×を置く
function putMark(row, col) {
    const cell = document.querySelector(`#cell_${row}_${col}`);
    if (turn === 1) {
        cell.textContent = "〇";
        cell.classList.add("o");
        cells[row][col] = 1;
    } else {
        cell.textContent = "✕";
        cell.classList.add("x");
        cells[row][col] = -1;
    }
}

function resetBoard() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            cells[row][col] = 0;
            const cell = document.querySelector(`#cell_${row}_${col}`);
            cell.textContent = "";
            cell.classList.remove("o", "x");
        }
    }
    turn = 1;
    result = CONTINUE;
    document.querySelector("#message").textContent = "";
}

// ゲームの状態を確認
function check() {
    result = judge(cells);
    const message = document.querySelector("#message");
    switch (result) {
        case WIN_PLAYER_1:
            message.textContent = "あなたの勝ち!";
            break;
        case WIN_PLAYER_2:
            message.textContent = "AIの勝ち!";
            break;
        case DRAW_GAME:
            message.textContent = "引き分け!";
            break;
        default:
            message.textContent = "";
            break;
    }

    if (result !== CONTINUE) {
        resultSelect.classList.remove("hidden");
    }
}

// 勝敗を判定する処理
function judge(_cells) {
    // 調べる必要があるラインをリストアップ
    const lines = [
        // 横をチェック
        [_cells[0][0], _cells[0][1], _cells[0][2]],
        [_cells[1][0], _cells[1][1], _cells[1][2]],
        [_cells[2][0], _cells[2][1], _cells[2][2]],
        // 縦をチェック
        [_cells[0][0], _cells[1][0], _cells[2][0]],
        [_cells[0][1], _cells[1][1], _cells[2][1]],
        [_cells[0][2], _cells[1][2], _cells[2][2]],
        // 斜めをチェック
        [_cells[0][0], _cells[1][1], _cells[2][2]],
        [_cells[0][2], _cells[1][1], _cells[2][0]],
    ];
    // 勝ち負けチェック
    for (let line of lines) {
        const sum = line[0] + line[1] + line[2];
        if (sum === 3) {
            return WIN_PLAYER_1;
        }
        if (sum === -3) {
            return WIN_PLAYER_2;
        }
    }
    // 継続チェック
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (_cells[row][col] === 0) {
                return CONTINUE;
            }
        }
    }
    return DRAW_GAME;
}

// AIに考えてもらう
function thinkAI() {
    const hand = think(cells, -1, 9, mode === "easy");
    if (hand) {
        const cell = document.querySelector(`#cell_${hand[0]}_${hand[1]}`);
        cell.textContent = "✕";
        cell.classList.add("x");
        cells[hand[0]][hand[1]] = -1;
    }
}
