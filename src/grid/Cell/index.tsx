import {Animated, Text} from 'react-native';
import React, {FunctionComponent} from 'react';
import styles from './styles';

interface Props {
    value: number;
    location: Animated.ValueXY;
}

const Cell: FunctionComponent<Props> = ({value, location}) => {
    return (
        <Animated.View style={{
            ...styles.cell,
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
