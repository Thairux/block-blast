import { PieceData, Board, BoardBlockType } from "./Types";
import { getRandomPieceWorklet, getFittingPieceWorklet, piecesData, getRandomPiece } from "./Piece";
import { GameModeType } from "@/hooks/useAppState";
import { deepCopyBoard, placePieceOntoBoard, breakLines } from "./Board";

export type Hand = (PieceData | null)[]

export function createRandomHand(size: number): Hand {
	const hand = new Array<PieceData | null>(size);
	for (let i = 0; i < size; i++) {
		hand[i] = getRandomPiece();
	}
	return hand;
}

/**
 * Advanced Simulation Engine for Aether
 */

function canFit(board: Board, piece: PieceData, x: number, y: number): boolean {
    "worklet";
    const pieceHeight = piece.matrix.length;
    const pieceWidth = piece.matrix[0].length;
    if (y + pieceHeight > board.length || x + pieceWidth > board[0].length) return false;

    for (let py = 0; py < pieceHeight; py++) {
        for (let px = 0; px < pieceWidth; px++) {
            if (piece.matrix[py][px] === 1 && board[y + py][x + px].blockType === BoardBlockType.FILLED) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Exhaustive recursive search to see if a sequence of pieces can be played.
 */
function solveSequence(board: Board, pieces: PieceData[]): boolean {
    "worklet";
    if (pieces.length === 0) return true;

    const piece = pieces[0];
    const remaining = pieces.slice(1);
    const boardLength = board.length;
    const pieceHeight = piece.matrix.length;
    const pieceWidth = piece.matrix[0].length;

    for (let y = 0; y <= boardLength - pieceHeight; y++) {
        for (let x = 0; x <= boardLength - pieceWidth; x++) {
            if (canFit(board, piece, x, y)) {
                const nextBoard = deepCopyBoard(board);
                placePieceOntoBoard(nextBoard, piece, x, y, BoardBlockType.FILLED);
                breakLines(nextBoard);
                
                if (solveSequence(nextBoard, remaining)) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 * Checks if at least ONE permutation of the hand is playable.
 * Good for Classic mode to ensure fairness.
 */
function isHandPlayable(board: Board, hand: PieceData[]): boolean {
    "worklet";
    // 3! = 6 permutations
    const perms = [
        [hand[0], hand[1], hand[2]],
        [hand[0], hand[2], hand[1]],
        [hand[1], hand[0], hand[2]],
        [hand[1], hand[2], hand[0]],
        [hand[2], hand[0], hand[1]],
        [hand[2], hand[1], hand[0]]
    ];

    for (const p of perms) {
        if (solveSequence(board, p)) return true;
    }
    return false;
}

/**
 * Checks if EVERY permutation of the hand is playable.
 * Necessary for Infinite mode "Indestructible" guarantee.
 */
function isHandIndestructible(board: Board, hand: PieceData[]): boolean {
    "worklet";
    const perms = [
        [hand[0], hand[1], hand[2]],
        [hand[0], hand[2], hand[1]],
        [hand[1], hand[0], hand[2]],
        [hand[1], hand[2], hand[0]],
        [hand[2], hand[0], hand[1]],
        [hand[2], hand[1], hand[0]]
    ];

    for (const p of perms) {
        if (!solveSequence(board, p)) return false;
    }
    return true;
}

function getBoardDensity(board: Board): number {
    "worklet";
    let filled = 0;
    const total = board.length * board.length;
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board.length; x++) {
            if (board[y][x].blockType === BoardBlockType.FILLED) filled++;
        }
    }
    return filled / total;
}

function getRandomPieceColorWorklet() {
    "worklet";
    const pieceColors = [
        { r: 227, g: 143, b: 16 },
        { r: 186, g: 19, b: 38 },
        { r: 16, g: 158, b: 40 },
        { r: 20, g: 56, b: 184 },
        { r: 101, g: 19, b: 148 },
        { r: 31, g: 165, b: 222 }
    ];
    return pieceColors[Math.floor(Math.random() * pieceColors.length)];
}

export function createHandWorklet(size: number, mode: GameModeType, board?: Board): Hand {
	"worklet";
	const hand = new Array<PieceData | null>(size);
	
    if (board) {
        const density = getBoardDensity(board);
        let attempts = 0;
        
        while (attempts < 40) {
            const candidateHand: PieceData[] = [];
            for (let i = 0; i < size; i++) {
                // Adaptive scaling: smaller pieces as board gets crowded
                if (density > 0.5 && Math.random() > (mode === GameModeType.Infinite ? 0.2 : 0.5)) {
                    const smallPieces = piecesData.filter(p => {
                        let count = 0;
                        for(let row of p.matrix) for(let cell of row) if(cell === 1) count++;
                        return count <= 3;
                    });
                    const p = smallPieces[Math.floor(Math.random() * smallPieces.length)];
                    candidateHand.push({ ...p, color: getRandomPieceColorWorklet() });
                } else {
                    candidateHand.push(getRandomPieceWorklet());
                }
            }

            if (mode === GameModeType.Infinite) {
                if (isHandIndestructible(board, candidateHand)) {
                    for (let i = 0; i < size; i++) hand[i] = candidateHand[i];
                    return hand;
                }
            } else {
                // For Classic/Puzzle, just ensure it's playable in AT LEAST one order
                if (isHandPlayable(board, candidateHand)) {
                    for (let i = 0; i < size; i++) hand[i] = candidateHand[i];
                    return hand;
                }
            }
            attempts++;
        }
        
        // Final fallback: Guaranteed fit
        for (let i = 0; i < size; i++) {
            hand[i] = getFittingPieceWorklet(board);
        }
    } else {
        for (let i = 0; i < size; i++) {
            hand[i] = getRandomPieceWorklet();
        }
    }
	return hand;
}

export function createRandomHandWorklet(size: number): Hand {
	"worklet";
	const hand = new Array<PieceData | null>(size);
	for (let i = 0; i < size; i++) {
		hand[i] = getRandomPieceWorklet();
	}
	return hand;
}