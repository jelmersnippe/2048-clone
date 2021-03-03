import React, {FunctionComponent, useMemo} from 'react';
import {PanResponder, View, ViewStyle} from 'react-native';
import {CellData} from './grid/Cell/CellData';

export enum Direction {
    LEFT = 'LEFT',
    UP = 'UP',
    RIGHT = 'RIGHT',
    DOWN = 'DOWN'
}

interface Props {
    containerStyle?: ViewStyle;
    move: (direction: Direction) => void;
    field: Array<Array<CellData | null>>;
}

const GestureHandler: FunctionComponent<Props> = ({field, containerStyle, move, children}) => {
    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderRelease: (evt, gestureState) => {
            const deltaX: number = gestureState.dx;
            const deltaY: number = gestureState.dy;

            let direction: Direction;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                direction = Math.sign(deltaX) === 1 ? Direction.RIGHT : Direction.LEFT;
            } else {
                direction = Math.sign(deltaY) === 1 ? Direction.DOWN : Direction.UP;
            }

            move(direction);
        }
    }), [field]);

    return (
        <View {...panResponder.panHandlers} style={containerStyle}>
            {children}
        </View>
    );
};

export default GestureHandler;
