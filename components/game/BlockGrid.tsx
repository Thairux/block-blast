import {
	Board,
	BoardBlockType,
	forEachBoardBlock,
	GRID_BLOCK_SIZE,
	HITBOX_SIZE,
	PossibleBoardSpots,
} from "@/constants/Board";
import { colorToHex } from "@/constants/Color";
import { Hand } from "@/constants/Hand";
import {
	createEmptyBlockStyle,
	createFilledBlockStyle,
} from "@/constants/Piece";
import { useDroppable } from "@mgcrea/react-native-dnd";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
	SharedValue,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withTiming,
} from "react-native-reanimated";

interface BlockGridProps {
	board: SharedValue<Board>;
	possibleBoardDropSpots: SharedValue<PossibleBoardSpots>;
	hand: SharedValue<Hand>
	draggingPiece: SharedValue<number | null>
}

function BlockCell({ x, y, board, possibleBoardDropSpots }: { x: number, y: number, board: SharedValue<Board>, possibleBoardDropSpots: SharedValue<PossibleBoardSpots> }) {
    const boardSize = board.value.length;
    const loadBlockFlash = useSharedValue(0);
    const placedBlockFall = useSharedValue(0);
    const placedBlockDirectionX = useSharedValue(0);
    const placedBlockDirectionY = useSharedValue(0);
    const placedBlockRotation = useSharedValue(0);

    useAnimatedReaction(() => {
        return board.value[y][x].blockType
    }, (cur, prev) => {
        if (cur == BoardBlockType.EMPTY && (prev == BoardBlockType.FILLED || prev == BoardBlockType.HOVERED_BREAK_EMPTY || prev == BoardBlockType.HOVERED_BREAK_FILLED)) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 200;
            const rotation = (Math.random() - 0.5) * Math.PI * 2;
            
            placedBlockDirectionX.value = Math.cos(angle) * distance;
            placedBlockDirectionY.value = Math.sin(angle) * distance;
            placedBlockRotation.value = rotation;
            
            placedBlockFall.value = withTiming(1, { 
                duration: 500 
            }, (finished) => {
                'worklet';
                if (finished) {
                    placedBlockFall.value = 0;
                }
            });
        }
    });

    useEffect(() => {
        if (board.value[y][x].blockType != BoardBlockType.EMPTY) 
            return;
        const step = 70;
        const upwardDelay = (boardSize - 1 - y) * step;
        const downwardDelay = 2 * y * step;
        
        loadBlockFlash.value = withDelay(
            upwardDelay,
            withSequence(
                withTiming(1, { duration: step }),
                withDelay(downwardDelay, withTiming(0, { duration: step }))
            )
		);
    }, [board.value[y][x].blockType]);

    const animatedStyle = useAnimatedStyle(() => {
        const block = board.value[y][x];
        
        if (placedBlockFall.value > 0) {
            let progress = placedBlockFall.value;
			progress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);// easeOutCirc
            return {
                ...createFilledBlockStyle(block.color),
                opacity: 1 - progress,
                transform: [
                    { scale: 1 - progress },
                    { 
                        translateX: placedBlockDirectionX.value * progress 
                    },
                    { 
                        translateY: placedBlockDirectionY.value * progress 
                    },
                    { 
                        rotate: `${placedBlockRotation.value * progress}rad` 
                    }
                ]
            }
        }

        if (block.blockType == BoardBlockType.FILLED || block.blockType == BoardBlockType.HOVERED) {
            return {
                ...createFilledBlockStyle(block.color),
                opacity: block.blockType == BoardBlockType.HOVERED ? 0.3 : 1,
            };
        } else if (block.blockType == BoardBlockType.HOVERED_BREAK_EMPTY || block.blockType == BoardBlockType.HOVERED_BREAK_FILLED) {
            const blockColor =
                block.blockType == BoardBlockType.HOVERED_BREAK_EMPTY
                    ? block.color
                    : block.hoveredBreakColor;
            return {
                ...createFilledBlockStyle(blockColor),
            };
        }

        return {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            transform: []
        };
    });

    const blockPositionStyle = {
        position: "absolute",
        top: y * GRID_BLOCK_SIZE,
        left: x * GRID_BLOCK_SIZE,
    };
    
    return (
        <Animated.View style={[styles.emptyBlock, blockPositionStyle as any, animatedStyle]}>
            {board.value[y][x].hasGem && (
                <Text style={{fontSize: 20, textAlign: 'center', lineHeight: GRID_BLOCK_SIZE}}>💎</Text>
            )}
            <BlockDroppable
                x={x}
                y={y}
                style={styles.hitbox}
                possibleBoardDropSpots={possibleBoardDropSpots}
            />
        </Animated.View>
    );
}

export default function BlockGrid({
	board,
	possibleBoardDropSpots,
	draggingPiece,
	hand
}: BlockGridProps) {
	const blockElements: any[] = [];
	forEachBoardBlock(board.value, (_block, x, y) => {
		blockElements.push(
			<BlockCell
				key={`av${x},${y}`}
                x={x}
                y={y}
                board={board}
                possibleBoardDropSpots={possibleBoardDropSpots}
			/>
		);
	});
	
	const gridStyle = useAnimatedStyle(() => {
		let style: any;
		if (draggingPiece.value == null) {
			style = {
				borderColor: 'white'
			}
		} else {
			style = {
				borderColor: colorToHex(hand.value[draggingPiece.value!]!.color)
			}
		}
		return style;
	});
	
	return (
		<Animated.View
			style={[
				styles.grid,
				{
					width: GRID_BLOCK_SIZE * board.value.length + 6,
					height: GRID_BLOCK_SIZE * board.value.length + 6,
				},
				gridStyle
			]}
		>
			{blockElements}
		</Animated.View>
	);
}

interface BlockDroppableProps {
	children?: any;
	x: number;
	y: number;
	style: any;
	possibleBoardDropSpots: SharedValue<PossibleBoardSpots>;
}

function BlockDroppable({
	children,
	x,
	y,
	style,
	possibleBoardDropSpots,
	...otherProps
}: BlockDroppableProps) {
	const id = `${x},${y}`;
	const { props, activeId } = useDroppable({
		id,
	});

	const updateLayout = () => {
		setTimeout(() => {
			(props.onLayout as any)(null);
		}, 1000 / 60);
	};

	const animatedStyle = useAnimatedStyle(() => {
		runOnJS(updateLayout)();
		const active = possibleBoardDropSpots.value[y][x] == 1;
		if (active) {
			return {
				width: HITBOX_SIZE,
				height: HITBOX_SIZE,
			};
		} else {
			return {
				width: 0,
				height: 0,
			};
		}
	}, [props, possibleBoardDropSpots]);

	return (
		<Animated.View {...props} style={[style, animatedStyle]} {...otherProps}>
			{children}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	emptyBlock: {
		width: GRID_BLOCK_SIZE,
		height: GRID_BLOCK_SIZE,
		margin: 0,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.2)', // Stable grid line color
		borderRadius: 0,
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
	},
	grid: {
		position: "relative",
		backgroundColor: "rgb(0, 0, 0, 1)",
		borderWidth: 3,
		borderRadius: 5,
		borderColor: "rgb(255, 255, 255)",
		opacity: 1,
	},
	hitbox: {
		width: HITBOX_SIZE,
		height: HITBOX_SIZE,
	},
});
