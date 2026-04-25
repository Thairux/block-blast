import { Color, colorToHex, lighten, darken } from "./Color";

export interface PieceData {
	matrix: number[][];
	distributionPoints: number;
	color: Color;
}

// same as piecedata but with no color
// this is because color is random each time
// so we will use this one to store piece shape and info
interface PieceDataSaved {
	matrix: number[][];
	distributionPoints: number
}

export const piecesData: PieceDataSaved[] = [
	// L-shape
	{
		matrix: [
			[1, 0, 0],
			[1, 1, 1],
		],
		distributionPoints: 2,

	},
	{
		matrix: [
			[1, 1],
			[1, 0],
			[1, 0],
		],
		distributionPoints: 2,

	},
	{
		matrix: [
			[1, 1, 1],
			[0, 0, 1],
		],
		distributionPoints: 2,

	},
	{
		matrix: [
			[0, 1],
			[0, 1],
			[1, 1],
		],
		distributionPoints: 2,

	},
	{
		matrix: [
			[0, 0, 1],
			[1, 1, 1],
		],
		distributionPoints: 2,

	},
	{
		matrix: [
			[1, 0],
			[1, 0],
			[1, 1],
		],
		distributionPoints: 2,

	},
	{
		matrix: [
			[1, 1, 1],
			[1, 0, 0],
		],
		distributionPoints: 2,

	},
	{
		matrix: [
			[1, 1],
			[0, 1],
			[0, 1],
		],
		distributionPoints: 2,

	},
	// Triangle shape
	{
		matrix: [
			[1, 1, 1],
			[0, 1, 0],
		],
		distributionPoints: 1.5,

	},
	{
		matrix: [
			[1, 0],
			[1, 1],
			[1, 0],
		],
		distributionPoints: 1.5,

	},
	{
		matrix: [
			[0, 1, 0],
			[1, 1, 1],
		],
		distributionPoints: 1.5,

	},
	{
		matrix: [
			[0, 1],
			[1, 1],
			[0, 1],
		],
		distributionPoints: 1.5,

	},
	// Z/S shape
	{
		matrix: [
			[0, 1, 1],
			[1, 1, 0],
		],
		distributionPoints: 1,

	},
	{
		matrix: [
			[1, 0],
			[1, 1],
			[0, 1],
		],
		distributionPoints: 1,

	},
	{
		matrix: [
			[1, 1, 0],
			[0, 1, 1],
		],
		distributionPoints: 1,

	},
	{
		matrix: [
			[0, 1],
			[1, 1],
			[1, 0],
		],
		distributionPoints: 1,

	},
	// 3x3
	{
		matrix: [
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1],
		],
		distributionPoints: 3,

	},
	// 2x2
	{
		matrix: [
			[1, 1],
			[1, 1],
		],
		distributionPoints: 6,

	},
	// 4x1
	{
		matrix: [
			[1],
			[1],
			[1],
			[1],
		],
		distributionPoints: 2,
	},
	// 1x4
	{
		matrix: [
			[1, 1, 1, 1],
		],
		distributionPoints: 2,
	},
	// 3x1
	{
		matrix: [
			[1],
			[1],
			[1],
		],
		distributionPoints: 4,
	},
	// 1x3
	{
		matrix: [
			[1, 1, 1],
		],
		distributionPoints: 4,
	},
	// 2x1
	{
		matrix: [
			[1],
			[1],
		],
		distributionPoints: 2,
	},
	// 1x2
	{
		matrix: [
			[1, 1],
		],
		distributionPoints: 2,
	},
];

export const pieceColors = [
	{ r: 227, g: 143, b: 16 },
	{ r: 186, g: 19, b: 38 },
	{ r: 16, g: 158, b: 40 },
	{ r: 20, g: 56, b: 184 },
	{ r: 101, g: 19, b: 148 },
	{ r: 31, g: 165, b: 222 }
]

export function getBlockCount(piece: PieceData): number {
	"worklet";
	let count = 0;
	for (let y = 0; y < piece.matrix.length; y++) {
		for (let x = 0; x < piece.matrix[0].length; x++) {
			if (piece.matrix[y][x] == 1)
				count++;
		}
	}
	return count;
}

const totalDistributionPoints = piecesData.reduce((sum, piece) => sum + piece.distributionPoints, 0);

export function getRandomPieceColor(): Color {
	return pieceColors[Math.floor(Math.random() * pieceColors.length)];
}

export function getRandomPieceColorWorklet(): Color {
	"worklet";
	return pieceColors[Math.floor(Math.random() * pieceColors.length)];
}

export function getRandomPiece(): PieceData {
	let position = Math.random() * totalDistributionPoints;
	let piece: PieceDataSaved;
	for (let i = 0; i < piecesData.length; i++) {
		position -= piecesData[i].distributionPoints;
		if (position < 0) {
			piece = piecesData[i];
			break;
		}
	}

	return {
		...piece!,
		color: getRandomPieceColor()
	};
}

export function getRandomPieceWorklet(): PieceData {
	"worklet";
	let position = Math.random() * totalDistributionPoints;
	let piece: PieceDataSaved;
	for (let i = 0; i < piecesData.length; i++) {
		position -= piecesData[i].distributionPoints;
		if (position < 0) {
			piece = piecesData[i];
			break;
		}
	}

	return {
		...piece!,
		color: getRandomPieceColorWorklet()
	};
}

export function getFittingPieceWorklet(board: any): PieceData {
	"worklet";
	// Shuffle pieces to try them in random order
	const shuffled = [...piecesData].sort(() => Math.random() - 0.5);
	const boardLength = board.length;

	for (const pieceTemplate of shuffled) {
		const pieceHeight = pieceTemplate.matrix.length;
		const pieceWidth = pieceTemplate.matrix[0].length;

		// Try random positions for this piece
		const positions = [];
		for (let y = 0; y <= boardLength - pieceHeight; y++) {
			for (let x = 0; x <= boardLength - pieceWidth; x++) {
				positions.push({ x, y });
			}
		}
		positions.sort(() => Math.random() - 0.5);

		for (const pos of positions) {
			let canFit = true;
			for (let py = 0; py < pieceHeight; py++) {
				for (let px = 0; px < pieceWidth; px++) {
					if (pieceTemplate.matrix[py][px] === 1 && board[pos.y + py][pos.x + px].blockType === 4) { // 4 is FILLED
						canFit = false;
						break;
					}
				}
				if (!canFit) break;
			}

			if (canFit) {
				return {
					...pieceTemplate,
					color: getRandomPieceColorWorklet()
				};
			}
		}
	}

	// Fallback to random if nothing fits (should not happen often)
	return getRandomPieceWorklet();
}

function getBorderColors(backgroundColor: Color) {
	"worklet";
	return {
		borderTopColor: colorToHex(lighten(backgroundColor, 0.5)),
		borderLeftColor: colorToHex(lighten(backgroundColor, 0.25)),
		borderRightColor: colorToHex(darken(backgroundColor, 0.25)),
		borderBottomColor: colorToHex(darken(backgroundColor, 0.5))
	};
}

export function createFilledBlockStyle(color: Color, borderWidth: number = 6): object {
	"worklet";
	return {
		backgroundColor: colorToHex(color),
		...getBorderColors(color),
		borderWidth: borderWidth,
		borderRadius: 4,
		boxSizing: 'border-box',
	}
}

export function createEmptyBlockStyle(): object {
	"worklet";
	const borderColor = 'rgba(255, 255, 255, 0.1)';
	return {
		backgroundColor: 'rgba(255, 255, 255, 0.05)',
		borderColor: borderColor,
		borderWidth: 1,
		borderRadius: 4,
		boxSizing: 'border-box',
	}
}
