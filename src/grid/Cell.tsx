import {Animated, Text} from 'react-native';
import styles from './styles';
import React, {FunctionComponent, useEffect} from 'react';
import {TILE_SIZE} from '../App';

interface Props {
    value: number;
    location: Animated.ValueXY;
}

const Cell: FunctionComponent<Props> = ({value, location}) => {
    return (
        <Animated.View style={{
            ...styles.cell,
            backgroundColor: 'orange',
            width: TILE_SIZE,
            height: TILE_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            transform: [
                {translateX: location.x},
                {translateY: location.y}
            ]
        }}>
            <Text style={styles.cellText}>{value}</Text>
        </Animated.View>
    );
};

export default Cell;
