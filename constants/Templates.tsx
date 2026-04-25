import { Board, BoardBlockType } from "./Types";
import { getRandomPieceColor } from "./Piece";

export interface Template {
    id: string;
    size: number;
    blocks: { x: number, y: number }[];
}

export const templates: Template[] = [
    {
        id: 'checkerboard',
        size: 8,
        blocks: Array.from({ length: 32 }, (_, i) => {
            const x = i % 8;
            const y = Math.floor(i / 4) % 8;
            return (x + y) % 2 === 0 ? { x, y } : null;
        }).filter(b => b !== null) as { x: number, y: number }[]
    },
    {
        id: 'vortex',
        size: 8,
        blocks: [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
            { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 },
            { x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 7 }, { x: 1, y: 7 }, { x: 0, y: 7 },
            { x: 0, y: 6 }, { x: 0, y: 5 }, { x: 0, y: 4 }, { x: 0, y: 3 }, { x: 0, y: 2 }, { x: 0, y: 1 },
            { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
            { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 },
            { x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 },
            { x: 2, y: 4 }, { x: 2, y: 3 }
        ]
    },
    {
        id: 'scatter_50',
        size: 8,
        blocks: Array.from({ length: 64 }, (_, i) => {
            const x = i % 8;
            const y = Math.floor(i / 8);
            return Math.random() > 0.5 ? { x, y } : null;
        }).filter(b => b !== null) as { x: number, y: number }[]
    },
    {
        id: 'towers',
        size: 8,
        blocks: [
            {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3},
            {x: 2, y: 4}, {x: 2, y: 5}, {x: 2, y: 6}, {x: 2, y: 7},
            {x: 4, y: 0}, {x: 4, y: 1}, {x: 4, y: 2}, {x: 4, y: 3},
            {x: 6, y: 4}, {x: 6, y: 5}, {x: 6, y: 6}, {x: 6, y: 7},
            {x: 1, y: 3}, {x: 3, y: 4}, {x: 5, y: 3}, {x: 7, y: 4}
        ]
    }
];

export function applyTemplate(board: Board, template: Template) {
    "worklet";
    for (const block of template.blocks) {
        if (block.x < board.length && block.y < board.length) {
            board[block.y][block.x].blockType = BoardBlockType.FILLED;
            board[block.y][block.x].color = getRandomPieceColor();
        }
    }
}

export function getRandomTemplate(size: number): Template | null {
    const possible = templates.filter(t => t.size === size);
    if (possible.length === 0) return null;
    
    // Dynamically generate a random 50% scatter if needed
    if (Math.random() > 0.7) {
        return {
            id: 'random_scatter',
            size: size,
            blocks: Array.from({ length: size * size }, (_, i) => {
                const x = i % size;
                const y = Math.floor(i / size);
                return Math.random() > 0.5 ? { x, y } : null;
            }).filter(b => b !== null) as { x: number, y: number }[]
        };
    }

    return possible[Math.floor(Math.random() * possible.length)];
}
