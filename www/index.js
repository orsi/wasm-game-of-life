import { Universe, Cell } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

const CELL_SIZE = 5; // px
const GRID_COLOUR = '#CCCCCC';
const DEAD_COLOUR = '#FFFFFF';
const ALIVE_COLOUR = '#000000';
const universe = Universe.new();
const width = universe.width();
const height = universe.height();


const canvas = document.querySelector('#game-of-life-canvas');
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const renderLoop = () => {
    universe.tick();
    
    drawGrid();
    drawCells();

    requestAnimationFrame(renderLoop);
};

const getIndex = (row, column) => {
    return row * width + column;
};

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOUR;

    // vertical lines
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // horizontal lines
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {
            const index = getIndex(row, column);

            ctx.fillStyle = cells[index] === Cell.Dead
                ? DEAD_COLOUR
                : ALIVE_COLOUR;

            ctx.fillRect(
                column * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);