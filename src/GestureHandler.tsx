import React, {FunctionComponent, useRef} from 'react';
import {PanResponder, View, ViewStyle} from 'react-native';

export enum Direction {
    LEFT = 'LEFT',
    UP = 'UP',
    RIGHT = 'RIGHT',
    DOWN = 'DOWN'
}

interface Props {
    containerStyle?: ViewStyle;
    move: (direction: Direction) => void;
}

const GestureHandler: FunctionComponent<Props> = ({containerStyle, move, children}) => {
    const panResponder = useRef(
        PanResponder.create({
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
        })
    ).current;

    return (
        <View {...panResponder.panHandlers} style={containerStyle}>
            {children}
        </View>
    );
};

export default GestureHandler;
