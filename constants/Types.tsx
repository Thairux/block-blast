import { Color } from "./Color";

export enum BoardBlockType {
  EMPTY,
  HOVERED,
  HOVERED_BREAK_FILLED,
  HOVERED_BREAK_EMPTY,
  FILLED,
}

export interface BoardBlock {
  blockType: BoardBlockType;
  color: Color;
  hoveredBreakColor: Color;
  hasGem?: boolean;
}

export type Board = BoardBlock[][];

export interface XYPoint {
  x: number;
  y: number;
}

export interface PieceData {
	matrix: number[][];
	distributionPoints: number;
	color: Color;
}
